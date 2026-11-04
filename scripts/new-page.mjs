#!/usr/bin/env node
/** Scaffold one preview service package; site registration remains explicit. */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { definePage } from "@lp/core";
import { placeholderManifest } from "./placeholder-manifest.mjs";
const args = process.argv.slice(2);
const slug = args[0];
const opt = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i > 0 && args[i + 1] ? args[i + 1] : fallback;
};
const manifestFile = opt("--manifest", null);
const input = manifestFile
  ? JSON.parse(await readFile(manifestFile, "utf8"))
  : placeholderManifest({
      slug,
      name: opt("--name", String(slug).replaceAll("-", " ")),
      accent: opt("--accent", "#176951"),
      group: opt("--group", "home"),
      pilot: args.includes("--pilot"),
    });
const manifest = definePage(input);
if (manifest.slug !== slug)
  throw Error("Manifest slug must match the requested package.");
const dir = join("pages", slug);
await mkdir("pages", { recursive: true });
await mkdir(dir); // Never overwrite an existing service.
await mkdir(join(dir, "src"));
const files = {
  "package.json":
    JSON.stringify(
      {
        name: `@lp/page-${slug}`,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
          build: "vite build",
          start: "node serve.mjs",
          dev: "vite",
          typecheck: "vue-tsc --noEmit -p tsconfig.json",
        },
        dependencies: {
          "@lp/core": "*",
          "@lp/page-kit": "*",
          "@lp/ui": "*",
          vue: "3.5.44",
        },
      },
      null,
      2,
    ) + "\n",
  "page.config.ts": `import { definePage } from "@lp/core";\n\n/** Structural draft; replace placeholders before content acceptance. */\nexport default definePage(${JSON.stringify(input, null, 2)});\n`,
  "index.html":
    '<!doctype html>\n<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="light"><title>Service preview</title></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>\n',
  "src/main.ts":
    'import { mountLandingPage } from "@lp/ui";\nimport manifest from "../page.config.ts";\nmountLandingPage(manifest);\n',
  "vite.config.mjs":
    'import { pageViteConfig } from "@lp/page-kit/vite";\nexport default pageViteConfig();\n',
  "serve.mjs":
    'import { fileURLToPath } from "node:url";\nimport { startPageServer } from "@lp/page-kit";\nimport manifest from "./page.config.ts";\nstartPageServer({ manifest, dist: process.env.DIST_DIR || fileURLToPath(new URL("./dist", import.meta.url)) });\n',
  "tsconfig.json":
    JSON.stringify(
      {
        extends: "../../tsconfig.base.json",
        include: [
          "src/**/*.ts",
          "src/**/*.vue",
          "page.config.ts",
          "../../packages/ui/src/**/*.ts",
          "../../packages/ui/src/**/*.vue",
          "../../packages/core/src/**/*.ts",
        ],
      },
      null,
      2,
    ) + "\n",
};
for (const [file, content] of Object.entries(files))
  await writeFile(join(dir, file), content);
console.log(
  `Created ${dir}; add its service binding explicitly to a preview registry, then npm install.`,
);
