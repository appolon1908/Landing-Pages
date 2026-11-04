<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { frontDeskDemoLink, parseFrontDeskConfig } from "@lp/core";
import type { FrontDeskConfig, FrontDeskContext } from "@lp/core";

const props = defineProps<FrontDeskContext>();
const config = ref<FrontDeskConfig | null>(null);
const loading = ref(true);
const abort = new AbortController();
const copy = {
  es: {
    title: "¿Cómo desea reservar?",
    intro:
      "Converse con BREERO o complete el formulario. Revise los detalles antes de confirmar.",
    boundary:
      "Calendario de vista previa. Las citas reales aún no están habilitadas.",
    voice: "Hablar con BREERO",
    form: "Formulario de reserva",
    note: "Se abre en una pestaña nueva. Interfaz en inglés.",
    loading: "Comprobando disponibilidad…",
    unavailable: "Las reservas aún no están conectadas.",
  },
  en: {
    title: "How would you like to book?",
    intro:
      "Talk to BREERO or fill in the form. Review your details before confirming.",
    boundary: "Preview calendar. Real appointments are not enabled yet.",
    voice: "Talk to BREERO",
    form: "Booking form",
    note: "Opens in a new tab. English interface.",
    loading: "Checking availability…",
    unavailable: "Booking is not connected yet.",
  },
  fr: {
    title: "Comment souhaitez-vous réserver ?",
    intro:
      "Parlez avec BREERO ou remplissez le formulaire. Vérifiez les détails avant de confirmer.",
    boundary:
      "Aperçu du calendrier. Les rendez-vous réels ne sont pas encore activés.",
    voice: "Parler avec BREERO",
    form: "Formulaire de réservation",
    note: "S’ouvre dans un nouvel onglet. Interface en anglais.",
    loading: "Vérification de la disponibilité…",
    unavailable: "La réservation n’est pas encore connectée.",
  },
};
const t = computed(() => copy[props.locale]);
const voiceLink = computed(() =>
  config.value ? frontDeskDemoLink(config.value, props, "voice") : null,
);
const formLink = computed(() =>
  config.value ? frontDeskDemoLink(config.value, props, "form") : null,
);
onMounted(async () => {
  try {
    const response = await fetch("/api/front-desk", {
      credentials: "omit",
      redirect: "error",
      signal: AbortSignal.any([abort.signal, AbortSignal.timeout(10000)]),
    });
    if (response.ok) config.value = parseFrontDeskConfig(await response.json());
  } catch {
    config.value = null;
  } finally {
    loading.value = false;
  }
});
onUnmounted(() => abort.abort());
</script>

<template>
  <section
    class="front-desk shell"
    aria-labelledby="front-desk-title"
    data-testid="front-desk-entry"
  >
    <div>
      <p class="eyebrow">BREERO</p>
      <h2 id="front-desk-title">{{ t.title }}</h2>
      <p>{{ t.intro }}</p>
      <p class="front-desk-boundary">{{ t.boundary }}</p>
    </div>
    <div class="front-desk-action">
      <template v-if="voiceLink && formLink">
        <div class="front-desk-choices">
          <a
            class="button primary"
            :href="voiceLink"
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby="front-desk-link-note"
            >{{ t.voice }} <span aria-hidden="true">↗</span></a
          >
          <a
            class="button secondary"
            :href="formLink"
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby="front-desk-link-note"
            >{{ t.form }} <span aria-hidden="true">↗</span></a
          >
        </div>
        <p id="front-desk-link-note">{{ t.note }}</p>
      </template>
      <p v-else class="front-desk-pending" aria-live="polite">
        {{ loading ? t.loading : t.unavailable }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.front-desk {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(240px, 1fr);
  gap: 40px;
  padding: 32px;
  margin-top: 24px;
  margin-bottom: 48px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--soft-gray);
}
.front-desk h2 {
  font-size: 1.8rem;
}
.front-desk .eyebrow {
  margin-bottom: 12px;
}
.front-desk-boundary,
.front-desk-action p {
  font-size: 0.87rem;
  color: var(--body);
}
.front-desk-action {
  align-self: center;
}
.front-desk-choices {
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
}
.front-desk-choices a {
  min-height: 48px;
  text-align: center;
  justify-content: center;
}
.front-desk p:last-child {
  margin-bottom: 0;
}
.front-desk-pending {
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
}
@media (max-width: 760px) {
  .front-desk {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }
}
</style>
