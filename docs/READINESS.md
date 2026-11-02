# Independent repository readiness

| Repository | Delivered responsibility | Gate before live operation |
| --- | --- | --- |
| Landing-Pages | Vue 3 public preview, five categories × two audiences × EN/ES, public site context, safe form/receipt contracts, isolated hosting | Breero verified company/site grants and publication documents; real staging receipts; reviewed domains/TLS, consent and copy |
| Codestra-Grapes | Sanitized visual page drafts, authenticated project API, saved authoring references, packaged hosting | Approved staging Keycloak clients/claims and existing gateway; authorized Breero compilation/publication handoff |
| Codestra-React-Flow | Visual funnel drafts and saved references, authenticated project API, packaged hosting | Same identity/gateway integration; workflow execution remains a separate backend authority and is disabled |
| Codestra-Marketing-Backend | Keycloak JWT checks, PostgreSQL editor projects/audit, scoped authorization, migrations, metrics and disposable recovery | Owner-managed secrets and hosted database/backups, real staging login/gateway tests, GitHub plan supporting private-repository enforcement |

Vue renders the public website. React Flow is a graph editor; it complements the Vue frontend and is not a replacement for it. GrapesJS is an authoring tool. Neither editor's raw document is an approved runtime landing page.

Each repository has its own dependencies, lockfiles, tests, image, local startup instructions and CI. The APIs remain explicit external dependencies. Starting a repository independently does not grant it ownership of another service's business records.

Breero retains customer requests, bookings, memberships/billing, verified site/domain ownership and publication authority. A saved reference is an input to an authorized review/compilation process, never a publication or execution credential. Current draft APIs do not guarantee historical version retrieval.

No public lead, appointment, fee, advertising tag, message, campaign, publication or workflow execution is activated. Unknown hosts and unavailable identity/storage fail closed. See CONTRACTS.md, RUNBOOK.md, GOVERNANCE.md and VERIFICATION.md for detailed boundaries and evidence.
