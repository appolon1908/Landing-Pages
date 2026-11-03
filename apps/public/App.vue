<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import BusinessFooter from "./components/BusinessFooter.vue";
import PolicyPage from "./components/PolicyPage.vue";
import ConsentChoices from "./components/ConsentChoices.vue";
import {
  getPolicyDocument,
  pageMetadata,
  policyPath,
  resolvePolicy,
} from "../../packages/compliance/pages.ts";
import type {
  DocumentName,
  PolicyRoute,
} from "../../packages/compliance/pages.ts";
import { reconcileConsent } from "../../packages/contracts/consent.ts";
import type {
  ConsentContext,
  ConsentSnapshot,
  SmsChoices,
} from "../../packages/contracts/consent.ts";
import {
  parseSiteContext,
  resolvePage,
} from "../../packages/contracts/site.ts";
import type { PageRoute, SiteContext } from "../../packages/contracts/site.ts";
import { getTemplate } from "../../packages/industry-templates/catalog.ts";
import type {
  Audience,
  Locale,
  Offering,
} from "../../packages/industry-templates/catalog.ts";
import {
  buildSubmissionDraft,
  requestContactText,
  prepareAttempt,
  submitAttempt,
} from "../../packages/api-clients/submissions.ts";
import type {
  Attempt,
  Receipt,
} from "../../packages/api-clients/submissions.ts";

