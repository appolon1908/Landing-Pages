import { test, expect } from "./preview-fixtures.ts";
import { locales, services, serviceUrl } from "./catalog.ts";

const ready = {
  schemaVersion: 1,
  mode: "local-demo",
  available: true,
  demoOrigin: "http://127.0.0.1:54253",
  reason: "ready",
  productionSchedulingEnabled: false,
};
const ctas = [
  ".service-hero .primary",
  ".final-request .primary",
  ".mobile-action a",
];

for (const locale of locales) {
  test(`all customer services hand off to their BREERO booking form in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route("**/api/front-desk", (route) =>
      route.fulfill({ json: ready }),
    );
    for (const service of services) {
      await page.goto(
        `${serviceUrl(service, locale, "landing")}?mode=voice&service=other&tenant=forged`,
      );
      await expect(page.locator("form")).toHaveCount(0);
      const target = `http://127.0.0.1:54253/?source=breero&service=${service}&audience=landing&locale=${locale}&mode=form`;
      for (const selector of ctas) {
        const cta = page.locator(selector);
        await expect(cta).toHaveAttribute("href", target);
        await expect(cta).toHaveAttribute("target", "_blank");
        await expect(cta).toHaveAttribute("rel", "noopener noreferrer");
        await expect(cta).toHaveAttribute(
          "aria-describedby",
          "front-desk-link-note",
        );
      }
      await expect(page.locator("#request")).toHaveAttribute(
        "data-testid",
        "front-desk-entry",
      );
    }
  });

  test(`unavailable customer booking keeps ${locale} mobile keyboard navigation on the page`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const config of [
      {
        ...ready,
        available: false,
        demoOrigin: null,
        reason: "not-configured",
      },
      { ...ready, available: false, demoOrigin: null, reason: "local-only" },
      { ...ready, demoOrigin: "https://attacker.example" },
    ]) {
      await page.route("**/api/front-desk", (route) =>
        route.fulfill({ json: config }),
      );
      await page.goto(serviceUrl("plumbing", locale, "landing"));
      const panel = page.locator("#request");
      await expect(panel.locator(".front-desk-pending")).toBeVisible();
      await expect(panel.locator("a")).toHaveCount(0);
      await expect(page.locator("form")).toHaveCount(0);
      for (const selector of ctas) {
        const cta = page.locator(selector);
        await expect(cta).toHaveAttribute("href", "#request");
        await expect(cta).not.toHaveAttribute("target");
      }
      const mobile = page.locator(".mobile-action a");
      await mobile.focus();
      await page.keyboard.press("Enter");
      await expect(panel).toBeInViewport();
      await expect(panel).toBeFocused();
      await expect(page).toHaveURL(
        `${serviceUrl("plumbing", locale, "landing")}#request`,
      );
      await page.unroute("**/api/front-desk");
    }
  });
}

test("customer CTAs follow locale changes and each opens the selected form, while provider applications stay inline", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/api/front-desk", (route) =>
    route.fulfill({ json: ready }),
  );
  await context.route("http://127.0.0.1:54253/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>BREERO</title><p>Booking form</p>",
    }),
  );
  await page.goto(serviceUrl("plumbing", "es", "landing"));
  await page.locator('nav a[lang="fr"]').click();
  for (const selector of ctas) {
    const cta = page.locator(selector);
    await cta.scrollIntoViewIfNeeded();
    await cta.focus();
    const opened = page.waitForEvent("popup");
    await cta.press("Enter");
    const popup = await opened;
    await popup.waitForLoadState();
    expect(Object.fromEntries(new URL(popup.url()).searchParams)).toEqual({
      source: "breero",
      service: "plumbing",
      audience: "landing",
      locale: "fr",
      mode: "form",
    });
    await popup.close();
  }
  await page.locator('nav a[href="/fr/business/plumbing"]').click();
  await expect(page.locator("form")).toBeVisible();
  for (const selector of ctas)
    await expect(page.locator(selector)).toHaveAttribute("href", "#request");
});
