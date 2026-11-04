# Runbook

## Preview

See [README](../README.md) for Node 22 setup and the local multi-package stack.
The bundled registries are preview/disabled. No customer/provider data is sent from
preview forms. Use fake transports and synthetic identities for intake tests.

- Backend health: `GET /healthz`; site context: `GET /api/site-context`.
- Page health: `GET /healthz`; each image serves its own home or service package.
- Backend events distinguish CRM acceptance, local logging and delivery failure.
- The optional journal may contain request data; it is not a durable reconciliation
  queue or proof of CRM acceptance. Establish access, retention and recovery before use.

## Containers and rollback preparation

Build backend and individual pages from the same reviewed revision. A page image contains
its selected package; changing the runtime environment does not substitute a different page.
The page server needs `BACKEND_URL`. Keep the backend private and configure host/origin
routing explicitly. The smoke script uses disposable local resources, not production.

A future release must retain the prior images and reviewed registry for rollback, then
demonstrate restoration in an authorized environment. No deployed rollback or backup
restoration has been verified by this preview.

## Before any live enablement

Changing a registry flag is not a launch acceptance test. The owner must establish:

1. Real business identity, support, operating hours, service coverage, provider capacity,
   published policies and commercial terms. Strict compliance validation must pass.
2. A selected CRM implementing the [documented contract](../backend/CRM_CONTRACT.md),
   with persistent deduplication, canonical receipts, retry/reconciliation ownership,
   tenant access controls and demonstrated recovery.
3. Reviewed registry origins, environment-backed secrets, appropriate request limits,
   spam controls and an explicit trusted-proxy design if real client-IP limits are needed.
4. Acceptance evidence for messaging permissions, provider workflows, scheduling and
   billing if those features are later introduced. This repository does not implement them.
5. Separate authorization for production/provider effects and a reversible release plan.

An authorized operator can then configure the selected adapter and site mode, rerun
checks against that exact configuration and deploy through the approved release process.
No bundled configuration or draft marketing artifact authorizes that action.

## Source delivery

Run local checks and independent review, commit a clean isolated branch, then use the
guarded publisher to `codestra-local`. Record exact local and remote SHA parity.
Missing approved remote configuration is a publication blocker; preserve the commit
and bundle while recording `LOCAL_REMOTE_SYNC=FAIL`. Never push around the guard,
force-update divergent history or merge protected branches without their required checks.
