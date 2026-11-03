# Breero landing-page recovery design

The user's two-sided business blueprint is the product specification. Rebuild its missing implementation from the recovered multi-page core; do not claim to have recovered the absent Claude integration. Preserve the original core branch and the separate working Windows preview.

## Scope and approach

Keep the existing Vue 3 / TypeScript / npm workspace structure: shared core, shared UI, per-page Vite packages, one host-scoped intake backend. Build 30 service packages and a corporate homepage, with separate customer and provider experiences in Spanish, English and French: 61 public pages and 183 localized routes, plus policies. Spanish is the default. Use the thirty canonical slugs in the input service map and the detailed manifest v2 shape in the prior mission section 5.1.

The selected approach extends the recovered shared-core architecture. Reverting to the single SPA would discard the explicitly requested independent builds. Rebuilding on a different website platform would duplicate the retained system. The supplied blueprint and later instruction to add page writers/coders establish the implementation direction; framework and package choices are retained from the repository.

## Authority and safety

- CRM is the backend authority, as explicitly selected by the user. Its vendor is not confirmed. The local backend validates and forwards intake; it does not become a second business database or implement billing/matching ownership.
- All bundled sites remain preview with disabled destinations. No real submissions, messaging, ads, fees, scheduling, production deployment or tracking activation.
- Host-derived site/workspace context and server validation remain mandatory. Browser page manifests never grant business authority.
- Future acceptance requires a durable CRM receipt. A preview must never invent a request ID, booking, provider activation or successful CRM write.
- Service-contact permission and optional promotions are separate, unchecked choices. Language changes preserve form values but invalidate consent whose presented wording changed.
- Owner facts remain clearly marked: legal identity, support contact, staffed hours, coverage, prices, credit/acceptance windows, genuine proof and reviewed policies. Do not manufacture operational claims.
- The old canonical-consent JSON key ordering bug and unbounded page-proxy request body are defects to fix with regression tests during intake work. In-memory idempotency is a local scaffold, not durable CRM exactly-once assurance.

## Interfaces

Manifest v2: `group`, `pilot`, `customer[locale]`, `provider[locale]`, `seasonal[]`, and feature flags. Customer copy includes headline/subhead/CTA, subtypes, urgency, up to three conditional extra fields, included/excluded services, price factors, three steps, 5–8 FAQs and honest confirmation copy. Provider copy includes fit, a visibly fictional lead, qualification, proposed lead model and unresolved commercial terms, pause/cap controls, six workflow steps, 5–8 FAQs and application confirmation. Retain `getTemplate` compatibility for metadata and existing consumers.

Routes remain `/{locale}/landing/{slug}` and `/{locale}/business/{slug}`; homepage is `/{locale}/`, with `/` redirecting to Spanish. Host validation, explicit route parsing, no-JS policies, canonical URLs, hreflang es/en/fr and x-default are shared requirements. The service registry contains 30 services; the homepage is a separate deployment unit rather than a fictitious service.

Market is the planned Dominican Republic / Santo Domingo pilot, currency DOP. Customer intake uses subtype, zone, urgency, conditional matching questions, description, name, phone, preferred contact, optional email and permissions. Provider intake has business/contact names, trade, zones, phone/email/hours, supported subtypes, capacity, languages and insurance status. No account or full address is required for a first customer request; no document/photo upload in this increment. Tutor contact for minors must be a parent/guardian.

The v3 envelope carries customer request or provider application, exact consent intent, and bounded attribution stored in memory only. The server validates market, page and conditional fields. Vendor adapters remain disabled; generic CRM forwarding is the configured integration boundary. Optional spam verification and rate limiting must be server-side and tested with fake transports.

## Presentation and content

Follow the blueprint's ten homepage sections and twelve sections per customer/provider page. Use restrained typography, visible focus states, contrast of at least 4.5:1 for normal text, responsive layout and honest preview labels. Keep separate audience CTAs. Never display an invented testimonial, rating, count, availability or price. No stock photos of people; neutral CSS illustration/iconography is sufficient.

Content covers all 30 services. Pilot five: HVAC, plumbing, electrical, home cleaning and pest control. Spanish uses usted; French uses vous. Build marketing drafts only: per-service audience/locale-consistent ad copy, organic planning and WhatsApp template drafts, with no network activation.

## Staffing

Four writer/coder roles per public page: customer/service copy, provider/localization copy, section/layout implementation, and form/CRM-boundary implementation. For each page section, assign one writing role and one coding role from that page team. Three independent reviewer roles cover architecture/security, UX/accessibility and content/language/claims. Three tester roles cover unit/contracts, browser/routes/accessibility and content/build/integration boundaries. The session permits three workers plus the coordinator; roles rotate in waves with isolated code worktrees and explicit file ownership. Role assignments are not claims of simultaneous agents.

## Acceptance and publication

Require format, type, registry, unit/contract, content, marketing, build/budget and browser checks, all 183 routes, and pilot accessibility checks at 390/768/1440. Run image checks when Docker is available and report any unavailable gate honestly. Review actual committed source before guarded publication.

The user requires codestra-local publication with exact local/remote SHA parity, followed by GitHub as a mirror/review surface. Its approved Landing-Pages URL is currently missing; do not invent a destination or infer it from the CRM choice. Existing PR #14 is a separate foundation comparison and must not be merged as a shortcut. Protected branch rules remain in effect.
