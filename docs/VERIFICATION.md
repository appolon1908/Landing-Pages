# Verification

Observed on 2026-11-03 using Node 22.22.1, npm 10.9.4 and Chrome 156.0.8078.74.
This reconstructs the supplied blueprint; it does not certify claims from the missing
historical implementation.

| Check                         | Observed result                                                               |
| ----------------------------- | ----------------------------------------------------------------------------- |
| Unit/backend/page-kit/content | 70 passed, zero failures/skips                                                |
| Format/types/registry         | Passed; both bundled registries preview/disabled, 30 services each            |
| Content/marketing             | 180 audience/locale variants, 30 kits/240 draft campaigns validated           |
| Page builds                   | All 31 packages passed                                                        |
| JavaScript budget             | All 31 passed; maximum 64,538 gzip bytes against 130,000                      |
| Browser                       | 348 passed in one committed run; 183 core routes and 99 pilot/home axe checks |
| Governance                    | Branch-policy unit test and git diff check passed                             |
| Dependency audit              | Zero reported vulnerabilities                                                 |
| Container runtime             | Backend/home/HVAC images passed 26 loopback checks on codestra-dev            |

The browser run used exact commit `3300dbee6494e0690bb7427222b311708677ad61`.
It includes the independently reviewed contrast fix and deterministic mobile focus
test. The integration at `499f65e8a1743bb51a99216c8924bf9f970a58bb` contains that
commit plus later marketing-domain/documentation changes; the tested public UI source
is unchanged. The controller's integrated validation log records the 70-test run.

The 99 axe cases cover home and both audiences for HVAC, plumbing, electrical,
home-cleaning and pest-control in ES/EN/FR at 390, 768 and 1440 pixels. Keyboard,
focus, preview no-POST, conditional forms and no-JavaScript policies have separate
browser cases. This is not a screen-reader certification or native/legal review.

Container evidence used integration `af48ed3f513d92a9dddeab788934663edbbeae4d`
with the page-image market-copy correction and then the reviewed three-line contrast
fix. All 26 checks passed with non-root/read-only containers, disabled intake, known-host
routing, localized metadata, policies and built assets. A dedicated bridge exposes host
ports only on loopback; it does not block outbound egress. Later cleanup improvements
were independently tested with mocked failed-create/start paths. A subsequent complete
helper retry hit host disk exhaustion during image build, so that retry is not a pass.

Only four proven task-created private cache records were removed to recover 274,292,736
bytes. Existing image/container/volume ID sets were preserved. New production packaging
and Middleware runtime readiness are separate required gates and must not inherit a
deployment success claim from these preview checks.

Review evidence: [intake](missions/reviews/R1-intake.md),
[marketing and staffing](missions/reviews/R2-marketing-staffing.md),
[browser](missions/reviews/R3-browser.md). Team expansion is explicit in
[page assignments](missions/page-team-assignments.json).

Real CRM persistence, lead matching, provider access, bookings, messaging, billing,
live measurement, policy completeness and backup restoration remain unverified.
All submission destinations remain disabled. Public website deployment is separately
authorized in [deployment authorization](missions/deployment-authorization.md).
Final checkpoint evidence must record guarded `codestra-local` SHA parity and actual
public DNS/TLS status; no local test alone establishes either.
