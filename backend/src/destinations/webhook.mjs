import { parseOrigin } from "@lp/core";

/**
 * Generic CRM / automation destination: POST the submission as JSON.
 *   { "type": "webhook", "url": "https://hooks.example.com/x", "authEnv": "CRM_TOKEN",
 *     "authScheme": "Bearer", "headers": { "X-Custom": "value" } }
 * The token value comes from process.env[authEnv]; it is never stored in the registry.
 */
export function webhook(config, fetcher = fetch) {
  const url = new URL(config.url);
  if (url.username || url.password)
    throw Error(
      "webhook: URL credentials are forbidden; use environment-backed authentication.",
    );
  parseOrigin(url.origin + "/");
  if (
    config.authEnv !== undefined &&
    !/^[A-Z][A-Z0-9_]{1,63}$/.test(config.authEnv)
  )
    throw Error("webhook: authEnv must be an environment variable name.");
  const extra = config.headers ?? {};
  for (const [k, v] of Object.entries(extra))
    if (
      !/^[A-Za-z0-9-]{1,64}$/.test(k) ||
      typeof v !== "string" ||
      v.length > 512
    )
      throw Error("webhook: invalid header.");
  return {
    type: "webhook",
    async deliver(submission) {
      if (config.idempotencyContract !== "site-key-payload")
        throw Error(
          "CRM idempotency contract must be explicitly confirmed before forwarding.",
        );
      const headers = { "Content-Type": "application/json", ...extra };
      if (config.authEnv) {
        const token = process.env[config.authEnv];
        if (!token) throw Error(`webhook: ${config.authEnv} is not set.`);
        headers.Authorization = `${config.authScheme ?? "Bearer"} ${token}`;
      }
      headers["Idempotency-Key"] =
        `${submission.siteId}:${submission.idempotencyKey}`;
      const response = await fetcher(url, {
        method: "POST",
        headers,
        body: JSON.stringify(submission),
        redirect: "error",
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw Error(`webhook: upstream ${response.status}.`);
      let downstreamId;
      try {
        const body = await response.json();
        if (
          body?.accepted === true &&
          typeof body.id === "string" &&
          body.id.trim().length > 0 &&
          body.id.length <= 160 &&
          !/[\u0000-\u001f\u007f]/.test(body.id)
        )
          downstreamId = body.id;
      } catch {
        /* An ambiguous acknowledgment is not a canonical CRM receipt. */
      }
      if (!downstreamId)
        throw Error(
          "CRM receipt is missing or invalid; delivery outcome is uncertain.",
        );
      return { downstreamStatus: "CRM_ACCEPTED", downstreamId };
    },
  };
}
