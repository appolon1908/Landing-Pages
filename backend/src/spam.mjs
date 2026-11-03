import { validText } from "@lp/core";
import { ValidationError } from "./validate.mjs";

/** Off unless explicitly configured. Only fake transports are used in tests. */
export async function verifyTurnstile({
  config,
  token,
  ip,
  hostname,
  fetcher = fetch,
  environment = process.env,
}) {
  if (!config) return;
  if (!validText(token, 2048, 1))
    throw new ValidationError("Spam verification token is required.");
  const secret = environment[config.secretEnv];
  if (!secret)
    throw new ValidationError("Spam verification is not configured.", 503);
  let response;
  try {
    response = await fetcher(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          remoteip: ip,
        }).toString(),
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      },
    );
    const result = response.ok ? await response.json() : null;
    if (result?.success !== true || result.hostname !== hostname)
      throw new ValidationError("Spam verification failed.");
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new ValidationError("Spam verification unavailable.", 503);
  }
}
