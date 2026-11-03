import { disabled } from "./disabled.mjs";
import { log } from "./log.mjs";
import { webhook } from "./webhook.mjs";
import { breero } from "./breero.mjs";
import { n8n } from "./n8n.mjs";
import { odoo } from "./odoo.mjs";

/**
 * A destination receives an accepted submission and returns a downstream
 * status. Add a CRM by adding one file here. Secrets are never in the registry:
 * adapters read them from the environment variable named in `authEnv`.
 *
 * deliver({ kind, siteId, workspaceId, requestId, idempotencyKey, payload, receivedAt })
 *   -> Promise<{ downstreamStatus: string, downstreamId?: string }>
 */
const factories = { disabled, log, webhook, breero, n8n, odoo };
export const destinationTypes = Object.keys(factories);

export function parseDestination(config) {
  if (!config || typeof config !== "object" || Array.isArray(config))
    throw Error("Invalid destination.");
  const factory = factories[config.type];
  if (!factory) throw Error(`Unknown destination type "${config.type}".`);
  return factory(config);
}
