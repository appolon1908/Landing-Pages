import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { isMain, root, serviceMap } from "../marketing/_tooling/catalog.mjs";
const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(dir, entry.name))
      : [join(dir, entry.name)],
  );
export function checkBudgets(
  repoRoot,
  slugs = ["home", ...serviceMap.services.map((x) => x.slug)],
) {
  const errors = [],
    pages = [];
  for (const slug of slugs) {
    if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
      errors.push(`Invalid page slug ${slug}`);
      continue;
    }
    const dist = join(repoRoot, "pages", slug, "dist");
    if (!existsSync(join(dist, "index.html"))) {
      errors.push(`${slug}: missing build output`);
      continue;
    }
    const js = files(dist).filter((name) => name.endsWith(".js"));
    if (!js.length) {
      errors.push(`${slug}: no built JavaScript`);
      continue;
    }
    const gzipBytes = js.reduce(
      (sum, file) => sum + gzipSync(readFileSync(file)).length,
      0,
    );
    pages.push({ slug, chunks: js.length, gzipBytes });
    if (gzipBytes > 130_000)
      errors.push(
        `${slug}: ${gzipBytes} gzip bytes exceeds 130 kB (130000 bytes)`,
      );
  }
  return { pages, errors };
}
if (isMain(import.meta.url)) {
  const result = checkBudgets(
    root,
    process.argv.slice(2).length ? process.argv.slice(2) : undefined,
  );
  for (const page of result.pages)
    console.log(
      `${page.slug}: ${page.gzipBytes} gzip JS bytes (${page.chunks} chunks)`,
    );
  if (result.errors.length) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      `Budget check passed: ${result.pages.length} pages, limit 130000 gzip JS bytes each.`,
    );
}
