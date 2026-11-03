import { mountLandingPage } from "@lp/ui";
import { registerServiceHero } from "@lp/ui/brandAssets.ts";
import heroUrl from "../../../packages/ui/src/assets/services/02-plumbing.webp";
import manifest from "../page.config.ts";
registerServiceHero(manifest.slug, heroUrl);
mountLandingPage(manifest);
