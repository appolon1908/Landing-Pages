import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { marketFor } from "@lp/core";
import { buildRegistry, loadRegistryDir } from "../../backend/src/registry.mjs";

test("backend loads server-owned manifests for every service and excludes the corporate homepage", async () => {
  const { loadPageManifests } =
    await import("../../backend/src/manifests.mjs").catch(() => ({
      loadPageManifests: undefined,
    }));
  assert.equal(typeof loadPageManifests, "function");
  const manifests = await loadPageManifests(resolve("pages"));
  assert.equal(manifests.length, 30);
  assert.equal(
    manifests.some((item) => item.slug === "home"),
    false,
  );
  assert.ok(
    manifests.find((item) => item.slug === "hvac")?.customer.fr.subtypes
      .length >= 3,
  );
});

test("actual bundled preview registries provide a usable market without enabling destinations", async () => {
  const entries = await loadRegistryDir(resolve("config/registry"));
  const registry = buildRegistry(entries);
  assert.equal(registry.sites().length, 2);
  for (const site of registry.sites()) {
    assert.ok(
      marketFor(site.marketId)?.zones.length,
      `${site.siteId} has no usable market`,
    );
    assert.equal(site.mode, "preview");
    assert.equal(site.submissionsEnabled, false);
    assert.equal(registry.forSite(site.siteId).destination.type, "disabled");
  }
});
