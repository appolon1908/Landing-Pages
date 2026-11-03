# Public website deployment authorization

On 2026-11-03 the user supplied `https://breero.com/`, then explicitly instructed:

> its in godaddy and we have ssh and you can push to middleware server and make live

This authorizes public website deployment on the existing Middleware server. It is
separate from the earlier page-team assignments and supersedes the earlier absence
of production website authorization. It does not establish a functioning CRM, provider
activation, booking, messaging, advertising or billing workflow. Those remain disabled.

Verified target: SSH alias `codestra-middleware`, user `root2`, host `s1-middleware`.
The server runs existing
Docker services and Caddy; their configuration and resources must be preserved.

Under this authorization the controller created a new, previously absent bare repository
at `/home/root2/git-remotes/Landing-Pages.git`. Its `receive.denyNonFastForwards` and
`receive.denyDeletes` settings are true. The local repository's `codestra-local` remote
is `ssh://codestra-middleware/home/root2/git-remotes/Landing-Pages.git`.
This is an authorized destination bootstrap, not evidence of publication or SHA parity.
The guarded publisher still runs only after coherent review, required checks and a clean commit.

The selected runtime is an isolated `/srv/codestra/breero` release tree with independent
page containers and a private intake backend. Existing applications and active Caddy
routes remain outside this change. Public website readiness and operational marketplace
readiness are different: the website retains honest preview notices and disabled intake.

DNS inspection found the apex A record at `49.12.145.107`, `www` aliased to the apex,
and MX directed separately to `mail.klyrow.com`. Middleware's observed public IPv4 is
`148.101.225.235`. Any DNS cutover must follow successful local release checks; retain
the old value for rollback and preserve unrelated DNS records. Domain ownership is
user-reported; no purchase or registrar account change is authorized by this record.

Computer Use could not reliably determine the current browser URL and ended its UI
session. No GoDaddy record was edited through that tool. DNS/TLS and external reachability
must be checked separately before reporting the public site live.
