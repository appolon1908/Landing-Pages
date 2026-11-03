import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createPageServer } from "../../packages/page-kit/src/serve.mjs";
import { intakeManifest } from "../intake-fixtures.ts";
import { call } from "../http.mjs";

test("page proxy rejects oversized bodies before forwarding and preserves only the real Origin", async () => {
  let posts = 0;
  let headers;
  const backend = http.createServer((req, res) => {
    posts++;
    headers = req.headers;
    req.resume();
    req.on("end", () => {
      res.writeHead(429, {
        "Content-Type": "application/json",
        "Retry-After": "10",
      });
      res.end("{}");
    });
  });
  await new Promise((resolve) => backend.listen(0, "127.0.0.1", resolve));
  const page = createPageServer({
    manifest: intakeManifest,
    dist: ".",
    backendUrl: `http://127.0.0.1:${backend.address().port}`,
  });
  await new Promise((resolve) => page.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${page.address().port}`;
  try {
    const large = await call(base, "/api/submissions/service-requests", {
      method: "POST",
      body: "x".repeat(65537),
    });
    assert.equal(large.status, 413);
    assert.equal(posts, 0);
    const small = await call(base, "/api/submissions/service-requests", {
      method: "POST",
      body: {},
      headers: {
        Origin: "https://fixture.example.org",
        "X-Forwarded-For": "1.1.1.1",
      },
    });
    assert.equal(small.status, 429);
    assert.equal(small.headers["retry-after"], "10");
    assert.equal(headers.origin, "https://fixture.example.org");
    assert.equal(headers["x-forwarded-for"], undefined);
  } finally {
    page.close();
    backend.close();
  }
});
