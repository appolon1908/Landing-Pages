<script setup lang="ts">
import { computed } from "vue";
import { serviceHeroUrl } from "@lp/ui/brandAssets.ts";
const props = defineProps<{
  slug: string;
  brand: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  cta: string;
}>();
const heroUrl = computed(() =>
  props.brand.trim().toLowerCase() === "breero"
    ? serviceHeroUrl(props.slug)
    : undefined,
);
</script>

<template>
  <section
    class="shell service-hero"
    :class="{ 'service-hero-no-image': !heroUrl }"
  >
    <div class="hero-copy">
      <div class="hero-message">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ headline }}</h1>
        <p class="lede">{{ subhead }}</p>
        <div class="hero-actions">
          <a class="button primary" href="#request"
            >{{ cta }} <span aria-hidden="true">↗</span></a
          >
          <slot name="secondary" />
        </div>
      </div>
    </div>
    <img
      v-if="heroUrl"
      class="service-hero-image"
      :src="heroUrl"
      alt=""
      width="1672"
      height="941"
      fetchpriority="high"
      decoding="async"
    />
  </section>
</template>
