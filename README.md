# Landing-Pages

Preview of a two-sided service marketplace: one corporate homepage, thirty customer
pages and thirty provider pages, each in Spanish, English and French. The 61 pages
produce 183 localized public routes, plus policy routes. Thirty-one independent
page packages share Vue layouts, validated content, a page server and one intake backend.

All bundled sites are **preview-only with submissions disabled**. CRM is the intended
business authority; its vendor and live integration are unconfirmed. Requests do not
confirm appointments, applications do not activate providers, and marketing files are drafts.

## Local preview

Use Node 22.18+ within the 22.x line and Python 3 for governance checks.

```sh
npm ci
npm run build
```

Start a small preview with the homepage and two services:

```powershell
$env:PAGES = 'home,hvac,plumbing'
node scripts/dev-stack.mjs
```

On a POSIX shell: `PAGES=home,hvac,plumbing node scripts/dev-stack.mjs`.
Open `http://127.0.0.1:4173/es/`; HVAC is on port 4174 and plumbing on 4175.
Use `/es/landing/hvac` for customers and `/es/business/hvac` for providers on the
HVAC server. Replace `es` with `en` or `fr` to change language.

Omit `PAGES` to start all 31 packages in alphabetical order. `BACKEND_PORT` and
`FIRST_PAGE_PORT` override the default backend 4000 and first page 4173. The startup
log identifies every port. The script creates a temporary registry for cross-page
navigation; it does not modify checked-in files. Include at least one service with
`home`; a standalone home server can use an existing catalog backend via
`BACKEND_URL` and `npm start --workspace=pages/home`.

## Front Desk voice-booking demo

The shared customer/provider layouts and corporate homepage include a localized
BREERO panel with separate voice and booking-form choices, preserving the supplied
company branding and service images. The links are unavailable by default.
The thirty customer pages use this booking entry instead of the previous inline
customer intake form. Their hero, final and mobile booking CTAs open the BREERO
form with the current service and language when configured; otherwise they stay
on the page and focus the unavailable booking panel. Provider pages retain their
existing inline application and application CTAs. The corporate homepage and all
provider pages also retain the separate voice/form choices.
Start the separate Front Desk app, then
set its printed localhost origin before starting this preview stack:

```powershell
$env:FRONT_DESK_DEMO_ORIGIN = 'http://127.0.0.1:54253'
$env:PAGES = 'home,hvac,plumbing'
$env:BACKEND_PORT = '56400'
$env:FIRST_PAGE_PORT = '56410'
node scripts/dev-stack.mjs
```

Open `http://127.0.0.1:56410/es/` and choose **Hablar con BREERO** or
**Formulario de reserva**.
Change the demo port to the one actually printed by Front Desk. All selected page
servers use the same backend setting. Environment files are not loaded implicitly;
remove the variable to disconnect the entry. No OpenAI key belongs in these pages.

`GET /api/front-desk` reads only this server setting after existing site-host
authorization. It accepts exact HTTP `localhost`/`127.0.0.1` origins without paths,
credentials, queries or fragments and withholds the origin on public hosts. Unknown
hosts still fail closed; browser query parameters cannot choose a destination.
Configured availability is not a health check of the separately running app.

The new tab uses an isolated preview calendar. It does not reserve these
advertised services or create CRM/Breero appointments. Its bounded `source=breero`,
`service`, `audience`, `locale` and `mode=voice|form` query fields are presentation context only; the
homepage omits `service`. No customer data, credentials or tenant grants are passed.
The separate demo interface is currently in English. Microphone permission is
requested only after starting voice in Front Desk.

Real integration requires an approved HTTPS voice-service deployment, server-held
OpenAI credentials, verified company/site/domain authorization and the existing
business system's authoritative availability/booking adapter. Revision, idempotency,
explicit confirmation and release checks remain required; a request receipt or
manual-dispatch state is not a confirmed appointment. This demo adds no business
API calls and activates no scheduling, submissions, payments or messages.

## Repository map

| Path                | Responsibility                                                                |
| ------------------- | ----------------------------------------------------------------------------- |
| `packages/core`     | Manifest, route, market, consent and submission contracts                     |
| `packages/ui`       | Corporate homepage, distinct audience layouts, staged forms and policies      |
| `packages/page-kit` | Per-package server, metadata, no-JavaScript policies and intake proxy         |
| `backend`           | Host registry, validation, rate limits and disabled CRM transport boundary    |
| `pages/<slug>`      | Independent service manifest/build/server; `home` is the corporate package    |
| `config/registry`   | Preview sites, catalog origins, compliance drafts and disabled destinations   |
| `config/markets`    | Proposed Dominican market, zones, phone rules and unconfirmed operating facts |
| `marketing`         | Draft ad kits, review exports, WhatsApp wording and organic plans             |
| `docs/missions`     | Source requirements, writer/coder assignments and review evidence             |

See [architecture](docs/ARCHITECTURE.md), [page inventory](docs/PAGES.md),
[CRM contract](backend/CRM_CONTRACT.md) and [team assignments](docs/missions/TEAM.md).

## Verification

```sh
npm run format:check
npm run typecheck
npm run registry:check
npm test
npm run content:check
npm run marketing:validate
npm run build
npm run budget:check
npm run test:browser
npm audit --audit-level=high
python scripts/test_branch.py
git diff --check
```

Install Chromium for Playwright before the browser run, or set `CHROME_BIN` to an
installed Chromium executable. Browser tests cover every localized route,
pilot forms, no-JavaScript policies, focus behavior and accessibility at three widths.
Checkpoint evidence identifies actual counts and the checked revision.

`npm run compliance:check` reports draft business facts. Strict readiness is expected
to fail until the owner supplies real identity, support, hours, legal terms and coverage.
It is separate from structural preview validation.

## Containers

```sh
docker build -f backend/Dockerfile .
docker build -f Dockerfile.page --build-arg PAGE=home .
docker build -f Dockerfile.page --build-arg PAGE=hvac .
python scripts/container_stack_smoke.py
```

The smoke script builds and runs disposable backend, home and HVAC images on a private
Docker network, with non-root users, read-only filesystems and ephemeral loopback ports.
It checks preview rejection, host boundaries, localized routes and assets, then removes
only resources it created. It does not deploy or activate destinations.

## Operational boundary and delivery

The CRM must implement persistent site/key/payload deduplication and return a canonical
record ID before the browser can display acceptance. Fake-CRM tests validate the adapter
contract; they do not verify a live CRM, durable recovery or provider workflow.
See [CRM contract](backend/CRM_CONTRACT.md) before configuring any endpoint.

No real contact, booking, messaging, billing, provider access or advertising activation
is supplied by this preview. Content marks missing business facts and fictional examples.
Owner review and operational evidence are needed before launch.

Work uses isolated atomic branches. Run required checks, obtain review, commit cleanly,
and publish through the guarded `codestra-local` publisher with exact local/remote SHA
parity. GitHub is a secondary mirror and review surface. A local bundle preserves work
but does not satisfy publication. Never bypass protected branch rules.
