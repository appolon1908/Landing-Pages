import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./preview-fixtures.ts";
import { accessibilityRoutes } from "./catalog.ts";
if (accessibilityRoutes.length !== 33)
  throw Error("Accessibility matrix requires 33 localized pilot/home routes.");
for (const width of [390, 768, 1440]) {
  for (const route of accessibilityRoutes) {
    test(`axe ${width}px ${route.locale}/${route.audience || "home"}/${route.slug}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route.url);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        "No horizontal overflow",
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        result.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            failure: node.failureSummary,
          })),
        })),
      ).toEqual([]);
    });
  }
}
