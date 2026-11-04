import { defineConfig } from "@playwright/test";
import {
  backendPort,
  firstPagePort,
  origin,
  selectedPages,
} from "./tests/e2e/catalog.ts";
export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  expect: { timeout: Number(process.env.TEST_EXPECT_TIMEOUT || 5000) },
  retries: 0,
  timeout: 45000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: origin("hvac"),
    browserName: "chromium",
    launchOptions: process.env.CHROME_BIN
      ? { executablePath: process.env.CHROME_BIN }
      : {},
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/dev-stack.mjs",
    env: {
      PAGES: selectedPages.join(","),
      BACKEND_PORT: String(backendPort),
      FIRST_PAGE_PORT: String(firstPagePort),
    },
    url: `${origin("digital-marketing")}/healthz`,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
