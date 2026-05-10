import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { configure } from "passmark";

dotenv.config({ path: path.resolve(__dirname, ".env") });

configure({
  ai: {
    gateway: "openrouter"
  }
});

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  globalTeardown: "./tests/global-teardown.ts",
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "artifacts/latest-playwright.json" }]
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true
  }
});
