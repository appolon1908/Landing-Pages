<script setup lang="ts">
import { computed } from "vue";
import { policyPath } from "@lp/core";
import IntakeForm from "../components/IntakeForm.vue";
import FrontDeskEntry from "../components/FrontDeskEntry.vue";
import ServiceSelector from "../components/ServiceSelector.vue";
import ServiceHero from "../components/ServiceHero.vue";
import type { PageController } from "../usePage.ts";
import { layoutCopy } from "./layoutCopy.ts";
const { c } = defineProps<{ c: PageController }>();
const copy = computed(() => c.manifest.customer[c.activeLocale.value]);
const t = computed(() => layoutCopy[c.activeLocale.value]);
</script>

<template>
  <ServiceHero
    :slug="c.manifest.slug"
    :brand="c.site.value?.brand.name ?? ''"
    :eyebrow="`${copy.name} · ${t.area}`"
    :headline="copy.headline"
    :subhead="copy.subhead"
    :cta="copy.cta"
  >
    <template #secondary>
      <a
        v-if="c.manifest.audiences.includes('business')"
        class="button secondary"
        :href="`/${c.activeLocale.value}/business/${c.manifest.slug}`"
        @click.prevent="c.navigate(c.activeLocale.value, 'business')"
        >{{ t.joinProvider }}</a
      >
    </template>
  </ServiceHero>
  <section class="shell hero-context">
    <div>
      <p v-if="c.manifest.features.whatsappButton" class="small-print">
        {{ t.unavailable }}
      </p>
      <p class="small-print">{{ t.context }}</p>
      <a
        class="quiet-link"
        :href="policyPath(c.activeLocale.value, 'contact')"
        >{{ t.support }}</a
      >
    </div>
    <aside class="service-preview" :aria-label="t.prepare">
      <h2>{{ t.prepare }}</h2>
      <ul class="plain-list">
        <li v-for="subtype in copy.subtypes" :key="subtype.value">
          {{ subtype.label }}
        </li>
      </ul>
    </aside>
  </section>
  <FrontDeskEntry
    :locale="c.activeLocale.value"
    audience="landing"
    :service="c.manifest.slug"
  />
  <IntakeForm :c="c" />
  <section class="shell content-section evidence-note">
    <h2>{{ c.site.value?.brand.name }}</h2>
    <p>{{ t.context }}</p>
  </section>
  <section id="service-scope" class="shell content-section">
    <p class="eyebrow">{{ copy.name }}</p>
    <h2>{{ t.scope }}</h2>
    <div class="two-columns">
      <div>
        <h3>{{ t.included }}</h3>
        <ul>
          <li v-for="item in copy.included" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div>
        <h3>{{ t.excluded }}</h3>
        <ul>
          <li v-for="item in copy.excluded" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
  <section id="how-it-works" class="shell content-section">
    <h2>{{ t.how }}</h2>
    <ol class="journey-list">
      <li v-for="step in copy.steps" :key="step">{{ step }}</li>
    </ol>
  </section>
  <section id="pricing-factors" class="shell content-section tinted-section">
    <h2>{{ t.pricing }}</h2>
    <ul>
      <li v-for="factor in copy.priceFactors" :key="factor">{{ factor }}</li>
    </ul>
    <p>{{ t.pricingNote }}</p>
  </section>
  <section class="shell content-section evidence-note">
    <h2>{{ t.proof }}</h2>
    <p>{{ t.proofDetail }}</p>
  </section>
  <section id="page-faq" class="shell content-section faq-section">
    <h2>{{ t.faq }}</h2>
    <details v-for="faq in copy.faq" :key="faq.q">
      <summary>{{ faq.q }}</summary>
      <p>{{ faq.a }}</p>
    </details>
  </section>
  <section class="shell content-section final-request">
    <h2>{{ t.final }}</h2>
    <a class="button primary" href="#request"
      >{{ copy.cta }} <span aria-hidden="true">↗</span></a
    >
    <p class="small-print">{{ t.privacy }}</p>
  </section>
  <ServiceSelector v-if="c.manifest.features.serviceSelector" :c="c" />
  <div class="mobile-action">
    <a class="button primary" href="#request">{{ copy.cta }}</a>
  </div>
</template>
