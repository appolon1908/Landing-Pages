# Mission: Breero two-sided launch — 61 pages, ES/EN/FR, Meta + WhatsApp ready

**Owner:** Ralph Appolon (`appolon1908`). **Repository:** `appolon1908/Landing-Pages`.
**Run location:** the owner's machine, in a clone with working GitHub credentials (the
cloud session that wrote this mission cannot push).
**Team:** 15 agents. 6 writers (W1–W6), 4 testers (T1–T4), 5 reviewers (R1–R5).
"4 testing and 5 testing" in the request is read as 4 testers plus 5 independent
reviewers, because `AGENTS.md` requires independent review before promotion.

Read this whole file before starting. Follow it exactly. Do not stop until every item in
**§11 Definition of done** is true and every branch in **§10** is pushed with an open PR.
When something is genuinely blocked (§12), record it in `docs/missions/STATUS.md`,
finish everything else, and stop only after that.

---

## 0. Ground rules (apply to every agent, every step)

1. Read `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/CICD.md`, `branch-policy.json` and
   the two source documents in §1 before writing anything.
2. One agent = one git worktree = one atomic branch. Never share a working tree or a
   `.git/index` with another agent. Create worktrees with
   `git worktree add ../lp-<agent> -b <branch> <base>`.
3. Only edit the files your role owns (§4). If you need a change in someone else's file,
   write the request into `docs/missions/STATUS.md` under "Requests" and continue.
4. **Nothing goes live.** Every site stays `"mode": "preview"`; no destination other
   than `disabled` or `log`; no Meta Pixel, Conversions API, WhatsApp API or analytics
   call is activated; no ad spend; no domain purchase; no message is sent.
   Integrations are built behind configuration that is off by default.
5. **Honesty rules for all copy and creative** (blueprint §"Customer/Provider outline"):
   no invented reviews, testimonials, ratings, counts, logos, "verified" badges,
   response-time promises, prices, guarantees of jobs/income/leads, or same-day claims.
   Use clearly labelled placeholders (`[PROOF: real testimonial needed]`). A request is
   never presented as a booking; an application is never presented as an activation.
6. No secrets, tokens, real customer data or real phone numbers in source. Example
   phone: `+1 809 555 0100`. Example names: obviously fictional.
7. Every commit ends with the attribution lines in §10.4.
8. Before pushing any branch: `npm run format:check && npm run typecheck &&
   npm run registry:check && npm test` must pass in that worktree.

## 1. Inputs

- `docs/missions/inputs/two-sided-landing-page-blueprint.md` — the business blueprint
  (30 services × customer page + provider page, homepage outline, forms, lead model,
  Meta/WhatsApp operating outline, acceptance criteria). **This is the product spec.**
- `docs/missions/inputs/summary.md` — the short version with the 30-row table.
- The current code on `atomic/ci-cd-pipelines-20261102` (multi-page core, backend with
  destinations, 30 placeholder pages, CI/CD).

## 2. Brand and domain decision

| Option | Domain status (GoDaddy, checked 2026-11-02) | Note |
| --- | --- | --- |
| **Breero (recommended)** | `breero.com` **taken**; `getbreero.com` available ($0.01 first year on 3-yr term, renews $22.99/yr); `breero.co` available (renews $59.99/yr); `breero.app` available ($15.99/yr, renews $27.99/yr) | Already the platform name throughout this repo and backend. Short, pronounceable in ES/EN/FR. |
| Alternatives checked | `servaro.com`, `oficiohub.com`, `manolisto.com`, `obrify.com`, `servilo.com` taken; `manoya.com` premium $1,495; `tareko.com` premium $3,599 | None is clearly better than Breero for the cost. |

**Decision for this mission: brand = "Breero", working public origin =
`https://getbreero.com`** (placeholder until the owner buys a domain). Before any paid
advertising the owner must: find out who holds `breero.com` (if it is the owner, use
it), run a trademark search in the Dominican Republic (ONAPI) and target countries, and
buy the chosen domains. Agents do not buy anything.

Brand line (blueprint): **ES** "Encuentra el servicio correcto. Haz crecer tu negocio de
servicios." / **EN** "Find the right service. Grow your service business." / **FR**
"Trouvez le bon service. Développez votre entreprise de services."

## 3. Target state

- **Market:** Dominican Republic, Santo Domingo pilot (blueprint §Pilot). Currency DOP,
  phone/WhatsApp `+1 809|829|849`, zones instead of US states/ZIP codes.
- **Locales:** `es` (default; `/` redirects to `/es/`), `en`, `fr`. Every page, policy,
  form label, error, metadata tag, sitemap and `hreflang` set covers all three.
- **Pages:** 1 corporate homepage + 30 services × 2 audiences = **61 pages × 3 locales
  = 183 localized pages**, plus policies, confirmations and the provider application.
  Customer audience keeps route segment `landing`; provider audience keeps `business`.
