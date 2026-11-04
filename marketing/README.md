# Breero marketing review drafts

All thirty service kits are local drafts. Nothing is published, scheduled, approved by Meta, or connected to an account. There are no account identifiers, credentials, uploaders, Pixels, Conversions API calls or WhatsApp transports in this package. Planning links use the user-supplied public-domain reference `https://breero.com`; domain ownership and live operational readiness remain unverified. This website reference is not a Git remote.

Each `marketing/<slug>/ads.json` contains eight campaign plans: customer and provider website variants in ES/EN/FR, plus Spanish customer instant-form and WhatsApp variants. Each kit also contains three localized instant-form drafts, WhatsApp starting messages, and four localized creative briefs. Provider campaigns invite independent service businesses to review a partnership; they are not employment offers.

Run `npm run marketing:validate`, `npm run content:check`, and `npm run test:content`. `npm run marketing:export` writes ignored planning CSV and instant-form JSON files under `marketing/out/`. These files are **not certified Ads Manager import files**. The owner must obtain a current export template from the intended account, map its columns, review every draft and obtain separate launch authorization. The JSON exports are content plans, not API request payloads.

`pageHeadline` and `pageCta` must exactly equal the current page manifest. Short ad headlines reuse the exact page CTA or a service name of at most forty characters. No headline is truncated. Platform CTA enums use the explicit localized planning-label mapping in `_tooling/copy.mjs`; these labels are not a guarantee of what Meta will render. This resolves the historical specification's conflict between an eighty-character page headline and a forty-character ad headline.

`_tooling/generate-drafts.mjs` intentionally regenerates the thirty kit files from the current frozen page manifests. Review its diff before retaining regeneration; hand-edited ad variants would be replaced. Validators reject activation, unknown fields, missing variants, stale snapshots, wrong paths, overlong text and unsupported-claim patterns. The claim scanner is a heuristic and does not replace independent language, operational or policy review.

WhatsApp templates remain `DRAFT`, `approved: false`, and `enabled: false`. Categories are proposed and require Meta review. An approved application message may only follow a real CRM review decision; receiving an application does not activate an account. The body and separate `optOut` line must both be displayed in any future approved message. See `_whatsapp/flows.md` and `../docs/MEASUREMENT.md` for permission, window, handoff and event rules.

## Source checks — 2026-11-03

- [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/policy/) (updated 2026-09-23): permission, opt-out, approved templates, user-message service window and human escalation.
- [WhatsApp Business Platform features](https://whatsappbusiness.com/products/business-platform-features/): customer-initiated conversations and opted-in business messaging.
- [Meta's maintained server-event SDK source](https://github.com/meta/facebook-nodejs-business-sdk/blob/main/src/objects/serverside/server-event.js): event name and ID fields used to identify matching events.
- [Meta Conversions API documentation](https://developers.facebook.com/documentation/ads-commerce/conversions-api/deduplicate-pixel-and-server-events) and [Meta Advertising Standards](https://transparency.meta.com/policies/ad-standards/): requested on the source-check date, but the tools received HTTP 429. Recheck before launch; no current policy approval or account-import compatibility is claimed.

No messaging cost, climatic month range, campaign launch date, service price, staff coverage or response-time promise is asserted. Review the current provider/account rules at activation time.
