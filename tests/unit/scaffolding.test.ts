import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  symlink,
  readFile,
  writeFile,
  readdir,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

test("page scaffolder produces an importable strict trilingual manifest without activating a site", async () => {
  const root = await mkdtemp(join(tmpdir(), "lp-scaffold-"));
  await symlink(
    resolve("node_modules"),
    join(root, "node_modules"),
    "junction",
  );
  const result = spawnSync(
    process.execPath,
    [
      resolve("scripts/new-page.mjs"),
      "example-service",
      "--group",
      "vehicle",
      "--name",
      "Example service",
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  const { default: manifest } = await import(
    pathToFileURL(join(root, "pages/example-service/page.config.ts")).href
  );
  assert.equal(manifest.group, "vehicle");
  assert.equal(manifest.customer.fr.cta, "Examiner la demande");
  assert.equal(manifest.provider.es.faq.length, 5);
  assert.equal(manifest.features.whatsappButton, false);
  assert.match(manifest.customer.en.headline, /PLACEHOLDER/);
});

test("scaffolder rejects traversal and never overwrites an existing package", async () => {
  const root = await mkdtemp(join(tmpdir(), "lp-scaffold-safe-"));
  const script = resolve("scripts/new-page.mjs");
  const invalid = spawnSync(process.execPath, [script, "../outside"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(invalid.status, 0);
  assert.deepEqual(await readdir(root), []);
  await mkdir(join(root, "pages/existing"), { recursive: true });
  const marker = join(root, "pages/existing/page.config.ts");
  await writeFile(marker, "preserve existing work");
  const existing = spawnSync(process.execPath, [script, "existing"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(existing.status, 0);
  assert.equal(await readFile(marker, "utf8"), "preserve existing work");
});

test("local launcher rejects a homepage-only selection before starting services", () => {
  const result = spawnSync(
    process.execPath,
    [resolve("scripts/dev-stack.mjs")],
    {
      encoding: "utf8",
      timeout: 5000,
      env: {
        ...process.env,
        PAGES: "home",
        BACKEND_PORT: "-1",
        FIRST_PAGE_PORT: "-1",
      },
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Select at least one service with home/);
  assert.doesNotMatch(result.stdout, /backend http/);
});
