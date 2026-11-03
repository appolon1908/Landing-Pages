# Automatic website requirements for each business

## What this branch supplies

Every landing page uses the same business footer and consent components. One
validated business profile supplies the content across all service/audience
routes and both languages. The profile is selected by the server's existing
exact-host registry; browser selectors cannot choose a different business.

| Surface | Automatic behavior |
| --- | --- |
| Identity | Display brand, supplied legal entity/DBA relationship, business description and support contacts |
| Navigation | About, Contact, Privacy Policy and Terms links in the shared shell; policy links before form submission |
| Direct documents | `/en/about`, `/en/contact`, `/en/privacy-policy`, `/en/terms`, and equivalent `/es/` URLs |
| Public readability | Direct documents include escaped server-rendered text and metadata, including when JavaScript is disabled |
| SMS choices | Separate optional service-update and marketing checkboxes, initially unchecked; phone entry and request contact do not select them |
| Context changes | Phone, business, collection page, locale, program, policy content/revision or disclosure changes invalidate previous unsent SMS choices |
| Conditional documents | Refund/cancellation, shipping, subscriptions, cookies, privacy rights, commercial disclosures and email pages appear only when explicitly applicable and populated |
| Readiness | Report missing facts, draft versions, missing sections, unknown applicability, placeholder contacts and unreviewed SMS wording/eligibility |

The shared renderer continues to preserve the homepage history repair. Metadata
now updates consistently across landing and policy navigation, including the
description and alternate-language links.

## Configure a business once

`SiteContext` v2 adds `compliance`, validated by
`packages/contracts/compliance.ts`. The bundled registry demonstrates the shape
in `config/sites.preview.json`. Its two profiles are deliberately drafts and
contain no fabricated legal entity, support contact or address.

The business's authorized publication owner must supply:

1. The actual legal name, any DBA, consistent display brand, meaningful business
   description, working support email/phone and applicable postal address.
2. Privacy and Terms sections that accurately describe the operation, with
   immutable document versions and effective dates.
3. Each offered SMS category's actual purposes, frequency and complete reviewed
   disclosure text in both supported languages. A business with no SMS program
   should set `sms.offered` and both category `offered` values to `false`.
4. A definite true/false applicability decision for every listed business feature.
   Unknown applicability is `null` and remains a readiness blocker.
5. Reviewed conditional policy content for the features that apply.
6. A reviewed profile revision, SMS wording review, and business-specific program
   eligibility review. Changing a flag is not proof that a review occurred.

The preview factory in `packages/compliance/preview.ts` generates illustrative
draft text. It must not be relabeled as an approved policy. Replace draft content
and versions through the authorized business review process. Never remove an
accurate disclosure merely to make a registration check pass.

Profiles contain bounded text and finite document kinds. They cannot contain
HTML snippets, scripts, secrets, credentials, private grants or default opt-ins.
Vue and the server escape all displayed content. Invalid nested fields are
rejected rather than silently ignored.

## Readiness commands

```bash
npm run compliance:check
npm run compliance:check -- --json
npm run compliance:check -- --strict --registry /path/to/reviewed-sites.json
```

The normal command validates structure and reports every business's unresolved
items. `--strict` exits nonzero when any profile is not ready for external review.
The bundled drafts are expected to fail strict mode; tests pin that behavior.
Invalid configuration fails in both modes. Formatting and type checks include
the new profile/configuration and CLI files.

`readyForReview` is a website-content readiness signal. The result always has
`publicationAuthorized: false`. This repository has no production publisher;
the authorized Breero publisher must consume the validation result together with
server-verified site/domain/business grants and a bound, immutable profile
revision. Public JSON or a browser-provided readiness result cannot authorize
publication, customer access, enrollment or messaging.

## Consent intent and backend handoff

The form creates a `schemaVersion: 2` draft envelope containing the existing
request body separately from a versioned `browser-preference-intent`. Its snapshot
includes the business/site, profile and policy versions, shown SMS wording,
locale, actual permitted collection-page URL, entered phone, category choices,
and client-observed time. `collectionMode` remains `preview`.

Unchanged choices and context reuse the original snapshot and timestamp, so a
lost-response retry would retain the idempotency key. Real changes create a new
snapshot. Visiting a policy page does not clear ordinary form fields. A page
reload clears this in-memory draft; no browser consent store or server database
is introduced.

The legacy request flags remain SMS-disabled. Its existing adapter explicitly
rejects the successor envelope, even if called with an enabled flag. The public
server continues returning 503 for every submission endpoint. Nothing in this
branch sends a form, enrolls a number, or produces a provider command.

The future authorized adapter must validate the bound business, current immutable
profile and disclosure versions, phone/customer scope and category availability,
then assign authoritative receipt time and durably store the result. Browser
claims and preview choices are not granted consent. An unchecked unsent form
choice supplies no new permission; withdrawal of an existing subscription needs
the backend's explicit suppression process.

Request-contact wording now identifies the current business and has a new
disclosure version. It is optional and explicitly distinct from SMS consent.
No general-terms or email-marketing acceptance is inferred from a text-message
selection.

Commerce catalog, inventory, quotes and orders remain in the designated commerce
service. Replies continue through the WhatsApp policy API, Middleware and provider
route defined in `COMMERCE_HANDOFF.md`.

## HighLevel registration path and external acceptance

This implementation supports a custom **Website Form / Manual (Self-Serve)**
registration surface. HighLevel's Chat Widget Quick Setup has different widget
and competing-form rules; this Vue form is not a generated HighLevel widget.
The registered main business URL, policy URLs, program description and sample
messages must match the actual business and opt-in flow.

HighLevel specifies exact wording for some checkbox/mobile-information clauses.
The business must supply that applicable wording and verify it against its real
data practices. The original draft text in this repository is not a substitute
for that wording review. English campaign-registration fields and translations
of other-language sample messages are separate registration requirements.

Before activation, obtain evidence for:

- Public domain/TLS and business identity/contact verification.
- Applicable business/jurisdiction policies and eligibility, including any
  required age verification beyond the displayed 18+ program statement.
- Durable, business-scoped consent; service-only choices never enroll promotions.
- Real STOP suppression, HELP support replies and withdrawal/rejoin behavior.
- Tracking consent/opt-out controls before any optional tracker is integrated.
  This renderer installs no advertising or analytics code.
- Email identity, address, unsubscribe and suppression where email marketing applies.
- Brand/campaign approval and the correct sending-number association.

These are owner/backend/provider acceptance checks. Completing website structure
does not establish their results or guarantee carrier approval.

## Official sources checked 2026-10-29

- [HighLevel A2P opt-in guide](https://help.gohighlevel.com/support/solutions/articles/155000007237)
- [Campaign rejection reasons and resolutions](https://help.gohighlevel.com/support/solutions/articles/155000004746-campaign-rejection-reasons-and-resolutions)
- [Automated website compliance criteria](https://ideas.gohighlevel.com/changelog/ai-powered-a2p-compliance-validation)
- [SMS terms, privacy and consent evidence guidance](https://help.gohighlevel.com/support/solutions/articles/48001207676)
- [Campaign approval practices](https://help.gohighlevel.com/support/solutions/articles/48001229784-a2p-10dlc-campaign-approval-best-practices)

Provider criteria can change. Recheck the current guidance and the business's
actual operation when submitting or changing a program.
