# Shared landing-page requirements

## Intent and scope

The user requested a new branch that automatically supplies every landing page
with the attached HighLevel website requirements. This implements the shared
Vue website-form surface and its validation, using the existing host registry.
It does not register brands/campaigns, enable submissions, or grant messaging
authority. Business review and carrier approval are separate external evidence.

## Approach

The implementation choice is one versioned business profile, one safe document
model, and shared footer/consent components. Copying policies into individual
templates would drift across 20 routes. Raw HTML templates would weaken the
existing rendering boundary. Neither alternative is needed.

The profile is public presentation data. Legal names, DBA relationships,
support details, data practices, and approved disclosure text belong to each
business. Unknown facts stay empty in explicit drafts. The system must never
manufacture them or mark generated text as HighLevel-approved.

## Behavior

- SiteContext v2 includes a strictly validated compliance profile. Existing v1
  documents remain legacy previews with explicit readiness blockers; they never
  acquire an implicit legal approval. Both bundled previews migrate to v2.
- All page shells display business identity, contact information when supplied,
  and same-origin links to About, Contact, Privacy Policy, and Terms.
- EN/ES policy URLs work on direct navigation, refresh, and without JavaScript.
  Documents use escaped text sections, including a finite set of conditional
  policies. Unknown hosts and disabled document routes fail closed.
- SMS service-update and marketing choices are separate, optional, initially
  unchecked, and independent from request contact. Profiles determine which
  categories are offered. Phone entry alone never selects consent.
- Policy and disclosure revisions, actual displayed wording, business/site,
  locale, page URL, choices, and a client-observed time form a versioned browser
  preference intent. It is not durable consent or backend authorization.
- Consent scope changes reset SMS choices, while ordinary form fields remain.
  Unchanged retries reuse the original intent time and idempotency identity.
- A successor submission draft preserves the legacy request body separately
  from the new intent. The legacy adapter must reject this successor envelope;
  a future authorized backend must validate and durably record it.
- Readiness reports missing facts, draft wording, unreviewed eligibility,
  unknown applicability, and missing conditional policies. A strict CLI mode
  fails for these gaps. A successful website check still cannot authorize a
  publication or message.
- Commerce/shipping/subscriptions/tracking/privacy rights/endorsements/regulated
  offerings/email marketing require explicit applicability decisions. Tracking,
  regulated age verification, and email suppression remain external integration
  gates where applicable. No advertising code is introduced.

## Content and authority

Profiles have bounded plain-text EN/ES sections for privacy and terms. Required
topics cover collection/use, SMS choices, cookies, mobile-data handling, security,
retention, rights/contact, program purposes/frequency/charges, STOP/HELP, rejoining,
carrier delivery, 18+ program eligibility, and policy links. Optional documents
cover refunds, shipping, subscriptions, cookies, privacy rights, and disclosures.

Generated preview wording is original illustrative text. HighLevel's current
guide specifies exact wording for some disclosures; reviewed business/provider
wording must be supplied and checked before a website is submitted for approval.
Its Quick Setup chat-widget rules do not apply interchangeably to this custom form.

Breero retains publication/domain grants and service intake. Commerce records
remain in the designated commerce service. Replies remain policy API → Middleware
→ provider. Public profile status cannot replace any business authorization.

## Verification

Pin strict parsing, both-brand isolation, readiness blockers, all four SMS choice
combinations, scope resets, stable retries, legacy-adapter rejection, escaped
server documents and metadata, unknown-host/disabled-route failures, all 20
landing routes, unchecked-form submission, history, mobile layout and accessibility.
Keep existing homepage history regressions intact. Run the complete repository
checks, obtain independent source review, and publish an atomic PR to the subsection.

## Sources checked 2026-10-29

- https://help.gohighlevel.com/support/solutions/articles/155000007237
- https://help.gohighlevel.com/support/solutions/articles/155000004746-campaign-rejection-reasons-and-resolutions
- https://ideas.gohighlevel.com/changelog/ai-powered-a2p-compliance-validation
- https://help.gohighlevel.com/support/solutions/articles/48001207676

The source implementation establishes structural guarantees. Actual policy
accuracy, working support channels, STOP/HELP processing, suppression, durable
consent, campaign/brand approval, and sending-number association need separate
business/backend/provider acceptance.
