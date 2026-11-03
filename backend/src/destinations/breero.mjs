import { parseOrigin, uuid, validText } from "@lp/core";

/**
 * Breero public-submissions destination. Forwards the request envelope to
 *   {origin}/api/public-submissions/{kind}
 * Legacy transport; compatibility with the v3 CRM contract is unverified.
 * Explicit deduplication confirmation and a canonical CRM receipt are required.
 *   { "type": "breero", "origin": "https://api.breero.example", "authEnv": "BREERO_TOKEN" }
 */
export function breero(config, fetcher = fetch) {
  const origin = parseOrigin(config.origin);
  if (
    config.authEnv !== undefined &&
    !/^[A-Z][A-Z0-9_]{1,63}$/.test(config.authEnv)
  )
    throw Error("breero: authEnv must be an environment variable name.");
  return {
    type: "breero",
    async deliver(submission) {
      if (config.idempotencyContract !== "site-key-payload")
        throw Error(
          "breero: CRM idempotency contract must be explicitly confirmed.",
        );
      const headers = {
        "Content-Type": "application/json",
        "Idempotency-Key": `${submission.siteId}:${submission.idempotencyKey}`,
        "X-Payload-Fingerprint": submission.payloadFingerprint,
        "X-Correlation-ID": submission.requestId,
        "X-Site-Id": submission.siteId,
        "X-Workspace-Id": submission.workspaceId,
      };
      if (config.authEnv) {
        const token = process.env[config.authEnv];
        if (!token) throw Error(`breero: ${config.authEnv} is not set.`);
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetcher(
        `${origin}/api/public-submissions/${submission.kind}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(submission.payload),
          redirect: "error",
          signal: AbortSignal.timeout(15000),
        },
      );
      if (!response.ok) throw Error(`breero: upstream ${response.status}.`);
      const receipt = await response.json();
      if (
        !receipt ||
        receipt.status !== "REQUEST_ACCEPTED" ||
        typeof receipt.request_id !== "string" ||
        !uuid.test(receipt.request_id) ||
        receipt.downstream_status !== "CRM_ACCEPTED" ||
        !validText(receipt.crm_receipt_id, 160, 1)
      )
        throw Error("breero: invalid receipt.");
      return {
        downstreamStatus: receipt.downstream_status,
        downstreamId: receipt.crm_receipt_id,
      };
    },
  };
}
