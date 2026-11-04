import { test, expect } from "./preview-fixtures.ts";
import { origin } from "./catalog.ts";

for (const slug of ["home", "hvac"] as const) {
  test(`${slug} defaults to English without another context fetch and lets visitors choose Spanish`, async ({
    page,
  }) => {
    const contextRequests: string[] = [];
    page.on("request", (request) => {
      if (new URL(request.url()).pathname === "/api/site-context")
        contextRequests.push(request.url());
    });
    await page.goto(`${origin(slug)}/`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveURL(
      new RegExp(`/en/${slug === "home" ? "" : "landing/hvac"}$`),
    );
    await expect(page.locator(".language")).toHaveText(
      slug !== "home" ? ["English", "Español", "Français"] : ["EN", "ES", "FR"],
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(contextRequests).toEqual([]);
    await page.locator('.language[lang="es"]').click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page).toHaveURL(
      new RegExp(`/es/${slug === "home" ? "" : "landing/hvac"}$`),
    );
    await page.reload();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    expect(contextRequests).toEqual([]);
  });
}

for (const variant of [
  "missing",
  "malformed",
  "wrong-host",
  "duplicate",
] as const) {
  test(`context fallback recovers a ${variant} bootstrap once`, async ({
    page,
  }) => {
    let requests = 0;
    page.on("request", (request) => {
      if (new URL(request.url()).pathname === "/api/site-context") requests++;
    });
    await page.route(`${origin("hvac")}/en/landing/hvac`, async (route) => {
      const response = await route.fetch();
      const body = (await response.text()).replace(
        /<script id="lp-site-context" type="application\/json">([^<]*)<\/script>/,
        (full, json) => {
          if (variant === "missing") return "";
          if (variant === "duplicate") return full + full;
          const data = JSON.parse(json);
          data.hostname = "wrong.example.org";
          return `<script id="lp-site-context" type="application/json">${variant === "malformed" ? "{broken" : JSON.stringify(data)}</script>`;
        },
      );
      await route.fulfill({ response, body });
    });
    await page.goto(`${origin("hvac")}/en/landing/hvac`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".brand-logo")).toBeVisible();
    expect(requests).toBe(1);
  });
}
