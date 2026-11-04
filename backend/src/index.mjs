import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { buildRegistry, loadRegistryDir } from "./registry.mjs";
import { createIdempotencyStore } from "./idempotency.mjs";
import { createBackend } from "./server.mjs";
import { loadPageManifests } from "./manifests.mjs";

const dir =
  process.env.REGISTRY_DIR ||
  fileURLToPath(new URL("../../config/registry", import.meta.url));
const registry = buildRegistry(await loadRegistryDir(resolve(dir)));
const server = createBackend({
  registry,
  frontDeskDemoOrigin: process.env.FRONT_DESK_DEMO_ORIGIN,
  manifests: await loadPageManifests(
    fileURLToPath(new URL("../../pages", import.meta.url)),
  ),
  store: createIdempotencyStore({
    journalFile: process.env.SUBMISSION_JOURNAL || null,
  }),
});
const port = Number(process.env.PORT || 4000);
server.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(
    `Backend listening on ${port}; ${registry.sites().length} site(s): ${registry
      .sites()
      .map(
        (s) =>
          `${s.siteId}[${s.mode}${s.submissionsEnabled ? ",submissions" : ""}]`,
      )
      .join(" ")}`,
  ),
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => server.close(() => process.exit(0)));
