import { createHmac } from "node:crypto";
import { webhook } from "./webhook.mjs";

/** Optional workflow transport. Acceptance still requires the CRM's canonical receipt. */
export function n8n(config, fetcher = fetch) {
  if (
    typeof config.authEnv !== "string" ||
    !/^[A-Z][A-Z0-9_]{1,63}$/.test(config.authEnv)
  )
    throw Error(
      "n8n: authEnv must name the signing secret environment variable.",
    );
  const adapter = webhook(
    { ...config, authEnv: undefined },
    async (url, init) => {
      const secret = process.env[config.authEnv];
      if (!secret) throw Error("n8n: signing secret is not configured.");
      return fetcher(url, {
        ...init,
        headers: {
          ...init.headers,
          "X-Breero-Signature":
            "sha256=" +
            createHmac("sha256", secret).update(init.body).digest("hex"),
        },
      });
    },
  );
  return { type: "n8n", deliver: adapter.deliver };
}
