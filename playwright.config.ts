import { defineConfig, devices } from "@playwright/test";
import { env } from "@/config/env";

export default defineConfig({
  forbidOnly: env.CI,
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: "html",
  retries: 0,
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "bun run dev",
    reuseExistingServer: !env.CI,
    url: "http://localhost:3000",
  },
  workers: env.CI ? 1 : undefined,
});
