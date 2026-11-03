#!/usr/bin/env bash
set -euo pipefail
if (($# < 5)); then
  echo 'Usage: publish-docker.sh REPOSITORY WORKTREE BRANCH EXPECTED_PARENT_SHA EXPECTED_HEAD_SHA [--apply]' >&2
  exit 64
fi
repo=$1
if [[ $(id -u) == 0 ]]; then echo 'Run as the development agent user, not root.' >&2; exit 1; fi
worktree=$(realpath "$2")
branch=$3
parent=$4
head=$5
shift 5
case "$repo" in Landing-Pages|klyrow.com|Middleware-|Caddy|Kong) ;; *) exit 64 ;; esac
if (($# > 1)) || { (($# == 1)) && [[ $1 != --apply ]]; }; then exit 64; fi
state=${CODESTRA_CICD_STATE:-$HOME/.local/state/codestra-cicd}
state=$(realpath "$state")
common=$(git -C "$worktree" rev-parse --path-format=absolute --git-common-dir)
gitdir=$(git -C "$worktree" rev-parse --absolute-git-dir)
# Bind at original absolute paths: linked-worktree .git files contain those paths.
mounts=(--mount "type=bind,src=$worktree,dst=$worktree")
if [[ $common != "$worktree/"* ]]; then mounts+=(--mount "type=bind,src=$common,dst=$common"); fi
if [[ $gitdir != "$common/"* && $gitdir != "$worktree/"* && $gitdir != "$common" ]]; then
  mounts+=(--mount "type=bind,src=$gitdir,dst=$gitdir")
fi
identity_dir=$(mktemp -d)
trap 'rm -f "$identity_dir/passwd" "$identity_dir/group"; rmdir "$identity_dir"' EXIT
printf 'root:x:0:0:root:/root:/bin/sh\npublisher:x:%s:%s:Agent publisher:/tmp:/bin/sh\n' "$(id -u)" "$(id -g)" > "$identity_dir/passwd"
printf 'root:x:0:\npublisher:x:%s:\n' "$(id -g)" > "$identity_dir/group"
chmod 644 "$identity_dir/passwd" "$identity_dir/group"
docker run --rm --read-only --cap-drop ALL --security-opt no-new-privileges:true \
  --pids-limit 64 --memory 256m --cpus 1 --tmpfs /tmp:rw,nosuid,nodev,size=32m \
  --user "$(id -u):$(id -g)" "${mounts[@]}" \
  --mount "type=bind,src=$identity_dir/passwd,dst=/etc/passwd,readonly" \
  --mount "type=bind,src=$identity_dir/group,dst=/etc/group,readonly" \
  --mount "type=bind,src=$state/identity.json,dst=/run/publisher/identity.json,readonly" \
  --mount "type=bind,src=$state/allowed_signers,dst=/run/publisher/allowed_signers,readonly" \
  --mount "type=bind,src=$state/known_hosts,dst=/run/publisher/known_hosts,readonly" \
  --mount "type=bind,src=$state/keys/$repo,dst=/run/publisher/keys/$repo,readonly" \
  "${CODESTRA_PUBLISHER_IMAGE:-codestra-agent-publisher:local}" \
  --repo "$repo" --worktree "$worktree" --branch "$branch" \
  --expected-base "$parent" --expected-head "$head" --state-dir /run/publisher "$@"
