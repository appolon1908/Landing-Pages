import type { Locale, PageManifest, HomeManifest } from "../pages/manifest.ts";
import { getTemplate, locales, defaultLocale } from "../pages/manifest.ts";
import type { PageRoute, HomeRoute, SiteContext } from "../contracts/site.ts";
import { pagePath, pageOrigin } from "../contracts/site.ts";
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
const labels: Record<DocumentName, Record<Locale, string>> = {
  about: { fr: "À propos", en: "About", es: "Acerca del negocio" },
  contact: { fr: "Contact", en: "Contact", es: "Contacto" },
  "privacy-policy": {
    fr: "Politique de confidentialité",
    en: "Privacy Policy",
    es: "Política de privacidad",
  },
  terms: {
    fr: "Conditions et programme SMS",
    en: "Terms and SMS Program",
    es: "Términos y programa SMS",
  },
  refunds: {
    fr: "Prix, remboursements et annulations",
    en: "Prices, Refunds and Cancellations",
    es: "Precios, reembolsos y cancelaciones",
  },
  shipping: {
    fr: "Expédition et livraison",
    en: "Shipping and Delivery",
    es: "Envíos y entrega",
  },
  subscriptions: {
    fr: "Abonnements et paiements récurrents",
    en: "Subscriptions and Recurring Charges",
    es: "Suscripciones y cargos recurrentes",
  },
  cookies: {
    fr: "Cookies et suivi",
    en: "Cookies and Tracking",
    es: "Cookies y seguimiento",
  },
  "privacy-rights": {
    fr: "Droits et choix de confidentialité",
    en: "Privacy Rights and Choices",
    es: "Derechos y opciones de privacidad",
  },
  disclosures: {
    fr: "Informations commerciales",
    en: "Commercial Disclosures",
    es: "Divulgaciones comerciales",
  },
  email: {
    fr: "Préférences de courriel",
    en: "Email Preferences",
    es: "Preferencias de correo",
  },
};
export function documentLabel(name: DocumentName, locale: Locale): string {
  return labels[name][locale];
}
export function policyPath(locale: Locale, name: DocumentName): string {
  return `/${locale}/${name}`;
}
export function resolvePolicy(path: string): PolicyRoute | null {
  const match = /^\/(es|en|fr)\/([a-z-]+)\/?$/.exec(path);
  return match && documentNames.includes(match[2] as DocumentName)
    ? { locale: match[1] as Locale, document: match[2] as DocumentName }
    : null;
}
export function businessDetails(site: SiteContext, locale: Locale) {
  const p = profileForSite(site);
  const b = p.business;
  const es = locale === "es";
  const fr = locale === "fr";
  const legalLine = b.legalName
    ? b.dbaName
      ? fr
        ? `${b.dbaName} est un nom commercial de ${b.legalName}.`
        : es
          ? `${b.dbaName} es un nombre comercial de ${b.legalName}.`
          : `${b.dbaName} is a trading name of ${b.legalName}.`
      : fr
        ? `Exploité par ${b.legalName}.`
        : es
          ? `Operado por ${b.legalName}.`
          : `Operated by ${b.legalName}.`
    : fr
      ? "Les informations de l’entreprise sont en attente de vérification."
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
    draft: p.status === "draft",
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
  const fr = route.locale === "fr";
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
        heading: fr
          ? "Assistance clientèle"
          : es
            ? "Atención al cliente"
            : "Customer support",
        body:
          [b.email, b.phone, b.address].filter(Boolean).join("\n") ||
          (fr
            ? "L’entreprise doit fournir des coordonnées vérifiées avant de recevoir des demandes. Cet aperçu ne transmet aucune donnée."
            : es
              ? "El negocio debe proporcionar contactos verificados antes de recibir solicitudes. Esta vista previa no envía datos."
              : "The business must provide verified contacts before accepting requests. This preview does not submit information."),
      });
    if (p.sms.offered)
      sections.push({
        key: "program",
        heading: fr
          ? "Messages texte"
          : es
            ? "Mensajes de texto"
            : "Text messaging",
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
  route: PageRoute | PolicyRoute | HomeRoute,
  manifest?: PageManifest | HomeManifest,
) {
  let title: string, description: string, path: string;
  let origin = site.publicOrigin;
  if ("document" in route) {
    const document = getPolicyDocument(site, route);
    if (!document) throw Error("Document unavailable.");
    title = document.title;
    description = document.description;
    path = policyPath(route.locale, route.document);
  } else if ("home" in route) {
    if (!manifest || !("kind" in manifest) || manifest.kind !== "home")
      throw Error("Homepage manifest required.");
    title = manifest.title[route.locale];
    description = manifest.description[route.locale];
    path = `/${route.locale}/`;
  } else {
    if (!manifest || "kind" in manifest || manifest.slug !== route.slug)
      throw Error("Page manifest required for landing metadata.");
    const template = getTemplate(manifest, route.audience, route.locale);
    title = template.name;
    description = template.description;
    path = pagePath(route);
    origin = pageOrigin(site, route.slug);
  }
  return {
    title: `${title} | ${site.brand.name}`,
    description,
    locale: route.locale,
    canonical: origin + path,
    alternates: Object.fromEntries(
      [...locales, "x-default"].map((locale) => [
        locale,
        origin +
          path.replace(
            /^\/(es|en|fr)(?=\/|$)/,
            `/${locale === "x-default" ? defaultLocale : locale}`,
          ),
      ]),
    ) as Record<Locale | "x-default", string>,
  };
}
