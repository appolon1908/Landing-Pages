# BREERO Meta Pixel integration (proposed)

**Meta Pixel ID:** `965185126235275` (provided by the owner).

**Where:** Shared `packages/page-kit` page server and `packages/ui` Vue components, covering BREERO home and independently deployed customer/provider service pages, including localized routes.

## Activation conditions

The Pixel is **disabled by default**. All conditions are required:

1. The validated, host-scoped site context uses `mode: "live"` and brand `Breero`.
2. The page-server operator explicitly sets `LP_BREERO_META_PIXEL_ENABLED=true`.
3. The visitor explicitly selects **Allow advertising measurement**. No initial consent is implied by analytics consent, service requests or SMS opt-in. A Global Privacy Control opt-out blocks the pixel.
4. The deployment's actual privacy/cookie disclosure has been reviewed to describe Meta's processing and the available rights/choices under applicable law.

The page server publishes an inert `lp-meta-pixel-id` meta tag in `<head>` and permits only the relevant Meta origins in CSP when conditions 1–2 hold. The browser injects `fbevents.js` into `<head>` and initializes the owner-supplied pixel ID only after condition 3. It tracks `PageView` once per pathname, including client-side service/audience navigation. It supports withdrawing advertising consent and persists a per-site choice when browser storage permits.

A `<noscript>` tracking image is deliberately omitted: visitors without JavaScript cannot provide the required optional advertising consent. No script, network request, or tracking image is added to preview sites or other brands.

**Important:** The feature flag alone does not prove policy readiness or authorize promotion. Production release remains with BREERO's site owner. Independent review, required CI, the prescribed branch chain, local `codestra-local` SHA parity, and rollout approval are still required. No ad campaigns, billing changes or conversion events beyond `PageView` are activated here.

## Acceptance

1. Run `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:browser` and repository gates.
2. On a preview site, confirm the HTML contains no `lp-meta-pixel-id` and the Network panel makes no request to Meta.
3. On an approved live BREERO test site with flag on, confirm the head includes exactly one `lp-meta-pixel-id`; no Meta network requests occur before choosing **Allow advertising measurement**.
4. Opt in, navigate the homepage and customer/provider pages, and check Meta Events Manager → **Test Events** for the correct Pixel ID and one `PageView` per route. Confirm multilingual navigation and no duplicates.
5. Reject/withdraw permission and verify that no further `PageView` calls occur; test Global Privacy Control and blocked local storage.
6. Verify other brand hosts, unauthorized hosts, and all preview hosts never receive the Pixel meta tag or relaxed CSP.
7. Check no Google Tag Manager or other platform already installs the same Pixel ID, and verify the effective privacy policy before release.

**Do not mark Meta's setup screen complete until the code has been reviewed, merged through approved release paths, deployed, and verified on the actual live domain.**
