import logoUrl from "./assets/brand/BREERO-logo-header.png";
import faviconUrl from "./assets/brand/favicon.ico";

export { logoUrl, faviconUrl };

let hero: { slug: string; url: string } | undefined;

/** Page entries register one static import; shared UI never imports all heroes. */
export function registerServiceHero(slug: string, url: string): void {
  if (
    !/^[a-z][a-z0-9-]{0,63}$/.test(slug) ||
    !url.startsWith("/") ||
    url.startsWith("//") ||
    !url.endsWith(".webp")
  )
    throw Error("Invalid service hero asset.");
  if (hero && (hero.slug !== slug || hero.url !== url))
    throw Error("An independent page can register only its own hero.");
  hero = { slug, url };
}

export function serviceHeroUrl(slug: string): string | undefined {
  return hero?.slug === slug ? hero.url : undefined;
}
