# Measurement boundary — disabled proposal

There is no Pixel script, CAPI request, analytics SDK or WhatsApp transport in this preview. This document defines a future boundary; it does not enable one. The CRM remains the source of business acceptance, qualification, allocation, account state, work completion, fees and suppression. Local browser state is not a durable receipt.

| Planned event       | Required trigger                                                                                                   | Never trigger from                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `Lead`              | Backend validates a `CRM_ACCEPTED` acknowledgment with the canonical `crm_receipt_id` for the customer request     | Click, validation attempt, preview interaction, direct thank-you URL, timeout or ambiguous delivery |
| `SubmitApplication` | Backend validates a `CRM_ACCEPTED` acknowledgment with the canonical `crm_receipt_id` for the provider application | Clicking Apply, showing an application form or approving a provider account                         |
| `Contact`           | A permitted WhatsApp link click, labelled as a click                                                               | Assumed conversation, delivered message, booking or service acceptance                              |
| Future CRM outcome  | A separately approved authoritative CRM transition                                                                 | Landing-page inference or fabricated callback                                                       |

For paired browser/server events, use the same event name and request-derived event ID only after the authoritative acceptance gate passes. A local request or trace UUID alone is not evidence of CRM acceptance; the backend must validate `CRM_ACCEPTED` and its canonical `crm_receipt_id`. Meta's [maintained server-event SDK](https://github.com/meta/facebook-nodejs-business-sdk/blob/main/src/objects/serverside/server-event.js) documents that these fields identify matching events (checked 2026-11-03). A click-only `Contact` needs its own unique click ID, not a fabricated request ID. Provider-specific deduplication does not make CRM delivery durable or exactly once. No persistence or retry guarantee is implied by this proposal.

## Proposed type contract, not runtime implementation

```ts
type MeasurementDraft = {
  enabled: false;
  eventName: "Lead" | "SubmitApplication" | "Contact";
  eventId: string;
  locale: "es" | "en" | "fr";
  serviceSlug: string; // must match the canonical catalog
  zoneGroup: string; // approved coarse enum; never an entered address
  contactHashes?: { phoneSha256?: string; emailSha256?: string };
};
```

Any future adapter must have an explicit allowlist of these fields and reject unknown fields. Do not forward job descriptions, question answers, names, precise addresses, arbitrary URLs/query strings, free text, consent wording or CRM notes. Phone/email normalization and SHA-256 hashing must follow the selected provider's current specification, and only occur after the required measurement permission and policy review. Hashes remain personal data; hashing is not permission or anonymization. Separate operational messaging permission from promotions and measurement permission.

The adapter must fail closed in preview, on missing consent or configuration, on unknown tenant/host, on unavailable suppression state and on unconfirmed CRM acceptance. Tests must use a fake transport and prove zero outbound calls for every denied condition. No actual adapter or transport is part of this task.

The owner must verify the data source, current API version, permissions, approved events, consent controls, retention, data processing obligations and destination before enabling anything. No access token belongs in browser code or source. The current [deduplication documentation](https://developers.facebook.com/documentation/ads-commerce/conversions-api/deduplicate-pixel-and-server-events) returned HTTP 429 during this check; verify it again before implementation or activation.

The [WhatsApp messaging policy](https://whatsappbusiness.com/policy/) requires recipient permission, respected opt-outs and approved templates outside the user-message service window. Website submission or link click does not start that window. See the localized operational drafts in `marketing/_whatsapp/flows.md`.
