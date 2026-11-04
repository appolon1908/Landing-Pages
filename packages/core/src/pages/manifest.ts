/** Validated public presentation contracts. Manifests never grant CRM authority. */
export const locales = ["en", "es", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const audiences = ["landing", "business"] as const;
export type Audience = (typeof audiences)[number];
export const groups = [
  "home",
  "vehicle",
  "events-learning",
  "business",
] as const;
export type PageGroup = (typeof groups)[number];
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const accentPattern = /^#[0-9a-f]{6}$/i;
export type FAQ = { q: string; a: string };
export type SelectOption = { value: string; label: string };
export type ExtraField = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: SelectOption[];
  required: boolean;
};
export type CustomerCopy = {
  name: string;
  headline: string;
  subhead: string;
  cta: string;
  secondaryCta?: "whatsapp";
  subtypes: SelectOption[];
  urgency: { value: "today" | "this-week" | "flexible"; label: string }[];
  extraFields: ExtraField[];
  included: string[];
  excluded: string[];
  priceFactors: string[];
  steps: [string, string, string];
  faq: FAQ[];
  confirmation: string;
};
export type ProviderCopy = {
  name: string;
  headline: string;
  subhead: string;
  cta: string;
  fit: string[];
  exampleLead: {
    area: string;
    service: string;
    urgency: string;
    scope: string;
  };
  qualification: string[];
  leadModel: string;
  commercialTerms: string[];
  controls: string[];
  workflow: [string, string, string, string, string, string];
  faq: FAQ[];
  confirmation: string;
};
export type SeasonalCopy = {
  trigger: string;
  customer: Record<Locale, string>;
  provider: Record<Locale, string>;
};
export type PageManifestInput = {
  slug: string;
  accent: string;
  layout?: "customer-provider" | (string & {});
  group: PageGroup;
  pilot: boolean;
  customer: Record<Locale, CustomerCopy>;
  provider: Record<Locale, ProviderCopy>;
  seasonal: SeasonalCopy[];
  features: { serviceSelector: boolean; whatsappButton: boolean };
};
export type PageManifest = Omit<PageManifestInput, "layout"> & {
  layout: string;
  audiences: readonly Audience[];
};
export type HomeManifest = {
  kind: "home";
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};
/** Compatibility view for existing metadata, hero and form prompt consumers. */
export type PageCopy = {
  name: string;
  title: string;
  description: string;
  questions: string[];
};

