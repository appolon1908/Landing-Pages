import test from "node:test";
import assert from "node:assert/strict";
import { parseSiteContext } from "../packages/contracts/site.ts";
import {
  prepareAttempt,
  submitAttempt,
} from "../packages/api-clients/submissions.ts";
const consent = await import("../packages/contracts/consent.ts").catch(
  () => null,
);
const preview = await import("../packages/compliance/preview.ts").catch(
  () => null,
);
const submissions = await import("../packages/api-clients/submissions.ts");

function context() {
  assert.equal(typeof consent?.reconcileConsent, "function");
  return {
    site: parseSiteContext({
      schemaVersion: 2,
      siteId: "one",
      workspaceId: "00000000-0000-4000-8000-000000000001",
      brand: { name: "Merchant One", accent: "#176951" },
      publicOrigin: "https://merchant-one.org",
      offerings: ["hvac-heating"],
      mode: "preview",
      submissionsEnabled: false,
      compliance: preview!.previewCompliance("Merchant One"),
    }),
    locale: "en" as const,
    sourcePath: "/",
    phone: "6175550100",
  };
}
const time = "2026-10-29T14:00:00.000Z";

test("SMS categories start false and all four deliberate combinations stay distinct", () => {
  const ctx = context();
  const initial = consent!.reconcileConsent(null, ctx, undefined, time);
  assert.deepEqual(initial.intent.choices, {
    transactionalSms: false,
    marketingSms: false,
  });
  for (const transactionalSms of [false, true])
    for (const marketingSms of [false, true]) {
      const next = consent!.reconcileConsent(
        initial,
        ctx,
        { transactionalSms, marketingSms },
        time,
      );
      assert.deepEqual(next.intent.choices, { transactionalSms, marketingSms });
      assert.equal(next.intent.sourceUrl, "https://merchant-one.org/");
      assert.equal(next.intent.siteId, "one");
      assert.match(next.intent.disclosures.transactionalSms, /Merchant One/);
      assert.doesNotMatch(next.intent.disclosures.marketingSms, /BREERO/);
    }
});

test("unchanged retries preserve original intent time and idempotency key", () => {
  const ctx = context();
  const start = consent!.reconcileConsent(null, ctx, undefined, time);
  const chosen = consent!.reconcileConsent(
    start,
    ctx,
    { transactionalSms: true, marketingSms: false },
    time,
  );
  const repeated = consent!.reconcileConsent(
    chosen,
    ctx,
    chosen.intent.choices,
    "2026-10-29T14:05:00.000Z",
  );
  assert.equal(repeated, chosen);
  assert.equal(repeated.intent.clientRecordedAt, time);
  const first = prepareAttempt(null, { consentIntent: chosen.intent }, "one");
  const retry = prepareAttempt(
    first,
    { consentIntent: repeated.intent },
    "one",
  );
  assert.equal(retry.idempotencyKey, first.idempotencyKey);
});

test("business, source, locale, program and visible wording changes require fresh selections", () => {
  const ctx = context();
  const start = consent!.reconcileConsent(null, ctx, undefined, time);
  const chosen = consent!.reconcileConsent(
    start,
    ctx,
    { transactionalSms: true, marketingSms: true },
    time,
  );
  for (const change of [
    (x: any) => (x.site.siteId = "two"),
    (x: any) => (x.locale = "es"),
    (x: any) => (x.sourcePath = "/en/landing/hvac-heating"),
    (x: any) => (x.phone = "6175550101"),
    (x: any) => (x.site.compliance.revision = "new-revision"),
    (x: any) => (x.site.compliance.sms.programName = "Another program"),
    (x: any) =>
      (x.site.compliance.sms.transactional.disclosure.en +=
        " Changed wording."),
    (x: any) =>
      (x.site.compliance.policies.privacy.sections[0].body.en +=
        " Changed policy."),
    (x: any) => (x.site.brand.name = "Merchant Two"),
  ]) {
    const changed = structuredClone(ctx);
    change(changed);
    const next = consent!.reconcileConsent(
      chosen,
      changed,
      chosen.intent.choices,
      time,
    );
    assert.deepEqual(next.intent.choices, {
      transactionalSms: false,
      marketingSms: false,
    });
  }
});

test("unoffered categories cannot be selected and unsafe collection paths are rejected", () => {
  const ctx = context();
  if (ctx.site.schemaVersion !== 2) throw Error("Expected v2");
  ctx.site.compliance.sms.marketing.offered = false;
  const start = consent!.reconcileConsent(null, ctx, undefined, time);
  const next = consent!.reconcileConsent(
    start,
    ctx,
    { transactionalSms: true, marketingSms: true },
    time,
  );
  assert.deepEqual(next.intent.choices, {
    transactionalSms: true,
    marketingSms: false,
  });
  for (const sourcePath of [
    "https://other.org/",
    "//other.org",
    "/?tenant=two",
    "/en/terms",
  ])
    assert.throws(() =>
      consent!.reconcileConsent(null, { ...ctx, sourcePath }, undefined, time),
    );
});

test("request contact does not grant SMS and successor drafts cannot use the legacy adapter", async () => {
  const ctx = context();
  const snapshot = consent!.reconcileConsent(null, ctx, undefined, time);
  const fields = {
    name: "Visitor",
    email: "visitor@example.test",
    phone: "6175550100",
    description: "Service request",
    address: "12 Test Street",
    city: "Boston",
    state: "MA",
    postalCode: "02110",
    businessName: "",
    consent: true,
  };
  const draft = submissions.buildSubmissionDraft(
    fields,
    { ...ctx, audience: "landing", offering: "hvac-heating" },
    snapshot.intent,
  );
  assert.equal(draft.schemaVersion, 2);
  assert.equal(draft.consentIntent.collectionMode, "preview");
  assert.equal(draft.request.transactional_sms_consent, false);
  assert.equal(draft.request.marketing_sms_consent, false);
  assert.deepEqual(draft.consentIntent.choices, {
    transactionalSms: false,
    marketingSms: false,
  });
  assert.equal("tenant_id" in draft.request, false);
  let calls = 0;
  await assert.rejects(
    () =>
      submitAttempt(
        "service-requests",
        prepareAttempt(null, draft, "one"),
        true,
        async () => {
          calls++;
          return Response.json({});
        },
      ),
    /adapter/i,
  );
  assert.equal(calls, 0);
});
