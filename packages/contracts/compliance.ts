import type { SiteContext } from "./site.ts";

export type LocalizedText = { en: string; es: string };
export const policyKinds = [
  "privacy",
  "terms",
  "refunds",
  "shipping",
  "subscriptions",
  "cookies",
  "privacy-rights",
  "disclosures",
  "email",
] as const;
export type PolicyKind = (typeof policyKinds)[number];
export const applicabilityKeys = [
  "commerce",
  "shipping",
  "recurringBilling",
  "advertisingTracking",
  "privacyRights",
  "endorsements",
  "regulated",
  "emailMarketing",
] as const;
export type Applicability = (typeof applicabilityKeys)[number];
export type PolicyContent = {
  version: string;
  updatedOn: string;
  sections: { key: string; title: LocalizedText; body: LocalizedText }[];
};
export type SmsCategory = {
  offered: boolean;
  purposes: LocalizedText;
  frequency: LocalizedText;
  disclosure: LocalizedText;
};
export type ComplianceProfile = {
  schemaVersion: 1;
  revision: string;
  status: "draft" | "reviewed";
  business: {
    legalName: string | null;
    dbaName: string | null;
    description: LocalizedText;
    supportEmail: string | null;
    supportPhone: string | null;
    address: string | null;
  };
  policies: { privacy: PolicyContent; terms: PolicyContent } & Partial<
    Record<PolicyKind, PolicyContent>
  >;
  sms: {
    offered: boolean;
    programName: string | null;
    minimumAge: 18;
    wordingReview: "draft" | "reviewed";
    eligibility: "unreviewed" | "eligible" | "restricted";
    transactional: SmsCategory;
    marketing: SmsCategory;
  };
  applicability: Record<Applicability, boolean | null>;
};

