import { uuid, pagePath, pageOrigin } from "../contracts/site.ts";
import type { Audience, Locale } from "../pages/manifest.ts";
import type { ConsentContext, ConsentIntent } from "../contracts/consent.ts";
import { consentPresentation } from "../contracts/consent.ts";
import type { IntakeFields, Attribution } from "./intake.ts";
export * from "./intake.ts";

export const submissionKinds = [
  "service-requests",
  "provider-interest",
] as const;
export type SubmissionKind = (typeof submissionKinds)[number];
export const submissionPath = (kind: SubmissionKind) =>
  `/api/submissions/${kind}`;

export type Attempt = {
  idempotencyKey: string;
  serializedPayload: string;
  context: string;
};
export function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, canonical(v)]),
    );
  return value;
}
export function prepareAttempt(
  previous: Attempt | null,
  payload: unknown,
  context: string,
  createKey = () => crypto.randomUUID() as string,
): Attempt {
  const serializedPayload = JSON.stringify(canonical(payload));
  if (!serializedPayload) throw Error("Invalid submission.");
  if (
    previous?.serializedPayload === serializedPayload &&
    previous.context === context
  )
    return previous;
  return { idempotencyKey: createKey(), serializedPayload, context };
}
export type Receipt = {
  request_id: string;
  status: "REQUEST_ACCEPTED";
  downstream_status: string;
  crm_receipt_id: string;
};
export class SubmissionError extends Error {
  requestId: string | null;
  constructor(message: string, requestId: string | null = null) {
    super(message);
    this.requestId = requestId;
  }
}
export async function submitAttempt(
  kind: SubmissionKind,
  attempt: Attempt,
  enabled: boolean,
  fetcher: typeof fetch = fetch,
): Promise<Receipt> {
  if (!enabled)
    throw Error(
      "Submissions are disabled. Your information remains in the form.",
    );
  const response = await fetcher(submissionPath(kind), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": attempt.idempotencyKey,
      "X-Correlation-ID": crypto.randomUUID(),
    },
    body: attempt.serializedPayload,
    credentials: "omit",
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    let requestId: string | null = null;
    try {
      const failure = await response.json();
      if (
        typeof failure?.request_id === "string" &&
        uuid.test(failure.request_id)
      )
        requestId = failure.request_id;
    } catch {
      /* No trusted trace is available. */
    }
    throw new SubmissionError(
      `Request was not accepted (${response.status}). Your information remains in the form.`,
      requestId,
    );
  }
  const value: unknown = await response.json();
  if (!value || typeof value !== "object")
    throw Error("Missing request receipt.");
  const receipt = value as Record<string, unknown>;
  if (
    receipt.status !== "REQUEST_ACCEPTED" ||
    typeof receipt.request_id !== "string" ||
    !uuid.test(receipt.request_id) ||
    receipt.downstream_status !== "CRM_ACCEPTED" ||
    typeof receipt.crm_receipt_id !== "string" ||
    receipt.crm_receipt_id.trim().length === 0 ||
    receipt.crm_receipt_id.length > 160 ||
    /[\u0000-\u001f\u007f]/.test(receipt.crm_receipt_id)
  )
    throw Error("Invalid request receipt.");
  return {
    request_id: receipt.request_id,
    status: "REQUEST_ACCEPTED",
    downstream_status: receipt.downstream_status,
    crm_receipt_id: receipt.crm_receipt_id,
  };
}
export function requestContactText(
  business: string,
  locale: Locale,
  audience: Audience = "landing",
): string {
  if (audience === "business")
    return locale === "fr"
      ? `J’autorise ${business} à me contacter pour examiner ma candidature et les justificatifs applicables. Cet accord n’autorise pas de promotions et n’active aucun compte.`
      : locale === "es"
        ? `Autorizo a ${business} a contactarme para revisar mi solicitud de registro y la documentación aplicable. Este permiso no autoriza promociones ni activa una cuenta.`
        : `I allow ${business} to contact me to review my application and relevant documentation. This permission does not authorize promotions or activate an account.`;
  return locale === "fr"
    ? `J’autorise ${business} à partager ma demande et mes coordonnées avec un prestataire indépendant adapté pour me contacter au sujet de ce service. Cet accord n’autorise pas de promotions et ne confirme aucun rendez-vous.`
    : locale === "es"
      ? `Autorizo a ${business} a compartir mi solicitud y mis datos de contacto con un proveedor independiente compatible para atender este servicio. Este permiso no autoriza promociones ni confirma una cita.`
      : `I allow ${business} to share my request and contact details with a suitable independent provider to contact me about this service. This permission does not authorize promotions or confirm an appointment.`;
}
export function promotionsText(business: string, locale: Locale): string {
  return locale === "fr"
    ? `Facultatif : j’accepte de recevoir des promotions de ${business}. Ce choix est distinct de ma demande de service et n’autorise pas l’envoi de SMS.`
    : locale === "es"
      ? `Opcional: acepto recibir promociones de ${business}. Esta elección es independiente de mi solicitud de servicio y no autoriza mensajes SMS.`
      : `Optional: I agree to receive promotions from ${business}. This choice is separate from my service request and does not authorize SMS.`;
}
export function buildPayload(
  fields: IntakeFields,
  context: {
    locale: Locale;
    audience: Audience;
    slug: string;
    publicOrigin: string;
    businessName?: string;
  },
): Record<string, unknown> {
  const common = {
    email: fields.email.trim(),
    phone: fields.phone.trim(),
    source_url: context.publicOrigin + pagePath(context),
    language: context.locale,
    service_contact_allowed: fields.consent,
    promotions_allowed: fields.promotions,
    contact_disclosure: requestContactText(
      context.businessName || "Breero",
      context.locale,
      context.audience,
    ),
    promotions_disclosure: promotionsText(
      context.businessName || "Breero",
      context.locale,
    ),
  };
  return context.audience === "landing"
    ? {
        ...common,
        name: fields.name.trim(),
        service_slug: context.slug,
        service_description: fields.description.trim(),
        subtype: fields.subtype,
        zone: fields.zone,
        urgency: fields.urgency,
        extra_fields: { ...fields.extraFields },
        contact_preference: fields.contactPreference,
      }
    : {
        ...common,
        business_name: fields.businessName.trim(),
        contact_name: fields.name.trim(),
        trade: context.slug,
        zones: [...fields.zones],
        operating_hours: fields.operatingHours.trim(),
        supported_subtypes: [...fields.supportedSubtypes],
        capacity_per_week: Number(fields.capacity),
        languages: [...fields.languages],
        insurance: fields.insurance,
        service_radius_km: fields.serviceRadiusKm?.trim()
          ? Number(fields.serviceRadiusKm)
          : null,
        job_size: (fields.jobSize ?? "").trim(),
        professional_qualifications: (fields.credentials ?? "").trim(),
        quote_process: (fields.quoteProcess ?? "").trim(),
        commercial_preferences: (fields.commercialPreferences ?? "").trim(),
      };
}

export function buildSubmissionDraft(
  fields: IntakeFields,
  context: ConsentContext & {
    audience: Audience;
    slug: string;
    attribution?: Attribution;
  },
  consentIntent: ConsentIntent,
) {
  if (
    context.sourcePath !== pagePath(context) ||
    context.phone.trim() !== fields.phone.trim()
  )
    throw Error(
      "Consent context does not match the submitted audience, page or phone.",
    );
  const expected = consentPresentation(context);
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
  ] as const)
    if (
      JSON.stringify(canonical(consentIntent[key])) !==
      JSON.stringify(canonical(expected[key]))
    )
      throw Error(
        "Consent intent does not match the displayed business and notice context.",
      );
  const payload = buildPayload(fields, {
    ...context,
    publicOrigin: pageOrigin(context.site, context.slug),
    businessName: context.site.brand.name,
  });
  const common = {
    schemaVersion: 3 as const,
    consentIntent,
    attribution: context.attribution ?? { landing_path: context.sourcePath },
  };
  return context.audience === "landing"
    ? { ...common, request: payload }
    : { ...common, application: payload };
}
