import { chromium, firefox, webkit, FullConfig, BrowserType } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { ENV } from "./env.config";  // ← env.config handles dotenv internally
import { LoginPage } from "../pages/LoginPage.PO";


async function globalSetup(config: FullConfig) {

// use the browser from the active project — not hardcoded to projects[0]
  const browserName = (config.projects.find(p => p.use?.browserName)?.use?.browserName) ?? 'chromium';
  const browserType = { chromium, firefox, webkit }[browserName] ?? chromium;

  // Create .auth/ dir once before all parallel logins
  fs.mkdirSync(path.resolve(process.cwd(), ".auth"), { recursive: true });

  // All users login concurrently — fast even with many users
  await Promise.all(
    Object.values(ENV.USERS).map(user => loginAndSave(user, browserType))
  );
}

async function loginAndSave(
  credentials: { username: string; password: string, authFile: string }, browserType: BrowserType): Promise<void> {
  const browser = await browserType.launch();
  try {
    const context = await browser.newContext({ 
      baseURL: ENV.BASE_URL });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto( );
    await loginPage.loginAs(credentials.username,credentials.password);
    await context.storageState({ path: credentials.authFile });
    console.log(`✓ Auth saved: ${credentials.authFile}`);
  }
  finally {
    await browser.close();
  }
}
export default globalSetup; 