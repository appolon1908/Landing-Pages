# Page and section assignments

The current request assigns four combined writing/coding roles to each public page: two copy roles and two code roles. Each section draws one copy role and one code role from its page team. The corporate homepage and thirty customer/provider pairs form 61 teams, or 244 page-role assignments. Three reviewer roles and three tester roles bring the total to 250 logical assignments.

These are responsibilities executed in waves, not 250 simultaneously running agents or 250 independently authored implementations. The runtime permits the controller and three workers. Shared templates, validation and forms serve every page.

| Wave                           | Actual worker                                     | Work                                                                                                               |
| ------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Platform code                  | `bundle_inventory`                                | Manifest contracts, three-language routes and policies, 31 package scaffolds; committed and independently reviewed |
| Copy A                         | `remote_recovery`                                 | Both audiences and three languages for services 1–10                                                               |
| Copy B                         | `test_matrix`                                     | Both audiences and three languages for services 11–20                                                              |
| Copy C                         | controller                                        | Both audiences and three languages for services 21–30                                                              |
| Shared presentation code       | controller                                        | Customer/provider layouts, corporate homepage, navigation and content assembly                                     |
| CRM/form code                  | `remote_recovery`                                 | Separate customer/provider intake, market validation, consent and disabled CRM boundary                            |
| Review 1                       | `test_matrix`, then `bundle_inventory`            | Independent platform review; later intake/architecture review by a non-author                                      |
| Review 2: content/localization | `test_matrix`, controller, then `remote_recovery` | A/C content reviewed by `test_matrix`; B reviewed by controller; marketing sampled by non-authors                  |
| Review 3: UX/release           | `bundle_inventory`, then `test_matrix`            | Controller-authored layout/home review; intake UX review outside own authored scope; release evidence              |
| Test 1                         | controller / assigned worker                      | Unit, contract, registry and CRM failure cases at the integrated commit                                            |
| Test 2                         | `test_matrix`                                     | 183 localized routes, 99 pilot/home accessibility cases and both form flows                                        |
| Test 3                         | `bundle_inventory` / assigned worker              | Content/marketing, complete builds, bundle budgets and isolated container checks                                   |

The expanded 61 teams and 730 section pairs are in `page-team-assignments.json`. The role definitions in `inputs/team-role-definitions.json` preserve the historical five-page planning snapshot; its statement about the then-current implementation is not the current page inventory. These assignments reuse shared implementation and the actual workers above. All source and review evidence must identify its actual author and checked revision. Self-checks are never labeled independent reviews. Unfinished waves remain unfinished regardless of the number of planned assignments.

No production, provider, messaging, advertising, billing or scheduling action is authorized by these assignments. CRM remains the business authority. Delivery additionally requires the guarded `codestra-local` publication checkpoint and exact SHA parity.
