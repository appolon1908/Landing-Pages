# BREERO → GoHighLevel intake: connection and acceptance checklist

**Implementation:** `packages/ui/src/components/BreeroHomeownerGHL.vue` and `BreeroProGHL.vue`. The two forms are reviewable only on the HVAC landing unit with an explicit query parameter:

- Homeowner: `/en/landing/hvac?breero-flow=homeowner`
- Professional: `/en/business/hvac?breero-flow=pro`

The normal multi-brand landing-page route is unchanged. The new preview is constrained to validated BREERO site context. It does not bypass the existing page-server host checks.

## Status — disconnected by default

Until a genuine approved GoHighLevel destination is provided, `VITE_BREERO_DIRECT_GHL_ENABLED` is **unset**. The forms show "preview only" and do not POST user data. All site registry entries continue to have disabled intake. `LP_BREERO_META_PIXEL_ENABLED` remains unset on preview sites.

No GHL location ID, webhook URL, automation, CRM contact, or saved lead has been verified. An HTTP 200/202 from a workflow inbound trigger acknowledges processing; it is NOT confirmation of contact creation or a calendar booking.

## Two workflows to configure in HighLevel

1. **BREERO – Homeowner HVAC Intake**: trigger **Inbound Webhook**; map `event_id`, `name`, `phone`, `email`, `service`, `issue`, `address`, `requested_date`, `requested_arrival_window`, `timezone`, and `consent_to_service_contact`. Verify/normalize the full address and actual service area in the workflow or approved CRM process, then create/update contact and create an opportunity in **BREERO - Homeowners**, stage **New Inquiry**. Do not create a confirmed appointment solely from the date preference.
2. **BREERO – Professional Intake**: separate inbound webhook; map `event_id`, `name`, `company`, `phone`, `email`, `city`, `state`, `techs`, `requested_callback_date`, `requested_callback_time`, `timezone`, and `consent_to_application_contact`. Create/update a contact and opportunity in **BREERO - Professionals**, stage **New Application**. Do not mark a provider approved or callback scheduled until separately confirmed.

Keep the `event_id` as the CRM deduplication key across retries and future Meta CAPI emission. Configure appropriate duplicate prevention and spam controls in GHL. SMS marketing must be a separate explicit opt-in.

## Deployment variables (public-facing)

Set these only after verifying browser CORS behavior, privacy policies, service-area rules, abuse controls, and CRM workflows in a test sub-account:

```env
VITE_BREERO_DIRECT_GHL_ENABLED=false
LP_BREERO_DIRECT_GHL_ENABLED=false
VITE_GHL_HOMEOWNER_WEBHOOK_URL=
VITE_GHL_PRO_WEBHOOK_URL=
VITE_BREERO_SITE_ID=breero-preview
LP_BREERO_META_PIXEL_ENABLED=false
```

After independent release approval, enable **both** intake flags; the server flag provides the verified, live-BREERO-only head marker and CSP rule, while the browser flag enables the form. In preview or on unrelated brands, the server must never publish the marker or open the GHL CSP destination.

When approved, replace the two URL values with their genuine `https://services.leadconnectorhq.com/hooks/...` destinations and rebuild. **VITE_ variables are public in compiled JavaScript. Do not place private API tokens or hidden secrets there.** Public webhook URLs may be abused; only enable once the account owner accepts that risk and appropriate spam/rate protection exists. If direct browser requests fail CORS preflight, use GHL-native hosted forms or a protected relay on Hetzner (never expose an API token in the browser).

## Conversions and privacy

- Consent is separate from service-contact authorization. Meta Pixel ID `965185126235275` is configured on the parent landing platform only after eligible advertising consent and an operator-approved live deployment.
- The forms emit a browser `Lead` **only if** a synchronous response contains a persisted CRM contact ID, the matching `event_id`, and an explicit saved status. Normal GHL inbound webhook acknowledgement does not do that; no browser Lead is expected in the standard flow.
- If GHL is to send Meta CAPI, configure it after successful contact/opportunity creation, with the same original `event_id`, consent enforcement, and hashing of supported identifiers. Do not claim a booking, charge a provider, or register a converted lead before verifying the corresponding CRM state.
- The calendar shows **requested dates/windows**, not verified appointment availability.

## End-to-end acceptance

1. Test each HTTPS destination via an approved staging workflow with non-personal synthetic records; record the exact workflow run and saved contact/opportunity IDs.
2. Verify browser `OPTIONS` CORS preflight and `POST` succeeds from the actual hosting origin. Test network timeout, rejection, invalid dates, duplicates, and spam.
3. Verify homepage preview and professional preview on Hetzner without a submission (disabled flag). Confirm original landing pages and unrelated brands are unchanged.
4. Only after policy and independent review, deploy to an HTTPS domain, check Meta Events Manager test events, and enable production intake with written evidence.

No user credentials, webhook URLs, private GHL account details, or production confirmation are stored in source control.
