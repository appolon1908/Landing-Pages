import { test, expect } from "./preview-fixtures.ts";
import { audiences, locales, origin, services, serviceUrl } from "./catalog.ts";

// Independent supplied-asset inventory; do not derive expected matches from UI registration.
const stems = [
  "01-hvac-air-conditioning",
  "02-plumbing",
  "03-electrical",
  "04-roofing-waterproofing",
  "05-home-cleaning",
  "06-commercial-cleaning",
  "07-pest-control",
  "08-landscaping-lawn-care",
  "09-tree-services",
  "10-painting",
  "11-remodeling",
  "12-flooring-tile",
  "13-windows-doors",
  "14-pool-care",
  "15-solar-installation",
  "16-generators-inverters-batteries",
  "17-water-tanks-pumps-filtration",
  "18-appliance-repair",
  "19-locksmiths",
  "20-security-cameras-alarms",
  "21-moving",
  "22-junk-removal",
  "23-pressure-washing",
  "24-auto-repair-mobile-mechanics",
  "25-auto-detailing",
  "26-towing-roadside-assistance",
  "27-catering",
  "28-photography-video",
  "29-tutoring-training",
  "30-websites-digital-marketing",
];

for (const [index, slug] of services.entries()) {
  test(`brand image matches ${slug} for both audiences`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const audience of audiences) {
      await page.goto(serviceUrl(slug, "fr", audience));
      const photograph = page.locator(".service-hero-image");
      await expect(photograph).toBeVisible();
      await expect(photograph).toHaveAttribute(
        "src",
        new RegExp(`${stems[index]}.*\\.webp$`),
      );
      await expect
        .poll(() =>
          photograph.evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
        )
        .toBe(true);
      const picture = await photograph.boundingBox();
      const heading = await page.locator("h1").boundingBox();
      expect(picture).not.toBeNull();
      expect(heading).not.toBeNull();
      // Keep copy below the embedded wordmark and left of the right-hand subject.
      expect(heading!.y).toBeGreaterThan(picture!.y + picture!.height * 0.21);
      expect(heading!.x + heading!.width).toBeLessThanOrEqual(
        picture!.x + picture!.width * 0.49,
      );
      expect(picture!.width / picture!.height).toBeCloseTo(1672 / 941, 2);
      const loadedHeroes = await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((name) => /\.webp(?:$|\?)/.test(name)),
      );
      expect(loadedHeroes).toHaveLength(1);
      expect(loadedHeroes[0]).toContain(stems[index]);
      if (slug === "digital-marketing") {
        await page.screenshot({
          path: testInfo.outputPath(`digital-marketing-${audience}.png`),
          fullPage: false,
        });
      }
    }
  });
}

for (const width of [390, 768, 1440]) {
  for (const locale of locales) {
    for (const audience of audiences) {
      test(`brand composition ${width}px ${locale}/${audience}`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(serviceUrl("hvac", locale, audience));
        const hero = page.locator(".service-hero");
        const photo = page.locator(".service-hero-image");
        await expect(photo).toBeVisible();
        await expect
          .poll(() =>
            photo.evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
          )
          .toBe(true);
        await expect(page.locator(".site-header .brand img")).toHaveAttribute(
          "alt",
          "BREERO",
        );
        const photoBox = await photo.boundingBox();
        const copyBox = await hero.locator(".hero-copy").boundingBox();
        expect(photoBox!.width / photoBox!.height).toBeCloseTo(1672 / 941, 2);
        if (width < 1024) {
          expect(copyBox!.y + copyBox!.height).toBeLessThanOrEqual(
            photoBox!.y + 1,
          );
          expect(
            await photo.evaluate((image) => getComputedStyle(image).objectFit),
          ).toBe("contain");
        }
        const colors = await hero.locator(".primary").evaluate((button) => ({
          background: getComputedStyle(button).backgroundColor,
          text: getComputedStyle(button).color,
        }));
        expect(colors).toEqual({
          background: "rgb(255, 121, 0)",
          text: "rgb(11, 23, 57)",
        });
        if (audience === "landing") {
          await expect(hero.locator(".secondary")).toHaveText(
            {
              es: "Unirse como proveedor",
              en: "Join as a provider",
              fr: "Devenir prestataire",
            }[locale],
          );
          await expect(hero.locator(".secondary")).toHaveAttribute(
            "href",
            `/${locale}/business/hvac`,
          );
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: testInfo.outputPath("brand-hero.png"),
          fullPage: false,
        });
      });
    }
  }
}

test("homepage uses the supplied logo on a white header", async ({ page }) => {
  await page.goto(`${origin("home")}/en/`);
  await expect(page.locator(".site-header .brand img")).toHaveAttribute(
    "alt",
    "BREERO",
  );
  await expect(page.locator(".site-header .brand img")).toBeVisible();
  expect(
    await page
      .locator(".site-header")
      .evaluate((header) => getComputedStyle(header).backgroundColor),
  ).toBe("rgb(255, 255, 255)");
});

test("shared layouts preserve a different validated brand context", async ({
  page,
}) => {
  await page.route("**/api/site-context", async (route) => {
    const response = await route.fetch();
    const context = await response.json();
    context.brand.name = "Second Brand Preview";
    await route.fulfill({ response, json: context });
  });
  for (const url of [
    serviceUrl("hvac", "en", "landing"),
    `${origin("home")}/en/`,
  ]) {
    await page.goto(url);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".site-header .brand")).toHaveText(
      "Second Brand Preview",
    );
    await expect(page.locator(".site-header .brand img")).toHaveCount(0);
    await expect(page.locator(".service-hero-image")).toHaveCount(0);
    await expect(page.locator('link[rel~="icon"]')).toHaveCount(0);
  }
});
