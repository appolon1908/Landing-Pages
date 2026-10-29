# Shared HighLevel Website Requirements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Root is the sole writer; independent agents research and review.

**Goal:** Give every landing page consistent business-specific website policies and optional SMS choices, with explicit readiness validation.

**Architecture:** Extend the validated public context with a versioned profile. Shared Vue components and an escaped server document renderer consume the same content model; consent intent remains distinct from business authorization.

**Tech Stack:** Existing Vue 3, TypeScript, Node 22, Playwright; no new dependency.

**Spec:** `docs/superpowers/specs/2026-10-29-highlevel-requirements-design.md`

## Global Constraints

- One writer on `atomic/landing-highlevel-requirements-20261029`, based on merged `a33ae15bc1a313fa3c38161d6e5e0b2b527450cd`.
- Public submissions, production publication, advertising, and messaging stay disabled.
- Unknown hosts, private profile fields, and active-effect states fail closed.
- Profile completion and browser choices never establish tenant or dispatch authority.
- Unknown business facts remain explicit drafts; no claim of carrier or legal approval.
- No new dependencies and no unrelated promotion-branch updates.

## Review Focus

- Missing facts or placeholder support details must never pass strict readiness.
- A different merchant, notice version, locale, or collection page cannot inherit SMS choices.
- Lost-response retries must preserve evidence time and idempotency identity.
- Direct policy URLs must expose the actual host's escaped text without JavaScript.
- Every route must use shared components without disrupting homepage Back/Forward or accessibility.

### Task 1: Profile contracts and readiness

**Files:** `packages/contracts/compliance.ts`, `packages/compliance/preview.ts`, `packages/contracts/site.ts`, `config/sites.preview.json`, `scripts/check_compliance.ts`, `tests/compliance.test.ts`.

**Interfaces:** `parseComplianceProfile(value)`, `previewCompliance(brand)`, `assessWebsite(site)`; SiteContext v2 carries `compliance`, v1 is explicitly legacy.

- [x] Add failing strict-profile and readiness tests, including placeholders, unknown fields, and conditional policies.
- [x] Verify the failure is due to missing behavior.
- [x] Implement bounded plain-text validation and explicit draft profiles; migrate bundled configuration.
- [x] Run focused tests and the readiness CLI in report/strict modes.

### Task 2: Shared documents, routes, and identity

**Files:** `packages/compliance/pages.ts`, `apps/public/components/BusinessFooter.vue`, `apps/public/components/PolicyPage.vue`, `apps/public/App.vue`, `server/index.mjs`, `apps/public/styles.css`, `tests/compliance-http.test.mjs`, `tests/e2e/compliance.spec.ts`.

**Interfaces:** `resolvePolicy(path)`, `policyPath(locale,document)`, `getPolicyDocument(site,route)`, `pageMetadata(site,route)`.

- [x] Add failing direct-route/host-isolation/no-JS/escaping tests.
- [x] Implement shared document content, same-origin navigation, metadata, and root-shell identity.
- [x] Test disabled/unknown routes, HEAD, forged selectors, all 20 landing pages, and policy Back/Forward.

### Task 3: Separate choices and immutable intent

**Files:** `packages/contracts/consent.ts`, `packages/api-clients/submissions.ts`, `apps/public/components/ConsentChoices.vue`, `apps/public/App.vue`, `tests/consent.test.ts`, `tests/e2e/compliance.spec.ts`.

**Interfaces:** `reconcileConsent(previous,context,choices,time)`, `buildSubmissionDraft(fields,context,intent)`, business-specific request-contact wording.

- [x] Add failing tests for independent choice combinations, scope resets, stable retries, and legacy-envelope rejection.
- [x] Implement optional unchecked controls and immutable browser-intent snapshots.
- [x] Verify zero selected SMS choices permit normal form review and no network POST is sent.
- [x] Verify locale/profile changes reset SMS choices while retaining ordinary input.

### Task 4: Evidence, review, and publication

**Files:** `docs/HIGHLEVEL_REQUIREMENTS.md`, `docs/CONTRACTS.md`, `docs/VERIFICATION.md`, package scripts and necessary CI/readiness coverage.

- [x] Document the business-profile workflow, exact-wording review, conditional requirements, and backend/provider acceptance handoff.
- [x] Run formatting, type checks, complete unit/HTTP/browser/accessibility suites, branch policy, build, and audit.
- [ ] Verify required hosted container smoke on the published commit.
- [x] Obtain fresh independent whole-source review and correct material findings.
- [ ] Publish a guarded descendant commit and atomic PR to `subsection/public--foundation`; request eligible review and verify exact-commit CI.
- [ ] Leave the implementation worktree clean and report actual readiness blockers without claiming live approval.

Post-commit publication, hosted checks, eligible review and clean-worktree evidence are recorded in the pull request and task ledger. This source snapshot records the completed local work without anticipating those results.
