import { test, expect } from "@playwright/test";

test("homepage uses the first offering in the loaded site context", async ({
  page,
}) => {
  await page.route("**/api/site-context", async (route) => {
    const response = await route.fetch();
    const site = await response.json();
    await route.fulfill({
      json: { ...site, offerings: ["chimney-fireplace"] },
    });
  });
  await page.goto("/");
  await expect(page.locator("form")).toBeVisible();
  await expect(page.locator("#service-choice")).toHaveValue(
    "chimney-fireplace",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "http://127.0.0.1:4173/en/landing/chimney-fireplace",
  );
});
