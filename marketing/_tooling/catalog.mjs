import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
export const root = fileURLToPath(new URL("../../", import.meta.url));
export const locales = ["es", "en", "fr"];
export const serviceMap = JSON.parse(
  readFileSync(
    new URL(
      "../../docs/missions/inputs/service-content-map.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
export async function loadCatalog() {
  return Promise.all(
    serviceMap.services.map(
      async ({ slug }) =>
        (
          await import(
            new URL(`../../pages/${slug}/page.config.ts`, import.meta.url)
          )
        ).default,
    ),
  );
}
export function isMain(url) {
  return process.argv[1] && pathToFileURL(process.argv[1]).href === url;
}
