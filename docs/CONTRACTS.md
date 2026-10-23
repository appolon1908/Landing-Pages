# Frontend contracts and owner handoff

## Public site context v1

`GET /api/site-context` is served by this preview host from its explicit registry.
It returns schemaVersion, siteId, workspaceId, brand, publicOrigin, offerings,
mode=preview and submissionsEnabled=false. Only the exact HTTP Host selects a
record. Forwarded headers, query parameters and browser-selected workspace IDs do
not change that mapping. Unknown hosts return 421; duplicate host bindings prevent
startup. The registry is public configuration, never a source of private grants.

Breero must provide independently authorized site/domain/publication records before
this mapping can become a live published-site contract. The current frontend does
not create companies, verify domain ownership or authenticate business staff.

## Existing Breero submissions

Source inspected: Breero.com `apps/api/app/domains/public_submissions/schemas.py`
and `apps/web/app/api/public-submissions/[kind]/route.ts`, 2026-10-23.
The frontend client preserves the service/provider request fields and uses:

- `/api/public-submissions/service-requests`
- `/api/public-submissions/provider-interest`
- An `Idempotency-Key` retained for the same serialized payload AND site/audience
  context; a changed payload/context starts a new attempt. Never automatically
  retry a request with a new key after a lost response.
- A fresh UUID `X-Correlation-ID`, same-origin relative URL, no redirects and no
  browser credentials. These are public intake requests, not staff sessions.
- Only a valid `REQUEST_ACCEPTED` response with UUID `request_id` and an explicit
  `downstream_status` counts as durable receipt. It does not confirm appointment,
  provider selection, payment, Odoo delivery or completed work.

Existing service submission requires name/email/phone, address/city/U.S. state/ZIP,
service description and contact preference. Provider interest requires business and
contact names, email/phone, city/state/ZIP and service categories. Optional marketing
and transactional email/SMS consent defaults false. Request-only consent uses the
existing `2026-08-13-request-only` policy; translated evidence is retained in the
payload. Breero must approve the EN/ES policy copy before activation.

**Blocked owner dependency:** this inspected API lacks an authoritative company/site
binding. No client-supplied tenant field is added. The host returns 503 for submission
routes and the app presents an honest local preview. Breero's owner must supply a
verified-host/site contract, independently enforce workspace ownership, validate
service slugs, and return durable correlated receipts. No browser flag can enable
delivery in this revision. Prices, memberships and payments remain unconfigured.

## Authoring reference v1

The editors export only a saved project reference:

```json
{"schemaVersion":1,"purpose":"authoring-reference","source":{"workspaceId":"company-a","projectId":"00000000-0000-4000-8000-000000000001","kind":"grapes","revision":3},"publishAuthorized":false,"executionAuthorized":false}
```

It contains no token, customer data, raw HTML or draft content. The revision names
the saved server version; unsaved changes do not alter it. It grants no access.
Breero must authorize an AuthoringBinding to its site, obtain source content using
separately approved service access, require an exact source-revision match, validate
it server-side, and compile supported content into trusted runtime components.
Current Marketing API clients are only codestra-grapes/codestra-react-flow; no new
Landing-Pages client or credential forwarding is introduced.

Grapes form/script restrictions remain intact. Lead forms belong to trusted Vue
components. Flow references remain designs and cannot execute integrations.

## Publication, monitoring and rollout

Required Breero-owned successor work: immutable approved runtime artifact, atomic
publication pointer, per-site/host/locale cache keys, authorized preview/media,
rollback to prior artifact and same-industry cross-company tests. Live business
setup, cloning, reports, payment plans, CRM and scheduling remain owner dependencies.
The frontend sends no analytics events or private form data to third parties.
