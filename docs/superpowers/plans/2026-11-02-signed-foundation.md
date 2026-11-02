# Signed Foundation Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to carry out this repair.

**Goal:** Prepare a signed, reviewable replacement for the foundation in PR #2.

**Architecture:** Reproduce the reviewed source from the empty root on an isolated
atomic branch, declare a new subsection, and use adjacent reviewed promotions.

**Tech Stack:** GitHub Actions, repository rulesets, GitHub-signed commits, Vue/Node.

**Spec:** `docs/superpowers/specs/2026-11-02-signed-foundation-design.md`

## Constraints

No protected-history rewriting, protection bypasses, self-approval, skipped checks,
application changes or production activation. Preserve existing branches and PRs.

## Review focus

Verify source-file equality, native check provenance, signed commit ancestry,
adjacent promotion validation and the distinction between review and deployment.

## Task 1: Prepare and verify the signed source

- [x] Copy the reviewed tree from `a33ae15bc1a313fa3c38161d6e5e0b2b527450cd`
  into an isolated atomic worktree based on the original empty root.
- [x] Update only the subsection declaration and migration documentation.
- [ ] Run existing branch-policy tests and compare every application blob.
- [ ] Create the commit through GitHub's signing mutation; verify its signature,
  parent and complete tree against the prepared source.

## Task 2: Request the normal promotion reviews

- [ ] Create the empty signed subsection from the original root and open an
  atomic → subsection PR, attaching the exact source and validation evidence.
- [ ] Require successful landing-checks, branch-governance and container-smoke.
- [ ] Merge only after GitHub accepts an eligible independent review.
- [ ] Open a separate signed subsection → section PR after the first merge;
  verify fresh checks and review before merging that boundary.
- [ ] Supersede the old promotion only after the replacement is complete.
