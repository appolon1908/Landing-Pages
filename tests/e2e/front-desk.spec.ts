import { test, expect } from "./preview-fixtures.ts";
import AxeBuilder from "@axe-core/playwright";
import { origin, serviceUrl } from "./catalog.ts";

const ready = {
  schemaVersion: 1,
  mode: "local-demo",
  available: true,
  demoOrigin: "http://127.0.0.1:54253",
  reason: "ready",
  productionSchedulingEnabled: false,
};
const actions = {
  es: { voice: "Hablar con BREERO", form: "Formulario de reserva" },
  en: { voice: "Talk to BREERO", form: "Booking form" },
  fr: { voice: "Parler avec BREERO", form: "Formulaire de réservation" },
};

test("local demo links preserve the brand and bounded context on home and both service audiences", async ({
  page,
}) => {
  await page.route("**/api/front-desk", (route) =>
    route.fulfill({ json: ready }),
  );
  for (const locale of ["es", "en", "fr"] as const) {
    for (const audience of ["home", "landing", "business"] as const) {
      const url =
        audience === "home"
          ? `${origin("home")}/${locale}/`
          : serviceUrl("hvac", locale, audience);
      await page.goto(
        `${url}?frontDesk=https://attacker.example&workspace=other`,
      );
      const panel = page.getByTestId("front-desk-entry");
      await expect(panel).toContainText("BREERO");
      await expect(panel).not.toContainText(
        /Willow|OpenAI|demo|démo|Front Desk/i,
      );
      await expect(panel.getByRole("link")).toHaveCount(2);
      for (const mode of ["voice", "form"] as const) {
        const link = panel.getByRole("link", { name: actions[locale][mode] });
        const expected = `http://127.0.0.1:54253/?source=breero&${audience === "home" ? "" : "service=hvac&"}audience=${audience}&locale=${locale}&mode=${mode}`;
        await expect(link).toHaveAttribute("href", expected);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
      await expect(page.locator(".brand-logo")).toBeVisible();
      if (audience !== "home") await expect(page.locator("form")).toBeVisible();
    }
  }
  const results = await new AxeBuilder({ page })
    .include("[data-testid=front-desk-entry]")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("an unavailable or unsafe demo target shows no broken launch control", async ({
  page,
}) => {
  for (const config of [
    { ...ready, available: false, demoOrigin: null, reason: "not-configured" },
    { ...ready, demoOrigin: "https://attacker.example" },
  ]) {
    await page.route("**/api/front-desk", (route) =>
      route.fulfill({ json: config }),
    );
    await page.goto(serviceUrl("plumbing", "en", "landing"));
    const panel = page.getByTestId("front-desk-entry");
    await expect(panel).toContainText("Booking is not connected yet.");
    await expect(panel.locator("a")).toHaveCount(0);
    await expect(page.locator("form")).toBeVisible();
    await page.unroute("**/api/front-desk");
  }
});

test("language and audience changes update demo context without changing service identity", async ({
  page,
}) => {
  await page.route("**/api/front-desk", (route) =>
    route.fulfill({ json: ready }),
  );
  await page.goto(serviceUrl("plumbing", "es", "landing"));
  await page.locator('nav a[lang="fr"]').click();
  await page.locator('nav a[href="/fr/business/plumbing"]').click();
  await expect(
    page
      .getByTestId("front-desk-entry")
      .getByRole("link", { name: actions.fr.voice }),
  ).toHaveAttribute(
    "href",
    "http://127.0.0.1:54253/?source=breero&service=plumbing&audience=business&locale=fr&mode=voice",
  );
});

test("both booking choices fit a phone and open their selected mode without sending customer data", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.route("**/api/front-desk", (route) =>
    route.fulfill({ json: ready }),
  );
  await context.route("http://127.0.0.1:54253/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>BREERO</title><p>Preview calendar</p>",
    }),
  );
  await page.goto(serviceUrl("plumbing", "fr", "landing"));
  const panel = page.getByTestId("front-desk-entry");
  for (const mode of ["voice", "form"] as const) {
    const link = panel.getByRole("link", { name: actions.fr[mode] });
    await link.scrollIntoViewIfNeeded();
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    await link.focus();
    await expect(link).toBeFocused();
    const opened = page.waitForEvent("popup");
    await link.press("Enter");
    const popup = await opened;
    await popup.waitForLoadState();
    const target = new URL(popup.url());
    expect(Object.fromEntries(target.searchParams)).toEqual({
      source: "breero",
      service: "plumbing",
      audience: "landing",
      locale: "fr",
      mode,
    });
    await popup.close();
  }
  const results = await new AxeBuilder({ page })
    .include("[data-testid=front-desk-entry]")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
