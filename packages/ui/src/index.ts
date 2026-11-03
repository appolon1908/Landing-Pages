import { createApp } from "vue";
import type { Component } from "vue";
import type { PageManifest } from "@lp/core";
import LandingApp from "./LandingApp.vue";
import "./styles.css";
import "./blueprint.css";

export { default as LandingApp } from "./LandingApp.vue";
export { default as HomeApp } from "./HomeApp.vue";
export { default as CustomerLayout } from "./layouts/CustomerLayout.vue";
export { default as ProviderLayout } from "./layouts/ProviderLayout.vue";
export { default as DefaultLayout } from "./layouts/DefaultLayout.vue";
export { default as HeroSection } from "./components/HeroSection.vue";
export { default as StepsSection } from "./components/StepsSection.vue";
export { default as ServiceSelector } from "./components/ServiceSelector.vue";
export { default as IntakeForm } from "./components/IntakeForm.vue";
export { default as BusinessFooter } from "./components/BusinessFooter.vue";
export { default as PolicyPage } from "./components/PolicyPage.vue";
export { default as ConsentChoices } from "./components/ConsentChoices.vue";
export { usePage } from "./usePage.ts";
export type { PageController } from "./usePage.ts";
export { words, dictionaries } from "./i18n/words.ts";

/** Mount a landing page. Pages with a custom layout pass it as `layout`. */
export function mountLandingPage(
  manifest: PageManifest,
  options: { layout?: Component; selector?: string } = {},
) {
  const app = createApp(LandingApp, { manifest, layout: options.layout });
  app.mount(options.selector ?? "#app");
  return app;
}
