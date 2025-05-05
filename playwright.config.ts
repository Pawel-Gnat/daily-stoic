import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

export default defineConfig({
  testDir: "tests/e2e",
  globalTeardown: "./tests/global.teardown.ts",
  timeout: 30 * 1000,
  expect: {
    toHaveScreenshot: { threshold: 0.2 },
  },
  fullyParallel: true,
  retries: 1,
  reporter: [["list"], ["html", { outputFolder: "test-results", open: false }]],
  use: {
    browserName: "chromium",
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5 * 1000,
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  outputDir: "test-results/",
  webServer: {
    command: "npm run dev:e2e",
    url: process.env.BASE_URL || "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
