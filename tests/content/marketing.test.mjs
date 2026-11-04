import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

const root = new URL("../../", import.meta.url);
const ready = (path) =>
  assert.ok(existsSync(new URL(path, root)), `Missing ${path}`);

test("thirty draft kits preserve exact page copy and required locale/destination coverage", async () => {
  ready("marketing/_tooling/validate.mjs");
  const { validateAll, loadCatalog } =
    await import("../../marketing/_tooling/validate.mjs");
  const catalog = await loadCatalog();
  assert.equal(catalog.length, 30);
  assert.deepEqual(await validateAll(), []);
  for (const page of catalog) {
    const kit = JSON.parse(
      readFileSync(new URL(`marketing/${page.slug}/ads.json`, root)),
    );
    assert.equal(kit.campaigns.length, 8);
    assert.equal(kit.enabled, false);
    assert.equal(kit.status, "DRAFT");
  }
});

test("ad validation rejects stale copy, wrong destinations, activation, unsupported claims and schema drift", async () => {
  ready("marketing/_tooling/validate.mjs");
  const { validateKit, loadCatalog } =
    await import("../../marketing/_tooling/validate.mjs");
  const page = (await loadCatalog()).find((p) => p.slug === "hvac");
  const original = JSON.parse(
    readFileSync(new URL("marketing/hvac/ads.json", root)),
  );
  const cases = [
    (v) => {
      v.enabled = true;
    },
    (v) => {
      v.accountId = "123";
    },
    (v) => {
      v.campaigns.pop();
    },
    (v) => {
      v.campaigns[0].pageHeadline = "stale";
    },
    (v) => {
      v.campaigns[0].pageCta = "stale";
    },
    (v) => {
      v.campaigns[0].headline = ["Unapproved creative"];
    },
    (v) => {
      v.campaigns[0].primaryText[0] = "x".repeat(126);
    },
    (v) => {
      v.campaigns[0].primaryText[0] = "Guaranteed results in 15 minutes";
    },
    (v) => {
      v.campaigns[0].primaryText[0] = "Not a shop, guaranteed results";
    },
    (v) => {
      v.campaigns[0].landingPath = "/en/business/plumbing";
    },
    (v) => {
      v.campaigns[0].cta = "APPLY_NOW";
    },
    (v) => {
      v.campaigns[0].ctaLabel = "wrong";
    },
    (v) => {
      v.campaigns[0].utm.utm_source = "unapproved";
    },
    (v) => {
      v.campaigns[0].locale = "de";
    },
    (v) => {
      delete v.instantForm.fr;
    },
    (v) => {
      v.instantForm.es.privacyPolicyPath = "/en/privacy-policy";
    },
    (v) => {
      v.whatsapp.fr.prefill = "";
    },
    (v) => {
      v.creativeBriefs = [];
    },
    (v) => {
      v.creativeBriefs[1].shots.fr[0] = "Résultats garantis";
    },
  ];
  for (const change of cases) {
    const kit = structuredClone(original);
    change(kit);
    assert.ok(validateKit(kit, page).length > 0, change.toString());
  }
});

test("planning exports escape CSV cells and never certify imports or enable a campaign", async () => {
  ready("marketing/_tooling/export-meta.mjs");
  const { exportPlans, csvCell } =
    await import("../../marketing/_tooling/export-meta.mjs");
  assert.equal(csvCell('a,"b"\nc'), '"a,""b""\nc"');
  assert.equal(csvCell("=SUM(A1:A2)"), '"\'=SUM(A1:A2)"');
  assert.equal(csvCell(" =SUM(A1:A2)"), '"\' =SUM(A1:A2)"');
  const out = mkdtempSync(join(tmpdir(), "breero-export-"));
  const result = await exportPlans(out);
  assert.equal(result.campaigns, 240);
  const meta = JSON.parse(readFileSync(join(out, "README.json")));
  assert.equal(meta.adsManagerImportCertified, false);
  assert.equal(meta.activationAllowed, false);
  assert.equal(meta.origin, "https://breero.com");
  assert.equal(meta.originSource, "user-supplied-public-domain-reference");
  assert.equal(meta.originOwnershipVerified, false);
  assert.equal(meta.originOperationalReadinessVerified, false);
  for (const locale of ["es", "en", "fr"]) {
    const csv = readFileSync(join(out, `meta-bulk-${locale}.csv`), "utf8");
    assert.ok(csv.includes("DRAFT"));
    assert.ok(csv.includes("https://breero.com/"));
    assert.ok(!csv.includes("Account ID"));
    assert.equal(
      JSON.parse(readFileSync(join(out, `instant-forms-${locale}.json`)))
        .length,
      30,
    );
  }
});

