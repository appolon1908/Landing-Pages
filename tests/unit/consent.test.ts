import { manifestInput } from "../manifest-fixture.ts";
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSubmissionDraft,
  prepareAttempt,
  reconcileConsent,
  submitAttempt,
} from "@lp/core";
import type { ConsentContext } from "@lp/core";
import { fields, site } from "../fixtures.ts";

const time = "2026-10-29T14:00:00.000Z";
const context = (): ConsentContext => ({
  site: site({
    siteId: "one",
    brand: { name: "Merchant One", accent: "#176951" },
  }),
  locale: "en",
  sourcePath: "/en/landing/hvac-heating",
  phone: "+1 809 555 0100",
});

test("SMS categories start false and all four combinations stay distinct", () => {
  const ctx = context();
  const initial = reconcileConsent(null, ctx, undefined, time);
  assert.deepEqual(initial.intent.choices, {
    transactionalSms: false,
    marketingSms: false,
  });
  for (const transactionalSms of [false, true])
    for (const marketingSms of [false, true]) {
      const next = reconcileConsent(
        initial,
        ctx,
        { transactionalSms, marketingSms },
        time,
      );
      assert.deepEqual(next.intent.choices, { transactionalSms, marketingSms });
      assert.equal(
        next.intent.sourceUrl,
        "https://fixture.example.org/en/landing/hvac-heating",
      );
      assert.equal(next.intent.siteId, "one");
      assert.match(next.intent.disclosures.transactionalSms, /Merchant One/);
    }
});

test("unchanged retries preserve intent time and idempotency key", () => {
  const ctx = context();
  const chosen = reconcileConsent(
    reconcileConsent(null, ctx, undefined, time),
    ctx,
    { transactionalSms: true, marketingSms: false },
    time,
  );
  const repeated = reconcileConsent(
    chosen,
    ctx,
    chosen.intent.choices,
    "2026-10-29T14:05:00.000Z",
  );
  assert.equal(repeated, chosen);
  const first = prepareAttempt(null, { consentIntent: chosen.intent }, "one");
  assert.equal(
    prepareAttempt(first, { consentIntent: repeated.intent }, "one")
      .idempotencyKey,
    first.idempotencyKey,
  );
  assert.notEqual(
    prepareAttempt(first, { consentIntent: repeated.intent }, "two")
      .idempotencyKey,
    first.idempotencyKey,
  );
});

test("business, source, locale, program and wording changes require fresh selections", () => {
  const ctx = context();
  const chosen = reconcileConsent(
    reconcileConsent(null, ctx, undefined, time),
    ctx,
    { transactionalSms: true, marketingSms: true },
    time,
  );
  for (const change of [
    (x: any) => (x.site.siteId = "two"),
    (x: any) => (
      (x.locale = "es"),
      (x.sourcePath = "/es/landing/hvac-heating")
    ),
    (x: any) => (x.sourcePath = "/en/business/hvac-heating"),
    (x: any) => (x.phone = "6175550101"),
    (x: any) => (x.site.compliance.revision = "new-revision"),
    (x: any) => (x.site.compliance.sms.programName = "Another program"),
    (x: any) =>
      (x.site.compliance.sms.transactional.disclosure.en += " Changed."),
    (x: any) =>
      (x.site.compliance.policies.privacy.sections[0].body.en += " Changed."),
    (x: any) => (x.site.brand.name = "Merchant Two"),
  ]) {
    const changed = structuredClone(ctx);
    change(changed);
    assert.deepEqual(
      reconcileConsent(chosen, changed, chosen.intent.choices, time).intent
        .choices,
      {
        transactionalSms: false,
        marketingSms: false,
      },
    );
  }
});

test("unoffered categories cannot be selected and unsafe source paths are rejected", () => {
  const ctx = context();
  ctx.site.compliance.sms.marketing.offered = false;
  const next = reconcileConsent(
    reconcileConsent(null, ctx, undefined, time),
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
    "/en/landing/not-on-this-site",
    "/en/landing/hvac-heating/thank-you",
  ])
    assert.throws(
      () => reconcileConsent(null, { ...ctx, sourcePath }, undefined, time),
      sourcePath,
    );
});

