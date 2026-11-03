# Breero Public Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare a reversible, isolated public website deployment while all CRM and provider effects remain disabled.

**Architecture:** Generate one immutable release for 31 page containers and a private backend. Existing Caddy routes remain intact; a reviewed import adds Breero route dispatch and a verified shared asset directory.

**Tech Stack:** Node 22, Python 3 standard library, Docker Compose, existing host Caddy.

**Spec:** `docs/superpowers/specs/2026-11-03-breero-public-deployment-design.md`

## Global Constraints

- Target `https://breero.com`; preview mode and disabled destination are mandatory.
- Source lives in `/srv/codestra/breero/releases/<40-character-sha>/source`.
- Home port 6100; canonical services 6101–6130; all ports bind 127.0.0.1.
- No existing production resources, credentials, DNS or Caddy configuration are changed by preparation.
- No broad Docker cleanup; no protected-branch publication; review before commit.

## Review Focus

- Similar service slugs and thank-you/trailing-slash routes must select only the intended page.
- Asset filename collisions with different bytes must fail before activation.
- Malformed release paths, domains or revisions must not reach shell/config interpolation.
- Unrelated Compose project resources must cause a fail-closed deployment preflight.
- Failed readiness and rollback must leave a recoverable prior release and explicit failure.

### Task 1: Release generation and shared build cache

**Files:** `deploy/breero/generate.mjs`, `Dockerfile.page`, `tests/deploy/release.test.mjs`.
**Interfaces:** `createRelease({ revision, releaseDir, catalog, registry })` returns release metadata, Compose document and Caddy text. `writeRelease()` writes only a new validated release configuration beside `source`.

- [ ] Write failing tests for 32 services, exact ports/routes, disabled registry, unsafe inputs and shared npm cache ordering.
- [ ] Run tests and confirm expected failures.
- [ ] Implement generator and move build-stage PAGE below npm ci.
- [ ] Run focused tests and validate generated registry through the existing parser.

### Task 2: Asset collection and scoped release operations

**Files:** `deploy/breero/release.py`, `tests/deploy/test_release.py`.
**Interfaces:** CLI operations `build`, `collect-assets`, `up`, `check`, `rollback` consume the generated release directory; `check` accepts loopback or the exact public Breero origin. Asset union compares every same-name file byte-for-byte. Docker subprocess arguments are arrays.

- [ ] Write failing tests for conflicting assets, symlinks, unrelated project ownership, failed readiness and prior-release restoration.
- [ ] Run tests and confirm expected failures.
- [ ] Implement sequential image build, stopped-container asset extraction, readiness/route checks and scoped rollback without Caddy/DNS modification.
- [ ] Run tests; inspect all mutating commands for exact owned resource scope.

### Task 3: Operator handoff and independent review

**Files:** `deploy/breero/README.md`, package test script if needed.

- [ ] Document source/registry generation, build/extraction, Caddy backup/import/validate/reload, DNS prerequisites and rollback sequencing.
- [ ] Run Node/Python tests, format/type/registry/content/unit checks, audit and diff checks. Run representative build if Dockerfile/source changes require it; leave Docker/Caddy execution to controller.
- [ ] Obtain independent review; fix findings and commit coherent code. Report exact SHA and pending host gates.
