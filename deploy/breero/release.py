"""Operate only the reviewed Breero Compose project; never edit Caddy or DNS."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import secrets
import socket
import subprocess
import tempfile
import urllib.error
import urllib.request

BASE = Path("/srv/codestra/breero")
PROJECT = "breero-public"
ASSET = re.compile(r"^[A-Za-z0-9_.-]+\.(?:js|css|svg|png|webp|woff2|ico)$")
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def command(args, timeout=600):
    result = subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    if result.returncode:
        raise RuntimeError(f"{args[0:3]} failed: {result.stderr[-3000:] or result.stdout[-3000:]}")
    return result.stdout.strip()


def load_release(path):
    directory = Path(path)
    revision = directory.name
    if not re.fullmatch(r"[a-f0-9]{40}", revision) or directory != BASE / "releases" / revision or directory.resolve() != directory:
        raise ValueError("Invalid immutable release path")
    reject_symlinks(directory)
    data = json.loads(command(["node", str(directory / "source/deploy/breero/generate.mjs"), "--revision", revision, "--release", str(directory), "--verify"]))
    if data.get("revision") != revision or data.get("releaseDir") != str(directory) or data.get("sourceDir") != str(directory / "source") or data.get("project") != PROJECT or data.get("origin") != "https://breero.com":
        raise ValueError("Release identity mismatch")
    catalog = json.loads((directory / "source/docs/missions/inputs/service-content-map.json").read_text(encoding="utf-8"))["services"]
    expected = ["home"] + [item["slug"] for item in catalog]
    if len(expected) != 31 or len(data["pages"]) != 31:
        raise ValueError("Incomplete page catalog")
    for index, page in enumerate(data["pages"]):
        if page["slug"] != expected[index] or page["port"] != 6100 + index or page["image"] != f"local/breero-{expected[index]}:{revision}":
            raise ValueError("Invalid release page mapping")
    registry = json.loads((directory / "registry/breero.json").read_text(encoding="utf-8"))
    if registry["site"]["mode"] != "preview" or registry["destination"] != {"type": "disabled"} or registry["hosts"] != ["breero.com"]:
        raise ValueError("Only disabled preview registry is authorized")
    return data


def reject_symlinks(directory):
    for name in ("source", "release.json", "compose.json", "Caddyfile", "registry", "registry/breero.json", "assets", "assets.json"):
        path = Path(directory) / name
        if path.is_symlink() or (path.exists() and path.resolve() != path):
            raise ValueError(f"Release paths cannot be symlinks: {name}")


def assert_owned(containers):
    for container in containers:
        labels = container.get("Config", {}).get("Labels") or {}
        if labels.get("com.docker.compose.project") != PROJECT or labels.get("codestra.project") != PROJECT:
            raise ValueError("Existing container ownership mismatch; refusing adoption")


def ownership_preflight():
    ids = command(["docker", "ps", "-aq", "--filter", f"label=com.docker.compose.project={PROJECT}"]).split()
    containers = json.loads(command(["docker", "inspect", *ids])) if ids else []
    assert_owned(containers)
    networks = command(["docker", "network", "ls", "-q", "--filter", f"name=^{PROJECT}$"]).split()
    if networks:
        records = json.loads(command(["docker", "network", "inspect", *networks]))
        if any((item.get("Labels") or {}).get("codestra.project") != PROJECT or (item.get("Labels") or {}).get("com.docker.compose.project") != PROJECT for item in records):
            raise ValueError("Existing network ownership mismatch")
    owned_ports = set()
    for item in containers:
        if item.get("State", {}).get("Running") is not True:
            continue
        for bindings in (item.get("HostConfig", {}).get("PortBindings") or {}).values():
            for binding in bindings or []:
                if binding["HostIp"] == "127.0.0.1":
                    owned_ports.add(int(binding["HostPort"]))
    for port in range(6100, 6131):
        if port in owned_ports:
            continue
        with socket.socket() as listener:
            try:
                listener.bind(("127.0.0.1", port))
            except OSError as error:
                raise ValueError(f"Port {port} belongs to another process") from error


def merge_assets(sources, target):
    """Validate the entire union before creating the published asset directory."""
    target = Path(target)
    if target.exists() or target.is_symlink():
        raise ValueError("Asset output already exists")
    unique = {}
    for source in sources:
        source = Path(source)
        if source.is_symlink() or not source.is_dir():
            raise ValueError("Invalid asset source")
        files = list(source.iterdir())
        if not files:
            raise ValueError("Empty asset source")
        for path in files:
            if path.is_symlink() or not path.is_file() or not ASSET.fullmatch(path.name):
                raise ValueError(f"Unsafe asset: {path.name}")
            content = path.read_bytes()
            if path.name in unique and unique[path.name] != content:
                raise ValueError(f"Asset collision: {path.name}")
            unique[path.name] = content
    target.mkdir(mode=0o755)
    os.chmod(target, 0o755)
    manifest = {}
    for name, content in sorted(unique.items()):
        (target / name).write_bytes(content)
        os.chmod(target / name, 0o644)
        manifest[name] = {"sha256": hashlib.sha256(content).hexdigest(), "bytes": len(content)}
    return manifest


def owned_image(image, revision):
    ids = command(["docker", "image", "ls", "-q", "--filter", f"reference={image}"]).split()
    if not ids:
        return None
    records = json.loads(command(["docker", "image", "inspect", image]))
    labels = records[0].get("Config", {}).get("Labels") or {}
    if labels.get("codestra.project") != PROJECT or labels.get("codestra.release") != revision:
        raise ValueError(f"Existing image ownership mismatch: {image}")
    return records[0]


def build(data):
    source = data["sourceDir"]
    if command(["git", "-C", source, "rev-parse", "HEAD"]) != data["revision"] or command(["git", "-C", source, "status", "--porcelain"]):
        raise ValueError("Build source must be clean at the declared revision")
    targets = [("backend", data["backendImage"])] + [(page["slug"], page["image"]) for page in data["pages"]]
    for slug, image in targets:
        if owned_image(image, data["revision"]):
            print(f"Reusing owned immutable {slug} image", flush=True)
            continue
        options = ["-f", f"{source}/backend/Dockerfile"] if slug == "backend" else ["-f", f"{source}/Dockerfile.page", "--build-arg", f"PAGE={slug}"]
        print(f"Building {slug} sequentially", flush=True)
        command(["docker", "build", *options, "--label", f"codestra.project={PROJECT}", "--label", f"codestra.release={data['revision']}", "-t", image, source], timeout=1800)


def collect_assets(data):
    directory = Path(data["releaseDir"])
    reject_symlinks(directory)
    if (directory / "assets").exists() or (directory / "assets.json").exists():
        raise ValueError("Refusing to overwrite release assets")
    containers = []
    try:
        with tempfile.TemporaryDirectory(prefix="asset-extraction-", dir=directory) as temporary:
            sources = []
            for page in data["pages"]:
                if not owned_image(page["image"], data["revision"]):
                    raise ValueError(f"Build the owned page image before extracting assets: {page['slug']}")
                cid = command(["docker", "create", "--pull=never", "--network", "none", "--label", f"codestra.project={PROJECT}", "--label", "codestra.operation=asset-extraction", page["image"]])
                containers.append(cid)
                destination = Path(temporary) / page["slug"]
                command(["docker", "cp", f"{cid}:/app/page/dist/assets", str(destination)])
                sources.append(destination)
            manifest = merge_assets(sources, directory / "assets")
            with (directory / "assets.json").open("x", encoding="utf-8") as file:
                file.write(json.dumps(manifest, indent=2) + "\n")
            return manifest
    finally:
        cleanup_errors = []
        for cid in reversed(containers):
            try:
                command(["docker", "rm", cid])
            except RuntimeError as error:
                cleanup_errors.append(str(error))
        if cleanup_errors:
            raise RuntimeError("Owned asset containers could not be removed: " + "; ".join(cleanup_errors))


def request(base, path, host="breero.com", body=None):
    headers = {"Host": host}
    if body is not None:
        headers.update({"Content-Type": "application/json", "Origin": "https://breero.com"})
    req = urllib.request.Request(base + path, headers=headers, data=body)
    try:
        with OPENER.open(req, timeout=15) as response:
            return response.status, response.read(), response.headers
    except urllib.error.HTTPError as error:
        return error.code, error.read(), error.headers


def validate_runtime(data, containers, image_ids):
    assert_owned(containers)
    expected = {"backend": data["backendImage"], **{page["slug"]: page["image"] for page in data["pages"]}}
    if len(expected) != 32 or len(containers) != 32:
        raise ValueError("Expected exactly 32 Breero runtime containers")
    seen = set()
    for container in containers:
        config = container["Config"]
        labels = config["Labels"]
        service = labels.get("com.docker.compose.service")
        if service not in expected or service in seen or labels.get("codestra.release") != data["revision"] or config.get("Image") != expected[service] or container.get("Image") != image_ids.get(expected[service]):
            raise ValueError("Runtime service/image/revision identity mismatch")
        if container.get("State", {}).get("Running") is not True or container["State"].get("Health", {}).get("Status") != "healthy":
            raise ValueError("Runtime container is not running and healthy")
        seen.add(service)


def runtime_identity(data):
    ids = command(["docker", "ps", "-aq", "--filter", f"label=com.docker.compose.project={PROJECT}"]).split()
    containers = json.loads(command(["docker", "inspect", *ids])) if ids else []
    names = [data["backendImage"]] + [page["image"] for page in data["pages"]]
    image_records = json.loads(command(["docker", "image", "inspect", *names]))
    for record in image_records:
        labels = record.get("Config", {}).get("Labels") or {}
        if labels.get("codestra.project") != PROJECT or labels.get("codestra.release") != data["revision"]:
            raise ValueError("Runtime image ownership/revision mismatch")
    image_ids = {tag: record["Id"] for record in image_records for tag in record.get("RepoTags", [])}
    validate_runtime(data, containers, image_ids)


def check_release(data, public=False):
    runtime_identity(data)
    assets = json.loads((Path(data["releaseDir"]) / "assets.json").read_text(encoding="utf-8"))
    home = "https://breero.com" if public else "http://127.0.0.1:6100"
    status, body, _ = request(home, "/api/site-context")
    site = json.loads(body)
    if status != 200 or site.get("mode") != "preview" or site.get("submissionsEnabled") is not False or site.get("publicOrigin") != "https://breero.com" or len(site.get("pages", [])) != 30:
        raise ValueError("Public context is not the disabled Breero preview")
    if request(home, "/api/submissions/service-requests", body=b"{}")[0] != 503:
        raise ValueError("Preview intake did not fail closed")
    if request(home, "/api/submissions/service-requests", body=b"x" * (64 * 1024 + 1))[0] != 413:
        raise ValueError("Home proxy did not bound request body")
    checked_assets = set()
    route_count = 0
    for page in data["pages"]:
        endpoint = home if public else f"http://127.0.0.1:{page['port']}"
        if not public:
            health_status, health_body, _ = request(endpoint, "/healthz")
            if health_status != 200 or json.loads(health_body).get("page") != page["slug"]:
                raise ValueError(f"Wrong page bound to port {page['port']}")
            if request(endpoint, page["routes"][0], host="unknown.invalid")[0] != 421:
                raise ValueError("Unknown host did not fail closed")
        for path in page["routes"]:
            status, body, headers = request(endpoint, path)
            html = body.decode("utf-8")
            locale = path.split("/")[1]
            if status != 200 or f'<html lang="{locale}">' not in html or f'rel="canonical" href="https://breero.com{path}"' not in html or "noindex" not in headers.get("X-Robots-Tag", ""):
                raise ValueError(f"Route metadata/readiness failed: {path}")
            route_count += 1
            for name in re.findall(r'(?:src|href)="/assets/([^"/]+)"', html):
                if name not in assets:
                    raise ValueError(f"HTML references unknown asset: {name}")
                key = (endpoint, name)
                if key not in checked_assets:
                    code, content, asset_headers = request(endpoint, "/assets/" + name)
                    if code != 200 or hashlib.sha256(content).hexdigest() != assets[name]["sha256"]:
                        raise ValueError(f"Asset response mismatch: {name}")
                    if public and "noindex" not in asset_headers.get("X-Robots-Tag", ""):
                        raise ValueError("Public asset response lacks preview noindex header")
                    checked_assets.add(key)
    if route_count != 183:
        raise ValueError("Incomplete main route verification")
    for path in ("/registry/breero.json", "/source/package.json", "/assets/../registry/breero.json", "/assets/%2e%2e/registry/breero.json", "/assets/%252e%252e/source/package.json"):
        if request(home, path)[0] not in (400, 403, 404):
            raise ValueError(f"Nonasset file boundary failed: {path}")
    for locale in ("es", "en", "fr"):
        for policy in ("about", "contact", "privacy-policy", "terms"):
            status, body, headers = request(home, f"/{locale}/{policy}")
            if status != 200 or b"<article" not in body or "noindex" not in headers.get("X-Robots-Tag", ""):
                raise ValueError(f"Policy did not render: {locale}/{policy}")
    print(json.dumps({"result": "PASS", "revision": data["revision"], "mainRoutes": route_count, "policies": 12, "assetResponses": len(checked_assets), "scope": "public-https" if public else "loopback-before-activation", "submissionsEnabled": False}), flush=True)


def compose_up(data):
    ownership_preflight()
    command(["docker", "compose", "--project-name", PROJECT, "--file", str(Path(data["releaseDir"]) / "compose.json"), "up", "--detach", "--no-build", "--pull", "never", "--wait", "--wait-timeout", "180"], timeout=300)


def start_local(data):
    current = BASE / "current"
    previous = load_release(str(current.resolve())) if current.is_symlink() else None
    if current.exists() and not current.is_symlink():
        raise ValueError("Current release must be a managed symlink")
    try:
        compose_up(data)
        check_release(data)
    except Exception as error:
        if previous and previous["revision"] != data["revision"]:
            compose_up(previous)
            check_release(previous)
            raise RuntimeError("New release failed; previous Breero stack restored") from error
        raise


def switch_current(directory, current, checker):
    directory, current = Path(directory), Path(current)
    if current.exists() and not current.is_symlink():
        raise ValueError("Refusing to replace a non-symlink current path")
    checker(directory)
    temporary = current.parent / (".current-" + secrets.token_hex(8))
    try:
        temporary.symlink_to(directory, target_is_directory=True)
        os.replace(temporary, current)
    finally:
        if temporary.is_symlink():
            temporary.unlink()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("operation", choices=["build", "collect-assets", "start-local", "check", "check-public", "activate", "rollback"])
    parser.add_argument("release")
    args = parser.parse_args()
    data = load_release(args.release)
    if args.operation == "build":
        build(data)
    elif args.operation == "collect-assets":
        collect_assets(data)
    elif args.operation in ("start-local", "rollback"):
        start_local(data)
        if args.operation == "rollback":
            switch_current(data["releaseDir"], BASE / "current", lambda _: check_release(data))
    elif args.operation in ("check", "check-public"):
        check_release(data, public=args.operation == "check-public")
    elif args.operation == "activate":
        switch_current(data["releaseDir"], BASE / "current", lambda _: check_release(data))
    print("No Caddy or DNS configuration was changed.", flush=True)


if __name__ == "__main__":
    main()
