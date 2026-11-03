import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { parseSiteContext } from "../packages/contracts/site.ts";
const compliance = await import("../packages/contracts/compliance.ts").catch(
  () => null,
);
const preview = await import("../packages/compliance/preview.ts").catch(
  () => null,
);
const pages = await import("../packages/compliance/pages.ts").catch(() => null);

function fixture() {
  assert.equal(typeof preview?.previewCompliance, "function");
  return {
    schemaVersion: 2,
    siteId: "fixture-one",
    workspaceId: "00000000-0000-4000-8000-000000000001",
    brand: { name: "Fixture Services", accent: "#176951" },
    publicOrigin: "https://fixtureservices.org",
    offerings: ["hvac-heating"],
    mode: "preview",
    submissionsEnabled: false,
    compliance: preview!.previewCompliance("Fixture Services"),
  };
}

test("versioned profiles preserve explicit drafts and reject unknown or unsafe nested fields", () => {
  assert.equal(typeof compliance?.parseComplianceProfile, "function");
  const input = fixture();
  const site = parseSiteContext(input);
  assert.equal(site.schemaVersion, 2);
  assert.equal(site.compliance?.status, "draft");
  assert.equal(site.compliance?.business.legalName, null);
  for (const mutate of [
    (p: any) => (p.accessToken = "secret"),
    (p: any) => (p.business.tenantId = "forged"),
    (p: any) => (p.business.supportEmail = "javascript:alert(1)"),
    (p: any) => (p.business.supportEmail = "support@fixtureservices.org\n"),
    (p: any) => (p.business.supportPhone = "<script>"),
    (p: any) => (p.sms.minimumAge = 0),
    (p: any) => (p.sms.marketing.defaultChecked = true),
    (p: any) => (p.policies.privacy.sections[0].html = "<b>raw</b>"),
    (p: any) => (p.policies.privacy.sections[0].body.en = "x".repeat(12001)),
    (p: any) => (p.applicability.shipping = "yes"),
  ]) {
    const invalid = structuredClone(input);
    mutate(invalid.compliance);
    assert.throws(() => parseSiteContext(invalid));
  }
  assert.throws(() => parseSiteContext({ ...input, submissionsEnabled: true }));
});

test("review-state enums reject coercible values instead of hiding draft status", () => {
  for (const [field, value] of [
    ["status", ["draft"]],
    ["status", ["reviewed"]],
    ["wordingReview", ["draft"]],
    ["wordingReview", ["reviewed"]],
    ["eligibility", ["unreviewed"]],
    ["eligibility", ["eligible"]],
    ["eligibility", ["restricted"]],
  ] as const) {
    const input = fixture();
    if (field === "status") (input.compliance as any)[field] = value;
    else (input.compliance.sms as any)[field] = value;
    assert.throws(() => parseSiteContext(input), field);
  }
});

test("website readiness reports missing facts and cannot confer publication authority", () => {
  const site = parseSiteContext(fixture());
  const result = compliance!.assessWebsite(site);
  assert.equal(result.readyForReview, false);
  assert.equal(result.publicationAuthorized, false);
  for (const code of [
    "profile-draft",
    "legal-name",
    "support-email",
    "support-phone",
    "applicability",
    "sms-wording",
    "sms-eligibility",
  ])
    assert.ok(
      result.blockers.some((x) => x.code === code),
      code,
    );
  assert.ok(result.externalChecks.length > 0);
});

test("reviewed profile still rejects placeholder contacts and missing conditional policies", () => {
  const input = fixture();
  input.compliance.status = "reviewed";
  input.compliance.revision = "2026-10-29-reviewed";
  input.compliance.policies.privacy.version = "2026-10-29-reviewed";
  input.compliance.policies.terms.version = "2026-10-29-reviewed";
  input.compliance.business.legalName = "Fixture Services LLC";
  input.compliance.business.supportEmail = "support@fixtureservices.org";
  input.compliance.business.supportPhone = "+18002468246";
  input.compliance.business.address = "123 Fixture Avenue";
  input.compliance.sms.wordingReview = "reviewed";
  input.compliance.sms.eligibility = "eligible";
  for (const key of Object.keys(input.compliance.applicability))
    (input.compliance.applicability as any)[key] = false;
  assert.equal(
    compliance!.assessWebsite(parseSiteContext(input)).readyForReview,
    true,
  );
  input.compliance.business.supportEmail = "support@example.com";
  input.compliance.applicability.shipping = true;
  input.compliance.applicability.commerce = true;
  const result = compliance!.assessWebsite(parseSiteContext(input));
  assert.equal(result.readyForReview, false);
  assert.ok(result.blockers.some((x) => x.code === "placeholder-contact"));
  assert.ok(result.blockers.some((x) => x.path === "policies.shipping"));
  assert.ok(result.blockers.some((x) => x.path === "policies.refunds"));
});

