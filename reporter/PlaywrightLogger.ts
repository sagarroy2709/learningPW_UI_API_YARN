// ============================================================
// FILE: utils/logger/PlaywrightLogger.ts
//
// Logs to Playwright's HTML report only.
// Worker-safe because TestInfo is scoped per test per worker —
// never share a single instance across tests.
// ============================================================

import { TestInfo } from '@playwright/test';
import { ILogger } from './ILogger';

export class PlaywrightLogger implements ILogger {

  // TestInfo is injected via the fixture — never constructed manually.
  // Each worker gets its own TestInfo so parallel runs never collide.
  constructor(private readonly testInfo: TestInfo) {}

  async info(message: string): Promise<void> {
    this.testInfo.annotations.push({
      type: 'info',
      description: `ℹ️  ${this.ts()} ${message}`,
    });
    console.log(`[INFO]  ${this.ts()} ${message}`);
  }

  async warn(message: string): Promise<void> {
    this.testInfo.annotations.push({
      type: 'warn',
      description: `⚠️  ${this.ts()} ${message}`,
    });
    console.warn(`[WARN]  ${this.ts()} ${message}`);
  }

  async error(message: string, error?: Error): Promise<void> {
    this.testInfo.annotations.push({
      type: 'error',
      description: `❌  ${this.ts()} ${message}`,
    });
    // Attach full stack trace as a file so it's searchable in the HTML report
    if (error) {
      await this.attach(
        `error-${Date.now()}.txt`,
        `${message}\n\n${error.stack ?? error.message}`,
        'text/plain',
      );
    }
    console.error(`[ERROR] ${this.ts()} ${message}`, error ?? '');
  }

  async debug(message: string): Promise<void> {
    if (process.env.DEBUG !== 'true') return;
    this.testInfo.annotations.push({
      type: 'debug',
      description: `🔍  ${this.ts()} ${message}`,
    });
    console.debug(`[DEBUG] ${this.ts()} ${message}`);
  }

  // Annotates step start/end with timing.
  // Note: for true nested Playwright steps (visible in trace viewer),
  // use test.step() directly in your test. This gives you annotation-based
  // steps which show in the HTML report's annotation panel.
  async step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    this.testInfo.annotations.push({
      type: 'step',
      description: `▶  ${this.ts()} START: ${name}`,
    });
    try {
      const result = await fn();
      this.testInfo.annotations.push({
        type: 'step',
        description: `✅  DONE: ${name} (${Date.now() - start}ms)`,
      });
      return result;
    } catch (err) {
      this.testInfo.annotations.push({
        type: 'step',
        description: `❌  FAIL: ${name} (${Date.now() - start}ms)`,
      });
      throw err;
    }
  }

  async attach(
    name: string,
    content: string | Buffer,
    contentType: string = 'text/plain',
  ): Promise<void> {
    await this.testInfo.attach(name, {
      body: typeof content === 'string' ? Buffer.from(content) : content,
      contentType,
    });
  }

  private ts(): string {
    return new Date().toISOString().replace('T', ' ').substring(0, 23);
  }
}