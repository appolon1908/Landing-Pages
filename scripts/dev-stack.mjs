#!/usr/bin/env node
/**
 * Run the whole stack locally: one backend plus every page on its own port.
 *   npm run build && node scripts/dev-stack.mjs            # all pages
 *   PAGES=hvac,plumbing node scripts/dev-stack.mjs
 * Ports: backend 4000, pages 4173, 4174, ... in the order listed.
 * A derived registry gives each page its own origin so cross-page links
 * resolve to the right local port; the real registry is not modified.
 */
import { spawn } from "node:child_process";
import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const backendPort = Number(process.env.BACKEND_PORT || 4000);
const firstPort = Number(process.env.FIRST_PAGE_PORT || 4173);
const available = (await readdir(join(root, "pages"), { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();
const selected = process.env.PAGES
  ? process.env.PAGES.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : available;
if (selected.includes("home") && selected.every((slug) => slug === "home"))
  throw Error(
    "Select at least one service with home (for example PAGES=home,hvac). For home alone with an existing catalog backend, use its workspace start command and BACKEND_URL.",
  );
for (const slug of selected)
  if (!available.includes(slug)) throw Error(`Unknown page ${slug}.`);
const portOf = Object.fromEntries(
  selected.map((slug, i) => [slug, firstPort + i]),
);

const sourceDir = resolve(
  process.env.REGISTRY_DIR || join(root, "config/registry"),
);
const derivedDir = await mkdtemp(join(tmpdir(), "lp-registry-"));
for (const name of (await readdir(sourceDir)).filter((n) =>
  n.endsWith(".json"),
)) {
  const entry = JSON.parse(await readFile(join(sourceDir, name), "utf8"));
  const site = entry.site;
  const origin = new URL(site.publicOrigin);
  const pages = site.pages.map((p) =>
    typeof p === "string" ? { slug: p, origin: null, label: null } : p,
  );
  const kept = pages.filter((p) => portOf[p.slug]);
  if (!kept.length) continue;
  const first = kept[0];
  const publicPort = portOf.home ?? (first ? portOf[first.slug] : undefined);
  site.publicOrigin = `${origin.protocol}//${origin.hostname}:${publicPort}`;
  site.pages = kept.map((p) => ({
    ...p,
    origin:
      !portOf.home && p.slug === first?.slug
        ? null
        : `${origin.protocol}//${origin.hostname}:${portOf[p.slug]}`,
  }));
  await writeFile(join(derivedDir, name), JSON.stringify(entry, null, 2));
}

const children = [];
const run = (label, args, env, cwd = root) => {
  const child = spawn(process.execPath, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: ["ignore", "inherit", "inherit"],
  });
  child.on(
    "exit",
    (code) => code && console.error(`${label} exited with ${code}`),
  );
  children.push(child);
};
run("backend", ["backend/src/index.mjs"], {
  PORT: String(backendPort),
  REGISTRY_DIR: derivedDir,
});
for (const slug of selected)
  run(
    slug,
    ["serve.mjs"],
    {
      PORT: String(portOf[slug]),
      BACKEND_URL: `http://127.0.0.1:${backendPort}`,
    },
    join(root, "pages", slug),
  );
console.log(
  `backend http://127.0.0.1:${backendPort}\n` +
    selected
      .map((s) => `${s.padEnd(30)} http://127.0.0.1:${portOf[s]}`)
      .join("\n"),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    for (const c of children) c.kill("SIGTERM");
    process.exit(0);
  });
