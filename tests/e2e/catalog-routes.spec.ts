import { test, expect } from "./preview-fixtures.ts";
import { readFileSync } from "node:fs";
import type { PageManifest } from "@lp/core";
import homeManifest from "../../pages/home/page.config.ts";
import { homeCopy } from "../../packages/ui/src/homeCopy.ts";
import {
  audiences,
  coreRoutes,
  locales,
  origin,
  services,
  serviceUrl,
} from "./catalog.ts";
const brand = JSON.parse(
  readFileSync(
    new URL("../../config/registry/breero-preview.json", import.meta.url),
    "utf8",
  ),
).site.brand.name as string;
if (
  coreRoutes.length !== 183 ||
  new Set(coreRoutes.map((route) => route.url)).size !== 183
)
  throw Error("The blueprint requires 183 distinct core routes.");
for (const route of coreRoutes) {
  test(`route ${route.locale}/${route.audience || "home"}/${route.slug}`, async ({
    page,
  }) => {
    const response = await page.goto(route.url);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    // Read audience/locale copy directly; do not reuse the metadata renderer.
    if (route.audience) {
      const manifest = (
        await import(`../../pages/${route.slug}/page.config.ts`)
      ).default as PageManifest;
      const copy =
        manifest[route.audience === "landing" ? "customer" : "provider"][
          route.locale
        ];
      await expect(page.locator("h1")).toHaveText(copy.headline);
      await expect(page).toHaveTitle(`${copy.name} | ${brand}`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        copy.subhead,
      );
    } else {
      await expect(page.locator("h1")).toHaveText(homeCopy[route.locale].title);
      await expect(page).toHaveTitle(
        `${homeManifest.title[route.locale]} | ${brand}`,
      );
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        homeManifest.description[route.locale],
      );
    }
    await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      route.url,
    );
    for (const locale of locales) {
      const alternate = route.audience
        ? serviceUrl(
            route.slug as (typeof services)[number],
            locale,
            route.audience,
          )
        : `${origin("home")}/${locale}/`;
      await expect(
        page.locator(`link[rel=alternate][hreflang=${locale}]`),
      ).toHaveAttribute("href", alternate);
    }
    await expect(
      page.locator("link[rel=alternate][hreflang=x-default]"),
    ).toHaveAttribute("href", route.url.replace(`/${route.locale}/`, "/es/"));
    await expect(page.locator(".preview-notice")).toBeVisible();
    await expect(page.getByTestId("business-footer")).toBeVisible();
    if (route.audience) {
      await expect(page.locator("form")).toBeVisible();
      await expect(
        page.locator(
          route.audience === "landing" ? "#service-scope" : "#example-lead",
        ),
      ).toBeVisible();
      const faqCount = await page.locator("#page-faq details").count();
      expect(faqCount).toBeGreaterThanOrEqual(5);
      expect(faqCount).toBeLessThanOrEqual(8);
    } else {
      await expect(page.locator(".service-catalog a")).toHaveCount(30);
      for (const audience of audiences) {
        await page
          .locator(".audience-tabs button")
          .nth(audience === "landing" ? 0 : 1)
          .click();
        const links = await page
          .locator(".service-catalog a")
          .evaluateAll((anchors) =>
            anchors.map((a) => (a as HTMLAnchorElement).href),
          );
        expect(links.sort()).toEqual(
          services
            .map((slug) => serviceUrl(slug, route.locale, audience))
            .sort(),
        );
      }
    }
  });
}
test("page origins reject other service routes and the selector navigates to the owning origin", async ({
  page,
  request,
}) => {
  expect(
    (await request.get(`${origin("hvac")}/fr/landing/plumbing`)).status(),
  ).toBe(404);
  expect(
    (await request.get(`${origin("home")}/fr/landing/hvac`)).status(),
  ).toBe(404);
  await page.goto(serviceUrl("hvac", "fr", "landing"));
  await page.locator("#service-choice").selectOption("plumbing");
  await expect(page).toHaveURL(serviceUrl("plumbing", "fr", "landing"));
  await expect(page.locator("form")).toBeVisible();
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    serviceUrl("plumbing", "fr", "landing"),
  );
});
test("every local origin reports preview mode with submissions disabled", async ({
  request,
}) => {
  for (const slug of ["home", ...services] as const) {
    const response = await request.get(`${origin(slug)}/api/site-context`);
    expect(response.ok(), slug).toBe(true);
    const site = await response.json();
    expect(site.mode, slug).toBe("preview");
    expect(site.submissionsEnabled, slug).toBe(false);
    expect(
      site.pages.map((p: { slug: string }) => p.slug).sort(),
      slug,
    ).toEqual([...services].sort());
  }
});
