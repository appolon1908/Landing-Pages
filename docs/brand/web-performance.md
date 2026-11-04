# Web delivery

The original supplied logo and all service images retain their handoff bytes and
hashes. The header uses a transparent 528 × 176 PNG derivative, at most 64 KiB,
instead of downloading the 618 KB original at every page's first visit. This
supports three device pixels for each pixel of its 176px desktop display width.
`assets/manifest.json` records its source hash, dimensions, bytes and output hash.
Run `node scripts/optimize_logo.mjs` with the repository's Playwright Chromium
(or `CHROME_BIN`) to regenerate offline; review and update the committed derivative
together. No service image is re-encoded or substituted.

The BREERO Caddy fragment enables Zstandard/Gzip compression and one-year immutable
caching for successful static asset responses. Built filenames are content hashed.
HTML stays `no-store`; public context remains host scoped. The page server includes
its already validated public context as escaped inert JSON, saving a browser
round-trip before rendering. The client validates it and fetches the API if it is
absent or invalid. Neither path grants submission authority.

English is the default for unlocalized entry URLs and `x-default` metadata.
Language controls offer English, Spanish, then French. Explicit Spanish and French
links retain their language, including after reloading and changing audience.

Regression coverage checks all localized routes, initial rendering without a second
context request, fallback handling, escaping, language choice, image provenance and
bundle budgets. Compare release performance with the same browser/network/CPU settings;
lab timings are not field Core Web Vitals or a Lighthouse score.

Proxy syntax: [compression](https://caddyserver.com/docs/caddyfile/directives/encode)
and [response headers](https://caddyserver.com/docs/caddyfile/directives/header).
