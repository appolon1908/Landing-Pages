# Direct agent publication and renderer images

The source path is native Git/SSH (or the authenticated native GitHub CLI), followed
by GitHub Actions. A ChatGPT GitHub connector is not required. CI starts after a
source commit reaches GitHub; it does not grant a workstation permission to push.

The shared Linux publisher and its enrollment command live in
`tools/agent-publisher/`. Run them from a separate installation directory, outside
product worktrees; credentials belong in the invoking user's private state
directory. Follow the publisher README for scope, signing and rollback details.
The helper supports Landing-Pages, klyrow.com, Middleware-, Caddy and Kong; each
repository retains its own writer custody, review rules and deployment workflow.

## Source and image checks

Existing Landing checks, Branch governance and Container checks remain required.
Agent publication checks adds publisher tests, release-gate tests and a Docker test
run. All run on GitHub-hosted Ubuntu, independently of a development machine.

Release images starts only after a successful Landing checks push on development,
testing, staging or production. Its read-only gate requires all four workflows to
have succeeded for that exact SHA and branch. At authorization time the SHA must
still be the protected branch head. Missing, pending, stale or failed evidence
does not authorize the build job.
The gate itself is checked out from the trusted workflow revision. No PR artifact
or PR-supplied script is executed with the package-publishing token.

This repository currently contains one Vue renderer and Node server image:
`ghcr.io/appolon1908/lp-renderer:sha-<full-source-sha>`. Release jobs upload a JSON
receipt with the digest, source SHA, source branch and workflow run ID. It records
an artifact built after historical CI evidence, not current-stage authorization;
the branch or checks may change while the build queues or runs. The receipt marks
`deployment_authorized: false`. Deployments must revalidate current branch head,
latest native checks and environment approval immediately before rollout and use
the digest in that receipt; a SHA tag is a convenience pointer and can be replaced
by a rerun. Branch promotion can rebuild an image from a new merge SHA. This is
source promotion, not byte-for-byte promotion of a single image across all stages.

## Deployment readiness

GitHub activates the workflow_run listener only after this workflow reaches the
repository default branch, currently `subsection/public--foundation`. The atomic
branch PR alone does not activate image publication. Subsequent adjacent promotion
must carry all four check workflows onto each environment branch.

Image publication is not a deployment. No generic deploy or rollback workflow is
added until the actual destination, Compose project, current digest, health checks,
SSH trust and environment secret bindings have been verified. A deployment must
use its matching GitHub Environment and preserve existing production/staging
review gates. Keep business side effects disabled until their separate service
authorization prerequisites are verified.

The current branch route remains:
`atomic/* -> subsection/public--foundation -> section/public -> development -> testing -> staging -> production`.
Open adjacent promotion PRs under `branch-policy.json`; independent exact-head
review and native checks are required. Do not push directly to protected branches.

## Workstation handoff

The verified laptop source is
`C:\Users\Usuario\Documents\Codex\2026-11-02\task\Landing-Pages`.
Its CI/CD writer uses the separate sibling `Landing-Pages-cicd` worktree on
`atomic/cicd-direct-publisher-20261103`. A development machine must use its own clone
and Git fetch/push. Never synchronize a live Git index or copy private credentials
through a repository. The older GitHub Worktrees checkout is not part of this lane.
