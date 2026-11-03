import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildRegistry } from "../../backend/src/registry.mjs";
import { createBackend } from "../../backend/src/server.mjs";
import { createIdempotencyStore } from "../../backend/src/idempotency.mjs";
import { webhook } from "../../backend/src/destinations/webhook.mjs";
import { breero } from "../../backend/src/destinations/breero.mjs";
import {
  envelope,
  siteDocument,
  workspaceId,
  fixtureManifests,
} from "../fixtures.ts";
import { call } from "../http.mjs";
import { installFakeCrm } from "../fake-crm.mjs";

const quiet = { log() {}, error() {} };
const key = () => crypto.randomUUID();

function entry(
  overrides = {},
  destination = { type: "disabled" },
  hosts = ["fixture.example.org"],
) {
  const { submissionsEnabled, ...site } = siteDocument(overrides);
  return {
    hosts,
    site,
    destination,
    rateLimit: { capacity: 1000, windowMs: 600000 },
  };
}
async function listen(server) {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return `http://127.0.0.1:${server.address().port}`;
}
const post = (base, path, body, headers = {}, host = "fixture.example.org") =>
  call(base, path, {
    method: "POST",
    body,
    headers: { Origin: "https://fixture.example.org", ...headers },
    host,
  });

test("registry derives submissionsEnabled from mode and destination and fails closed", () => {
  const r = buildRegistry([
    entry({ siteId: "a" }, { type: "disabled" }, ["a.example"]),
    entry({ siteId: "b", mode: "live" }, { type: "log" }, [
      "b.example",
      "www.b.example",
    ]),
    entry({ siteId: "c", mode: "live" }, { type: "disabled" }, ["c.example"]),
  ]);
  assert.equal(r.forHost("a.example").site.submissionsEnabled, false);
  assert.equal(r.forHost("www.b.example:443").site.submissionsEnabled, true);
  assert.equal(r.forHost("c.example").site.submissionsEnabled, false);
  assert.equal(r.forHost("nope.example"), null);
  assert.equal(r.forHost(undefined), null);
  for (const bad of [
    [],
    [entry({}, { type: "disabled" }, [])],
    [
      entry({}, { type: "disabled" }, ["x.example"]),
      entry({ siteId: "two" }, { type: "disabled" }, ["x.example"]),
    ],
    [
      entry({}, { type: "disabled" }),
      entry({}, { type: "disabled" }, ["other.example"]),
    ],
    [entry({}, { type: "nope" })],
    [entry({}, { type: "webhook", url: "http://insecure.example/x" })],
    [
      entry(
        {},
        { type: "webhook", url: "https://ok.example/x", authEnv: "lower" },
      ),
    ],
    [entry({ pages: [] })],
  ])
    assert.throws(() => buildRegistry(bad), JSON.stringify(bad).slice(0, 80));
});

test("site context is host-scoped, public and read-only", async () => {
  const server = createBackend({
    registry: buildRegistry([entry()]),
    manifests: fixtureManifests(),
    logger: quiet,
  });
  const base = await listen(server);
  try {
    const ok = await call(base, "/api/site-context");
    assert.equal(ok.status, 200);
    const body = ok.json();
    assert.equal(body.siteId, "fixture");
    assert.equal("destination" in body, false);
    assert.equal(
      (await call(base, "/api/site-context", { host: "evil.example" })).status,
      421,
    );
    assert.equal(
      (await call(base, "/api/site-context", { method: "DELETE" })).status,
      404,
    );
    assert.equal(
      (await call(base, "/healthz", { host: "anything" })).status,
      200,
    );
    assert.equal(
      (
        await post(
          base,
          "/api/submissions/service-requests",
          {},
          { "Idempotency-Key": key() },
        )
      ).status,
      503,
    );
  } finally {
    server.close();
  }
});

