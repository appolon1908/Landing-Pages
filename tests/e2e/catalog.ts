// Independent blueprint inventory: do not derive this list from rendered data.
export const services = [
  "hvac",
  "plumbing",
  "electrical",
  "roofing",
  "home-cleaning",
  "commercial-cleaning",
  "pest-control",
  "landscaping",
  "tree-service",
  "painting",
  "remodeling",
  "flooring",
  "windows-doors",
  "pool-service",
  "solar",
  "backup-power",
  "water-systems",
  "appliance-repair",
  "locksmith",
  "security-systems",
  "moving",
  "junk-removal",
  "pressure-washing",
  "auto-repair",
  "auto-detailing",
  "towing",
  "catering",
  "photography-video",
  "tutoring",
  "digital-marketing",
] as const;
export const pilots = [
  "hvac",
  "plumbing",
  "electrical",
  "home-cleaning",
  "pest-control",
] as const;
export const locales = ["es", "en", "fr"] as const;
export const audiences = ["landing", "business"] as const;
export type Locale = (typeof locales)[number];
export type Audience = (typeof audiences)[number];
export type Service = (typeof services)[number];
export const firstPagePort = Number(process.env.E2E_FIRST_PAGE_PORT || 4500);
export const backendPort = Number(process.env.E2E_BACKEND_PORT || 4400);
export const selectedPages = ["home", ...services];
export function origin(slug: Service | "home") {
  return `http://127.0.0.1:${firstPagePort + selectedPages.indexOf(slug)}`;
}
export function serviceUrl(slug: Service, locale: Locale, audience: Audience) {
  return `${origin(slug)}/${locale}/${audience}/${slug}`;
}
export const coreRoutes = locales.flatMap((locale) => [
  {
    slug: "home" as const,
    locale,
    audience: null,
    url: `${origin("home")}/${locale}/`,
  },
  ...services.flatMap((slug) =>
    audiences.map((audience) => ({
      slug,
      locale,
      audience,
      url: serviceUrl(slug, locale, audience),
    })),
  ),
]);
export const accessibilityRoutes = coreRoutes.filter(
  (route) =>
    route.slug === "home" || pilots.some((slug) => slug === route.slug),
);
export const previewMessage = {
  es: /No se ha enviado nada/i,
  en: /Nothing has been sent/i,
  fr: /Rien n.a été envoyé/i,
};
export const noReceiptMessage = {
  es: /No hay una solicitud confirmada/i,
  en: /no confirmed request/i,
  fr: /Aucune demande confirmée/i,
};
