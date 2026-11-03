import test from "node:test";
import assert from "node:assert/strict";
import * as core from "@lp/core";
import {
  intakeFields,
  intakeContext,
  intakeIntent,
  intakeManifest,
  reverseKeys,
} from "../intake-fixtures.ts";

test("customer v3 draft keeps optional email empty and separates service permission from promotions", () => {
  const draft = core.buildSubmissionDraft(
    intakeFields() as never,
    intakeContext(),
    intakeIntent(),
  ) as any;
  assert.equal(draft.schemaVersion, 3);
  assert.equal(draft.request.email, "");
  assert.equal(draft.request.service_contact_allowed, true);
  assert.equal(draft.request.promotions_allowed, false);
  assert.equal(draft.request.subtype, "repair");
  assert.equal(draft.request.zone, "distrito-nacional");
  assert.equal(draft.application, undefined);
  for (const legacy of ["address_line1", "postal_code", "state", "tenant_id"])
    assert.equal(legacy in draft.request, false);
});

test("provider v3 draft uses application with declared capacity and service preferences", () => {
  const fields = { ...intakeFields(), email: "provider@example.org" };
  const draft = core.buildSubmissionDraft(
    fields as never,
    intakeContext("business", "fr"),
    intakeIntent("business", "fr"),
  ) as any;
  assert.equal(draft.schemaVersion, 3);
  assert.equal(draft.request, undefined);
  assert.equal(draft.application.trade, "hvac");
  assert.deepEqual(draft.application.zones, ["distrito-nacional"]);
  assert.equal(draft.application.capacity_per_week, 2);
  assert.deepEqual(draft.application.languages, ["es"]);
});

test("provider optional profile is bounded, preserves zero radius and does not grant payment authority", () => {
  const fields = {
    ...intakeFields(),
    email: "provider@example.org",
    serviceRadiusKm: "0",
    jobSize: "Small jobs",
    credentials: "Declared training",
    quoteProcess: "Assessment before quote",
    commercialPreferences: "Manual acceptance",
  };
  const draft = core.buildSubmissionDraft(
    fields as never,
    intakeContext("business"),
    intakeIntent("business"),
  ) as any;
  assert.equal(draft.application.service_radius_km, 0);
  assert.equal(
    draft.application.professional_qualifications,
    "Declared training",
  );
  assert.equal(draft.application.commercial_preferences, "Manual acceptance");
  assert.equal("payment_authorized" in draft.application, false);
  const validate = (core as any).validateIntakeFields;
  assert.equal(
    validate({ ...fields, serviceRadiusKm: "501" }, intakeContext("business"))
      .serviceRadiusKm,
    "number",
  );
  assert.equal(
    validate(
      { ...fields, credentials: "x".repeat(501) },
      intakeContext("business"),
    ).credentials,
    "length",
  );
});

test("equivalent reordered consent is accepted while changed wording is rejected", () => {
  const intent = reverseKeys(intakeIntent());
  assert.doesNotThrow(() =>
    core.buildSubmissionDraft(intakeFields() as never, intakeContext(), intent),
  );
  intent.policies.privacyVersion = "changed";
  assert.throws(
    () =>
      core.buildSubmissionDraft(
        intakeFields() as never,
        intakeContext(),
        intent,
      ),
    /Consent/,
  );
});

test("client rejects a provider draft carrying a customer consent source", () => {
  assert.throws(
    () =>
      core.buildSubmissionDraft(
        intakeFields() as never,
        { ...intakeContext(), audience: "business" },
        intakeIntent(),
      ),
    /Consent/,
  );
});

test("intake validation requires permission, Dominican phone and email only for email contact", () => {
  const validate = (core as any).validateIntakeFields;
  assert.equal(typeof validate, "function");
  const context = intakeContext();
  assert.deepEqual(validate(intakeFields(), context), {});
  assert.equal(
    validate({ ...intakeFields(), consent: false }, context).consent,
    "required",
  );
  assert.equal(
    validate({ ...intakeFields(), phone: "6175550100" }, context).phone,
    "phone",
  );
  assert.equal(
    validate({ ...intakeFields(), contactPreference: "email" }, context).email,
    "email",
  );
  assert.equal(
    validate({ ...intakeFields(), zone: "foreign-zone" }, context).zone,
    "choice",
  );
  assert.equal(
    validate({ ...intakeFields(), subtype: "not-offered" }, context).subtype,
    "choice",
  );
  assert.equal(
    validate({ ...intakeFields(), extraFields: { unrelated: "x" } }, context)
      .extraFields,
    "choice",
  );
});

test("textarea line breaks are valid while required conditional text cannot contain only whitespace", () => {
  const validate = (core as any).validateIntakeFields;
  assert.deepEqual(
    validate(
      {
        ...intakeFields(),
        description: "Equipo no enfría.\nEstá instalado en la sala.",
      },
      intakeContext(),
    ),
    {},
  );
  assert.deepEqual(
    validate(
      {
        ...intakeFields(),
        email: "provider@example.org",
        quoteProcess: "Revisar el alcance.\nPreparar la cotización.",
      },
      intakeContext("business"),
    ),
    {},
  );
  const manifest = structuredClone(intakeManifest);
  for (const locale of ["es", "en", "fr"] as const)
    manifest.customer[locale].extraFields = [
      {
        key: "safe-pickup-location",
        label: "Location",
        type: "text",
        required: true,
      },
    ];
  assert.equal(
    validate(
      { ...intakeFields(), extraFields: { "safe-pickup-location": "   " } },
      { ...intakeContext(), manifest },
      1,
    )["extra:safe-pickup-location"],
    "required",
  );
  assert.equal(
    validate(
      { ...intakeFields(), description: "Text\u0000invalid" },
      intakeContext(),
    ).description,
    "length",
  );
});

test("attribution capture keeps only bounded allowed query fields and an unqueried landing path", () => {
  const capture = (core as any).captureAttribution;
  assert.equal(typeof capture, "function");
  assert.deepEqual(
    capture(
      "https://intake.example.org/es/landing/hvac?utm_source=meta&email=private&fbclid=abc#private",
    ),
    {
      utm_source: "meta",
      fbclid: "abc",
      landing_path: "/es/landing/hvac",
    },
  );
  const value = capture(
    "https://intake.example.org/?utm_campaign=" +
      "x".repeat(600) +
      "&utm_medium=paid%0Aprivate",
  );
  assert.deepEqual(value, { landing_path: "/" });
});

test("fresh intake state contains no implicit permissions and clearing consent preserves entered details", () => {
  const make = (core as any).createIntakeFields;
  const clear = (core as any).clearIntakeConsent;
  assert.equal(typeof make, "function");
  assert.equal(typeof clear, "function");
  const fields = make();
  assert.equal(fields.consent, false);
  assert.equal(fields.promotions, false);
  fields.name = "Example";
  fields.zone = "distrito-nacional";
  fields.consent = true;
  fields.promotions = true;
  clear(fields);
  assert.equal(fields.name, "Example");
  assert.equal(fields.zone, "distrito-nacional");
  assert.equal(fields.consent, false);
  assert.equal(fields.promotions, false);
});
