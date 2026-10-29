import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { offerings } from "../../packages/industry-templates/catalog.ts";

test("all twenty localized audience routes render with correct language and no executable HTML", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const offering of offerings)
    for (const audience of ["landing", "business"])
      for (const locale of ["en", "es"]) {
        await page.goto(`/${locale}/${audience}/${offering}`);
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator("form")).toBeVisible();
        await expect(page.getByTestId("business-footer")).toContainText(
          "Breero Preview",
        );
        await expect(
          page.locator(`form a[href='/${locale}/privacy-policy']`),
        ).toBeVisible();
        await expect(
          page.locator(`form a[href='/${locale}/terms']`),
        ).toBeVisible();
        await expect(
          page.locator(
            `[data-testid=business-footer] a[href='/${locale}/about']`,
          ),
        ).toBeVisible();
        await expect(
          page.locator(
            `[data-testid=business-footer] a[href='/${locale}/contact']`,
          ),
        ).toBeVisible();
        expect(await page.locator("input[type=checkbox]:checked").count()).toBe(
          0,
        );
        await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
          "href",
          `http://127.0.0.1:4173/${locale}/${audience}/${offering}`,
        );
      }
  expect(errors).toEqual([]);
});

for (const width of [390, 768, 1440])
  test(`accessible layout at ${width}px without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/en/landing/hvac-heating",
      "/es/business/gutter-cleaning-repair",
    ]) {
      await page.goto(path);
      await expect(page.locator("form")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  });

test("language switching preserves input and preview never sends a form or tracking request", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/en/landing/hvac-heating");
  await page.locator("[name=name]").fill("Example Person");
  await page.getByRole("link", { name: "Español" }).click();
  await expect(page.locator("[name=name]")).toHaveValue("Example Person");
  await page.locator("[name=email]").fill("person@example.test");
  await page.locator("[name=phone]").fill("6175550100");
  await page.locator("[name=postalCode]").fill("02110");
  await page.locator("[name=address]").fill("12 Example Street");
  await page.locator("[name=city]").fill("Boston");
  await page.locator("[name=state]").selectOption("MA");
  await page
    .locator("textarea[name=description]")
    .fill("Heating system repair");
  await page.locator("[name=consent]").check();
  await page.getByRole("button", { name: "Revisar solicitud" }).click();
  await expect(page.getByRole("status")).toContainText("No se ha enviado nada");
  await expect(page.locator("[name=email]")).toHaveValue("person@example.test");
  expect(posts).toEqual([]);
});

test("direct thank-you route never fabricates receipt or appointment confirmation", async ({
  page,
}) => {
  await page.goto("/en/landing/hvac-heating/thank-you");
  await expect(page.locator("h1")).toHaveText(
    "There is no confirmed request to show.",
  );
});

test("second company gets its own context even with forged query selectors", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:4173/en/landing/hvac-heating?workspace=preview-breero",
  );
  await expect(page.locator(".brand")).toContainText("Second Brand Preview");
  await expect(page.locator(".brand")).not.toContainText("Breero Preview");
});
