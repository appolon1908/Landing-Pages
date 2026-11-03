# Codestra direct Git publication bootstrap

This is an installation bundle for **Landing-Pages, klyrow.com, Middleware-, Caddy and Kong**. It is not a claim that their CI/CD rollout has been completed. Dev-desktop was unreachable during preparation, so credential enrollment and a real GitHub push from that host remain unverified.

## What this bundle does

- Enrolls five separate write deploy keys and a separate account signing key using the host's existing native `gh` login.
- Keeps private keys on the host under the invoking user's private state directory. Only public keys are registered with GitHub.
- Pushes a specified committed head through native SSH Git. The push container receives one repository's key, public trust data and the selected worktree; no GitHub token, signing private key, production secret or Docker socket.
- Requires a clean tree, the exact reviewed head and parent, trusted commit signatures, and a nonprotected branch. Preserves native hooks and remote branch protections.
- Pushes only the selected branch, never tags, and verifies the resulting remote SHA. No automatic staging, commits, PR approvals, merges or deployments.

The publisher is an operator safety guard, not a sandbox against malicious code running as the same host user. An agent that possesses a write deploy key can use Git independently; GitHub branch protection remains the server-side authority. Local publisher locks do not replace repository writer leases or independent reviews.

## Install on the development host

Run as the actual `codestra` development user, not root. The setup needs Python 3, Git, OpenSSH, Docker and native GitHub CLI authenticated as `appolon1908`. The enrollment credential needs repository administration for deploy keys and account SSH-signing-key administration. Do not paste a token into chat or place one in this bundle.

```bash
python3 -m unittest discover -s tests -v
python3 enroll.py                 # Shows changes; does not enroll keys.
python3 enroll.py --apply         # Registers only public keys.
docker build --target publisher -t codestra-agent-publisher:local .
docker build --target test -t codestra-agent-publisher-test:local .
docker run --rm --read-only --tmpfs /tmp:rw,nosuid,nodev,size=64m codestra-agent-publisher-test:local
```

To reproduce the isolated SSH integration test on a dedicated Docker test host as UID 1000, build `tests/Dockerfile.ssh-fixture` with tag `codestra-publisher-ssh-fixture:local`, then run `bash tests/docker-integration.sh`. It creates only a temporary internal Docker network and SSH fixture, with no published host ports; its cleanup removes those resources. The publisher image defaults to `codestra-agent-publisher:local` or the explicitly supplied `CODESTRA_PUBLISHER_IMAGE`.

Keep the entire bundle outside product worktrees. Do not copy the credential state directory into a repository or Docker build context. Enrollment is resumable: it preserves existing matching keys and refuses conflicting titles or read-only keys instead of replacing them. A failed enrollment can leave keys already registered; use the printed IDs and GitHub deploy-key settings to inspect them before retrying.

## Prepare signed work

First follow that repository's `AGENTS.md`, inspect its active writer lease, and run its real CI/test requirements. Use the already assigned clean worktree and branch. The following commands configure only that worktree's repository; they do not stage or commit code:

```bash
state="$HOME/.local/state/codestra-cicd"
git config user.name 'Codestra Agent'
git config user.email '335843231+appolon1908@users.noreply.github.com'
git config gpg.format ssh
git config user.signingkey "$state/signing/agent"
git config gpg.ssh.allowedSignersFile "$state/allowed_signers"
git config commit.gpgsign true
```

Git configuration may be shared among linked worktrees. Inspect existing signing settings before changing them; use `git -c ... commit -S` instead when another mission shares the common repository. Do not rewrite previously published commits to add signatures. Reconcile unsigned history through the repository's approved signed-publication process.

Record the reviewed branch, head SHA and freshly verified target-parent SHA. Then invoke `publish-docker.sh` with **repository, absolute worktree, branch, parent SHA and head SHA**, in that order. Its default is preflight only; append `--apply` to perform the push. The equivalent `python3 publisher.py --help` interface can run directly on the host. The default parent is `subsection/public--foundation` for Landing-Pages and `main` for the other four. Host mode also supports an explicit `--base` for a separately assigned lane.

Publication does not establish lasting parent freshness. A parent may advance during or after a push; the publisher checks again afterward and reports a blocked reconciliation if it observes that race. GitHub exact-head CI, up-to-date branch rules, independent review and protected merging remain mandatory. On an ambiguous network error, inspect the remote SHA before retrying.


The native gh credential needs SSH signing-key administration in addition to repository/workflow scopes. Enrollment may partially succeed; inspect registered key IDs before retrying. To retire an installation, revoke only the IDs in its private identity.json, then remove private state after confirming no active mission needs it.
