import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  buildSubmissionDraft,
  parseSiteContext,
  previewCompliance,
  reconcileConsent,
  createIntakeFields,
  definePage,
} from "@lp/core";
import { manifestInput } from "./manifest-fixture.ts";
import type {
  Audience,
  IntakeFields,
  Locale,
  PageManifest,
  SiteContext,
} from "@lp/core";

export const workspaceId = "00000000-0000-4000-8000-000000000001";

export function siteDocument(overrides: Record<string, unknown> = {}) {
  const brand =
    (overrides.brand as { name: string } | undefined)?.name ??
    "Fixture Services";
  return {
    schemaVersion: 3,
    siteId: "fixture",
    workspaceId,
    marketId: "do-santo-domingo",
    brand: { name: "Fixture Services", accent: "#176951" },
    publicOrigin: "https://fixture.example.org",
    pages: [
      {
        slug: "hvac-heating",
        origin: null,
        label: { en: "Heating", es: "Calefacción", fr: "Chauffage" },
      },
      {
        slug: "chimney-fireplace",
        origin: "https://chimney.example.org",
        label: null,
      },
    ],
    mode: "preview",
    submissionsEnabled: false,
    compliance: previewCompliance(brand),
    ...overrides,
  };
}
export const site = (overrides: Record<string, unknown> = {}): SiteContext =>
  parseSiteContext(siteDocument(overrides));

export const fields: IntakeFields = {
  ...createIntakeFields(),
  name: "Ada Lovelace",
  email: "ada@example.org",
  phone: "+1 809 555 0100",
  description: "The AC needs an assessment.",
  subtype: "repair",
  zone: "distrito-nacional",
  urgency: "flexible",
  extraFields: {},
  contactPreference: "email",
  zones: ["distrito-nacional"],
  operatingHours: "Weekdays by agreement",
  supportedSubtypes: ["repair"],
  capacity: "2",
  languages: ["es", "en"],
  insurance: "na",
  businessName: "Ada Heating LLC",
  consent: true,
};
export const fixtureManifests = () =>
  ["hvac-heating", "chimney-fireplace"].map((slug) =>
    definePage({ ...manifestInput(), slug } as never),
  );

/** A full browser-shaped submission envelope for a site/page. */
export function envelope(
  context: SiteContext,
  slug: string,
  audience: Audience = "landing",
  locale: Locale = "en",
  choices = { transactionalSms: true, marketingSms: false },
) {
  const consentContext = {
    site: context,
    locale,
    phone: fields.phone,
    sourcePath: `/${locale}/${audience}/${slug}`,
  };
  const snapshot = reconcileConsent(
    reconcileConsent(null, consentContext),
    consentContext,
    choices,
  );
  return buildSubmissionDraft(
    fields,
    { ...consentContext, audience, slug },
    snapshot.intent,
  );
}

export async function loadManifests(): Promise<PageManifest[]> {
  const dirs = (await readdir("pages", { withFileTypes: true })).filter(
    (d) => d.isDirectory() && d.name !== "home",
  );
  const out: PageManifest[] = [];
  for (const d of dirs)
    out.push(
      (
        await import(
          pathToFileURL(resolve("pages", d.name, "page.config.ts")).href
        )
      ).default as PageManifest,
    );
  return out;
}
