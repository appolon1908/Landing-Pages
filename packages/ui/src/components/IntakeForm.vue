<script setup lang="ts">
import { computed, h } from "vue";
import { requestContactText, promotionsText } from "@lp/core";
import ConsentChoices from "./ConsentChoices.vue";
import type { PageController } from "../usePage.ts";
const props = defineProps<{ c: PageController }>();
const c = props.c;
const copy = computed(() => c.manifest.customer[c.page.value.locale]);
const i = computed(() => c.intake.value);
const errorId = (name: string) =>
  `intake-error-${name.replace(/[^a-z0-9-]/gi, "-")}`;
const invalid = (name: string) => ({
  "aria-invalid": c.errors.value[name] ? ("true" as const) : undefined,
  "aria-describedby": c.errors.value[name] ? errorId(name) : undefined,
});
const FieldError = (props: { name: string }) => {
  const error = c.errors.value[props.name];
  return error
    ? h(
        "span",
        { id: errorId(props.name), class: "intake-field-error" },
        i.value.errors[error],
      )
    : null;
};
const languageLabels = { es: "Español", en: "English", fr: "Français" };
</script>

<template>
  <section id="request" class="request-section">
    <div class="shell request-grid">
      <div class="request-intro">
        <p class="eyebrow">
          {{ c.provider.value ? c.t.value.provider : c.t.value.client }}
        </p>
        <h2>{{ c.provider.value ? i.providerTitle : i.customerTitle }}</h2>
        <p>{{ c.site.value?.submissionsEnabled ? i.live : i.preview }}</p>
        <p>{{ i.coverage }}</p>
        <slot name="intro" />
      </div>
      <form novalidate @submit.prevent="c.submit">
        <p class="intake-progress" aria-live="polite">
          {{
            c.provider.value
              ? c.step.value === 1
                ? i.providerStepOne
                : i.providerStepTwo
              : c.step.value === 1
                ? i.stepOne
                : i.stepTwo
          }}
        </p>
        <div
          v-if="Object.keys(c.errors.value).length"
          role="alert"
          class="intake-error-summary"
        >
          {{ i.errorSummary }}
          <p v-if="c.errors.value.market">{{ i.errors.market }}</p>
        </div>
        <fieldset :disabled="c.state.value === 'pending'">
          <legend class="sr-only">
            {{ c.provider.value ? i.providerTitle : i.customerTitle }}
          </legend>
          <template v-if="c.step.value === 1 && !c.provider.value">
            <label
              >{{ i.subtype
              }}<select
                v-model="c.fields.subtype"
                name="subtype"
                required
                v-bind="invalid('subtype')"
              >
                <option value="">{{ i.choose }}</option>
                <option
                  v-for="item in copy.subtypes"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option></select
              ><FieldError name="subtype"
            /></label>
            <label
              >{{ i.zone
              }}<select
                v-model="c.fields.zone"
                name="zone"
                required
                v-bind="invalid('zone')"
              >
                <option value="">{{ i.choose }}</option>
                <option
                  v-for="zone in c.market.value?.zones"
                  :key="zone.value"
                  :value="zone.value"
                >
                  {{ zone.label[c.page.value.locale] }}
                </option></select
              ><FieldError name="zone"
            /></label>
            <label
              >{{ i.urgency
              }}<select
                v-model="c.fields.urgency"
                name="urgency"
                required
                v-bind="invalid('urgency')"
              >
                <option value="">{{ i.choose }}</option>
                <option
                  v-for="item in copy.urgency"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option></select
              ><FieldError name="urgency"
            /></label>
            <label
              v-for="field in copy.extraFields"
              :key="field.key"
              :for="`intake-extra-${field.key}`"
              >{{ field.label }}
              <span v-if="!field.required">({{ i.optional }})</span>
              <select
                v-if="field.type === 'select'"
                :id="`intake-extra-${field.key}`"
                v-model="c.fields.extraFields[field.key]"
                :name="`extra:${field.key}`"
                :required="field.required"
                v-bind="invalid(`extra:${field.key}`)"
              >
                <option value="">{{ i.choose }}</option>
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <input
                v-else
                :id="`intake-extra-${field.key}`"
                v-model="c.fields.extraFields[field.key]"
                :name="`extra:${field.key}`"
                :type="field.type === 'number' ? 'text' : field.type"
                :inputmode="field.type === 'number' ? 'decimal' : undefined"
                :required="field.required"
                maxlength="300"
                v-bind="invalid(`extra:${field.key}`)"
              />
              <FieldError :name="`extra:${field.key}`" />
            </label>
          </template>

          <template v-if="c.step.value === 1 && c.provider.value">
            <label class="full"
              >{{ i.businessName
              }}<input
                v-model="c.fields.businessName"
                name="businessName"
                autocomplete="organization"
                required
                minlength="2"
                maxlength="200"
                v-bind="invalid('businessName')" /><FieldError
                name="businessName"
            /></label>
            <p class="full">{{ i.service }}: {{ copy.name }}</p>
          </template>

          <template
            v-if="
              (c.step.value === 2 && !c.provider.value) ||
              (c.step.value === 1 && c.provider.value)
            "
          >
            <label
              >{{ i.name
              }}<input
                v-model="c.fields.name"
                name="name"
                autocomplete="name"
                required
                minlength="2"
                maxlength="160"
                v-bind="invalid('name')" /><FieldError name="name"
            /></label>
            <label
              >{{ i.phone
              }}<input
                v-model="c.fields.phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                required
                maxlength="40"
                v-bind="invalid('phone')" /><FieldError name="phone"
            /></label>
            <label v-if="!c.provider.value"
              >{{ i.contactPreference
              }}<select
                v-model="c.fields.contactPreference"
                name="contactPreference"
                required
                v-bind="invalid('contactPreference')"
              >
                <option value="whatsapp">{{ i.whatsapp }}</option>
                <option value="call">{{ i.call }}</option>
                <option value="email">{{ i.emailContact }}</option></select
              ><FieldError name="contactPreference"
            /></label>
            <label
              >{{ i.email }}
              <span
                v-if="
                  !c.provider.value && c.fields.contactPreference !== 'email'
                "
                >({{ i.optional }})</span
              ><input
                v-model="c.fields.email"
                name="email"
                type="email"
                autocomplete="email"
                :required="
                  c.provider.value || c.fields.contactPreference === 'email'
                "
                maxlength="254"
                v-bind="invalid('email')" /><FieldError name="email"
            /></label>
          </template>

          <template v-if="c.step.value === 1 && c.provider.value">
            <fieldset
              class="full intake-choice-group"
              v-bind="invalid('zones')"
            >
              <legend>{{ i.zones }}</legend>
              <label
                v-for="zone in c.market.value?.zones"
                :key="zone.value"
                class="consent"
                ><input
                  v-model="c.fields.zones"
                  name="zones"
                  type="checkbox"
                  :value="zone.value"
                  v-bind="invalid('zones')"
                /><span>{{ zone.label[c.page.value.locale] }}</span></label
              ><FieldError name="zones" />
            </fieldset>
            <label class="full"
              >{{ i.operatingHours
              }}<input
                v-model="c.fields.operatingHours"
                name="operatingHours"
                required
                maxlength="300"
                v-bind="invalid('operatingHours')" /><FieldError
                name="operatingHours"
            /></label>
          </template>

          <template v-if="c.step.value === 2 && c.provider.value">
            <fieldset
              class="full intake-choice-group"
              v-bind="invalid('supportedSubtypes')"
            >
              <legend>{{ i.supportedSubtypes }}</legend>
              <label
                v-for="item in copy.subtypes"
                :key="item.value"
                class="consent"
                ><input
                  v-model="c.fields.supportedSubtypes"
                  name="supportedSubtypes"
                  type="checkbox"
                  :value="item.value"
                  v-bind="invalid('supportedSubtypes')"
                /><span>{{ item.label }}</span></label
              ><FieldError name="supportedSubtypes" />
            </fieldset>
            <label
              >{{ i.capacity
              }}<input
                v-model="c.fields.capacity"
                name="capacity"
                type="text"
                inputmode="numeric"
                required
                maxlength="4"
                v-bind="invalid('capacity')" /><FieldError name="capacity"
            /></label>
            <fieldset
              class="full intake-choice-group"
              v-bind="invalid('languages')"
            >
              <legend>{{ i.languages }}</legend>
              <label
                v-for="(label, locale) in languageLabels"
                :key="locale"
                class="consent"
                ><input
                  v-model="c.fields.languages"
                  name="languages"
                  type="checkbox"
                  :value="locale"
                  v-bind="invalid('languages')"
                /><span>{{ label }}</span></label
              ><FieldError name="languages" />
            </fieldset>
            <label
              >{{ i.insurance
              }}<select
                v-model="c.fields.insurance"
                name="insurance"
                required
                v-bind="invalid('insurance')"
              >
                <option value="">{{ i.choose }}</option>
                <option value="yes">{{ i.yes }}</option>
                <option value="no">{{ i.no }}</option>
                <option value="na">{{ i.na }}</option></select
              ><FieldError name="insurance"
            /></label>
            <p class="full">{{ i.profileNote }}</p>
            <label
              >{{ i.serviceRadiusKm }} ({{ i.optional }})<input
                v-model="c.fields.serviceRadiusKm"
                name="serviceRadiusKm"
                type="text"
                inputmode="decimal"
                maxlength="12"
                v-bind="invalid('serviceRadiusKm')" /><FieldError
                name="serviceRadiusKm"
            /></label>
            <label
              v-for="key in [
                'jobSize',
                'credentials',
                'quoteProcess',
                'commercialPreferences',
              ] as const"
              :key="key"
              class="full"
              >{{ i[key] }} ({{ i.optional }})<textarea
                v-model="c.fields[key]"
                :name="key"
                rows="2"
                maxlength="500"
                v-bind="invalid(key)"
              ></textarea
              ><FieldError :name="key"
            /></label>
          </template>

          <template v-if="c.step.value === 2">
            <label v-if="!c.provider.value" class="full"
              >{{ i.description
              }}<textarea
                v-model="c.fields.description"
                name="description"
                rows="4"
                required
                minlength="5"
                maxlength="3000"
                v-bind="invalid('description')"
              ></textarea
              ><FieldError name="description"
            /></label>
            <p v-if="c.consentChanged.value" class="full" role="status">
              {{ i.consentChanged }}
            </p>
            <label v-if="c.site.value" class="consent full"
              ><input
                v-model="c.fields.consent"
                name="consent"
                type="checkbox"
                required
                v-bind="invalid('consent')"
              /><span>{{
                requestContactText(
                  c.site.value.brand.name,
                  c.page.value.locale,
                  c.page.value.audience,
                )
              }}</span></label
            ><FieldError name="consent" />
            <label v-if="c.site.value" class="consent full"
              ><input
                v-model="c.fields.promotions"
                name="promotions"
                type="checkbox"
                v-bind="invalid('promotions')"
              /><span>{{
                promotionsText(c.site.value.brand.name, c.page.value.locale)
              }}</span></label
            ><FieldError name="promotions" />
            <ConsentChoices
              v-if="c.consentSnapshot.value && c.site.value"
              :site="c.site.value"
              :locale="c.page.value.locale"
              :intent="c.consentSnapshot.value.intent"
              @change="c.chooseSms"
              @navigate="(name) => c.navigatePolicy(name)"
            />
            <button
              class="button secondary"
              type="button"
              data-intake-back
              @click="c.previousStep"
            >
              {{ i.back }}
            </button>
            <button class="button primary" type="submit" data-intake-submit>
              {{
                c.state.value === "pending"
                  ? i.pending
                  : c.site.value?.submissionsEnabled
                    ? i.submit
                    : i.previewSubmit
              }}
            </button>
          </template>
          <button
            v-else
            class="button primary full"
            type="button"
            data-intake-next
            @click="c.nextStep"
          >
            {{ i.next }}
          </button>
        </fieldset>
        <div
          class="form-status"
          data-intake-status
          role="status"
          aria-live="polite"
        >
          <p v-if="c.state.value === 'preview'">{{ i.previewDone }}</p>
          <p v-if="c.state.value === 'error'">{{ i.sendError }}</p>
          <p v-if="c.state.value === 'error' && c.failureReference.value">
            {{ i.reference }} {{ c.failureReference.value }}
          </p>
          <template v-if="c.state.value === 'accepted' && c.receipt.value">
            <p>
              {{
                c.provider.value
                  ? c.manifest.provider[c.page.value.locale].confirmation
                  : copy.confirmation
              }}
            </p>
            <p>{{ i.accepted }} {{ c.receipt.value.crm_receipt_id }}</p>
          </template>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.intake-field-error {
  display: block;
  color: #9f1239;
  font-size: 0.9rem;
  margin-top: 0.3rem;
}
.intake-error-summary {
  color: #9f1239;
  border: 1px solid currentColor;
  padding: 0.8rem;
  margin-bottom: 1rem;
}
.intake-choice-group {
  display: block;
  padding: 0.75rem;
  margin: 0;
  min-width: 0;
}
.intake-choice-group label {
  margin: 0.4rem 0;
}
.intake-progress {
  font-weight: 700;
}
input,
select,
textarea {
  max-width: 100%;
  box-sizing: border-box;
}
</style>
