import { readFile, readdir, lstat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const assetDir = "packages/ui/src/assets";
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const brandNames = {
  logo: "BREERO-logo-transparent.png",
  favicon: "favicon.ico",
  favicon16: "favicon-16x16.png",
  favicon32: "favicon-32x32.png",
};

/** Header inspection only: supplied image bytes are never re-encoded. */
export function inspectImage(bytes, extension) {
  if (extension === ".png") {
    if (
      bytes.length < 24 ||
      !bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
      bytes.toString("ascii", 12, 16) !== "IHDR"
    )
      throw Error("Invalid PNG header.");
    return `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`;
  }
  if (extension === ".ico") {
    if (
      bytes.length < 6 ||
      bytes.readUInt16LE(0) !== 0 ||
      bytes.readUInt16LE(2) !== 1
    )
      throw Error("Invalid ICO header.");
    const count = bytes.readUInt16LE(4);
    if (!count || bytes.length < 6 + count * 16)
      throw Error("Invalid ICO directory.");
    const sizes = [];
    for (let i = 0; i < count; i++) {
      const offset = 6 + i * 16;
      if (
        bytes.readUInt32LE(offset + 12) + bytes.readUInt32LE(offset + 8) >
        bytes.length
      )
        throw Error("Truncated ICO image.");
      sizes.push(`${bytes[offset] || 256}x${bytes[offset + 1] || 256}`);
    }
    return [...new Set(sizes)].join("; ");
  }
  if (extension === ".webp") {
    if (
      bytes.length < 30 ||
      bytes.toString("ascii", 0, 4) !== "RIFF" ||
      bytes.toString("ascii", 8, 12) !== "WEBP" ||
      bytes.readUInt32LE(4) + 8 !== bytes.length
    )
      throw Error("Invalid WebP container.");
    const kind = bytes.toString("ascii", 12, 16);
    if (kind === "VP8X")
      return `${bytes.readUIntLE(24, 3) + 1}x${bytes.readUIntLE(27, 3) + 1}`;
    if (
      kind === "VP8 " &&
      bytes.subarray(23, 26).equals(Buffer.from([157, 1, 42]))
    )
      return `${bytes.readUInt16LE(26) & 0x3fff}x${bytes.readUInt16LE(28) & 0x3fff}`;
    if (kind === "VP8L" && bytes[20] === 47) {
      const bits = bytes.readUInt32LE(21);
      return `${(bits & 0x3fff) + 1}x${((bits >>> 14) & 0x3fff) + 1}`;
    }
    throw Error("Unsupported WebP dimension header.");
  }
  throw Error("Unsupported supplied image extension.");
}

export async function validateAssets(root, suppliedManifest) {
  const manifest =
    suppliedManifest ??
    JSON.parse(await readFile(join(root, assetDir, "manifest.json"), "utf8"));
  const catalog = JSON.parse(
    await readFile(
      join(root, "docs/missions/inputs/service-content-map.json"),
      "utf8",
    ),
  ).services;
  const csv = await readFile(
    join(root, "docs/brand/asset-manifest.csv"),
    "utf8",
  );
  const handoff = new Map(
    csv
      .replace(/^\uFEFF/, "")
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((line) => {
        const fields = line.split(",");
        if (fields.length !== 4) throw Error("Unexpected handoff CSV record.");
        const [source, bytes, dimensions, sha256] = fields;
        return [source, { bytes: Number(bytes), dimensions, sha256 }];
      }),
  );
  if (
    manifest.schemaVersion !== 1 ||
    manifest.services.length !== 30 ||
    catalog.length !== 30 ||
    manifest.brand.length !== 4
  )
    throw Error("Incomplete image catalog.");
  for (const [index, item] of manifest.services.entries()) {
    const canonical = catalog[index];
    if (
      item.id !== canonical.id ||
      item.slug !== canonical.slug ||
      !new RegExp(
        `^services/${String(canonical.id).padStart(2, "0")}-[a-z0-9-]+\\.webp$`,
      ).test(item.file) ||
      item.source !== `02-Web-Optimized-Images/${item.file.split("/")[1]}`
    )
      throw Error("Service image mapping differs from canonical catalog.");
  }
  if (new Set(manifest.brand.map((item) => item.key)).size !== 4)
    throw Error("Duplicate brand asset.");
  for (const item of manifest.brand) {
    if (
      !brandNames[item.key] ||
      item.file !== `brand/${brandNames[item.key]}` ||
      item.source !== `03-Logo-and-Favicon/${brandNames[item.key]}`
    )
      throw Error("Unexpected brand asset mapping.");
  }
  for (const item of [...manifest.services, ...manifest.brand]) {
    const original = handoff.get(item.source);
    if (
      !original ||
      original.bytes !== item.bytes ||
      original.dimensions !== item.dimensions ||
      original.sha256 !== item.sha256
    )
      throw Error(`Asset metadata differs from supplied handoff: ${item.file}`);
    const path = join(root, assetDir, item.file);
    if (!(await lstat(path)).isFile())
      throw Error(`Asset must be a regular file: ${item.file}`);
    const bytes = await readFile(path);
    if (bytes.length !== item.bytes || digest(bytes) !== item.sha256)
      throw Error(`Asset bytes/hash differ from handoff: ${item.file}`);
    if (inspectImage(bytes, extname(path)) !== item.dimensions)
      throw Error(`Asset dimensions differ from handoff: ${item.file}`);
  }
  return {
    services: manifest.services.length,
    brandAssets: manifest.brand.length,
  };
}

export async function validateBuiltImages(root, pages, suppliedManifest) {
  const manifest =
    suppliedManifest ??
    JSON.parse(await readFile(join(root, assetDir, "manifest.json"), "utf8"));
  const selected = pages?.length
    ? pages
    : ["home", ...manifest.services.map((item) => item.slug)];
  for (const slug of selected) {
    const hero = manifest.services.find((item) => item.slug === slug);
    if (!hero && slug !== "home")
      throw Error(`Unknown image build target: ${slug}`);
    const dist = join(root, "pages", slug, "dist");
    const names = await readdir(join(dist, "assets"));
    const webps = names.filter((name) => name.endsWith(".webp"));
    if (webps.length !== (hero ? 1 : 0))
      throw Error(
        `${slug}: expected exactly one matching hero, or none for home; unrelated images found.`,
      );
    if (
      hero &&
      digest(await readFile(join(dist, "assets", webps[0]))) !== hero.sha256
    )
      throw Error(`${slug}: unrelated hero image in bundle.`);
    const hashes = new Set(
      await Promise.all(
        names.map(async (name) =>
          digest(await readFile(join(dist, "assets", name))),
        ),
      ),
    );
    for (const icon of manifest.brand.filter((item) => item.key !== "logo")) {
      if (!hashes.has(icon.sha256))
        throw Error(`${slug}: missing supplied favicon bytes.`);
    }
    const html = await readFile(join(dist, "index.html"), "utf8");
    const iconTags = [
      ...html.matchAll(/<link[^>]*rel="icon"[^>]*href="([^"]+)"[^>]*>/g),
    ];
    if (
      iconTags.some(
        (match) => !/\sdata-breero-icon(?:\s|=|\/?>)/.test(match[0]),
      )
    )
      throw Error(`${slug}: supplied favicon link must have its brand marker.`);
    const links = iconTags.map((match) => match[1]);
    if (
      !links.length ||
      links.some(
        (url) =>
          !url.startsWith("/assets/") ||
          url.startsWith("//") ||
          !names.includes(url.slice(8)),
      )
    )
      throw Error(`${slug}: favicon must resolve under root /assets/.`);
  }
  return { pages: selected.length };
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const args = process.argv.slice(2);
  const result =
    args[0] === "--built"
      ? await validateBuiltImages(root, args.slice(1))
      : await validateAssets(root);
  console.log(`Supplied image check passed: ${JSON.stringify(result)}`);
}
