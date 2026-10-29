import type { Locale } from "../industry-templates/catalog.ts";
import { getTemplate } from "../industry-templates/catalog.ts";
import type { PageRoute, SiteContext } from "../contracts/site.ts";
import type { PolicyKind } from "../contracts/compliance.ts";
import { conditionalPolicies } from "../contracts/compliance.ts";
import { profileForSite } from "./preview.ts";

export const documentNames = [
  "about",
  "contact",
  "privacy-policy",
  "terms",
  "refunds",
  "shipping",
  "subscriptions",
  "cookies",
  "privacy-rights",
  "disclosures",
  "email",
] as const;
export type DocumentName = (typeof documentNames)[number];
export type PolicyRoute = { locale: Locale; document: DocumentName };
export type PolicyDocument = {
  title: string;
  description: string;
  businessName: string;
  draft: boolean;
  version: string;
  updatedOn: string;
  sections: { key: string; heading: string; body: string }[];
};
const labels: Record<DocumentName, { en: string; es: string }> = {
  about: { en: "About", es: "Acerca del negocio" },
  contact: { en: "Contact", es: "Contacto" },
  "privacy-policy": { en: "Privacy Policy", es: "Política de privacidad" },
  terms: { en: "Terms and SMS Program", es: "Términos y programa SMS" },
  refunds: {
    en: "Prices, Refunds and Cancellations",
    es: "Precios, reembolsos y cancelaciones",
  },
  shipping: { en: "Shipping and Delivery", es: "Envíos y entrega" },
  subscriptions: {
    en: "Subscriptions and Recurring Charges",
    es: "Suscripciones y cargos recurrentes",
  },
  cookies: { en: "Cookies and Tracking", es: "Cookies y seguimiento" },
  "privacy-rights": {
    en: "Privacy Rights and Choices",
    es: "Derechos y opciones de privacidad",
  },
  disclosures: {
    en: "Commercial Disclosures",
    es: "Divulgaciones comerciales",
  },
  email: { en: "Email Preferences", es: "Preferencias de correo" },
};
export function documentLabel(name: DocumentName, locale: Locale): string {
  return labels[name][locale];
}
export function policyPath(locale: Locale, name: DocumentName): string {
  return `/${locale}/${name}`;
}
export function resolvePolicy(path: string): PolicyRoute | null {
  const match = /^\/(en|es)\/([a-z-]+)\/?$/.exec(path);
  return match && documentNames.includes(match[2] as DocumentName)
    ? { locale: match[1] as Locale, document: match[2] as DocumentName }
    : null;
}
export function businessDetails(site: SiteContext, locale: Locale) {
  const p = profileForSite(site);
  const b = p.business;
  const es = locale === "es";
  const legalLine = b.legalName
    ? b.dbaName
      ? es
        ? `${b.dbaName} es un nombre comercial de ${b.legalName}.`
        : `${b.dbaName} is a trading name of ${b.legalName}.`
      : es
        ? `Operado por ${b.legalName}.`
        : `Operated by ${b.legalName}.`
    : es
      ? "Datos del negocio pendientes de revisión."
      : "Business details are pending review.";
  return {
    legalLine,
    description: b.description[locale],
    email: b.supportEmail,
    phone: b.supportPhone,
    phoneHref: b.supportPhone
      ? `tel:${b.supportPhone.replace(/[^+0-9]/g, "")}`
      : null,
    address: b.address,
    program: p.sms.offered ? p.sms.programName : null,
    draft: p.status === "draft" || site.schemaVersion === 1,
  };
}
function enabled(site: SiteContext, name: DocumentName): boolean {
  if (["about", "contact", "privacy-policy", "terms"].includes(name))
    return true;
  const p = profileForSite(site);
  return Object.entries(conditionalPolicies).some(
    ([feature, kind]) =>
      kind === name &&
      p.applicability[feature as keyof typeof p.applicability] === true &&
      Boolean(p.policies[kind]?.sections.length),
  );
}
export function documentLinks(site: SiteContext, locale: Locale) {
  return documentNames
    .filter((name) => enabled(site, name))
    .map((document) => ({
      document,
      label: documentLabel(document, locale),
      href: policyPath(locale, document),
    }));
}
export function getPolicyDocument(
  site: SiteContext,
  route: PolicyRoute,
): PolicyDocument | null {
  if (!enabled(site, route.document)) return null;
  const p = profileForSite(site);
  const b = businessDetails(site, route.locale);
  const es = route.locale === "es";
  const title = documentLabel(route.document, route.locale);
  const common = {
    title,
    description: `${title} — ${site.brand.name}`,
    businessName: site.brand.name,
    draft: b.draft,
  };
  if (route.document === "about" || route.document === "contact") {
    const sections = [
      {
        key: "business",
        heading: site.brand.name,
        body: `${b.legalLine}\n\n${b.description}`,
      },
    ];
    if (route.document === "contact")
      sections.push({
        key: "support",
        heading: es ? "Atención al cliente" : "Customer support",
        body:
          [b.email, b.phone, b.address].filter(Boolean).join("\n") ||
          (es
            ? "El negocio debe proporcionar contactos verificados antes de recibir solicitudes. Esta vista previa no envía datos."
            : "The business must provide verified contacts before accepting requests. This preview does not submit information."),
      });
    if (p.sms.offered)
      sections.push({
        key: "program",
        heading: es ? "Mensajes de texto" : "Text messaging",
        body: [
          p.sms.programName,
          ...[p.sms.transactional, p.sms.marketing]
            .filter((c) => c.offered)
            .map(
              (c) => `${c.purposes[route.locale]} ${c.frequency[route.locale]}`,
            ),
        ]
          .filter(Boolean)
          .join("\n"),
      });
    return {
      ...common,
      version: p.revision,
      updatedOn: p.policies.terms.updatedOn,
      sections,
    };
  }
  const kind: PolicyKind =
    route.document === "privacy-policy" ? "privacy" : route.document;
  const source = p.policies[kind];
  if (!source) return null;
  return {
    ...common,
    version: source.version,
    updatedOn: source.updatedOn,
    sections: source.sections.map((s) => ({
      key: s.key,
      heading: s.title[route.locale],
      body: s.body[route.locale],
    })),
  };
}

export function pageMetadata(
  site: SiteContext,
  route: PageRoute | PolicyRoute,
) {
  let title: string, description: string, path: string;
  if ("document" in route) {
    const document = getPolicyDocument(site, route);
    if (!document) throw Error("Document unavailable.");
    title = document.title;
    description = document.description;
    path = policyPath(route.locale, route.document);
  } else {
    const template = getTemplate(route.offering, route.audience, route.locale);
    title = template.name;
    description = template.description;
    path = `/${route.locale}/${route.audience}/${route.offering}${route.thankYou ? "/thank-you" : ""}`;
  }
  return {
    title: `${title} | ${site.brand.name}`,
    description,
    locale: route.locale,
    canonical: site.publicOrigin + path,
    alternates: {
      en: site.publicOrigin + path.replace(/^\/(en|es)/, "/en"),
      es: site.publicOrigin + path.replace(/^\/(en|es)/, "/es"),
    },
  };
}