const site = ref<SiteContext | null>(null);
const failure = ref("");
const policy = ref<PolicyRoute | null>(resolvePolicy(location.pathname));
const landingPath = ref(
  resolvePage(location.pathname) ? location.pathname : "/",
);
const page = ref<PageRoute>(
  resolvePage(location.pathname) || {
    locale: "en",
    audience: "landing",
    offering: "hvac-heating",
    thankYou: false,
  },
);
const fields = reactive({
  name: "",
  email: "",
  phone: "",
  description: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  businessName: "",
  consent: false,
});
const state = ref<"ready" | "preview" | "pending" | "accepted" | "error">(
  "ready",
);
const receipt = ref<Receipt | null>(null);
const attempt = ref<Attempt | null>(null);
const activeLocale = computed(() => policy.value?.locale || page.value.locale);
const es = computed(() => activeLocale.value === "es");
const policyDocument = computed(() =>
  site.value && policy.value
    ? getPolicyDocument(site.value, policy.value)
    : null,
);
const consentSnapshot = ref<ConsentSnapshot | null>(null);
const consentContext = computed<ConsentContext | null>(() =>
  site.value
    ? {
        site: site.value,
        locale: page.value.locale,
        phone: fields.phone,
        sourcePath: page.value.thankYou
          ? `/${page.value.locale}/${page.value.audience}/${page.value.offering}`
          : landingPath.value,
      }
    : null,
);
watch(
  consentContext,
  (context) => {
    consentSnapshot.value = context
      ? reconcileConsent(consentSnapshot.value, context)
      : null;
  },
  { deep: true, immediate: true },
);
function chooseSms(choices: SmsChoices) {
  if (consentContext.value)
    consentSnapshot.value = reconcileConsent(
      consentSnapshot.value,
      consentContext.value,
      choices,
    );
}
const provider = computed(() => page.value.audience === "business");
const content = computed(() =>
  getTemplate(page.value.offering, page.value.audience, page.value.locale),
);
const words = computed(() =>
  es.value
    ? {
        preview: "Sitio de vista previa. Las solicitudes no se envían.",
        services: "Servicios",
        provider: "Para proveedores",
        client: "Para clientes",
        explore: "Explorar el formulario",
        how: "Cómo funciona",
        prepare: "Antes de empezar",
        next: "El siguiente paso, con claridad.",
        form: "Cuéntanos lo que necesitas",
        providerForm: "Presenta tu negocio",
        formDetail:
          "Esta vista previa conserva los datos solo mientras está abierta. No envía solicitudes ni activa pagos.",
        name: "Nombre completo",
        email: "Correo electrónico",
        phone: "Teléfono",
        description: "Detalles del proyecto",
        address: "Dirección",
        city: "Ciudad",
        region: "Estado de EE. UU.",
        postal: "Código postal",
        company: "Nombre del negocio",
        button: "Revisar solicitud",
        ready: "El formulario está listo para revisar. No se ha enviado nada.",
        accepted:
          "Solicitud recibida. La cita y el servicio aún no están confirmados.",
        pending: "Enviando solicitud…",
        error:
          "No se pudo confirmar la solicitud. Tus datos siguen en el formulario.",
        noReceipt: "No hay una solicitud confirmada para mostrar.",
        back: "Volver al formulario",
        privacy: "Privacidad de la vista previa",
        close: "Cerrar",
        independent:
          "Los proveedores independientes cotizan, contratan y facturan su trabajo por separado.",
        fee: "Antes de aceptar una presentación, debes ver las condiciones y cualquier tarifa aplicable. Esta vista previa no cobra ni inscribe a nadie.",
        step1: "Describe tu proyecto",
        step2: "Revisa las opciones",
        step3: "Decide con información",
        detail1: "Comparte el tipo de trabajo, tu ubicación y tus necesidades.",
        detail2: "La disponibilidad y la elegibilidad deben ser confirmadas.",
        detail3: "Revisa al proveedor y las condiciones antes de aceptar.",
        provider1: "Presenta tus servicios",
        provider2: "Define tu cobertura",
        provider3: "Revisa las condiciones",
        providerDetail1:
          "Indica tus especialidades y las credenciales requeridas.",
        providerDetail2: "Elige el área y la capacidad real de tu negocio.",
        providerDetail3: "El interés no garantiza clientes ni activa un plan.",
        disclosure:
          "No es un servicio de emergencia. Ante peligro inmediato, contacta a los servicios de emergencia locales.",
        select: "Selecciona un servicio",
        status: "Estado de la solicitud",
        optional:
          "No hay seguimiento publicitario ni suscripciones activas en esta vista previa.",
      }
    : {
        preview: "Preview site. Requests are not being sent.",
        services: "Services",
        provider: "For providers",
        client: "For customers",
        explore: "Explore the request form",
        how: "How it works",
        prepare: "Before you start",
        next: "A clear next step for your project.",
        form: "Tell us what you need",
        providerForm: "Introduce your business",
        formDetail:
          "This preview keeps your details only while it is open. It does not send requests or activate payments.",
        name: "Full name",
        email: "Email address",
        phone: "Phone number",
        description: "Project details",
        address: "Street address",
        city: "City",
        region: "U.S. state",
        postal: "ZIP code",
        company: "Business name",
        button: "Review request",
        ready: "Your form is ready to review. Nothing has been sent.",
        accepted:
          "Request received. An appointment and service are not yet confirmed.",
        pending: "Sending request…",
        error:
          "The request could not be confirmed. Your details remain in the form.",
        noReceipt: "There is no confirmed request to show.",
        back: "Back to the request form",
        privacy: "Preview privacy",
        close: "Close",
        independent:
          "Independent providers quote, contract and bill for their work separately.",
        fee: "Before accepting an introduction, you must see the terms and any applicable platform fee. This preview does not charge or enroll anyone.",
        step1: "Describe your project",
        step2: "Review the options",
        step3: "Make an informed choice",
        detail1: "Share the work, your location and what you need.",
        detail2: "Availability and provider eligibility must be confirmed.",
        detail3: "Review the provider and terms before accepting.",
        provider1: "Introduce your services",
        provider2: "Define your coverage",
        provider3: "Review the terms",
        providerDetail1:
          "Describe your specialties and required qualifications.",
        providerDetail2:
          "Share your service area and actual business capacity.",
        providerDetail3:
          "Interest does not guarantee leads or activate a plan.",
        disclosure:
          "This is not an emergency service. For immediate danger, contact local emergency services.",
        select: "Choose a service",
        status: "Request status",
        optional:
          "Advertising tracking and subscriptions are inactive in this preview.",
      },
);