test("request contact does not grant SMS; drafts carry the page slug and site origin", async () => {
  const ctx = context();
  const snapshot = reconcileConsent(null, ctx, undefined, time);
  const draft = buildSubmissionDraft(
    fields,
    { ...ctx, audience: "landing", slug: "hvac-heating" },
    snapshot.intent,
  );
  assert.equal(draft.schemaVersion, 3);
  assert.ok("request" in draft);
  assert.equal(draft.request.service_contact_allowed, true);
  assert.equal(draft.request.promotions_allowed, false);
  assert.equal(draft.consentIntent.choices.transactionalSms, false);
  assert.equal(draft.request.service_slug, "hvac-heating");
  assert.equal(
    draft.request.source_url,
    "https://fixture.example.org/en/landing/hvac-heating",
  );
  assert.equal("tenant_id" in draft.request, false);
  const providerContext = {
    ...ctx,
    audience: "business" as const,
    slug: "hvac-heating",
    sourcePath: "/en/business/hvac-heating",
  };
  const provider = buildSubmissionDraft(
    fields,
    providerContext,
    reconcileConsent(null, providerContext, undefined, time).intent,
  );
  assert.ok("application" in provider);
  assert.equal(provider.application.trade, "hvac-heating");
  assert.throws(() =>
    buildSubmissionDraft(
      fields,
      { ...ctx, audience: "landing", slug: "hvac-heating" },
      { ...snapshot.intent, businessName: "Other" },
    ),
  );
  let calls = 0;
  await assert.rejects(
    () =>
      submitAttempt(
        "service-requests",
        prepareAttempt(null, draft, "one"),
        false,
        async () => (calls++, Response.json({})),
      ),
    /disabled/i,
  );
  assert.equal(calls, 0);
});

test("only a valid canonical CRM receipt produces accepted state", async () => {
  const attempt = prepareAttempt(null, { a: 1 }, "ctx");
  const good = {
    request_id: "123e4567-e89b-42d3-a456-426614174000",
    status: "REQUEST_ACCEPTED",
    downstream_status: "CRM_ACCEPTED",
    crm_receipt_id: "fixture-crm-receipt",
  };
  let seen: { url: string; headers: Record<string, string> } | null = null;
  const receipt = await submitAttempt(
    "provider-interest",
    attempt,
    true,
    async (input, init) => {
      seen = {
        url: String(input),
        headers: init?.headers as Record<string, string>,
      };
      return Response.json(good, { status: 201 });
    },
  );
  assert.deepEqual(receipt, good);
  assert.equal(seen!.url, "/api/submissions/provider-interest");
  assert.equal(seen!.headers["Idempotency-Key"], attempt.idempotencyKey);
  for (const bad of [
    {},
    { ...good, status: "PENDING" },
    { ...good, request_id: "x" },
    { ...good, downstream_status: "lower case" },
  ])
    await assert.rejects(() =>
      submitAttempt("service-requests", attempt, true, async () =>
        Response.json(bad),
      ),
    );
  await assert.rejects(
    () =>
      submitAttempt(
        "service-requests",
        attempt,
        true,
        async () => new Response("", { status: 503 }),
      ),
    /503/,
  );
});

test("pages on their own origin use that origin for consent, payload and canonical URLs", async () => {
  const ctx: ConsentContext = {
    ...context(),
    sourcePath: "/en/landing/chimney-fireplace",
  };
  const snapshot = reconcileConsent(null, ctx, undefined, time);
  assert.equal(
    snapshot.intent.sourceUrl,
    "https://chimney.example.org/en/landing/chimney-fireplace",
  );
  const draft = buildSubmissionDraft(
    fields,
    { ...ctx, audience: "landing", slug: "chimney-fireplace" },
    snapshot.intent,
  );
  assert.ok("request" in draft);
  assert.equal(
    draft.request.source_url,
    "https://chimney.example.org/en/landing/chimney-fireplace",
  );
  const { pageMetadata, definePage } = await import("@lp/core");
  const manifest = definePage({
    ...manifestInput(),
    slug: "chimney-fireplace",
  } as never);
  assert.equal(
    pageMetadata(
      ctx.site,
      {
        locale: "es",
        audience: "landing",
        slug: "chimney-fireplace",
        thankYou: false,
      },
      manifest,
    ).canonical,
    "https://chimney.example.org/es/landing/chimney-fireplace",
  );
});
