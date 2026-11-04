/** Complete independent input fixture for the public manifest contract. */
export function manifestInput() {
  const customer = (name: string) => ({
    name,
    headline: "Tell us about the work you need",
    subhead: "Preview your request. No appointment is booked.",
    cta: "Review request",
    subtypes: [
      { value: "repair", label: "Repair" },
      { value: "maintenance", label: "Maintenance" },
      { value: "installation", label: "Installation" },
    ],
    urgency: [{ value: "flexible", label: "Flexible" }],
    extraFields: [
      { key: "equipment", label: "Equipment", type: "text", required: false },
    ],
    included: ["Describe your requested work"],
    excluded: ["Emergency response"],
    priceFactors: ["Scope of work"],
    steps: ["Describe", "Review", "Discuss"],
    faq: Array.from({ length: 5 }, (_, i) => ({
      q: `Question ${i + 1}?`,
      a: "Details require owner review.",
    })),
    confirmation: "Preview only. Nothing has been sent.",
  });
  const provider = (name: string) => ({
    name,
    headline: "Introduce your services",
    subhead: "Applications require review before activation.",
    cta: "Review application",
    fit: ["Independent service providers"],
    exampleLead: {
      area: "Fictional area",
      service: "Fictional repair",
      urgency: "Flexible",
      scope: "Fictional example only",
    },
    qualification: ["Declare your service scope"],
    leadModel: "Proposed model, subject to owner review.",
    commercialTerms: ["[OWNER: lead price]"],
    controls: ["Pause availability"],
    workflow: [
      "Apply",
      "Review",
      "Set preferences",
      "Accept",
      "Contact",
      "Report",
    ],
    faq: Array.from({ length: 5 }, (_, i) => ({
      q: `Provider question ${i + 1}?`,
      a: "Details require owner review.",
    })),
    confirmation: "Preview only. No provider account is activated.",
  });
  return {
    slug: "hvac",
    accent: "#AABBCC",
    group: "home",
    pilot: true,
    customer: {
      es: customer("Aire acondicionado"),
      en: customer("Air conditioning"),
      fr: customer("Climatisation"),
    },
    provider: {
      es: provider("Profesionales"),
      en: provider("Providers"),
      fr: provider("Prestataires"),
    },
    seasonal: [],
    features: { serviceSelector: true, whatsappButton: false },
  };
}
