<script setup lang="ts">
import { computed } from "vue";
import type { SiteContext, Locale, DocumentName } from "@lp/core";
import { businessDetails, documentLinks } from "@lp/core";
const props = defineProps<{ site: SiteContext; locale: Locale }>();
const emit = defineEmits<{ navigate: [document: DocumentName] }>();
const details = computed(() => businessDetails(props.site, props.locale));
const links = computed(() => documentLinks(props.site, props.locale));
</script>

<template>
  <footer class="shell business-footer" data-testid="business-footer">
    <div class="business-identity">
      <strong>{{ site.brand.name }}</strong>
      <p>{{ details.legalLine }}</p>
      <p>{{ details.description }}</p>
      <address v-if="details.email || details.phone || details.address">
        <a v-if="details.email" :href="`mailto:${details.email}`">{{
          details.email
        }}</a>
        <a
          v-if="details.phone && details.phoneHref"
          :href="details.phoneHref"
          >{{ details.phone }}</a
        >
        <span v-if="details.address">{{ details.address }}</span>
      </address>
      <p v-if="details.program">
        {{
          locale === "fr"
            ? "Programme SMS :"
            : locale === "es"
              ? "Programa SMS:"
              : "SMS program:"
        }}
        {{ details.program }}
      </p>
    </div>
    <slot />
    <nav
      :aria-label="
        locale === 'fr'
          ? 'Informations et politiques de l’entreprise'
          : locale === 'es'
            ? 'Información y políticas'
            : 'Business information and policies'
      "
      class="policy-links"
    >
      <a
        v-for="link in links"
        :key="link.document"
        :href="link.href"
        @click.prevent="emit('navigate', link.document)"
        >{{ link.label }}</a
      >
    </nav>
    <p v-if="site.mode === 'preview'" class="small-print">
      {{
        locale === "fr"
          ? "Aperçu. Aucune demande ni aucun message ne sont envoyés et aucun abonnement n’est créé."
          : locale === "es"
            ? "Vista previa. No se envían solicitudes ni mensajes y no se crean suscripciones."
            : "Preview. Requests and messages are not sent, and subscriptions are not created."
      }}
    </p>
  </footer>
</template>
