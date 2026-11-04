import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildRegistry } from "../../backend/src/registry.mjs";
import { createBackend } from "../../backend/src/server.mjs";
import { createPageServer } from "../../packages/page-kit/src/serve.mjs";
import { manifestInput } from "../manifest-fixture.ts";
import { definePage } from "@lp/core";
import { call } from "../http.mjs";
import { installFakeCrm } from "../fake-crm.mjs";
import { siteDocument, envelope, fixtureManifests } from "../fixtures.ts";

const quiet = { log() {}, error() {} };
const manifest = definePage({ ...manifestInput(), slug: "hvac-heating" });

async function stack(
  mode = "preview",
  destination = { type: "disabled" },
  options = {},
) {
  const { submissionsEnabled, ...site } = siteDocument({ mode });
  if (options.brandName)
    site.brand = { ...site.brand, name: options.brandName };
  const registry = buildRegistry([
    { hosts: ["fixture.example.org"], site, destination },
    {
      hosts: ["second.example.org"],
      site: {
        ...site,
        siteId: "second",
        workspaceId: "00000000-0000-4000-8000-000000000002",
        brand: { name: "Second", accent: "#365c82" },
        publicOrigin: "https://second.example.org",
        pages: options.secondPages || ["chimney-fireplace"],
      },
      destination: { type: "disabled" },
    },
  ]);
  const backend = createBackend({
    registry,
    manifests: fixtureManifests(),
    logger: quiet,
  });
  await new Promise((r) => backend.listen(0, "127.0.0.1", r));
  const dist = await mkdtemp(join(tmpdir(), "lp-dist-"));
  await mkdir(join(dist, "assets"));
  await writeFile(
    join(dist, "index.html"),
    '<!doctype html>\n<html lang="en"><head><title>x</title><link data-breero-icon rel="icon" href="/assets/favicon-supplied.ico"><link rel="icon" data-breero-icon="" href="/assets/favicon-32.png"><link rel="icon" href="/assets/favicon-16.png" data-breero-icon><link rel="icon" href="/assets/custom.ico" data-breero-icon-other></head><body><div id="app"></div><script type="module" src="/assets/index-abc.js"></script></body></html>',
  );
  await writeFile(join(dist, "assets", "index-abc.js"), "console.log(1)");
  await writeFile(
    join(dist, "assets", "favicon-supplied.ico"),
    await readFile(
      new URL(
        "../../packages/ui/src/assets/brand/favicon.ico",
        import.meta.url,
      ),
    ),
  );
  const page = createPageServer({
    manifest,
    dist,
    backendUrl: `http://127.0.0.1:${backend.address().port}`,
    cacheMs: 0,
    metaPixelEnabled: options.metaPixelEnabled ?? false,
    ghlIntakeEnabled: options.ghlIntakeEnabled ?? false,
  });
  await new Promise((r) => page.listen(0, "127.0.0.1", r));
  return {
    base: `http://127.0.0.1:${page.address().port}`,
    registry,
    close: () => (page.close(), backend.close()),
  };
}

