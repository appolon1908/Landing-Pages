import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import http from "node:http";
const runtime = await import("../server/index.mjs").catch(() => null);

test("hosting isolates exact hosts, ignores forged forwarding headers and disables submissions", async (t) => {
  assert.equal(typeof runtime?.createLandingServer, "function");
  const dist = await mkdtemp(join(tmpdir(), "landing-test-"));
  await writeFile(
    join(dist, "index.html"),
    '<html><head></head><body><div id="app"></div></body></html>',
  );
  const registry = ["a.localhost", "b.localhost"].map((host, i) => ({
    hosts: [host],
    site: {
      schemaVersion: 1,
      siteId: `preview-${i}`,
      workspaceId: `00000000-0000-4000-8000-00000000000${i + 1}`,
      brand: { name: `Brand ${i}`, accent: "#176951" },
      publicOrigin: `http://${host}:4173`,
      offerings: ["hvac-heating"],
      mode: "preview",
      submissionsEnabled: false,
    },
  }));
  const server = runtime.createLandingServer({ dist, registry });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(dist, { recursive: true, force: true });
  });
  const request = (path, host, method = "GET") =>
    new Promise((resolve, reject) => {
      const req = http.request(
        {
          host: "127.0.0.1",
          port: server.address().port,
          path,
          method,
          headers: { host, "x-forwarded-host": "b.localhost" },
        },
        (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () =>
            resolve({ status: res.statusCode, body, headers: res.headers }),
          );
        },
      );
      req.on("error", reject);
      req.end();
    });
  const a = await request("/api/site-context", "a.localhost");
  const b = await request("/api/site-context?site=preview-0", "b.localhost");
  assert.equal(JSON.parse(a.body).siteId, "preview-0");
  assert.equal(JSON.parse(b.body).siteId, "preview-1");
  assert.equal(
    (await request("/api/site-context", "unknown.localhost")).status,
    421,
  );
  assert.equal(
    (
      await request(
        "/api/public-submissions/service-requests",
        "a.localhost",
        "POST",
      )
    ).status,
    503,
  );
  assert.equal(
    (await request("/%2e%2e/package.json", "a.localhost")).status,
    404,
  );
  assert.equal((await request("/package.json", "a.localhost")).status, 404);
  assert.equal(
    (await request("/en/landing/unknown", "a.localhost")).status,
    404,
  );
  const page = await request("/en/landing/hvac-heating", "a.localhost");
  assert.equal(page.status, 200);
  assert.match(page.body, /Brand 0/);
  assert.match(page.body, /noindex/);
  assert.match(page.headers["content-security-policy"], /default-src 'self'/);
  assert.equal((await request("/healthz", "127.0.0.1")).status, 200);
});

test("duplicate domain bindings are rejected before a listener starts", () => {
  assert.equal(typeof runtime?.createLandingServer, "function");
  assert.throws(() =>
    runtime.createLandingServer({
      dist: ".",
      registry: [
        { hosts: ["x.example"], site: {} },
        { hosts: ["x.example"], site: {} },
      ],
    }),
  );
});