test("review package includes eight-week pilot organic calendars and required operational guides", () => {
  for (const name of [
    "docs/BRAND.md",
    "docs/MEASUREMENT.md",
    "docs/PAGES.md",
    "marketing/_whatsapp/flows.md",
    "marketing/_brand/meta-setup-checklist.md",
  ])
    ready(name);
  for (const locale of ["es", "en", "fr"]) {
    const path = `marketing/_organic/calendar.${locale}.md`;
    ready(path);
    const content = readFileSync(new URL(path, root), "utf8");
    assert.equal((content.match(/^## /gm) ?? []).length, 8);
    assert.equal(
      (
        content.match(
          /^\| (?:Mon|Tue|Wed|Thu|Fri|Weekend|Lun|Mar|Mié|Jue|Vie|Fin de semana|Lundi|Mardi|Mercredi|Jeudi|Vendredi|Week-end)\s+\|/gm,
        ) ?? []
      ).length,
      48,
    );
    for (const slug of [
      "hvac",
      "plumbing",
      "electrical",
      "home-cleaning",
      "pest-control",
    ])
      assert.ok(content.includes(slug));
  }
});

test("content checker catches missing locale, placeholders, invented claims and missing provider safeguards", async () => {
  ready("scripts/check_content.mjs");
  const { checkManifestContent } =
    await import("../../scripts/check_content.mjs");
  const page = (await import("../../pages/hvac/page.config.ts")).default;
  assert.deepEqual(checkManifestContent(page), []);
  for (const change of [
    (v) => {
      delete v.customer.fr;
    },
    (v) => {
      v.customer.es.headline = "[PLACEHOLDER headline]";
    },
    (v) => {
      v.customer.en.subhead = "The best in town with 99% success";
    },
    (v) => {
      v.provider.fr.leadModel = "Toujours disponible";
    },
    (v) => {
      v.provider.en.exampleLead.area = "Real live customer";
    },
    (v) => {
      v.customer.en.faq = [];
    },
  ]) {
    const value = structuredClone(page);
    change(value);
    assert.ok(checkManifestContent(value).length > 0, change.toString());
  }
});

test("budget gate fails closed on missing or oversized page output and sums every JS chunk", async () => {
  ready("scripts/check_budget.mjs");
  const { checkBudgets } = await import("../../scripts/check_budget.mjs");
  const fixture = mkdtempSync(join(tmpdir(), "breero-budget-"));
  assert.ok(checkBudgets(fixture, ["home"]).errors.length > 0);
  mkdirSync(join(fixture, "pages/home/dist/assets"), { recursive: true });
  writeFileSync(join(fixture, "pages/home/dist/index.html"), "<html></html>");
  writeFileSync(
    join(fixture, "pages/home/dist/assets/a.js"),
    "console.log('small');",
  );
  assert.equal(checkBudgets(fixture, ["home"]).errors.length, 0);
  writeFileSync(
    join(fixture, "pages/home/dist/assets/b.js"),
    randomBytes(140_000),
  );
  assert.ok(checkBudgets(fixture, ["home"]).errors.some((x) => /130/.test(x)));
});

test("WhatsApp drafts require all eighteen templates, correct consent category, variables and opt-out", async () => {
  ready("marketing/_whatsapp/templates.json");
  const { validateTemplates } =
    await import("../../marketing/_tooling/validate-templates.mjs");
  const value = JSON.parse(
    readFileSync(new URL("marketing/_whatsapp/templates.json", root)),
  );
  assert.deepEqual(validateTemplates(value), []);
  assert.equal(value.templates.length, 18);
  for (const change of [
    (v) => {
      v.templates.pop();
    },
    (v) => {
      v.templates[0].approved = true;
    },
    (v) => {
      v.templates[0].optOut = "";
    },
    (v) => {
      v.templates[0].samples = [];
    },
    (v) => {
      v.templates.find((x) => x.kind === "seasonal_offer").category = "UTILITY";
    },
    (v) => {
      v.templates.find((x) => x.kind === "reengagement").requiredPermission =
        "transactional";
    },
    (v) => {
      v.templates[0].body += " {{5}}";
    },
    (v) => {
      v.templates[0].body = "Guaranteed results for {{1}} in {{2}}";
    },
    (v) => {
      v.templates[0].trigger = "browser.click";
    },
    (v) => {
      v.templates[0].buttons = [
        { type: "URL", text: "Enable", url: "https://example.com" },
      ];
    },
  ]) {
    const mutated = structuredClone(value);
    change(mutated);
    assert.ok(validateTemplates(mutated).length > 0, change.toString());
  }
});
