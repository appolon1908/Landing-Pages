# Supplied Breero image pipeline

Use the supplied 30 WebP service images, full transparent logo and favicon ICO/PNG
files unchanged. Do not regenerate images or commit the 30 original PNG hero files.
The handoff CSV records original names, sizes, dimensions and SHA-256 hashes; the
repository manifest maps its numbered assets to the 30 canonical service slugs.

`@lp/ui/brandAssets.ts` exports `logoUrl`, `faviconUrl` and
`serviceHeroUrl(slug): string | undefined`. Each service entry imports only its own
WebP and calls `registerServiceHero(slug, url)` before mounting. Shared UI imports no
hero catalog. Home uses only shared branding. Original filename stems remain in
hashed asset URLs so independent browser checks can identify the service image.

Vite emits external hashed `/assets/` URLs, including small favicon PNGs. Every page
head marks the supplied ICO plus 16/32 PNG icon links with `data-breero-icon`.
After validating the request's site context, page-kit removes only these marked
links when the trimmed, case-insensitive brand name is not Breero. This also covers
homepage and no-JavaScript policy responses while preserving custom icon links.
Page-kit and the deployment asset
collector admit `.ico` precisely; MIME is `image/x-icon`. No root-only favicon URL or
locale-relative asset path is required by the production route map.

Implementation checks: validate all 30 mappings, source hashes and dimensions; reject
modified bytes or mismatched mapping; build representative pages and prove each has
one matching WebP and no unrelated service images; verify favicon HTTP responses
from nested ES/EN/FR routes; preserve deployment collision/symlink restrictions.

UI layout work is separate. The full logo has the orange/blue B symbol followed by
navy REERO, for light backgrounds. Supplied heroes already contain a white REERO
wordmark; do not duplicate the B or generate a replacement white logo. Heroes are
1672 × 941. Preserve their ratio and keep service subjects visible on narrow screens.

References: [Vite asset URLs](https://vite.dev/guide/assets),
[WebP container dimensions](https://developers.google.com/speed/webp/docs/riff_container).
