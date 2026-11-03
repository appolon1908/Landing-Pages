import test from "node:test";
import assert from "node:assert/strict";
import * as core from "@lp/core";
import { site as siteDocument } from "../fixtures.ts";
import { manifestInput } from "../manifest-fixture.ts";

test("French service, homepage and policy routes remain distinct", () => {
  assert.deepEqual(core.resolvePage("/fr/landing/hvac"), {
    locale: "fr",
    audience: "landing",
    slug: "hvac",
    thankYou: false,
  });
  assert.deepEqual(core.resolveHome("/fr/"), { home: true, locale: "fr" });
  assert.equal(core.resolveHome("/fr/landing/hvac"), null);
  assert.equal(core.resolveHome("/de/"), null);
  assert.equal(core.resolvePage("/fr/"), null);
  assert.deepEqual(core.resolvePolicy("/fr/privacy-policy"), {
    locale: "fr",
    document: "privacy-policy",
  });
});

test("French draft policies and consent use French disclosures and retain draft status", () => {
  const site = siteDocument();
  const doc = core.getPolicyDocument(site, {
    locale: "fr",
    document: "privacy-policy",
  });
  assert.equal(doc?.title, "Politique de confidentialité");
  assert.equal(doc?.draft, true);
  assert.ok(doc?.sections.length);
  assert.ok(
    doc?.sections.every(
      (s) => typeof s.heading === "string" && typeof s.body === "string",
    ),
  );
  const contact = core.getPolicyDocument(site, {
    locale: "fr",
    document: "contact",
  });
  assert.equal(
    contact?.sections.find((section) => section.key === "support")?.heading,
    "Assistance clientèle",
  );
  const consent = core.consentPresentation({
    site,
    locale: "fr",
    phone: "+18095550100",
    sourcePath: "/fr/landing/hvac-heating",
  });
  assert.match(consent.disclosures.transactionalSms, /facultatif|facultative/i);
  assert.match(consent.policies.privacyUrl, /\/fr\/privacy-policy$/);
});

test("metadata has three locale alternatives and Spanish x-default on each page origin", () => {
  const manifest = core.definePage(manifestInput() as never);
  const site = siteDocument({
    pages: [{ slug: "hvac", origin: "https://ac.example.org", label: null }],
  });
  const meta = core.pageMetadata(
    site,
    { locale: "fr", audience: "business", slug: "hvac", thankYou: false },
    manifest,
  );
  assert.equal(meta.canonical, "https://ac.example.org/fr/business/hvac");
  assert.equal(meta.alternates.es, "https://ac.example.org/es/business/hvac");
  assert.equal(meta.alternates.fr, "https://ac.example.org/fr/business/hvac");
  assert.equal(
    meta.alternates["x-default"],
    "https://ac.example.org/es/business/hvac",
  );
  const home = core.pageMetadata(
    site,
    { home: true, locale: "fr" },
    {
      kind: "home",
      title: { es: "Inicio", en: "Home", fr: "Accueil" },
      description: { es: "Vista previa", en: "Preview", fr: "Aperçu" },
    },
  );
  assert.equal(home.canonical, "https://fixture.example.org/fr/");
});
