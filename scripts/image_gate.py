"""Authorize immutable image publication after native CI on a protected branch."""
import json
import os
from pathlib import Path
import re
import time
import urllib.parse
import urllib.request

REPOSITORY = 'appolon1908/Landing-Pages'
ENVIRONMENTS = {'development', 'testing', 'staging', 'production'}
REQUIRED = {'.github/workflows/ci.yml', '.github/workflows/container.yml',
            '.github/workflows/governance.yml', '.github/workflows/agent-publication.yml'}


class GateError(RuntimeError):
    pass


def authorize(run, branch, repository):
    stage, sha = run.get('head_branch'), run.get('head_sha', '')
    if repository != REPOSITORY or run.get('head_repository', {}).get('full_name') != repository:
        raise GateError('Source repository mismatch')
    if run.get('event') != 'push' or run.get('conclusion') != 'success':
        raise GateError('Only successful push CI can publish images')
    if stage not in ENVIRONMENTS or not re.fullmatch(r'[0-9a-f]{40}', sha):
        raise GateError('Invalid release branch or commit')
    if branch.get('protected') is not True or branch.get('commit', {}).get('sha') != sha:
        raise GateError('Source must still be the current protected branch head')
    return stage, sha


def checks_ready(runs, repository, branch, sha):
    latest = {}
    for run in runs:
        # REST responses may append @ref. Branch/SHA/repository are checked below.
        path = run.get('path', '').partition('@')[0]
        if (path not in REQUIRED or run.get('head_sha') != sha or
                run.get('head_branch') != branch or run.get('event') != 'push' or
                run.get('head_repository', {}).get('full_name') != repository):
            continue
        order = (run.get('run_number', 0), run.get('run_attempt', 0), run.get('id', 0))
        if path not in latest or order > latest[path][0]:
            latest[path] = (order, run)
    ready = len(latest) == len(REQUIRED)
    for _, run in latest.values():
        if run.get('status') != 'completed':
            ready = False
        elif run.get('conclusion') != 'success':
            raise GateError(f"Required workflow did not succeed: {run['path']}")
    return ready


def api(path):
    request = urllib.request.Request('https://api.github.com/' + path, headers={
        'Authorization': 'Bearer ' + os.environ['GH_TOKEN'],
        'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'})
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)


def main():
    if os.environ.get('GITHUB_EVENT_NAME') != 'workflow_run':
        raise GateError('Expected a workflow_run event')
    repository = os.environ['GITHUB_REPOSITORY']
    event = json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text())
    run = event['workflow_run']
    stage = run.get('head_branch', '')
    if repository != REPOSITORY or stage not in ENVIRONMENTS:
        raise GateError('Unexpected repository or release branch')
    branch_path = f'repos/{repository}/branches/{urllib.parse.quote(stage, safe="")}'
    stage, sha = authorize(run, api(branch_path), repository)
    deadline = time.monotonic() + 600
    while time.monotonic() < deadline:
        runs = []
        for page in range(1, 11):
            batch = api(f'repos/{repository}/actions/runs?head_sha={sha}&event=push&per_page=100&page={page}')['workflow_runs']
            runs.extend(batch)
            if len(batch) < 100:
                break
        else:
            raise GateError('Too many workflow runs; refusing incomplete evidence')
        if checks_ready(runs, repository, stage, sha):
            authorize(run, api(branch_path), repository)
            with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
                output.write(f'sha={sha}\nstage={stage}\n')
            print(f'Authorized {repository}@{sha} for {stage} image publication')
            return
        time.sleep(10)
    raise GateError('Timed out waiting for exact-head native CI')


if __name__ == '__main__':
    main()
