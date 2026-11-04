import {
  canonical,
  consentPresentation,
  pageOrigin,
  resolvePage,
  resolveHome,
  siteSlugs,
  submissionKinds,
  requestContactText,
  promotionsText,
  marketFor,
  validText,
  validMultilineText,
  validEmail,
  attributionLimits,
  createIntakeFields,
  validateIntakeFields,
} from "@lp/core";

export class ValidationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
const object = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
function exact(value, keys, label, optional = []) {
  if (
    !object(value) ||
    keys.some((key) => !Object.hasOwn(value, key)) ||
    Object.keys(value).some(
      (key) => !keys.includes(key) && !optional.includes(key),
    )
  )
    throw new ValidationError(`Invalid ${label} fields.`);
}
const commonKeys = [
  "email",
  "phone",
  "source_url",
  "language",
  "service_contact_allowed",
  "promotions_allowed",
  "contact_disclosure",
  "promotions_disclosure",
];
const requestKeys = [
  "name",
  "service_slug",
  "service_description",
  "subtype",
  "zone",
  "urgency",
  "extra_fields",
  "contact_preference",
];
const applicationKeys = [
  "business_name",
  "contact_name",
  "trade",
  "zones",
  "operating_hours",
  "supported_subtypes",
  "capacity_per_week",
  "languages",
  "insurance",
];
const profileKeys = [
  "service_radius_km",
  "job_size",
  "professional_qualifications",
  "quote_process",
  "commercial_preferences",
];

