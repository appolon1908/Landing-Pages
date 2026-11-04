import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { isMain, loadCatalog, locales, root } from "./catalog.mjs";
import { labels } from "./copy.mjs";
export function createAdKit(page) {
  const campaigns = [];
  for (const audience of ["customer", "provider"])
    for (const locale of locales) {
      for (const destination of audience === "customer" && locale === "es"
        ? ["website", "instant_form", "whatsapp"]
        : ["website"]) {
        const copy = page[audience][locale],
          t = labels[locale];
        const cta =
          destination === "whatsapp"
            ? "WHATSAPP_MESSAGE"
            : audience === "customer"
              ? "GET_QUOTE"
              : "APPLY_NOW";
        const name = `DO|santo-domingo|${page.slug}|${audience}|base|evergreen|${destination}-v1-${locale}`;
        campaigns.push({
          audience,
          objective: "LEADS",
          destination,
          locale,
          name,
          pageHeadline: copy.headline,
          pageCta: copy.cta,
          primaryText: [
            `${copy.name}. ${t.preview}`,
            `${copy.cta}. ${t.process}`,
            `${copy.cta}. ${t.review}`,
          ],
          headline: [
            ...new Set([
              copy.cta,
              ...([...copy.name].length <= 40 ? [copy.name] : []),
            ]),
          ],
          description: [t.description],
          cta,
          ctaLabel: t.cta[cta],
          landingPath: `/${locale}/${audience === "customer" ? "landing" : "business"}/${page.slug}`,
          utm: {
            utm_source: "meta",
            utm_medium: "paid_social",
            utm_campaign: name,
            utm_content: "{{ad.name}}",
          },
        });
      }
    }
  const instantForm = {},
    whatsapp = {};
  for (const locale of locales) {
    const copy = page.customer[locale],
      t = labels[locale];
    instantForm[locale] = {
      status: "DRAFT",
      intro: `${copy.name}. ${t.intro}`,
      questions: [
        {
          kind: "multiple_choice",
          label: t.subtype,
          options: copy.subtypes.map((x) => x.label),
        },
        {
          kind: "multiple_choice",
          label: t.urgency,
          options: copy.urgency.map((x) => x.label),
        },
        { kind: "full_name", label: t.name, options: [] },
        { kind: "phone", label: t.phone, options: [] },
        { kind: "short_text", label: t.zone, options: [] },
      ],
      privacyPolicyPath: `/${locale}/privacy-policy`,
      thankYou: t.thankYou,
    };
    whatsapp[locale] = {
      prefill:
        locale === "fr"
          ? `${t.prefill} « ${copy.name} » ${t.prefillEnd}`
          : `${t.prefill} ${copy.name.toLocaleLowerCase(locale)} ${t.prefillEnd}`,
      iceBreakers: t.ice,
    };
  }
  const creativeBriefs = [
    { type: "image", audience: "customer", concept: "problem-scope" },
    {
      type: "vertical-video-9x16",
      audience: "customer",
      concept: "service-explainer",
    },
    { type: "image", audience: "provider", concept: "partnership" },
    { type: "image", audience: "customer", concept: "seasonal-planning" },
  ].map((brief) => ({
    ...brief,
    durationSec: brief.type === "image" ? 0 : 15,
    copyOverlay: Object.fromEntries(
      locales.map((locale) => [locale, page[brief.audience][locale].cta]),
    ),
    notes: Object.fromEntries(
      locales.map((locale) => [
        locale,
        `${brief.audience === "provider" ? labels[locale].partner : brief.concept === "seasonal-planning" ? labels[locale].seasonal : labels[locale].image} ${labels[locale].notes}`,
      ]),
    ),
    shots: Object.fromEntries(
      locales.map((locale) => [
        locale,
        brief.type === "image" ? [] : labels[locale].video,
      ]),
    ),
  }));
  return {
    schemaVersion: 1,
    slug: page.slug,
    status: "DRAFT",
    enabled: false,
    campaigns,
    instantForm,
    whatsapp,
    creativeBriefs,
  };
}
if (isMain(import.meta.url)) {
  for (const page of await loadCatalog()) {
    const dir = join(root, "marketing", page.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "ads.json"),
      `${JSON.stringify(createAdKit(page), null, 2)}\n`,
    );
  }
  console.log(
    "Regenerated thirty local draft kits from the current page manifests; nothing published.",
  );
}