function object(
  value: unknown,
  keys: readonly string[],
): Record<string, unknown> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some((key) => !keys.includes(key))
  )
    throw Error("Invalid or unexpected compliance field.");
  return value as Record<string, unknown>;
}
function plain(value: unknown, max = 12000): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
  )
    throw Error("Invalid compliance text.");
  return value;
}
function optional(value: unknown, max: number): string | null {
  return value === null ? null : plain(value, max);
}
function localized(value: unknown, max = 12000): LocalizedText {
  const item = object(value, ["en", "es"]);
  return { en: plain(item.en, max), es: plain(item.es, max) };
}
function boolean(value: unknown): boolean {
  if (typeof value !== "boolean") throw Error("Expected an explicit boolean.");
  return value;
}
function revision(value: unknown): string {
  const result = plain(value, 80);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(result))
    throw Error("Invalid policy revision.");
  return result;
}
function policy(value: unknown): PolicyContent {
  const item = object(value, ["version", "updatedOn", "sections"]);
  const date = plain(item.updatedOn, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    throw Error("Invalid policy date.");
  if (!Array.isArray(item.sections) || item.sections.length > 40)
    throw Error("Invalid policy sections.");
  const sections = item.sections.map((value) => {
    const section = object(value, ["key", "title", "body"]);
    const key = revision(section.key);
    return {
      key,
      title: localized(section.title, 200),
      body: localized(section.body),
    };
  });
  if (new Set(sections.map((x) => x.key)).size !== sections.length)
    throw Error("Duplicate policy section.");
  return { version: revision(item.version), updatedOn: date, sections };
}
function category(value: unknown): SmsCategory {
  const item = object(value, [
    "offered",
    "purposes",
    "frequency",
    "disclosure",
  ]);
  return {
    offered: boolean(item.offered),
    purposes: localized(item.purposes, 1000),
    frequency: localized(item.frequency, 500),
    disclosure: localized(item.disclosure, 4000),
  };
}

export function parseComplianceProfile(value: unknown): ComplianceProfile {
  if (JSON.stringify(value).length > 160000)
    throw Error("Compliance profile is too large.");
  const item = object(value, [
    "schemaVersion",
    "revision",
    "status",
    "business",
    "policies",
    "sms",
    "applicability",
  ]);
  if (
    item.schemaVersion !== 1 ||
    (item.status !== "draft" && item.status !== "reviewed")
  )
    throw Error("Invalid compliance version or review status.");
  const b = object(item.business, [
    "legalName",
    "dbaName",
    "description",
    "supportEmail",
    "supportPhone",
    "address",
  ]);
  const email = optional(b.supportEmail, 254);
  const phone = optional(b.supportPhone, 40);
  if (
    email &&
    (/\s/.test(email) ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i.test(email))
  )
    throw Error("Invalid support email.");
  if (
    phone &&
    (/[\r\n]/.test(phone) ||
      !/^\+?[0-9 ()-]{7,39}$/.test(phone) ||
      phone.replace(/\D/g, "").length < 7 ||
      phone.replace(/\D/g, "").length > 18)
  )
    throw Error("Invalid support phone.");
  const rawPolicies = object(item.policies, policyKinds);
  const policies: ComplianceProfile["policies"] = {
    privacy: policy(rawPolicies.privacy),
    terms: policy(rawPolicies.terms),
  };
  for (const key of policyKinds)
    if (rawPolicies[key] !== undefined)
      policies[key] = policy(rawPolicies[key]);
  const sms = object(item.sms, [
    "offered",
    "programName",
    "minimumAge",
    "wordingReview",
    "eligibility",
    "transactional",
    "marketing",
  ]);
  if (
    sms.minimumAge !== 18 ||
    (sms.wordingReview !== "draft" && sms.wordingReview !== "reviewed") ||
    (sms.eligibility !== "unreviewed" &&
      sms.eligibility !== "eligible" &&
      sms.eligibility !== "restricted")
  )
    throw Error("Invalid SMS review or eligibility settings.");
  const rawApplicability = object(item.applicability, applicabilityKeys);
  const applicability = Object.fromEntries(
    applicabilityKeys.map((key) => [
      key,
      rawApplicability[key] === null ? null : boolean(rawApplicability[key]),
    ]),
  ) as ComplianceProfile["applicability"];
  return {
    schemaVersion: 1,
    revision: revision(item.revision),
    status: item.status,
    business: {
      legalName: optional(b.legalName, 200),
      dbaName: optional(b.dbaName, 200),
      description: localized(b.description, 4000),
      supportEmail: email,
      supportPhone: phone,
      address: optional(b.address, 500),
    },
    policies,
    sms: {
      offered: boolean(sms.offered),
      programName: optional(sms.programName, 200),
      minimumAge: 18,
      wordingReview: sms.wordingReview,
      eligibility: sms.eligibility,
      transactional: category(sms.transactional),
      marketing: category(sms.marketing),
    },
    applicability,
  };
}

export const requiredSections = {
  privacy: [
    "collection",
    "use",
    "sms",
    "cookies",
    "sharing",
    "security",
    "retention",
    "rights",
    "contact",
  ],
  terms: [
    "service",
    "sms-program",
    "frequency",
    "charges",
    "stop",
    "help",
    "rejoin",
    "carriers",
    "age",
    "privacy",
  ],
} as const;
export const conditionalPolicies: Partial<Record<Applicability, PolicyKind>> = {
  commerce: "refunds",
  shipping: "shipping",
  recurringBilling: "subscriptions",
  advertisingTracking: "cookies",
  privacyRights: "privacy-rights",
  endorsements: "disclosures",
  regulated: "disclosures",
  emailMarketing: "email",
};
export const externalChecks = [
  "Authorized publisher must verify site/domain/business grants and the exact reviewed profile revision.",
  "Business must confirm actual practices, working support channels, identity/DBA relationship, and all applicable jurisdictions.",
  "Messaging backend must validate scope, record consent durably, enforce category choices and withdrawals, and prove STOP/HELP behavior.",
  "HighLevel/carrier brand, campaign, sending-number and exact-wording approvals must be verified independently.",
];
export type WebsiteAssessment = {
  readyForReview: boolean;
  publicationAuthorized: false;
  blockers: { code: string; path: string; message: string }[];
  externalChecks: string[];
};
const placeholder = (value: string) =>
  /\[(?:company|business|insert|your)|\b(?:placeholder|pending|preview)\b|example\.(?:com|org|net)|\.(?:test|invalid|example)(?:\b|$)|localhost/i.test(
    value,
  );

export function assessWebsite(site: SiteContext): WebsiteAssessment {
  const blockers: WebsiteAssessment["blockers"] = [];
  const add = (code: string, path: string, message: string) =>
    blockers.push({ code, path, message });
  const checks = [...externalChecks];
  if (site.schemaVersion !== 2) {
    add(
      "legacy-profile",
      "schemaVersion",
      "Migrate the legacy preview to a reviewed SiteContext v2 business profile.",
    );
    return {
      readyForReview: false,
      publicationAuthorized: false,
      blockers,
      externalChecks: checks,
    };
  }
  const p = site.compliance;
  if (p.status !== "reviewed")
    add(
      "profile-draft",
      "status",
      "The business must review its complete profile and actual practices.",
    );
  if (/draft|preview|pending/i.test(p.revision))
    add(
      "draft-revision",
      "revision",
      "Replace the draft with an immutable reviewed profile revision.",
    );
  for (const [key, code] of [
    ["legalName", "legal-name"],
    ["supportEmail", "support-email"],
    ["supportPhone", "support-phone"],
  ] as const) {
    const value = p.business[key];
    if (!value)
      add(code, `business.${key}`, "Supply verified business information.");
    else if (placeholder(value))
      add(
        "placeholder-contact",
        `business.${key}`,
        "Replace preview or placeholder business details.",
      );
  }
  if (placeholder(site.brand.name))
    add(
      "placeholder-brand",
      "brand.name",
      "Use the actual registered business or declared trading name.",
    );
  if (!site.publicOrigin.startsWith("https:") || placeholder(site.publicOrigin))
    add(
      "public-website",
      "publicOrigin",
      "Supply the actual public HTTPS business origin.",
    );
  for (const kind of ["privacy", "terms"] as const) {
    if (/draft|preview|pending/i.test(p.policies[kind].version))
      add(
        "draft-policy",
        `policies.${kind}.version`,
        "Supply the reviewed policy version.",
      );
    for (const key of requiredSections[kind])
      if (!p.policies[kind].sections.some((x) => x.key === key))
        add(
          "policy-section",
          `policies.${kind}.${key}`,
          `Add the required ${key} section.`,
        );
  }
  for (const key of applicabilityKeys) {
    if (p.applicability[key] === null)
      add(
        "applicability",
        `applicability.${key}`,
        "The business must decide whether this requirement applies.",
      );
    const kind = conditionalPolicies[key];
    if (p.applicability[key] && kind && !p.policies[kind]?.sections.length)
      add(
        "conditional-policy",
        `policies.${kind}`,
        `Provide reviewed ${kind} terms for this business model.`,
      );
    if (
      p.applicability[key] &&
      kind &&
      p.policies[kind] &&
      /draft|preview|pending/i.test(p.policies[kind]!.version)
    )
      add(
        "draft-policy",
        `policies.${kind}.version`,
        "Supply the reviewed conditional policy version.",
      );
  }
  if (p.sms.offered) {
    if (!p.sms.programName || placeholder(p.sms.programName))
      add("sms-program", "sms.programName", "Supply the actual program name.");
    if (!p.sms.transactional.offered && !p.sms.marketing.offered)
      add(
        "sms-categories",
        "sms",
        "Select at least one actual program category.",
      );
    if (p.sms.wordingReview !== "reviewed")
      add(
        "sms-wording",
        "sms.wordingReview",
        "Verify the exact applicable HighLevel/business disclosure wording.",
      );
    if (p.sms.eligibility !== "eligible")
      add(
        "sms-eligibility",
        "sms.eligibility",
        "Obtain business-specific messaging eligibility review.",
      );
    for (const key of ["transactional", "marketing"] as const)
      if (p.sms[key].offered) {
        for (const locale of ["en", "es"] as const)
          if (!p.sms[key].disclosure[locale].includes(site.brand.name))
            add(
              "sms-identity",
              `sms.${key}.disclosure.${locale}`,
              "The visible disclosure must identify this site's business.",
            );
      }
  }
  if (
    p.applicability.commerce ||
    p.applicability.shipping ||
    p.applicability.emailMarketing
  )
    if (!p.business.address || placeholder(p.business.address))
      add(
        "business-address",
        "business.address",
        "Provide the applicable business postal/contact address.",
      );
  if (p.applicability.advertisingTracking)
    checks.push(
      "Optional tracking must remain blocked until the applicable consent/opt-out controls and integration are verified. This renderer installs no trackers.",
    );
  if (p.applicability.regulated)
    checks.push(
      "Obtain sector/jurisdiction review and implement any required age or eligibility verification before activation.",
    );
  if (p.applicability.emailMarketing)
    checks.push(
      "Verify sender identity, postal address, unsubscribe and suppression in the email backend.",
    );
  return {
    readyForReview: blockers.length === 0,
    publicationAuthorized: false,
    blockers,
    externalChecks: checks,
  };
}
