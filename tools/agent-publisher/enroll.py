#!/usr/bin/env python3
"""Enroll repository-scoped SSH credentials using a native gh CLI login."""
import argparse
import json
import os
from pathlib import Path
import re
import socket
import stat
import subprocess

from publisher import REPOSITORIES, PublishError, run


def api(path, data=None):
    command = ['gh', 'api', '--hostname', 'github.com', path]
    if data is not None:
        command += ['--method', 'POST', '--input', '-']
    result = subprocess.run(command, input=None if data is None else json.dumps(data),
                            capture_output=True, text=True, timeout=45)
    if result.returncode:
        raise PublishError(f'GitHub enrollment request failed for {path}: {result.stderr.strip()[-800:]}')
    return json.loads(result.stdout)


def private_directory(path):
    path = Path(path).expanduser()
    if path.is_symlink():
        raise PublishError('credential directory must not be a symlink')
    if path.exists() and path.stat().st_uid != os.getuid():
        raise PublishError('credential directory is owned by another user')
    path.mkdir(mode=0o700, parents=True, exist_ok=True)
    path.chmod(0o700)
    return path.resolve()


def public_key(path):
    value = Path(str(path) + '.pub').read_text().strip()
    if not re.fullmatch(r'ssh-ed25519 [A-Za-z0-9+/=]+(?: [^\r\n]+)?', value):
        raise PublishError('invalid generated public key')
    return value


def make_key(path, comment):
    if path.is_symlink() or Path(str(path) + '.pub').is_symlink():
        raise PublishError('key path must not be a symlink')
    if not path.exists():
        if Path(str(path) + '.pub').exists():
            raise PublishError('public key exists without private key; recover it instead of replacing it')
        run(['ssh-keygen', '-q', '-t', 'ed25519', '-N', '', '-C', comment, '-f', str(path)])
    if path.stat().st_uid != os.getuid() or stat.S_IMODE(path.stat().st_mode) & 0o077:
        raise PublishError('private key has unsafe ownership or permissions')
    public = public_key(path)
    derived = run(['ssh-keygen', '-y', '-f', str(path)])
    if derived.split()[:2] != public.split()[:2]:
        raise PublishError('private/public key mismatch')
    return public


def host_keys(metadata):
    keys = metadata.get('ssh_keys', [])
    if not keys:
        raise PublishError('GitHub API did not return SSH host keys')
    for key in keys:
        if not re.fullmatch(r'(ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp256) [A-Za-z0-9+/=]+', key):
            raise PublishError('unexpected GitHub host key format')
    return ''.join('github.com ' + key + '\n' for key in keys)


def same_key(left, right):
    return left.split()[:2] == right.split()[:2]


def ensure_registered(path, title, key, *, writable=False):
    # Paginate explicitly; a large existing key inventory must not create duplicates.
    existing = []
    page = 1
    while True:
        batch = api(f'{path}?per_page=100&page={page}')
        existing.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    matches = [entry for entry in existing if same_key(entry['key'], key)]
    if matches:
        if writable and matches[0].get('read_only', True):
            raise PublishError('matching deploy key is read-only; no implicit key replacement')
        return matches[0]['id']
    if any(entry.get('title') == title for entry in existing):
        raise PublishError(f'enrollment title already belongs to another key: {title}')
    payload = {'title': title, 'key': key}
    if writable:
        payload['read_only'] = False
    created = api(path, payload)
    if not same_key(created['key'], key) or (writable and created.get('read_only', True)):
        raise PublishError('GitHub key registration readback mismatch')
    return created['id']


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--state-dir', type=Path, default=Path.home() / '.local/state/codestra-cicd')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if not args.apply:
        print('Enrollment plan: create five unique SSH write deploy keys and one SSH signing key;\n'
              'register public keys with GitHub; keep private keys only on this host.\n'
              'Run as the agent user with --apply and an existing authorized native gh login.')
        return 0
    os.umask(0o077)
    if os.getuid() == 0:
        raise PublishError('run as the development agent user, not root')
    user = api('user')
    if user.get('login') != 'appolon1908' or user.get('id') != 335843231:
        raise PublishError('native gh login must be the authorized appolon1908 account')
    # Verify all repository identities before creating any credentials.
    for name, expected in REPOSITORIES.items():
        actual = api('repos/appolon1908/' + name)
        if actual.get('id') != expected['id'] or not actual.get('permissions', {}).get('admin'):
            raise PublishError(f'repository identity or key-administration authority mismatch: {name}')
    state = args.state_dir.expanduser()
    if state.exists() and any(state.iterdir()) and not (state / 'codestra-enrollment-v1').is_file():
        raise PublishError('refusing to reuse a nonempty unrelated credential directory')
    state = private_directory(state)
    (state / 'codestra-enrollment-v1').touch(mode=0o600, exist_ok=True)
    keys = private_directory(state / 'keys')
    signing = private_directory(state / 'signing')
    known_hosts = host_keys(api('meta'))
    host = socket.gethostname()
    signing_key = make_key(signing / 'agent', f'codestra-agent-signing:{host}')
    signing_id = ensure_registered('user/ssh_signing_keys', f'codestra-agent-signing:{host}', signing_key)
    email = f'{user["id"]}+{user["login"]}@users.noreply.github.com'
    records = {}
    for name in REPOSITORIES:
        key = make_key(keys / name, f'codestra-agent:{host}:{name}')
        records[name] = ensure_registered(f'repos/appolon1908/{name}/keys',
                                           f'codestra-agent:{host}:{name}', key, writable=True)
        print(f'ENROLLED appolon1908/{name} deploy_key_id={records[name]}')
    (state / 'known_hosts').write_text(known_hosts)
    (state / 'allowed_signers').write_text(email + ' ' + signing_key + '\n')
    identity = {'account': user['login'], 'email': email, 'host': host,
                'repository_ids': {name: value['id'] for name, value in REPOSITORIES.items()},
                'deploy_key_ids': records, 'signing_key_id': signing_id}
    (state / 'identity.json').write_text(json.dumps(identity, indent=2) + '\n')
    print(f'Credentials enrolled at {state}. Private keys were not printed or uploaded.')
    print('Commit identity: Codestra Agent <' + email + '>')
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (PublishError, OSError, ValueError, subprocess.TimeoutExpired) as error:
        raise SystemExit(f'BLOCKED: {error}')
