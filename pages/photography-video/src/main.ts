import { mountLandingPage } from "@lp/ui";
import { registerServiceHero } from "@lp/ui/brandAssets.ts";
import heroUrl from "../../../packages/ui/src/assets/services/28-photography-video.webp";
import manifest from "../page.config.ts";
registerServiceHero(manifest.slug, heroUrl);
mountLandingPage(manifest);
