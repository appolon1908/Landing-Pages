<script setup lang="ts">
import { computed } from "vue";
import type { PageController } from "../usePage.ts";
const props = defineProps<{ c: PageController }>();
const c = props.c;
const steps = computed(() => {
  const w = c.t.value;
  return c.provider.value
    ? [
        [w.provider1, w.providerDetail1],
        [w.provider2, w.providerDetail2],
        [w.provider3, w.providerDetail3],
      ]
    : [
        [w.step1, w.detail1],
        [w.step2, w.detail2],
        [w.step3, w.detail3],
      ];
});
</script>

<template>
  <section class="steps shell">
    <p class="eyebrow">{{ c.t.value.how }}</p>
    <h2>{{ c.t.value.next }}</h2>
    <div class="step-grid">
      <article v-for="(step, index) in steps" :key="index">
        <span class="step-number">0{{ index + 1 }}</span>
        <h3>{{ step[0] }}</h3>
        <p>{{ step[1] }}</p>
      </article>
    </div>
  </section>
</template>
