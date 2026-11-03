import { offerings } from "../industry-templates/catalog.ts";
import { parseComplianceProfile } from "./compliance.ts";
import type { ComplianceProfile } from "./compliance.ts";
import type {
  Audience,
  Locale,
  Offering,
} from "../industry-templates/catalog.ts";

export type SiteContext = {
  siteId: string;
  workspaceId: string;
  brand: { name: string; accent: string };
  publicOrigin: string;
  offerings: Offering[];
  mode: "preview";
  submissionsEnabled: false;
} & (
  | { schemaVersion: 1; compliance?: never }
  | { schemaVersion: 2; compliance: ComplianceProfile }
);
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
export function parseSiteContext(value: unknown): SiteContext {
  const version = (value as { schemaVersion?: unknown } | null)?.schemaVersion;
  const item = record(value, [
    "schemaVersion",
    "siteId",
    "workspaceId",
    "brand",
    "publicOrigin",
    "offerings",
    "mode",
    "submissionsEnabled",
    ...(version === 2 ? ["compliance"] : []),
  ]);
  const brand = record(item.brand, ["name", "accent"]);
  if (
    ![1, 2].includes(item.schemaVersion as number) ||
    !text(item.siteId, 64) ||
    !/^[a-z0-9-]+$/.test(item.siteId) ||
    typeof item.workspaceId !== "string" ||
    !uuid.test(item.workspaceId)
  )
    throw Error("Invalid site identity.");
  if (
    !text(brand.name, 120) ||
    typeof brand.accent !== "string" ||
    !/^#[0-9a-f]{6}$/i.test(brand.accent)
  )
    throw Error("Invalid public brand.");
  if (typeof item.publicOrigin !== "string")
    throw Error("Missing public origin.");
  const url = new URL(item.publicOrigin);
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
    throw Error("Unsafe public origin.");
  if (
    !Array.isArray(item.offerings) ||
    !item.offerings.length ||
    item.offerings.length > offerings.length ||
    item.offerings.some((x) => !offerings.includes(x)) ||
    new Set(item.offerings).size !== item.offerings.length
  )
    throw Error("Invalid site offerings.");
  if (item.mode !== "preview" || item.submissionsEnabled !== false)
    throw Error("Live effects are disabled in this foundation.");
  const common = {
    siteId: item.siteId,
    workspaceId: item.workspaceId,
    brand: { name: brand.name, accent: brand.accent },
    publicOrigin: url.origin,
    offerings: [...item.offerings] as Offering[],
    mode: "preview" as const,
    submissionsEnabled: false as const,
  };
  return version === 2
    ? {
        ...common,
        schemaVersion: 2,
        compliance: parseComplianceProfile(item.compliance),
      }
    : { ...common, schemaVersion: 1 };
}

export type PageRoute = {
  locale: Locale;
  audience: Audience;
  offering: Offering;
  thankYou: boolean;
};
export function resolvePage(path: string): PageRoute | null {
  const match =
    /^\/(en|es)\/(landing|business)\/([a-z0-9-]+)(\/thank-you)?\/?$/.exec(path);
  if (!match || !offerings.includes(match[3] as Offering)) return null;
  return {
    locale: match[1] as Locale,
    audience: match[2] as Audience,
    offering: match[3] as Offering,
    thankYou: Boolean(match[4]),
  };
}