test("page server renders only its own page for known hosts and injects metadata", async () => {
  const { base, close } = await stack();
  try {
    const home = await call(base, "/en/landing/hvac-heating");
    assert.equal(home.status, 200);
    assert.match(
      home.text,
      /<title>Air conditioning \| Fixture Services<\/title>/,
    );
    assert.match(
      home.text,
      /rel="canonical" href="https:\/\/fixture.example.org\/en\/landing\/hvac-heating"/,
    );
    assert.match(home.text, /noindex/);
    assert.equal(
      (await call(base, "/")).headers.location,
      "/en/landing/hvac-heating",
    );
    assert.equal(home.headers["cache-control"], "no-store");
    const bootstrap = JSON.parse(
      home.text.match(
        /<script id="lp-site-context" type="application\/json">([^<]*)<\/script>/,
      )[1],
    );
    assert.equal(bootstrap.hostname, "fixture.example.org");
    assert.equal(bootstrap.site.siteId, "fixture");
    assert.equal(bootstrap.site.submissionsEnabled, false);
    assert.equal(bootstrap.site.destination, undefined);
    const es = await call(base, "/es/business/hvac-heating");
    assert.match(es.text, /<html lang="es">/);
    assert.match(
      es.text,
      /hreflang="en" href="https:\/\/fixture.example.org\/en\/business\/hvac-heating"/,
    );
    assert.equal(
      (await call(base, "/en/landing/chimney-fireplace")).status,
      404,
    );
    assert.equal(
      (
        await call(base, "/en/landing/hvac-heating", {
          host: "second.example.org",
        })
      ).status,
      404,
      "page not offered by second site",
    );
    assert.equal((await call(base, "/", { host: "nope.example" })).status, 421);
    assert.equal((await call(base, "/assets/index-abc.js")).status, 200);
    assert.equal((await call(base, "/assets/../index.html")).status, 404);
    assert.equal(
      (await call(base, "/robots.txt")).text,
      "User-agent: *\nDisallow: /\n",
    );
    assert.doesNotMatch((await call(base, "/sitemap.xml")).text, /<loc>/);
    const policy = await call(base, "/es/privacy-policy");
    assert.match(
      policy.text,
      /<h1>Política de privacidad<\/h1>/,
      "policy readable without JavaScript",
    );
    assert.equal((await call(base, "/en/shipping")).status, 404);
    assert.equal(
      (await call(base, "/api/site-context")).json().siteId,
      "fixture",
    );
    assert.equal(
      (
        await call(base, "/api/site-context", { host: "second.example.org" })
      ).json().siteId,
      "second",
    );
  } finally {
    close();
  }
});

