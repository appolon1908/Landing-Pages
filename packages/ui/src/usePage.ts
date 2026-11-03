import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import {
  buildSubmissionDraft,
  getPolicyDocument,
  getTemplate,
  pageHref,
  pageMetadata,
  parseSiteContext,
  policyPath,
  prepareAttempt,
  reconcileConsent,
  resolvePage,
  resolvePolicy,
  siteSlugs,
  submitAttempt,
  createIntakeFields,
  clearIntakeConsent,
  captureAttribution,
  validateIntakeFields,
  marketFor,
  defaultLocale,
  locales,
  SubmissionError,
} from "@lp/core";
import type {
  Attempt,
  Audience,
  ConsentContext,
  ConsentSnapshot,
  DocumentName,
  IntakeFields,
  Locale,
  PageManifest,
  PageRoute,
  PolicyRoute,
  Receipt,
  SiteContext,
  SmsChoices,
  IntakeErrors,
} from "@lp/core";
import { words } from "./i18n/words.ts";
import { intakeWords } from "./intakeWords.ts";

export type FormState = "ready" | "preview" | "pending" | "accepted" | "error";

/**
 * Everything a landing page needs at runtime: site context from the backend,
 * client-side routing for this page's own routes, consent reconciliation and
 * the submission flow. One page = one manifest; other pages are reached by
 * full navigation through `pageHref`, so each deployment stands alone.
 */
