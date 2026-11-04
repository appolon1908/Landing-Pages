# Browser and accessibility evidence

Tester `/root/test_matrix` ran the final suite at committed revision
`3300dbee6494e0690bb7427222b311708677ad61` on 2026-11-03.
Result: **348 passed in 7.4 minutes**, zero failures. The worktree was clean.

Coverage includes all 183 public localized routes with exact audience copy/metadata,
99 axe checks for the homepage and five pilot service pairs at three widths, conditional
matching fields, both staged forms, language/permission behavior, mobile keyboard/focus,
direct receipt URLs, routing boundaries and no-JavaScript policy pages. Guards fail on
browser writes, external requests, console errors or uncaught page errors.

Root independently reviewed test scope and assertions. `/root/bundle_inventory` supplied
a second source review. Pre-execution review corrected the pilot list to include pest-control,
strengthened exact-copy metadata assertions and applied request/error guards to no-JS contexts.

The first complete attempt found insufficient contrast on tinted provider-example labels.
The tester fixed the shared style to use the existing dark ink token; root reviewed the
three-line change at `0431a547c07b362be55fa2a4adc5db9668bf96d7`. All 18 focused affected
axe cases passed before the full rerun.

The next run passed 347 cases and found a test-induced fractional textarea clipping issue
after a resized viewport and nearest scrolling. Measured focus and hit-target were intact;
no sticky control covered the input. The test now centers the input instantly and retains
full containment, focus, hit-target and hidden-CTA assertions. All six mobile cases passed
twice, then the committed full 348-case run passed. No retry mask or assertion tolerance
was used to conceal a product defect.

Node 22.22.1; Chrome 156.0.8078.74; one browser worker. This automated evidence does not
claim manual screen-reader certification, native language approval or live CRM operation.

Worktree: `C:\Users\Usuario\Documents\Codex\2026-11-03\the-middleware-work-is-already-preserved-4\work\breero-e2e-t2`.
Branch: `atomic/breero-e2e-t2-20261103`. Publication belongs to the controller; no tester
push occurred. codestra-local SHA at this checkpoint unavailable; `LOCAL_REMOTE_SYNC=FAIL`.
GitHub mirror unchanged; Linear/Notion unassigned. Next: integrated deployment gates and
guarded publication to the newly configured Middleware destination.