/** Trusted manifest is supplied by the server, never by the browser envelope. */
export function validateSubmission(site, kind, body, { manifest } = {}) {
  if (!submissionKinds.includes(kind))
    throw new ValidationError("Unknown submission kind.", 404);
  if (!object(body) || body.schemaVersion !== 3)
    throw new ValidationError(
      "Submission schema 3 is required; legacy v2 is not accepted.",
    );
  const provider = kind === "provider-interest";
  const member = provider ? "application" : "request";
  exact(
    body,
    ["schemaVersion", member, "consentIntent", "attribution"],
    "submission",
    ["turnstileToken"],
  );
  const payload = body[member];
  exact(
    payload,
    [...commonKeys, ...(provider ? applicationKeys : requestKeys)],
    member,
    provider ? profileKeys : [],
  );
  if (!validText(payload.source_url, 400, 8))
    throw new ValidationError("Invalid source URL.");
  let source;
  try {
    source = new URL(payload.source_url);
  } catch {
    throw new ValidationError("Invalid source URL.");
  }
  const route = resolvePage(source.pathname);
  if (
    !route ||
    route.thankYou ||
    source.search ||
    source.hash ||
    source.username ||
    source.password ||
    !siteSlugs(site).includes(route.slug)
  )
    throw new ValidationError("Unknown source page.");
  if (source.origin !== pageOrigin(site, route.slug))
    throw new ValidationError("Foreign source origin.");
  if ((provider ? payload.trade : payload.service_slug) !== route.slug)
    throw new ValidationError("Service does not match source page.");
  if (route.audience !== (provider ? "business" : "landing"))
    throw new ValidationError("Audience does not match submission kind.");
  if (route.locale !== payload.language)
    throw new ValidationError("Locale mismatch.");
  if (!manifest || manifest.slug !== route.slug)
    throw new ValidationError("Trusted page manifest unavailable.", 503);
  if (!marketFor(site.marketId))
    throw new ValidationError("Configured market unavailable.", 503);
  if (
    !validText(payload.email, 254) ||
    (payload.email && !validEmail(payload.email))
  )
    throw new ValidationError("Invalid field email.");
  if (
    payload.service_contact_allowed !== true ||
    typeof payload.promotions_allowed !== "boolean"
  )
    throw new ValidationError("Invalid service or promotions permission.");
  if (
    payload.contact_disclosure !==
      requestContactText(site.brand.name, route.locale, route.audience) ||
    payload.promotions_disclosure !==
      promotionsText(site.brand.name, route.locale)
  )
    throw new ValidationError("Contact disclosure mismatch.");
  const fields = {
    ...createIntakeFields(),
    email: payload.email,
    phone: payload.phone,
    name: provider ? payload.contact_name : payload.name,
    consent: payload.service_contact_allowed,
    promotions: payload.promotions_allowed,
  };
  if (provider) {
    if (
      !Number.isInteger(payload.capacity_per_week) ||
      payload.capacity_per_week < 1 ||
      payload.capacity_per_week > 1000
    )
      throw new ValidationError("Invalid provider capacity.");
    Object.assign(fields, {
      businessName: payload.business_name,
      zones: payload.zones,
      operatingHours: payload.operating_hours,
      supportedSubtypes: payload.supported_subtypes,
      capacity: String(payload.capacity_per_week),
      languages: payload.languages,
      insurance: payload.insurance,
      contactPreference: "email",
    });
    const radius = payload.service_radius_km;
    if (
      radius != null &&
      (typeof radius !== "number" ||
        !Number.isFinite(radius) ||
        radius < 0 ||
        radius > 500)
    )
      throw new ValidationError("Invalid service radius.");
    for (const key of profileKeys.filter((key) => key !== "service_radius_km"))
      if (payload[key] !== undefined && !validMultilineText(payload[key], 500))
        throw new ValidationError(`Invalid field ${key}.`);
    Object.assign(fields, {
      serviceRadiusKm: radius == null ? "" : String(radius),
      jobSize: payload.job_size ?? "",
      credentials: payload.professional_qualifications ?? "",
      quoteProcess: payload.quote_process ?? "",
      commercialPreferences: payload.commercial_preferences ?? "",
    });
  } else
    Object.assign(fields, {
      subtype: payload.subtype,
      zone: payload.zone,
      urgency: payload.urgency,
      extraFields: payload.extra_fields,
      description: payload.service_description,
      contactPreference: payload.contact_preference,
    });
  const fieldErrors = validateIntakeFields(fields, {
    site,
    manifest,
    audience: route.audience,
    locale: route.locale,
  });
  if (Object.keys(fieldErrors).length)
    throw new ValidationError(`Invalid field ${Object.keys(fieldErrors)[0]}.`);

  const attribution = body.attribution;
  if (
    !object(attribution) ||
    !Object.hasOwn(attribution, "landing_path") ||
    Object.entries(attribution).some(
      ([key, value]) =>
        !Object.hasOwn(attributionLimits, key) ||
        !validText(value, attributionLimits[key], 1),
    )
  )
    throw new ValidationError("Invalid attribution.");
  const path = attribution.landing_path;
  const firstRoute = resolvePage(path);
  if (!(
    path === "/" ||
    resolveHome(path) ||
    (firstRoute &&
      !firstRoute.thankYou &&
      siteSlugs(site).includes(firstRoute.slug))
  ))
    throw new ValidationError("Invalid attribution landing path.");

  const intent = body.consentIntent;
  exact(
    intent,
    [
      "schemaVersion",
      "recordType",
      "collectionMode",
      "siteId",
      "businessName",
      "profileRevision",
      "programName",
      "locale",
      "phone",
      "sourceUrl",
      "clientRecordedAt",
      "choices",
      "disclosures",
      "policies",
    ],
    "consent intent",
  );
  const expected = consentPresentation({
    site,
    locale: route.locale,
    phone: payload.phone,
    sourcePath: source.pathname,
  });
  for (const key of [
    "collectionMode",
    "siteId",
    "businessName",
    "profileRevision",
    "programName",
    "locale",
    "phone",
    "sourceUrl",
    "disclosures",
    "policies",
  ])
    if (
      JSON.stringify(canonical(intent[key])) !==
      JSON.stringify(canonical(expected[key]))
    )
      throw new ValidationError(`Consent intent mismatch: ${key}.`);
  exact(
    intent.choices,
    ["transactionalSms", "marketingSms"],
    "consent choices",
  );
  if (
    intent.schemaVersion !== 1 ||
    intent.recordType !== "browser-preference-intent" ||
    typeof intent.choices.transactionalSms !== "boolean" ||
    typeof intent.choices.marketingSms !== "boolean" ||
    !validText(intent.clientRecordedAt, 40, 10) ||
    !Number.isFinite(Date.parse(intent.clientRecordedAt))
  )
    throw new ValidationError("Invalid consent intent.");
  const choices = {
    transactionalSms:
      intent.choices.transactionalSms && expected.offered.transactionalSms,
    marketingSms: intent.choices.marketingSms && expected.offered.marketingSms,
  };
  return {
    [member]: payload,
    route,
    sourceOrigin: source.origin,
    consent: { ...intent, choices },
    attribution: { ...attribution },
  };
}
