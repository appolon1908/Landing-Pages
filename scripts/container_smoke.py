"""Build and inspect a disposable, loopback-only container.

Usage:
  python3 scripts/container_smoke.py                     # backend image
  IMAGE_TARGET=page PAGE=hvac python3 scripts/container_smoke.py
"""
import json
import os
import secrets
import shlex
import subprocess
import time
import urllib.request
from pathlib import Path

root = Path(__file__).resolve().parents[1]
docker = shlex.split(os.getenv("DOCKER", "docker"))
name = "codestra-image-check-" + secrets.token_hex(5)
image = "local/" + name
target = os.getenv("IMAGE_TARGET", "backend")
page = os.getenv("PAGE", "hvac")
port = int(os.getenv("CONTAINER_PORT", "4000" if target == "backend" else "4173"))
build_args = (["-f", "backend/Dockerfile"] if target == "backend" else ["-f", "Dockerfile.page", "--build-arg", f"PAGE={page}"])
run_env = [] if target == "backend" else ["-e", "BACKEND_URL=http://127.0.0.1:4000"]
health_path = os.getenv("HEALTH_PATH", "/healthz")
started = False


def run(args):
    result = subprocess.run(docker + args, cwd=root, capture_output=True, text=True, timeout=480)
    if result.returncode:
        raise RuntimeError(result.stderr[-3000:])
    return result.stdout.strip()


try:
    run(["build", *build_args, "--label", "codestra.task=standalone-image-check", "-t", image, "."])
    user = run(["image", "inspect", image, "--format", "{{.Config.User}}"])
    assert user not in ("", "root", "0", "0:0"), "Image must declare a non-root user"
    run(["run", "-d", "--rm", "--name", name, "--label", "codestra.task=standalone-image-check", "--read-only", "--cap-drop=ALL", "--security-opt=no-new-privileges", *run_env, "-p", f"127.0.0.1::{port}", image])
    started = True
    published = run(["port", name, f"{port}/tcp"]).rsplit(":", 1)[1]
    deadline = time.monotonic() + 60
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{published}{health_path}", timeout=2) as response:
                health = json.load(response)
            break
        except (OSError, ValueError):
            time.sleep(0.5)
    else:
        raise RuntimeError("Image health check did not become ready")
    assert health.get("status") == "ok", "Health endpoint must report ok"
    assert run(["exec", name, "id", "-u"]) != "0", "Runtime user must be non-root"
    print(json.dumps({"result": "PASS", "image": run(["image", "inspect", image, "--format", "{{.Id}}"]), "runtime_user": user, "health": health, "loopback_only": True, "read_only": True}))
finally:
    if started:
        subprocess.run(docker + ["rm", "-f", name], capture_output=True, check=False)
    subprocess.run(docker + ["image", "rm", image], capture_output=True, check=False)
