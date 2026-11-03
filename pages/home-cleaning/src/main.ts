import { mountLandingPage } from "@lp/ui";
import { registerServiceHero } from "@lp/ui/brandAssets.ts";
import heroUrl from "../../../packages/ui/src/assets/services/05-home-cleaning.webp";
import manifest from "../page.config.ts";
registerServiceHero(manifest.slug, heroUrl);
mountLandingPage(manifest);
