import http from "node:http";
import https from "node:https";
import { readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  getPolicyDocument,
  locales,
  defaultLocale,
  resolveHome,
  pageOrigin,
  pageMetadata,
  parseSiteContext,
  resolvePage,
  resolvePolicy,
  siteSlugs,
} from "@lp/core";
import { renderSiteBootstrap } from "./site-bootstrap.mjs";
import { escapeHtml, renderPolicyBody } from "./policy-html.mjs";

const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
const hostOf = (host) =>
  typeof host === "string" && /^[a-z0-9.-]+(?::[0-9]{1,5})?$/i.test(host)
    ? host.split(":")[0].toLowerCase()
    : null;
const maxSiteCacheEntries = 256;

/**
 * Serves one built landing page. The page is independent: it only knows its
 * own manifest and the backend URL. Site context comes from the backend, keyed
 * by the request Host, so the same image can serve several brands.
 */
export function createPageServer({
  manifest,
  dist,
  backendUrl,
  cacheMs = 30000,
  // Explicit operator switch; preview tenants and other brands stay tag-free.
  metaPixelEnabled = process.env.LP_BREERO_META_PIXEL_ENABLED === "true",
}) {
  const isHome = manifest.kind === "home";
  const backend = new URL(backendUrl);
  const client = backend.protocol === "https:" ? https : http;
  const cache = new Map();
  /**
   * Call the backend with the public Host so it can scope the site. WHATWG
   * fetch drops a custom Host header, so this uses node:http directly.
   */
  function backendRequest(host, method, path, headers = {}, body = null) {
    return new Promise((resolvePromise, reject) => {
      const request = client.request(
        new URL(path, backend),
        {
          method,
          headers: {
            ...headers,
            host,
            "x-lp-page": isHome ? "home" : manifest.slug,
          },
          timeout: 20000,
        },
        (response) => {
          const chunks = [];
          response.on("data", (c) => chunks.push(c));
          response.on("end", () =>
            resolvePromise({
              status: response.statusCode,
              type: response.headers["content-type"] || "application/json",
              retryAfter: response.headers["retry-after"],
              body: Buffer.concat(chunks),
            }),
          );
        },
      );
      request.on("timeout", () => request.destroy(Error("Backend timeout.")));
      request.on("error", reject);
      if (body) request.write(body);
      request.end();
    });
  }
  async function siteFor(host) {
    const hit = cache.get(host);
    if (hit && hit.until > Date.now()) return hit.site;
    if (hit) cache.delete(host);
    let site = null;
    try {
      const response = await backendRequest(host, "GET", "/api/site-context");
      if (response.status === 200)
        site = parseSiteContext(JSON.parse(response.body.toString("utf8")));
    } catch {
      site = null;
    }
    const now = Date.now();
    // Untrusted Host churn must stay bounded. Reclaim expired entries before
    // evicting the oldest live entry, preserving short negative-cache hits.
    for (const [key, entry] of cache) if (entry.until <= now) cache.delete(key);
    // A concurrent lookup may have populated this host while awaiting I/O.
    cache.delete(host);
    const ttl = site ? cacheMs : 2000;
    if (ttl > 0) {
      if (cache.size >= maxSiteCacheEntries)
        cache.delete(cache.keys().next().value);
      cache.set(host, { site, until: now + ttl });
    }
    return site;
  }
  async function proxy(req, res, host) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 64 * 1024) {
        res.writeHead(413, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ error: "Body too large." }));
        return;
      }
      chunks.push(chunk);
    }
    const headers = {
      "content-type": req.headers["content-type"] || "application/json",
    };
    for (const h of ["idempotency-key", "x-correlation-id", "origin"])
      if (req.headers[h]) headers[h] = req.headers[h];
    try {
      const upstream = await backendRequest(
        host,
        req.method,
        req.url,
        headers,
        chunks.length ? Buffer.concat(chunks) : null,
      );
      res.writeHead(upstream.status, {
        "Content-Type": upstream.type,
        ...(upstream.retryAfter ? { "Retry-After": upstream.retryAfter } : {}),
      });
      res.end(upstream.body);
    } catch {
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Backend unavailable." }));
    }
  }
  const server = http.createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'; object-src 'none'",
    );
    const send = (status, body, type = "application/json") => {
      res.writeHead(status, { "Content-Type": `${type}; charset=utf-8` });
      res.end(
        req.method === "HEAD"
          ? undefined
          : typeof body === "string"
            ? body
            : JSON.stringify(body),
      );
    };
    try {
      const raw = (req.url || "/").split("?")[0];
      if (raw === "/healthz" && req.method === "GET")
        return send(200, {
          status: "ok",
          page: isHome ? "home" : manifest.slug,
        });
      const host = hostOf(req.headers.host);
      if (!host) return send(421, { error: "Unknown site." });
      if (raw.startsWith("/api/")) return proxy(req, res, host);
      if (!["GET", "HEAD"].includes(req.method))
        return send(405, { error: "Method not allowed." });
      const site = await siteFor(host);
      if (!site) return send(421, { error: "Unknown site." });
      const liveBreero =
        site.mode === "live" &&
        site.brand.name.trim().toLowerCase() === "breero";
      const breeroPixel = liveBreero && metaPixelEnabled;
      const breeroGhl =
        liveBreero && process.env.LP_BREERO_DIRECT_GHL_ENABLED === "true";
      if (breeroPixel || breeroGhl) {
        const scriptSrc = breeroPixel
          ? "'self' https://connect.facebook.net"
          : "'self'";
        const imageSrc = breeroPixel
          ? "'self' data: https://www.facebook.com"
          : "'self' data:";
        const connectSrc = [
          "'self'",
          ...(breeroPixel
            ? ["https://www.facebook.com", "https://connect.facebook.net"]
            : []),
          ...(breeroGhl ? ["https://services.leadconnectorhq.com"] : []),
        ].join(" ");
        res.setHeader(
          "Content-Security-Policy",
          `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src ${imageSrc}; connect-src ${connectSrc}; frame-ancestors 'none'; form-action 'none'; base-uri 'none'; object-src 'none'`,
        );
      }
      if (!isHome && !siteSlugs(site).includes(manifest.slug))
        return send(404, { error: "Page not offered by this site." });
      if (
        /^\/assets\/[A-Za-z0-9_.-]+\.(js|css|svg|png|webp|woff2|ico)$/.test(raw)
      ) {
        const path = join(resolve(dist), raw.slice(1));
        if (!(await stat(path)).isFile())
          return send(404, { error: "Not found." });
        const bytes = await readFile(path);
        res.writeHead(200, {
          "Content-Type": types[raw.slice(raw.lastIndexOf("."))],
          "Content-Length": bytes.length,
          "Cache-Control": "public, max-age=31536000, immutable",
        });
        return res.end(req.method === "HEAD" ? undefined : bytes);
      }
      res.setHeader("Cache-Control", "no-store");
      const noindex = site.mode === "preview";
      if (noindex) res.setHeader("X-Robots-Tag", "noindex, nofollow");
      if (raw === "/robots.txt")
        return send(
          200,
          noindex
            ? "User-agent: *\nDisallow: /\n"
            : "User-agent: *\nAllow: /\n",
          "text/plain",
        );
      if (raw === "/sitemap.xml") {
        const urls = noindex
          ? []
          : locales.flatMap((locale) =>
              isHome
                ? [`${site.publicOrigin}/${locale}/`]
                : manifest.audiences.map(
                    (audience) =>
                      `${pageOrigin(site, manifest.slug)}/${locale}/${audience}/${manifest.slug}`,
                  ),
            );
        return send(
          200,
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${escapeHtml(u)}</loc></url>`).join("")}</urlset>`,
          "application/xml",
        );
      }
      if (raw === "/") {
        res.writeHead(302, {
          Location: isHome
            ? `/${defaultLocale}/`
            : `/${defaultLocale}/landing/${manifest.slug}`,
        });
        return res.end();
      }
      const route = isHome ? resolveHome(raw) : resolvePage(raw);
      const policy = resolvePolicy(raw);
      if (policy && !getPolicyDocument(site, policy))
        return send(404, { error: "Document not available." });
      if (!policy && (!route || (!isHome && route.slug !== manifest.slug)))
        return send(404, { error: "Page not found." });
      const selected = policy || route;
      const metadata = pageMetadata(site, selected, manifest);
      let html = await readFile(join(dist, "index.html"), "utf8");
      if (site.brand.name.trim().toLowerCase() !== "breero")
        html = html.replace(
          /<link\b(?=[^>]*\sdata-breero-icon(?:\s|=|\/?>))[^>]*>/gi,
          "",
        );
      const meta =
        `<title>${escapeHtml(metadata.title)}</title><meta name="description" content="${escapeHtml(metadata.description)}">` +
        (noindex ? `<meta name="robots" content="noindex,nofollow">` : "") +
        `<link rel="canonical" href="${escapeHtml(metadata.canonical)}">` +
        [...locales, "x-default"]
          .map(
            (l) =>
              `<link rel="alternate" hreflang="${l}" href="${escapeHtml(metadata.alternates[l])}">`,
          )
          .join("");
      // Inert public configuration; the browser injects executable code into
      // <head> only after explicit advertising consent. Never send a noscript
      // beacon: JavaScript-free visitors cannot grant the required consent.
      const pixelMeta = breeroPixel
        ? '<meta name="lp-meta-pixel-id" content="965185126235275">'
        : "";
      const ghlMeta = breeroGhl
        ? '<meta name="lp-ghl-intake-enabled" content="true">'
        : "";
      html = html
        .replace(/<title>.*?<\/title>/s, "")
        .replace(
          "</head>",
          () => meta + pixelMeta + ghlMeta + renderSiteBootstrap(host, site) + "</head>",
        )
        .replace(/<html lang="[^"]+">/, `<html lang="${selected.locale}">`);
      if (policy)
        html = html.replace(
          '<div id="app"></div>',
          () => `<div id="app">${renderPolicyBody(site, policy)}</div>`,
        );
      return send(200, html, "text/html");
    } catch {
      return send(404, { error: "Page unavailable." });
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.maxHeadersCount = 40;
  return server;
}

/** CLI entry used by every page's `npm start`. */
export async function startPageServer({ manifest, dist }) {
  const server = createPageServer({
    manifest,
    dist,
    backendUrl: process.env.BACKEND_URL || "http://127.0.0.1:4000",
  });
  const port = Number(process.env.PORT || 4173);
  server.listen(port, process.env.HOST || "127.0.0.1", () =>
    console.log(
      `Page "${manifest.kind === "home" ? "home" : manifest.slug}" listening on ${port}; backend ${process.env.BACKEND_URL || "http://127.0.0.1:4000"}.`,
    ),
  );
  for (const signal of ["SIGTERM", "SIGINT"])
    process.on(signal, () => server.close(() => process.exit(0)));
  return server;
}
