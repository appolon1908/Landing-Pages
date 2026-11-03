import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseSiteContext } from "@lp/core";
import { destinationTypes, parseDestination } from "./destinations/index.mjs";

const hostOf = (host) =>
  typeof host === "string" && /^[a-z0-9.-]+(?::[0-9]{1,5})?$/i.test(host)
    ? host.split(":")[0].toLowerCase()
    : null;

/**
 * One registry entry per site:
 *   { hosts: [...], site: {...public SiteContext without submissionsEnabled...},
 *     destination: { type, ...adapter options } }
 * The backend derives `submissionsEnabled` from mode + destination; browsers
 * and page servers cannot set it.
 */
export function buildRegistry(entries) {
  const byHost = new Map();
  const bySite = new Map();
  if (!Array.isArray(entries) || !entries.length)
    throw Error("An explicit site registry is required.");
  for (const entry of entries) {
    if (!entry || typeof entry !== "object" || !entry.site)
      throw Error("Invalid registry entry.");
    const destination = parseDestination(
      entry.destination ?? { type: "disabled" },
    );
    const mode = entry.site.mode;
    const submissionsEnabled =
      mode === "live" && destination.type !== "disabled";
    const site = parseSiteContext({ ...entry.site, submissionsEnabled });
    if (bySite.has(site.siteId))
      throw Error(`Duplicate siteId ${site.siteId}.`);
    if (!Array.isArray(entry.hosts) || !entry.hosts.length)
      throw Error(`${site.siteId}: no host mapping.`);
    const rateLimit = entry.rateLimit ?? { capacity: 10, windowMs: 600000 };
    if (
      !rateLimit ||
      typeof rateLimit !== "object" ||
      Array.isArray(rateLimit) ||
      Object.keys(rateLimit).some(
        (k) => !["capacity", "windowMs"].includes(k),
      ) ||
      !Number.isInteger(rateLimit.capacity) ||
      rateLimit.capacity < 1 ||
      rateLimit.capacity > 1000 ||
      !Number.isInteger(rateLimit.windowMs) ||
      rateLimit.windowMs < 1000 ||
      rateLimit.windowMs > 3600000
    )
      throw Error("Invalid rate-limit configuration.");
    const turnstile = entry.turnstile ?? null;
    if (
      turnstile &&
      (typeof turnstile !== "object" ||
        Array.isArray(turnstile) ||
        Object.keys(turnstile).some(
          (k) => !["siteKeyEnv", "secretEnv"].includes(k),
        ) ||
        ![turnstile.siteKeyEnv, turnstile.secretEnv].every(
          (key) =>
            typeof key === "string" && /^[A-Z][A-Z0-9_]{1,63}$/.test(key),
        ))
    )
      throw Error("Invalid Turnstile configuration.");
    const record = { site, destination, rateLimit, turnstile };
    for (const host of entry.hosts) {
      if (hostOf(host) !== host || byHost.has(host))
        throw Error(`${site.siteId}: invalid or duplicate host ${host}.`);
      byHost.set(host, record);
    }
    bySite.set(site.siteId, record);
  }
  return {
    forHost: (host) => byHost.get(hostOf(host)) ?? null,
    forSite: (siteId) => bySite.get(siteId) ?? null,
    sites: () => [...bySite.values()].map((r) => r.site),
    destinationTypes,
  };
}

/** Load every *.json file in a directory as a registry entry (sorted by name). */
export async function loadRegistryDir(dir) {
  const names = (await readdir(dir)).filter((n) => n.endsWith(".json")).sort();
  const entries = [];
  for (const name of names)
    entries.push(JSON.parse(await readFile(join(dir, name), "utf8")));
  return entries;
}
