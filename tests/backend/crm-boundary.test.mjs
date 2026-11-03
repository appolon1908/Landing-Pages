import test from "node:test";
import assert from "node:assert/strict";
import { buildSubmissionDraft, prepareAttempt, submitAttempt } from "@lp/core";
import { webhook } from "../../backend/src/destinations/webhook.mjs";
import { buildRegistry } from "../../backend/src/registry.mjs";
import { createBackend } from "../../backend/src/server.mjs";
import {
  intakeFields,
  intakeContext,
  intakeIntent,
  intakeManifest,
  intakeSite,
} from "../intake-fixtures.ts";
import { call } from "../http.mjs";

const quiet = { log() {}, error() {} };
const config = {
  type: "webhook",
  url: "https://crm.example.org/intake",
  idempotencyContract: "site-key-payload",
};
const goodReceipt = {
  request_id: "123e4567-e89b-42d3-a456-426614174000",
  status: "REQUEST_ACCEPTED",
  downstream_status: "CRM_ACCEPTED",
  crm_receipt_id: "crm-record-42",
};

test("browser requires a bounded canonical CRM receipt and never accepts a log acknowledgment", async () => {
  const attempt = prepareAttempt(null, {}, "test");
  for (const bad of [
    { ...goodReceipt, downstream_status: "LOGGED" },
    { ...goodReceipt, crm_receipt_id: "" },
    { ...goodReceipt, crm_receipt_id: "x".repeat(161) },
    { ...goodReceipt, crm_receipt_id: "private\nline" },
    { ...goodReceipt, crm_receipt_id: undefined },
  ])
    await assert.rejects(
      () =>
        submitAttempt("service-requests", attempt, true, async () =>
          Response.json(bad),
        ),
      /receipt/i,
    );
  assert.deepEqual(
    await submitAttempt("service-requests", attempt, true, async () =>
      Response.json(goodReceipt),
    ),
    goodReceipt,
  );
});

test("CRM adapter refuses ambiguous acknowledgments and undeclared deduplication", async () => {
  const submission = {
    siteId: "a",
    idempotencyKey: "stable-key",
    payloadFingerprint: "a".repeat(64),
    payload: {},
  };
  for (const result of [
    {},
    { accepted: true },
    { id: "one" },
    { accepted: false, id: "one" },
    { accepted: true, id: "x\nprivate" },
  ])
    await assert.rejects(
      () =>
        webhook(config, async () => Response.json(result)).deliver(submission),
      /receipt/i,
    );
  let sent = false;
  await assert.rejects(
    () =>
      webhook({ type: "webhook", url: config.url }, async () => {
        sent = true;
        return Response.json({ accepted: true, id: "one" });
      }).deliver(submission),
    /idempotency/i,
  );
  assert.equal(sent, false);
});

