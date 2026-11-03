<script setup lang="ts">
import type { PolicyDocument, Locale } from "@lp/core";
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
        locale === "fr"
          ? "Brouillon d’aperçu. Les informations de l’entreprise et le texte des politiques nécessitent une révision avant toute inscription ou mise en service."
          : locale === "es"
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
