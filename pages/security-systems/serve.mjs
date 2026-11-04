import { fileURLToPath } from "node:url";
import { startPageServer } from "@lp/page-kit";
import manifest from "./page.config.ts";
startPageServer({
  manifest,
  dist:
    process.env.DIST_DIR || fileURLToPath(new URL("./dist", import.meta.url)),
});
