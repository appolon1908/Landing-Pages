import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("SMS choices are optional, independent and reset when the phone or language changes", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });
  await page.goto("/en/landing/hvac-heating");
  const service = page.locator("[name=transactionalSms]");
  const marketing = page.locator("[name=marketingSms]");
  for (const input of [service, marketing, page.locator("[name=consent]")]) {
    await expect(input).not.toBeChecked();
    expect(await input.getAttribute("required")).toBeNull();
  }
  await page.locator("[name=name]").fill("Consent Visitor");
  await page.locator("[name=phone]").fill("6175550100");
  await service.check();
  await expect(service).toBeChecked();
  await expect(marketing).not.toBeChecked();
  await page.locator("[name=phone]").fill("6175550101");
  await expect(service).not.toBeChecked();
  await service.check();
  await page.getByRole("link", { name: "Español" }).click();
  await expect(service).not.toBeChecked();
  await expect(marketing).not.toBeChecked();
  await expect(page.locator("[name=name]")).toHaveValue("Consent Visitor");
  await page.locator("[name=email]").fill("visitor@example.test");
  await page.locator("[name=postalCode]").fill("02110");
  await page.locator("[name=address]").fill("12 Example Street");
  await page.locator("[name=city]").fill("Boston");
  await page.locator("[name=state]").selectOption("MA");
  await page
    .locator("textarea[name=description]")
    .fill("Heating repair request");
  await page.getByRole("button", { name: "Revisar solicitud" }).click();
  await expect(page.getByRole("status")).toContainText("No se ha enviado nada");
  expect(posts).toEqual([]);
});

test("shared policy navigation preserves form data and accurate Back/Forward metadata", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("[name=name]").fill("Policy Visitor");
  await page.locator("[name=phone]").fill("6175550100");
  await page.locator("[name=transactionalSms]").check();
  await page.locator("form a[href='/en/privacy-policy']").click();
  await expect(page).toHaveURL(/\/en\/privacy-policy$/);
  await expect(page.locator("h1")).toHaveText("Privacy Policy");
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "http://127.0.0.1:4173/en/privacy-policy",
  );
  await expect(page.locator("link[hreflang=es]")).toHaveAttribute(
    "href",
    "http://127.0.0.1:4173/es/privacy-policy",
  );
  await page.goBack();
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
  await expect(page.locator("[name=name]")).toHaveValue("Policy Visitor");
  await expect(page.locator("[name=transactionalSms]")).toBeChecked();
  await page.goForward();
  await expect(page.locator("h1")).toHaveText("Privacy Policy");
  await page.reload();
  await expect(page.locator("h1")).toHaveText("Privacy Policy");
  await page.getByRole("link", { name: "Español" }).click();
  await expect(page).toHaveURL(/\/es\/privacy-policy$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("h1")).toHaveText("Política de privacidad");
});

test("policy pages are readable without JavaScript and stay scoped to the actual host", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://localhost:4173/en/terms?site=preview-breero");
    await expect(page.locator("h1")).toHaveText("Terms and SMS Program");
    await expect(page.locator("body")).toContainText("Second Brand Preview");
    await expect(page.locator("body")).not.toContainText("Breero Preview");
    await expect(
      page.getByRole("link", { name: "Privacy Policy", exact: true }).first(),
    ).toHaveAttribute("href", "/en/privacy-policy");
  } finally {
    await context.close();
  }
});

test("legal pages have accessible mobile layout and visible policy navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  for (const path of ["/en/terms", "/es/privacy-policy", "/en/contact"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
