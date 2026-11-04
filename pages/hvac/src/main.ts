import { createApp, h } from "vue";
import type { Locale } from "@lp/core";
import { mountLandingPage } from "@lp/ui";
import { loadSiteContext } from "@lp/ui/siteContext.ts";
import { registerServiceHero } from "@lp/ui/brandAssets.ts";
import heroUrl from "../../../packages/ui/src/assets/services/01-hvac-air-conditioning.webp";
import manifest from "../page.config.ts";

registerServiceHero(manifest.slug, heroUrl);

async function boot(): Promise<void> {
  const flow = new URL(window.location.href).searchParams.get("breero-flow");
  if (flow !== "homeowner" && flow !== "pro") {
    mountLandingPage(manifest);
    return;
  }

  // Do not render BREERO-specific intake on any other company/site tenant.
  let site;
  try {
    site = await loadSiteContext();
  } catch {
    document.getElementById("app")!.textContent =
      "Landing preview unavailable.";
    return;
  }
  if (site.brand.name.trim().toLowerCase() !== "breero") {
    mountLandingPage(manifest);
    return;
  }

  const [form, privacy] = await Promise.all([
    flow === "homeowner"
      ? import("../../../packages/ui/src/components/BreeroHomeownerGHL.vue")
      : import("../../../packages/ui/src/components/BreeroProGHL.vue"),
    import("../../../packages/ui/src/components/MetaPixelConsent.vue"),
  ]);
  const locale = (window.location.pathname.match(/^\/(en|es|fr)\//)?.[1] ??
    "en") as Locale;
  const App = {
    render: () =>
      h("div", [
        h(form.default),
        h(privacy.default, {
          site,
          locale,
          pathname: window.location.pathname,
        }),
      ]),
  };
  createApp(App).mount("#app");
}

void boot();
