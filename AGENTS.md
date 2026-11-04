# Landing-Pages repository contract
Scope: many independent landing pages (pages/<slug>) on one core (packages/core, packages/ui,
packages/page-kit) and one backend (backend/) that routes submissions to a per-site
destination (Breero, CRM webhook, log, disabled). Breero owns company grants,
content/publication, bookings, memberships and billing. Never create a duplicate business
database; the backend is intake and routing only. Read docs/ARCHITECTURE.md first.
Add pages with scripts/new-page.mjs and a registry entry; never a closed list in core.
Use one active writer and an isolated atomic worktree. Preserve existing work.
Read branch-policy.json: atomic -> subsection -> section -> development -> testing -> staging -> production.
No protected-branch direct changes, forced pushes or skipped review/checks.
Use TypeScript, validated public data, trusted Vue components and escaped text; no raw
Grapes HTML or executable Flow actions. Unknown hosts fail closed. Tenant selectors
in the browser do not grant authority. No secrets, customer data or tokens in source.
Run format, type, unit, contract, browser/accessibility, build, audit and image checks.
Independent review and current-commit evidence are required before promotion.
A site accepts submissions only when its registry entry is mode "live" with a non-disabled
destination; secrets come from the environment variable named in authEnv.
Production publication, fees, messages, ads, scheduling and workflow execution remain OFF.