test("live site accepts a valid envelope once, replays the receipt and rejects conflicts", async () => {
  const dir = await mkdtemp(join(tmpdir(), "lp-"));
  const journal = join(dir, "journal.jsonl");
  const delivered = [];
  const registry = buildRegistry([
    entry(
      { mode: "live" },
      { type: "log", sink: (l) => delivered.push(JSON.parse(l)) },
    ),
  ]);
  installFakeCrm(registry, "fixture.example.org", (submission) =>
    delivered.push(submission),
  );
  const store = createIdempotencyStore({ journalFile: journal });
  const server = createBackend({
    registry,
    store,
    manifests: fixtureManifests(),
    logger: quiet,
  });
  const base = await listen(server);
  const site = registry.forHost("fixture.example.org").site;
  try {
    const body = envelope(site, "hvac-heating");
    const k = key();
    const first = await post(base, "/api/submissions/service-requests", body, {
      "Idempotency-Key": k,
    });
    assert.equal(first.status, 201);
    const receipt = first.json();
    assert.equal(receipt.status, "REQUEST_ACCEPTED");
    assert.equal(receipt.downstream_status, "CRM_ACCEPTED");
    assert.match(receipt.crm_receipt_id, /^crm-/);
    assert.equal(delivered.length, 1);
    assert.equal(delivered[0].page, "hvac-heating");
    assert.equal(delivered[0].siteId, "fixture");
    assert.equal(delivered[0].workspaceId, workspaceId);
    assert.equal(
      delivered[0].payload.consentIntent.choices.transactionalSms,
      true,
    );
    assert.equal(
      delivered[0].payload.consentIntent.choices.marketingSms,
      false,
    );

    const replay = await post(base, "/api/submissions/service-requests", body, {
      "Idempotency-Key": k,
    });
    assert.equal(replay.status, 200);
    assert.deepEqual(replay.json(), receipt);
    assert.equal(delivered.length, 1, "replay must not redeliver");

    const conflict = await post(
      base,
      "/api/submissions/service-requests",
      { ...body, request: { ...body.request, name: "Another Example" } },
      { "Idempotency-Key": k },
    );
    assert.equal(conflict.status, 409);

    const provider = await post(
      base,
      "/api/submissions/provider-interest",
      envelope(site, "hvac-heating", "business", "es"),
      { "Idempotency-Key": key() },
    );
    assert.equal(provider.status, 201);
    assert.equal(delivered[1].audience, "business");
    assert.equal(delivered[1].locale, "es");

    const lines = (await readFile(journal, "utf8")).trim().split("\n");
    assert.equal(lines.length, 2);
    assert.equal(JSON.parse(lines[0]).requestId, receipt.request_id);
  } finally {
    server.close();
  }
});

test("submissions are validated against the receiving site and its pages", async () => {
  const registry = buildRegistry([
    entry({ mode: "live" }, { type: "log", sink() {} }),
  ]);
  const server = createBackend({
    registry,
    manifests: fixtureManifests(),
    logger: quiet,
  });
  const base = await listen(server);
  const site = registry.forHost("fixture.example.org").site;
  const good = envelope(site, "hvac-heating");
  try {
    const expect = async (
      status,
      body,
      headers = {},
      path = "/api/submissions/service-requests",
    ) => {
      const r = await post(base, path, body, {
        "Idempotency-Key": key(),
        ...headers,
      });
      assert.equal(r.status, status, `${status} ${r.text}`);
    };
    await expect(400, good, { "Idempotency-Key": "not-a-uuid" });
    await expect(415, good, { "Content-Type": "text/plain" });
    await expect(400, "{not json");
    await expect(400, { ...good, schemaVersion: 1 });
    await expect(400, {
      ...good,
      request: { ...good.request, extra: "field" },
    });
    await expect(400, { ...good, request: { ...good.request, email: "nope" } });
    await expect(400, {
      ...good,
      request: {
        ...good.request,
        source_url: "https://other.example/en/landing/hvac-heating",
      },
    });
    await expect(400, {
      ...good,
      request: {
        ...good.request,
        source_url: "https://fixture.example.org/en/landing/not-listed",
        service_slug: "not-listed",
      },
    });
    await expect(400, {
      ...good,
      request: { ...good.request, service_slug: "chimney-fireplace" },
    });
    await expect(400, {
      ...good,
      request: { ...good.request, marketing_sms_consent: true },
    });
    await expect(400, {
      ...good,
      consentIntent: { ...good.consentIntent, businessName: "Forged" },
    });
    await expect(400, {
      ...good,
      consentIntent: {
        ...good.consentIntent,
        disclosures: { transactionalSms: "custom", marketingSms: "" },
      },
    });
    await expect(404, good, {}, "/api/submissions/unknown-kind");
    await expect(400, good, {}, "/api/submissions/provider-interest");
    await expect(413, {
      ...good,
      request: { ...good.request, service_description: "x".repeat(70000) },
    });
    await expect(202, good);
    // chimney-fireplace is listed with its own origin: that origin is the only valid source.
    const own = envelope(site, "chimney-fireplace");
    assert.equal(
      own.request.source_url,
      "https://chimney.example.org/en/landing/chimney-fireplace",
    );
    await expect(202, own, { Origin: "https://chimney.example.org" });
    await expect(400, {
      ...own,
      request: {
        ...own.request,
        source_url: "https://fixture.example.org/en/landing/chimney-fireplace",
      },
    });
  } finally {
    server.close();
  }
});

