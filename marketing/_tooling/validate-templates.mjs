import { readFileSync } from "node:fs";
import { validateSchema } from "./schema-validator.mjs";
import { labels } from "./copy.mjs";
import { locales } from "./catalog.mjs";
import { checkClaims } from "./claims.mjs";
const schema = JSON.parse(
  readFileSync(new URL("./templates-schema.json", import.meta.url), "utf8"),
);
export const notificationKinds = [
  "request_received",
  "provider_missing_details",
  "provider_application_received",
  "application_approved_next_steps",
  "seasonal_offer",
  "reengagement",
];
export function validateTemplates(value) {
  const errors = validateSchema(value, schema);
  if (errors.length) return errors;
  const expected = new Set(
    notificationKinds.flatMap((kind) =>
      locales.map((locale) => `${kind}:${locale}`),
    ),
  );
  for (const item of value.templates) {
    const key = `${item.kind}:${item.language}`;
    if (!expected.delete(key))
      errors.push(`duplicate or unexpected notification ${key}`);
    const triggers = {
      request_received: "crm.request_accepted",
      provider_missing_details: "crm.provider_details_requested",
      provider_application_received: "crm.application_accepted",
      application_approved_next_steps: "crm.application_review_approved",
      seasonal_offer: "crm.marketing_audience_approved",
      reengagement: "crm.reengagement_audience_approved",
    };
    if (item.trigger !== triggers[item.kind])
      errors.push(`${key}: incorrect authoritative CRM trigger`);
    errors.push(...checkClaims(item.body));
    const marketing = ["seasonal_offer", "reengagement"].includes(item.kind);
    if (
      item.category !== (marketing ? "MARKETING" : "UTILITY") ||
      item.requiredPermission !==
        (marketing ? "promotions_whatsapp" : "transactional_whatsapp")
    )
      errors.push(`${key}: category/permission mismatch`);
    if (item.name !== `breero_${item.kind}_${item.language}`)
      errors.push(`${key}: incorrect template name`);
    if (item.optOut !== labels[item.language].stop)
      errors.push(`${key}: missing localized opt-out`);
    const variables = [
      ...new Set(
        [...item.body.matchAll(/\{\{(\d+)\}\}/g)].map((x) => Number(x[1])),
      ),
    ].sort((a, b) => a - b);
    if (
      variables.length !== item.samples.length ||
      variables.some((v, i) => v !== i + 1) ||
      variables.length === 0
    )
      errors.push(`${key}: missing or noncontiguous variable samples`);
    if (item.body.replace(/\{\{\d+\}\}/g, "").includes("{{"))
      errors.push(`${key}: malformed variable`);
    if (item.buttons.length !== 1 || item.buttons[0].text !== "STOP")
      errors.push(`${key}: required STOP quick reply missing`);
  }
  if (expected.size)
    errors.push(`missing notification templates: ${[...expected].join(", ")}`);
  return errors;
}
