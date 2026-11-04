# Integrated preview browser checks

Run with Node 22 after `npm ci` and `npm run build` for all workspaces:

```powershell
npm run test:browser
```

Use an installed Playwright Chromium browser, or set `CHROME_BIN` to an installed Chrome executable. The recorded Windows run uses Node 22.22.1 and Chrome 156.0.8078.74.

Playwright starts a fresh local stack using backend port 4400 and page ports 4500–4530. Home is 4500, HVAC 4501; the remaining service order is the independent blueprint inventory in catalog.ts. Existing previews on 4000/4173–4177 are untouched. Optional `E2E_BACKEND_PORT` and `E2E_FIRST_PAGE_PORT` move the whole test stack together. Existing servers are never reused, so the tested source tree must supply its own build artifacts.

Use `npx playwright test --list` for the current case count. The suite includes the two root-authored blueprint checks:

- 183 distinct core routes: three home locales plus thirty services, two audiences and three locales. Each checks successful rendered content, locale, canonical and alternate links. Home verifies the full catalog links for both audiences.
- 99 axe scans: three home locales and five pilot services in both audiences and all locales, at widths 390, 768 and 1440. Also checks horizontal overflow. Automated scans do not replace manual assistive-technology review.
- 24 no-JavaScript policy checks: home and HVAC, all three locales, all four baseline documents (about, contact, privacy and terms).
- Provider two-step applications, accessible errors, required service consent, optional promotions, no-write preview, and input preservation with every consent choice reset during locale changes. Both audiences retain honest direct thank-you routes.
- All thirty customer services in all three locales use the BREERO booking form handoff instead of an inline intake form. Hero, final and mobile CTAs retain bounded service/language context, ignore forged query fields and open the selected form in a new tab. Missing, public-only and unsafe targets fall back to the focusable on-page booking panel.
- Optional provider radius, job size, qualifications summary, quote process and commercial preferences: bounded radius validation and preservation across locale changes. Photos and verification documents are deferred to secure follow-up; this preview presents no upload control.
- Mobile booking-choice keyboard activation and new-tab navigation; provider focused input visibility at full and reduced viewport heights; service-origin isolation, cross-origin selector navigation and preview-disabled registry status.

The shared fixture aborts any browser write before it reaches a server and fails the test if a write was attempted. It also fails unexpected external requests and uncaught page errors. Fixtures never enable submissions, configure a live destination or assert a CRM receipt. Backend live-receipt behavior is covered by separate isolated intake tests. HTML reports, traces and failure screenshots stay in ignored local output directories.

The former landing.spec.ts mixed US-only fields, two-locale assumptions, hardcoded 4173/4174 ports and placeholder plumbing copy. Its valid coverage has moved into the route, intake, policy, accessibility and isolation cases above. Root-owned blueprint.spec.ts is preserved.
