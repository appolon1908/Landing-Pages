# Signed landing foundation repair

The requested target is native GitHub Actions and repository protections for all
appolon1908 repositories, retaining reviews, verified signatures and separate
production approval. This repair addresses Landing-Pages PR #2; the global rollout
remains incomplete.

PR #2 contains unsigned ancestors, and its only reviewer made its latest push.
The original protected source cannot be re-signed without rewriting its history.
Use a new atomic branch from the original empty root and a new empty subsection,
then promote through the normal adjacent boundaries with new reviews.

## Approaches

- Rewriting the original protected source would violate its force-push protection.
- Bypassing signature or review enforcement would violate the requested controls.
- A signed replacement preserves protected history and exposes the full source for
  review. This is the implementation choice for the repair.

Copy source tree `dc811eecd77019c15b8e91b72c363aa7828ab449` exactly except for
`branch-policy.json`, `docs/GOVERNANCE.md`, and this migration's spec/plan. Declare
`subsection/public--foundation-signed` as the new subsection; preserve
`section/public` and all later boundaries. Preserve application files, dependencies,
tests, workflows, ownership and disabled external effects.

Each new promotion requires verified signatures, all three native checks, and an
eligible independent review. Production remains inactive. Its protected environment
requires a separate approval and must be used by any future deployment workflow.

Retain PR #2 and PR #3 while the signed replacement is reviewed. Their existing
reviews are evidence of prior work and do not approve a new commit or promotion.
