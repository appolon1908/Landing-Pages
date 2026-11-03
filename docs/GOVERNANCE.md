# Branch and review governance

Work enters through atomic → subsection/public--foundation-signed → section/public → development → testing → staging → production. The declared branch path is tested by scripts/test_branch.py and enforced for pull requests by scripts/check_branch.py. Every boundary requires its own current checks and eligible approval.

GitHub ruleset 25729446 was created and independently read back as active on 2026-10-23. It covers subsection/section and development/testing/staging/production/main/master branches, has no bypass actors, rejects deletion and force pushes, requires one independent approving review, code-owner review when ownership is present in the base branch, dismissal of stale reviews, approval after the latest push and resolution of review threads. Required checks: landing-checks, branch-governance, container-smoke. Checks must be current with the target branch.

CODEOWNERS lists appolon1908 and kazan555. The owner may not self-approve a PR. An invitation is not an approval; review requests require accepted collaborator access. Landing-Pages access was accepted; the other three invitations remained pending at the last check. Repository rules are not runtime tenant authorization. No production deployment or external effects are enabled by these controls.

## Signed source migration, 2026-11-02

PR #2's proposed source `a33ae15bc1a313fa3c38161d6e5e0b2b527450cd` includes
two unsigned implementation commits. Enforcing verified signatures therefore
blocks that promotion even though its three native workflows passed. Its sole
reviewer was also its last pusher, which does not satisfy the latest-push rule.

The signed repair starts at the original empty ancestor
`d328e5ac6ece560780d0391ab79737b343a43739`, copies the reviewed application files,
and changes only this governance document, the declared subsection name, and the
migration spec/plan. A new atomic PR targets the empty signed subsection. After
that PR is approved and merged, a separate subsection → section PR must pass
fresh checks and receive an eligible independent approval. Existing branches and
PRs are retained until their replacement has completed; PR #3's later requirements
are not included in this foundation repair.

Ruleset 25729446 now requires verified signatures and binds `landing-checks`,
`branch-governance`, and `container-smoke` to GitHub Actions (integration 15368).
Review, latest-push, code-owner, discussion-resolution, deletion and force-push
protections remain enforced, with no bypass actors. Custom-controller statuses
are not required checks and are not rewritten as successful evidence.

The `production` environment requires an existing collaborator's separate approval,
prevents self-approval, disallows admin bypass, and accepts only the `production`
branch. No deployment workflow or production effect is enabled by this repair.
Any future deployment job must explicitly use that protected environment before
production activation can be approved.

## Reviewed policy integration, 2026-11-03

PR #8 merged the separately reviewed business-policy and optional SMS-consent
source into the original subsection. This integration preserves its complete
application, tests and requirements while retaining the signed foundation's
branch policy and migration records. It starts at the signed subsection's
current head, rather than importing the original unsigned ancestry.

The current path remains atomic → subsection/public--foundation-signed →
section/public → development → testing → staging → production. The reverse
development → original-subsection proposal in #9 is not an allowed promotion.
Every forward boundary still needs fresh native checks, verified signatures and
eligible independent approval. Existing source branches are preserved.

All public profiles remain drafts. This source integration does not enable
publication, submissions, payments, tracking, messages or production deployment.
