import { test as base, expect, Browser, Page } from "@playwright/test";
import { ENV } from "../config/env.config";

type AuthFixtures = {
    standardUserPage: Page;
    lockedOutUserPage: Page;
    // problemUserPage: Page;
    // performanceGlitchUserPage: Page;
    // errorUserPage: Page;
    // visualUserPage: Page;
};
// 
async function createAuthenticatedPage(browser: Browser,authFile: string,use: (page: Page) => Promise<void>): Promise<void> {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    await page.goto(ENV.BASE_URL);
    await use(page);
    await context.close();
}

export const test = base.extend<AuthFixtures>({

    standardUserPage: async ({ browser }, use) => {
        await createAuthenticatedPage(browser, ENV.USERS.standardUser.authFile, use);
    },

    lockedOutUserPage: async ({ browser }, use) => {
        await createAuthenticatedPage(browser, ENV.USERS.lockedOutUser.authFile, use);
    },

    // problemUserPage: async ({ browser }, use) => {
    //     await createAuthenticatedPage(browser, ENV.USERS.problemUser.authFile, use);
    // },

    // performanceGlitchUserPage: async ({ browser }, use) => {
    //     await createAuthenticatedPage(browser, ENV.USERS.performanceGlitchUser.authFile, use);
    // },

    // errorUserPage: async ({ browser }, use) => {
    //     await createAuthenticatedPage(browser, ENV.USERS.errorUser.authFile, use);
    // },

    // visualUserPage: async ({ browser }, use) => {
    //     await createAuthenticatedPage(browser, ENV.USERS.visualUser.authFile, use);
    // },
});