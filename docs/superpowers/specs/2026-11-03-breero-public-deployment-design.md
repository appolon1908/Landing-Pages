# Breero public website deployment

The user authorized publishing the website at `https://breero.com` on the existing
Middleware server. CRM acceptance, billing, messaging and provider activation remain
disabled. The public site retains preview notices, draft policies and noindex.

The controller selected the existing Docker/Compose/Caddy stack: 31 independent page
containers, one private backend, and a dedicated bridge. A monolithic app would change
the accepted page architecture. A separate reverse proxy would duplicate the existing
TLS listener. This work prepares deployment code only; the controller owns server,
DNS, guarded Git publication and Caddy activation.

Each immutable `/srv/codestra/breero/releases/<40-character-sha>` directory contains a
`source` checkout, generated `compose.json`, `registry/breero.json`, `release.json`,
`Caddyfile`, and a checked union of built assets under `assets`. The `current` symlink
selects the active release. Home binds `127.0.0.1:6100`; the canonical catalog order
binds services to 6101 through 6130. The backend has no host port. A normal dedicated
bridge provides service isolation but is not an outbound network firewall.

Caddy routes exact localized audience/service routes, including thank-you routes, to
the matching page. Policies, home, API and other paths use the home server; its API
proxy retains the existing 64 KiB bound. Only `/assets/` is served from the generated
asset directory. Duplicate asset filenames must have identical bytes. The single
public origin is `https://breero.com`; no localhost page origins enter the registry.

Runtime services use the images' non-root user, read-only filesystems, no added
capabilities, no-new-privileges and no secret environment variables. Existing Docker
services, volumes, networks and Caddy routes are outside scope. Deployment commands
must reject collisions with an unrelated Compose project and never prune resources.

Builds run sequentially. Moving the build-stage PAGE argument after npm ci allows
all pages to reuse dependency layers. Fixed ports require an in-place Breero-only
replacement, not zero-downtime blue/green deployment. Rollback starts an earlier
immutable release, checks it and restores the current symlink. Caddy import/reload
remains an explicit controller step after backup and validation of the existing file.

Validation includes meaningful generator/asset/ownership mutation tests, all 183
localized main routes, policy rendering, asset responses, canonical origins, unknown
hosts and disabled intake. Runtime Docker/Caddy validation is a separate host gate;
local source tests must never be reported as deployment success.
