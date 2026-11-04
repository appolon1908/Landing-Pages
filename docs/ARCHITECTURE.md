# Architecture

## Public pages and deployment units

The corporate `home` package plus thirty service packages render 61 public pages in
three languages. A service package renders separate customer and provider routes;
it is one deployable unit with two audience layouts. English is the default locale; the language selector offers English, Spanish, then French.

```text
browser → home or service page server → host-scoped intake backend → configured CRM
                   │                             │
          shared core + Vue UI         registry + trusted manifests + market
```

Every bundled registry is preview/disabled. The diagram describes the transport
boundary; it does not imply a connected CRM or a launched marketplace.

| Package        | Owns                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `@lp/core`     | Manifest v2, SiteContext v3, ES/EN/FR routes, compliance/consent, market rules and submission v3   |
| `@lp/ui`       | Home, customer/provider layouts, two-step intake, locale controls, policy and receipt presentation |
| `@lp/page-kit` | Per-package server, metadata, no-JavaScript policies and bounded API proxy                         |
| `@lp/backend`  | Host registry, trusted manifest/market validation, local rate/idempotency maps and adapters        |

Each service manifest supplies audience-specific headlines, CTAs, scope/exclusions,
subtypes, conditional questions, pricing factors, process, fictional examples and
FAQs in all three languages. Core validates structure; content tooling checks catalog
coverage and unsupported claims.

## Routing and site boundary

`/<locale>/` is home. Service routes are `/<locale>/landing/<slug>` and
`/<locale>/business/<slug>`. Policy routes render on each package. Each server rejects
another package's service slug. Metadata includes canonical and language alternatives;
preview responses remain noindex.

The backend selects a site from Host. Unknown hosts fail closed with 421 on site
and page routes; the minimal health endpoint does not require a known host. The page
server requests that context and forwards the public Host on API calls. Public context
excludes destination credentials. The page server embeds that validated public context as
inert, escaped JSON in uncached HTML. The browser validates its host and schema before
using it, with the same-origin API as fallback; submission authority stays in the backend. Registry catalog entries may have separate origins;
`pageHref()` uses them for navigation. The local stack generates temporary origins.

Submission validation requires an HTTP Origin configured for the selected site and
equal to the submitted page's origin. The backend verifies audience, slug, locale,
conditional fields and market against trusted deployed manifests. Forwarded host/IP
headers are not trusted. Behind the page proxy, rate limits observe the proxy address;
real client-IP enforcement requires an explicit trusted-proxy design.

## Intake and CRM authority

1. Separate staged forms collect audience/service fields. The proposed market uses
   Dominican phone rules and configured zones.
2. Service-contact permission is separate from optional promotion/SMS choices. Locale
   changes retain fields and clear permissions whose wording changed.
3. The client creates a v3 envelope with exactly one request or application, presented
   consent and bounded allowlisted attribution. It stays in memory and does not copy
   form fields, files or unknown query keys. Allowed UTM values are bounded text, not
   automatically redacted; campaign operators must keep personal data out of them.
4. A prepared attempt retains its idempotency key on retry. The proxy caps bodies at
   64 KiB and preserves Retry-After. Backend validation precedes forwarding; local rate
   controls and optional server-side Turnstile verification protect the boundary.
5. A generic CRM adapter requires the declared `site-key-payload` contract. It sends a
   site-scoped key, deterministic trace UUID and canonical payload fingerprint. The CRM
   must durably deduplicate and return its canonical record ID.
6. Browser acceptance requires `REQUEST_ACCEPTED`, `CRM_ACCEPTED` and a valid
   `crm_receipt_id`. A log or trace alone is insufficient. A request receipt is not an
   appointment; an application receipt is not activation.

See [CRM contract](../backend/CRM_CONTRACT.md) for exact acknowledgment, retry
uncertainty, optional n8n signature and the unconfigured Odoo stub. Bundled adapters
are inactive. Secrets are environment references, never values in source or public
context. Preview forms do not POST or fabricate success.

The local idempotency map and journal do not guarantee durable exactly-once effects.
Fake-CRM tests establish only the adapter contract. Real persistent deduplication,
reconciliation queues, backup recovery and operational ownership remain unverified.

## Content, marketing and operations

Marketing drafts retain exact page-headline and page-CTA references. A short ad headline
and platform CTA enum are separate fields; review CSVs do not claim compatibility with
a current vendor import schema. WhatsApp wording is a draft, with no approved templates
or messaging transport activated. Owner facts, lead prices, availability, policies,
authentic proof and legal review are outstanding launch inputs.

CRM owns business records and future matching, booking, onboarding and billing.
This repository provides public pages and a validation/transport boundary. It provides
no second business database, provider authorization portal or payment/message sender.

## Verification and publication

Validation covers manifests, routes, consent, CRM failure/replay contracts, page content,
marketing references, bundle budgets, all builds, browser flows and pilot accessibility.
The isolated image check verifies backend/home/HVAC with disabled destinations.
Checkpoint evidence identifies the tested revision and exclusions.

Delivery requires a clean, reviewed atomic commit through the guarded `codestra-local`
publisher with exact local/remote SHA parity. GitHub is an additional mirror/review
checkpoint. Missing publication configuration cannot be replaced by passing local
tests, a recovery bundle or a GitHub push.
