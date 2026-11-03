import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";
import { chromium } from "@playwright/test";
import { intakeSite } from "./intake-fixtures.ts";

test("two-step customer/provider forms preserve data, invalidate all consent on locale change and preview sends nothing", async () => {
  const root = resolve(".superpowers/intake-browser");
  const repo = process.cwd().replaceAll("\\", "/");
  await mkdir(root, { recursive: true });
  await writeFile(
    resolve(root, "index.html"),
    `<!doctype html><html lang="es"><head><title>Intake test</title><meta name="description" content=""><link rel="canonical" href="/stale">${["es", "en", "fr", "x-default"].map((locale) => `<link rel="alternate" hreflang="${locale}" href="/stale">`).join("")}</head><body><div id="app"></div><script type="module">
    import { createApp, h } from '/@fs/${repo}/node_modules/vue/dist/vue.esm-bundler.js';
    import { definePage } from '/@fs/${repo}/packages/core/src/index.ts';
    import { manifestInput } from '/@fs/${repo}/tests/manifest-fixture.ts';
    import { usePage } from '/@fs/${repo}/packages/ui/src/usePage.ts';
    import IntakeForm from '/@fs/${repo}/packages/ui/src/components/IntakeForm.vue';
    createApp({setup(){const c=usePage(definePage(manifestInput()));return()=>h('main', {'data-controller-state':c.state.value}, [h('button',{'data-policy':true,onClick:()=>c.navigatePolicy('privacy-policy')},'Privacy'), h('nav', ['es','en','fr'].map(locale=>h('button',{onClick:()=>c.switchLanguage(locale),'data-locale':locale},locale))), h(IntakeForm,{c})]);}}).mount('#app');
  </script></body></html>`,
  );
  const server = await createServer({
    configFile: false,
    root,
    plugins: [vue()],
    resolve: { alias: { "@lp/core": resolve("packages/core/src/index.ts") } },
    server: { host: "127.0.0.1", port: 0, fs: { allow: [process.cwd()] } },
  });
  await server.listen();
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    await server.close();
    throw error;
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const consoleErrors = [];
  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  let posts = 0;
  await page.route("**/api/site-context", (route) =>
    route.fulfill({
      json: { ...intakeSite(), mode: "preview", submissionsEnabled: false },
    }),
  );
  await page.route("**/api/submissions/**", (route) => {
    posts++;
    return route.abort();
  });
  const base = `http://127.0.0.1:${server.httpServer.address().port}`;
  try {
    await page.goto(base + "/es/landing/hvac");
    await page
      .locator('select[name="subtype"]')
      .selectOption("repair", { timeout: 5000 });
    await page.locator('select[name="zone"]').selectOption("distrito-nacional");
    await page.locator('select[name="urgency"]').selectOption("flexible");
    await page.locator("[data-intake-next]").click();
    await page.locator('input[name="name"]').fill("Cliente de ejemplo");
    await page.locator('input[name="phone"]').fill("+1 809 555 0100");
    await page
      .locator('textarea[name="description"]')
      .fill("Necesito una evaluación del equipo.");
    await page.locator('input[name="consent"]').check();
    await page.locator('input[name="promotions"]').check();
    await page.locator('[data-locale="fr"]').click();
    for (const locale of ["es", "en", "fr", "x-default"])
      assert.equal(
        await page.locator(`link[hreflang="${locale}"]`).getAttribute("href"),
        `https://intake.example.org/${locale === "x-default" ? "es" : locale}/landing/hvac`,
      );
    assert.equal(
      await page.locator('input[name="name"]').inputValue(),
      "Cliente de ejemplo",
    );
    assert.equal(
      await page.locator('input[name="consent"]').isChecked(),
      false,
    );
    assert.equal(
      await page.locator('input[name="promotions"]').isChecked(),
      false,
    );
    await page.locator("[data-intake-submit]").click();
    assert.equal(posts, 0);
    await page.locator('[role="alert"]').waitFor();
    await page.locator('input[name="consent"]').check();
    await page.locator("[data-intake-submit]").click();
    await page.waitForFunction(() =>
      document
        .querySelector("[data-intake-status]")
        ?.textContent?.includes("envoy"),
    );
    assert.equal(posts, 0);
    assert.doesNotMatch(
      await page.locator("[data-intake-status]").innerText(),
      /reçue|REQUEST_ACCEPTED/,
    );
    assert.equal(
      await page
        .locator(
          'input[name="address"],input[name="postalCode"],select[name="state"]',
        )
        .count(),
      0,
    );
    await page.locator('a[href="/fr/privacy-policy"]').click();
    for (const locale of ["es", "en", "fr", "x-default"])
      assert.equal(
        await page.locator(`link[hreflang="${locale}"]`).getAttribute("href"),
        `https://intake.example.org/${locale === "x-default" ? "es" : locale}/privacy-policy`,
      );
    await page.goto(base + "/es/business/hvac");
    await page
      .locator('input[name="businessName"]')
      .fill("Servicios de ejemplo");
    for (const locale of ["es", "en", "fr", "x-default"])
      assert.equal(
        await page.locator(`link[hreflang="${locale}"]`).getAttribute("href"),
        `https://intake.example.org/${locale === "x-default" ? "es" : locale}/business/hvac`,
      );
    await page.locator('input[name="name"]').fill("Proveedor de ejemplo");
    await page.locator('input[name="phone"]').fill("+1 829 555 0100");
    await page.locator('input[name="email"]').fill("provider@example.org");
    await page
      .locator('input[name="zones"][value="distrito-nacional"]')
      .check();
    await page
      .locator('input[name="operatingHours"]')
      .fill("Días laborables, por acuerdo");
    await page.locator("[data-intake-next]").click();
    await page
      .locator('input[name="supportedSubtypes"][value="repair"]')
      .check();
    await page.locator('input[name="capacity"]').fill("2");
    await page.locator('input[name="languages"][value="es"]').check();
    await page.locator('select[name="insurance"]').selectOption("na");
    await page.locator('input[name="consent"]').check();
    await page.locator("[data-intake-submit]").click();
    await page.waitForFunction(() =>
      document
        .querySelector("[data-intake-status]")
        ?.textContent?.includes("enviado"),
    );
    assert.equal(posts, 0);
    assert.deepEqual(consoleErrors, []);

    // Fake browser transport only: a response arriving after policy navigation
    // cannot move the visitor back into a stale thank-you/accepted state.
    await page.unroute("**/api/site-context");
    await page.route("**/api/site-context", (route) =>
      route.fulfill({ json: intakeSite() }),
    );
    await page.unroute("**/api/submissions/**");
    let pendingRoute;
    await page.route("**/api/submissions/**", (route) => {
      pendingRoute = route;
    });
    await page.goto(base + "/es/landing/hvac");
    await page.locator('select[name="subtype"]').selectOption("repair");
    await page.locator('select[name="zone"]').selectOption("distrito-nacional");
    await page.locator('select[name="urgency"]').selectOption("flexible");
    await page.locator("[data-intake-next]").click();
    await page.locator('input[name="name"]').fill("Cliente de ejemplo");
    await page.locator('input[name="phone"]').fill("+1 809 555 0100");
    await page
      .locator('textarea[name="description"]')
      .fill("Equipo sin refrigeración.");
    await page.locator('input[name="consent"]').check();
    const requested = page.waitForRequest("**/api/submissions/**");
    await page.locator("[data-intake-submit]").click();
    await requested;
    await page.locator("[data-policy]").click();
    assert.equal(new URL(page.url()).pathname, "/es/privacy-policy");
    const responded = page.waitForResponse("**/api/submissions/**");
    await pendingRoute.fulfill({
      json: {
        request_id: "123e4567-e89b-42d3-a456-426614174000",
        status: "REQUEST_ACCEPTED",
        downstream_status: "CRM_ACCEPTED",
        crm_receipt_id: "fake-receipt-after-navigation",
      },
    });
    await responded;
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    assert.equal(new URL(page.url()).pathname, "/es/privacy-policy");
    assert.equal(
      await page.locator("main").getAttribute("data-controller-state"),
      "ready",
    );
    assert.doesNotMatch(
      await page.locator("[data-intake-status]").innerText(),
      /fake-receipt-after-navigation/,
    );
  } finally {
    await browser.close();
    await server.close();
  }
});