test("CRM failure releases the key and a retry receives canonical acceptance", async () => {
  let attempts = 0;
  const registry = buildRegistry([
    entry(
      { mode: "live" },
      {
        type: "log",
        sink: () => {
          if (++attempts === 1) throw Error("boom");
        },
      },
    ),
  ]);
  installFakeCrm(registry, "fixture.example.org", () => {
    if (++attempts === 1) throw Error("boom");
  });
  const server = createBackend({
    registry,
    manifests: fixtureManifests(),
    logger: quiet,
  });
  const base = await listen(server);
  try {
    const site = registry.forHost("fixture.example.org").site;
    const body = envelope(site, "hvac-heating");
    const k = key();
    assert.equal(
      (
        await post(base, "/api/submissions/service-requests", body, {
          "Idempotency-Key": k,
        })
      ).status,
      502,
    );
    assert.equal(
      (
        await post(base, "/api/submissions/service-requests", body, {
          "Idempotency-Key": k,
        })
      ).status,
      201,
    );
    assert.equal(attempts, 2);
  } finally {
    server.close();
  }
});

test("webhook destination posts JSON with a token from the environment", async () => {
  const calls = [];
  const dest = webhook(
    {
      type: "webhook",
      url: "https://hooks.example/intake",
      authEnv: "LP_TEST_TOKEN",
      idempotencyContract: "site-key-payload",
      headers: { "X-Source": "lp" },
    },
    async (url, init) => (
      calls.push({ url: String(url), init }),
      Response.json({ accepted: true, id: "crm-42" })
    ),
  );
  process.env.LP_TEST_TOKEN = "s3cret";
  try {
    const result = await dest.deliver({
      kind: "service-requests",
      siteId: "fixture",
      idempotencyKey: "k",
      payload: {},
    });
    assert.deepEqual(result, {
      downstreamStatus: "CRM_ACCEPTED",
      downstreamId: "crm-42",
    });
    assert.equal(calls[0].url, "https://hooks.example/intake");
    assert.equal(calls[0].init.headers.Authorization, "Bearer s3cret");
    assert.equal(calls[0].init.headers["X-Source"], "lp");
    assert.equal(calls[0].init.headers["Idempotency-Key"], "fixture:k");
    delete process.env.LP_TEST_TOKEN;
    await assert.rejects(
      () => dest.deliver({ idempotencyKey: "k", payload: {} }),
      /LP_TEST_TOKEN/,
    );
  } finally {
    delete process.env.LP_TEST_TOKEN;
  }
  const failing = webhook(
    {
      type: "webhook",
      url: "https://hooks.example/x",
      idempotencyContract: "site-key-payload",
    },
    async () => new Response("", { status: 500 }),
  );
  await assert.rejects(
    () => failing.deliver({ idempotencyKey: "k", payload: {} }),
    /500/,
  );
});

test("breero destination forwards to public-submissions and validates the receipt", async () => {
  const calls = [];
  const good = {
    request_id: "123e4567-e89b-42d3-a456-426614174000",
    status: "REQUEST_ACCEPTED",
    downstream_status: "CRM_ACCEPTED",
    crm_receipt_id: "crm-provider-42",
  };
  const dest = breero(
    {
      type: "breero",
      origin: "https://api.breero.example",
      idempotencyContract: "site-key-payload",
    },
    async (url, init) => (calls.push({ url, init }), Response.json(good)),
  );
  const submission = {
    kind: "provider-interest",
    siteId: "fixture",
    workspaceId,
    requestId: "r1",
    idempotencyKey: "k",
    payload: { request: { a: 1 } },
  };
  assert.deepEqual(await dest.deliver(submission), {
    downstreamStatus: "CRM_ACCEPTED",
    downstreamId: good.crm_receipt_id,
  });
  assert.equal(
    calls[0].url,
    "https://api.breero.example/api/public-submissions/provider-interest",
  );
  assert.equal(calls[0].init.headers["X-Site-Id"], "fixture");
  assert.equal(calls[0].init.headers["Idempotency-Key"], "fixture:k");
  assert.equal(JSON.parse(calls[0].init.body).request.a, 1);
  const bad = breero(
    {
      type: "breero",
      origin: "https://api.breero.example",
      idempotencyContract: "site-key-payload",
    },
    async () => Response.json({ status: "PENDING" }),
  );
  await assert.rejects(() => bad.deliver(submission), /receipt/);
  for (const receipt of [
    { ...good, downstream_status: "QUEUED" },
    { ...good, crm_receipt_id: undefined },
    { ...good, crm_receipt_id: "private\nvalue" },
  ]) {
    const legacy = breero(
      {
        type: "breero",
        origin: "https://api.breero.example",
        idempotencyContract: "site-key-payload",
      },
      async () => Response.json(receipt),
    );
    await assert.rejects(() => legacy.deliver(submission), /receipt/);
  }
  let sent = false;
  await assert.rejects(
    () =>
      breero(
        { type: "breero", origin: "https://api.breero.example" },
        async () => {
          sent = true;
          return Response.json(good);
        },
      ).deliver(submission),
    /idempotency/,
  );
  assert.equal(sent, false);
});
