import { test, expect } from "./preview-fixtures.ts";
import {
  locales,
  previewMessage,
  serviceUrl,
  type Service,
} from "./catalog.ts";
import {
  assertAnnouncedError,
  customerDetails,
  customerFirstFields,
} from "./intake-helpers.ts";

test("whitespace is not a safe pickup location", async ({ page }) => {
  await page.goto(serviceUrl("towing", "en", "landing"));
  await customerFirstFields(page, "towing");
  await page.locator('[name="extra:vehicle-type"]').fill("Passenger car");
  await page.locator('[name="extra:safe-pickup-location"]').fill("   ");
  await page.locator("[data-intake-next]").click();
  await assertAnnouncedError(page);
  await expect(
    page.locator('[name="extra:safe-pickup-location"]'),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("[data-intake-submit]")).toHaveCount(0);
});

const cases: {
  slug: Service;
  subtype: string;
  fields: { key: string; value: string; select?: boolean }[];
}[] = [
  {
    slug: "hvac",
    subtype: "repair",
    fields: [{ key: "equipment-type", value: "split", select: true }],
  },
  {
    slug: "appliance-repair",
    subtype: "appliance-repair",
    fields: [
      { key: "appliance-type", value: "washer", select: true },
      { key: "appliance-brand", value: "Marca por confirmar" },
    ],
  },
  {
    slug: "towing",
    subtype: "towing",
    fields: [
      { key: "vehicle-type", value: "Automóvil de pasajeros" },
      {
        key: "safe-pickup-location",
        value: "Estacionamiento fuera de la vía, junto a recepción",
      },
    ],
  },
  {
    slug: "catering",
    subtype: "business-event",
    fields: [
      { key: "event-date", value: "2027-06-15" },
      { key: "guest-count", value: "40" },
    ],
  },
  {
    slug: "tutoring",
    subtype: "school-subject",
    fields: [
      {
        key: "subject",
        value: "Matemáticas; contacto de madre, padre o tutor",
      },
      { key: "preferred-schedule", value: "Martes y jueves por la tarde" },
    ],
  },
];
for (const locale of locales) {
  for (const scenario of cases) {
    test(`required matching details ${locale}/${scenario.slug}`, async ({
      page,
    }) => {
      await page.goto(serviceUrl(scenario.slug, locale, "landing"));
      await customerFirstFields(page, scenario.subtype);
      for (const field of scenario.fields)
        await expect(page.locator(`[name="extra:${field.key}"]`)).toBeVisible();
      await page.locator("[data-intake-next]").click();
      await assertAnnouncedError(page);
      await expect(page.locator("[data-intake-status]")).not.toContainText(
        previewMessage[locale],
      );
      for (const field of scenario.fields) {
        const input = page.locator(`[name="extra:${field.key}"]`);
        if (field.select) await input.selectOption(field.value);
        else await input.fill(field.value);
      }
      await page.locator("[data-intake-next]").click();
      await customerDetails(page);
      await page.locator('input[name="consent"]').check();
      await page.locator("[data-intake-submit]").click();
      await expect(page.locator("[data-intake-status]")).toContainText(
        previewMessage[locale],
      );
    });
  }
}
