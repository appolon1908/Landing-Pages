import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createLandingServer } from "../server/index.mjs";

test("direct policy URLs expose escaped host-specific content without JavaScript", async (t) => {
  const dist = await mkdtemp(join(tmpdir(), "landing-policies-"));
  await writeFile(
    join(dist, "index.html"),
    '<html lang="en"><head></head><body><div id="app"></div></body></html>',
  );
  const registry = ["a.localhost", "b.localhost"].map((host, i) => ({
    hosts: [host],
    site: {
      schemaVersion: 1,
      siteId: `policy-${i}`,
      workspaceId: `00000000-0000-4000-8000-00000000000${i + 1}`,
      brand: {
        name: i ? "Merchant B" : "Merchant A <script>alert(1)</script> $&",
        accent: "#176951",
      },
      publicOrigin: `http://${host}:4173`,
      offerings: ["hvac-heating"],
      mode: "preview",
      submissionsEnabled: false,
    },
  }));
  const server = createLandingServer({ dist, registry });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(dist, { recursive: true, force: true });
  });
  const request = (path, host = "a.localhost", method = "GET") =>
    new Promise((resolve, reject) => {
      const req = http.request(
        {
          host: "127.0.0.1",
          port: server.address().port,
          path,
          method,
          headers: { host, "x-forwarded-host": "b.localhost" },
        },
        (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () =>
            resolve({ status: res.statusCode, body, headers: res.headers }),
          );
        },
      );
      req.on("error", reject);
      req.end();
    });
  for (const locale of ["en", "es"])
    for (const document of ["privacy-policy", "terms", "about", "contact"]) {
      const result = await request(`/${locale}/${document}?site=policy-1`);
      assert.equal(result.status, 200);
      assert.match(result.body, /Merchant A/);
      assert.doesNotMatch(result.body, /Merchant B/);
      assert.doesNotMatch(result.body, /<script>alert\(1\)<\/script>/);
      assert.match(result.body, /\$&amp;/);
      assert.match(result.body, /<h1[ >]/);
      assert.match(result.body, new RegExp(`<html lang="${locale}"`));
      assert.match(
        result.body,
        new RegExp(`http://a.localhost:4173/${locale}/${document}`),
      );
    }
  const second = await request("/en/privacy-policy", "b.localhost");
  assert.match(second.body, /Merchant B/);
  assert.doesNotMatch(second.body, /Merchant A/);
  assert.equal((await request("/en/terms", "a.localhost", "HEAD")).body, "");
  assert.equal(
    (await request("/en/privacy-policy", "unknown.localhost")).status,
    421,
  );
  assert.equal((await request("/en/shipping")).status, 404);
  assert.equal((await request("/en/arbitrary-policy")).status, 404);
  assert.equal(
    (
      await request(
        "/api/public-submissions/service-requests",
        "a.localhost",
        "POST",
      )
    ).status,
    503,
  );
});
