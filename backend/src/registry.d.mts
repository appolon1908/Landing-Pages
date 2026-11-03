import type { SiteContext } from "@lp/core";
export type Destination = {
  type: string;
  deliver(
    submission: unknown,
  ): Promise<{ downstreamStatus: string; downstreamId?: string }>;
};
export type RegistryEntry = {
  site: SiteContext;
  destination: Destination;
  rateLimit: { capacity: number; windowMs: number };
  turnstile?: { secretEnv: string; siteKeyEnv: string };
};
export type Registry = {
  forHost(host: string | undefined): RegistryEntry | null;
  forSite(siteId: string): RegistryEntry | null;
  sites(): SiteContext[];
  destinationTypes: string[];
};
export function buildRegistry(entries: unknown[]): Registry;
export function loadRegistryDir(dir: string): Promise<unknown[]>;
