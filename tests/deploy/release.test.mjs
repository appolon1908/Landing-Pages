import test from "node:test";
import assert from "node:assert/strict";
import {
  readFile,
  mkdtemp,
  mkdir,
  writeFile,
  symlink,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import {
  createRelease,
  validateSource,
  verifyFiles,
} from "../../deploy/breero/generate.mjs";
import { buildRegistry } from "../../backend/src/registry.mjs";

const revision = "a".repeat(40);
const releaseDir = `/srv/codestra/breero/releases/${revision}`;
const registry = JSON.parse(
  await readFile(
    new URL("../../config/registry/breero-preview.json", import.meta.url),
  ),
);
const catalog = JSON.parse(
  await readFile(
    new URL(
      "../../docs/missions/inputs/service-content-map.json",
      import.meta.url,
    ),
  ),
).services;
const make = (changes = {}) =>
  createRelease({ revision, releaseDir, catalog, registry, ...changes });

test("release exposes only 31 loopback page ports and a disabled private backend", () => {
  const result = make();
  assert.equal(Object.keys(result.compose.services).length, 32);
  assert.equal(result.compose.services.home.ports[0], "127.0.0.1:6100:4173");
  assert.equal(result.compose.services.hvac.ports[0], "127.0.0.1:6101:4173");
  assert.equal(
    result.compose.services["digital-marketing"].ports[0],
    "127.0.0.1:6130:4173",
  );
  assert.equal(result.compose.services.backend.ports, undefined);
  for (const service of Object.values(result.compose.services)) {
    assert.equal(service.read_only, true);
    assert.equal(service.user, "node");
    assert.deepEqual(service.cap_drop, ["ALL"]);
    assert.deepEqual(service.security_opt, ["no-new-privileges:true"]);
    assert.equal(service.privileged, undefined);
    assert.equal(service.network_mode, undefined);
  }
  const publicSite = buildRegistry([result.registry]).forHost(
    "breero.com",
  ).site;
  assert.equal(publicSite.publicOrigin, "https://breero.com");
  assert.equal(publicSite.submissionsEnabled, false);
  assert.equal(publicSite.mode, "preview");
  assert.ok(publicSite.pages.every((page) => page.origin === null));
  assert.equal(buildRegistry([result.registry]).forHost("127.0.0.1"), null);
  assert.equal(registry.hosts[0], "127.0.0.1", "input must remain unchanged");
});

test("Caddy service matchers dispatch all audiences/locales without prefix confusion", () => {
  const result = make();
  const matchers = [
    ...result.caddy.matchAll(
      /@page_\d+ path_regexp page_\d+ (.+)\n\s*handle @page_\d+ \{\n\s*reverse_proxy 127\.0\.0\.1:(\d+)/g,
    ),
  ].map(([, pattern, port]) => ({
    pattern: new RegExp(pattern),
    port: Number(port),
  }));
  assert.equal(matchers.length, 30);
  for (const [path, port] of [
    ["/es/landing/hvac", 6101],
    ["/fr/business/hvac/thank-you/", 6101],
    ["/en/landing/plumbing", 6102],
    ["/fr/business/digital-marketing", 6130],
  ]) {
    assert.deepEqual(
      matchers.filter((m) => m.pattern.test(path)).map((m) => m.port),
      [port],
    );
  }
  for (const path of [
    "/es/landing/hvac-extra",
    "/de/landing/hvac",
    "/fr/privacy-policy",
    "/api/site-context",
    "/es/",
  ]) {
    assert.equal(matchers.filter((m) => m.pattern.test(path)).length, 0);
  }
  assert.match(result.caddy, /header X-Robots-Tag "noindex, nofollow"/);
  assert.match(
    result.caddy,
    /handle_path \/assets\/\* \{\n\s*root \* \/srv\/codestra\/breero\/current\/assets/,
  );
  assert.match(result.caddy, /www\.breero\.com/);
  assert.match(result.caddy, /redir https:\/\/breero\.com\{uri\} permanent/);
  assert.equal(result.release.pages.flatMap((p) => p.routes).length, 183);
});

test("source validation rejects symlink escapes, incorrect revisions and dirty checkouts", async () => {
  const directory = await mkdtemp(join(tmpdir(), "breero-source-"));
  try {
    const real = join(directory, "real");
    const source = join(real, "source");
    await mkdir(source, { recursive: true });
    const git = (...args) =>
      execFileSync("git", ["-C", source, ...args], { encoding: "utf8" }).trim();
    git("init", "--quiet");
    git("config", "core.autocrlf", "false");
    await writeFile(join(source, "tracked.txt"), "clean\n");
    git("add", "tracked.txt");
    git(
      "-c",
      "user.name=Deployment Test",
      "-c",
      "user.email=test@example.invalid",
      "-c",
      "core.hooksPath=/dev/null",
      "commit",
      "--quiet",
      "-m",
      "fixture",
    );
    const head = git("rev-parse", "HEAD");
    await validateSource(real, head, source);
    await assert.rejects(
      validateSource(real, "b".repeat(40), source),
      /revision/,
    );
    const alias = join(directory, "alias");
    await symlink(real, alias, "junction");
    await assert.rejects(
      validateSource(alias, head, source),
      /canonical|symlink/,
    );
    await writeFile(join(source, "tracked.txt"), "dirty\n");
    await assert.rejects(validateSource(real, head, source), /clean/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("verification rejects hand-edited compose privileges and symlinked configuration", async () => {
  const directory = await mkdtemp(join(tmpdir(), "breero-config-"));
  const expected = make();
  try {
    await mkdir(join(directory, "registry"));
    for (const [file, value] of [
      ["compose.json", expected.compose],
      ["release.json", expected.release],
      ["registry/breero.json", expected.registry],
    ])
      await writeFile(join(directory, file), JSON.stringify(value));
    await writeFile(join(directory, "Caddyfile"), expected.caddy);
    await verifyFiles(directory, expected);
    const modified = structuredClone(expected.compose);
    modified.services.home.privileged = true;
    await writeFile(join(directory, "compose.json"), JSON.stringify(modified));
    await assert.rejects(verifyFiles(directory, expected), /compose/);
    await writeFile(
      join(directory, "compose.json"),
      JSON.stringify(expected.compose),
    );
    const moved = join(directory, "outside-registry");
    await mkdir(moved);
    await writeFile(
      join(moved, "breero.json"),
      JSON.stringify(expected.registry),
    );
    await rm(join(directory, "registry"), { recursive: true });
    await symlink(moved, join(directory, "registry"), "junction");
    await assert.rejects(verifyFiles(directory, expected), /canonical|symlink/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("generation rejects unsafe paths/revisions and altered catalog or active destinations", () => {
  for (const changes of [
    { revision: "main" },
    { releaseDir: "/srv/elsewhere" },
    { releaseDir: `${releaseDir}/../other` },
    { catalog: catalog.slice(1) },
    { catalog: [...catalog.slice(0, 29), catalog[0]] },
  ]) {
    assert.throws(() => make(changes));
  }
  const active = structuredClone(registry);
  active.site.mode = "live";
  active.destination = { type: "webhook", url: "https://example.org" };
  assert.throws(() => make({ registry: active }), /preview|disabled/);
});
