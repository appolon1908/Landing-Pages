#!/usr/bin/env python3
"""Publish an explicitly reviewed Git head; never stage, commit, merge or deploy."""
import argparse
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
REPOSITORIES = json.loads((ROOT / 'config/repositories.json').read_text())
PROTECTED = {'main', 'master', 'dev', 'develop', 'development', 'test', 'testing', 'staging', 'production'}


class PublishError(RuntimeError):
    pass


def run(args, *, cwd=None, env=None, check=True):
    result = subprocess.run(args, cwd=cwd, env=env, text=True, capture_output=True, timeout=120)
    if check and result.returncode:
        raise PublishError(f'{args[0]} failed (exit {result.returncode}): {result.stderr.strip()[-1200:]}')
    return result.stdout.strip() if check else result


def canonical_origin(url, repository):
    return url in {f'https://github.com/appolon1908/{repository}.git',
                   f'https://github.com/appolon1908/{repository}',
                   f'git@github.com:appolon1908/{repository}.git',
                   f'ssh://git@github.com/appolon1908/{repository}.git'}


def publish(*, worktree, repository, base, expected_base, expected_head,
            destination, allowed_signers, apply=False, env=None, expected_branch=None):
    if repository not in REPOSITORIES:
        raise PublishError('repository outside the five-repository scope')
    if not all(re.fullmatch(r'[0-9a-f]{40}', value) for value in (expected_base, expected_head)):
        raise PublishError('expected SHA must be a complete lowercase 40-character commit SHA')
    worktree = Path(worktree).resolve(strict=True)
    allowed_signers = Path(allowed_signers).resolve(strict=True)
    process_env = os.environ.copy() if env is None else dict(env)
    process_env['GIT_TERMINAL_PROMPT'] = '0'
    process_env['GIT_NO_REPLACE_OBJECTS'] = '1'
    process_env['GIT_GRAFT_FILE'] = '/dev/null'
    # An inherited alternate index/worktree must not redirect the inspected tree.
    for name in ('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR'):
        process_env.pop(name, None)

    def git(*args, check=True):
        return run(['git', '-c', f'gpg.ssh.allowedSignersFile={allowed_signers}', *args],
                   cwd=worktree, env=process_env, check=check)

    if Path(git('rev-parse', '--show-toplevel')).resolve() != worktree:
        raise PublishError('worktree must be the exact repository root')
    if not canonical_origin(git('remote', 'get-url', 'origin'), repository):
        raise PublishError('origin does not identify the approved canonical repository')
    rewrites = git('config', '--get-regexp', r'^url\..*\.(insteadof|pushinsteadof)$', check=False)
    if rewrites.returncode not in (0, 1):
        raise PublishError('cannot inspect Git URL rewrite configuration')
    for line in rewrites.stdout.splitlines():
        parts = line.split(None, 1)
        if len(parts) == 2 and destination.startswith(parts[1]):
            raise PublishError('Git URL rewrite would redirect the fixed publication destination')
    branch = git('symbolic-ref', '--quiet', '--short', 'HEAD')
    if branch in PROTECTED or branch.startswith(('section/', 'subsection/', 'refs/')):
        raise PublishError('protected branch cannot be published directly')
    if expected_branch is not None and branch != expected_branch:
        raise PublishError('branch differs from the reviewed branch')
    if git('check-ref-format', f'refs/heads/{base}', check=False).returncode:
        raise PublishError('invalid parent branch')
    if git('check-ref-format', f'refs/heads/{branch}', check=False).returncode:
        raise PublishError('invalid publication branch')

    def unchanged():
        if git('status', '--porcelain=v1', '--untracked-files=all'):
            raise PublishError('dirty worktree; preserve and finish local changes first')
        if git('rev-parse', 'HEAD') != expected_head or git('symbolic-ref', '--short', 'HEAD') != branch:
            raise PublishError('head or branch changed since review')

    def remote(ref):
        output = git('ls-remote', '--refs', destination, f'refs/heads/{ref}')
        rows = [line.split() for line in output.splitlines() if line]
        matches = [row[0] for row in rows if len(row) == 2 and row[1] == f'refs/heads/{ref}']
        if len(matches) > 1:
            raise PublishError('ambiguous remote ref')
        return matches[0] if matches else None

    common = Path(git('rev-parse', '--path-format=absolute', '--git-common-dir'))
    lock = common / 'codestra-publish.lock'
    try:
        descriptor = os.open(lock, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    except FileExistsError as exc:
        raise PublishError('another publisher holds the lock; inspect it before retrying') from exc
    try:
        os.write(descriptor, json.dumps({'pid': os.getpid(), 'branch': branch, 'head': expected_head}).encode())
        os.close(descriptor)
        unchanged()
        if remote(base) != expected_base:
            raise PublishError('remote parent changed; fetch, reconcile and review again')
        if git('merge-base', '--is-ancestor', expected_base, expected_head, check=False).returncode:
            raise PublishError('candidate does not contain the reviewed parent')
        commits = git('rev-list', f'{expected_base}..{expected_head}').splitlines()
        if not commits:
            raise PublishError('candidate has no commits beyond the reviewed parent')
        for commit in commits:
            if git('verify-commit', commit, check=False).returncode:
                raise PublishError(f'commit signature is not trusted: {commit}')
        git('diff', '--check', f'{expected_base}..{expected_head}')
        before = remote(branch)
        if before:
            if git('cat-file', '-e', before, check=False).returncode:
                git('fetch', '--no-tags', '--no-write-fetch-head', destination, f'refs/heads/{branch}')
            if git('merge-base', '--is-ancestor', before, expected_head, check=False).returncode:
                raise PublishError('remote branch diverged; publication would overwrite work')
        result = {'repository': f'appolon1908/{repository}', 'branch': branch, 'head': expected_head,
                  'parent': expected_base, 'previous_remote': before, 'status': 'READY_TO_PUSH'}
        if not apply:
            return result
        unchanged()
        if remote(base) != expected_base or remote(branch) != before:
            raise PublishError('remote changed during validation; reconcile before retrying')
        # Pin both sides explicitly. A concurrent checkout cannot redirect this push.
        # Native fast-forward enforcement protects remote changes racing this check.
        git('push', '--no-follow-tags', '--porcelain', destination, f'{expected_head}:refs/heads/{branch}')
        after = remote(branch)
        if after != expected_head:
            raise PublishError('remote readback differs; inspect GitHub before retrying')
        if remote(base) != expected_base:
            raise PublishError('branch was pushed but parent advanced; reconcile and obtain new review')
        result.update(status='PUSHED', remote_sha=after,
                      compare_url=f'https://github.com/appolon1908/{repository}/compare/{base}...{branch}')
        return result
    finally:
        lock.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', choices=REPOSITORIES, required=True)
    parser.add_argument('--worktree', type=Path, required=True)
    parser.add_argument('--branch', required=True)
    parser.add_argument('--base')
    parser.add_argument('--expected-base', required=True)
    parser.add_argument('--expected-head', required=True)
    parser.add_argument('--state-dir', type=Path, default=Path.home() / '.local/state/codestra-cicd')
    parser.add_argument('--apply', action='store_true', help='Push after all preflight checks; default is read-only.')
    args = parser.parse_args()
    try:
        state = args.state_dir.resolve(strict=True)
        config = json.loads((state / 'identity.json').read_text())
        if config.get('repository_ids', {}).get(args.repo) != REPOSITORIES[args.repo]['id']:
            raise PublishError('credential enrollment does not match the canonical repository ID')
        key = state / 'keys' / args.repo
        env = os.environ.copy()
        env['GIT_SSH_COMMAND'] = shlex.join(['ssh', '-F', '/dev/null', '-i', str(key),
            '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes',
            '-o', f'UserKnownHostsFile={state / "known_hosts"}', '-o', 'ConnectTimeout=15'])
        destination = f'git@github.com:appolon1908/{args.repo}.git'
        result = publish(worktree=args.worktree, repository=args.repo,
                         base=args.base or REPOSITORIES[args.repo]['base'], expected_base=args.expected_base,
                         expected_head=args.expected_head, expected_branch=args.branch, destination=destination,
                         allowed_signers=state / 'allowed_signers', env=env, apply=args.apply)
        print(json.dumps(result, indent=2))
    except (PublishError, OSError, ValueError, subprocess.TimeoutExpired) as exc:
        print(f'BLOCKED: {exc}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
