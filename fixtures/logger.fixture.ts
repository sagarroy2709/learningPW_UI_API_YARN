// ============================================================
// FILE: fixtures/logger.fixture.ts
//
// Always constructs CompositeLogger — consistency regardless of
// how many loggers are active. Adding a new reporter is one line.
//
// ALLURE=true   → CompositeLogger([PlaywrightLogger, AllureLogger])
// ALLURE unset  → CompositeLogger([PlaywrightLogger])
// ============================================================

import { test as base, TestInfo } from '@playwright/test';
import { ILogger } from '../reporter/ILogger';
import { PlaywrightLogger } from '../reporter/PlaywrightLogger';
import { CompositeLogger } from '../reporter/CompositeLogger';

export type LoggerFixtures = {
  logger: ILogger;
};

export const loggerTest = base.extend<LoggerFixtures>({

  logger: async ({}, use, testInfo: TestInfo) => {

    // ── Build logger array ───────────────────────────────────
    // PlaywrightLogger is always first — it's the baseline.
    // Every additional reporter is just a push onto this array.
    const loggers: ILogger[] = [new PlaywrightLogger(testInfo)];

    //Have not added Allure yet, but this is the pattern to follow — dynamic import + conditional push.
    // if (process.env.ALLURE === 'true') {
    //   // Dynamic import so allure-playwright is never required
    //   // on machines where Allure isn't set up
    //   const { AllureLogger } = await import('../reporter/AllureLogger');
    //   loggers.push(new AllureLogger(testInfo));
    // }

    // Adding a new reporter in the future is always this pattern:
    // if (process.env.SLACK === 'true') {
    //   const { SlackLogger } = await import('../reporter/SlackLogger');
    //   loggers.push(new SlackLogger(testInfo));
    // }

    // ── Always CompositeLogger ───────────────────────────────
    // Consistent regardless of how many loggers are active.
    // CompositeLogger with one item behaves exactly like that
    // single logger — zero overhead, full consistency.
    const logger: ILogger = new CompositeLogger(loggers);

    // ── Log test metadata at start ───────────────────────────
    await logger.info(`Test: "${testInfo.title}"`);
    await logger.info(`Worker: #${testInfo.workerIndex} | Retry: ${testInfo.retry} | Project: ${testInfo.project.name}`);

    // ── Hand logger to the test ──────────────────────────────
    await use(logger);

    // ── Teardown ─────────────────────────────────────────────
    const icon: Record<string, string> = {
      passed:   '✅',
      failed:   '❌',
      skipped:  '⏭️',
      timedOut: '⏱️',
    };
    const status = testInfo.status ?? 'unknown';
    await logger.info(`Result: ${icon[status] ?? '❓'} ${status.toUpperCase()}`);
  },
});

export { expect } from '@playwright/test';