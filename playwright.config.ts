import { defineConfig, devices } from "@playwright/test";
require("dotenv").config();

export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    extraHTTPHeaders: {
      Authorization: `Token ${process.env.ACCESS_TOKEN}`,
    },
  },
  globalSetup: require.resolve("./global-setup.ts"),
  globalTeardown: require.resolve("./global-teardown.ts"),

  /* Configure projects for major browsers */
  projects: [
    { name: "setup", testMatch: "auth.setup.ts" },

    { name: "clean-up article", testMatch: "article.teardown.ts" },

    {
      name: "setup article",
      testMatch: "article.setup.ts",
      dependencies: ["setup"],
      teardown: "clean-up article",
    },

    {
      name: "likeButton",
      testMatch: "likesCounter.spec.ts",
      use: { ...devices["Desktop Chrome"], storageState: ".auth/user.json" },
      dependencies: ["setup article"],
    },

    {
      name: "likeButtonGlobal",
      testMatch: "likesCounterGlobal.spec.ts",
      use: { ...devices["Desktop Chrome"], storageState: ".auth/user.json" },
    },

    {
      name: "chromium",
      testIgnore: "likesCounter.spec.ts",
      use: { ...devices["Desktop Chrome"], storageState: ".auth/user.json" },
      dependencies: ["setup"],
    },
  ],
});
