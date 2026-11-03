<script setup lang="ts">
import type { Component } from "vue";
import { watch } from "vue";
import { policyPath, locales } from "@lp/core";
import type { PageManifest } from "@lp/core";
import BusinessFooter from "./components/BusinessFooter.vue";
import PolicyPage from "./components/PolicyPage.vue";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import { usePage } from "./usePage.ts";
import { logoUrl } from "@lp/ui/brandAssets.ts";
import { applyBrandContext } from "./brandContext.ts";

const props = defineProps<{
  manifest: PageManifest;
  /** Optional custom layout component; receives the page controller as `c`. */
  layout?: Component;
}>();
const c = usePage(props.manifest);
watch(c.site, (site) => {
  if (site) applyBrandContext(site.brand.name);
});
const Layout = props.layout ?? DefaultLayout;
</script>

<template>
  <a href="#main" class="skip-link">{{ c.t.value.skip }}</a>
  <main v-if="c.failure.value" id="main" class="loading">
    <h1>{{ c.t.value.unavailable }}</h1>
  </main>
  <main v-else-if="!c.site.value" id="main" class="loading" role="status">
    {{ c.t.value.loading }}
  </main>
  <div v-else>
    <div v-if="c.site.value.mode === 'preview'" class="preview-notice">
      {{ c.t.value.preview }}
    </div>
    <header class="site-header shell">
      <a
        class="brand"
        :href="`${c.site.value.publicOrigin}/${c.activeLocale.value}/`"
        ><img
          v-if="c.site.value.brand.name.trim().toLowerCase() === 'breero'"
          class="brand-logo"
          :src="logoUrl"
          alt="BREERO"
          width="2200"
          height="726"
        /><span v-else>{{ c.site.value.brand.name }}</span></a
      >
      <nav aria-label="Main">
        <a
          v-if="c.manifest.audiences.length > 1"
          :href="`/${c.activeLocale.value}/${c.provider.value ? 'landing' : 'business'}/${c.manifest.slug}`"
          @click.prevent="
            c.navigate(
              c.activeLocale.value,
              c.provider.value ? 'landing' : 'business',
            )
          "
          >{{ c.provider.value ? c.t.value.client : c.t.value.provider }}</a
        >
        <a
          v-for="locale in locales"
          :key="locale"
          class="language"
          :href="
            c.policy.value
              ? policyPath(locale, c.policy.value.document)
              : `/${locale}/${c.page.value.audience}/${c.manifest.slug}`
          "
          :lang="locale"
          :aria-current="locale === c.activeLocale.value ? 'page' : undefined"
          @click.prevent="c.switchLanguage(locale)"
          >{{ { es: "Español", en: "English", fr: "Français" }[locale] }}</a
        >
      </nav>
    </header>
    <main id="main">
      <PolicyPage
        v-if="c.policyDocument.value"
        :document="c.policyDocument.value"
        :locale="c.activeLocale.value"
      />
      <section v-else-if="c.page.value.thankYou" class="shell receipt-page">
        <h1>
          {{ c.receipt.value ? c.t.value.accepted : c.t.value.noReceipt }}
        </h1>
        <p v-if="c.receipt.value" class="small-print">
          {{ c.receipt.value.request_id }}
        </p>
        <p v-if="c.receipt.value">
          {{
            c.provider.value
              ? c.manifest.provider[c.activeLocale.value].confirmation
              : c.manifest.customer[c.activeLocale.value].confirmation
          }}
        </p>
        <a
          :href="`/${c.page.value.locale}/${c.page.value.audience}/${c.manifest.slug}`"
          @click.prevent="
            c.navigate(c.page.value.locale, c.page.value.audience)
          "
          >{{ c.t.value.back }}</a
        >
      </section>
      <component :is="Layout" v-else :c="c">
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps ?? {}" />
        </template>
      </component>
    </main>
    <BusinessFooter
      :site="c.site.value"
      :locale="c.activeLocale.value"
      @navigate="(name) => c.navigatePolicy(name)"
      ><p>{{ c.t.value.independent }}</p></BusinessFooter
    >
  </div>
</template>
