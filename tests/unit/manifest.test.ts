import test from "node:test";
import assert from "node:assert/strict";
import { getTemplate, locales } from "@lp/core";
import { loadManifests } from "../fixtures.ts";
import { readFile, readdir } from "node:fs/promises";

test("all canonical service packages export complete trilingual audience manifests", async () => {
  const manifests = await loadManifests();
  const map = JSON.parse(
    await readFile("docs/missions/inputs/service-content-map.json", "utf8"),
  );
  assert.deepEqual(
    manifests.map((m) => m.slug).sort(),
    map.services.map((s: { slug: string }) => s.slug).sort(),
  );
  for (const manifest of manifests)
    for (const locale of locales)
      for (const audience of ["landing", "business"] as const) {
        const template = getTemplate(manifest, audience, locale);
        assert.ok(
          template.name &&
            template.title &&
            template.description &&
            template.questions.length,
        );
      }
  const packages = (await readdir("pages", { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  assert.equal(packages.length, 31);
  assert.ok(packages.includes("home"));
});