test("legacy preview remains available but never gains a complete profile implicitly", () => {
  const { compliance: omitted, ...input } = fixture();
  const site = parseSiteContext({ ...input, schemaVersion: 1 });
  assert.equal(site.schemaVersion, 1);
  assert.equal(compliance!.assessWebsite(site).readyForReview, false);
  assert.ok(
    compliance!
      .assessWebsite(site)
      .blockers.some((x) => x.code === "legacy-profile"),
  );
  assert.equal(
    pages!.getPolicyDocument(site, { locale: "en", document: "privacy-policy" })
      ?.businessName,
    "Fixture Services",
  );
});

test("policy routes and metadata are explicit, localized and business-specific", () => {
  assert.equal(typeof pages?.resolvePolicy, "function");
  const site = parseSiteContext(fixture());
  assert.deepEqual(pages!.resolvePolicy("/es/privacy-policy"), {
    locale: "es",
    document: "privacy-policy",
  });
  for (const path of [
    "/fr/terms",
    "/en/unknown",
    "/en/privacy-policy/extra",
    "/en/../terms",
  ])
    assert.equal(pages!.resolvePolicy(path), null);
  const route = { locale: "es" as const, document: "terms" as const };
  const document = pages!.getPolicyDocument(site, route)!;
  assert.match(document.title, /Términos/);
  assert.equal(document.businessName, "Fixture Services");
  const meta = pages!.pageMetadata(site, route);
  assert.equal(meta.canonical, "https://fixtureservices.org/es/terms");
  assert.equal(meta.alternates.en, "https://fixtureservices.org/en/terms");
  assert.equal(
    pages!.getPolicyDocument(site, { locale: "en", document: "shipping" }),
    null,
  );
});

test("required policy sections are checked rather than inferred from a document title", () => {
  const input = fixture();
  input.compliance.policies.privacy.sections = [];
  input.compliance.policies.terms.sections = [];
  const result = compliance!.assessWebsite(parseSiteContext(input));
  assert.ok(result.blockers.some((x) => x.path === "policies.privacy.sharing"));
  assert.ok(result.blockers.some((x) => x.path === "policies.terms.stop"));
  assert.ok(result.blockers.some((x) => x.path === "policies.terms.age"));
});

test("conditional policy links require both explicit applicability and content", () => {
  const input = fixture();
  input.compliance.policies.shipping = {
    version: "2026-10-29-reviewed",
    updatedOn: "2026-10-29",
    sections: [
      {
        key: "delivery",
        title: { en: "Delivery", es: "Entrega" },
        body: {
          en: "Shipping terms for the fixture business.",
          es: "Condiciones de envío del negocio de prueba.",
        },
      },
    ],
  };
  assert.equal(
    pages!.getPolicyDocument(parseSiteContext(input), {
      locale: "en",
      document: "shipping",
    }),
    null,
  );
  input.compliance.applicability.shipping = true;
  const site = parseSiteContext(input);
  assert.equal(
    pages!.getPolicyDocument(site, { locale: "es", document: "shipping" })
      ?.sections[0].heading,
    "Entrega",
  );
  assert.ok(
    pages!.documentLinks(site, "es").some((x) => x.href === "/es/shipping"),
  );
});

test("bundled previews pass structural checking but fail strict business-readiness checking", () => {
  const script = new URL("../scripts/check_compliance.ts", import.meta.url);
  const report = spawnSync(
    process.execPath,
    ["--experimental-strip-types", script.pathname, "--json"],
    { encoding: "utf8" },
  );
  assert.equal(report.status, 0, report.stderr);
  const results = JSON.parse(report.stdout).results;
  assert.equal(results.length, 2);
  assert.ok(
    results.every(
      (x: any) =>
        !x.readyForReview && !x.publicationAuthorized && x.blockers.length > 0,
    ),
  );
  const strict = spawnSync(
    process.execPath,
    ["--experimental-strip-types", script.pathname, "--strict", "--json"],
    { encoding: "utf8" },
  );
  assert.equal(strict.status, 1, strict.stderr);
});
