import { parseComplianceProfile } from "./compliance.ts";
import type { ComplianceProfile } from "./compliance.ts";
import {
  audiences,
  locales,
  slugPattern,
  accentPattern,
} from "../pages/manifest.ts";
import type { Audience, Locale } from "../pages/manifest.ts";

/**
 * A site page binding: which landing pages a site offers and, when a page is
 * deployed on its own origin, where it lives. `origin: null` means the page is
 * served from the current origin.
 */
export type SitePage = {
  slug: string;
  origin: string | null;
  /** Localized display name for cross-page navigation. */
  label: Record<Locale, string> | null;
};

/**
 * Public site context served by the backend at /api/site-context.
 * Contains nothing secret: no destination URLs, no keys.
 */
export type SiteContext = {
  schemaVersion: 3;
  siteId: string;
  workspaceId: string;
  marketId?: string | null;
  brand: { name: string; accent: string };
  publicOrigin: string;
  pages: SitePage[];
  mode: "preview" | "live";
  /** Computed by the backend from mode + destination; browsers cannot enable it. */
  submissionsEnabled: boolean;
  compliance: ComplianceProfile;
};
export const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function record(value: unknown, allowed: string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Invalid public site document.");
  if (Object.keys(value).some((key) => !allowed.includes(key)))
    throw Error("Unexpected public site field.");
  return value as Record<string, unknown>;
}
function text(value: unknown, max: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= max &&
    !/[\u0000-\u001f]/.test(value)
  );
}
export function parseOrigin(value: unknown): string {
  if (typeof value !== "string") throw Error("Missing origin.");
  const url = new URL(value);
  const local =
    url.hostname === "localhost" ||
    url.hostname.endsWith(".localhost") ||
    url.hostname === "127.0.0.1";
  if (
    (url.protocol !== "https:" && !(local && url.protocol === "http:")) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw Error("Unsafe origin.");
  return url.origin;
}
function parsePages(value: unknown): SitePage[] {
  if (!Array.isArray(value) || !value.length || value.length > 200)
    throw Error("Invalid site pages.");
  const pages = value.map((entry): SitePage => {
    if (typeof entry === "string") {
      if (!slugPattern.test(entry)) throw Error("Invalid site page slug.");
      return { slug: entry, origin: null, label: null };
    }
    const item = record(entry, ["slug", "origin", "label"]);
    if (!text(item.slug, 64) || !slugPattern.test(item.slug))
      throw Error("Invalid site page slug.");
    let label: SitePage["label"] = null;
    if (item.label !== undefined && item.label !== null) {
      const l = record(item.label, [...locales]);
      if (locales.some((locale) => !text(l[locale], 80)))
        throw Error("Invalid site page label.");
      label = Object.fromEntries(
        locales.map((locale) => [locale, l[locale]]),
      ) as Record<Locale, string>;
    }
    return {
      slug: item.slug,
      origin:
        item.origin === undefined || item.origin === null
          ? null
          : parseOrigin(item.origin),
      label,
    };
  });
  if (new Set(pages.map((p) => p.slug)).size !== pages.length)
    throw Error("Duplicate site page.");
  return pages;
}
export function parseSiteContext(value: unknown): SiteContext {
  const item = record(value, [
    "schemaVersion",
    "siteId",
    "workspaceId",
    "marketId",
    "brand",
    "publicOrigin",
    "pages",
    "mode",
    "submissionsEnabled",
    "compliance",
  ]);
  const brand = record(item.brand, ["name", "accent"]);
  if (
    item.schemaVersion !== 3 ||
    !text(item.siteId, 64) ||
    !slugPattern.test(item.siteId) ||
    typeof item.workspaceId !== "string" ||
    !uuid.test(item.workspaceId)
  )
    throw Error("Invalid site identity.");
  if (
    !text(brand.name, 120) ||
    typeof brand.accent !== "string" ||
    !accentPattern.test(brand.accent)
  )
    throw Error("Invalid public brand.");
  if (item.mode !== "preview" && item.mode !== "live")
    throw Error("Invalid site mode.");
  if (typeof item.submissionsEnabled !== "boolean")
    throw Error("Invalid submissions flag.");
  if (item.mode === "preview" && item.submissionsEnabled)
    throw Error("Preview sites cannot accept submissions.");
  if (
    item.marketId != null &&
    (typeof item.marketId !== "string" || !slugPattern.test(item.marketId))
  )
    throw Error("Invalid market id.");
  return {
    schemaVersion: 3,
    siteId: item.siteId,
    workspaceId: item.workspaceId,
    marketId: (item.marketId as string | null | undefined) ?? null,
    brand: { name: brand.name, accent: brand.accent },
    publicOrigin: parseOrigin(item.publicOrigin),
    pages: parsePages(item.pages),
    mode: item.mode,
    submissionsEnabled: item.submissionsEnabled,
    compliance: parseComplianceProfile(item.compliance),
  };
}
export function siteSlugs(site: SiteContext): string[] {
  return site.pages.map((p) => p.slug);
}
export function sitePage(site: SiteContext, slug: string): SitePage | null {
  return site.pages.find((p) => p.slug === slug) ?? null;
}
export function pageLabel(page: SitePage, locale: Locale): string {
  return (
    page.label?.[locale] ??
    page.slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}
/** The origin a page is served from: its own, or the site's. */
export function pageOrigin(site: SiteContext, slug: string): string {
  return sitePage(site, slug)?.origin ?? site.publicOrigin;
}
/** Absolute or same-origin href for a page route, honoring per-page origins. */
export function pageHref(
  site: SiteContext,
  route: Omit<PageRoute, "thankYou">,
): string {
  const page = sitePage(site, route.slug);
  return (page?.origin ?? "") + pagePath(route);
}

export type PageRoute = {
  locale: Locale;
  audience: Audience;
  slug: string;
  thankYou: boolean;
};
export function pagePath(
  route: Omit<PageRoute, "thankYou"> & { thankYou?: boolean },
): string {
  return `/${route.locale}/${route.audience}/${route.slug}${route.thankYou ? "/thank-you" : ""}`;
}
/** Parse a landing route. Does not check the slug against any site; callers do. */
export function resolvePage(path: string): PageRoute | null {
  const match =
    /^\/(es|en|fr)\/(landing|business)\/([a-z0-9-]+)(\/thank-you)?\/?$/.exec(
      path,
    );
  if (!match || !slugPattern.test(match[3]!)) return null;
  if (
    !locales.includes(match[1] as Locale) ||
    !audiences.includes(match[2] as Audience)
  )
    return null;
  return {
    locale: match[1] as Locale,
    audience: match[2] as Audience,
    slug: match[3]!,
    thankYou: Boolean(match[4]),
  };
}

export type HomeRoute = { home: true; locale: Locale };
/** Homepage routes are not service bindings and have no service slug. */
export function resolveHome(path: string): HomeRoute | null {
  const match = /^\/(es|en|fr)\/?$/.exec(path);
  return match ? { home: true, locale: match[1] as Locale } : null;
}
