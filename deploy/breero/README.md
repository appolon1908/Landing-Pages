# Breero public website release

This publishes the website while its registry remains **preview / disabled**.
Forms cannot create CRM requests, charges, messages, provider accounts or appointments.
Draft notices and `noindex, nofollow` remain visible. A public page is not an activated
business integration. The root controller owns guarded Git publication, server changes,
DNS and Caddy activation; preparation by a worker does not perform these operations.

## Required host state

- Linux, Git, Node 22.18–22.x, Python 3 and Docker Compose with `up --wait`.
- Existing Caddy continues owning ports 80/443. No replacement proxy is installed.
- Ports 6100–6130 must be free or owned by the current Breero Compose project.
- The existing 32-container runtime is scoped to Compose project `breero-public` and
  its own bridge, with no shared volumes or backend host port. A normal bridge permits
  outbound connectivity; it is not an egress firewall. Configured destinations stay off.
- Page memory ceilings are 192 MiB each; backend 256 MiB. Account for approximately
  6.1 GiB total ceilings and other workloads. Builds run sequentially.
- Confirm apex A/AAAA records reach this host and `www` points to the same site before
  enabling its Caddy TLS hostnames. Preserve unrelated MX/TXT/mail records.

## Prepare an immutable release

Publish the reviewed commit through the guarded `codestra-local` publisher and record
exact local/remote SHA parity. On the host, place a clean checkout of that exact full
SHA at `/srv/codestra/breero/releases/<sha>/source`. The release directory and checkout
must be real directories, not symlinks. Keep release ancestors traversable by Caddy;
source/configuration are never static file roots.

Using the real 40-character SHA in place of `<sha>`:

```sh
node /srv/codestra/breero/releases/<sha>/source/deploy/breero/generate.mjs \
  --revision <sha> --release /srv/codestra/breero/releases/<sha>
python3 -B /srv/codestra/breero/releases/<sha>/source/deploy/breero/release.py \
  build /srv/codestra/breero/releases/<sha>
python3 -B /srv/codestra/breero/releases/<sha>/source/deploy/breero/release.py \
  collect-assets /srv/codestra/breero/releases/<sha>
```

The generator requires Git and Node on the host; the inspected Middleware server has
Node 22.22.1. It rechecks clean source HEAD and rejects overwritten configuration.
Every controller operation invokes `--verify`, which re-derives and compares the exact
Compose, registry, Caddy and release documents from that source. Hand editing generated
files is unsupported: change source, review and create a new immutable release.

The build-stage `PAGE` argument is introduced after `npm ci`, so all 31 images reuse
the dependency cache. Asset collection creates stopped containers without network
attachments, copies their built assets, compares duplicate filenames byte-for-byte,
then removes only IDs returned by those create calls. Existing Docker resources and
build caches are never pruned. `assets.json` records the exact file hashes.

## Start and verify before public activation

```sh
python3 -B /srv/codestra/breero/releases/<sha>/source/deploy/breero/release.py \
  start-local /srv/codestra/breero/releases/<sha>
```

This updates only the `breero-public` Compose project, then verifies all 32 running,
healthy services against their exact release labels, tags and image IDs. It checks all
183 main routes, 12 mandatory localized policy routes, actual asset hashes, preview
metadata, unknown hosts, the 64 KiB API bound and disabled intake. It does not touch
`current`, Caddy or DNS. Existing unrelated containers/networks or occupied ports
cause refusal. Image pulls are disabled at runtime. First-install failures leave the
owned stack available for inspection; a failed replacement restores and checks the
previous managed release when one exists.

## Activate the checked release

```sh
python3 -B /srv/codestra/breero/releases/<sha>/source/deploy/breero/release.py \
  activate /srv/codestra/breero/releases/<sha>
```

This repeats the local checks and atomically selects `current`. The controller must
back up the existing `/etc/caddy/Caddyfile`, copy it to a candidate, append exactly one
`import /srv/codestra/breero/current/Caddyfile` if absent, and inspect that the candidate
preserves every existing route. Validate the **complete candidate** with
`caddy validate --config <candidate> --adapter caddyfile` before replacing the active
file and using the host's established Caddy reload procedure. Never overwrite the
monolithic file with the generated Breero fragment. Check effective configuration for
duplicate Breero domains/imports before reload. Caddy only serves static files from
`current/assets`, with `/assets/` stripped, and globally returns the preview robots tag.

After confirmed DNS/TLS and Caddy activation:

```sh
python3 -B /srv/codestra/breero/releases/<sha>/source/deploy/breero/release.py \
  check-public /srv/codestra/breero/releases/<sha>
```

This uses verified HTTPS at `breero.com`, checks route/asset responses and forbidden
source/registry traversal paths, and still verifies local runtime identity. Separately
confirm `www.breero.com` redirects permanently to the apex and existing host services
remain healthy. Record DNS, TLS, image IDs, SHA and checks before reporting public
deployment success. Local checks alone are not public reachability evidence.

## Rollback

Keep the previous release checkout, configuration, assets and image tags. Run that
release's reviewed controller with `rollback /srv/codestra/breero/releases/<old-sha>`.
It recreates only the Breero services from the previous images, runs the full local
checks and restores `current`. If the rollback check fails, it attempts to restore
the release selected before rollback. Review/reload Caddy if its imported routing
fragment changed; on first-install rollback restore the controller's Caddy backup.
Fixed ports mean a brief interruption; this is not blue/green deployment. No command
deletes releases, volumes, unrelated containers or caches.

References checked 2026-11-03: [Caddy handle routing](https://caddyserver.com/docs/caddyfile/directives/handle),
[Caddy file serving](https://caddyserver.com/docs/caddyfile/directives/file_server),
[Compose networking](https://docs.docker.com/compose/how-tos/networking/).