test("fake CRM returns the same canonical receipt after intake memory reset using the same scoped key and fingerprint", async () => {
  const accepted = new Map();
  const transmissions = [];
  const transport = async (_url, init) => {
    const data = JSON.parse(init.body);
    const key = init.headers["Idempotency-Key"];
    transmissions.push({
      key,
      fingerprint: data.payloadFingerprint,
      trace: data.requestId,
    });
    if (accepted.has(key)) {
      assert.equal(data.payloadFingerprint, accepted.get(key).fingerprint);
      return Response.json({ accepted: true, id: accepted.get(key).id });
    }
    accepted.set(key, {
      id: "crm-canonical-1",
      fingerprint: data.payloadFingerprint,
    });
    return Response.json({ accepted: true, id: "crm-canonical-1" });
  };
  const { submissionsEnabled, ...site } = intakeSite();
  const registry = buildRegistry([
    {
      hosts: ["intake.example.org"],
      site,
      destination: { type: "log", sink() {} },
    },
  ]);
  registry.forHost("intake.example.org").destination = webhook(
    config,
    transport,
  );
  const payload = buildSubmissionDraft(
    intakeFields(),
    intakeContext(),
    intakeIntent(),
  );
  const idempotency = "123e4567-e89b-42d3-a456-426614174000";
  const receipts = [];
  for (let restart = 0; restart < 2; restart++) {
    const server = createBackend({
      registry,
      manifests: [intakeManifest],
      logger: quiet,
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const response = await call(
        `http://127.0.0.1:${server.address().port}`,
        "/api/submissions/service-requests",
        {
          method: "POST",
          host: "intake.example.org",
          body: payload,
          headers: {
            Origin: "https://intake.example.org",
            "Idempotency-Key": idempotency,
          },
        },
      );
      assert.equal(response.status, 201, response.text);
      receipts.push(response.json());
    } finally {
      server.close();
    }
  }
  assert.equal(accepted.size, 1);
  assert.deepEqual(receipts[0], receipts[1]);
  assert.equal(receipts[0].crm_receipt_id, "crm-canonical-1");
  assert.equal(transmissions[0].key, "intake-test:" + idempotency);
  assert.deepEqual(transmissions[0], transmissions[1]);
  assert.match(transmissions[0].fingerprint, /^[a-f0-9]{64}$/);
});

test("Turnstile verification rejects failed tokens before delivery and checks the server-selected hostname", async () => {
  const { verifyTurnstile } = await import("../../backend/src/spam.mjs").catch(
    () => ({ verifyTurnstile: undefined }),
  );
  assert.equal(typeof verifyTurnstile, "function");
  const options = {
    config: {
      secretEnv: "FAKE_TURNSTILE_SECRET",
      siteKeyEnv: "FAKE_TURNSTILE_SITE",
    },
    token: "fake-token",
    ip: "127.0.0.1",
    hostname: "intake.example.org",
    environment: { FAKE_TURNSTILE_SECRET: "fake-secret" },
  };
  for (const data of [
    { success: false },
    { success: true, hostname: "foreign.example.org" },
  ])
    await assert.rejects(
      () =>
        verifyTurnstile({
          ...options,
          fetcher: async () => Response.json(data),
        }),
      /spam|verification/i,
    );
  await verifyTurnstile({
    ...options,
    fetcher: async (_url, init) => {
      assert.equal(new URLSearchParams(init.body).get("secret"), "fake-secret");
      assert.equal(new URLSearchParams(init.body).get("remoteip"), "127.0.0.1");
      return Response.json({ success: true, hostname: "intake.example.org" });
    },
  });
});

test("an uncertain CRM timeout retains stable identity and retry reconciles the existing CRM record", async () => {
  let attempts = 0;
  const records = new Map();
  const traces = [];
  const destination = webhook(config, async (_url, init) => {
    const key = init.headers["Idempotency-Key"];
    const data = JSON.parse(init.body);
    traces.push({
      trace: data.requestId,
      fingerprint: data.payloadFingerprint,
    });
    if (!records.has(key)) records.set(key, "crm-existing-after-timeout");
    if (++attempts === 1)
      throw Error("Simulated lost response after CRM persistence");
    return Response.json({ accepted: true, id: records.get(key) });
  });
  const { submissionsEnabled, ...site } = intakeSite();
  const registry = buildRegistry([
    {
      hosts: ["intake.example.org"],
      site,
      destination: { type: "log", sink() {} },
    },
  ]);
  registry.forHost("intake.example.org").destination = destination;
  const server = createBackend({
    registry,
    manifests: [intakeManifest],
    logger: quiet,
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const options = {
      method: "POST",
      host: "intake.example.org",
      body: buildSubmissionDraft(
        intakeFields(),
        intakeContext(),
        intakeIntent(),
      ),
      headers: {
        Origin: "https://intake.example.org",
        "Idempotency-Key": crypto.randomUUID(),
      },
    };
    const base = `http://127.0.0.1:${server.address().port}`;
    const first = await call(
      base,
      "/api/submissions/service-requests",
      options,
    );
    assert.equal(first.status, 502);
    assert.match(first.json().error, /uncertain/);
    const retry = await call(
      base,
      "/api/submissions/service-requests",
      options,
    );
    assert.equal(retry.status, 201);
    assert.equal(retry.json().crm_receipt_id, "crm-existing-after-timeout");
    assert.equal(first.json().request_id, retry.json().request_id);
    assert.deepEqual(traces[0], traces[1]);
    assert.equal(records.size, 1);
  } finally {
    server.close();
  }
});

test("client exposes a validated failure trace without treating it as an accepted receipt", async () => {
  const attempt = prepareAttempt(null, {}, "test");
  await assert.rejects(
    () =>
      submitAttempt("service-requests", attempt, true, async () =>
        Response.json(
          { error: "Uncertain delivery", request_id: goodReceipt.request_id },
          { status: 502 },
        ),
      ),
    (error) =>
      error.requestId === goodReceipt.request_id &&
      error.message.includes("502"),
  );
});

test("logging returns only a nonaccepted transport receipt and unsupported downstream acknowledgments fail closed", async () => {
  const { submissionsEnabled, ...site } = intakeSite();
  const registry = buildRegistry([
    {
      hosts: ["intake.example.org"],
      site,
      destination: { type: "log", sink() {} },
    },
  ]);
  const server = createBackend({
    registry,
    manifests: [intakeManifest],
    logger: quiet,
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const options = () => ({
    method: "POST",
    host: "intake.example.org",
    body: buildSubmissionDraft(intakeFields(), intakeContext(), intakeIntent()),
    headers: {
      Origin: "https://intake.example.org",
      "Idempotency-Key": crypto.randomUUID(),
    },
  });
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const logged = await call(
      base,
      "/api/submissions/service-requests",
      options(),
    );
    assert.equal(logged.status, 202);
    assert.equal(logged.json().status, "DELIVERY_LOGGED");
    assert.equal(logged.json().crm_receipt_id, undefined);
    for (const result of [
      { downstreamStatus: "QUEUED", downstreamId: "legacy-trace" },
      { downstreamStatus: "CRM_ACCEPTED" },
      { downstreamStatus: "CRM_ACCEPTED", downstreamId: "x\ninvalid" },
    ]) {
      registry.forHost("intake.example.org").destination = {
        type: "legacy",
        async deliver() {
          return result;
        },
      };
      assert.equal(
        (await call(base, "/api/submissions/service-requests", options()))
          .status,
        502,
      );
    }
  } finally {
    server.close();
  }
});

test("webhook configuration rejects embedded URL credentials", () => {
  for (const url of [
    "https://user:secret@crm.example.org/intake",
    "https://user@crm.example.org/intake",
  ])
    assert.throws(() => webhook({ ...config, url }), /credential/i);
});

test("server spam verification blocks delivery and permits a fresh valid token on the same request key", async () => {
  const { submissionsEnabled, ...site } = intakeSite();
  let deliveries = 0;
  const registry = buildRegistry([
    {
      hosts: ["intake.example.org"],
      site,
      destination: {
        type: "log",
        sink() {
          deliveries++;
        },
      },
      turnstile: {
        secretEnv: "FAKE_SERVER_TURNSTILE_SECRET",
        siteKeyEnv: "FAKE_SERVER_TURNSTILE_SITE",
      },
    },
  ]);
  const server = createBackend({
    registry,
    manifests: [intakeManifest],
    logger: quiet,
    turnstileFetcher: async (_url, init) =>
      Response.json({
        success:
          new URLSearchParams(init.body).get("response") === "good-token",
        hostname: "intake.example.org",
      }),
  });
  process.env.FAKE_SERVER_TURNSTILE_SECRET = "fake-secret";
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const payload = buildSubmissionDraft(
    intakeFields(),
    intakeContext(),
    intakeIntent(),
  );
  const headers = {
    Origin: "https://intake.example.org",
    "Idempotency-Key": crypto.randomUUID(),
  };
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const send = (token) =>
      call(base, "/api/submissions/service-requests", {
        method: "POST",
        host: "intake.example.org",
        body: { ...payload, turnstileToken: token },
        headers,
      });
    assert.equal((await send("bad-token")).status, 400);
    assert.equal(deliveries, 0);
    assert.equal((await send("good-token")).status, 202);
    assert.equal(deliveries, 1);
  } finally {
    server.close();
    delete process.env.FAKE_SERVER_TURNSTILE_SECRET;
  }
});
