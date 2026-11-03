<script setup lang="ts">
import CustomerLayout from "./CustomerLayout.vue";
import ProviderLayout from "./ProviderLayout.vue";
import type { PageController } from "../usePage.ts";
defineProps<{ c: PageController }>();
</script>

<template>
  <component :is="c.provider.value ? ProviderLayout : CustomerLayout" :c="c">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </component>
</template>
