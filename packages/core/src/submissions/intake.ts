import dominicanMarket from "../../../../config/markets/do-santo-domingo.json" with { type: "json" };
import type { Audience, Locale, PageManifest } from "../pages/manifest.ts";
import type { SiteContext } from "../contracts/site.ts";

export type IntakeFields = {
  name: string;
  email: string;
  phone: string;
  description: string;
  businessName: string;
  subtype: string;
  zone: string;
  urgency: string;
  extraFields: Record<string, string>;
  contactPreference: "whatsapp" | "call" | "email";
  consent: boolean;
  promotions: boolean;
  zones: string[];
  operatingHours: string;
  supportedSubtypes: string[];
  capacity: string;
  languages: Locale[];
  insurance: "yes" | "no" | "na" | "";
  serviceRadiusKm?: string;
  jobSize?: string;
  credentials?: string;
  quoteProcess?: string;
  commercialPreferences?: string;
};
export type IntakeContext = {
  site: SiteContext;
  manifest: PageManifest;
  audience: Audience;
  locale: Locale;
};
export type IntakeErrors = Record<
  string,
  | "required"
  | "choice"
  | "email"
  | "phone"
  | "length"
  | "number"
  | "date"
  | "market"
>;
export function createIntakeFields(): IntakeFields {
  return {
    name: "",
    email: "",
    phone: "",
    description: "",
    businessName: "",
    subtype: "",
    zone: "",
    urgency: "",
    extraFields: {},
    contactPreference: "whatsapp",
    consent: false,
    promotions: false,
    zones: [],
    operatingHours: "",
    supportedSubtypes: [],
    capacity: "",
    languages: [],
    insurance: "",
    serviceRadiusKm: "",
    jobSize: "",
    credentials: "",
    quoteProcess: "",
    commercialPreferences: "",
  };
}
export function clearIntakeConsent(fields: IntakeFields) {
  fields.consent = false;
  fields.promotions = false;
}
export function marketFor(id: string | null | undefined) {
  return id === dominicanMarket.id ? dominicanMarket : null;
}
export function validText(
  value: unknown,
  max: number,
  min = 0,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= min &&
    value.length <= max &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}
export const validEmail = (value: unknown) =>
  validText(value, 254, 3) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export function validMultilineText(
  value: unknown,
  max: number,
  min = 0,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= min &&
    value.length <= max &&
    !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
  );
}
export function validateIntakeFields(
  fields: IntakeFields,
  context: IntakeContext,
  step?: 1 | 2,
): IntakeErrors {
  const errors: IntakeErrors = {};
  const market = marketFor(context.site.marketId);
  if (!market) return { market: "market" };
  const customer = context.manifest.customer[context.locale];
  const zoneKeys = market.zones.map((zone) => zone.value);
  const subtypeKeys = customer.subtypes.map((item) => item.value);
  const provider = context.audience === "business";
  const stringField = (key: keyof IntakeFields, max: number, min: number) => {
    if (
      !(key === "description" ? validMultilineText : validText)(
        fields[key],
        max,
        min,
      )
    )
      errors[key] = min && !fields[key] ? "required" : "length";
  };
  const list = (value: unknown, allowed: readonly string[]) =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= allowed.length &&
    new Set(value).size === value.length &&
    value.every((item) => typeof item === "string" && allowed.includes(item));
  if (step !== 2) {
    if (provider) {
      stringField("businessName", 200, 2);
      if (!list(fields.zones, zoneKeys)) errors.zones = "choice";
      stringField("operatingHours", 300, 2);
    } else {
      if (!subtypeKeys.includes(fields.subtype)) errors.subtype = "choice";
      if (!zoneKeys.includes(fields.zone)) errors.zone = "choice";
      if (!customer.urgency.some((item) => item.value === fields.urgency))
        errors.urgency = "choice";
      const extras = fields.extraFields;
      if (
        !extras ||
        typeof extras !== "object" ||
        Array.isArray(extras) ||
        Object.keys(extras).some(
          (key) => !customer.extraFields.some((field) => field.key === key),
        )
      )
        errors.extraFields = "choice";
      else
        for (const field of customer.extraFields) {
          const value = extras[field.key] ?? "";
          const key = `extra:${field.key}`;
          if (!validText(value, 300)) errors[key] = "length";
          else if (!value.trim() && field.required) errors[key] = "required";
          else if (value) {
            if (
              field.type === "select" &&
              !field.options?.some((option) => option.value === value)
            )
              errors[key] = "choice";
            if (
              field.type === "number" &&
              (!/^\d{1,7}(?:\.\d{1,2})?$/.test(value) ||
                !Number.isFinite(Number(value)))
            )
              errors[key] = "number";
            if (
              field.type === "date" &&
              (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
                !Number.isFinite(Date.parse(value)) ||
                new Date(value).toISOString().slice(0, 10) !== value)
            )
              errors[key] = "date";
          }
        }
    }
  }
  if (step !== 1 || provider) {
    stringField("name", 160, 2);
    if (
      !validText(fields.phone, 40, 7) ||
      !new RegExp(market.phonePattern).test(fields.phone.trim())
    )
      errors.phone = "phone";
    if (provider || fields.contactPreference === "email" || fields.email) {
      if (!validEmail(fields.email)) errors.email = "email";
    }
    if (!["whatsapp", "call", "email"].includes(fields.contactPreference))
      errors.contactPreference = "choice";
  }
  if (step !== 1) {
    if (provider) {
      if (!list(fields.supportedSubtypes, subtypeKeys))
        errors.supportedSubtypes = "choice";
      if (
        !/^\d{1,4}$/.test(fields.capacity) ||
        Number(fields.capacity) < 1 ||
        Number(fields.capacity) > 1000
      )
        errors.capacity = "number";
      if (!list(fields.languages, ["es", "en", "fr"]))
        errors.languages = "choice";
      if (!["yes", "no", "na"].includes(fields.insurance))
        errors.insurance = "choice";
      const radius = fields.serviceRadiusKm ?? "";
      if (
        radius !== "" &&
        (typeof radius !== "string" ||
          radius.length > 12 ||
          !/^\d+(?:\.\d+)?$/.test(radius) ||
          !Number.isFinite(Number(radius)) ||
          Number(radius) > 500)
      )
        errors.serviceRadiusKm = "number";
      for (const field of [
        "jobSize",
        "credentials",
        "quoteProcess",
        "commercialPreferences",
      ] as const)
        if (!validMultilineText(fields[field] ?? "", 500))
          errors[field] = "length";
    } else stringField("description", 3000, 5);
    if (fields.consent !== true) errors.consent = "required";
    if (typeof fields.promotions !== "boolean") errors.promotions = "choice";
  }
  return errors;
}

export const attributionLimits = {
  utm_source: 128,
  utm_medium: 128,
  utm_campaign: 128,
  utm_content: 128,
  fbclid: 256,
  landing_path: 400,
} as const;
export type Attribution = Partial<
  Record<keyof typeof attributionLimits, string>
> & { landing_path: string };
/** Capture only in caller memory. Never read or write localStorage/cookies. */
export function captureAttribution(input: string): Attribution {
  const url = new URL(input);
  const out: Attribution = {
    landing_path: validText(url.pathname, 400, 1) ? url.pathname : "/",
  };
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "fbclid",
  ] as const) {
    const value = url.searchParams.get(key);
    if (validText(value, attributionLimits[key], 1)) out[key] = value;
  }
  return out;
}
