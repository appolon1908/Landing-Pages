import test from "node:test";
import assert from "node:assert/strict";
const contract = await import("../packages/contracts/site.ts").catch(
  () => null,
);
const submissions =
  await import("../packages/api-clients/submissions.ts").catch(() => null);
const catalog = await import("../packages/industry-templates/catalog.ts").catch(
  () => null,
);

test("five services have distinct client/provider copy in both languages", () => {
  assert.equal(typeof catalog?.getTemplate, "function");
  assert.equal(catalog!.offerings.length, 5);
  for (const slug of catalog!.offerings) {
    for (const locale of ["en", "es"] as const) {
      const client = catalog!.getTemplate(slug, "landing", locale);
      const provider = catalog!.getTemplate(slug, "business", locale);
      assert.notEqual(client.title, provider.title);
      assert.ok(client.questions.length >= 2);
      assert.ok(provider.questions.length >= 2);
      assert.notEqual(
        catalog!.getTemplate(slug, "landing", "en").title,
        catalog!.getTemplate(slug, "landing", "es").title,
      );
    }
  }
});

test("only explicit audience, locale and offering routes are accepted", () => {
  assert.equal(typeof contract?.resolvePage, "function");
  assert.deepEqual(contract!.resolvePage("/es/business/hvac-heating"), {
    locale: "es",
    audience: "business",
    offering: "hvac-heating",
    thankYou: false,
  });
  for (const path of [
    "/en/landing/unknown",
    "/fr/landing/hvac-heating",
    "/en/admin/hvac-heating",
    "/en/landing/../business/hvac-heating",
    "/en/landing/hvac-heating/extra",
  ]) {
    assert.equal(contract!.resolvePage(path), null);
  }
});

test("public site documents reject unknown fields, unsafe links and active effects", () => {
  assert.equal(typeof contract?.parseSiteContext, "function");
  const value = {
    schemaVersion: 1,
    siteId: "preview-a",
    workspaceId: "00000000-0000-4000-8000-000000000001",
    brand: { name: "Example brand", accent: "#176951" },
    publicOrigin: "http://127.0.0.1:4173",
    offerings: ["hvac-heating"],
    mode: "preview",
    submissionsEnabled: false,
  };
  assert.equal(contract!.parseSiteContext(value).siteId, "preview-a");
  for (const bad of [
    { ...value, accessToken: "secret" },
    { ...value, publicOrigin: "javascript:alert(1)" },
    { ...value, submissionsEnabled: true },
    { ...value, mode: "production" },
    { ...value, brand: { ...value.brand, html: "<script>" } },
  ]) {
    assert.throws(() => contract!.parseSiteContext(bad));
  }
});

test("retry keys stay stable after a lost response and rotate across site or payload changes", () => {
  assert.equal(typeof submissions?.prepareAttempt, "function");
  let key = 0;
  const createKey = () => `test-key-${++key}`;
  const original = submissions!.prepareAttempt(
    null,
    { name: "Example", email: "a@example.test" },
    "site-a",
    createKey,
  );
  const retry = submissions!.prepareAttempt(
    original,
    { email: "a@example.test", name: "Example" },
    "site-a",
    createKey,
  );
  assert.equal(retry.idempotencyKey, original.idempotencyKey);
  assert.notEqual(
    submissions!.prepareAttempt(
      original,
      { name: "Changed" },
      "site-a",
      createKey,
    ).idempotencyKey,
    original.idempotencyKey,
  );
  assert.notEqual(
    submissions!.prepareAttempt(
      original,
      { name: "Example", email: "a@example.test" },
      "site-b",
      createKey,
    ).idempotencyKey,
    original.idempotencyKey,
  );
});

test("only a valid durable receipt may produce accepted state", async () => {
  assert.equal(typeof submissions?.submitAttempt, "function");
  const attempt = submissions!.prepareAttempt(
    null,
    { name: "Example" },
    "site-a",
  );
  let calls = 0;
  const fetcher: typeof fetch = async () => {
    calls++;
    return Response.json(
      {
        status: "REQUEST_ACCEPTED",
        request_id: "00000000-0000-4000-8000-000000000001",
        downstream_status: "PENDING",
      },
      { status: 202 },
    );
  };
  await assert.rejects(
    () =>
      submissions!.submitAttempt("service-requests", attempt, false, fetcher),
    /disabled/i,
  );
  assert.equal(calls, 0);
  assert.equal(
    (
      await submissions!.submitAttempt(
        "service-requests",
        attempt,
        true,
        fetcher,
      )
    ).status,
    "REQUEST_ACCEPTED",
  );
  for (const response of [
    Response.json({ status: "ok" }),
    Response.json({ status: "REQUEST_ACCEPTED", request_id: "not-a-uuid" }),
    new Response("unavailable", { status: 503 }),
  ]) {
    await assert.rejects(() =>
      submissions!.submitAttempt(
        "service-requests",
        attempt,
        true,
        async () => response,
      ),
    );
  }
});

test("intake payload matches Breero fields without inventing tenant authorization", () => {
  assert.equal(typeof submissions?.buildPayload, "function");
  const fields = {
    name: "Example Person",
    email: "person@example.test",
    phone: "6175550100",
    description: "Heating repair",
    address: "12 Example Street",
    city: "Boston",
    state: "MA",
    postalCode: "02110",
    businessName: "Example HVAC",
    consent: true,
  };
  const context = {
    locale: "en" as const,
    audience: "landing" as const,
    offering: "hvac-heating",
    publicOrigin: "http://127.0.0.1:4173",
  };
  const payload = submissions!.buildPayload(fields, context);
  assert.equal(payload.service_description, fields.description);
  assert.equal(payload.policy_version, "2026-08-13-request-only");
  assert.equal(payload.marketing_email_consent, false);
  assert.equal(payload.marketing_sms_consent, false);
  assert.equal(
    payload.source_url,
    "http://127.0.0.1:4173/en/landing/hvac-heating",
  );
  assert.equal("workspace_id" in payload, false);
  assert.equal("tenant_id" in payload, false);
  assert.equal("company" in payload, false);
});
