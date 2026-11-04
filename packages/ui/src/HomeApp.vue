<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  getPolicyDocument,
  locales,
  pageHref,
  pageLabel,
  defaultLocale,
  policyPath,
  resolveHome,
  resolvePolicy,
} from "@lp/core";
import type {
  Audience,
  DocumentName,
  HomeManifest,
  PageGroup,
  SiteContext,
} from "@lp/core";
import BusinessFooter from "./components/BusinessFooter.vue";
import PolicyPage from "./components/PolicyPage.vue";
import MetaPixelConsent from "./components/MetaPixelConsent.vue";
import { homeCopy } from "./homeCopy.ts";
import { words } from "./i18n/words.ts";
import { logoUrl } from "@lp/ui/brandAssets.ts";
import { loadSiteContext } from "./siteContext.ts";
import { applyBrandContext } from "./brandContext.ts";
const props = defineProps<{
  manifest: HomeManifest;
  catalog: Record<string, PageGroup>;
}>();
const policy = resolvePolicy(location.pathname);
const locale =
  policy?.locale ?? resolveHome(location.pathname)?.locale ?? defaultLocale;
const t = homeCopy[locale];
const w = words(locale);
const site = ref<SiteContext | null>(null);
const failure = ref(false);
const audience = ref<Audience>("landing");
const group = ref<PageGroup | "">("");
const document = computed(() =>
  site.value && policy ? getPolicyDocument(site.value, policy) : null,
);
const services = computed(() =>
  (site.value?.pages ?? []).filter(
    (p) => !group.value || props.catalog[p.slug] === group.value,
  ),
);
const pathFor = (slug: string) =>
  site.value
    ? pageHref(site.value, { locale, audience: audience.value, slug })
    : "#";
const homePath = `/${locale}/`;
const currentPath = location.pathname;
const navigatePolicy = (name: DocumentName) =>
  location.assign(policyPath(locale, name));
onMounted(async () => {
  try {
    site.value = await loadSiteContext();
    applyBrandContext(site.value.brand.name);
    if (policy && !document.value) throw Error("Unavailable document");
  } catch {
    site.value = null;
    failure.value = true;
  }
});
</script>

