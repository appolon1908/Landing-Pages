# Verification


## Standalone foundation — 2026-10-23

On dev-desktop, formatting, Vue/TypeScript checking, all 8 unit/contract/HTTP tests, branch-policy tests, the production-shaped bundle build and all 8 Chromium browser tests passed. npm audit reported 0 vulnerabilities. The shared host was under severe disk I/O pressure; temporary browser files used a private task directory in memory, and expectation timeouts were extended locally without changing assertions.

Browser coverage renders all 20 localized category/audience routes, checks axe WCAG A/AA rules and overflow at 390/768/1440 px, preserves entered details on language changes, confirms zero submission POSTs, rejects fabricated thank-you receipts, separates company host contexts, and verifies a company whose first offering is not HVAC. The homepage regression was observed failing before the fix. The desktop preview was visually inspected.

A fresh independent whole-source review identified two functional issues across this change set; both received failing regressions and fixes. The Flow runbook and backend image-smoke command documentation are also complete. No review finding is being treated as GitHub approval.

Local image building was stopped when the shared host root disk reached 100% utilization. Required hosted container-smoke CI must verify the exact published tree before promotion. No local image result is claimed from the interrupted attempt.

See GOVERNANCE.md and READINESS.md for enforcement and owner handoffs. Real Keycloak/gateway staging integration and Breero company/site publication authority are separate release gates. No merge, deployment, publication, live submission, charge, message, ad or workflow execution was activated.

## Homepage history and commerce handoff — 2026-10-28 (America/La_Paz)

This repair starts from published commit `9032d201e821324b45fa313b063f7543987309c0` on the existing `atomic/landing-pages-bootstrap-20261023` branch. Initial loading and browser history now share the same homepage definition: the validated site's first offering, English customer content, and no thank-you state. Returning to `/` updates the rendered page and document metadata without adding a history entry or clearing entered form values.

### Regression evidence

Three new Playwright cases use real browser Back and Forward after changing service, audience, or language. Their site-context fixture deliberately starts with chimneys rather than HVAC. Each case checks the URL, selected offering, document language, title, heading, audience-specific fields, canonical URL, and retained name after both history directions.

With the new tests and the original `App.vue`, all three cases failed at the intended Back assertions: the service remained plumbing, the audience remained provider, or the language remained Spanish. After the repair, all three passed as part of the full browser suite. Browser launch failures during runner setup were excluded from this regression evidence.

### Local validation

Validation ran on dev-desktop using Node 22.23.4 and installed Google Chrome. The runner used private XDG directories and a short private temporary path to satisfy Chrome's writable-directory and Unix socket-path requirements. Repository browser assertions and timeouts were unchanged; the full run completed without a timeout.

| Check | Result |
| --- | --- |
| `npm run format:check` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | 8 passed; none failed or skipped |
| `python3 scripts/test_branch.py` | Passed |
| `npm run build` | Passed |
| `npm run test:browser` | 11 passed, including all three new history regressions and existing accessibility/host-isolation coverage |
| `npm audit --audit-level=high` | 0 vulnerabilities reported |

A fresh independent source review of the repair, regressions, and commerce handoff found no findings requiring correction. This technical review is separate from the eligible GitHub approval required after the latest push. Hosted `landing-checks`, `branch-governance`, and `container-smoke` must pass for the resulting PR revision before promotion; exact commit and run links belong in the PR evidence. No new local image result is claimed.

### Integration scope

`COMMERCE_HANDOFF.md` defines the verified publication-to-merchant-to-WhatsApp binding, server-derived authorization, commerce-service data ownership, and policy API → Middleware → provider reply route. It also specifies revocation, transactional order/outbox work, duplicate recovery, and conversation takeover fencing. This change defines the contract; it does not provision that binding or implement the commerce service. Public submissions and runtime commerce/messaging effects remain disabled.
