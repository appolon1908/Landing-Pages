<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import type { Locale, SiteContext } from "@lp/core";
import {
  browserDeclinesTracking,
  pixelConfigured,
  readAdvertisingChoice,
  storeAdvertisingChoice,
  syncMetaPixel,
  PIXEL_CONSENT_PREFIX,
} from "../metaPixel.ts";

const props = defineProps<{
  site: SiteContext;
  locale: Locale;
  /** Reactive route identity; service navigation may use history.pushState. */
  pathname: string;
}>();

const consent = ref<"allow" | "deny" | null>(null);
const manage = ref(false);
const active = computed(
  () =>
    props.site.mode === "live" &&
    props.site.brand.name.trim().toLowerCase() === "breero" &&
    pixelConfigured(),
);
const blocked = computed(() => browserDeclinesTracking());
const display = computed(
  () => active.value && (consent.value === null || manage.value),
);

const labels = {
  en: {
    heading: "Advertising privacy",
    description:
      "May BREERO use Meta Pixel to measure visits from ads? This is optional and separate from service requests and SMS preferences.",
    accept: "Allow advertising measurement",
    reject: "Decline",
    manage: "Advertising cookie choices",
    blocked: "Your browser's privacy signal disables advertising tracking.",
    policy: "Privacy policy",
  },
  es: {
    heading: "Privacidad publicitaria",
    description:
      "¿Permites que BREERO use Meta Pixel para medir las visitas desde anuncios? Es opcional y no afecta solicitudes ni permisos de SMS.",
    accept: "Permitir medición de anuncios",
    reject: "Rechazar",
    manage: "Preferencias de cookies publicitarias",
    blocked:
      "La señal de privacidad de tu navegador desactiva el seguimiento publicitario.",
    policy: "Política de privacidad",
  },
  fr: {
    heading: "Confidentialité publicitaire",
    description:
      "Autorisez-vous BREERO à utiliser Meta Pixel pour mesurer les visites depuis les publicités ? Ce choix est facultatif et distinct des demandes et des SMS.",
    accept: "Autoriser la mesure publicitaire",
    reject: "Refuser",
    manage: "Préférences des cookies publicitaires",
    blocked:
      "Le signal de confidentialité de votre navigateur désactive le suivi publicitaire.",
    policy: "Politique de confidentialité",
  },
};
const t = computed(() => labels[props.locale]);

function sync() {
  syncMetaPixel(
    active.value && consent.value === "allow" && !blocked.value,
    props.pathname,
  );
}
function choose(value: "allow" | "deny") {
  consent.value = value;
  storeAdvertisingChoice(props.site.siteId, value);
  manage.value = false;
  sync();
}
function read() {
  consent.value = readAdvertisingChoice(props.site.siteId);
  sync();
}
function storageEvent(event: StorageEvent) {
  if (
    event.key === PIXEL_CONSENT_PREFIX + props.site.siteId ||
    event.key === null
  ) {
    read();
  }
}
onMounted(() => {
  read();
  window.addEventListener("storage", storageEvent);
});
onUnmounted(() => {
  window.removeEventListener("storage", storageEvent);
  // Mounted page changes should not leave a granted state running on exit.
  syncMetaPixel(false, props.pathname);
});
watch(
  () => [props.pathname, props.site.siteId, props.site.mode],
  () => {
    consent.value = readAdvertisingChoice(props.site.siteId);
    sync();
  },
);
</script>

<template>
  <div
    v-if="active"
    class="shell meta-ad-consent"
    data-testid="meta-ad-consent"
  >
    <button
      v-if="!display"
      type="button"
      class="text-button"
      @click="manage = true"
    >
      {{ t.manage }}
    </button>
    <section v-else class="meta-ad-consent__panel" :aria-label="t.heading">
      <h2>{{ t.heading }}</h2>
      <p>{{ blocked ? t.blocked : t.description }}</p>
      <p>
        <a :href="`/${locale}/privacy-policy`">{{ t.policy }}</a>
      </p>
      <div class="meta-ad-consent__actions">
        <button type="button" :disabled="blocked" @click="choose('allow')">
          {{ t.accept }}
        </button>
        <button type="button" @click="choose('deny')">{{ t.reject }}</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.meta-ad-consent {
  margin-block: 1rem 2rem;
  font-size: 0.91rem;
}
.meta-ad-consent__panel {
  max-width: 750px;
  padding: 1.25rem;
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  background: var(--paper);
}
.meta-ad-consent__panel h2 {
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
}
.meta-ad-consent__panel p {
  margin: 0.5rem 0;
}
.meta-ad-consent__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}
.meta-ad-consent__actions button {
  border: 1px solid var(--line);
  border-radius: 0.4rem;
  min-height: 44px;
  padding: 0.5rem 0.9rem;
  background: var(--paper);
  color: var(--body);
}
.meta-ad-consent__actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
