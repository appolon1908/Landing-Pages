import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, mkdir, writeFile, rm, cp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  inspectImage,
  validateAssets,
  validateBuiltImages,
} from "../../scripts/check_assets.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const manifestUrl = new URL(
  "../../packages/ui/src/assets/manifest.json",
  import.meta.url,
);

test("all supplied images retain handoff hashes, dimensions and canonical mapping", async () => {
  const result = await validateAssets(root);
  assert.equal(result.services, 30);
  assert.equal(result.brandAssets, 4);
});

test("changed image bytes, swapped service mapping and incorrect dimensions are rejected", async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  const swapped = structuredClone(manifest);
  swapped.services[0].slug = "plumbing";
  await assert.rejects(validateAssets(root, swapped), /mapping|catalog/);
  const wrongSize = structuredClone(manifest);
  wrongSize.services[0].dimensions = "1x1";
  await assert.rejects(validateAssets(root, wrongSize), /dimensions|handoff/);
  const hero = await readFile(
    new URL(
      `../../packages/ui/src/assets/${manifest.services[0].file}`,
      import.meta.url,
    ),
  );
  assert.equal(inspectImage(hero, ".webp"), "1672x941");
  const corrupted = Buffer.from(hero);
  corrupted[0] ^= 1;
  assert.throws(() => inspectImage(corrupted, ".webp"), /WebP/);
  const wrongHash = structuredClone(manifest);
  wrongHash.services[0].sha256 = "0".repeat(64);
  await assert.rejects(validateAssets(root, wrongHash), /hash|handoff/);
});

test("built asset checker catches eager unrelated service images", async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
  const directory = await mkdtemp(join(tmpdir(), "breero-image-build-"));
  try {
    const assets = join(directory, "pages/hvac/dist/assets");
    await mkdir(assets, { recursive: true });
    for (const item of [manifest.services[0], ...manifest.brand]) {
      await writeFile(
        join(assets, item.file.split("/").at(-1)),
        await readFile(join(root, "packages/ui/src/assets", item.file)),
      );
    }
    await writeFile(
      join(directory, "pages/hvac/dist/index.html"),
      '<link data-breero-icon rel="icon" href="/assets/favicon.ico">',
    );
    await validateBuiltImages(directory, ["hvac"], manifest);
    await writeFile(
      join(directory, "pages/hvac/dist/index.html"),
      '<link rel="icon" href="/assets/favicon.ico">',
    );
    await assert.rejects(
      validateBuiltImages(directory, ["hvac"], manifest),
      /brand marker/,
    );
    await writeFile(
      join(directory, "pages/hvac/dist/index.html"),
      '<link data-breero-icon rel="icon" href="/assets/favicon.ico">',
    );
    const unrelated = manifest.services[1];
    await writeFile(
      join(assets, "unrelated.webp"),
      await readFile(join(root, "packages/ui/src/assets", unrelated.file)),
    );
    await assert.rejects(
      validateBuiltImages(directory, ["hvac"], manifest),
      /unrelated|exactly one/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("changed supplied file bytes cannot pass an unchanged handoff manifest", async () => {
  const directory = await mkdtemp(join(tmpdir(), "breero-image-corruption-"));
  try {
    for (const relative of [
      "packages/ui/src/assets",
      "docs/brand",
      "docs/missions/inputs",
    ]) {
      await mkdir(join(directory, relative), { recursive: true });
    }
    await cp(
      join(root, "packages/ui/src/assets"),
      join(directory, "packages/ui/src/assets"),
      { recursive: true },
    );
    for (const relative of [
      "docs/brand/asset-manifest.csv",
      "docs/missions/inputs/service-content-map.json",
    ]) {
      await writeFile(
        join(directory, relative),
        await readFile(join(root, relative)),
      );
    }
    const file = join(
      directory,
      "packages/ui/src/assets/services/01-hvac-air-conditioning.webp",
    );
    const changed = await readFile(file);
    changed[changed.length - 1] ^= 1;
    await writeFile(file, changed);
    await assert.rejects(validateAssets(directory), /bytes\/hash/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