- **Final 30 slugs** (blueprint order). Column "From" says how to get there from the
  current placeholders:

| # | Slug | Service | From |
| --- | --- | --- | --- |
| 1 | `hvac` | HVAC / air conditioning | rename `hvac-heating` |
| 2 | `plumbing` | Plumbing | rename `plumbing-winterization` |
| 3 | `electrical` | Electrical | keep |
| 4 | `roofing` | Roofing / waterproofing | keep |
| 5 | `home-cleaning` | Home cleaning | rename `house-cleaning` |
| 6 | `commercial-cleaning` | Office / commercial cleaning | new |
| 7 | `pest-control` | Pest control | keep |
| 8 | `landscaping` | Landscaping / lawn care | keep (absorbs `lawn-care`) |
| 9 | `tree-service` | Tree services | keep |
| 10 | `painting` | Painting | rename `interior-painting` (absorbs `exterior-painting`) |
| 11 | `remodeling` | Remodeling | rename `kitchen-remodel` (absorbs `bathroom-remodel`) |
| 12 | `flooring` | Flooring / tile | keep |
| 13 | `windows-doors` | Windows / doors | rename `window-replacement` |
| 14 | `pool-service` | Pool care | keep |
| 15 | `solar` | Solar installation | rename `solar-panels` |
| 16 | `backup-power` | Generators / inverters / batteries | new |
| 17 | `water-systems` | Water tanks / pumps / filtration | new |
| 18 | `appliance-repair` | Appliance repair | keep |
| 19 | `locksmith` | Locksmiths | keep |
| 20 | `security-systems` | Security cameras / alarms | new |
| 21 | `moving` | Moving | rename `moving-services` |
| 22 | `junk-removal` | Junk removal | keep |
| 23 | `pressure-washing` | Pressure washing | keep |
| 24 | `auto-repair` | Auto repair / mobile mechanics | new |
| 25 | `auto-detailing` | Auto detailing | new |
| 26 | `towing` | Towing / roadside | new |
| 27 | `catering` | Catering | new |
| 28 | `photography-video` | Event photography / video | new |
| 29 | `tutoring` | Tutoring / training | new |
| 30 | `digital-marketing` | Websites / digital marketing | new |

Remove: `carpet-cleaning`, `chimney-fireplace`, `deck-patio`, `fencing`, `garage-doors`,
`gutter-cleaning-repair`, `insulation-weatherproofing`, `siding`, `lawn-care`,
`bathroom-remodel`, `exterior-painting`. Pilot five (blueprint): `hvac`, `plumbing`,
`electrical`, `home-cleaning`, `pest-control` — these get the most complete content.

## 4. Roles, ownership and branches

Base for every new branch: `atomic/ci-cd-pipelines-20261102` until §10 says otherwise.

### Writers

