# Independent R1 platform review

Reviewer `/root/test_matrix` did not author platform Task 1. Compared base `06f8efba10e9c2d20c578c33cbf963fe86c0eb20` through the final working tree, then repeated focused checks at committed HEAD `be3c9a5347b3e74a52b9466d8ce7aae304392748` on 2026-11-03.

Worktree: `C:\Users\Usuario\Documents\Codex\2026-11-03\the-middleware-work-is-already-preserved-4\work\breero-platform-v2`. Branch: `atomic/breero-platform-v2-20261103`.

No open blockers. Inspected strict nested manifest validation, localized metadata and routes, home-versus-service identity, unknown-host fail-closed behavior, site/page isolation, registry construction, scaffolding and launcher behavior. Structural page/home placeholders are intentional and await content/UI integration. Proxy size enforcement and consent canonicalization belong to Task 2 and were outside this checkpoint.

Two reproduced findings were fixed by the platform author and independently rechecked:

- French contact support heading now reads “Assistance clientèle”.
- `PAGES=home` is explicitly rejected before registry or process creation with an actionable service-catalog requirement, as approved by root. Home can still run independently against an existing catalog backend.

Node 22 command: `node --test tests/unit/platform.test.ts tests/unit/scaffolding.test.ts tests/pagekit/home-server.test.mjs tests/unit/manifest-v2.test.ts`. Result: 9/9 PASS, zero failures/skips. Includes strict malformed-manifest cases, localized home and policy routes, unknown-host rejection, safe scaffolding/traversal rejection/existing directory preservation, and home-only launcher rejection. `git diff --check` PASS; final worktree status clean.

This certifies the focused Task 1 checkpoint, not the eventual integrated release. No publication performed by this reviewer. codestra-local remote/SHA unavailable; `LOCAL_REMOTE_SYNC=FAIL`. GitHub mirror/PR not performed. Linear issue and Notion mission/page not supplied to this role. Next action: platform owner publishes its coherent checkpoint through the guarded publisher when remote configuration permits; root integrates content, intake and shared layouts, followed by independent integrated testing.
