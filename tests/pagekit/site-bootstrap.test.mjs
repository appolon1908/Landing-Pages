import test from "node:test";
import assert from "node:assert/strict";
import { renderSiteBootstrap } from "../../packages/page-kit/src/site-bootstrap.mjs";

test("public context round-trips without closing its inert script or adding HTML", () => {
  const site = {
    brand: { name: '</script><img src=x onerror="alert(1)">&\u2028\u2029' },
  };
  const html = renderSiteBootstrap("fixture.example.org", site);
  const data = html.match(
    /^<script id="lp-site-context" type="application\/json">([^<]*)<\/script>$/,
  );
  assert.ok(data);
  assert.deepEqual(JSON.parse(data[1]), {
    hostname: "fixture.example.org",
    site,
  });
  assert.doesNotMatch(data[1], /[<>&\u2028\u2029]/);
});
