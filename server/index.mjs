import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseSiteContext, resolvePage } from "../packages/contracts/site.ts";
import {
  getPolicyDocument,
  pageMetadata,
  resolvePolicy,
} from "../packages/compliance/pages.ts";
import { escapeHtml, renderPolicyBody } from "./policies.mjs";
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};
function hostname(host) {
  if (typeof host !== "string" || !/^[a-z0-9.-]+(?::[0-9]{1,5})?$/i.test(host))
    return null;
  return host.split(":")[0].toLowerCase();
}
export function createLandingServer({ dist, registry }) {
  const sites = new Map();
  if (!Array.isArray(registry) || !registry.length)
    throw Error("An explicit public-site registry is required.");
  for (const entry of registry) {
    const site = parseSiteContext(entry.site);
    if (!Array.isArray(entry.hosts) || !entry.hosts.length)
      throw Error("No verified host mapping.");
    for (const host of entry.hosts) {
      if (hostname(host) !== host || sites.has(host))
        throw Error("Invalid or duplicate host binding.");
      sites.set(host, site);
    }
  }
  const server = http.createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'; object-src 'none'",
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
          productionEffects: false,
          submissionsEnabled: false,
        });
      const site = sites.get(hostname(req.headers.host));
      if (!site) return send(421, { error: "Unknown site." });
      if (raw.startsWith("/api/public-submissions/"))
        return send(503, {
          error:
            "Submissions are disabled pending verified Breero company/site authorization.",
        });
      if (!["GET", "HEAD"].includes(req.method))
        return send(405, { error: "Method not allowed." });
      if (raw === "/api/site-context") return send(200, site);
      if (raw === "/robots.txt")
        return send(200, "User-agent: *\nDisallow: /\n", "text/plain");
      if (raw === "/sitemap.xml")
        return send(
          200,
          '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
          "application/xml",
        );
      if (/^\/assets\/[A-Za-z0-9_-]+\.(js|css|svg|png|webp|woff2)$/.test(raw)) {
        const path = join(resolve(dist), raw.slice(1));
        if (!(await stat(path)).isFile())
          return send(404, { error: "Not found." });
        const bytes = await readFile(path);
        res.writeHead(200, {
          "Content-Type": types[raw.slice(raw.lastIndexOf("."))],
          "Content-Length": bytes.length,
        });
        return res.end(req.method === "HEAD" ? undefined : bytes);
      }
      const route = resolvePage(raw);
      const policy = resolvePolicy(raw);
      if (policy && !getPolicyDocument(site, policy))
        return send(404, { error: "Document not available." });
      if (
        raw !== "/" &&
        !policy &&
        (!route || !site.offerings.includes(route.offering))
      )
        return send(404, { error: "Page not found." });
      const selected = policy ||
        route || {
          locale: "en",
          audience: "landing",
          offering: site.offerings[0],
          thankYou: false,
        };
      const metadata = pageMetadata(site, selected);
      let html = await readFile(join(dist, "index.html"), "utf8");
      const meta =
        `<title>${escapeHtml(metadata.title)}</title><meta name="description" content="${escapeHtml(metadata.description)}"><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="${escapeHtml(metadata.canonical)}">` +
        ["en", "es"]
          .map(
            (locale) =>
              `<link rel="alternate" hreflang="${locale}" href="${escapeHtml(metadata.alternates[locale])}">`,
          )
          .join("");
      html = html
        .replace(/<title>.*?<\/title>/s, "")
        .replace("</head>", () => meta + "</head>")
        .replace('<html lang="en">', `<html lang="${selected.locale}">`);
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

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const registry = JSON.parse(
    await readFile(
      process.env.SITE_REGISTRY_FILE ||
        new URL("../config/sites.preview.json", import.meta.url),
      "utf8",
    ),
  );
  const server = createLandingServer({
    dist: process.env.DIST_DIR || new URL("../dist", import.meta.url).pathname,
    registry,
  });
  const port = Number(process.env.PORT || 4173);
  server.listen(port, process.env.HOST || "127.0.0.1", () =>
    console.log(
      `Landing preview listening on ${port}; submissions and production effects disabled.`,
    ),
  );
  for (const signal of ["SIGTERM", "SIGINT"])
    process.on(signal, () => server.close(() => process.exit(0)));
}
