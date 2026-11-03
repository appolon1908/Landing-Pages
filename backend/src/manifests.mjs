import { readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { definePage } from "@lp/core";

/** Read deployed, trusted page files once at startup. Browser content is never schema authority. */
export async function loadPageManifests(directory) {
  const manifests = [];
  for (const entry of (
    await readdir(resolve(directory), { withFileTypes: true })
  ).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory() || entry.name === "home") continue;
    const { default: value } = await import(
      pathToFileURL(join(resolve(directory), entry.name, "page.config.ts")).href
    );
    const { audiences, ...input } = value;
    const manifest = definePage(input);
    if (manifest.slug !== entry.name)
      throw Error("Page directory and manifest slug differ.");
    manifests.push(manifest);
  }
  if (!manifests.length) throw Error("No trusted service manifests found.");
  return manifests;
}
