<script setup lang="ts">
import type { PageController } from "../usePage.ts";
const props = defineProps<{ c: PageController }>();
const c = props.c;
</script>

<template>
  <section class="hero shell" :class="`page-${c.manifest.slug}`">
    <div class="hero-copy">
      <p class="eyebrow">
        {{ c.content.value.name }} <span aria-hidden="true">/</span>
        {{ c.provider.value ? c.t.value.provider : c.t.value.client }}
      </p>
      <h1>{{ c.content.value.title }}</h1>
      <p class="lede">{{ c.content.value.description }}</p>
      <a class="button primary" href="#request"
        >{{ c.t.value.explore }} <span aria-hidden="true">↗</span></a
      >
      <p class="small-print">{{ c.t.value.independent }}</p>
    </div>
    <aside class="project-card" :aria-label="c.t.value.prepare">
      <div class="card-top">
        <span class="pill">{{ c.content.value.name }}</span
        ><span aria-hidden="true">↗</span>
      </div>
      <slot name="art">
        <div class="house-art" aria-hidden="true">
          <div class="sun"></div>
          <div class="roof"></div>
          <div class="house">
            <div class="window"></div>
            <div class="door"></div>
          </div>
          <div class="ground"></div>
        </div>
      </slot>
      <h2>{{ c.t.value.prepare }}</h2>
      <ul>
        <li v-for="question in c.content.value.questions" :key="question">
          {{ question }}
        </li>
      </ul>
    </aside>
  </section>
</template>
