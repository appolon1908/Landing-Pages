# BREERO image integration

The user supplied `BREERO-Images-Bundle.zip` and requested an image parent branch,
a working sub-branch, publication, a pull request and merge after completion.
The parent is `subsection/public--images`; the working branch is
`atomic/breero-image-assets-20261103`. The parent starts from the already verified
GitHub foundation at `d6f7678d651729d546c8f507decb6dd6de8d5f3e`. The working branch
combines that foundation's publication tooling with the reviewed launch recovery at
`ee08bbf53c5698d606235e8eb6a50651118f2358`. The original recovery branch is preserved.
The resulting PR therefore includes the recovered page implementation and images.

Use the thirty supplied WebP service illustrations, the transparent navy-wordmark
logo and favicon files. Keep the original PNG masters outside the website bundle.
Each service imports only its own hero. These supplied images illustrate services;
they are not presented as verified local providers, completed projects or testimonials.

Apply the supplied navy, orange and cooling-blue palette. The main action uses
orange with navy lettering. Headers are white. Desktop hero text must remain
readable and avoid the wordmark embedded in each image; mobile copy and actions
appear above the photograph. HVAC customer copy follows the supplied heating and
cooling brief in English, Spanish and French. Other service/audience content remains
specific to its original offer. Marketing snapshots must agree with changed copy.

Implementation is split between asset/build integration and shared UI layout work,
with independent review of both and the branch/check contract. Verification includes
asset hashes and mapping, per-page build isolation, all application checks, every
page build, browser/accessibility tests and representative container delivery.

Publish clean, reviewed commits through the guarded `codestra-local` publisher and
record exact SHA parity before GitHub mirroring. Open the requested image PR; merge
only when current GitHub checks and independent review requirements are satisfied.
Do not modify remote rules or bypass approval/signature requirements.

The preserved upstream `.github/workflows/images.yml` still describes the former
single-renderer Dockerfile. It does not run on these image branches, but must be
migrated in a separately reviewed change before any environment-branch promotion.
The current multi-page release uses `deploy/breero`, with its own local validation.

The separate authorization to deploy the public site on Middleware remains valid.
The site remains preview/noindex with intake disabled until its CRM and operational
requirements are verified. Asset publication does not activate payments, messages,
ads, provider accounts or CRM submissions.
