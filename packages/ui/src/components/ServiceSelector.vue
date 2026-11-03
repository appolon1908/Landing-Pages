<script setup lang="ts">
import { pageLabel } from "@lp/core";
import type { PageController } from "../usePage.ts";
const props = defineProps<{ c: PageController }>();
const c = props.c;
function go(event: Event) {
  const slug = (event.target as HTMLSelectElement).value;
  if (slug !== c.manifest.slug) location.assign(c.hrefFor(slug));
}
</script>

<template>
  <section
    v-if="c.site.value && c.site.value.pages.length > 1"
    class="service-strip shell"
    :aria-label="c.t.value.services"
  >
    <label for="service-choice">{{ c.t.value.select }}</label
    ><select id="service-choice" :value="c.manifest.slug" @change="go">
      <option v-for="p in c.site.value.pages" :key="p.slug" :value="p.slug">
        {{
          p.slug === c.manifest.slug
            ? c.content.value.name
            : pageLabel(p, c.page.value.locale)
        }}
      </option>
    </select>
  </section>
</template>
