import test from "node:test";
import assert from "node:assert/strict";
import { site } from "../fixtures.ts";
import { readSiteBootstrap } from "../../packages/ui/src/siteContext.ts";

const element = (
  value: unknown,
  type = "application/json",
  tagName = "SCRIPT",
) => ({
  tagName,
  textContent: typeof value === "string" ? value : JSON.stringify(value),
  getAttribute: (name: string) => (name === "type" ? type : null),
});
test("bootstrap accepts only validated public context for the current host", () => {
  const context = site();
  const data = { hostname: "fixture.example.org", site: context };
  assert.deepEqual(
    readSiteBootstrap(element(data), "fixture.example.org"),
    context,
  );
  assert.equal(readSiteBootstrap(element(data), "other.example.org"), null);
  assert.equal(
    readSiteBootstrap(element(data, "text/javascript"), data.hostname),
    null,
  );
  assert.equal(
    readSiteBootstrap(element(data, "application/json", "DIV"), data.hostname),
    null,
  );
  assert.equal(readSiteBootstrap(element("{broken"), data.hostname), null);
  assert.equal(
    readSiteBootstrap(element({ ...data, site: {} }), data.hostname),
    null,
  );
  assert.equal(readSiteBootstrap(null, data.hostname), null);
});
