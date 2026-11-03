<script setup lang="ts">
import { computed } from "vue";
import type { SiteContext } from "../../../packages/contracts/site.ts";
import type { Locale } from "../../../packages/industry-templates/catalog.ts";
import type {
  ConsentIntent,
  SmsChoices,
} from "../../../packages/contracts/consent.ts";
import { profileForSite } from "../../../packages/compliance/preview.ts";
import { policyPath } from "../../../packages/compliance/pages.ts";
import type { DocumentName } from "../../../packages/compliance/pages.ts";
const props = defineProps<{
  site: SiteContext;
  locale: Locale;
  intent: ConsentIntent;
}>();
const emit = defineEmits<{
  change: [choices: SmsChoices];
  navigate: [document: DocumentName];
}>();
const profile = computed(() => profileForSite(props.site));
function choose(key: keyof SmsChoices, event: Event) {
  emit("change", {
    ...props.intent.choices,
    [key]: (event.target as HTMLInputElement).checked,
  });
}
</script>

<template>
  <div class="consent-choices full">
    <div
      v-if="profile.sms.offered"
      role="group"
      :aria-label="
        locale === 'es' ? 'Opciones SMS voluntarias' : 'Optional SMS choices'
      "
    >
      <p class="small-print">
        {{
          locale === "es"
            ? "Puedes enviar esta solicitud sin elegir mensajes SMS. Ambas opciones son voluntarias."
            : "You can send this request without choosing SMS. Both choices are optional."
        }}
      </p>
      <label v-if="profile.sms.transactional.offered" class="consent">
        <input
          name="transactionalSms"
          type="checkbox"
          :checked="intent.choices.transactionalSms"
          @change="choose('transactionalSms', $event)"
        />
        <span
          ><strong>{{
            locale === "es"
              ? "Actualizaciones de servicio por texto — opcional"
              : "Service updates by text — optional"
          }}</strong
          ><span class="consent-disclosure">{{
            intent.disclosures.transactionalSms
          }}</span></span
        >
      </label>
      <label v-if="profile.sms.marketing.offered" class="consent">
        <input
          name="marketingSms"
          type="checkbox"
          :checked="intent.choices.marketingSms"
          @change="choose('marketingSms', $event)"
        />
        <span
          ><strong>{{
            locale === "es"
              ? "Promociones por texto — opcional"
              : "Promotional texts — optional"
          }}</strong
          ><span class="consent-disclosure">{{
            intent.disclosures.marketingSms
          }}</span></span
        >
      </label>
    </div>
    <nav
      class="policy-links form-policy-links"
      :aria-label="
        locale === 'es' ? 'Políticas del formulario' : 'Form policies'
      "
    >
      <a
        :href="policyPath(locale, 'privacy-policy')"
        @click.prevent="emit('navigate', 'privacy-policy')"
        >{{ locale === "es" ? "Política de privacidad" : "Privacy Policy" }}</a
      >
      <a
        :href="policyPath(locale, 'terms')"
        @click.prevent="emit('navigate', 'terms')"
        >{{
          locale === "es" ? "Términos y programa SMS" : "Terms and SMS Program"
        }}</a
      >
    </nav>
  </div>
</template>
