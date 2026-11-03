#!/usr/bin/env node
/** Validate every registry entry and confirm each listed page exists in pages/. Fails closed. */
import { readdir, access } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { buildRegistry, loadRegistryDir } from "../backend/src/registry.mjs";

const dir = resolve(process.env.REGISTRY_DIR || "config/registry");
const registry = buildRegistry(await loadRegistryDir(dir));
const pages = new Set(
  (await readdir("pages", { withFileTypes: true }))
    .filter((d) => d.isDirectory() && d.name !== "home")
    .map((d) => d.name),
);
let failed = false;
for (const site of registry.sites()) {
  for (const page of site.pages) {
    if (!pages.has(page.slug)) {
      console.error(
        `${site.siteId}: page "${page.slug}" has no package in pages/.`,
      );
      failed = true;
    }
  }
  for (const slug of pages) {
    const manifest = (
      await import(pathToFileURL(resolve("pages", slug, "page.config.ts")).href)
    ).default;
    if (manifest.slug !== slug) {
      console.error(`pages/${slug}: manifest slug is "${manifest.slug}".`);
      failed = true;
    }
  }
  console.log(
    `${site.siteId}: ${site.mode}, submissions ${site.submissionsEnabled ? "ON" : "off"}, ${site.pages.length} page(s)`,
  );
}
await access(dir).catch(() => (failed = true));
if (failed) process.exit(1);
