import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createPageServer } from "../../packages/page-kit/src/serve.mjs";
import { siteDocument } from "../fixtures.ts";
import { call } from "../http.mjs";

// Exercise cache behavior through HTTP, without exposing the server's cache.
async function fixture(t, { cacheMs } = {}) {
  let now = 100000;
  t.mock.method(Date, "now", () => now);
  const counts = new Map();
  const allowed = new Set();
  const backend = http.createServer((req, res) => {
    const host = req.headers.host;
    counts.set(host, (counts.get(host) ?? 0) + 1);
    if (!allowed.has(host)) {
      res.writeHead(421);
      res.end();
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(siteDocument({ publicOrigin: `https://${host}` })));
  });
  await new Promise((resolve) => backend.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => backend.close(resolve)));
  const server = createPageServer({
    manifest: {
      kind: "home",
      title: { es: "Inicio", en: "Home", fr: "Accueil" },
      description: { es: "Vista previa", en: "Preview", fr: "Aperçu" },
    },
    dist: process.cwd(),
    backendUrl: `http://127.0.0.1:${backend.address().port}`,
    ...(cacheMs === undefined ? {} : { cacheMs }),
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return {
    allowed,
    counts,
    advance: (ms) => (now += ms),
    request: (host) =>
      call(`http://127.0.0.1:${server.address().port}`, "/", { host }),
  };
}

for (const known of [false, true]) {
  test(`host cache bounds ${known ? "valid" : "unknown"} host churn while retaining recent results`, async (t) => {
    const f = await fixture(t);
    // More than the internal 256-entry limit, all inside both TTLs.
    for (let i = 0; i <= 256; i++) {
      const host = `tenant-${i}.example.org`;
      if (known) f.allowed.add(host);
      assert.equal((await f.request(host)).status, known ? 302 : 421);
    }
    assert.equal(
      (await f.request("tenant-256.example.org")).status,
      known ? 302 : 421,
    );
    assert.equal(f.counts.get("tenant-256.example.org"), 1);
    assert.equal(
      (await f.request("tenant-0.example.org")).status,
      known ? 302 : 421,
    );
    assert.equal(
      f.counts.get("tenant-0.example.org"),
      2,
      "oldest host must be evicted at capacity",
    );
  });
}

test("expired negative entries are reclaimed before a still-live positive entry", async (t) => {
  const f = await fixture(t);
  f.allowed.add("known.example.org");
  assert.equal((await f.request("known.example.org")).status, 302);
  for (let i = 0; i < 255; i++)
    assert.equal((await f.request(`missing-${i}.example.org`)).status, 421);
  f.advance(2000);
  assert.equal((await f.request("fresh.example.org")).status, 421);
  assert.equal((await f.request("known.example.org")).status, 302);
  assert.equal(
    f.counts.get("known.example.org"),
    1,
    "expired entries must not displace a live host",
  );
  assert.equal((await f.request("missing-0.example.org")).status, 421);
  assert.equal(f.counts.get("missing-0.example.org"), 2);
});

test("positive and negative TTLs expire exactly and refreshed context stays host-scoped", async (t) => {
  const f = await fixture(t);
  f.allowed.add("known.example.org");
  const first = await f.request("KNOWN.EXAMPLE.ORG:443");
  assert.equal(first.status, 302);
  assert.equal(first.headers.location, "/en/");
  assert.equal(first.headers["x-robots-tag"], "noindex, nofollow");
  assert.equal((await f.request("missing.example.org")).status, 421);
  f.allowed.delete("known.example.org");
  f.allowed.add("missing.example.org");
  f.advance(1999);
  assert.equal((await f.request("known.example.org")).status, 302);
  assert.equal((await f.request("missing.example.org")).status, 421);
  assert.equal(f.counts.get("known.example.org"), 1);
  assert.equal(f.counts.get("missing.example.org"), 1);
  f.advance(1);
  assert.equal((await f.request("missing.example.org")).status, 302);
  assert.equal(f.counts.get("missing.example.org"), 2);
  f.advance(27999);
  assert.equal((await f.request("known.example.org")).status, 302);
  assert.equal(f.counts.get("known.example.org"), 1);
  f.advance(1);
  assert.equal((await f.request("known.example.org")).status, 421);
  assert.equal(f.counts.get("known.example.org"), 2);
  assert.equal((await f.request("missing.example.org")).status, 302);
  assert.equal(f.counts.get("missing.example.org"), 2);
});

test("disabled positive caching preserves negative caching and malformed hosts fail closed", async (t) => {
  const f = await fixture(t, { cacheMs: 0 });
  f.allowed.add("known.example.org");
  for (let i = 0; i < 2; i++) {
    assert.equal((await f.request("known.example.org")).status, 302);
    assert.equal((await f.request("missing.example.org")).status, 421);
    assert.equal((await f.request("bad_host.example.org")).status, 421);
  }
  assert.equal(f.counts.get("known.example.org"), 2);
  assert.equal(f.counts.get("missing.example.org"), 1);
  assert.equal(f.counts.has("bad_host.example.org"), false);
});
