#!/usr/bin/env bash
# Disposable, private SSH Git server: no GitHub keys, remote refs or published ports.
set -euo pipefail
if [[ $(id -u) != 1000 ]]; then echo 'Fixture requires test user UID 1000 (matches isolated SSH image user).' >&2; exit 64; fi
bundle=$(cd "$(dirname "$0")/.." && pwd)
fixture=$(mktemp -d)
name="codestra-publisher-test-$$"
real_docker=$(command -v docker)
cleanup() {
  "$real_docker" rm -f "$name" >/dev/null 2>&1 || true
  "$real_docker" network rm "$name" >/dev/null 2>&1 || true
  rm -rf -- "$fixture"
}
trap cleanup EXIT
mkdir -p "$fixture/state/keys" "$fixture/bin"
ssh-keygen -q -t ed25519 -N '' -f "$fixture/state/keys/Landing-Pages"
ssh-keygen -q -t ed25519 -N '' -f "$fixture/host-key"
ssh-keygen -q -t ed25519 -N '' -f "$fixture/sign-key"
printf 'github.com %s\n' "$(cat "$fixture/host-key.pub")" > "$fixture/state/known_hosts"
printf 'agent@example.test %s\n' "$(cat "$fixture/sign-key.pub")" > "$fixture/state/allowed_signers"
printf '{"repository_ids":{"Landing-Pages":1429081690}}\n' > "$fixture/state/identity.json"
git init -q --bare "$fixture/remote.git"
git init -q -b main "$fixture/repo"
git -C "$fixture/repo" config user.name 'Fixture Agent'
git -C "$fixture/repo" config user.email 'agent@example.test'
git -C "$fixture/repo" config gpg.format ssh
git -C "$fixture/repo" config user.signingkey "$fixture/sign-key"
git -C "$fixture/repo" config commit.gpgsign true
git -C "$fixture/repo" remote add origin https://github.com/appolon1908/Landing-Pages.git
printf 'base\n' > "$fixture/repo/source.txt"
git -C "$fixture/repo" add source.txt
git -C "$fixture/repo" commit -qm base
base=$(git -C "$fixture/repo" rev-parse HEAD)
git -C "$fixture/repo" push -q "$fixture/remote.git" HEAD:refs/heads/subsection/public--foundation
git -C "$fixture/repo" worktree add -q -b atomic/ssh-fixture "$fixture/linked worktree" HEAD
printf 'candidate\n' >> "$fixture/linked worktree/source.txt"
git -C "$fixture/linked worktree" commit -qam candidate
head=$(git -C "$fixture/linked worktree" rev-parse HEAD)
"$real_docker" network create --internal "$name" >/dev/null
"$real_docker" run -d --name "$name" --network "$name" --memory 128m --cpus 1 --pids-limit 64 \
  --mount "type=bind,src=$fixture/remote.git,dst=/home/git/appolon1908/Landing-Pages.git" \
  --mount "type=bind,src=$fixture/host-key,dst=/run/fixture-host-key,readonly" \
  --mount "type=bind,src=$fixture/state/keys/Landing-Pages.pub,dst=/run/fixture-authorized-keys,readonly" \
  codestra-publisher-ssh-fixture:local >/dev/null
export TEST_SSH_IP
TEST_SSH_IP=$("$real_docker" inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$name")
export TEST_NETWORK="$name" REAL_DOCKER="$real_docker"
cat > "$fixture/bin/docker" <<'SH'
#!/bin/sh
if [ "$1" = run ]; then
  shift
  exec "$REAL_DOCKER" run --network "$TEST_NETWORK" --add-host "github.com:$TEST_SSH_IP" "$@"
fi
exec "$REAL_DOCKER" "$@"
SH
chmod +x "$fixture/bin/docker"
export PATH="$fixture/bin:$PATH" CODESTRA_CICD_STATE="$fixture/state"
export CODESTRA_PUBLISHER_IMAGE=${CODESTRA_PUBLISHER_IMAGE:-codestra-agent-publisher:local}
# Bounded readiness check inside the fixture, without publishing host ports.
ready=0
for attempt in {1..20}; do
  if "$real_docker" exec "$name" python3 -c "import socket; socket.create_connection(('127.0.0.1',22),1).close()" >/dev/null 2>&1; then ready=1; break; fi
  sleep 0.2
done
test "$ready" = 1
bash "$bundle/publish-docker.sh" Landing-Pages "$fixture/linked worktree" atomic/ssh-fixture "$base" "$head"
test -z "$(git --git-dir="$fixture/remote.git" for-each-ref --format='%(refname)' refs/heads/atomic/)"
bash "$bundle/publish-docker.sh" Landing-Pages "$fixture/linked worktree" atomic/ssh-fixture "$base" "$head" --apply
test "$(git --git-dir="$fixture/remote.git" rev-parse refs/heads/atomic/ssh-fixture)" = "$head"
test -z "$(git --git-dir="$fixture/remote.git" for-each-ref --format='%(refname)' refs/tags/)"
echo 'DOCKER_SSH_LINKED_WORKTREE=PASS (UID 1000; spaces in path; dry-run, signed push, exact remote SHA, no tags)'
