import http from "node:http";
import { createHash } from "node:crypto";
import { uuid, pageOrigin, definePage, canonical, validText } from "@lp/core";
import { createIdempotencyStore } from "./idempotency.mjs";
import { validateSubmission, ValidationError } from "./validate.mjs";
import { createRateLimiter } from "./rate-limit.mjs";
import { verifyTurnstile } from "./spam.mjs";
import { parseFrontDeskOrigin, frontDeskConfig } from "@lp/core";

const MAX_BODY = 64 * 1024;

/**
 * The one backend every landing page talks to.
 *   GET  /healthz
 *   GET  /api/site-context                 (scoped by Host)
 *   POST /api/submissions/:kind            (Idempotency-Key required)
 * Sites, their pages and where their submissions go all live in the registry.
 */
export function createBackend({
  registry,
  store = createIdempotencyStore(),
  logger = console,
  now = () => new Date(),
  manifests = [],
  rateLimiter = createRateLimiter(),
  turnstileFetcher = fetch,
  frontDeskDemoOrigin,
}) {
  const demoOrigin = parseFrontDeskOrigin(frontDeskDemoOrigin);
  const pages = new Map(
    manifests.map((manifest) => {
      const { audiences, ...input } = manifest;
      const page = definePage(input);
      return [page.slug, page];
    }),
  );
  const server = http.createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Referrer-Policy", "no-referrer");
    const send = (status, body) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(req.method === "HEAD" ? undefined : JSON.stringify(body));
    };
    try {
      const raw = (req.url || "/").split("?")[0];
      if (raw === "/healthz" && req.method === "GET")
        return send(200, {
          status: "ok",
          sites: registry.sites().length,
          destinations: registry.destinationTypes,
        });
      const entry = registry.forHost(req.headers.host);
      if (!entry) return send(421, { error: "Unknown site." });
      const { site, destination } = entry;

      if (raw === "/api/site-context" && ["GET", "HEAD"].includes(req.method))
        return send(200, site);
      if (raw === "/api/front-desk") {
        if (!["GET", "HEAD"].includes(req.method))
          return send(405, { error: "Method not allowed." });
        return send(200, frontDeskConfig(demoOrigin, req.headers.host));
      }

      const match = /^\/api\/submissions\/([a-z-]+)$/.exec(raw);
      if (match) {
        if (req.method !== "POST")
          return send(405, { error: "Method not allowed." });
        if (!site.submissionsEnabled)
          return send(503, {
            error: "Submissions are not enabled for this site.",
          });
        const origin = req.headers.origin;
        let parsedOrigin;
        try {
          parsedOrigin = new URL(origin);
        } catch {
          return send(403, { error: "A valid HTTP Origin is required." });
        }
        const allowedOrigins = new Set([
          site.publicOrigin,
          ...site.pages.map((page) => pageOrigin(site, page.slug)),
        ]);
        if (
          typeof origin !== "string" ||
          parsedOrigin.origin !== origin ||
          !allowedOrigins.has(origin)
        )
          return send(403, { error: "Foreign HTTP Origin." });
        const limit = rateLimiter.take(
          site.siteId,
          req.socket.remoteAddress || "unknown",
          entry.rateLimit,
        );
        if (!limit.allowed) {
          res.setHeader("Retry-After", String(limit.retryAfter));
          return send(429, { error: "Please wait before trying again." });
        }
        const key = req.headers["idempotency-key"];
        if (typeof key !== "string" || !uuid.test(key))
          return send(400, { error: "Idempotency-Key must be a UUID." });
        if (!/^application\/json\b/.test(req.headers["content-type"] || ""))
          return send(415, { error: "JSON body required." });
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > MAX_BODY) return send(413, { error: "Body too large." });
          chunks.push(chunk);
        }
        const text = Buffer.concat(chunks).toString("utf8");
        let body;
        try {
          body = JSON.parse(text);
        } catch {
          return send(400, { error: "Invalid JSON." });
        }
        const submitted = body?.request ?? body?.application;
        const slug = submitted?.service_slug ?? submitted?.trade;
        const cleaned = validateSubmission(site, match[1], body, {
          manifest: pages.get(slug),
        });
        if (cleaned.sourceOrigin !== origin)
          return send(403, {
            error: "HTTP Origin does not match the source page.",
          });
        const payload = {
          schemaVersion: 3,
          ...(cleaned.request
            ? { request: cleaned.request }
            : { application: cleaned.application }),
          consentIntent: cleaned.consent,
          attribution: cleaned.attribution,
        };
        // Transport spam tokens are intentionally excluded from request identity.
        const identity = JSON.stringify(canonical({ kind: match[1], payload }));
        const prior = store.lookup(site.siteId, key, identity);
        if (prior.status === "replay")
          return prior.receipt
            ? send(200, prior.receipt)
            : send(409, { error: "Request in progress." });
        if (prior.status === "conflict")
          return send(409, {
            error: "Idempotency-Key reused with a different body.",
          });
        store.reserve(site.siteId, key, identity);
        try {
          await verifyTurnstile({
            config: entry.turnstile,
            token: body.turnstileToken,
            ip: req.socket.remoteAddress || "",
            hostname: parsedOrigin.hostname,
            fetcher: turnstileFetcher,
          });
        } catch (error) {
          store.release(site.siteId, key);
          throw error;
        }
        const fingerprint = createHash("sha256").update(identity).digest("hex");
        const trace = createHash("sha256")
          .update(`${site.siteId}:${key}`)
          .digest("hex");
        // Stable trace UUID, not a second business record or a CRM identity.
        const requestId = `${trace.slice(0, 8)}-${trace.slice(8, 12)}-5${trace.slice(13, 16)}-8${trace.slice(17, 20)}-${trace.slice(20, 32)}`;
        const receivedAt = now().toISOString();
        const submission = {
          kind: match[1],
          siteId: site.siteId,
          workspaceId: site.workspaceId,
          requestId,
          idempotencyKey: key,
          page: cleaned.route.slug,
          audience: cleaned.route.audience,
          locale: cleaned.route.locale,
          receivedAt,
          payload,
          payloadFingerprint: fingerprint,
        };
        let result;
        try {
          result = await destination.deliver(submission);
          if (
            !(
              destination.type === "log" &&
              result?.downstreamStatus === "LOGGED"
            ) &&
            !(
              result?.downstreamStatus === "CRM_ACCEPTED" &&
              validText(result.downstreamId, 160, 1)
            )
          )
            throw Error("Canonical CRM acceptance was not confirmed.");
        } catch (error) {
          store.release(site.siteId, key);
          logger.error(
            JSON.stringify({
              event: "delivery-failed",
              siteId: site.siteId,
              requestId,
              destination: destination.type,
              error: String(error?.message || error),
            }),
          );
          return send(502, {
            error:
              "CRM acceptance was not confirmed. The delivery outcome may be uncertain; retain this request reference for reconciliation.",
            request_id: requestId,
          });
        }
        const receipt = {
          request_id: requestId,
          status:
            result.downstreamStatus === "CRM_ACCEPTED"
              ? "REQUEST_ACCEPTED"
              : "DELIVERY_LOGGED",
          downstream_status: result.downstreamStatus,
          ...(result.downstreamStatus === "CRM_ACCEPTED"
            ? { crm_receipt_id: result.downstreamId }
            : {}),
        };
        await store.commit(site.siteId, key, receipt, {
          ...submission,
          destination: destination.type,
          downstreamStatus: result.downstreamStatus,
          downstreamId: result.downstreamId ?? null,
        });
        logger.log(
          JSON.stringify({
            event:
              receipt.status === "REQUEST_ACCEPTED"
                ? "submission-accepted"
                : "delivery-logged",
            siteId: site.siteId,
            page: cleaned.route.slug,
            kind: match[1],
            requestId,
            destination: destination.type,
          }),
        );
        return send(receipt.status === "REQUEST_ACCEPTED" ? 201 : 202, receipt);
      }
      return send(404, { error: "Not found." });
    } catch (error) {
      if (error instanceof ValidationError)
        return send(error.status, { error: error.message });
      logger.error(
        JSON.stringify({
          event: "backend-error",
          error: String(error?.message || error),
        }),
      );
      return send(500, { error: "Internal error." });
    }
  });
  server.requestTimeout = 20000;
  server.headersTimeout = 10000;
  server.maxHeadersCount = 40;
  return server;
}
