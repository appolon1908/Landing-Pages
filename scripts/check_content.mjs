import { definePage } from "../packages/core/src/pages/manifest.ts";
import { checkClaims, strings } from "../marketing/_tooling/claims.mjs";
import {
  isMain,
  loadCatalog,
  locales,
} from "../marketing/_tooling/catalog.mjs";

export function checkManifestContent(page) {
  const errors = [];
  try {
    const { audiences, ...input } = page;
    definePage(input);
  } catch (e) {
    errors.push(`manifest: ${e.message}`);
  }
  errors.push(
    ...checkClaims({ customer: page.customer, provider: page.provider }),
  );
  const fictional = {
    es: /fictici[oa]/iu,
    en: /fictional/iu,
    fr: /ficti[fv]/iu,
  };
  const disclaimers = {
    es: /no significa que el cliente|no impide que el cliente|cliente.*puede.*otros|cliente.*por su cuenta/iu,
    en: /does not mean.*customer|customer.*(?:elsewhere|other providers|others)/iu,
    fr: /ne signifie pas.*client|non que le client|client.*(?:autres|ailleurs)/iu,
  };
  for (const locale of locales) {
    const provider = page.provider?.[locale];
    if (!provider) continue;
    if (
      !fictional[locale].test(
        strings(provider.exampleLead)
          .map((x) => x[1])
          .join(" "),
      )
    )
      errors.push(`${locale}: provider example must be labelled fictional`);
    if (!disclaimers[locale].test(provider.leadModel))
      errors.push(`${locale}: missing limits of exclusivity`);
    const terms = provider.commercialTerms.join(" ");
    const requiredTerms = {
      es: [
        /precio/iu,
        /aceptaci[oó]n/iu,
        /cr[eé]dito/iu,
        /pendiente|confirmaci[oó]n|OWNER/iu,
      ],
      en: [
        /price|fee/iu,
        /acceptance/iu,
        /credit/iu,
        /pending|confirmation|OWNER/iu,
      ],
      fr: [
        /prix|tarif/iu,
        /acceptation/iu,
        /avoir/iu,
        /confirmer|d[eé]finir|OWNER/iu,
      ],
    };
    for (const pattern of requiredTerms[locale])
      if (!pattern.test(terms))
        errors.push(`${locale}: missing pending commercial term ${pattern}`);
  }
  return errors;
}
export async function checkContent() {
  const pages = await loadCatalog();
  if (pages.length !== 30)
    return ["Expected exactly thirty canonical services"];
  return pages.flatMap((page) =>
    checkManifestContent(page).map((e) => `${page.slug}: ${e}`),
  );
}
if (isMain(import.meta.url)) {
  const errors = await checkContent();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      "Content check: 30 services × 2 audiences × 3 locales passed; heuristic claims scan requires human review.",
    );
}
