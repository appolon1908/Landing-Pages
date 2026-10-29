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

const historyCases = [
  {
    change: "service",
    path: "/en/landing/plumbing-winterization",
    offering: "plumbing-winterization",
    locale: "en",
    title: "Plumbing winterization | Breero Preview",
    heading: "Plan ahead for colder days.",
    providerInputs: 0,
  },
  {
    change: "audience",
    path: "/en/business/chimney-fireplace",
    offering: "chimney-fireplace",
    locale: "en",
    title: "Chimneys & fireplaces | Breero Preview",
    heading: "Bring your chimneys & fireplaces expertise to more projects.",
    providerInputs: 1,
  },
  {
    change: "language",
    path: "/es/landing/chimney-fireplace",
    offering: "chimney-fireplace",
    locale: "es",
    title: "Chimeneas y hogares | Breero Preview",
    heading: "Prepara tu chimenea para la temporada.",
    providerInputs: 0,
  },
] as const;

for (const scenario of historyCases)
  test(`Back and Forward restore the site homepage after a ${scenario.change} change`, async ({
    page,
  }) => {
    await page.route("**/api/site-context", async (route) => {
      const response = await route.fetch();
      const site = await response.json();
      await route.fulfill({
        json: {
          ...site,
          offerings: ["chimney-fireplace", "plumbing-winterization"],
        },
      });
    });
    const expectHomepage = async () => {
      await expect(page).toHaveURL("http://127.0.0.1:4173/");
      await expect(page.locator("#service-choice")).toHaveValue(
        "chimney-fireplace",
      );
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page).toHaveTitle("Chimneys & fireplaces | Breero Preview");
      await expect(page.locator("h1")).toHaveText(
        "Get your fireplace ready for the season.",
      );
      await expect(page.locator("[name=businessName]")).toHaveCount(0);
      await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
        "href",
        "http://127.0.0.1:4173/en/landing/chimney-fireplace",
      );
    };
    const expectChangedPage = async () => {
      await expect(page).toHaveURL("http://127.0.0.1:4173" + scenario.path);
      await expect(page.locator("#service-choice")).toHaveValue(
        scenario.offering,
      );
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        scenario.locale,
      );
      await expect(page).toHaveTitle(scenario.title);
      await expect(page.locator("h1")).toHaveText(scenario.heading);
      await expect(page.locator("[name=businessName]")).toHaveCount(
        scenario.providerInputs,
      );
      await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
        "href",
        "http://127.0.0.1:4173" + scenario.path,
      );
    };

    await page.goto("/");
    await expectHomepage();
    await page.locator("[name=name]").fill("History Visitor");
    if (scenario.change === "service")
      await page
        .locator("#service-choice")
        .selectOption("plumbing-winterization");
    else if (scenario.change === "audience")
      await page.getByRole("link", { name: "For providers" }).click();
    else await page.getByRole("link", { name: "Español" }).click();
    await expectChangedPage();

    await page.goBack();
    await expectHomepage();
    await expect(page.locator("[name=name]")).toHaveValue("History Visitor");
    await page.goForward();
    await expectChangedPage();
    await expect(page.locator("[name=name]")).toHaveValue("History Visitor");
  });
