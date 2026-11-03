<script setup lang="ts">
import type { PolicyDocument } from "../../../packages/compliance/pages.ts";
import type { Locale } from "../../../packages/industry-templates/catalog.ts";
defineProps<{ document: PolicyDocument; locale: Locale }>();
</script>

<template>
  <article class="shell policy-page">
    <p class="eyebrow">{{ document.businessName }}</p>
    <h1>{{ document.title }}</h1>
    <p class="small-print">
      {{ locale === "es" ? "Versión" : "Version" }} {{ document.version }} ·
      {{ document.updatedOn }}
    </p>
    <p v-if="document.draft" class="policy-draft">
      {{
        locale === "es"
          ? "Borrador de vista previa. Los datos del negocio y el texto de las políticas necesitan revisión antes de un registro o uso activo."
          : "Preview draft. Business details and policy wording require review before registration or live use."
      }}
    </p>
    <section
      v-for="section in document.sections"
      :key="section.key"
      class="policy-section"
    >
      <h2>{{ section.heading }}</h2>
      <p>{{ section.body }}</p>
    </section>
  </article>
</template>
