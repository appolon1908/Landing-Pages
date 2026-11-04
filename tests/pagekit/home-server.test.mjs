import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildRegistry } from "../../backend/src/registry.mjs";
import { createBackend } from "../../backend/src/server.mjs";
import { createPageServer } from "../../packages/page-kit/src/serve.mjs";
import { siteDocument } from "../fixtures.ts";
import { call } from "../http.mjs";

test("homepage serves localized routes and no-JS French policy, failing closed for unknown hosts", async () => {
  const { submissionsEnabled, ...site } = siteDocument();
  site.brand = { ...site.brand, name: "BREERO" };
  const registry = buildRegistry([
    { hosts: ["fixture.example.org"], site, destination: { type: "disabled" } },
    {
      hosts: ["second.example.org"],
      site: {
        ...site,
        siteId: "second",
        workspaceId: "00000000-0000-4000-8000-000000000002",
        brand: { name: "Second", accent: "#365c82" },
        publicOrigin: "https://second.example.org",
      },
      destination: { type: "disabled" },
    },
  ]);
  const backend = createBackend({ registry });
  await new Promise((r) => backend.listen(0, "127.0.0.1", r));
  const dist = await mkdtemp(join(tmpdir(), "lp-home-test-"));
  await mkdir(join(dist, "assets"));
  await writeFile(join(dist, "assets", "app.js"), "/* fixture */");
  await writeFile(
    join(dist, "index.html"),
    '<html lang="es"><head><title>Home</title><link data-breero-icon rel="icon" href="/assets/favicon-supplied.ico"><link rel="icon" href="/assets/custom.ico"></head><body><div id="app"></div></body></html>',
  );
  const server = createPageServer({
    manifest: {
      kind: "home",
      title: { es: "Inicio", en: "Home", fr: "Accueil" },
      description: { es: "Vista previa", en: "Preview", fr: "Aperçu" },
    },
    dist,
    backendUrl: `http://127.0.0.1:${backend.address().port}`,
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const locale of ["es", "en", "fr"]) {
      for (const path of ["", "privacy-policy", "terms", "about", "contact"]) {
        const page = await call(base, `/${locale}/${path}`);
        assert.equal(page.status, 200, path);
        assert.match(page.text, /href="\/assets\/favicon-supplied\.ico"/);
        const second = await call(base, `/${locale}/${path}`, {
          host: "second.example.org",
        });
        assert.equal(second.status, 200, path);
        assert.doesNotMatch(
          second.text,
          /href="\/assets\/favicon-supplied\.ico"/,
        );
        assert.match(second.text, /href="\/assets\/custom\.ico"/);
        if (path === "privacy-policy") assert.match(second.text, /<article/);
      }
    }
    const root = await call(base, "/");
    assert.equal(root.status, 302);
    assert.equal(root.headers.location, "/en/");
    const fr = await call(base, "/fr/");
    assert.equal(fr.status, 200);
    assert.match(fr.text, /<html lang="fr">/);
    assert.match(
      fr.text,
      /hreflang="x-default" href="https:\/\/fixture.example.org\/en\/"/,
    );
    assert.match(
      (await call(base, "/fr/privacy-policy")).text,
      /Politique de confidentialité/,
    );
    assert.equal((await call(base, "/fr/landing/hvac")).status, 404);
    assert.equal(
      (await call(base, "/fr/", { host: "unknown.example" })).status,
      421,
    );
    assert.equal(
      (await call(base, "/assets/app.js", { host: "unknown.example" })).status,
      421,
    );
  } finally {
    server.close();
    backend.close();
  }
});
