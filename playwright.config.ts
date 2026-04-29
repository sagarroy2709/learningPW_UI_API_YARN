import { defineConfig, devices } from '@playwright/test';
import './config/env.config';  // ← triggers env.config.ts to run
                               //   dotenv loads the correct .env file
                               //   process.env.BASE_URL is now populated

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
  timeout: 30 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    headless: process.env.HEADED !== 'true',
  },

  // all projects always defined — --project flag filters at run time through --projects CLI flag
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

});
