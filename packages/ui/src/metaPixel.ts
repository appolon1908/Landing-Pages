/**
 * Meta Pixel for BREERO landing pages only.
 *
 * Server-approved configuration is injected as an inert <meta> tag for live
 * BREERO pages with the operator feature flag. The external Pixel script
 * loads into <head> only after an explicit advertising opt-in.
 */
export const BREERO_PIXEL_ID = "965185126235275";
export const PIXEL_SCRIPT_ID = "lp-breero-meta-pixel";
export const PIXEL_CONSENT_PREFIX = "lp-meta-advertising-v1:";

type PixelFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: PixelFn;
    _fbq?: PixelFn;
  }
}

let initialized = false;
let granted = false;
let lastPage: string | null = null;

export function pixelConfigured(): boolean {
  return (
    document.querySelector<HTMLMetaElement>('meta[name="lp-meta-pixel-id"]')
      ?.content === BREERO_PIXEL_ID
  );
}

export function readAdvertisingChoice(siteId: string): "allow" | "deny" | null {
  try {
    const value = localStorage.getItem(PIXEL_CONSENT_PREFIX + siteId);
    return value === "allow" || value === "deny" ? value : null;
  } catch {
    return null;
  }
}

export function storeAdvertisingChoice(
  siteId: string,
  value: "allow" | "deny",
): void {
  try {
    localStorage.setItem(PIXEL_CONSENT_PREFIX + siteId, value);
  } catch {
    // A browser with blocked storage still allows an in-session choice.
  }
}

export function browserDeclinesTracking(): boolean {
  return (
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true
  );
}

function install(): void {
  if (!window.fbq) {
    const fn = ((...args: unknown[]) => {
      if (fn.callMethod) fn.callMethod.apply(fn, args);
      else fn.queue?.push(args);
    }) as PixelFn;
    fn.loaded = true;
    fn.version = "2.0";
    fn.queue = [];
    fn.push = fn;
    window.fbq = fn;
    window._fbq = fn;
  }

  if (
    !document.getElementById(PIXEL_SCRIPT_ID) &&
    !document.querySelector(
      'script[src="https://connect.facebook.net/en_US/fbevents.js"]',
    )
  ) {
    const script = document.createElement("script");
    script.id = PIXEL_SCRIPT_ID;
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  if (!initialized) {
    window.fbq?.("init", BREERO_PIXEL_ID);
    initialized = true;
  }
}

/**
 * Reconcile permission and route changes. Does not load or transmit anything
 * before permission. After denial, future calls are stopped and Meta consent
 * is revoked for an already loaded pixel.
 */
export function syncMetaPixel(allow: boolean, pathname: string): void {
  if (!allow || !pixelConfigured() || browserDeclinesTracking()) {
    if (granted) window.fbq?.("consent", "revoke");
    granted = false;
    lastPage = null;
    return;
  }

  install();
  if (!granted) window.fbq?.("consent", "grant");
  granted = true;
  if (pathname !== lastPage) {
    window.fbq?.("trackSingle", BREERO_PIXEL_ID, "PageView");
    lastPage = pathname;
  }
}
