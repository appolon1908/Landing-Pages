import test from "node:test";
import assert from "node:assert/strict";
import { definePage, getTemplate } from "@lp/core";
import { manifestInput } from "../manifest-fixture.ts";

test("manifest v2 validates all locales and preserves distinct audience metadata", () => {
  const input = manifestInput();
  const manifest = definePage(input as never);
  assert.equal(manifest.accent, "#aabbcc");
  assert.equal(manifest.layout, "customer-provider");
  assert.equal(
    getTemplate(manifest, "landing", "fr" as never).name,
    "Climatisation",
  );
  assert.equal(
    getTemplate(manifest, "business", "fr" as never).name,
    "Prestataires",
  );
  assert.equal(
    getTemplate(manifest, "landing", "es").title,
    "Tell us about the work you need",
  );
});

test("manifest v2 rejects malformed nested fields, missing locales and unknown fields", () => {
  const mutations: ((value: any) => void)[] = [
    (v) => delete v.customer.fr,
    (v) => delete v.provider.es,
    (v) => (v.customer.en.headline = "x".repeat(81)),
    (v) => (v.customer.es.subhead = "x".repeat(221)),
    (v) => (v.provider.fr.cta = "x".repeat(41)),
    (v) => v.customer.en.subtypes.pop(),
    (v) => (v.customer.en.subtypes[1].value = "repair"),
    (v) => (v.customer.fr.subtypes[0].value = "different"),
    (v) => (v.customer.en.urgency[0].value = "immediately"),
    (v) => (v.customer.en.extraFields[0].key = "../bad"),
    (v) => (v.customer.en.extraFields[0].type = "script"),
    (v) => (v.customer.en.extraFields[0].required = "yes"),
    (v) => (v.customer.en.extraFields[0].type = "select"),
    (v) => v.customer.es.steps.pop(),
    (v) => v.provider.fr.workflow.pop(),
    (v) => v.customer.en.faq.pop(),
    (v) => (v.provider.fr.faq[0].a = "x".repeat(601)),
    (v) => (v.provider.es.exampleLead.scope = ""),
    (v) => (v.provider.en.commercialTerms = []),
    (v) => (v.pilot = "yes"),
    (v) => (v.group = "unlisted"),
    (v) => (v.features.whatsappButton = "yes"),
    (v) => (v.customer.en.script = "execute"),
    (v) =>
      (v.seasonal = [
        { trigger: "rain", customer: { en: "Rain" }, provider: {} },
      ]),
    (v) => (v.copy = {}),
  ];
  for (const mutate of mutations) {
    const value = manifestInput();
    mutate(value);
    assert.throws(() => definePage(value as never), String(mutate));
  }
});
