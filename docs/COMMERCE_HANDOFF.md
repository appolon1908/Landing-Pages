# Landing page to commerce handoff

Status: defined integration contract; runtime implementation and activation are
separate release work. This document creates no merchant/channel binding or new
runtime endpoint. The versioned `SiteContext` stays preview-only with submissions
disabled. Bundled profiles use v2 public compliance presentation data; legacy v1
remains supported.

Read alongside [frontend contracts](CONTRACTS.md), [readiness](READINESS.md) and the
[Codestra WhatsApp Commerce Platform Architecture](https://chatgpt.com/space/page_4f1437fdb09c819187e5b2553d9ce390).

## Authority and ownership

| Concern | Authority |
| --- | --- |
| Verified domains, public sites, approved artifacts and publication state | Breero |
| Existing service-request/provider-interest intake, consent and request receipts | Breero |
| Merchant catalogs, variants, stock, carts, quotes, orders and payment annotations | Designated Python commerce service |
| Conversation state, bot/human mode, takeover version, durable inbox and business outbox | Designated Python commerce service and worker |
| Staff identity | Keycloak; each receiving service validates claims and tenant membership |
| Messaging eligibility, consent and outbound policy admission | Existing WhatsApp Node policy API |
| Provider command ledger, transport outbox, retries and delivery reconciliation | Middleware and its provider adapter |

The commerce service owns its isolated PostgreSQL commerce database. Landing-Pages
stores no duplicate commerce records. The controller installation-authority
database and Marketing Backend's editor-project storage are outside this data
boundary. Tenant-owned relationships require tenant-scoped keys, composite foreign
keys and enforced PostgreSQL row-level security with a non-owner runtime role.

The commerce owner must record the verified repository/deployment during the
implementation handoff. This contract does not assume a repository name or claim
that the service is deployed.

## Server-owned published-site binding

The commerce service's integration registry holds a versioned binding to Breero's
authoritative publication and the verified WhatsApp channel. It references the
upstream grants and their versions instead of independently granting site or
channel ownership.

The proposed server-only record contains:

| Field group | Required meaning |
| --- | --- |
| `binding_id`, `binding_version` | Immutable identity and monotonically increasing version |
| `site_id`, `workspace_id`, publication/domain revisions | Breero's verified owner, approved publication and domain grant |
| `tenant_id`, `merchant_id` | The authorized business in the commerce service |
| Provider, provider account ID, phone-number ID, channel revision | The verified WhatsApp channel belonging to that tenant |
| Verification references, verifier, activation time and state | Auditable evidence and pending/active/revoked lifecycle |

These field names define the contract; they are not an existing database schema.
Activation requires independently authenticated checks of both authorities:
Breero confirms that the site owner may represent the merchant, and the channel
authority confirms provider-account/phone ownership for that commerce tenant.
Similar names or matching browser-supplied IDs do not satisfy either check.

An active site/publication binding selects one tenant, merchant and channel
unambiguously. Each active provider account/phone mapping resolves to one tenant.
Supporting multiple merchant channels requires separate verified bindings and an
explicit server-side selection rule.

Ownership, channel assignment or relevant publication/domain-grant changes create
a new binding version. Activation and revocation update the active binding
atomically. Missing verification, revocation or unpublication prevents new actions
through the binding. Queued effects retain their admitted binding version and are
held or cancelled when it becomes invalid; they never retarget automatically to a
new merchant or phone. Committed orders remain intact for authorized staff.

## Trusted tenancy and public presentation

For website-originated commerce actions, the backend derives the business from the
verified published-site binding, then independently authorizes the customer/session
and requested object. For WhatsApp-originated actions, it derives tenancy from the
authenticated provider event and verified provider-account/phone mapping.

Browser `workspaceId`, `tenant_id`, merchant/channel IDs and query parameters do not
grant authority. Forwarded-host values are trusted only under an explicit gateway
contract that authenticates the ingress and removes client-supplied forwarding
headers. Otherwise use the validated configured host mapping. Conflicting business
selectors are rejected rather than overriding the authenticated context.

The preview projection includes `schemaVersion`, `siteId`, `workspaceId`, `brand`,
`publicOrigin`, `offerings`, `mode` and `submissionsEnabled`. Version 2 adds the
strict public `compliance` profile for business identity, website policies and
SMS presentation; version 1 remains a legacy preview. These fields, including the
public `workspaceId`, are compatibility/presentation data. They are not tenant
grants, and the preview registry is not proof of domain ownership.

A future public commerce projection needs an explicit new version. It may contain
approved public catalog/presentation fields and a server-generated customer
handoff link. It excludes internal binding records, private tenant grants,
provider-account IDs, Meta phone-number IDs, credentials and customer data. An
approved public WhatsApp contact URL is navigation information; it authorizes no
send and does not establish the tenant of a later inbound event.

## Intake, checkout and durable state

Breero `service-requests` and `provider-interest` retain their existing meaning.
`REQUEST_ACCEPTED` confirms intake; it does not reserve inventory, confirm a
commerce order, accept fulfillment or record payment.

Future commerce operations use the designated commerce service's contract:

- Public browsing exposes approved catalog information only.
- Private cart, quote and order operations require an authenticated customer
  session or a verified tenant-scoped guest capability, plus object ownership
  checks. Staff operations require validated Keycloak claims and business roles.
- The service supplies product identities, integer minor-unit prices/currency,
  stock, delivery rules, expiring quotes and order state. Browser totals are
  untrusted. A changed quote requires fresh customer confirmation.
- Confirmation atomically checks the quote, allocates stock, creates the order,
  records durable idempotency and writes its business outbox intent.
- Cash/external-payment annotations require an authorized audited commerce action.
  A customer message, screenshot or landing-page receipt cannot mark an order paid.

Persist idempotency by tenant, operation and key, with a canonical request hash and
durable result. Identical retries reuse the result; reusing a key with a different
request fails. Browser retry keys alone provide no server-side deduplication.

Store authenticated inbound events durably before acknowledging acceptance.
Deduplicate with tenant, channel and provider event identity, keeping message and
delivery-status event types distinct. Commit business state and its outbox intent
together so a crash or replay cannot independently create another order, stock
movement or reply intent.

## Outbound replies and human takeover

All commerce replies follow:

**Commerce worker -> WhatsApp Node policy API -> Middleware
`POST /platform/v1/commands` -> provider adapter.**

Use the registered, reviewed WhatsApp command family. The landing browser/public
host receives no provider credential or direct-send authority. The policy API
authenticates the commerce caller and independently checks tenant, channel,
consent, message eligibility and current dispatch authorization.

The commerce service owns the authoritative conversation mode/version. Each queued
bot reply carries its business-intent identity, binding version and conversation
version. Immediately before dispatch admission, revalidate the active binding,
bot mode, expected conversation version and policy permission.

Takeover and dispatch admission must share a serialized authorization boundary or
equivalent fencing enforced by the service and policy API. A version supplied by
the caller, or a check performed only when the reply was generated, is insufficient.
Takeover advances the authoritative version and invalidates unadmitted replies;
later bot reactivation does not revive them. Already-admitted commands retain their
actual delivery state and require explicit cancellation/reconciliation where
supported; this contract does not promise to retract a provider-accepted message.

Retries retain the same business and Middleware command identity. Unknown outcomes
require reconciliation, not a new command with a new key. Provider-level exactly-once
delivery is not an assumed guarantee.

## Acceptance evidence before activation

| Case | Required result |
| --- | --- |
| Forged workspace, tenant, merchant, phone or forwarded-host selector | Cannot change trusted tenancy or authorize an action; conflicts are rejected |
| Tenant A requests tenant B's cart, quote, order or staff operation | Application authorization and database boundaries reject access |
| Missing, revoked, unpublished or superseded binding | New effects fail closed; pending effects are held/cancelled without retargeting or deleting committed orders |
| Duplicate inbound event or checkout confirmation | Reuses the existing result without another order, stock allocation or business reply intent |
| Duplicate outbox attempt or lost send acknowledgement | Preserves command identity and reconciles uncertain outcomes |
| Bot reply queued before takeover, including simultaneous dispatch | Serialized admission/fencing rejects stale unadmitted replies; bot reactivation does not revive them |
| Intake receipt presented as commerce success | Request acceptance, quote, customer confirmation, fulfillment acceptance and payment remain distinct |
| Juice pilot and second merchant share product/customer identifiers | Data, stock and replies remain in the correct tenant and verified channel |

Before activation, owners must supply approved site/domain/publication records,
verified channel ownership, reviewed consent/copy, real staging receipts, staff
authorization tests, stock/concurrency and recovery evidence, and policy-send
verification. The existing preview remains disabled until the corresponding
implementation and release gates pass.
