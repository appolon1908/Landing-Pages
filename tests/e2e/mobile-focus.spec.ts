import { test, expect } from "./preview-fixtures.ts";
import { audiences, locales, serviceUrl } from "./catalog.ts";
import { firstStep, hvacDetails } from "./intake-helpers.ts";

for (const locale of locales) {
  for (const audience of audiences) {
    if (audience !== "business") continue;
    test(`mobile CTA leaves ${locale}/${audience} focused fields usable`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(serviceUrl("hvac", locale, audience));
      const cta = page.locator(".mobile-action a");
      await expect(cta).toBeVisible();
      await cta.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#request")).toBeInViewport();
      await firstStep(page, audience);
      await hvacDetails(page, audience);
      const field = page.locator('input[name="capacity"]');
      await field.focus();
      await expect(field).toBeFocused();
      // Reduced height approximates the space left above a mobile keyboard.
      await page.setViewportSize({ width: 390, height: 460 });
      // Place the field deterministically before checking for sticky overlays.
      // Chromium's nearest alignment can clip fractional border pixels.
      await field.evaluate((element) =>
        element.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior: "instant",
        }),
      );
      const geometry = await field.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.top + Math.min(box.height / 2, 20);
        const target = document.elementFromPoint(x, y);
        return {
          top: box.top,
          bottom: box.bottom,
          height: box.height,
          viewportHeight: innerHeight,
          target: target?.tagName,
          focused: document.activeElement === element,
          usable:
            box.top >= 0 &&
            box.bottom <= innerHeight &&
            !!target &&
            (element === target || element.contains(target)),
        };
      });
      await test.info().attach("focused-input-geometry", {
        body: JSON.stringify(geometry),
        contentType: "application/json",
      });
      expect(
        geometry,
        "Focused input is visible and not covered by sticky controls",
      ).toMatchObject({ usable: true, focused: true });
      await expect(page.locator(".mobile-action")).toBeHidden();
      await page.keyboard.press("Tab");
      expect(
        await page.evaluate(
          () => document.activeElement?.closest("#request") !== null,
        ),
        "Tab remains in the form",
      ).toBe(true);
    });
  }
}
