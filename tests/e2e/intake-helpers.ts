import { expect, type Page } from "@playwright/test";
import type { Audience } from "./catalog.ts";

export async function customerFirstFields(page: Page, subtype = "repair") {
  await page.locator('select[name="subtype"]').selectOption(subtype);
  await page.locator('select[name="zone"]').selectOption("distrito-nacional");
  await page.locator('select[name="urgency"]').selectOption("flexible");
}

export async function customerStepOne(page: Page) {
  await customerFirstFields(page);
  await page.locator('[name="extra:equipment-type"]').selectOption("split");
  await page.locator("[data-intake-next]").click();
  await expect(page.locator("[data-intake-submit]")).toBeVisible();
}

export async function providerStepOne(page: Page) {
  await page.locator('input[name="businessName"]').fill("Servicios de prueba");
  await page.locator('input[name="name"]').fill("Contacto de prueba");
  await page.locator('input[name="phone"]').fill("+1 809 555 0100");
  await page.locator('input[name="email"]').fill("preview@example.org");
  await page.locator('input[name="zones"][value="distrito-nacional"]').check();
  await page
    .locator('input[name="operatingHours"]')
    .fill("Lunes a viernes, por acuerdo");
  await page.locator("[data-intake-next]").click();
  await expect(page.locator("[data-intake-submit]")).toBeVisible();
}

export async function customerDetails(page: Page) {
  await page.locator('input[name="name"]').fill("Contacto de prueba");
  await page.locator('input[name="phone"]').fill("+1 809 555 0100");
  await page
    .locator('select[name="contactPreference"]')
    .selectOption("whatsapp");
  await page
    .locator('textarea[name="description"]')
    .fill(
      "Solicito revisar el equipo.\nQuisiera acordar el alcance de una evaluación.",
    );
}

export async function hvacDetails(page: Page, audience: Audience) {
  if (audience === "landing") {
    await customerDetails(page);
  } else {
    await page
      .locator('input[name="supportedSubtypes"][value="repair"]')
      .check();
    await page.locator('input[name="capacity"]').fill("2");
    await page.locator('input[name="languages"][value="es"]').check();
    await page.locator('select[name="insurance"]').selectOption("na");
  }
}

export async function firstStep(page: Page, audience: Audience) {
  if (audience === "landing") await customerStepOne(page);
  else await providerStepOne(page);
}

export async function assertAnnouncedError(page: Page) {
  await expect(page.locator('[role="alert"]').first()).toBeVisible();
  const invalid = page.locator('[aria-invalid="true"]').first();
  await expect(invalid).toBeVisible();
  const describedBy = await invalid.getAttribute("aria-describedby");
  expect(describedBy, "Invalid fields have linked error text").toBeTruthy();
  for (const id of describedBy!.split(/\s+/))
    await expect(page.locator(`[id="${id}"]`)).not.toHaveText("");
}
