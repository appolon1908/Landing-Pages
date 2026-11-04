import test from "node:test";
import assert from "node:assert/strict";
import { buildRegistry } from "../../backend/src/registry.mjs";
import { createBackend } from "../../backend/src/server.mjs";
import { createPageServer } from "../../packages/page-kit/src/serve.mjs";
import { definePage } from "@lp/core";
import { manifestInput } from "../manifest-fixture.ts";
import { siteDocument } from "../fixtures.ts";
import { call } from "../http.mjs";

function registry() {
  const { submissionsEnabled, ...site } = siteDocument();
  return buildRegistry([
    {
      hosts: ["127.0.0.1", "localhost", "fixture.example.org"],
      site,
      destination: { type: "disabled" },
    },
  ]);
}
async function listen(t, server) {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

test("Front Desk defaults to unavailable and leaves all business effects disabled", async (t) => {
  const base = await listen(t, createBackend({ registry: registry() }));
  const result = await call(base, "/api/front-desk", { host: "127.0.0.1" });
  assert.equal(result.status, 200);
  assert.deepEqual(result.json(), {
    schemaVersion: 1,
    mode: "local-demo",
    available: false,
    demoOrigin: null,
    reason: "not-configured",
    productionSchedulingEnabled: false,
  });
  const site = await call(base, "/api/site-context", { host: "127.0.0.1" });
  assert.equal(site.json().submissionsEnabled, false);
});

test("the shared page proxy preserves localhost-only server configuration and rejects unknown hosts", async (t) => {
  const backendUrl = await listen(
    t,
    createBackend({
      registry: registry(),
      frontDeskDemoOrigin: "http://127.0.0.1:54253",
    }),
  );
  const base = await listen(
    t,
    createPageServer({
      manifest: definePage(manifestInput()),
      dist: ".",
      backendUrl,
    }),
  );
  const result = await call(
    base,
    "/api/front-desk?origin=https://attacker.example&workspace=forged",
    {
      host: "localhost",
      headers: { "x-forwarded-host": "fixture.example.org" },
    },
  );
  assert.equal(result.status, 200);
  assert.equal(result.json().demoOrigin, "http://127.0.0.1:54253");
  assert.equal(result.json().productionSchedulingEnabled, false);
  const publicResult = await call(base, "/api/front-desk", {
    headers: { "x-forwarded-host": "localhost" },
  });
  assert.equal(publicResult.status, 200);
  assert.equal(publicResult.json().available, false);
  assert.equal(publicResult.json().demoOrigin, null);
  assert.equal(publicResult.json().reason, "local-only");
  assert.equal(
    (await call(base, "/api/front-desk", { host: "unknown.example" })).status,
    421,
  );
  assert.equal(
    (await call(base, "/api/front-desk", { host: "localhost", method: "POST" }))
      .status,
    405,
  );
});

test("invalid Front Desk destinations fail before a listener starts", () => {
  for (const frontDeskDemoOrigin of [
    "https://example.org",
    "http://10.0.0.1:4317",
    "javascript:alert(1)",
    "http://localhost:4317/path",
    "http://localhost:4317?key=x",
    "http://localhost:4317#x",
    "http://user:password@localhost:4317",
    "http://localhost.evil.example",
    "http://127.1:4317",
    "http://localhost:70000",
    "http://localhost:0",
  ]) {
    assert.throws(
      () => createBackend({ registry: registry(), frontDeskDemoOrigin }),
      /Front Desk/i,
    );
  }
});
