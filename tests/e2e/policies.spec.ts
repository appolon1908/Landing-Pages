import { test, expect, installPreviewGuard } from "./preview-fixtures.ts";
import { locales, origin } from "./catalog.ts";
const expected = {
  es: {
    about: "Acerca del negocio",
    contact: "Contacto",
    "privacy-policy": "Política de privacidad",
    terms: "Términos y programa SMS",
    support: "Atención al cliente",
    identity: "Datos del negocio pendientes de revisión.",
    privacyBody:
      "El formulario conserva los datos en la memoria del navegador y no los envía.",
    termsBody:
      "Un borrador no confirma una reserva, compra, asignación de proveedor ni pago.",
  },
  en: {
    about: "About",
    contact: "Contact",
    "privacy-policy": "Privacy Policy",
    terms: "Terms and SMS Program",
    support: "Customer support",
    identity: "Business details are pending review.",
    privacyBody: "Form contents stay in browser memory and are not submitted.",
    termsBody:
      "A draft request does not confirm a booking, purchase, provider assignment or payment.",
  },
  fr: {
    about: "À propos",
    contact: "Contact",
    "privacy-policy": "Politique de confidentialité",
    terms: "Conditions et programme SMS",
    support: "Assistance clientèle",
    identity:
      "Les informations de l’entreprise sont en attente de vérification.",
    privacyBody:
      "Le formulaire conserve les données uniquement en mémoire du navigateur et ne les transmet pas.",
    termsBody:
      "Un brouillon de demande ne confirme aucune réservation, aucun achat, aucune affectation de prestataire ni aucun paiement.",
  },
};
// Four baseline documents must remain usable even when the app cannot run.
for (const locale of locales) {
  for (const document of [
    "about",
    "contact",
    "privacy-policy",
    "terms",
  ] as const) {
    for (const slug of ["home", "hvac"] as const) {
      test(`no JavaScript ${slug}/${locale}/${document}`, async ({
        browser,
      }) => {
        const context = await browser.newContext({ javaScriptEnabled: false });
        const assertSafe = await installPreviewGuard(context);
        try {
          const page = await context.newPage();
          const response = await page.goto(
            `${origin(slug)}/${locale}/${document}`,
          );
          expect(response?.status()).toBe(200);
          await expect(page.locator("html")).toHaveAttribute("lang", locale);
          await expect(page.locator("h1")).toBeVisible();
          await expect(page.locator("h1")).toHaveText(
            expected[locale][document],
          );
          await expect(page.locator("main")).toContainText(
            document === "privacy-policy"
              ? expected[locale].privacyBody
              : document === "terms"
                ? expected[locale].termsBody
                : expected[locale].identity,
          );
          if (document === "contact")
            await expect(
              page.getByRole("heading", {
                name: expected[locale].support,
                exact: true,
              }),
            ).toBeVisible();
          await expect(page.locator(".policy-section").first()).toBeVisible();
          expect(
            (await page.locator("main").innerText()).length,
          ).toBeGreaterThan(100);
          await expect(
            page.locator(`a[href='/${locale}/privacy-policy']`).first(),
          ).toBeVisible();
          await expect(
            page.locator(`a[href='/${locale}/terms']`).first(),
          ).toBeVisible();
          expect(
            await page.locator("a[href^='mailto:'], a[href^='tel:']").count(),
            "Unconfirmed contacts must not be live links",
          ).toBe(0);
        } finally {
          await context.close();
          assertSafe();
        }
      });
    }
  }
}
