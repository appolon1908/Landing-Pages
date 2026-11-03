import test from "node:test";
import assert from "node:assert/strict";
import {
  pageHref,
  pageLabel,
  parseSiteContext,
  resolvePage,
  siteSlugs,
} from "@lp/core";
import { site, siteDocument } from "../fixtures.ts";

test("site context v3 parses pages with labels and per-page origins", () => {
  const s = site();
  assert.deepEqual(siteSlugs(s), ["hvac-heating", "chimney-fireplace"]);
  assert.equal(pageLabel(s.pages[0]!, "es"), "Calefacción");
  assert.equal(pageLabel(s.pages[1]!, "en"), "Chimney fireplace");
  assert.equal(
    pageHref(s, {
      locale: "en",
      audience: "landing",
      slug: "chimney-fireplace",
    }),
    "https://chimney.example.org/en/landing/chimney-fireplace",
  );
  assert.equal(
    pageHref(s, { locale: "es", audience: "business", slug: "hvac-heating" }),
    "/es/business/hvac-heating",
  );
});

test("site context rejects unknown fields, unsafe origins and impossible flags", () => {
  for (const bad of [
    { extra: true },
    { schemaVersion: 2 },
    { publicOrigin: "http://fixture.example.org" },
    { publicOrigin: "https://fixture.example.org/path" },
    { publicOrigin: "https://user:pw@fixture.example.org" },
    { pages: [] },
    { pages: ["hvac-heating", "hvac-heating"] },
    { pages: [{ slug: "Bad Slug" }] },
    { pages: [{ slug: "ok", origin: "javascript:alert(1)" }] },
    { pages: [{ slug: "ok", label: { en: "x" } }] },
    { mode: "live", submissionsEnabled: "yes" },
    { mode: "preview", submissionsEnabled: true },
    { mode: "draft" },
    { brand: { name: "X", accent: "green" } },
    { siteId: "../x" },
    { workspaceId: "nope" },
  ])
    assert.throws(
      () => parseSiteContext(siteDocument(bad)),
      `accepted ${JSON.stringify(bad)}`,
    );
  assert.equal(
    parseSiteContext(siteDocument({ mode: "live", submissionsEnabled: true }))
      .submissionsEnabled,
    true,
  );
  assert.equal(
    parseSiteContext(siteDocument({ publicOrigin: "http://localhost:4173" }))
      .publicOrigin,
    "http://localhost:4173",
  );
});

test("only explicit audience, locale and slug routes are accepted", () => {
  assert.deepEqual(resolvePage("/es/business/hvac-heating"), {
    locale: "es",
    audience: "business",
    slug: "hvac-heating",
    thankYou: false,
  });
  assert.equal(
    resolvePage("/en/landing/anything-goes/thank-you")?.thankYou,
    true,
  );
  for (const path of [
    "/de/landing/hvac-heating",
    "/en/admin/hvac-heating",
    "/en/landing/../business/hvac-heating",
    "/en/landing/hvac-heating/extra",
    "/en/landing/Hvac",
    "/en/landing/",
  ])
    assert.equal(resolvePage(path), null, path);
});
