/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import path from "path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  //below line logs into the application and create the storageState json for different users
  globalSetup: require.resolve("./config/global-setup"),
  testDir: './tests',
  // /* Run tests in files in parallel */
  // fullyParallel: true,
  reporter: [
    ['html', { open: 'never' }]
  ],
  workers: 1,
  timeout: 30*1000,
  expect: {
    timeout: 30*1000,
  },
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: false,
    
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  
  ],

});