| Agent | Branch | Owns (only these paths) | Job |
| --- | --- | --- | --- |
| **W1 Platform & i18n** | `atomic/w1-trilingual-platform` | `packages/core/src/index.ts`, `packages/core/src/pages/manifest.ts`, `packages/core/src/contracts/**`, `packages/core/src/compliance/**`, `packages/ui/src/i18n/**`, `packages/page-kit/src/**`, `scripts/new-page.mjs`, `scripts/dev-stack.mjs`, `scripts/check_registry.mjs`, `config/registry/**`, `.gitignore` | §5.1 French + manifest v2 schema + slug migration |
| **W2 Forms, market & backend** | `atomic/w2-forms-market-backend` | `packages/core/src/submissions/**`, `packages/ui/src/usePage.ts`, `packages/ui/src/components/IntakeForm.vue`, `packages/ui/src/components/ConsentChoices.vue`, `backend/**`, `config/markets/**` | §5.2 DR market form, provider application, backend validation |
| **W3 Homepage, layouts & brand** | `atomic/w3-home-layouts-brand` | `packages/ui/src/index.ts`, `packages/ui/src/LandingApp.vue`, `packages/ui/src/layouts/**`, `packages/ui/src/components/` (all except W2's two files), `packages/ui/src/styles.css`, `packages/ui/src/tokens.css`, `pages/home/**`, `docs/BRAND.md` | §5.3 homepage, customer layout, provider layout, design system |
| **W4 Content A** | `atomic/w4-content-01-10` | `pages/<slugs 1–10>/**`, `marketing/<slugs 1–10>/**` | §6 + §7 for services 1–10 |
| **W5 Content B** | `atomic/w5-content-11-20` | `pages/<slugs 11–20>/**`, `marketing/<slugs 11–20>/**` | §6 + §7 for services 11–20 |
| **W6 Content C** | `atomic/w6-content-21-30` | `pages/<slugs 21–30>/**`, `marketing/<slugs 21–30>/**` | §6 + §7 for services 21–30 |

After their platform branch is merged into the integration branch (§10), W1–W3 take
the marketing tooling in §7.4 on branch `atomic/w1-marketing-tooling` (W1),
`atomic/w2-whatsapp-measurement-spec` (W2) and `atomic/w3-organic-and-brand-kit` (W3),
owning `marketing/_tooling/**`, `marketing/_whatsapp/**` + `docs/MEASUREMENT.md`, and
`marketing/_organic/**` + `marketing/_brand/**` respectively.

**Shared files.** Root `package.json`: each agent may add only its own `scripts`
entries (and dev dependencies its role needs); R5 resolves `package.json` merge
conflicts. `README.md` and `docs/*.md` outside your own paths: request changes in
`STATUS.md`; R5 applies them during Phase 4. `docs/missions/STATUS.md`: everyone
appends, nobody rewrites others' lines.

### Testers (write tests and evidence, never product code)

| Agent | Branch | Owns | Job |
| --- | --- | --- | --- |
| **T1 Unit & contract** | `atomic/t1-unit-contract-tests` | `tests/unit/**`, `tests/backend/**`, `tests/pagekit/**`, `tests/fixtures.ts` | Locale (fr), manifest v2, market form, backend validation, idempotency, provider application; every blueprint acceptance criterion testable in code |
| **T2 Browser & accessibility** | `atomic/t2-browser-a11y` | `tests/e2e/**`, `playwright.config.ts` | All 61 pages × 3 locales render; axe WCAG 2 A/AA at 390/768/1440 on homepage + pilot 5 × 2 audiences × 3 locales; form flows; no-JS policies; language switch keeps input |
| **T3 Content & claims QA** | `atomic/t3-content-qa` | `scripts/check_content.mjs`, `tests/content/**` | Automated content linter (§8.3) + native-quality ES/FR review report per page |
| **T4 Build, CI & performance** | `atomic/t4-build-ci-perf` | `.github/workflows/**`, `scripts/changed-pages.mjs`, `scripts/gen-compose.mjs`, `scripts/smoke-deploy.mjs`, `Dockerfile.page`, `backend/Dockerfile`, `compose.yaml` | All 31 builds, per-page JS ≤ 130 kB gzip, CI matrix covers `pages/home`, container smoke, Lighthouse-style budget check in CI (mobile LCP proxy via Playwright timing) |

### Reviewers (read, run, report; never edit product code)

| Agent | Reviews | Output |
| --- | --- | --- |
| **R1 Architecture & code** | W1, W2, W3, T4 PRs | `docs/missions/reviews/R1-<branch>.md`: correctness, ownership boundaries, contract stability, test adequacy |
| **R2 Security, privacy & consent** | W2, W1 (compliance), all forms | `reviews/R2-*.md`: consent separation, data minimization, server-side validation, no secrets, tenant isolation, FR/ES/EN policy parity, "draft — legal review required" banners intact |
| **R3 Meta & WhatsApp policy** | §7 marketing kit, `docs/MEASUREMENT.md` | `reviews/R3-*.md`: ad ↔ page consistency, special-category/discrimination risks, WhatsApp opt-in and 24-hour window rules, template categories, no prohibited claims |
| **R4 Brand, UX & language** | W3–W6 PRs with screenshots | `reviews/R4-*.md`: blueprint section order followed, CTA wording, mobile layout, ES/FR read as native (not literal) |
| **R5 Release manager** | everything | Runs §10, owns `docs/missions/STATUS.md` and the integration branch, enforces §11, pushes, opens PRs |

A reviewer marks each finding **blocker** / **should-fix** / **note**. The owning writer
fixes blockers on the same branch; the reviewer re-checks and records "resolved at
<sha>". No branch is pushed for PR with an open blocker.

## 5. Platform work (Phase 1 — W1, W2, W3 in parallel)

Agree the shared schema first: W1 publishes `PageManifest` v2 (below) as the first
commit on its branch and pushes nothing else until W2 and W3 confirm in `STATUS.md`
that it covers their needs (one round, max 30 minutes).

### 5.1 W1 — trilingual platform, manifest v2, slug migration

1. `locales = ["es", "en", "fr"]`; default locale `es`. Update every place that assumes
   two locales (inventory at time of writing: `compliance/pages.ts` 21 hits,
   `contracts/compliance.ts` 9, `pages/manifest.ts` 8, `contracts/consent.ts` 6,
   `compliance/preview.ts` 6, `scripts/new-page.mjs` 5, `ui/i18n/words.ts` 4,
   `contracts/site.ts` 4, `scripts/gen-compose.mjs` 3, `submissions/client.ts` 3,
   `backend/src/validate.mjs` 3, plus `usePage.ts`, `serve.mjs`, `dev-stack.mjs`,
   `check_registry.mjs`, `ConsentChoices.vue`). Find them with
   `grep -rnE '"en" \| "es"|\["en", "es"\]|\(en\|es\)|\ben: |\bes: ' packages backend scripts`.
   W1 changes the types and routing in its own files and files requests in `STATUS.md`
   for every listed file it does not own (W2: `usePage.ts`, `client.ts`, `validate.mjs`,
   `ConsentChoices.vue`; T4: `gen-compose.mjs`, `changed-pages.mjs`).
2. `LocalizedText = { es; en; fr }`. Compliance profile, policies, SMS disclosures and
   site page labels gain `fr`. French policy text is a faithful translation marked
   `status: "draft"`; never mark legal text reviewed.
3. Routes: `/{es|en|fr}/{landing|business}/{slug}`, `/{locale}/{policy}`, and the
   homepage `/{locale}/` (see W3). `hreflang` emits es, en, fr and `x-default` → es.
   Language switcher becomes a three-way control.
4. **PageManifest v2** (in `packages/core/src/pages/manifest.ts`):
   ```ts
   definePage({
     slug, accent, layout?: "customer-provider" | string, group: "home" | "vehicle" | "events-learning" | "business",
     pilot: boolean,
     customer: Record<Locale, {
       name, headline, subhead, cta, secondaryCta?: "whatsapp",
       subtypes: { value: string; label: string }[],      // 3–8
       urgency: { value: "today" | "this-week" | "flexible"; label: string }[],
       extraFields: { key: string; label: string; type: "text" | "number" | "date" | "select"; options?: {value: string; label: string}[]; required: boolean }[], // 0–3, blueprint conditional questions
       included: string[], excluded: string[], priceFactors: string[],
       steps: [string, string, string], faq: { q: string; a: string }[], // 5–8
       confirmation: string,
     }>,
     provider: Record<Locale, {
       name, headline, subhead, cta,
       fit: string[], exampleLead: { area: string; service: string; urgency: string; scope: string }, // labelled fictional
       qualification: string[], leadModel: string, commercialTerms: string[],
       controls: string[], workflow: [string, string, string, string, string, string],
       faq: { q: string; a: string }[], confirmation: string,
     }>,
     seasonal: { trigger: string; customer: Record<Locale, string>; provider: Record<Locale, string> }[],
     features: { serviceSelector: boolean; whatsappButton: boolean },
   })
   ```
   `definePage` validates every field for all three locales, lengths (headline ≤ 80,
   subhead ≤ 220, cta ≤ 40, faq a ≤ 600), and that `subtypes`/`extraFields` keys are
   slugs. Keep `getTemplate()` working for existing callers or replace all callers.
5. Slug migration (§3 table): `git mv` renames, delete removed pages, scaffold new ones
   with `scripts/new-page.mjs` (updated to emit the v2 manifest with
   `[PLACEHOLDER]` strings in all three locales), update `config/registry/*.json`
   pages + labels (es/en/fr), and rename `config/registry/preview-breero.json` to
   `breero-preview.json` with `siteId: "breero-preview"`, `brand.name: "Breero"`
   (same host `127.0.0.1`, same origin — do not keep both files, hosts must be unique);
   keep the second fixture site on `localhost` as `"Second Brand Preview"` for
   isolation tests.
6. `scripts/dev-stack.mjs` and `check_registry.mjs` handle `pages/home`.

### 5.2 W2 — Dominican market form, provider application, backend

1. `config/markets/do-santo-domingo.json`: country `DO`, currency `DOP`, phone pattern
   `^\+?1?[ -]?(809|829|849)[ -]?\d{3}[ -]?\d{4}$`, zones (Distrito Nacional sectors and
   Santo Domingo Este/Norte/Oeste — each with `es`/`en`/`fr` label), service hours
   placeholder. Site registry entries reference a market id.
2. **Customer form** (blueprint "Customer form fields"), two visible steps:
   step 1 subtype, zone, urgency (+ manifest `extraFields`); step 2 short description,
   name, phone/WhatsApp, preferred contact (`whatsapp` | `call` | `email`), optional
   email, **required** service-contact permission (shares the request with a matched
   independent provider — exact wording per locale), **separate optional** promotions
   permission. No full address, no account, no photo upload in this release
   (photo = documented follow-up). Remove US state/ZIP fields.
3. **Provider application** (blueprint "Provider form step one"): business/person
   name, trade (prefilled from slug), zones served (multi), contact name, phone,
   email, operating hours, plus step-two preview fields: subtypes supported, capacity
   per week, languages, has-insurance (yes/no/na). Confirmation text from manifest.
4. Submission envelope v3 (`schemaVersion: 3`): `{ request|application, consentIntent,
   attribution: { utm_source, utm_medium, utm_campaign, utm_content, fbclid?, landing_path } }`.
   Attribution is read from the URL on load, kept in memory only, never in storage.
5. Backend `validate.mjs` validates v3 for both kinds against the site's market and the
   page manifest (subtype/zone/extraFields must exist), rejects v2 with a clear error,
   keeps every existing guarantee (site-scoped source URL, consent-intent equality,
   idempotency, replay, conflict, release on delivery failure).
6. Add `destination.type: "n8n"` (webhook variant with `X-Breero-Signature` HMAC-SHA256
   of the body using the secret named in `authEnv`) and `"odoo"` stub that throws
   "not configured" — both covered by tests with fake transports, neither enabled in
   any registry entry.
7. Spam protection scaffold: optional `turnstile` block in the site registry
   (`{ siteKeyEnv, secretEnv }`); when present the backend verifies the token
   server-side before validation (fake transport in tests); absent = skipped. Off in
   all bundled registries.
8. Rate limit: per-IP + per-site token bucket in memory (default 10 submissions /
   10 minutes), 429 with `Retry-After`. Configurable per site.

### 5.3 W3 — homepage, customer layout, provider layout, brand

1. `pages/home` package: the corporate homepage in the blueprint's 10-section order
   (header with Services / How it works / For businesses / About / Help; hero with
   **Find a service** and **Join as a provider**; service finder by group + zone;
   customer journey; provider journey; trust section with **placeholders only**;
   seasonal feature slot from config; business accounts CTA **Request a business
   service plan**; provider recruitment CTA **Explore provider opportunities**; FAQ +
   footer). Routes `/`, `/{locale}/`. Links to service pages use `pageHref()`.
2. `CustomerLayout.vue` following blueprint "Customer landing-page outline" 1–12 in
   order, driven entirely by manifest v2 `customer[locale]`.
3. `ProviderLayout.vue` following "Provider landing-page outline" 1–12, with the
   example lead visibly labelled "Ejemplo ficticio / Fictional example / Exemple fictif".
4. Thank-you states: customer shows request reference + next step + "not a booking"
   sentence; provider shows "under review, not activated".
5. Sticky mobile CTA bar (primary CTA + WhatsApp when `features.whatsappButton`) that
   never covers form fields (verify at 390px).
6. Design system in `tokens.css` + `docs/BRAND.md`: Breero wordmark as live text (no
   image logo yet), restrained palette with a single brand accent plus per-service
   accent, type scale, spacing, button styles, focus styles, dark-on-light only.
   Contrast ≥ 4.5:1 for text. No stock photos of people; use the existing CSS house
   illustration pattern or neutral iconography.
7. WhatsApp button: `https://wa.me/<number>?text=<prefilled, per locale, per service>`
   with the number from site config (placeholder `18095550100`); clicking is tracked
   as a click only, never as a lead (blueprint §Measurement).

## 6. Content (Phase 2 — W4, W5, W6 in parallel, after W1's manifest v2 lands)

For each of your 10 services, fill `pages/<slug>/page.config.ts` (manifest v2) in
**es, en, fr** for **customer and provider**:

- Use the blueprint row for that service: offer, CTA wording, seasonal angle, and the
  conditional questions it names (catering: event date + guests; towing: vehicle type
  + safe pickup location; tutoring: subject + schedule + "the contact must be the
  parent/guardian when the learner is a minor"; appliance: type + brand; HVAC:
  equipment type).
- Spanish is the primary language and must read as written by a Dominican native
  speaker (use "usted" for customers, local terms — e.g. "aire acondicionado",
  "inversor", "cisterna", "zafacón" where natural); English and French are adapted,
  not word-for-word. French: standard international French, "vous".
- Headline names the problem and the city: "¿Su aire acondicionado no enfría en Santo
  Domingo?" Supporting promise never implies guaranteed arrival or price.
- Pricing expectations: what changes the price; never a number unless the owner has
  supplied a real one (none supplied → explain factors only).
- Provider pages: lead model text = "one qualified request reserved for one provider
  with a disclosed acceptance period; charged only after you accept; exclusivity
  means we do not send that request to another provider, not that the customer has
  contacted no one else" (localized). Commercial terms list contains
  `[OWNER: lead price]`, `[OWNER: acceptance window]`, `[OWNER: credit window]`
  placeholders — never invent numbers.
- FAQ: 5–8 per audience covering the blueprint's FAQ topics.
- Pilot five services (W4: `hvac`, `plumbing`, `electrical`, `home-cleaning`,
  `pest-control`): complete, polished content. The other 25: complete content too,
  but R4 reviews pilot pages first and in full, the rest by sample (§8).
- Every page builds: `npm run build --workspace=pages/<slug>`.

## 7. Marketing kit — Meta + WhatsApp (Phase 3, prepared, nothing activated)

### 7.1 Per service (W4–W6 for their slugs) — `marketing/<slug>/`

`ads.json` validated by `marketing/_tooling/schema.json` (W1):

```json
{
  "slug": "hvac",
  "campaigns": [
    { "audience": "customer", "objective": "LEADS", "destination": "website|instant_form|whatsapp",
      "locale": "es", "name": "DO|santo-domingo|hvac|customer|base|evergreen|v1",
      "primaryText": ["≤125 chars", "variant 2", "variant 3"],
      "headline": ["≤40 chars", "variant 2"], "description": ["≤30 chars"],
      "cta": "LEARN_MORE|GET_QUOTE|APPLY_NOW|WHATSAPP_MESSAGE|SIGN_UP",
      "landingPath": "/es/landing/hvac", "utm": { "utm_source": "meta", "utm_medium": "paid_social", "utm_campaign": "...", "utm_content": "{{ad.name}}" } }
  ],
  "instantForm": { "es": { "intro": "...", "questions": [ { "type": "custom_multiple_choice", "label": "...", "options": ["..."] }, "FULL_NAME", "PHONE" ], "privacyPolicyPath": "/es/privacy-policy", "thankYou": "..." }, "en": {}, "fr": {} },
  "whatsapp": { "es": { "prefill": "Hola, necesito ayuda con mi aire acondicionado en ...", "iceBreakers": ["...", "...", "..."] }, "en": {}, "fr": {} },
  "creativeBriefs": [ { "type": "image", "audience": "customer", "concept": "problem/solution", "copyOverlay": {"es": "", "en": "", "fr": ""}, "notes": "no people's faces unless consented real staff; no before/after unless real" },
    { "type": "vertical-video-9x16", "audience": "customer", "durationSec": 15, "shots": ["..."] },
    { "type": "image", "audience": "provider", "concept": "recruitment" },
    { "type": "image", "audience": "customer", "concept": "seasonal", "season": "..." } ]
}
```

Required per service: customer + provider campaigns in es, en, fr for **website**
destination; customer **instant_form** and **whatsapp** variants in es; ad headline
and CTA must match the page headline and CTA for the same locale (T3 checks this).
Naming follows `country|city|service|audience|offer|season|creative` (blueprint).
Provider ads target businesses as partners, never as employment.

### 7.2 WhatsApp — W2, `marketing/_whatsapp/`

- `templates.json`: drafts for the WhatsApp Business Platform, each with `name`,
  `category` (`UTILITY` or `MARKETING`), `language` (`es`, `en`, `fr`), body with
  `{{1}}` variables and sample values, buttons. Minimum set: request received
  (utility), provider follow-up asking for missing details (utility), provider
  application received (utility), application approved — next steps (utility),
  seasonal offer (marketing, only for contacts with promotions opt-in), re-engagement
  after 24-hour window (marketing). Each includes the opt-out line where required.
- `flows.md`: click-to-WhatsApp conversation script per audience (greeting →
  service → zone → urgency → consent → human handoff), after-hours reply, STOP/opt-out
  handling, human escalation, and the rule that a website form does **not** open the
  24-hour window.
- `docs/MEASUREMENT.md`: event map — `Lead` (customer request accepted by backend,
  not on click), `SubmitApplication` (provider application accepted), `Contact`
  (WhatsApp click — click only), qualification/completion as offline CRM events later.
  Browser Pixel + Conversions API share `event_id` = request id for deduplication.
  Data sent: hashed email/phone only with consent, service slug, locale, zone group;
  **never** job description or free text. Implementation is a disabled-by-default
  module spec + a `packages/core` type only; no script tags added.

### 7.3 Organic and brand — W3, `marketing/_organic/`, `marketing/_brand/`

- `calendar.<locale>.md`: 8-week organic plan using the blueprint weekly mix (Mon tip,
  Tue real project placeholder, Wed seasonal offer, Thu provider introduction, Fri FAQ,
  weekend availability) for the pilot five, Dominican seasonal calendar (heat, rainy
  season May–Nov, hurricane season Jun–Nov, Christmas, school start in August).
- `_brand/`: voice and tone per locale, banned phrases list (guaranteed, best in town,
  #1, verified unless defined, 24/7 unless staffed, free unless truly free), CTA
  glossary es/en/fr, colour/type tokens copied from `docs/BRAND.md`.
- Meta account checklist (`_brand/meta-setup-checklist.md`): business portfolio,
  Page, Instagram professional account, ad account, WhatsApp Business number, domain
  verification for the chosen domain, data source, roles — as a checklist for the
  owner, not performed.

### 7.4 Tooling — W1, `marketing/_tooling/`

- `schema.json` (JSON Schema for `ads.json`) and `validate.mjs` (fails on schema errors,
  over-length fields, missing locales, headline/CTA mismatch with the page manifest).
- `export-meta.mjs`: writes `marketing/out/meta-bulk-<locale>.csv` (Ads Manager bulk
  import columns for campaign/ad set/ad name, primary text, headline, description,
  website URL with UTM, CTA) and `instant-forms-<locale>.json`. `marketing/out/` is
  gitignored.
- npm scripts: `marketing:validate`, `marketing:export`; CI runs `marketing:validate`.

## 8. Testing and review (continuous from Phase 1; gating at Phase 4)

### 8.1 T1 must add tests for

French everywhere (routes, metadata, policies, consent text), manifest v2 validation
(every field, all locales, length limits), market phone/zone validation, customer and
provider envelopes v3 (good + each invalid field), attribution passthrough, rate limit
429, Turnstile verify path (fake), n8n HMAC signature, odoo stub, replay/conflict/
release still green, Provider A data never reachable from Provider B's site
(cross-host test), unknown host 421 everywhere, homepage routing and `/` → `/es/`.

### 8.2 T2 must add browser tests for

Every one of the 61 pages × 3 locales returns 200 with correct `lang`, title, canonical,
three `hreflang` + `x-default`, and no console errors (one fast loop). Full axe
WCAG 2 A/AA + no horizontal overflow at 390/768/1440 for: homepage ×3 locales, pilot
five × 2 audiences × 3 locales. Customer form: step navigation, required-field errors
are announced, consent unchecked blocks submit, promotions stays unchecked by default,
preview submit sends no network POST. Provider form: same. Language switch preserves
input across es → en → fr. Sticky CTA never overlaps a focused input at 390px.
WhatsApp link has correct prefill per locale. Policies readable with JavaScript off in
all three locales.

### 8.3 T3 content linter `scripts/check_content.mjs` (wired as `npm run content:check`)

Fails when: any `[PLACEHOLDER` remains in a pilot page; banned phrases from
`marketing/_brand` appear in any page or ad; digits followed by `%`, `$`, `RD$`, "min",
"minutos", "hours", "heures" appear in customer copy (possible unbacked claims) unless
whitelisted in the manifest; a locale is missing; ad headline/CTA ≠ page headline/CTA
for the same locale; any FAQ has fewer than 5 items; provider pages lack the
exclusivity disclaimer or the fictional-example label. Plus a written report
`docs/missions/reviews/T3-language.md` with a per-page ES/FR verdict.

### 8.4 T4 performance and CI

All 31 page builds in CI matrix (including `home`); bundle budget check (≤ 130 kB gzip JS
per page) as `npm run budget:check`; `marketing:validate` and `content:check` added to
the core job; container smoke for backend and `home` image.

### 8.5 Review protocol

Reviewers start when a writer marks a branch "ready for review" in `STATUS.md`. R1, R2
review platform branches; R3 reviews marketing; R4 reviews every pilot page in full in
all locales (screenshots at 390 and 1440 for each, saved under
`docs/missions/reviews/screens/` as PNG ≤ 200 kB each) and a sample of 2 pages per
content branch for the rest, expanding to the whole branch if a blocker is found.

## 9. Phase order and parallelism

| Phase | Who | Starts when | Ends when |
| --- | --- | --- | --- |
| 0 Setup | R5 | immediately | §10.1 done, worktrees created, `STATUS.md` exists |
| 1 Platform | W1, W2, W3 (+T1, T4 writing tests against the agreed schema) | Phase 0 | three platform branches reviewed (R1, R2) and merged into integration |
| 2 Content | W4, W5, W6 (+T2, T3) | W1's manifest v2 merged into integration | content branches pass `content:check` and R4 |
| 3 Marketing | W1–W6 (§7) (+R3) | Phase 2 branch for the same slugs is merged | `marketing:validate` green, R3 no blockers |
| 4 Gate | all testers + reviewers | Phases 1–3 merged into integration | §11 all true |
| 5 Push & PRs | R5 | Phase 4 | §10.3 done |

Writers rebase on the integration branch whenever it moves; never merge another
writer's branch directly.

## 10. Git, integration, push and PRs (R5)

### 10.1 Setup

1. In the owner's clone, put `landing-pages-branches.bundle` (from the Claude session)
   in the repository root and run:
   `git fetch ./landing-pages-branches.bundle 'refs/heads/atomic/*:refs/heads/atomic/*'`.
   Confirm `atomic/ci-cd-pipelines-20261102` and this mission branch
   `atomic/launch-mission-20261102` exist and `git log --oneline -5` shows the
   restructure, placeholder, CI/CD and mission commits on top of `10d5200`.
2. Push those four branches: `git push -u origin atomic/multi-page-core-20261102
   atomic/placeholder-pages-20261102 atomic/ci-cd-pipelines-20261102
   atomic/launch-mission-20261102`.
3. Create the integration branch `atomic/breero-launch-integration` from
   `atomic/launch-mission-20261102`. Every agent branch in §4 starts from it.
4. Copy the two source documents into `docs/missions/inputs/` on the integration
   branch (first commit) if they are not there yet.
5. `npm ci`; run the full verify list in `README.md` once and record results in
   `STATUS.md` as the baseline.

### 10.2 Integration

R5 merges agent branches into `atomic/breero-launch-integration` with
`git merge --no-ff` only after: the branch's own checks pass, every assigned reviewer
has "no open blockers" in its review file, and the merged result passes the full
verify list. Merge order: W1 → W2 → W3 → T1 → T4 → W4 → W5 → W6 → T2 → T3 → marketing
branches. On conflict, the owning writer rebases and resolves; R5 does not resolve
content conflicts itself.

### 10.3 Push and PRs

1. Push every agent branch and the integration branch (`git push -u origin <branch>`).
2. Open PRs **into `subsection/public--foundation`** in this order, each description
   listing what it contains, the verify results, and links to the review files:
   1. `atomic/multi-page-core-20261102`
   2. `atomic/placeholder-pages-20261102`
   3. `atomic/ci-cd-pipelines-20261102`
   4. `atomic/launch-mission-20261102`
   5. `atomic/breero-launch-integration` (the whole mission; agent branches are
      referenced, not separately PR'd, to keep review tractable)
   Use `gh pr create --base subsection/public--foundation --head <branch> --title ...
   --body-file ...`. Request review from `@appolon1908` and `@kazan555` (CODEOWNERS).
3. **Do not merge** into `subsection/*`, `section/*` or any deploy branch. Promotion
   past atomic branches requires the human owners' review (`AGENTS.md`). Do not
   force-push, do not bypass checks.

### 10.4 Commit attribution

Every commit message ends with:

```
Co-Authored-By: <the agent's model name> <noreply@anthropic.com>
Mission: docs/missions/BREERO_LAUNCH_MISSION.md
```

## 11. Definition of done (R5 verifies every line, records evidence in `STATUS.md`)

- [ ] 30 service packages with the §3 slugs exist; removed slugs are gone; `pages/home`
      exists; `npm run registry:check` lists Breero preview with 30 pages.
- [ ] Every manifest validates for es, en, fr, both audiences; pilot five have zero
      `[PLACEHOLDER` strings; `[OWNER: …]` placeholders remain only for real business
      numbers the owner must supply.
- [ ] `npm run format:check`, `typecheck`, `registry:check`, `test`, `content:check`,
      `marketing:validate`, `budget:check`, `build` (31 pages), `test:browser` all pass
      on the integration branch; counts recorded.
- [ ] 183 localized pages return 200 with correct metadata in the browser suite.
- [ ] axe reports no WCAG 2 A/AA violations on the §8.2 set.
- [ ] Customer and provider forms work in all locales; preview submits nothing; backend
      accepts a valid v3 envelope through the `log` destination in tests and rejects
      each invalid field.
- [ ] `marketing/<slug>/ads.json` exists and validates for all 30; `marketing:export`
      produces CSVs for es, en, fr; WhatsApp templates and flows exist in three locales;
      `docs/MEASUREMENT.md` exists; no tracking script is active.
- [ ] Every review file has no open blockers; T3 language report has no "rewrite"
      verdict on a pilot page.
- [ ] No site in `config/registry` has `mode: "live"`; no destination other than
      `disabled`/`log`; no secrets in the diff (`git diff ... | grep -iE 'token|secret|key'`
      reviewed by R2).
- [ ] All branches pushed; the five PRs in §10.3 are open with descriptions and review
      links; nothing merged into protected branches.
- [ ] `docs/missions/STATUS.md` ends with a summary: what was built, test counts,
      open should-fix items, and the owner's to-do list (§12).

## 12. Owner-only items (record, never fake)

Buy domain(s) and verify ownership of `breero.com` question; trademark search; real
business identity, address, support phone/WhatsApp number and hours; reviewed legal
policies in ES/EN/FR; lead price, acceptance window, credit window; real testimonials,
project photos and provider case studies; Meta business portfolio, Page, Instagram,
ad account, WhatsApp Business number and template approvals; Turnstile keys; n8n/Odoo
endpoints and secrets; deploy host and GitHub Environments (`docs/CICD.md`); merging
PRs; turning any site live.

## 13. If something fails

- Tests fail after a merge into integration: R5 reverts that merge on the integration
  branch, notes it, and the owning writer fixes on their branch.
- A writer cannot meet a rule without inventing facts: use an `[OWNER: …]`
  placeholder and continue.
- Tooling missing (Playwright browsers, Docker): install it; if impossible, record the
  exact command and error in `STATUS.md` and continue with everything else; that check
  is reported as "not run", never as passed.
- Push rejected: record the exact error; do not retry with different credentials or
  bypass protections.
