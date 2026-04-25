// tests/global-setup.ts
import { chromium, firefox, webkit, FullConfig, BrowserType } from "@playwright/test";
import { ENV } from "./env.config";
import { LoginPage } from "../pages/loginPage.PO";
import * as fs from "fs";
import * as path from "path";

async function loginAndSave(
  credentials: { username: string; password: string, authFile: string }, browserType: BrowserType): Promise<void> {
  const browser = await browserType.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto(ENV.BASE_URL);
    await loginPage.loginAs(credentials.username,credentials.password);
    await context.storageState({ path: credentials.authFile });
    console.log(`✓ Auth saved: ${credentials.authFile}`);
  }
  finally {
    await browser.close();
  }
}

async function globalSetup(config: FullConfig) {

  const browserName = config.projects[0]?.use?.browserName ?? "chromium";
  const browserType = { chromium, firefox, webkit }[browserName] ?? chromium;

  // Create .auth/ dir once before all parallel logins
  fs.mkdirSync(path.resolve(process.cwd(), ".auth"), { recursive: true });

  // All users login concurrently — fast even with many users
  await Promise.all(
    Object.values(ENV.USERS).map(user => loginAndSave(user, browserType))
  );
}

export default globalSetup; 