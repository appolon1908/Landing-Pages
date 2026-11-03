# Breero Launch Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Work in isolated atomic branches. No external effects.

**Goal:** Rebuild the user's 61-page ES/EN/FR preview with CRM-owned intake and source-backed marketing drafts.

**Architecture:** Existing npm monorepo, pure core contracts, shared Vue UI, 31 independent page packages, one host-scoped intake backend. CRM retains business authority.

**Tech Stack:** Node 22.18+ within 22.x, Vue 3, TypeScript, Vite, Node tests, Playwright and axe. Use retained lockfile.

**Spec:** `docs/superpowers/specs/2026-11-03-breero-launch-recovery-design.md`; detailed source content in `docs/missions/inputs/`.

## Global Constraints

- All bundled sites remain preview with disabled destinations. No provider, ad, message, fee, scheduling or deployment effects.
- CRM is authoritative; vendor unconfirmed. No duplicate business database or invented durable receipt.
- Locales es/en/fr, default es; canonical thirty slugs in service-content-map.json.
- Preserve unknown work, existing core branch, five-page preview and all protected branches.
- Four page writer/coder roles, paired section ownership, three reviewer roles and three tester roles run in waves under the three-worker limit.
- Required guarded codestra-local SHA parity remains unresolved until an approved remote is supplied.

## Review Focus

- Unknown or forged hosts/origins must not obtain another site's context or forward a request.
- Locale changes retain entered data but invalidate stale consent presentation.
- Reordered canonical JSON must not reject equal consent; changed consent must fail.
- Preview and direct thank-you navigation must never report accepted business state.
- Duplicate/failed/uncertain CRM delivery must not be described as durable exactly-once behavior.

## Task 1: Shared trilingual platform and manifest contracts

Files: core contracts/compliance/pages and manifest; UI locale dictionary/language controls as required for compilation; page-kit routing/metadata; page scaffolder; registry validation; existing page configs/tests.

Produces: strict manifest v2 types and validator from prior-mission section 5.1, `locales`, `getTemplate` compatibility, explicit homepage route support, three-locale policies/metadata, canonical service registry scaffolding. Do not implement new business flows or enable destinations.

- [ ] Add failing tests for all locales, malformed manifests, explicit service/home routes, unknown hosts and draft policies.
- [ ] Implement minimum shared contracts and migrate existing consumers/fixtures; communicate exact exported types before downstream work.
- [ ] Scaffold canonical thirty service packages and home without erasing supplied source history; placeholders are temporary until Task 4.
- [ ] Run format/type/registry/unit checks and representative page builds; review and commit.

## Task 2: CRM intake and Dominican forms

Consumes: stable Task 1 manifest, locale, site and route contracts. Files: submission client/contracts, backend validation/adapters/proxy limits, market config, UI usePage/IntakeForm/consent controls and focused tests.

- [ ] Add failing v3 customer/provider and canonical-consent tests; include invalid fields, site spoofing, oversized body, duplicate/retry and preview behavior.
- [ ] Implement two-step customer form, provider application, bounded attribution and conditional questions; preserve permissions separately.
- [ ] Implement server validation, generic disabled CRM boundary, rate limit and optional server-side spam verification with fake transports.
- [ ] Run focused and full unit tests, typechecks and review; commit without activation.

## Task 3: Shared layouts and corporate homepage

Consumes: Task 1 manifest and Task 2 controller; files: customer/provider layouts, home package, shared shell/styles/tokens and browser assertions.

- [ ] Add route/UI assertions for distinct audiences, homepage navigation, conditional forms and honest confirmation.
- [ ] Implement blueprint section order and accessible responsive presentation; disable unavailable contact actions with explanatory copy.
- [ ] Validate mobile layout and keyboard use with browser/axe; review and commit.

## Task 4: Thirty-service content, paired sections and localization

Consumes: frozen manifest v2. Files: per-service page.config.ts or validated content module, never backend/core logic. Batch in three groups of ten using isolated code worktrees after platform freeze.

- [ ] Draft each audience and locale using service-specific inclusions/exclusions/subtypes/conditional questions, truthful pricing factors and 5–8 FAQs.
- [ ] Check copy and code ownership separately for all twelve sections; maintain explicit owner placeholders and fictional examples.
- [ ] Validate every manifest and content policy; independently review pilot pages in full and remaining pages by sample; fix findings and commit each batch.

## Task 5: Draft marketing package and content/build tooling

Files: marketing content/schema/export/validator, content linter, measurement/brand docs, page inventory and build-budget tooling.

- [ ] Test ad/page/CTA locale consistency, banned unsupported claims and correct required artifact coverage.
- [ ] Prepare thirty ad kits, ES/EN/FR exports, WhatsApp/organic drafts; leave all activation off.
- [ ] Run content/marketing/budget/build checks; review and commit.

## Task 6: Independent review, test waves and checkpoint

- [ ] Reviewer 1 architecture/security; Reviewer 2 UX/accessibility; Reviewer 3 language/claims/marketing. Each reports exact SHA and unresolved findings.
- [ ] Tester 1 unit/contracts; Tester 2 all 183 routes plus99 pilot axe cases; Tester 3 content/build/CRM failure boundaries. Use current tests and extend coverage meaningfully.
- [ ] Run complete required gates and git diff --check; resolve material failures, preserve evidence and create self-contained recovery bundle.
- [ ] Publish through approved codestra-local guarded publisher, record exact parity, then mirror/review on GitHub without protected merges. If destination remains missing, report the specific publication blocker and preserve local work without claiming delivery.
