<script setup lang="ts">
import { computed } from "vue";
import IntakeForm from "../components/IntakeForm.vue";
import FrontDeskEntry from "../components/FrontDeskEntry.vue";
import ServiceSelector from "../components/ServiceSelector.vue";
import ServiceHero from "../components/ServiceHero.vue";
import type { PageController } from "../usePage.ts";
import { layoutCopy } from "./layoutCopy.ts";
const { c } = defineProps<{ c: PageController }>();
const copy = computed(() => c.manifest.provider[c.activeLocale.value]);
const t = computed(() => layoutCopy[c.activeLocale.value]);
const commercialText = (value: string) =>
  value
    .replace(/^\[OWNER:[^\]]+\]\s*/, "")
    .replace(/\[OWNER:[^\]]+\]/g, t.value.pending);
</script>

<template>
  <ServiceHero
    :slug="c.manifest.slug"
    :brand="c.site.value?.brand.name ?? ''"
    :eyebrow="`${copy.name} · ${c.t.value.provider}`"
    :headline="copy.headline"
    :subhead="copy.subhead"
    :cta="copy.cta"
  />
  <section class="shell hero-context">
    <div>
      <a class="quiet-link" href="#lead-terms">{{ t.matching }}</a>
      <p class="small-print">{{ t.context }}</p>
    </div>
    <aside class="service-preview">
      <h2>{{ t.opportunity }}</h2>
      <p>{{ copy.fit[0] }}</p>
    </aside>
  </section>
  <FrontDeskEntry
    :locale="c.activeLocale.value"
    audience="business"
    :service="c.manifest.slug"
  />
  <section class="shell content-section">
    <h2>{{ t.fit }}</h2>
    <ul>
      <li v-for="item in copy.fit" :key="item">{{ item }}</li>
    </ul>
  </section>
  <section id="example-lead" class="shell content-section tinted-section">
    <p class="eyebrow">{{ t.fictional }}</p>
    <h2>{{ copy.exampleLead.service }}</h2>
    <p>{{ t.fictionalNote }}</p>
    <dl class="lead-facts">
      <div>
        <dt>{{ t.location }}</dt>
        <dd>{{ copy.exampleLead.area }}</dd>
      </div>
      <div>
        <dt>{{ t.service }}</dt>
        <dd>{{ copy.exampleLead.service }}</dd>
      </div>
      <div>
        <dt>{{ t.urgency }}</dt>
        <dd>{{ copy.exampleLead.urgency }}</dd>
      </div>
    </dl>
    <p>{{ copy.exampleLead.scope }}</p>
  </section>
  <section id="qualification" class="shell content-section">
    <h2>{{ t.qualification }}</h2>
    <ul>
      <li v-for="item in copy.qualification" :key="item">{{ item }}</li>
    </ul>
    <p class="small-print">{{ t.qualificationNote }}</p>
  </section>
  <section id="lead-terms" class="shell content-section">
    <h2>{{ t.model }}</h2>
    <p>{{ copy.leadModel }}</p>
    <div class="two-columns">
      <div>
        <h3>{{ t.terms }}</h3>
        <ul>
          <li v-for="item in copy.commercialTerms" :key="item">
            {{ commercialText(item) }}
          </li>
        </ul>
      </div>
      <div>
        <h3>{{ t.controls }}</h3>
        <ul>
          <li v-for="item in copy.controls" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
  <section id="provider-workflow" class="shell content-section">
    <h2>{{ t.workflow }}</h2>
    <ol class="journey-list">
      <li v-for="step in copy.workflow" :key="step">{{ step }}</li>
    </ol>
  </section>
  <section class="shell content-section evidence-note">
    <h2>{{ t.providerProof }}</h2>
    <p>{{ t.providerProofDetail }}</p>
  </section>
  <section id="page-faq" class="shell content-section faq-section">
    <h2>{{ t.faq }}</h2>
    <details v-for="faq in copy.faq" :key="faq.q">
      <summary>{{ faq.q }}</summary>
      <p>{{ faq.a }}</p>
    </details>
  </section>
  <section class="shell content-section final-request">
    <h2>{{ t.apply }}</h2>
    <a class="button primary" href="#request"
      >{{ copy.cta }} <span aria-hidden="true">↗</span></a
    >
  </section>
  <IntakeForm :c="c" />
  <ServiceSelector v-if="c.manifest.features.serviceSelector" :c="c" />
  <div class="mobile-action">
    <a class="button primary" href="#request">{{ copy.cta }}</a>
  </div>
</template>