function homepage(context: SiteContext): PageRoute {
  return {
    locale: "en",
    audience: "landing",
    offering: context.offerings[0],
    thankYou: false,
  };
}
function navigate(locale: Locale, audience: Audience, offering: Offering) {
  policy.value = null;
  page.value = { locale, audience, offering, thankYou: false };
  landingPath.value = `/${locale}/${audience}/${offering}`;
  state.value = "ready";
  receipt.value = null;
  history.pushState(null, "", landingPath.value);
  updateMetadata();
}
function navigatePolicy(
  document: DocumentName,
  locale: Locale = activeLocale.value,
) {
  if (!site.value || !getPolicyDocument(site.value, { locale, document }))
    return;
  if (locale !== activeLocale.value)
    chooseSms({ transactionalSms: false, marketingSms: false });
  policy.value = { locale, document };
  history.pushState(null, "", policyPath(locale, document));
  updateMetadata();
}
function switchLanguage(locale: Locale) {
  if (policy.value) navigatePolicy(policy.value.document, locale);
  else navigate(locale, page.value.audience, page.value.offering);
}
function updateMetadata() {
  if (!site.value) return;
  const metadata = pageMetadata(site.value, policy.value || page.value);
  document.documentElement.lang = metadata.locale;
  document.title = metadata.title;
  document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.setAttribute("content", metadata.description);
  const canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (canonical) canonical.href = metadata.canonical;
  for (const locale of ["en", "es"] as const)
    document
      .querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${locale}"]`,
      )
      ?.setAttribute("href", metadata.alternates[locale]);
}
function popstate() {
  const documentRoute = resolvePolicy(location.pathname);
  if (
    documentRoute &&
    site.value &&
    getPolicyDocument(site.value, documentRoute)
  ) {
    if (documentRoute.locale !== activeLocale.value)
      chooseSms({ transactionalSms: false, marketingSms: false });
    policy.value = documentRoute;
    updateMetadata();
    return;
  }
  const route =
    location.pathname === "/" && site.value
      ? homepage(site.value)
      : resolvePage(location.pathname);
  if (route) {
    policy.value = null;
    page.value = route;
    landingPath.value = location.pathname;
    updateMetadata();
  }
}
async function submit() {
  if (!site.value || !consentContext.value) return;
  consentSnapshot.value = reconcileConsent(
    consentSnapshot.value,
    consentContext.value,
  );
  const payload = buildSubmissionDraft(
    fields,
    {
      ...consentContext.value,
      audience: page.value.audience,
      offering: page.value.offering,
    },
    consentSnapshot.value.intent,
  );
  attempt.value = prepareAttempt(
    attempt.value,
    payload,
    `${site.value.siteId}:${page.value.audience}:${page.value.offering}:${page.value.locale}`,
  );
  if (!site.value.submissionsEnabled) {
    state.value = "preview";
    return;
  }
  state.value = "pending";
  try {
    receipt.value = await submitAttempt(
      provider.value ? "provider-interest" : "service-requests",
      attempt.value,
      site.value.submissionsEnabled,
    );
    state.value = "accepted";
  } catch {
    state.value = "error";
  }
}
onMounted(async () => {
  window.addEventListener("popstate", popstate);
  try {
    const response = await fetch("/api/site-context", {
      credentials: "omit",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw Error("Site unavailable.");
    site.value = parseSiteContext(await response.json());
    if (location.pathname === "/" || policy.value)
      page.value = homepage(site.value);
    if (policy.value && !getPolicyDocument(site.value, policy.value))
      throw Error("Document unavailable.");
    if (!site.value.offerings.includes(page.value.offering))
      throw Error("Page unavailable.");
    updateMetadata();
  } catch {
    site.value = null;
    failure.value =
      "This site is unavailable. / Este sitio no está disponible.";
  }
});
onUnmounted(() => window.removeEventListener("popstate", popstate));
</script>

<template>
  <a href="#main" class="skip-link">{{
    es ? "Ir al contenido" : "Skip to content"
  }}</a>
  <main v-if="failure" id="main" class="loading">
    <h1>{{ failure }}</h1>
  </main>
  <main v-else-if="!site" id="main" class="loading" role="status">
    Loading / Cargando…
  </main>
  <div v-else>
    <div class="preview-notice">{{ words.preview }}</div>
    <header class="site-header shell">
      <a
        class="brand"
        href="/"
        @click.prevent="navigate(activeLocale, 'landing', page.offering)"
        ><span class="brand-mark" aria-hidden="true">b.</span
        >{{ site.brand.name }}</a
      >
      <nav aria-label="Main">
        <a
          :href="`/${activeLocale}/${provider ? 'landing' : 'business'}/${page.offering}`"
          @click.prevent="
            navigate(
              activeLocale,
              provider ? 'landing' : 'business',
              page.offering,
            )
          "
          >{{ provider ? words.client : words.provider }}</a
        >
        <a
          class="language"
          :href="
            policy
              ? policyPath(es ? 'en' : 'es', policy.document)
              : `/${es ? 'en' : 'es'}/${page.audience}/${page.offering}`
          "
          :lang="es ? 'en' : 'es'"
          @click.prevent="switchLanguage(es ? 'en' : 'es')"
          >{{ es ? "English" : "Español" }}</a
        >
      </nav>
    </header>
    <main id="main">
      <PolicyPage
        v-if="policyDocument"
        :document="policyDocument"
        :locale="activeLocale"
      />
      <section v-else-if="page.thankYou" class="shell receipt-page">
        <h1>{{ receipt ? words.accepted : words.noReceipt }}</h1>
        <a :href="`/${page.locale}/${page.audience}/${page.offering}`">{{
          words.back
        }}</a>
      </section>
      <template v-else>
        <section class="hero shell" :class="`offering-${page.offering}`">
          <div class="hero-copy">
            <p class="eyebrow">
              {{ content.name }} <span aria-hidden="true">/</span>
              {{ provider ? words.provider : words.client }}
            </p>
            <h1>{{ content.title }}</h1>
            <p class="lede">{{ content.description }}</p>
            <a class="button primary" href="#request"
              >{{ words.explore }} <span aria-hidden="true">↗</span></a
            >
            <p class="small-print">{{ words.independent }}</p>
          </div>
          <aside class="project-card" :aria-label="words.prepare">
            <div class="card-top">
              <span class="pill">{{ content.name }}</span
              ><span aria-hidden="true">↗</span>
            </div>
            <div class="house-art" aria-hidden="true">
              <div class="sun"></div>
              <div class="roof"></div>
              <div class="house">
                <div class="window"></div>
                <div class="door"></div>
              </div>
              <div class="ground"></div>
            </div>
            <h2>{{ words.prepare }}</h2>
            <ul>
              <li v-for="question in content.questions" :key="question">
                {{ question }}
              </li>
            </ul>
          </aside>
        </section>
        <section class="service-strip shell" :aria-label="words.services">
          <label for="service-choice">{{ words.select }}</label
          ><select
            id="service-choice"
            :value="page.offering"
            @change="
              navigate(
                page.locale,
                page.audience,
                ($event.target as HTMLSelectElement).value as Offering,
              )
            "
          >
            <option
              v-for="offering in site.offerings"
              :key="offering"
              :value="offering"
            >
              {{ getTemplate(offering, page.audience, page.locale).name }}
            </option>
          </select>
        </section>
        <section class="steps shell">
          <p class="eyebrow">{{ words.how }}</p>
          <h2>{{ words.next }}</h2>
          <div class="step-grid">
            <article
              v-for="(step, index) in provider
                ? [
                    [words.provider1, words.providerDetail1],
                    [words.provider2, words.providerDetail2],
                    [words.provider3, words.providerDetail3],
                  ]
                : [
                    [words.step1, words.detail1],
                    [words.step2, words.detail2],
                    [words.step3, words.detail3],
                  ]"
              :key="index"
            >
              <span class="step-number">0{{ index + 1 }}</span>
              <h3>{{ step[0] }}</h3>
              <p>{{ step[1] }}</p>
            </article>
          </div>
        </section>
        <section id="request" class="request-section">
          <div class="shell request-grid">
            <div class="request-intro">
              <p class="eyebrow">
                {{ provider ? words.provider : words.client }}
              </p>
              <h2>{{ provider ? words.providerForm : words.form }}</h2>
              <p>{{ words.formDetail }}</p>
              <div class="terms-note">
                <h3>{{ es ? "Sin sorpresas" : "Clear expectations" }}</h3>
                <p>{{ words.fee }}</p>
                <p>{{ words.disclosure }}</p>
              </div>
            </div>
            <form @submit.prevent="submit">
              <fieldset :disabled="state === 'pending'">
                <legend class="sr-only">
                  {{ provider ? words.providerForm : words.form }}
                </legend>
                <label v-if="provider" class="full"
                  >{{ words.company
                  }}<input
                    v-model="fields.businessName"
                    name="businessName"
                    autocomplete="organization"
                    required
                    minlength="2"
                    maxlength="200"
                /></label>
                <label
                  >{{ words.name
                  }}<input
                    v-model="fields.name"
                    name="name"
                    autocomplete="name"
                    required
                    minlength="2"
                    maxlength="160"
                /></label>
                <label
                  >{{ words.email
                  }}<input
                    v-model="fields.email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    maxlength="254"
                /></label>
                <label
                  >{{ words.phone
                  }}<input
                    v-model="fields.phone"
                    name="phone"
                    type="tel"
                    autocomplete="tel"
                    required
                    minlength="7"
                    maxlength="40"
                /></label>
                <label
                  >{{ words.postal
                  }}<input
                    v-model="fields.postalCode"
                    name="postalCode"
                    autocomplete="postal-code"
                    inputmode="numeric"
                    required
                    pattern="[0-9]{5}(-[0-9]{4})?"
                    maxlength="10"
                /></label>
                <label v-if="!provider" class="full"
                  >{{ words.address
                  }}<input
                    v-model="fields.address"
                    name="address"
                    autocomplete="street-address"
                    required
                    minlength="3"
                    maxlength="240"
                /></label>
                <label
                  >{{ words.city
                  }}<input
                    v-model="fields.city"
                    name="city"
                    autocomplete="address-level2"
                    required
                    minlength="2"
                    maxlength="120"
                /></label>
                <label
                  >{{ words.region
                  }}<select
                    v-model="fields.state"
                    name="state"
                    autocomplete="address-level1"
                    required
                  >
                    <option value="">—</option>
                    <option
                      v-for="region in 'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(
                        ' ',
                      )"
                      :key="region"
                      :value="region"
                    >
                      {{ region }}
                    </option>
                  </select></label
                >
                <label class="full"
                  >{{ words.description
                  }}<textarea
                    v-model="fields.description"
                    name="description"
                    rows="4"
                    required
                    minlength="5"
                    maxlength="3000"
                    :placeholder="content.questions.join(' ')"
                  ></textarea>
                </label>
                <label class="consent full"
                  ><input
                    v-model="fields.consent"
                    name="consent"
                    type="checkbox"
                  /><span>{{
                    requestContactText(site.brand.name, page.locale)
                  }}</span></label
                >
                <ConsentChoices
                  v-if="consentSnapshot"
                  :site="site"
                  :locale="page.locale"
                  :intent="consentSnapshot.intent"
                  @change="chooseSms"
                  @navigate="(name) => navigatePolicy(name)"
                />
                <p class="small-print full">
                  {{ words.optional }}
                </p>
                <button class="button primary full" type="submit">
                  {{ state === "pending" ? words.pending : words.button }}
                  <span aria-hidden="true">→</span>
                </button>
              </fieldset>
              <div class="form-status" role="status" aria-live="polite">
                <p v-if="state === 'preview'">{{ words.ready }}</p>
                <p v-if="state === 'error'">{{ words.error }}</p>
                <p v-if="state === 'accepted'">
                  {{ words.accepted }}
                  <span v-if="receipt">{{ receipt.request_id }}</span>
                </p>
              </div>
            </form>
          </div>
        </section>
      </template>
    </main>
    <BusinessFooter
      :site="site"
      :locale="activeLocale"
      @navigate="(name) => navigatePolicy(name)"
      ><p>{{ words.independent }}</p></BusinessFooter
    >
  </div>
</template>
