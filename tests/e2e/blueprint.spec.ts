import { test, expect } from "@playwright/test";

const slug = process.env.BLUEPRINT_SLUG || "hvac";

test("customer page explains scope and pricing before the final request", async ({
  page,
}) => {
  await page.goto(`/es/landing/${slug}`);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#service-scope")).toBeVisible();
  await expect(page.locator("#how-it-works li")).toHaveCount(3);
  await expect(page.locator("#pricing-factors li")).not.toHaveCount(0);
  const faqCount = await page.locator("#page-faq details").count();
  expect(faqCount).toBeGreaterThanOrEqual(5);
  expect(faqCount).toBeLessThanOrEqual(8);
  await expect(page.locator("#request")).toBeVisible();
  await expect(page.locator("a[href='#request']").first()).toBeVisible();
});

test("provider page distinguishes fictional examples, terms and an application", async ({
  page,
}) => {
  await page.goto(`/en/business/${slug}`);
  await expect(page.locator("#example-lead")).toContainText(
    "Fictional example",
  );
  await expect(page.locator("#qualification")).toBeVisible();
  await expect(page.locator("#lead-terms")).toBeVisible();
  await expect(page.locator("#provider-workflow li")).toHaveCount(6);
  await expect(page.locator("#page-faq details").first()).toBeVisible();
  await expect(page.locator("a[href='#request']").first()).toBeVisible();
});
