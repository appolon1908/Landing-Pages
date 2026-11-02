# Independent preview operations

1. Build/test from the atomic PR commit. Use `npm ci`, `npm run verify` and audit.
2. Start `npm run build && npm start`, or `docker compose up --build -d`.
3. Check `/healthz` and an English/Spanish client/provider route. Health proves the
   frontend process is responding; it does not assert Breero or identity readiness.
4. `SITE_REGISTRY_FILE` may point at a read-only public configuration exported and
   reviewed by the site owner. The bundled registry is synthetic, local preview only.
   Never use domain mapping as evidence of domain ownership or staff authorization.
5. Monitor process availability, HTTP errors and deployed image digest. Do not log
   request bodies, contact details, authorization headers or callback query strings.
6. Stop only this Compose project with `docker compose down`. It has no database or
   customer records. Retain versioned registry files and restore a previous reviewed
   image/configuration pair to roll back. No live publication pointer is changed.

Production release is blocked pending Breero contracts and actual staging receipts,
independent review, verified domains/TLS, translated consent/terms and approved
publication. The preview is intentionally noindex and contains no advertising tags.

Container builds currently use the Node 22 slim release line. Record and pin the
reviewed base-image digest in the release process; mutable build tags are not a
production supply-chain certification. CI image checks inspect the actual local
image ID, runtime user, read-only filesystem and disabled effects.
