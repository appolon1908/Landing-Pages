# Reviewer 3: independent A/C content review

Reviewed 2026-11-03 by `/root/test_matrix`. Batch A was authored by `/root/remote_recovery` (confirmed by its author); batch C was authored by `/root`. This review is independent of those authors. Batch B was authored by this reviewer and is expressly excluded from independent certification. Copy drafting, copy QA, assembly and validation are logical roles; they do not imply four independent people per page.

## Scope and evidence

Read all content for all ten A services and all ten C services in Spanish, English and French, both audiences. Shared repeated passages were reviewed once, then service-specific differences for every page. This exceeds the requested five full A pilots plus five samples. Checked service suitability, conditional fields, price factors, exclusions, consent wording, fictional examples, calls to action, FAQ meaning, commercial uncertainty and receipt language against blueprint.md and prior-mission.md section 5.1.

- A SHA256: `f70e4d3fbfd230f0abab712aee0ef1a69727370b6a37a0f3c0264a567e153c77`.
- C SHA256: `8357ba32c3ba29ba628da5f64e31f64e1c225c8a9d12cf0a35476a3a062139dc`.
- Actual platform `definePage`, imported from `work/breero-platform-v2/packages/core/src/pages/manifest.ts`, accepted all 20 manifests. A has six FAQs per audience/locale; C has seven. Both satisfy the five-to-eight requirement.
- C proposed correction overlay was validated in memory using that same validator: ten pages, thirty provider locales, fifty replaced fields, PASS. Source JSON files were not modified.
- Commands: Node 22 `reviewer3-inspect.mjs a contract` and `reviewer3-inspect.mjs c contract`, plus an in-memory merge of `reviewer3-c-corrections.json` followed by `definePage` for every C page.

No release-blocking claim or schema defect was found in these content batches. All owner commercial terms remain pending; there are no published prices, fabricated testimonials, unsupported verified badges or response-time guarantees. The content is suitable for the disabled preview, not evidence of operating readiness.

## Proposed copy corrections

Root accepted these corrections for integration. Apply `reviewer3-c-corrections.json` by matching slug, then replacing only the supplied complete provider fields for each locale. It covers all ten C services and all three locales.

1. C `$.pages[*].provider.es.fit[2]`: replace “Acuerde las condiciones antes de recibir solicitudes de pago” with “Acepte las condiciones antes de recibir oportunidades con cargo”. The former suggests receiving payment demands rather than billable opportunities.
2. C `$.pages[*].provider.fr.workflow[1]`: replace “Effectuez l’examen et les vérifications nécessaires.” with “Complétez les vérifications requises pour l’examen de votre candidature.” This assigns applicants the verification steps rather than review of their own application.
3. C `$.pages[*].provider.{es,en,fr}.exampleLead.scope`: replace generic category fragments with concrete, explicitly fictional job scopes. The JSON contains all thirty complete example objects and preserves their area/service/urgency. Examples introduce no real contacts, fees, availability or dispatch guarantees.
4. A `$.pages[*].provider.fr.faq[3].q`: replace “Quand suis-je facturé et si la demande ne respecte pas les critères ?” with “Quand suis-je facturé et que faire si la demande ne respecte pas les critères ?”. This is a grammar/readability correction, not a schema failure.

## Conditional-field and lifecycle findings

A HVAC has the equipment-type question; remaining A extra-field lists can be empty under the schema. C catering collects event date and guest count; towing collects vehicle type and safe pickup location; tutoring collects subject and preferred schedule and directs minor enquiries through a parent/guardian. Moving, automotive, photography and other C fields are pertinent to routing or scope. No unsafe verification-document collection was introduced into the copy.

Receipt confirmations mean received/pending review, not booking or provider activation. Shared preview UI must say nothing was sent and must not render manifest receipt confirmation. Existing `usePage` preview guard returns before submission and receipt assignment requires a validated response. Direct thank-you routes have no receipt. Browser verification remains assigned to T2 after integration.

## Shared-layout coverage and integration boundary

Read the new CustomerLayout.vue, ProviderLayout.vue and layoutCopy.ts in the integration worktree. They represent the required attributes below. This is a source review, not a claim that all are rendered in the current application.

| Customer attribute | Shared implementation |
|---|---|
| 1. Header/brand/area/support | Shared shell plus hero area and contact-policy link |
| 2. Problem/location headline | Localized manifest headline |
| 3. Specific benefit | Localized subhead |
| 4. Primary CTA | Manifest CTA to request form; staffed WhatsApp remains unavailable |
| 5. Short first form step | IntakeForm, with flow verification pending integration |
| 6. Trust near CTA | Honest preview/company context; no invented verification |
| 7. Scope/exclusions/next action | Included/excluded lists and steps; visit-cost note |
| 8. Three-step process | Manifest steps rendered as ordered list |
| 9. Pricing expectations | Price factors and request-versus-visit-cost explanation |
| 10. Proof | Honest absence-of-evidence message |
| 11. FAQ | Localized expandable FAQ |
| 12. Final CTA/privacy/mobile controls | Final request section, privacy text, mobile action |

| Provider attribute | Shared implementation |
|---|---|
| 1. Service/territory headline | Localized manifest headline |
| 2. Opportunity | Subhead plus suitability preview |
| 3. Apply/matching CTA | Request link plus lead-terms anchor |
| 4. Suitability | Full fit list |
| 5. Fictional example | Explicit example label and area/service/urgency/scope |
| 6. Qualification | Criteria plus warning against unverified qualification claims |
| 7. Lead model | Localized leadModel |
| 8. Commercial terms | Pending terms and controls; owner markers displayed as pending |
| 9. Workflow | Ordered localized workflow |
| 10. Provider proof | Honest process statement while evidence is unavailable |
| 11. FAQ | Localized expandable FAQ |
| 12. Final application/terms | Final CTA, IntakeForm consent links and shared footer |

At observed integration HEAD `582f2d78d4d2425fd9ff9c0068aeaff8ba46f533` plus root's in-progress files, LandingApp/DefaultLayout still used the legacy layout and two-language switch. Connecting these new layouts and French navigation was ongoing root integration work. Manifest confirmation was not yet consumed; render the audience-specific confirmation only inside the validated-receipt branch. These are explicit follow-up checks, not completed browser evidence. Mobile focus/overlap, no-JS policies, full route inventory and both form flows require T2 tests against the integrated candidate.

## Handoff

- Artifacts: original task folder `work/content-planning`; product sources reviewed read-only in `C:\Users\Usuario\.codex\worktrees\breero-launch-recovery\Landing-Pages`.
- Branch: `atomic/breero-launch-recovery-20261103`; observed HEAD above, not a final release SHA.
- codestra-local SHA: unavailable; remote not configured in the reviewed worktree. `LOCAL_REMOTE_SYNC=FAIL` (no publication claim for scratch review artifacts).
- GitHub: no PR/mirror operation performed by this reviewer. Linear issue and Notion mission/page: not supplied to this role.
- Blockers: none for applying these content batches to disabled preview. Owner facts/commercial terms and final integrated checks remain outstanding release dependencies.
- Next exact action: root applies the provided C overlay and A French question correction, connects shared layouts, then T2 runs the integrated route/accessibility/form checks. Independent B review must be done by another author.
