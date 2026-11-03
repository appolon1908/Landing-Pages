import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  assessWebsite,
  definePage,
  documentLinks,
  getPolicyDocument,
  pageMetadata,
  parseSiteContext,
  resolvePolicy,
} from "@lp/core";
import { manifestInput } from "../manifest-fixture.ts";
import { site, siteDocument } from "../fixtures.ts";

test("profiles preserve explicit drafts and reject unknown or unsafe nested fields", () => {
  const input = siteDocument();
  assert.equal(site().compliance.status, "draft");
  for (const mutate of [
    (p: any) => (p.accessToken = "secret"),
    (p: any) => (p.business.tenantId = "forged"),
    (p: any) => (p.business.supportEmail = "javascript:alert(1)"),
    (p: any) => (p.business.supportPhone = "<script>"),
    (p: any) => (p.sms.minimumAge = 0),
    (p: any) => (p.sms.marketing.defaultChecked = true),
    (p: any) => (p.policies.privacy.sections[0].html = "<b>raw</b>"),
    (p: any) => (p.policies.privacy.sections[0].body.en = "x".repeat(12001)),
    (p: any) => (p.applicability.shipping = "yes"),
    (p: any) => (p.status = ["reviewed"]),
  ]) {
    const invalid = structuredClone(input) as any;
    mutate(invalid.compliance);
    assert.throws(() => parseSiteContext(invalid));
  }
});

test("website readiness reports missing facts and never confers publication authority", () => {
  const result = assessWebsite(site());
  assert.equal(result.readyForReview, false);
  assert.equal(result.publicationAuthorized, false);
  for (const path of ["status", "business.legalName", "business.supportEmail"])
    assert.ok(
      result.blockers.some((b) => b.path === path),
      path,
    );
  const empty = siteDocument() as any;
  empty.compliance.policies.privacy.sections = [];
  empty.compliance.policies.terms.sections = [];
  const blockers = assessWebsite(parseSiteContext(empty)).blockers;
  assert.ok(blockers.some((x) => x.path === "policies.privacy.sharing"));
  assert.ok(blockers.some((x) => x.path === "policies.terms.stop"));
});

test("policy routes and metadata are explicit, localized and business-specific", async () => {
  const s = site();
  assert.deepEqual(resolvePolicy("/es/privacy-policy"), {
    locale: "es",
    document: "privacy-policy",
  });
  for (const path of [
    "/de/terms",
    "/en/unknown",
    "/en/privacy-policy/extra",
    "/en/../terms",
  ])
    assert.equal(resolvePolicy(path), null, path);
  const route = { locale: "es" as const, document: "terms" as const };
  const document = getPolicyDocument(s, route)!;
  assert.match(document.title, /Términos/);
  assert.equal(document.businessName, "Fixture Services");
  const meta = pageMetadata(s, route);
  assert.equal(meta.canonical, "https://fixture.example.org/es/terms");
  assert.equal(meta.alternates.en, "https://fixture.example.org/en/terms");
  assert.equal(
    getPolicyDocument(s, { locale: "en", document: "shipping" }),
    null,
  );
  const manifest = definePage({
    ...manifestInput(),
    slug: "hvac-heating",
  } as never);
  const landing = pageMetadata(
    s,
    {
      locale: "es",
      audience: "business",
      slug: "hvac-heating",
      thankYou: false,
    },
    manifest,
  );
  assert.equal(landing.title, "Profesionales | Fixture Services");
  assert.equal(
    landing.canonical,
    "https://fixture.example.org/es/business/hvac-heating",
  );
  assert.throws(() =>
    pageMetadata(
      s,
      { locale: "en", audience: "landing", slug: "other", thankYou: false },
      manifest,
    ),
  );
});

test("conditional policy links require both explicit applicability and content", () => {
  const input = siteDocument() as any;
  input.compliance.policies.shipping = {
    version: "2026-10-29-reviewed",
    updatedOn: "2026-10-29",
    sections: [
      {
        key: "delivery",
        title: { en: "Delivery", es: "Entrega", fr: "Livraison" },
        body: {
          en: "Shipping terms.",
          es: "Condiciones de envío.",
          fr: "Conditions de livraison.",
        },
      },
    ],
  };
  assert.equal(
    getPolicyDocument(parseSiteContext(input), {
      locale: "en",
      document: "shipping",
    }),
    null,
  );
  input.compliance.applicability.shipping = true;
  const s = parseSiteContext(input);
  assert.equal(
    getPolicyDocument(s, { locale: "es", document: "shipping" })?.sections[0]!
      .heading,
    "Entrega",
  );
  assert.ok(documentLinks(s, "es").some((x) => x.href === "/es/shipping"));
});

test("bundled registry passes structural checking but fails strict readiness", () => {
  const script = fileURLToPath(
    new URL("../../scripts/check_compliance.ts", import.meta.url),
  );
  const report = spawnSync(process.execPath, [script, "--json"], {
    encoding: "utf8",
  });
  assert.equal(report.status, 0, report.stderr);
  const results = JSON.parse(report.stdout).results;
  assert.equal(results.length, 2);
  assert.ok(
    results.every(
      (x: any) =>
        !x.readyForReview && !x.publicationAuthorized && x.blockers.length > 0,
    ),
  );
  assert.equal(
    spawnSync(process.execPath, [script, "--strict", "--json"], {
      encoding: "utf8",
    }).status,
    1,
  );
});
