import { parseSiteContext, type SiteContext } from "@lp/core";

/** Presentation data only; submission authority remains with the backend. */
export function readSiteBootstrap(
  element: Pick<Element, "tagName" | "textContent" | "getAttribute"> | null,
  hostname: string,
): SiteContext | null {
  if (
    element?.tagName !== "SCRIPT" ||
    element.getAttribute("type") !== "application/json" ||
    element.getAttribute("src") !== null
  )
    return null;
  try {
    const value = JSON.parse(element.textContent || "");
    if (value.hostname !== hostname.toLowerCase()) return null;
    return parseSiteContext(value.site);
  } catch {
    return null;
  }
}

export async function loadSiteContext(): Promise<SiteContext> {
  const elements = document.querySelectorAll("#lp-site-context");
  const bootstrap = readSiteBootstrap(
    elements.length === 1 ? elements[0] : null,
    location.hostname,
  );
  if (bootstrap) return bootstrap;
  const response = await fetch("/api/site-context", {
    cache: "no-store",
    credentials: "omit",
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw Error("Site unavailable.");
  return parseSiteContext(await response.json());
}
