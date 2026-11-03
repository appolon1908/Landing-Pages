/** Complete structural drafts, replaced by reviewed service copy in the content phase. */
export function placeholderManifest({
  slug,
  name,
  accent = "#176951",
  group = "home",
  pilot = false,
}) {
  const words = {
    es: {
      request: "Revisar solicitud",
      apply: "Revisar candidatura",
      draft: "Borrador de vista previa. El contenido requiere revisión.",
      pending: "[OWNER: información por confirmar]",
      fictional: "Ejemplo ficticio; no son datos reales.",
      question: "¿Qué debe confirmar el negocio?",
      steps: ["Describir", "Revisar", "Consultar"],
      workflow: [
        "Solicitar",
        "Revisar",
        "Configurar",
        "Aceptar",
        "Contactar",
        "Informar",
      ],
    },
    en: {
      request: "Review request",
      apply: "Review application",
      draft: "Preview draft. Content requires review.",
      pending: "[OWNER: information to confirm]",
      fictional: "Fictional example; not real data.",
      question: "What must the business confirm?",
      steps: ["Describe", "Review", "Discuss"],
      workflow: [
        "Apply",
        "Review",
        "Set preferences",
        "Accept",
        "Contact",
        "Report",
      ],
    },
    fr: {
      request: "Examiner la demande",
      apply: "Examiner la candidature",
      draft: "Brouillon de démonstration. Le contenu doit être révisé.",
      pending: "[OWNER: informations à confirmer]",
      fictional: "Exemple fictif ; aucune donnée réelle.",
      question: "Que doit confirmer l’entreprise ?",
      steps: ["Décrire", "Examiner", "Discuter"],
      workflow: [
        "Postuler",
        "Examiner",
        "Configurer",
        "Accepter",
        "Contacter",
        "Informer",
      ],
    },
  };
  const customer = {},
    provider = {};
  for (const [locale, w] of Object.entries(words)) {
    const faq = Array.from({ length: 5 }, (_, i) => ({
      q: `${w.question} (${i + 1})`,
      a: w.pending,
    }));
    customer[locale] = {
      name,
      headline: `[PLACEHOLDER] ${name}`,
      subhead: w.draft,
      cta: w.request,
      subtypes: ["assessment", "maintenance", "repair"].map((value) => ({
        value,
        label: `${w.pending} (${value})`,
      })),
      urgency: [{ value: "flexible", label: w.pending }],
      extraFields: [],
      included: [w.pending],
      excluded: [w.pending],
      priceFactors: [w.pending],
      steps: w.steps,
      faq,
      confirmation: w.draft,
    };
    provider[locale] = {
      name,
      headline: `[PLACEHOLDER] ${name}`,
      subhead: w.draft,
      cta: w.apply,
      fit: [w.pending],
      exampleLead: {
        area: w.fictional,
        service: name,
        urgency: w.pending,
        scope: w.fictional,
      },
      qualification: [w.pending],
      leadModel: w.pending,
      commercialTerms: [
        "[OWNER: lead price]",
        "[OWNER: acceptance window]",
        "[OWNER: credit window]",
      ],
      controls: [w.pending],
      workflow: w.workflow,
      faq,
      confirmation: w.draft,
    };
  }
  return {
    slug,
    accent,
    group,
    pilot,
    customer,
    provider,
    seasonal: [],
    features: { serviceSelector: true, whatsappButton: false },
  };
}
