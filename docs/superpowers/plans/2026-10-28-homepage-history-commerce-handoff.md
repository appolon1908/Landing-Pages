# Homepage history repair and commerce handoff

Approved scope: finish the homepage history repair in PR #1's existing atomic
branch, add focused browser coverage, define the landing-to-commerce contract,
obtain current-commit CI and independent review, and advance through the existing
promotion hierarchy when its gates pass.

Baseline: `9032d201e821324b45fa313b063f7543987309c0` on
`atomic/landing-pages-bootstrap-20261023`.

## Constraints

- One writer uses the existing isolated implementation worktree.
- Preserve the original local bootstrap commit before aligning its identical
  source tree with the published baseline.
- Keep preview submissions and production effects disabled.
- Public site identifiers establish presentation context only. Breero owns site
  publication; the designated commerce service owns commerce data; sends pass
  through the WhatsApp policy API, Middleware and provider adapter.
- Publish descendant commits without force; promote only by the declared PR path
  with current CI, eligible independent approval and resolved review discussions.

## Task 1: Restore the homepage during history navigation

Files: `tests/e2e/home.spec.ts`, `apps/public/App.vue`.

1. Add three real-browser regressions starting at `/` with `chimney-fireplace`
   as the first site offering. Change service, audience or language. Back must
   restore the English customer homepage, first offering, title and canonical
   URL. Forward must restore the selected explicit route. Retain entered input.
2. Run `npm run test:browser -- tests/e2e/home.spec.ts` on the unchanged app and
   observe each new regression fail on stale state after Back.
3. Add `homepage(context: SiteContext): PageRoute` inside `App.vue` and use it for
   initial `/` loading and `popstate`. Only `/` gets this fallback; do not push
   history from the handler or alter unknown-host/unknown-route rejection.
4. Rebuild, run the focused regressions, then run formatting, type, unit/contract,
   branch-policy, full browser/accessibility, dependency audit and image checks.

## Task 2: Define the commerce handoff

Files: `docs/COMMERCE_HANDOFF.md`, `docs/CONTRACTS.md`.

Define the server-owned published-site/merchant/verified-channel binding,
ownership evidence, versioning/revocation, public projection, customer and staff
authorization, persistent commerce ownership, idempotency and approved send path.
Keep authoritative conversation mode/version in the commerce service; require a
fresh authorized dispatch decision at the policy boundary. State explicitly that
the contract adds no live bindings, runtime routes or messaging activation.

Review acceptance cases for forged selectors, cross-tenant access, revoked
bindings, duplicate events, lost acknowledgements and stale replies after human
takeover. Human-readable contract prose needs review, not source-text tests.

## Task 3: Review, publication and promotion

Files: `docs/VERIFICATION.md`, the existing PR description and review discussion.

Record observed red/green and full-suite results. Obtain an independent source
review. Publish the tested source as a descendant of the observed remote head and
read back the new SHA. Verify all three PR-triggered checks on that SHA. Request
fresh approval from the eligible existing reviewer, `kazan555`; an agent review
does not replace GitHub's required approval. Resolve the repaired finding after
verification and advance atomic -> subsection -> section -> development -> testing
-> staging -> production only as each PR's checks and approvals permit.

## Review focus

Site-specific non-HVAC defaults; Back/Forward history preservation; matching
content/language/title/canonical state; retained form input; preview and host
isolation boundaries; no browser-supplied commerce authority; authoritative
conversation state and revocation at dispatch.
