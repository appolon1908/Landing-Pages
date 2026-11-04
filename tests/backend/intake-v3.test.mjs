import test from "node:test";
import assert from "node:assert/strict";
import { buildSubmissionDraft, prepareAttempt } from "@lp/core";
import { validateSubmission } from "../../backend/src/validate.mjs";
import { buildRegistry } from "../../backend/src/registry.mjs";
import { createBackend } from "../../backend/src/server.mjs";
import {
  intakeFields,
  intakeContext,
  intakeIntent,
  intakeManifest,
  intakeSite,
  reverseKeys,
} from "../intake-fixtures.ts";
import { call } from "../http.mjs";

const quiet = { log() {}, error() {} };
const body = (audience = "landing") =>
  buildSubmissionDraft(
    {
      ...intakeFields(),
      email: audience === "business" ? "provider@example.org" : "",
    },
    intakeContext(audience),
    intakeIntent(audience),
  );
const validate = (payload, kind = "service-requests") =>
  validateSubmission(intakeSite(), kind, payload, { manifest: intakeManifest });

test("v3 validator accepts a canonical serialized request and rejects legacy schema explicitly", () => {
  const payload = body();
  payload.schemaVersion = 3;
  const canonical = JSON.parse(
    prepareAttempt(null, payload, "test").serializedPayload,
  );
  assert.equal(validate(canonical).route.slug, "hvac");
  assert.throws(
    () => validate({ ...payload, schemaVersion: 2 }),
    /v3|version 3|schema 3/i,
  );
});

test("v3 validator rejects foreign market choices, extra keys, stale permissions and missing required details", () => {
  const good = body();
  const changes = [
    ["zone", "foreign-zone"],
    ["subtype", "unlisted"],
    ["urgency", "immediately"],
    ["phone", "6175550100"],
    ["service_contact_allowed", false],
    ["promotions_allowed", "yes"],
    ["contact_disclosure", "I consent to anything"],
    ["extra_fields", { hidden: "private" }],
    ["email", "bad"],
    ["name", ""],
    ["unknown", "field"],
  ];
  for (const [key, value] of changes)
    assert.throws(
      () => validate({ ...good, request: { ...good.request, [key]: value } }),
      key,
    );
  assert.throws(
    () =>
      validate({
        ...good,
        request: { ...good.request, contact_preference: "email", email: "" },
      }),
    /email/i,
  );
  assert.throws(
    () =>
      validate({
        ...good,
        attribution: { email: "private@example.org", landing_path: "/" },
      }),
    /attribution/i,
  );
  assert.throws(
    () =>
      validate({
        ...good,
        consentIntent: {
          ...good.consentIntent,
          policies: { ...good.consentIntent.policies, privacyVersion: "stale" },
        },
      }),
    /Consent/,
  );
  assert.doesNotThrow(() => validate(reverseKeys(good)));
});

test("provider application validates preferences and cannot masquerade as a customer request", () => {
  const good = body("business");
  assert.equal(validate(good, "provider-interest").route.audience, "business");
  for (const [key, value] of [
    ["zones", ["foreign-zone"]],
    ["capacity_per_week", -1],
    ["supported_subtypes", ["unknown"]],
    ["languages", ["de"]],
    ["insurance", "maybe"],
    ["email", ""],
  ])
    assert.throws(
      () =>
        validate(
          { ...good, application: { ...good.application, [key]: value } },
          "provider-interest",
        ),
      key,
    );
  assert.throws(() => validate(good, "service-requests"));
});

test("server validates optional provider profile without treating preferences as billing consent", () => {
  const good = body("business");
  const application = {
    ...good.application,
    service_radius_km: 0,
    job_size: "Small projects",
    professional_qualifications: "Declared qualification",
    quote_process: "Discuss scope first",
    commercial_preferences: "Manual acceptance",
  };
  assert.equal(
    validate({ ...good, application }, "provider-interest").application
      .service_radius_km,
    0,
  );
  for (const [key, value] of [
    ["service_radius_km", -1],
    ["service_radius_km", 501],
    ["service_radius_km", "20"],
    ["professional_qualifications", "x".repeat(501)],
    ["commercial_preferences", "x\u0000private"],
    ["payment_authorized", true],
  ])
    assert.throws(
      () =>
        validate(
          { ...good, application: { ...application, [key]: value } },
          "provider-interest",
        ),
      key,
    );
});

async function running(destination = { type: "log", sink() {} }, extras = {}) {
  const { submissionsEnabled, ...site } = intakeSite();
  const registry = buildRegistry([
    { hosts: ["intake.example.org"], site, destination, ...extras },
  ]);
  const server = createBackend({
    registry,
    manifests: [intakeManifest],
    logger: quiet,
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}
const post = (base, payload, headers = {}) =>
  call(base, "/api/submissions/service-requests", {
    host: "intake.example.org",
    method: "POST",
    body: payload,
    headers: {
      "Idempotency-Key": crypto.randomUUID(),
      Origin: "https://intake.example.org",
      ...headers,
    },
  });

test("HTTP Origin is required and cannot be replaced by forwarded headers or a forged body origin", async () => {
  let deliveries = 0;
  const { server, base } = await running({
    type: "log",
    sink() {
      deliveries++;
    },
  });
  try {
    for (const origin of [
      undefined,
      "null",
      "https://evil.example",
      "https://intake.example.org/path",
    ]) {
      const headers = {
        "Idempotency-Key": crypto.randomUUID(),
        "X-Forwarded-Host": "intake.example.org",
        "X-Forwarded-Proto": "https",
      };
      if (origin !== undefined) headers.Origin = origin;
      const response = await call(base, "/api/submissions/service-requests", {
        host: "intake.example.org",
        method: "POST",
        body: body(),
        headers,
      });
      assert.equal(response.status, 403, response.text);
    }
    assert.equal(deliveries, 0);
    assert.equal((await post(base, body())).status, 202);
    assert.equal(deliveries, 1);
  } finally {
    server.close();
  }
});

test("IP and site token bucket returns Retry-After and ignores spoofed forwarded IPs", async () => {
  const { server, base } = await running(undefined, {
    rateLimit: { capacity: 2, windowMs: 600000 },
  });
  try {
    assert.equal((await post(base, body())).status, 202);
    assert.equal(
      (await post(base, body(), { "X-Forwarded-For": "1.1.1.1" })).status,
      202,
    );
    const limited = await post(base, body(), { "X-Forwarded-For": "2.2.2.2" });
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers["retry-after"]) > 0);
  } finally {
    server.close();
  }
});