<template>
  <a href="#main" class="skip-link">{{ w.skip }}</a>
  <main v-if="failure" id="main" class="loading">
    <h1>{{ w.unavailable }}</h1>
  </main>
  <main v-else-if="!site" id="main" class="loading" role="status">
    {{ w.loading }}
  </main>
  <div v-else>
    <div v-if="site.mode === 'preview'" class="preview-notice">
      {{ w.preview }}
    </div>
    <header class="shell site-header home-header">
      <a class="brand" :href="homePath"
        ><img
          v-if="site.brand.name.trim().toLowerCase() === 'breero'"
          class="brand-logo"
          :src="logoUrl"
          alt="BREERO"
          width="528"
          height="176"
        /><span v-else>{{ site.brand.name }}</span></a
      >
      <nav :aria-label="t.services">
        <a :href="`${homePath}#services`">{{ t.services }}</a
        ><a :href="`${homePath}#how-it-works`">{{ t.how }}</a
        ><a :href="`${homePath}#business-accounts`">{{ t.businesses }}</a
        ><a :href="policyPath(locale, 'about')">{{ t.about }}</a
        ><a :href="policyPath(locale, 'contact')">{{ t.help }}</a>
      </nav>
      <nav aria-label="Language / Idioma / Langue">
        <a
          v-for="lang in locales"
          :key="lang"
          class="language"
          :href="policy ? policyPath(lang, policy.document) : `/${lang}/`"
          :lang="lang"
          :aria-current="lang === locale ? 'page' : undefined"
          >{{ lang.toUpperCase() }}</a
        >
      </nav>
    </header>
    <main id="main">
      <PolicyPage v-if="document" :document="document" :locale="locale" />
      <template v-else>
        <section class="shell hero home-hero">
          <div>
            <p class="eyebrow">Santo Domingo · Breero</p>
            <h1>{{ t.title }}</h1>
            <p class="lede">{{ t.intro }}</p>
            <div class="hero-actions">
              <a
                class="button primary"
                href="#services"
                @click="audience = 'landing'"
                >{{ t.customer }} <span aria-hidden="true">↗</span></a
              ><a
                class="button"
                href="#services"
                @click="audience = 'business'"
                >{{ t.provider }}</a
              >
            </div>
            <p class="small-print">{{ t.access }}</p>
          </div>
          <aside class="service-preview">
            <span class="large-symbol" aria-hidden="true">↗</span>
            <h2>{{ t.services }}</h2>
            <ul class="plain-list">
              <li v-for="(label, key) in t.groups" :key="key">
                <a href="#services" @click="group = key">{{ label }}</a>
              </li>
            </ul>
          </aside>
        </section>
        <section id="services" class="shell content-section">
          <h2>{{ t.services }}</h2>
          <p>{{ t.coverage }}</p>
          <div class="finder-controls">
            <label
              >{{ t.group
              }}<select v-model="group">
                <option value="">{{ t.all }}</option>
                <option
                  v-for="(label, key) in t.groups"
                  :key="key"
                  :value="key"
                >
                  {{ label }}
                </option>
              </select></label
            ><label
              >{{ t.city
              }}<select>
                <option>Santo Domingo</option>
              </select></label
            >
          </div>
          <div class="audience-tabs">
            <button
              :aria-pressed="audience === 'landing'"
              @click="audience = 'landing'"
            >
              {{ t.customer }}</button
            ><button
              :aria-pressed="audience === 'business'"
              @click="audience = 'business'"
            >
              {{ t.provider }}
            </button>
          </div>
          <ul class="service-catalog">
            <li v-for="service in services" :key="service.slug">
              <a :href="pathFor(service.slug)"
                ><span>{{ pageLabel(service, locale) }}</span
                ><span aria-hidden="true">↗</span></a
              >
            </li>
          </ul>
        </section>
        <section id="how-it-works" class="shell content-section">
          <h2>{{ t.customerJourney }}</h2>
          <ol class="journey-list">
            <li v-for="step in t.customerSteps" :key="step">{{ step }}</li>
          </ol>
          <p>{{ t.responsibility }}</p>
        </section>
        <section id="providers" class="shell content-section">
          <h2>{{ t.providerJourney }}</h2>
          <ol class="journey-list">
            <li v-for="step in t.providerSteps" :key="step">{{ step }}</li>
          </ol>
        </section>
        <section class="shell content-section evidence-note">
          <h2>{{ t.trust }}</h2>
          <p>{{ t.trustBody }}</p>
        </section>
        <section class="shell content-section tinted-section">
          <h2>{{ t.season }}</h2>
          <p>{{ t.seasonBody }}</p>
        </section>
        <section id="business-accounts" class="shell content-section">
          <h2>{{ t.businessTitle }}</h2>
          <p>{{ t.businessBody }}</p>
          <button class="button" disabled aria-describedby="business-pending">
            {{ t.businessCta }}
          </button>
          <p id="business-pending" class="small-print">
            {{ t.businessPending }}
          </p>
        </section>
        <section class="shell content-section">
          <h2>{{ t.recruitTitle }}</h2>
          <p>{{ t.recruitBody }}</p>
          <a
            class="button primary"
            href="#services"
            @click="audience = 'business'"
            >{{ t.recruitCta }}</a
          >
        </section>
        <section class="shell content-section faq-section">
          <h2>{{ t.faq }}</h2>
          <details v-for="faq in t.questions" :key="faq.q">
            <summary>{{ faq.q }}</summary>
            <p>{{ faq.a }}</p>
          </details>
        </section>
      </template>
    </main>
    <BusinessFooter :site="site" :locale="locale" @navigate="navigatePolicy"
      ><p>{{ t.responsibility }}</p></BusinessFooter
    >
    <MetaPixelConsent :site="site" :locale="locale" :pathname="currentPath" />
  </div>
</template>
