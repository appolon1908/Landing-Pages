import {
  definePage,
  parseSiteContext,
  previewCompliance,
  reconcileConsent,
} from "@lp/core";
import { manifestInput } from "./manifest-fixture.ts";

export const intakeManifest = definePage(manifestInput() as never);
export const intakeSite = () =>
  parseSiteContext({
    schemaVersion: 3,
    siteId: "intake-test",
    workspaceId: "00000000-0000-4000-8000-000000000003",
    marketId: "do-santo-domingo",
    brand: { name: "Example Services", accent: "#176951" },
    publicOrigin: "https://intake.example.org",
    pages: ["hvac"],
    mode: "live",
    submissionsEnabled: true,
    compliance: previewCompliance("Example Services"),
  });
export const intakeFields = () => ({
  name: "Example Customer",
  businessName: "Example Services",
  email: "",
  phone: "+1 809 555 0100",
  description: "The air conditioner needs an assessment.",
  subtype: "repair",
  zone: "distrito-nacional",
  urgency: "flexible",
  extraFields: { equipment: "Split system" },
  contactPreference: "whatsapp",
  consent: true,
  promotions: false,
  zones: ["distrito-nacional"],
  operatingHours: "Weekdays by agreement",
  supportedSubtypes: ["repair"],
  capacity: "2",
  languages: ["es"],
  insurance: "na",
  // Legacy shape is included only to let the red test reach the version assertion.
  address: "",
  city: "",
  state: "",
  postalCode: "",
});
export function intakeContext(
  audience: "landing" | "business" = "landing",
  locale: "es" | "en" | "fr" = "es",
) {
  return {
    site: intakeSite(),
    manifest: intakeManifest,
    audience,
    locale,
    slug: "hvac",
    phone: "+1 809 555 0100",
    sourcePath: `/${locale}/${audience}/hvac`,
  };
}
export function intakeIntent(
  audience: "landing" | "business" = "landing",
  locale: "es" | "en" | "fr" = "es",
) {
  return reconcileConsent(null, intakeContext(audience, locale)).intent;
}
export const reverseKeys = (value: any): any =>
  Array.isArray(value)
    ? value.map(reverseKeys)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.entries(value)
            .reverse()
            .map(([key, child]) => [key, reverseKeys(child)]),
        )
      : value;
