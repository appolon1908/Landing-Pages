import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { isMain, loadCatalog, locales, root } from "./catalog.mjs";
import { validateAll } from "./validate.mjs";
export function csvCell(value) {
  let text = String(value ?? "");
  if (/^\s*[=+@\-]|^[\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export async function exportPlans(out = join(root, "marketing/out")) {
  const errors = await validateAll();
  if (errors.length) throw Error(`Export refused: ${errors.join("; ")}`);
  const pages = await loadCatalog();
  const kits = pages.map((p) =>
    JSON.parse(
      readFileSync(join(root, "marketing", p.slug, "ads.json"), "utf8"),
    ),
  );
  mkdirSync(out, { recursive: true });
  const headers = [
    "Status",
    "Campaign name",
    "Ad set name",
    "Ad name",
    "Audience",
    "Destination",
    "Locale",
    "Primary text variants JSON",
    "Headline variants JSON",
    "Description variants JSON",
    "Planning website URL",
    "CTA enum",
    "Planning CTA label",
    "Page headline",
    "Page CTA",
  ];
  for (const locale of locales) {
    const rows = kits.flatMap((kit) =>
      kit.campaigns
        .filter((x) => x.locale === locale)
        .map((x) => {
          const url = new URL(x.landingPath, "https://breero.com");
          for (const [key, value] of Object.entries(x.utm))
            url.searchParams.set(key, value);
          return [
            "DRAFT",
            x.name,
            `${x.name}|set-draft`,
            `${x.name}|creative-draft`,
            x.audience,
            x.destination,
            x.locale,
            JSON.stringify(x.primaryText),
            JSON.stringify(x.headline),
            JSON.stringify(x.description),
            url.href,
            x.cta,
            x.ctaLabel,
            x.pageHeadline,
            x.pageCta,
          ];
        }),
    );
    writeFileSync(
      join(out, `meta-bulk-${locale}.csv`),
      [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") +
        "\r\n",
    );
    writeFileSync(
      join(out, `instant-forms-${locale}.json`),
      JSON.stringify(
        kits.map((kit) => ({
          slug: kit.slug,
          locale,
          ...kit.instantForm[locale],
        })),
        null,
        2,
      ) + "\n",
    );
  }
  writeFileSync(
    join(out, "README.json"),
    JSON.stringify(
      {
        status: "DRAFT_PLANNING_EXPORT",
        adsManagerImportCertified: false,
        activationAllowed: false,
        origin: "https://breero.com",
        originSource: "user-supplied-public-domain-reference",
        originOperationalReadinessVerified: false,
        originOwnershipVerified: false,
        accountIdsIncluded: false,
        requiredBeforeImport:
          "Owner must obtain the current account-specific Ads Manager export template, map columns and review all drafts. No uploader or API transport is included.",
      },
      null,
      2,
    ) + "\n",
  );
  return {
    campaigns: kits.reduce((sum, kit) => sum + kit.campaigns.length, 0),
    out,
  };
}
if (isMain(import.meta.url)) console.log(await exportPlans());
