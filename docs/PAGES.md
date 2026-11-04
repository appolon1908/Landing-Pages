# Page and marketing inventory

Thirty service packages each expose customer (`landing`) and provider (`business`) routes in ES, EN and FR: 180 service pages. The home package adds three localized home routes, for 183 primary localized routes. Policies and receipt paths are additional surfaces and are not counted as accepted submissions. All configured sites remain preview with disabled destinations.

| Package             | Group           | Pilot | Customer route                        | Provider route                         |
| ------------------- | --------------- | ----- | ------------------------------------- | -------------------------------------- |
| hvac                | home            | yes   | /{locale}/landing/hvac                | /{locale}/business/hvac                |
| plumbing            | home            | yes   | /{locale}/landing/plumbing            | /{locale}/business/plumbing            |
| electrical          | home            | yes   | /{locale}/landing/electrical          | /{locale}/business/electrical          |
| roofing             | home            | no    | /{locale}/landing/roofing             | /{locale}/business/roofing             |
| home-cleaning       | home            | yes   | /{locale}/landing/home-cleaning       | /{locale}/business/home-cleaning       |
| commercial-cleaning | business        | no    | /{locale}/landing/commercial-cleaning | /{locale}/business/commercial-cleaning |
| pest-control        | home            | yes   | /{locale}/landing/pest-control        | /{locale}/business/pest-control        |
| landscaping         | home            | no    | /{locale}/landing/landscaping         | /{locale}/business/landscaping         |
| tree-service        | home            | no    | /{locale}/landing/tree-service        | /{locale}/business/tree-service        |
| painting            | home            | no    | /{locale}/landing/painting            | /{locale}/business/painting            |
| remodeling          | home            | no    | /{locale}/landing/remodeling          | /{locale}/business/remodeling          |
| flooring            | home            | no    | /{locale}/landing/flooring            | /{locale}/business/flooring            |
| windows-doors       | home            | no    | /{locale}/landing/windows-doors       | /{locale}/business/windows-doors       |
| pool-service        | home            | no    | /{locale}/landing/pool-service        | /{locale}/business/pool-service        |
| solar               | home            | no    | /{locale}/landing/solar               | /{locale}/business/solar               |
| backup-power        | home            | no    | /{locale}/landing/backup-power        | /{locale}/business/backup-power        |
| water-systems       | home            | no    | /{locale}/landing/water-systems       | /{locale}/business/water-systems       |
| appliance-repair    | home            | no    | /{locale}/landing/appliance-repair    | /{locale}/business/appliance-repair    |
| locksmith           | home            | no    | /{locale}/landing/locksmith           | /{locale}/business/locksmith           |
| security-systems    | home            | no    | /{locale}/landing/security-systems    | /{locale}/business/security-systems    |
| moving              | home            | no    | /{locale}/landing/moving              | /{locale}/business/moving              |
| junk-removal        | home            | no    | /{locale}/landing/junk-removal        | /{locale}/business/junk-removal        |
| pressure-washing    | home            | no    | /{locale}/landing/pressure-washing    | /{locale}/business/pressure-washing    |
| auto-repair         | vehicle         | no    | /{locale}/landing/auto-repair         | /{locale}/business/auto-repair         |
| auto-detailing      | vehicle         | no    | /{locale}/landing/auto-detailing      | /{locale}/business/auto-detailing      |
| towing              | vehicle         | no    | /{locale}/landing/towing              | /{locale}/business/towing              |
| catering            | events-learning | no    | /{locale}/landing/catering            | /{locale}/business/catering            |
| photography-video   | events-learning | no    | /{locale}/landing/photography-video   | /{locale}/business/photography-video   |
| tutoring            | events-learning | no    | /{locale}/landing/tutoring            | /{locale}/business/tutoring            |
| digital-marketing   | business        | no    | /{locale}/landing/digital-marketing   | /{locale}/business/digital-marketing   |

Home: `pages/home`, route `/{locale}/`. The root redirects to Spanish. The canonical service map is `docs/missions/inputs/service-content-map.json`; registry origins determine each package’s own URLs.

`npm run build` builds all 31 packages. `npm run budget:check` requires every `dist/index.html` and sums gzip bytes for every built JavaScript chunk per package, with a decimal 130 kB limit (130000 bytes). Missing output, no JavaScript or an excessive total fails. A focused CI matrix job uses `npm run budget:check -- <slug>` after that package build. Budgets do not certify runtime performance or replace browser testing.

Each service has eight inactive campaign plans, localized instant forms and WhatsApp starters, and four creative briefs:30 kits, 240 campaigns. Global drafts contain18 WhatsApp notifications and three eight-week organic calendars. `marketing:validate` rejects stale page snapshots and activation. `marketing:export` creates ignored planning artifacts, not certified account import files.
