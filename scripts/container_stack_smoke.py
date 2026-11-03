"""Verify disposable backend/home/HVAC images together; never deploy them.

Only randomly named resources created by this process are removed. Images run as
their declared non-root user, read-only, without capabilities, on ephemeral
loopback ports. The checked registries must remain preview/disabled.
"""
import json
import re
import secrets
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path

root = Path(__file__).resolve().parents[1]
prefix = "codestra-breero-check-" + secrets.token_hex(6)
network = prefix + "-net"
images = []
containers = []
network_created = False
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def docker(*args, timeout=480):
    result = subprocess.run(["docker", *args], cwd=root, capture_output=True,
                            text=True, timeout=timeout)
    if result.returncode:
        raise RuntimeError(result.stderr[-5000:] or result.stdout[-5000:])
    return result.stdout.strip()


def request(port, path, host="127.0.0.1", body=None):
    headers = {"Host": host}
    if body is not None:
        headers.update({"Content-Type": "application/json", "Origin": "http://127.0.0.1:4173"})
    req = urllib.request.Request(f"http://127.0.0.1:{port}{path}", data=body, headers=headers)
    try:
        with opener.open(req, timeout=5) as response:
            return response.status, response.read(), response.headers
    except urllib.error.HTTPError as error:
        return error.code, error.read(), error.headers


def start(role, image, internal_port, extra=()):
    name = prefix + "-" + role
    container_id = docker("create", "--name", name,
           "--label", "codestra.task=breero-isolated-verification",
           "--network", network, "--network-alias", role,
           "--read-only", "--cap-drop=ALL", "--security-opt=no-new-privileges",
           "-p", f"127.0.0.1::{internal_port}", *extra, image)
    containers.append(container_id)
    docker("start", container_id)
    try:
        port = int(docker("port", name, f"{internal_port}/tcp").rsplit(":", 1)[1])
    except (RuntimeError, IndexError, ValueError):
        print(docker("inspect", name, "--format", "{{json .State}} {{json .HostConfig.PortBindings}} {{json .NetworkSettings.Ports}}"), flush=True)
        print(docker("logs", name)[-2000:], flush=True)
        raise
    deadline = time.monotonic() + 60
    while time.monotonic() < deadline:
        try:
            status, data, _ = request(port, "/healthz")
            if status == 200 and json.loads(data).get("status") == "ok":
                break
        except (OSError, ValueError):
            pass
        time.sleep(0.5)
    else:
        raise RuntimeError(f"{role} did not become healthy: {docker('logs', name)[-2000:]}")
    assert docker("exec", name, "id", "-u") != "0", f"{role} runs as root"
    return port


try:
    for path in (root / "config" / "registry").glob("*.json"):
        entry = json.loads(path.read_text(encoding="utf-8"))
        assert entry["site"]["mode"] == "preview", "Image checks require preview registries"
        assert entry["destination"]["type"] == "disabled", "Destination must be disabled"
    for role in ("backend", "home", "hvac"):
        image = "local/" + prefix + "-" + role
        args = ["-f", "backend/Dockerfile"] if role == "backend" else ["-f", "Dockerfile.page", "--build-arg", f"PAGE={role}"]
        print(f"Building disposable {role} image", flush=True)
        docker("build", *args, "--label", "codestra.task=breero-isolated-verification", "-t", image, ".")
        images.append(image)
        assert docker("image", "inspect", image, "--format", "{{.Config.User}}") not in ("", "root", "0", "0:0")
    # This daemon does not publish host ports for an internal-only network.
    # A dedicated bridge plus explicit 127.0.0.1 bindings keeps checks local.
    docker("network", "create", "--driver", "bridge", "--label", "codestra.task=breero-isolated-verification", network)
    network_created = True
    backend_port = start("backend", images[0], 4000)
    home_port = start("home", images[1], 4173, ("-e", "BACKEND_URL=http://backend:4000"))
    hvac_port = start("hvac", images[2], 4173, ("-e", "BACKEND_URL=http://backend:4000"))
    status, body, _ = request(backend_port, "/api/site-context")
    site = json.loads(body)
    assert status == 200 and site["mode"] == "preview" and site["submissionsEnabled"] is False
    assert len(site["pages"]) == 30
    assert request(backend_port, "/api/submissions/service-requests", body=b"{}")[0] == 503
    assert request(backend_port, "/api/site-context", host="unknown.example")[0] == 421
    checks = 3
    for port, kind in ((home_port, "home"), (hvac_port, "hvac")):
        checked_assets = set()
        for locale in ("es", "en", "fr"):
            paths = [f"/{locale}/"] if kind == "home" else [f"/{locale}/landing/hvac", f"/{locale}/business/hvac"]
            for path in paths + [f"/{locale}/privacy-policy"]:
                status, body, headers = request(port, path)
                html = body.decode("utf-8")
                assert status == 200, (kind, path, status, html)
                assert f'<html lang="{locale}">' in html
                assert "noindex" in headers.get("X-Robots-Tag", "")
                for alternate in ("es", "en", "fr", "x-default"):
                    assert f'hreflang="{alternate}"' in html
                for asset in re.findall(r'(?:src|href)="(/assets/[^\"]+)"', html):
                    if asset not in checked_assets:
                        asset_status, asset_body, _ = request(port, asset)
                        assert asset_status == 200 and len(asset_body) > 0, (kind, asset)
                        checked_assets.add(asset)
                        checks += 1
                checks += 1
        assert request(port, "/es/" if kind == "home" else "/es/landing/hvac", host="unknown.example")[0] == 421
        assert request(port, "/es/landing/plumbing")[0] == 404
        checks += 2
    print(json.dumps({"result": "PASS", "checks": checks,
                      "images": [docker("image", "inspect", image, "--format", "{{.Id}}") for image in images],
                      "host_ports_loopback_only": True, "runtime_egress_blocked": False,
                      "read_only": True, "non_root": True,
                      "publications": 0, "live_destinations": 0}), flush=True)
finally:
    for container in reversed(containers):
        subprocess.run(["docker", "rm", "-f", container], capture_output=True, check=False)
    if network_created:
        subprocess.run(["docker", "network", "rm", network], capture_output=True, check=False)
    for image in images:
        subprocess.run(["docker", "image", "rm", image], capture_output=True, check=False)
