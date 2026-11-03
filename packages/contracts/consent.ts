import type { SiteContext } from "./site.ts";
import { resolvePage } from "./site.ts";
import type { Locale } from "../industry-templates/catalog.ts";
import { profileForSite } from "../compliance/preview.ts";
import { policyPath } from "../compliance/pages.ts";

export type SmsChoices = { transactionalSms: boolean; marketingSms: boolean };
export type ConsentContext = {
  site: SiteContext;
  locale: Locale;
  sourcePath: string;
  phone: string;
};
export type ConsentIntent = {
  schemaVersion: 1;
  recordType: "browser-preference-intent";
  collectionMode: "preview";
  siteId: string;
  businessName: string;
  profileRevision: string;
  programName: string | null;
  locale: Locale;
  phone: string;
  sourceUrl: string;
  clientRecordedAt: string;
  choices: SmsChoices;
  disclosures: { transactionalSms: string; marketingSms: string };
  policies: {
    privacyVersion: string;
    termsVersion: string;
    privacyUrl: string;
    termsUrl: string;
  };
};
export type ConsentSnapshot = { scope: string; intent: ConsentIntent };
export function consentPresentation(context: ConsentContext) {
  const { site, locale, sourcePath } = context;
  if (!["en", "es"].includes(locale)) throw Error("Invalid consent locale.");
  const route = resolvePage(sourcePath);
  if (
    sourcePath !== "/" &&
    (!route ||
      route.thankYou ||
      route.locale !== locale ||
      !site.offerings.includes(route.offering))
  )
    throw Error("Invalid consent source page.");
  if (
    typeof context.phone !== "string" ||
    context.phone.length > 40 ||
    /[\u0000-\u001f]/.test(context.phone)
  )
    throw Error("Invalid consent phone claim.");
  const p = profileForSite(site);
  const text = (category: "transactional" | "marketing") => {
    const c = p.sms[category];
    if (!p.sms.offered || !c.offered) return "";
    return `${c.disclosure[locale]}\n${c.purposes[locale]}\n${c.frequency[locale]}\n${locale === "es" ? "Programa para mayores de 18 años. Puedes enviar la solicitud sin suscribirte a mensajes." : "Program for ages 18 and older. You can send the request without subscribing to texts."}`;
  };
  return {
    collectionMode: site.mode,
    siteId: site.siteId,
    businessName: site.brand.name,
    profileRevision: p.revision,
    programName: p.sms.programName,
    locale,
    phone: context.phone.trim(),
    sourceUrl: site.publicOrigin + sourcePath,
    offered: {
      transactionalSms: p.sms.offered && p.sms.transactional.offered,
      marketingSms: p.sms.offered && p.sms.marketing.offered,
    },
    disclosures: {
      transactionalSms: text("transactional"),
      marketingSms: text("marketing"),
    },
    policies: {
      privacyVersion: p.policies.privacy.version,
      termsVersion: p.policies.terms.version,
      privacyUrl: site.publicOrigin + policyPath(locale, "privacy-policy"),
      termsUrl: site.publicOrigin + policyPath(locale, "terms"),
    },
    identity: p.business,
    policyContent: p.policies,
    reviewState: [p.status, p.sms.wordingReview, p.sms.eligibility],
  };
}

export function reconcileConsent(
  previous: ConsentSnapshot | null,
  context: ConsentContext,
  requested?: SmsChoices,
  time = new Date().toISOString(),
): ConsentSnapshot {
  const view = consentPresentation(context);
  const scope = JSON.stringify(view);
  const same = previous?.scope === scope;
  const proposed = same
    ? requested || previous.intent.choices
    : { transactionalSms: false, marketingSms: false };
  const choices = {
    transactionalSms:
      proposed.transactionalSms === true && view.offered.transactionalSms,
    marketingSms: proposed.marketingSms === true && view.offered.marketingSms,
  };
  if (
    same &&
    choices.transactionalSms === previous.intent.choices.transactionalSms &&
    choices.marketingSms === previous.intent.choices.marketingSms
  )
    return previous;
  if (!Number.isFinite(Date.parse(time)))
    throw Error("Invalid client observation time.");
  const { offered, identity, policyContent, reviewState, ...presented } = view;
  return {
    scope,
    intent: {
      schemaVersion: 1,
      recordType: "browser-preference-intent",
      ...presented,
      clientRecordedAt: time,
      choices,
    },
  };
}
