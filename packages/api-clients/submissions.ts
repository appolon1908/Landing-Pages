import { uuid } from "../contracts/site.ts";
import type { Audience, Locale } from "../industry-templates/catalog.ts";

export type Attempt = {
  idempotencyKey: string;
  serializedPayload: string;
  context: string;
};
function canonical(value: unknown): unknown {
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
};
export async function submitAttempt(
  kind: "service-requests" | "provider-interest",
  attempt: Attempt,
  enabled: boolean,
  fetcher: typeof fetch = fetch,
): Promise<Receipt> {
  if (!enabled)
    throw Error(
      "Submissions are disabled. Your information remains in the form.",
    );
  const response = await fetcher(`/api/public-submissions/${kind}`, {
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
  if (!response.ok)
    throw Error(
      `Request was not accepted (${response.status}). Your information remains in the form.`,
    );
  const value: unknown = await response.json();
  if (!value || typeof value !== "object")
    throw Error("Missing request receipt.");
  const receipt = value as Record<string, unknown>;
  if (
    receipt.status !== "REQUEST_ACCEPTED" ||
    typeof receipt.request_id !== "string" ||
    !uuid.test(receipt.request_id) ||
    typeof receipt.downstream_status !== "string" ||
    !/^[A-Z_]{1,80}$/.test(receipt.downstream_status)
  )
    throw Error("Invalid request receipt.");
  return {
    request_id: receipt.request_id,
    status: "REQUEST_ACCEPTED",
    downstream_status: receipt.downstream_status,
  };
}
export type IntakeFields = {
  name: string;
  email: string;
  phone: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  businessName: string;
  consent: boolean;
};
export const consentText = {
  en: "I agree that BREERO may contact me about this request. I understand this is not a confirmed appointment.",
  es: "Acepto que BREERO me contacte sobre esta solicitud. Entiendo que esto no es una cita confirmada.",
};
export function buildPayload(
  fields: IntakeFields,
  context: {
    locale: Locale;
    audience: Audience;
    offering: string;
    publicOrigin: string;
  },
): Record<string, unknown> {
  const common = {
    email: fields.email.trim(),
    phone: fields.phone.trim(),
    city: fields.city.trim(),
    state: fields.state,
    postal_code: fields.postalCode.trim(),
    source_url: `${context.publicOrigin}/${context.locale}/${context.audience}/${context.offering}`,
    language: context.locale,
    transactional_contact_allowed: fields.consent,
    transactional_email_consent: false,
    transactional_sms_consent: false,
    marketing_email_consent: false,
    marketing_sms_consent: false,
    policy_version: "2026-08-13-request-only",
    consent_source: "landing-pages-preview",
    consent_disclosures: fields.consent
      ? { transactional_contact: consentText[context.locale] }
      : {},
  };
  return context.audience === "landing"
    ? {
        ...common,
        name: fields.name.trim(),
        service_slug: context.offering,
        service_description: fields.description.trim(),
        address_line1: fields.address.trim(),
        contact_preference: "email",
      }
    : {
        ...common,
        business_name: fields.businessName.trim(),
        contact_name: fields.name.trim(),
        service_categories: [context.offering],
        notes: fields.description.trim(),
      };
}
