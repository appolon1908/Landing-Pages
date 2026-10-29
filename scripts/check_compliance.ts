import { readFile } from "node:fs/promises";
import { parseSiteContext } from "../packages/contracts/site.ts";
import { assessWebsite } from "../packages/contracts/compliance.ts";
import { documentLinks } from "../packages/compliance/pages.ts";

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const json = args.includes("--json");
const registryIndex = args.indexOf("--registry");
const registryPath =
  registryIndex >= 0 ? args[registryIndex + 1] : process.env.SITE_REGISTRY_FILE;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--registry") {
    if (!args[++i]) throw Error("--registry needs a path.");
  } else if (!["--strict", "--json"].includes(args[i]))
    throw Error(`Unknown option: ${args[i]}`);
}
try {
  const registry: unknown = JSON.parse(
    await readFile(
      registryPath || new URL("../config/sites.preview.json", import.meta.url),
      "utf8",
    ),
  );
  if (!Array.isArray(registry) || !registry.length)
    throw Error("An explicit site registry is required.");
  const results = registry.map((entry) => {
    const site = parseSiteContext(entry.site);
    return {
      siteId: site.siteId,
      ...assessWebsite(site),
      policyUrls: documentLinks(site, "en").map(
        (link) => site.publicOrigin + link.href,
      ),
    };
  });
  if (json)
    console.log(
      JSON.stringify(
        { check: "website-structure-and-business-review", results },
        null,
        2,
      ),
    );
  else
    for (const result of results) {
      console.log(
        `${result.siteId}: ${result.readyForReview ? "website profile ready for external review" : `${result.blockers.length} business/profile items need attention`}; publication authorized: false`,
      );
      for (const item of result.blockers)
        console.log(`  ${item.path}: ${item.message}`);
      for (const check of result.externalChecks)
        console.log(`  External acceptance: ${check}`);
    }
  process.exitCode =
    strict && results.some((result) => !result.readyForReview) ? 1 : 0;
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Invalid site registry.",
  );
  process.exitCode = 1;
}
