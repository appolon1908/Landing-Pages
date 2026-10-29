import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  expect: { timeout: Number(process.env.TEST_EXPECT_TIMEOUT || 5000) },
  retries: 0,
  timeout: 120000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    launchOptions: process.env.CHROME_BIN
      ? { executablePath: process.env.CHROME_BIN }
      : {},
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node --experimental-strip-types server/index.mjs",
    url: "http://127.0.0.1:4173/healthz",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
