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

## Shared HighLevel website requirements — 2026-10-29

The new `atomic/landing-highlevel-requirements-20261029` branch starts from merged
foundation commit `a33ae15bc1a313fa3c38161d6e5e0b2b527450cd`. All landing layouts now
consume one strict public business profile for shared identity, direct localized
policy documents and separate optional SMS choices. The implementation and business
handoff are described in [HIGHLEVEL_REQUIREMENTS.md](HIGHLEVEL_REQUIREMENTS.md).

### Regression and independent review evidence

Before implementation, twelve focused new tests failed for missing profile,
consent and direct-policy behavior; the direct policy request returned 404 instead
of 200. The original eight unit/HTTP tests passed at the branch baseline.

A fresh independent whole-source review found a string-enum coercion defect that
could suppress a draft notice when a JSON array was accepted as a review status.
A focused regression reproduced the missing rejection before the correction. The
parser now compares actual literal values, and seven malformed enum variants are
covered. Independent re-review verified all seven rejections and found no remaining
material finding. A separate requirements audit found no material coverage omission
within the documented preview and business-profile scope. These technical reviews
are separate from eligible approval on the GitHub pull request.

The browser run initially exposed an ambiguous test selector after description
metadata was added. The regression now selects the textarea explicitly. A runner
attempt without the configured Chrome executable was excluded from application
evidence; the final run used installed Chrome and unchanged assertions/timeouts.

### Final local validation

Validation ran on dev-desktop with Node 22.23.4, private XDG/temp directories and
`CHROME_BIN=/usr/bin/google-chrome`. The final source passed:

| Check | Observed result |
| --- | --- |
| `npm run format:check` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | 23 passed; none failed or skipped |
| `python3 scripts/test_branch.py` | Passed |
| `npm run build` | Passed |
| `npm run test:browser` | 15 passed; includes all homepage history regressions, all 20 landing routes, optional SMS choices, policy Back/Forward, JavaScript-disabled policies and mobile accessibility |
| `npm audit --audit-level=high` | 0 vulnerabilities reported |
| `npm run compliance:check -- --json` | Report succeeded; both preview businesses have 20 explicit readiness blockers and no publication authority |
| Strict readiness regression | Both bundled drafts correctly produce exit status 1 under `--strict` |

The desktop Terms page, mobile consent form, mobile shared footer and Spanish
Privacy Policy were visually inspected. Text, controls, draft labels and policy
navigation were readable without clipping or horizontal overflow.

Required hosted `landing-checks`, `branch-governance` and `container-smoke` must
verify the published commit. Their exact commit/run links and final review gate
state are recorded in the pull request, after this source snapshot is committed.
No new local container result is claimed.

### Business and integration limits

Bundled data deliberately lacks real legal identities, working support contacts,
public business domains, reviewed policy revisions and applicability decisions.
Draft wording is illustrative; applicable HighLevel-prescribed wording still needs
business/provider review. The CLI checks structure and supplied review state. It
does not prove contact validity, policy accuracy, jurisdictional compliance,
publisher authorization or carrier approval.

Browser choices are immutable preview intent, not durable consent or tenant
authority. The legacy adapter rejects the richer envelope, and the hosting server
continues to reject submissions. The authoritative publisher, intake/consent owner,
commerce service, policy API and Middleware/provider route retain their documented
responsibilities. No production publication, customer message, CRM write, payment,
tracking or live workflow was activated.
