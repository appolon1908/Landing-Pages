<script setup lang="ts">
import { computed } from "vue";
import { policyPath, profileForSite } from "@lp/core";
import type {
  ConsentIntent,
  DocumentName,
  Locale,
  SiteContext,
  SmsChoices,
} from "@lp/core";
import { intakeWords } from "../intakeWords.ts";
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
const i = computed(() => intakeWords(props.locale));
function choose(key: keyof SmsChoices, event: Event) {
  emit("change", {
    ...props.intent.choices,
    [key]: (event.target as HTMLInputElement).checked,
  });
}
</script>

<template>
  <div class="consent-choices full">
    <div v-if="profile.sms.offered" role="group" :aria-label="i.smsGroup">
      <p class="small-print">
        {{ i.smsOptional }}
      </p>
      <label v-if="profile.sms.transactional.offered" class="consent">
        <input
          name="transactionalSms"
          type="checkbox"
          :checked="intent.choices.transactionalSms"
          @change="choose('transactionalSms', $event)"
        />
        <span
          ><strong>{{ i.transactionalSms }}</strong
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
          ><strong>{{ i.marketingSms }}</strong
          ><span class="consent-disclosure">{{
            intent.disclosures.marketingSms
          }}</span></span
        >
      </label>
    </div>
    <nav class="policy-links form-policy-links" :aria-label="i.policies">
      <a
        :href="policyPath(locale, 'privacy-policy')"
        @click.prevent="emit('navigate', 'privacy-policy')"
        >{{ i.privacy }}</a
      >
      <a
        :href="policyPath(locale, 'terms')"
        @click.prevent="emit('navigate', 'terms')"
        >{{ i.terms }}</a
      >
    </nav>
  </div>
</template>