export function usePage(manifest: PageManifest) {
  const site = ref<SiteContext | null>(null);
  const failure = ref(false);
  const policy = ref<PolicyRoute | null>(resolvePolicy(location.pathname));
  const initial = resolvePage(location.pathname);
  const page = ref<PageRoute>(
    initial && initial.slug === manifest.slug
      ? initial
      : {
          locale: defaultLocale,
          audience: manifest.audiences[0]!,
          slug: manifest.slug,
          thankYou: false,
        },
  );
  const landingPath = computed(
    () => `/${page.value.locale}/${page.value.audience}/${manifest.slug}`,
  );
  const fields = reactive<IntakeFields>(createIntakeFields());
  const step = ref<1 | 2>(1);
  const errors = ref<IntakeErrors>({});
  const consentChanged = ref(false);
  const attribution = captureAttribution(location.href);
  let navigationVersion = 0;
  const state = ref<FormState>("ready");
  const receipt = ref<Receipt | null>(null);
  const failureReference = ref<string | null>(null);
  const attempt = ref<Attempt | null>(null);

  const activeLocale = computed<Locale>(
    () => policy.value?.locale || page.value.locale,
  );
  const t = computed(() => words(activeLocale.value));
  const intake = computed(() => intakeWords(activeLocale.value));
  const market = computed(() => marketFor(site.value?.marketId));
  const provider = computed(() => page.value.audience === "business");
  const content = computed(() =>
    getTemplate(manifest, page.value.audience, page.value.locale),
  );
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
          sourcePath: landingPath.value,
        }
      : null,
  );
  watch(
    consentContext,
    (context) => {
      const previous = consentSnapshot.value;
      consentSnapshot.value = context
        ? reconcileConsent(consentSnapshot.value, context)
        : null;
      if (previous?.scope !== consentSnapshot.value?.scope) {
        consentChanged.value =
          fields.consent ||
          fields.promotions ||
          !!previous?.intent.choices.transactionalSms ||
          !!previous?.intent.choices.marketingSms;
        clearIntakeConsent(fields);
      }
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

  function updateMetadata() {
    if (!site.value) return;
    const metadata = pageMetadata(
      site.value,
      policy.value || page.value,
      manifest,
    );
    document.documentElement.lang = metadata.locale;
    document.title = metadata.title;
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.setAttribute("content", metadata.description);
    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute("href", metadata.canonical);
    for (const locale of [...locales, "x-default"] as const)
      document
        .querySelector<HTMLLinkElement>(
          `link[rel="alternate"][hreflang="${locale}"]`,
        )
        ?.setAttribute("href", metadata.alternates[locale]);
  }
  function navigate(locale: Locale, audience: Audience) {
    if (!manifest.audiences.includes(audience)) return;
    policy.value = null;
    navigationVersion++;
    if (audience !== page.value.audience) step.value = 1;
    page.value = { locale, audience, slug: manifest.slug, thankYou: false };
    state.value = "ready";
    receipt.value = null;
    failureReference.value = null;
    errors.value = {};
    history.pushState(null, "", landingPath.value);
    updateMetadata();
  }
  function navigatePolicy(
    document: DocumentName,
    locale: Locale = activeLocale.value,
  ) {
    if (!site.value || !getPolicyDocument(site.value, { locale, document }))
      return;
    navigationVersion++;
    state.value = "ready";
    receipt.value = null;
    failureReference.value = null;
    if (locale !== activeLocale.value) {
      chooseSms({ transactionalSms: false, marketingSms: false });
      clearIntakeConsent(fields);
      consentChanged.value = true;
    }
    policy.value = { locale, document };
    history.pushState(null, "", policyPath(locale, document));
    updateMetadata();
  }
  function switchLanguage(locale: Locale) {
    if (policy.value) navigatePolicy(policy.value.document, locale);
    else navigate(locale, page.value.audience);
  }
  /** Href to another page of the same site (may be another origin). */
  function hrefFor(slug: string, audience = page.value.audience) {
    return site.value
      ? pageHref(site.value, { locale: page.value.locale, audience, slug })
      : "#";
  }
  function popstate() {
    const documentRoute = resolvePolicy(location.pathname);
    if (
      documentRoute &&
      site.value &&
      getPolicyDocument(site.value, documentRoute)
    ) {
      navigationVersion++;
      state.value = "ready";
      receipt.value = null;
      failureReference.value = null;
      if (documentRoute.locale !== activeLocale.value) {
        chooseSms({ transactionalSms: false, marketingSms: false });
        clearIntakeConsent(fields);
        consentChanged.value = true;
      }
      policy.value = documentRoute;
      updateMetadata();
      return;
    }
    const route = resolvePage(location.pathname);
    if (route && route.slug === manifest.slug) {
      navigationVersion++;
      state.value = "ready";
      receipt.value = null;
      policy.value = null;
      page.value = route;
      updateMetadata();
    }
  }
  function validate(selectedStep?: 1 | 2) {
    errors.value = site.value
      ? validateIntakeFields(
          fields,
          {
            site: site.value,
            manifest,
            audience: page.value.audience,
            locale: page.value.locale,
          },
          selectedStep,
        )
      : { market: "market" };
    if (Object.keys(errors.value).length) {
      void nextTick(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return false;
    }
    return true;
  }
  function nextStep() {
    if (validate(1)) step.value = 2;
  }
  function previousStep() {
    step.value = 1;
    errors.value = {};
  }
  async function submit() {
    if (!site.value || !consentContext.value) return;
    if (state.value === "pending" || !validate()) return;
    consentSnapshot.value = reconcileConsent(
      consentSnapshot.value,
      consentContext.value,
    );
    const payload = buildSubmissionDraft(
      fields,
      {
        ...consentContext.value,
        audience: page.value.audience,
        slug: manifest.slug,
        attribution,
      },
      consentSnapshot.value.intent,
    );
    attempt.value = prepareAttempt(
      attempt.value,
      payload,
      `${site.value.siteId}:${page.value.audience}:${manifest.slug}:${page.value.locale}`,
    );
    if (!site.value.submissionsEnabled) {
      state.value = "preview";
      return;
    }
    state.value = "pending";
    failureReference.value = null;
    const submittedVersion = navigationVersion;
    try {
      const accepted = await submitAttempt(
        provider.value ? "provider-interest" : "service-requests",
        attempt.value,
        site.value.submissionsEnabled,
      );
      if (submittedVersion !== navigationVersion) return;
      receipt.value = accepted;
      state.value = "accepted";
      page.value = { ...page.value, thankYou: true };
      history.pushState(null, "", `${landingPath.value}/thank-you`);
      updateMetadata();
    } catch (error) {
      if (submittedVersion === navigationVersion) {
        state.value = "error";
        failureReference.value =
          error instanceof SubmissionError ? error.requestId : null;
      }
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
      const context = parseSiteContext(await response.json());
      if (!siteSlugs(context).includes(manifest.slug))
        throw Error("Page not offered by this site.");
      if (policy.value && !getPolicyDocument(context, policy.value))
        throw Error("Document unavailable.");
      site.value = context;
      if (!resolvePage(location.pathname) && !policy.value)
        history.replaceState(null, "", landingPath.value);
      updateMetadata();
    } catch {
      site.value = null;
      failure.value = true;
    }
  });
  onUnmounted(() => window.removeEventListener("popstate", popstate));

  return {
    manifest,
    site,
    failure,
    policy,
    policyDocument,
    page,
    fields,
    step,
    errors,
    intake,
    market,
    consentChanged,
    nextStep,
    previousStep,
    state,
    receipt,
    failureReference,
    activeLocale,
    t,
    provider,
    content,
    consentSnapshot,
    chooseSms,
    navigate,
    navigatePolicy,
    switchLanguage,
    hrefFor,
    submit,
  };
}
export type PageController = ReturnType<typeof usePage>;
