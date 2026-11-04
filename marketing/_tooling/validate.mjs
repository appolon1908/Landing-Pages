import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { validateSchema } from "./schema-validator.mjs";
import { checkClaims } from "./claims.mjs";
import { labels } from "./copy.mjs";
import { isMain, loadCatalog, locales, root } from "./catalog.mjs";
import { validateTemplates } from "./validate-templates.mjs";
export { loadCatalog } from "./catalog.mjs";
const schema = JSON.parse(
  readFileSync(new URL("./schema.json", import.meta.url), "utf8"),
);
export function validateKit(kit, page) {
  const errors = validateSchema(kit, schema);
  if (errors.length) return errors;
  if (kit.slug !== page.slug) errors.push("slug must match page");
  const expected = new Set(
    locales
      .flatMap((locale) =>
        ["customer", "provider"].map(
          (audience) => `${audience}:${locale}:website`,
        ),
      )
      .concat(["customer:es:instant_form", "customer:es:whatsapp"]),
  );
  for (const campaign of kit.campaigns) {
    const { locale, audience, destination } = campaign;
    const key = `${audience}:${locale}:${destination}`;
    if (!expected.delete(key))
      errors.push(`duplicate or unexpected campaign ${key}`);
    const copy = page[audience][locale];
    if (
      campaign.pageHeadline !== copy.headline ||
      campaign.pageCta !== copy.cta
    )
      errors.push(`${key}: stale page headline/CTA snapshot`);
    if (
      campaign.headline.some((text) => text !== copy.cta && text !== copy.name)
    )
      errors.push(
        `${key}: short headline must be exact approved page CTA or service name`,
      );
    const cta =
      destination === "whatsapp"
        ? "WHATSAPP_MESSAGE"
        : audience === "customer"
          ? "GET_QUOTE"
          : "APPLY_NOW";
    if (campaign.cta !== cta || campaign.ctaLabel !== labels[locale].cta[cta])
      errors.push(`${key}: CTA enum/locale/audience mismatch`);
    if (
      campaign.landingPath !==
      `/${locale}/${audience === "customer" ? "landing" : "business"}/${page.slug}`
    )
      errors.push(`${key}: incorrect page destination`);
    const name = `DO|santo-domingo|${page.slug}|${audience}|base|evergreen|${destination}-v1-${locale}`;
    if (campaign.name !== name || campaign.utm.utm_campaign !== name)
      errors.push(`${key}: incorrect campaign naming or attribution`);
    errors.push(
      ...checkClaims({
        primaryText: campaign.primaryText,
        headline: campaign.headline,
        description: campaign.description,
      }),
    );
  }
  if (expected.size)
    errors.push(`missing campaigns: ${[...expected].join(", ")}`);
  for (const locale of locales) {
    const form = kit.instantForm[locale];
    if (form.privacyPolicyPath !== `/${locale}/privacy-policy`)
      errors.push(`${locale}: incorrect privacy path`);
    if (
      JSON.stringify(form.questions[0].options) !==
      JSON.stringify(page.customer[locale].subtypes.map((x) => x.label))
    )
      errors.push(`${locale}: instant form subtype choices differ from page`);
    if (
      JSON.stringify(form.questions[1].options) !==
      JSON.stringify(page.customer[locale].urgency.map((x) => x.label))
    )
      errors.push(`${locale}: instant form timing choices differ from page`);
    if (
      form.questions.map((x) => x.kind).join(",") !==
      "multiple_choice,multiple_choice,full_name,phone,short_text"
    )
      errors.push(`${locale}: instant form required questions missing`);
    errors.push(...checkClaims({ form, whatsapp: kit.whatsapp[locale] }));
  }
  errors.push(...checkClaims(kit.creativeBriefs));
  const briefs = kit.creativeBriefs.map(
    (x) => `${x.type}:${x.audience}:${x.concept}`,
  );
  for (const key of [
    "image:customer:problem-scope",
    "vertical-video-9x16:customer:service-explainer",
    "image:provider:partnership",
    "image:customer:seasonal-planning",
  ])
    if (!briefs.includes(key)) errors.push(`Missing creative brief ${key}`);
  for (const brief of kit.creativeBriefs)
    for (const locale of locales) {
      if (brief.copyOverlay[locale] !== page[brief.audience][locale].cta)
        errors.push(`${locale}: stale creative overlay`);
      if (
        brief.type === "vertical-video-9x16" &&
        (brief.durationSec !== 15 || brief.shots[locale].length !== 3)
      )
        errors.push(
          `${locale}: video needs three shots and fifteen-second draft duration`,
        );
    }
  return errors;
}
export async function validateAll() {
  const pages = await loadCatalog(),
    errors = [];
  try {
    errors.push(
      ...validateTemplates(
        JSON.parse(
          readFileSync(
            join(root, "marketing/_whatsapp/templates.json"),
            "utf8",
          ),
        ),
      ),
    );
  } catch (e) {
    errors.push(`notification templates: ${e.message}`);
  }
  const dirs = readdirSync(join(root, "marketing"), { withFileTypes: true })
    .filter(
      (x) => x.isDirectory() && !x.name.startsWith("_") && x.name !== "out",
    )
    .map((x) => x.name)
    .sort();
  if (JSON.stringify(dirs) !== JSON.stringify(pages.map((x) => x.slug).sort()))
    errors.push(
      "Marketing service folders must match exactly thirty canonical pages",
    );
  for (const page of pages) {
    try {
      const kit = JSON.parse(
        readFileSync(join(root, "marketing", page.slug, "ads.json"), "utf8"),
      );
      errors.push(...validateKit(kit, page).map((x) => `${page.slug}: ${x}`));
    } catch (e) {
      errors.push(`${page.slug}: ${e.message}`);
    }
  }
  return errors;
}
if (isMain(import.meta.url)) {
  const errors = await validateAll();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      "Marketing validation passed: 30 draft kits, 240 campaigns; no activation or import certification.",
    );
}
