# Landing-Pages

Independent Vue 3 / TypeScript frontend for company-scoped campaign and signup pages.
Five initial offerings have client/provider layouts in English and Spanish (20 routes).
The foundation is a runnable **preview**, with external effects disabled.

## Start from a clean clone

Use Node 22.18 or newer in the 22 release line and Python 3 for the governance check.

```sh
npm ci
npm run typecheck
npm test
npm run build
npm start
```

Open http://127.0.0.1:4173/en/landing/hvac-heating. The hostname `localhost` resolves
to a separate synthetic brand on the same local listener. These are public test
fixtures, not customer workspaces or tenant-authentication proof.

Alternatively run `docker compose up --build` and open the same URL. The image runs
as a non-root user on a read-only filesystem. Only a loopback host port is published.
`/healthz` reports application availability and disabled effects.

Routes: `/{en|es}/{landing|business}/{offering}` and matching `/thank-you` routes.
Supported offerings: hvac-heating, chimney-fireplace, insulation-weatherproofing,
gutter-cleaning-repair, plumbing-winterization. Language changes preserve form input.
A direct thank-you URL does not claim a request or appointment was accepted.

## Ownership and integration

- Landing-Pages: validated public site context, localized layouts, accessible forms,
  same-origin client contracts and independent preview hosting.
- Breero: authoritative company/site/domain bindings, business records, consent,
  public submission receipts, publication, bookings, fees and billing.
- Codestra-Grapes / Codestra-React-Flow: independent authoring applications.
- Codestra-Marketing-Backend: tenant-scoped draft project persistence and authorization.
- Existing Caddy/Kong, Keycloak, Middleware and adapters retain their boundaries.

The public registry contains only approved public preview documents. Its host mapping
is operator configuration; it does not prove domain ownership. The hosting server
ignores forwarded-host/client workspace selectors and rejects unknown hosts.
Private data must never be put into this registry or the static build.

The current Breero request schema has no verified company/site authorization binding.
The typed client preserves its existing required fields, receipt shape and retry keys;
hosting returns 503 for submission routes. The UI validates preview forms and says
that nothing was sent. A browser toggle cannot enable delivery. See
[contracts and owner handoff](docs/CONTRACTS.md) before any activation.

No payment, membership enrollment, publishing, analytics export, customer message,
CRM write or appointment is activated. The preview uses no third-party tags and does
not persist form details to local storage. Page metadata is localized; preview hosts
are noindex and have an empty sitemap. Published artifact/SEO activation remains a
separate Breero-owned release boundary.

## Shared website requirements

Every landing layout uses the same business footer, About and Contact pages, direct
Privacy Policy and Terms URLs, and optional separate service/marketing SMS choices.
English and Spanish policies are also readable without JavaScript. A v2 public
business profile supplies identity, reviewed wording, versions and applicability;
applicable conditional policies appear from that profile.

Complete and review the profile once per business, then use the readiness report:

```sh
npm run compliance:check
npm run compliance:check -- --strict
```

The bundled profiles are explicit drafts, so strict mode intentionally fails until
real business facts, applicability and reviewed policies are supplied. This is a
structural website check; it does not authorize publication or certify HighLevel
registration. See [shared website requirements and business handoff](docs/HIGHLEVEL_REQUIREMENTS.md).

The form creates a versioned preview intent that preserves the wording and separate
choices. The legacy submission adapter rejects that richer envelope pending a
server-owned consent contract; no browser choice grants tenant or sending authority.

## Verify

```sh
npm run format:check
npm run typecheck
npm test
python3 scripts/test_branch.py
npm run build
npx playwright install chromium
npm run test:browser
npm audit --audit-level=high
python3 scripts/container_smoke.py
```

On dev-desktop use `CHROME_BIN=/usr/bin/google-chrome` for browser checks and
`DOCKER='sudo -n docker'` for image checks. Browser tests exercise the real local
server, twenty localized routes, three viewport widths and accessibility. They do
not certify live Breero, Keycloak or the shared gateway.

## Review and release

Atomic implementation branches target `subsection/public--foundation`, followed by
the configured section and environment promotion path. The shared website feature
uses `atomic/landing-highlevel-requirements-20261029`.
Follow branch-policy.json and require independent review and actual current-head
checks. Source CODEOWNERS/CI do not alone prove GitHub settings are enforced.
See [runbook](docs/RUNBOOK.md), [verification](docs/VERIFICATION.md) and the
[approved architecture](https://linear.app/passion-fruit/document/landing-pages-multi-industry-and-multi-brand-architecture-editor-a5d8ef195442).


Standalone startup and rollback: [runbook](docs/RUNBOOK.md). Branch enforcement: [governance](docs/GOVERNANCE.md). [Repository responsibilities and release gates](docs/READINESS.md). See [verification](docs/VERIFICATION.md) for observed checks and remaining integration gates.
