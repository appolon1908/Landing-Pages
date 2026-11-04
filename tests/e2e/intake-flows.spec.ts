import { test, expect } from "./preview-fixtures.ts";
import {
  audiences,
  locales,
  noReceiptMessage,
  previewMessage,
  serviceUrl,
} from "./catalog.ts";
import {
  assertAnnouncedError,
  firstStep,
  hvacDetails,
} from "./intake-helpers.ts";

for (const locale of locales) {
  for (const audience of audiences) {
    test(`two-step ${locale}/${audience}: errors, consent and zero-write preview`, async ({
      page,
    }) => {
      await page.goto(serviceUrl("hvac", locale, audience));
      await expect(page.locator("[data-intake-next]")).toBeVisible();
      await expect(page.locator("[data-intake-submit]")).toHaveCount(0);
      await page.locator("[data-intake-next]").click();
      await assertAnnouncedError(page);
      await firstStep(page, audience);
      await hvacDetails(page, audience);
      await expect(page.locator('input[name="consent"]')).not.toBeChecked();
      await expect(page.locator('input[name="promotions"]')).not.toBeChecked();
      await expect(
        page.locator('input[name="promotions"]'),
      ).not.toHaveAttribute("required");
      await expect(
        page.locator(
          "input[name=address], input[name=postalCode], select[name=state]",
        ),
      ).toHaveCount(0);
      // The preview must validate service consent even though no write is allowed.
      await page.locator("[data-intake-submit]").click();
      await assertAnnouncedError(page);
      await expect(page.locator("[data-intake-status]")).not.toContainText(
        previewMessage[locale],
      );
      await page.locator('input[name="consent"]').check();
      await page.locator("[data-intake-submit]").click();
      await expect(page.locator("[data-intake-status]")).toContainText(
        previewMessage[locale],
      );
      await expect(page).toHaveURL(serviceUrl("hvac", locale, audience));
      await expect(page.locator(".receipt-page")).toHaveCount(0);
      // Leaving promotions unchecked must not block an otherwise valid request.
      await expect(page.locator('input[name="promotions"]')).not.toBeChecked();
    });

    test(`direct thank-you ${locale}/${audience} has no fabricated receipt`, async ({
      page,
    }) => {
      await page.goto(`${serviceUrl("hvac", locale, audience)}/thank-you`);
      await expect(page.locator("h1")).toContainText(noReceiptMessage[locale]);
      await expect(page.locator(".receipt-page .small-print")).toHaveCount(0);
      await expect(page.locator(".receipt-page p")).toHaveCount(0);
      await page.reload();
      await expect(page.locator("h1")).toContainText(noReceiptMessage[locale]);
    });
  }
}

for (const audience of audiences) {
  test(`locale changes preserve ${audience} details and clear every consent choice`, async ({
    page,
  }) => {
    await page.goto(serviceUrl("hvac", "es", audience));
    await firstStep(page, audience);
    await hvacDetails(page, audience);
    for (const locale of ["en", "fr", "es"] as const) {
      for (const name of [
        "consent",
        "promotions",
        "transactionalSms",
        "marketingSms",
      ])
        await page.locator(`input[name="${name}"]`).check();
      await page.locator(`a.language[lang="${locale}"]`).click();
      await expect(page).toHaveURL(serviceUrl("hvac", locale, audience));
      for (const name of [
        "consent",
        "promotions",
        "transactionalSms",
        "marketingSms",
      ])
        await expect(page.locator(`input[name="${name}"]`)).not.toBeChecked();
      if (audience === "landing") {
        await expect(page.locator('input[name="name"]')).toHaveValue(
          "Contacto de prueba",
        );
        await expect(page.locator('input[name="phone"]')).toHaveValue(
          "+1 809 555 0100",
        );
      } else {
        await expect(page.locator('input[name="capacity"]')).toHaveValue("2");
        await expect(
          page.locator('input[name="supportedSubtypes"][value="repair"]'),
        ).toBeChecked();
        await expect(
          page.locator('input[name="languages"][value="es"]'),
        ).toBeChecked();
      }
      await expect(
        page.locator("link[rel=alternate][hreflang=fr]"),
      ).toHaveAttribute("href", serviceUrl("hvac", "fr", audience));
      await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
        "href",
        serviceUrl("hvac", locale, audience),
      );
    }
    await page.locator("[data-intake-back]").click();
    if (audience === "landing") {
      await expect(page.locator('select[name="subtype"]')).toHaveValue(
        "repair",
      );
      await expect(page.locator('select[name="zone"]')).toHaveValue(
        "distrito-nacional",
      );
      await expect(page.locator('[name="extra:equipment-type"]')).toHaveValue(
        "split",
      );
    } else {
      await expect(page.locator('input[name="businessName"]')).toHaveValue(
        "Servicios de prueba",
      );
      await expect(page.locator('input[name="email"]')).toHaveValue(
        "preview@example.org",
      );
      await expect(
        page.locator('input[name="zones"][value="distrito-nacional"]'),
      ).toBeChecked();
    }
  });
}

test("an invalid email contact preference blocks preview; a valid address allows it", async ({
  page,
}) => {
  await page.goto(serviceUrl("hvac", "en", "landing"));
  await firstStep(page, "landing");
  await hvacDetails(page, "landing");
  await page.locator('select[name="contactPreference"]').selectOption("email");
  await page.locator('input[name="consent"]').check();
  await page.locator('input[name="email"]').fill("not-an-email");
  await page.locator("[data-intake-submit]").click();
  await assertAnnouncedError(page);
  await page.locator('input[name="email"]').fill("preview@example.org");
  await page.locator("[data-intake-submit]").click();
  await expect(page.locator("[data-intake-status]")).toContainText(
    previewMessage.en,
  );
});

test("optional provider scope details survive locale changes and radius limits are enforced", async ({
  page,
}) => {
  await page.goto(serviceUrl("hvac", "en", "business"));
  await firstStep(page, "business");
  await hvacDetails(page, "business");
  const details = {
    serviceRadiusKm: "25",
    jobSize: "Small residential maintenance jobs",
    credentials: "Qualifications summary to be verified during onboarding",
    quoteProcess:
      "Review scope first.\nAgree any visit charge before attending.",
    commercialPreferences: "Confirm fees before accepting an opportunity",
  };
  for (const [name, value] of Object.entries(details)) {
    const input = page.locator(`[name="${name}"]`);
    await expect(input).not.toHaveAttribute("required");
    await expect(input.locator("xpath=ancestor::label")).toContainText(
      /optional/i,
    );
    await input.fill(value);
  }
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  await page.locator('[name="serviceRadiusKm"]').fill("501");
  await page.locator('input[name="consent"]').check();
  await page.locator("[data-intake-submit]").click();
  await assertAnnouncedError(page);
  await expect(page.locator('[name="serviceRadiusKm"]')).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.locator('[name="serviceRadiusKm"]').fill(details.serviceRadiusKm);
  for (const locale of ["fr", "es", "en"] as const) {
    await page.locator(`a.language[lang="${locale}"]`).click();
    for (const [name, value] of Object.entries(details))
      await expect(page.locator(`[name="${name}"]`)).toHaveValue(value);
    await expect(page.locator('input[name="consent"]')).not.toBeChecked();
  }
  await page.locator('input[name="consent"]').check();
  await page.locator("[data-intake-submit]").click();
  await expect(page.locator("[data-intake-status]")).toContainText(
    previewMessage.en,
  );
});