function record(
  value: unknown,
  keys: readonly string[],
  where: string,
): Record<string, unknown> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some((key) => !keys.includes(key))
  )
    throw Error(`${where}: invalid or unexpected fields.`);
  return value as Record<string, unknown>;
}
function text(value: unknown, max: number, where: string): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > max ||
    /[\u0000-\u001f]/.test(value)
  )
    throw Error(`${where}: invalid text.`);
  return value;
}
function boolean(value: unknown, where: string): boolean {
  if (typeof value !== "boolean") throw Error(`${where}: expected boolean.`);
  return value;
}
function list<T>(
  value: unknown,
  min: number,
  max: number,
  where: string,
  parse: (value: unknown, where: string) => T,
): T[] {
  if (!Array.isArray(value) || value.length < min || value.length > max)
    throw Error(`${where}: invalid list length.`);
  return value.map((item, i) => parse(item, `${where}[${i}]`));
}
function texts(value: unknown, where: string, min = 1, max = 12): string[] {
  return list(value, min, max, where, (v, w) => text(v, 600, w));
}
function localized<T>(
  value: unknown,
  where: string,
  parse: (value: unknown, where: string) => T,
): Record<Locale, T> {
  const input = record(value, locales, where);
  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      parse(input[locale], `${where}.${locale}`),
    ]),
  ) as Record<Locale, T>;
}
function unique(values: string[], where: string) {
  if (new Set(values).size !== values.length)
    throw Error(`${where}: duplicate value.`);
}
function option(value: unknown, where: string): SelectOption {
  const item = record(value, ["value", "label"], where);
  const id = text(item.value, 64, where);
  if (!slugPattern.test(id)) throw Error(`${where}: invalid option value.`);
  return { value: id, label: text(item.label, 160, where) };
}
function options(value: unknown, where: string, min: number, max: number) {
  const result = list(value, min, max, where, option);
  unique(
    result.map((item) => item.value),
    where,
  );
  return result;
}
function extraField(value: unknown, where: string): ExtraField {
  const item = record(
    value,
    ["key", "label", "type", "options", "required"],
    where,
  );
  const key = text(item.key, 64, where);
  if (
    !slugPattern.test(key) ||
    !["text", "number", "date", "select"].includes(item.type as string)
  )
    throw Error(`${where}: invalid extra field.`);
  if (item.type !== "select" && item.options !== undefined)
    throw Error(`${where}: options require select.`);
  return {
    key,
    label: text(item.label, 160, where),
    type: item.type as ExtraField["type"],
    required: boolean(item.required, where),
    ...(item.type === "select"
      ? { options: options(item.options, where, 1, 20) }
      : {}),
  };
}
function faqs(value: unknown, where: string): FAQ[] {
  return list(value, 5, 8, where, (v, w) => {
    const item = record(v, ["q", "a"], w);
    return { q: text(item.q, 200, w), a: text(item.a, 600, w) };
  });
}
function customer(value: unknown, where: string): CustomerCopy {
  const item = record(
    value,
    [
      "name",
      "headline",
      "subhead",
      "cta",
      "secondaryCta",
      "subtypes",
      "urgency",
      "extraFields",
      "included",
      "excluded",
      "priceFactors",
      "steps",
      "faq",
      "confirmation",
    ],
    where,
  );
  if (item.secondaryCta !== undefined && item.secondaryCta !== "whatsapp")
    throw Error(`${where}: invalid secondary CTA.`);
  const urgency = options(item.urgency, `${where}.urgency`, 1, 3);
  if (
    urgency.some((u) => !["today", "this-week", "flexible"].includes(u.value))
  )
    throw Error(`${where}: invalid urgency.`);
  const extraFields = list(
    item.extraFields,
    0,
    3,
    `${where}.extraFields`,
    extraField,
  );
  unique(
    extraFields.map((field) => field.key),
    where,
  );
  return {
    name: text(item.name, 80, where),
    headline: text(item.headline, 80, where),
    subhead: text(item.subhead, 220, where),
    cta: text(item.cta, 40, where),
    ...(item.secondaryCta ? { secondaryCta: "whatsapp" as const } : {}),
    subtypes: options(item.subtypes, `${where}.subtypes`, 3, 8),
    urgency: urgency as CustomerCopy["urgency"],
    extraFields,
    included: texts(item.included, where),
    excluded: texts(item.excluded, where, 0),
    priceFactors: texts(item.priceFactors, where),
    steps: texts(item.steps, where, 3, 3) as CustomerCopy["steps"],
    faq: faqs(item.faq, `${where}.faq`),
    confirmation: text(item.confirmation, 600, where),
  };
}
function provider(value: unknown, where: string): ProviderCopy {
  const item = record(
    value,
    [
      "name",
      "headline",
      "subhead",
      "cta",
      "fit",
      "exampleLead",
      "qualification",
      "leadModel",
      "commercialTerms",
      "controls",
      "workflow",
      "faq",
      "confirmation",
    ],
    where,
  );
  const example = record(
    item.exampleLead,
    ["area", "service", "urgency", "scope"],
    where,
  );
  return {
    name: text(item.name, 80, where),
    headline: text(item.headline, 80, where),
    subhead: text(item.subhead, 220, where),
    cta: text(item.cta, 40, where),
    fit: texts(item.fit, where),
    exampleLead: {
      area: text(example.area, 200, where),
      service: text(example.service, 200, where),
      urgency: text(example.urgency, 200, where),
      scope: text(example.scope, 600, where),
    },
    qualification: texts(item.qualification, where),
    leadModel: text(item.leadModel, 2000, where),
    commercialTerms: texts(item.commercialTerms, where),
    controls: texts(item.controls, where),
    workflow: texts(item.workflow, where, 6, 6) as ProviderCopy["workflow"],
    faq: faqs(item.faq, `${where}.faq`),
    confirmation: text(item.confirmation, 600, where),
  };
}
/** Validate every public field; legacy two-language inputs must be explicitly migrated. */
export function definePage(value: PageManifestInput): PageManifest {
  const item = record(
    value,
    [
      "slug",
      "accent",
      "layout",
      "group",
      "pilot",
      "customer",
      "provider",
      "seasonal",
      "features",
    ],
    "manifest",
  );
  const slug = text(item.slug, 64, "slug");
  if (!slugPattern.test(slug) || slug === "home")
    throw Error("Invalid service slug.");
  if (typeof item.accent !== "string" || !accentPattern.test(item.accent))
    throw Error(`${slug}: invalid accent.`);
  const layout = item.layout ?? "customer-provider";
  if (
    typeof layout !== "string" ||
    layout.length > 40 ||
    !slugPattern.test(layout)
  )
    throw Error(`${slug}: invalid layout.`);
  if (!groups.includes(item.group as PageGroup))
    throw Error(`${slug}: invalid group.`);
  const customers = localized(item.customer, `${slug}.customer`, customer);
  const structure = (copy: CustomerCopy) =>
    JSON.stringify({
      subtypes: copy.subtypes.map((v) => v.value).sort(),
      urgency: copy.urgency.map((v) => v.value).sort(),
      extraFields: copy.extraFields
        .map((v) => ({
          key: v.key,
          type: v.type,
          required: v.required,
          options: v.options?.map((o) => o.value).sort(),
        }))
        .sort((a, b) => a.key.localeCompare(b.key)),
    });
  if (
    locales.some(
      (locale) => structure(customers[locale]) !== structure(customers.es),
    )
  )
    throw Error(`${slug}: localized form fields must agree.`);
  const features = record(
    item.features,
    ["serviceSelector", "whatsappButton"],
    `${slug}.features`,
  );
  return {
    slug,
    accent: item.accent.toLowerCase(),
    layout,
    group: item.group as PageGroup,
    pilot: boolean(item.pilot, `${slug}.pilot`),
    customer: customers,
    provider: localized(item.provider, `${slug}.provider`, provider),
    seasonal: list(item.seasonal, 0, 12, `${slug}.seasonal`, (v, w) => {
      const season = record(v, ["trigger", "customer", "provider"], w);
      return {
        trigger: text(season.trigger, 160, w),
        customer: localized(season.customer, w, (v, w) => text(v, 600, w)),
        provider: localized(season.provider, w, (v, w) => text(v, 600, w)),
      };
    }),
    features: {
      serviceSelector: boolean(features.serviceSelector, "serviceSelector"),
      whatsappButton: boolean(features.whatsappButton, "whatsappButton"),
    },
    audiences: [...audiences],
  };
}
export function getTemplate(
  manifest: PageManifest,
  audience: Audience,
  locale: Locale,
): PageCopy & { accent: string } {
  const copy =
    audience === "landing"
      ? manifest.customer[locale]
      : manifest.provider[locale];
  return {
    name: copy.name,
    title: copy.headline,
    description: copy.subhead,
    accent: manifest.accent,
    questions:
      audience === "landing"
        ? manifest.customer[locale].extraFields.length
          ? manifest.customer[locale].extraFields.map((f) => f.label)
          : manifest.customer[locale].subtypes.map((s) => s.label)
        : [...manifest.provider[locale].qualification],
  };
}