test("supplied icons follow validated brand on service and no-JS policy HTML while ICO keeps its MIME and host guard", async () => {
  const { base, close } = await stack(
    "preview",
    { type: "disabled" },
    {
      brandName: "  bReErO  ",
      secondPages: ["hvac-heating"],
    },
  );
  try {
    for (const locale of ["es", "en", "fr"]) {
      for (const path of [
        "landing/hvac-heating",
        "business/hvac-heating",
        "privacy-policy",
        "terms",
        "about",
        "contact",
      ]) {
        const page = await call(base, `/${locale}/${path}`);
        assert.equal(page.status, 200, path);
        assert.match(page.text, /href="\/assets\/favicon-supplied\.ico"/);
        assert.match(page.text, /href="\/assets\/favicon-32\.png"/);
        assert.match(page.text, /href="\/assets\/favicon-16\.png"/);
        const second = await call(base, `/${locale}/${path}`, {
          host: "second.example.org",
        });
        assert.equal(second.status, 200, path);
        assert.doesNotMatch(second.text, /href="\/assets\/favicon-/);
        assert.match(second.text, /href="\/assets\/custom\.ico"/);
        if (path === "privacy-policy") assert.match(second.text, /<article/);
      }
    }
    const favicon = await call(base, "/assets/favicon-supplied.ico");
    assert.equal(favicon.status, 200);
    assert.equal(favicon.headers["content-type"], "image/x-icon");
    assert.equal(Number(favicon.headers["content-length"]), 4467);
    assert.equal(
      (
        await call(base, "/assets/favicon-supplied.ico", {
          host: "unknown.invalid",
        })
      ).status,
      421,
    );
    assert.equal(
      (await call(base, "/assets/favicon-supplied.ico.json")).status,
      404,
    );
  } finally {
    close();
  }
});

test("live pages are indexable and submissions flow through the proxy to the backend", async () => {
  const delivered = [];
  const { base, registry, close } = await stack("live", {
    type: "log",
    sink: (l) => delivered.push(JSON.parse(l)),
  });
  installFakeCrm(registry, "fixture.example.org", (submission) =>
    delivered.push(submission),
  );
  try {
    assert.doesNotMatch(
      (await call(base, "/en/landing/hvac-heating")).text,
      /noindex/,
    );
    assert.match(
      (await call(base, "/sitemap.xml")).text,
      /<loc>https:\/\/fixture.example.org\/es\/business\/hvac-heating<\/loc>/,
    );
    const site = registry.forHost("fixture.example.org").site;
    const response = await call(base, "/api/submissions/service-requests", {
      method: "POST",
      body: envelope(site, "hvac-heating"),
      headers: {
        "Idempotency-Key": crypto.randomUUID(),
        Origin: "https://fixture.example.org",
      },
    });
    assert.equal(response.status, 201, response.text);
    assert.equal(response.json().status, "REQUEST_ACCEPTED");
    assert.equal(response.json().downstream_status, "CRM_ACCEPTED");
    assert.match(response.json().crm_receipt_id, /^crm-/);
    assert.equal(delivered.length, 1);
  } finally {
    close();
  }
});

test("BREERO Meta Pixel is opt-in configured only for live BREERO hosts", async () => {
  const variants = [
    {
      mode: "preview",
      brandName: "BREERO",
      metaPixelEnabled: true,
      expected: false,
    },
    {
      mode: "live",
      brandName: "Another Brand",
      metaPixelEnabled: true,
      expected: false,
    },
    {
      mode: "live",
      brandName: "BREERO",
      metaPixelEnabled: false,
      expected: false,
    },
    {
      mode: "live",
      brandName: "BREERO",
      metaPixelEnabled: true,
      expected: true,
    },
  ];
  for (const variant of variants) {
    const { base, close } = await stack(
      variant.mode,
      { type: "disabled" },
      variant,
    );
    try {
      const response = await call(base, "/en/landing/hvac-heating");
      assert.equal(response.status, 200);
      const policy = await call(base, "/es/privacy-policy");
      assert.equal(policy.status, 200);
      if (variant.expected) {
        assert.match(
          response.text,
          /<meta name="lp-meta-pixel-id" content="965185126235275">/,
        );
        assert.match(
          policy.text,
          /<meta name="lp-meta-pixel-id" content="965185126235275">/,
        );
        assert.match(
          response.headers["content-security-policy"],
          /script-src 'self' https:\/\/connect\.facebook\.net/,
        );
        assert.match(
          response.headers["content-security-policy"],
          /img-src 'self' data: https:\/\/www\.facebook\.com/,
        );
      } else {
        assert.doesNotMatch(response.text, /lp-meta-pixel-id/);
        assert.doesNotMatch(policy.text, /lp-meta-pixel-id/);
        assert.doesNotMatch(
          response.headers["content-security-policy"],
          /facebook/,
        );
      }
      assert.doesNotMatch(response.text, /fbevents\.js|facebook\.com\/tr\?/);
    } finally {
      close();
    }
  }
});


test("GHL browser destinations are enabled only for approved live BREERO site mode", async () => {
  for (const variant of [
    { mode: "preview", brandName: "BREERO", ghlIntakeEnabled: true, enabled: false },
    { mode: "live", brandName: "Another Brand", ghlIntakeEnabled: true, enabled: false },
    { mode: "live", brandName: "BREERO", ghlIntakeEnabled: false, enabled: false },
    { mode: "live", brandName: "BREERO", ghlIntakeEnabled: true, enabled: true },
  ]) {
    const { base, close } = await stack(variant.mode, { type: "disabled" }, variant);
    try {
      for (const route of ["/en/landing/hvac-heating", "/es/business/hvac-heating"]) {
        const page = await call(base, route);
        assert.equal(page.status, 200);
        if (variant.enabled) {
          assert.match(page.text, /<meta name="lp-ghl-intake-enabled" content="true">/);
          assert.match(page.headers["content-security-policy"], /connect-src 'self' https:\/\/services\.leadconnectorhq\.com/);
          assert.doesNotMatch(page.headers["content-security-policy"], /https:\/\/connect\.facebook\.net/);
        } else {
          assert.doesNotMatch(page.text, /lp-ghl-intake-enabled/);
          assert.doesNotMatch(page.headers["content-security-policy"], /leadconnectorhq/);
        }
        assert.doesNotMatch(page.text, /YOUR_HOMEOWNER_WEBHOOK_ID|YOUR_PRO_WEBHOOK_ID/);
      }
    } finally {
      close();
    }
  }
});
