import test from "node:test";
import assert from "node:assert/strict";
import {
  frontDeskConfig,
  frontDeskDemoLink,
  parseFrontDeskConfig,
  parseFrontDeskOrigin,
} from "@lp/core";

test("demo source context is bounded presentation metadata for all three locales and audiences", () => {
  const config = frontDeskConfig("http://127.0.0.1:54253", "localhost");
  for (const mode of ["voice", "form"] as const) {
    for (const locale of ["es", "en", "fr"] as const) {
      for (const audience of ["landing", "business"] as const) {
        const link = new URL(
          frontDeskDemoLink(
            config,
            { locale, audience, service: "hvac" },
            mode,
          )!,
        );
        assert.equal(link.origin, "http://127.0.0.1:54253");
        assert.deepEqual(
          [...link.searchParams],
          [
            ["source", "breero"],
            ["service", "hvac"],
            ["audience", audience],
            ["locale", locale],
            ["mode", mode],
          ],
        );
      }
      const home = new URL(
        frontDeskDemoLink(config, { locale, audience: "home" }, mode)!,
      );
      assert.deepEqual(
        [...home.searchParams],
        [
          ["source", "breero"],
          ["audience", "home"],
          ["locale", locale],
          ["mode", mode],
        ],
      );
    }
  }
  // New validated manifests do not need to be added to a second closed catalog.
  assert.ok(
    frontDeskDemoLink(
      config,
      {
        locale: "es",
        audience: "landing",
        service: "future-approved-service",
      },
      "form",
    ),
  );
  assert.equal(
    frontDeskDemoLink(
      frontDeskConfig(null, "localhost"),
      {
        locale: "es",
        audience: "home",
      },
      "voice",
    ),
    null,
  );
});

test("unsafe configuration and forged source context cannot create a launch link", () => {
  const config = frontDeskConfig("http://localhost:4317", "localhost");
  assert.equal(
    parseFrontDeskOrigin("http://localhost:4317/"),
    "http://localhost:4317",
  );
  for (const bad of [
    { ...config, demoOrigin: "https://attacker.example" },
    { ...config, productionSchedulingEnabled: true },
    { ...config, workspaceId: "forged" },
    { ...config, available: false },
    { ...config, reason: "not-configured" },
    { ...config, mode: "production" },
  ])
    assert.throws(() => parseFrontDeskConfig(bad));
  for (const context of [
    { audience: "home", locale: "xx" },
    { audience: "staff", locale: "en" },
    { audience: "landing", locale: "en", service: "hvac&tenant=other" },
    { audience: "business", locale: "fr", service: "../plumbing" },
    { audience: "landing", locale: "es", service: "a".repeat(81) },
    { audience: "home", locale: "en", service: "hvac" },
  ])
    assert.throws(() => frontDeskDemoLink(config, context as never, "voice"));
  for (const mode of [
    undefined,
    "",
    "chat",
    "voice&tenant=other",
    "https://other.example",
  ])
    assert.throws(() =>
      frontDeskDemoLink(
        config,
        { audience: "home", locale: "en" },
        mode as never,
      ),
    );
});
