// BasePage.ts
import { type Page, type Locator } from '@playwright/test';

export abstract class BasePage {

  // Every page object gets 'page' automatically by calling super(page)
  constructor(protected page: Page) {}

  // ── NAVIGATION ──────────────────────────────────────────────────────────

  // Each child page defines its own path; BasePage handles the actual goto()
  protected abstract readonly path: string;

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.waitForPageLoad();
  }

  // ── WAITING ─────────────────────────────────────────────────────────────

  // One place to define your "page is ready" strategy
  // If you switch from networkidle to domcontentloaded later, change it HERE only
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Waits for a specific element to be visible before interacting
  async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  // ── HELPERS ─────────────────────────────────────────────────────────────

  // Used in tests like: await loginPage.getTitle()  →  'Swag Labs'
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // Scroll an element into view before clicking — avoids "element not interactable"
  async scrollAndClick(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }
}