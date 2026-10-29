export const offerings = [
  "hvac-heating",
  "chimney-fireplace",
  "insulation-weatherproofing",
  "gutter-cleaning-repair",
  "plumbing-winterization",
] as const;
export type Offering = (typeof offerings)[number];
export type Locale = "en" | "es";
export type Audience = "landing" | "business";

const data: Record<
  Offering,
  {
    en: [string, string, string, string, string];
    es: [string, string, string, string, string];
  }
> = {
  "hvac-heating": {
    en: [
      "Heating & cooling",
      "Comfort starts with the right specialist.",
      "Find an independent provider for your heating or cooling project.",
      "What equipment needs attention?",
      "Is this a repair, maintenance or installation?",
    ],
    es: [
      "Calefacción y aire",
      "El confort empieza con el especialista adecuado.",
      "Encuentra un proveedor independiente para tu proyecto de calefacción o aire acondicionado.",
      "¿Qué equipo necesita atención?",
      "¿Es una reparación, mantenimiento o instalación?",
    ],
  },
  "chimney-fireplace": {
    en: [
      "Chimneys & fireplaces",
      "Get your fireplace ready for the season.",
      "Connect with an independent specialist for inspection, cleaning or repair.",
      "What type of fireplace or chimney do you have?",
      "Do you need an inspection, cleaning or repair?",
    ],
    es: [
      "Chimeneas y hogares",
      "Prepara tu chimenea para la temporada.",
      "Conecta con un especialista independiente para inspección, limpieza o reparación.",
      "¿Qué tipo de chimenea tienes?",
      "¿Necesitas una inspección, limpieza o reparación?",
    ],
  },
  "insulation-weatherproofing": {
    en: [
      "Insulation & weatherproofing",
      "A more comfortable home begins here.",
      "Explore independent providers for insulation and weatherproofing.",
      "Which areas of the property need attention?",
      "Are you seeking an assessment or installation?",
    ],
    es: [
      "Aislamiento y protección",
      "Un hogar más cómodo empieza aquí.",
      "Explora proveedores independientes de aislamiento y protección contra el clima.",
      "¿Qué áreas de la propiedad necesitan atención?",
      "¿Buscas una evaluación o una instalación?",
    ],
  },
  "gutter-cleaning-repair": {
    en: [
      "Gutter cleaning & repair",
      "Keep rainwater moving in the right direction.",
      "Find an independent provider for gutter cleaning or repair.",
      "How many stories does the property have?",
      "Do you need cleaning, repair or both?",
    ],
    es: [
      "Limpieza y reparación de canaletas",
      "Ayuda al agua de lluvia a seguir su camino.",
      "Encuentra un proveedor independiente para limpiar o reparar canaletas.",
      "¿Cuántos pisos tiene la propiedad?",
      "¿Necesitas limpieza, reparación o ambas?",
    ],
  },
  "plumbing-winterization": {
    en: [
      "Plumbing winterization",
      "Plan ahead for colder days.",
      "Connect with an independent provider to prepare your plumbing for winter.",
      "Will the property be occupied during winter?",
      "Which pipes or systems need preparation?",
    ],
    es: [
      "Preparación de tuberías para invierno",
      "Prepárate para los días más fríos.",
      "Conecta con un proveedor independiente para preparar tus tuberías para el invierno.",
      "¿La propiedad estará ocupada durante el invierno?",
      "¿Qué tuberías o sistemas necesitan preparación?",
    ],
  },
};

export function getTemplate(
  offering: Offering,
  audience: Audience,
  locale: Locale,
) {
  const [name, title, description, first, second] = data[offering][locale];
  return {
    name,
    title:
      audience === "landing"
        ? title
        : locale === "en"
          ? `Bring your ${name.toLowerCase()} expertise to more projects.`
          : `Comparte tu experiencia en ${name.toLowerCase()} con más proyectos.`,
    description:
      audience === "landing"
        ? description
        : locale === "en"
          ? "Tell us about your services and coverage. Provider interest does not activate a subscription or guarantee leads."
          : "Cuéntanos sobre tus servicios y cobertura. El registro de interés no activa una suscripción ni garantiza clientes.",
    questions:
      audience === "landing"
        ? [first, second]
        : locale === "en"
          ? [
              "Which services and equipment do you support?",
              "What area do you cover and what is your availability?",
            ]
          : [
              "¿Qué servicios y equipos atiendes?",
              "¿Qué área cubres y cuál es tu disponibilidad?",
            ],
    accent: ["#176951", "#87451d", "#365c82", "#56672c", "#4c5394"][
      offerings.indexOf(offering)
    ]!,
  };
}
