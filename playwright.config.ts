/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import path from "path";

export default defineConfig({
  //below line logs into the application and create the storageState json for different users
  globalSetup: require.resolve("./config/global-setup"),
  testDir: './tests',
  // /* Run tests in files in parallel */
  fullyParallel: true,
  reporter: [
    ['html', { open: 'never' }]
    //enable below and install allure-playwright to generate allure report
    // ,
    // ...(process.env.ALLURE === 'true'
    //   ? [['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false }] as const]
    //   : []),
  ],
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 1,
  timeout: 30 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: process.env.HEADED !== 'true',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

});
