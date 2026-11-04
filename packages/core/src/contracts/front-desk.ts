import { audiences, locales, slugPattern } from "../pages/manifest.ts";
import type { Audience, Locale } from "../pages/manifest.ts";

export type FrontDeskConfig = {
  schemaVersion: 1;
  mode: "local-demo";
  available: boolean;
  demoOrigin: string | null;
  reason: "ready" | "not-configured" | "local-only";
  productionSchedulingEnabled: false;
};
export type FrontDeskContext = {
  audience: Audience | "home";
  locale: Locale;
  service?: string;
};
export type FrontDeskEntryMode = "voice" | "form";

export function parseFrontDeskOrigin(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (
    typeof value !== "string" ||
    !/^http:\/\/(localhost|127\.0\.0\.1)(?::[0-9]{1,5})?\/?$/.test(value)
  )
    throw Error(
      "Front Desk demo origin must be an HTTP localhost or 127.0.0.1 origin without credentials, paths, queries or fragments.",
    );
  try {
    const url = new URL(value);
    if (url.port === "0") throw Error("Invalid port");
    return url.origin;
  } catch {
    throw Error("Invalid Front Desk demo origin or port.");
  }
}

export function frontDeskConfig(
  origin: string | null,
  host: unknown,
): FrontDeskConfig {
  const local =
    typeof host === "string" &&
    /^(localhost|127\.0\.0\.1)(?::[0-9]{1,5})?$/i.test(host);
  const available = Boolean(origin && local);
  return {
    schemaVersion: 1,
    mode: "local-demo",
    available,
    demoOrigin: available ? origin : null,
    reason: !local ? "local-only" : origin ? "ready" : "not-configured",
    productionSchedulingEnabled: false,
  };
}

export function parseFrontDeskConfig(value: unknown): FrontDeskConfig {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Invalid Front Desk configuration.");
  const config = value as Record<string, unknown>;
  const allowed = [
    "schemaVersion",
    "mode",
    "available",
    "demoOrigin",
    "reason",
    "productionSchedulingEnabled",
  ];
  if (
    Object.keys(config).some((key) => !allowed.includes(key)) ||
    config.schemaVersion !== 1 ||
    config.mode !== "local-demo" ||
    typeof config.available !== "boolean" ||
    config.productionSchedulingEnabled !== false
  )
    throw Error("Invalid Front Desk configuration.");
  if (config.available) {
    if (
      config.reason !== "ready" ||
      typeof config.demoOrigin !== "string" ||
      !parseFrontDeskOrigin(config.demoOrigin)
    )
      throw Error("Invalid Front Desk target.");
  } else if (
    config.demoOrigin !== null ||
    !["not-configured", "local-only"].includes(String(config.reason))
  )
    throw Error("Invalid unavailable Front Desk configuration.");
  return { ...config } as FrontDeskConfig;
}

/** Source context is presentation only; it never identifies a tenant or grants booking authority. */
export function frontDeskDemoLink(
  config: FrontDeskConfig,
  context: FrontDeskContext,
  mode: FrontDeskEntryMode,
): string | null {
  const checked = parseFrontDeskConfig(config);
  if (!checked.available || !checked.demoOrigin) return null;
  if (mode !== "voice" && mode !== "form")
    throw Error("Invalid Front Desk entry mode.");
  if (
    !locales.includes(context.locale) ||
    (context.audience !== "home" && !audiences.includes(context.audience))
  )
    throw Error("Invalid Front Desk source context.");
  if (
    context.audience === "home"
      ? context.service !== undefined
      : typeof context.service !== "string" ||
        context.service.length > 80 ||
        !slugPattern.test(context.service)
  )
    throw Error("Invalid Front Desk service context.");
  const target = new URL(checked.demoOrigin);
  target.searchParams.set("source", "breero");
  if (context.service) target.searchParams.set("service", context.service);
  target.searchParams.set("audience", context.audience);
  target.searchParams.set("locale", context.locale);
  target.searchParams.set("mode", mode);
  return target.href;
}
