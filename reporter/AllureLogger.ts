// // ============================================================
// // FILE: utils/logger/AllureLogger.ts
// //
// // Logs to Allure report only. Completely standalone —
// // does NOT extend PlaywrightLogger (no inheritance coupling).
// // CompositeLogger fans out to both — that's how both reports
// // get populated, not through inheritance.
// //
// // Only active when ALLURE=true is set (checked in logger.fixture.ts).
// // ============================================================

// import { TestInfo } from '@playwright/test';
// import { allure } from 'allure-playwright';
// import { ContentType, LabelName, Severity } from 'allure-js-commons';
// import { ILogger } from './ILogger';

// export class AllureLogger implements ILogger {

//   constructor(private readonly testInfo: TestInfo) {}

//   async info(message: string): Promise<void> {
//     // Allure parameter shows as a key-value row in the test detail panel
//     await allure.parameter('INFO', message);
//   }

//   async warn(message: string): Promise<void> {
//     await allure.parameter('WARN', `⚠️ ${message}`);
//   }

//   async error(message: string, error?: Error): Promise<void> {
//     await allure.parameter('ERROR', `❌ ${message}`);
//     if (error) {
//       // Inline attachment in Allure report — clickable, shows stack trace
//       await allure.attachment(
//         'Error Details',
//         `${message}\n\n${error.stack ?? error.message}`,
//         ContentType.TEXT,
//       );
//     }
//   }

//   async debug(message: string): Promise<void> {
//     if (process.env.DEBUG !== 'true') return;
//     await allure.parameter('DEBUG', `🔍 ${message}`);
//   }

//   // Allure steps show in the timeline view with pass/fail colouring,
//   // duration bars, and nesting — much richer than annotation-based steps.
//   async step<T>(name: string, fn: () => Promise<T>): Promise<T> {
//     return allure.step(name, fn);
//   }

//   async attach(
//     name: string,
//     content: string | Buffer,
//     contentType: string = 'text/plain',
//   ): Promise<void> {
//     await allure.attachment(
//       name,
//       typeof content === 'string' ? content : content.toString('base64'),
//       contentType as ContentType,
//     );
//   }

//   // ── Allure-only extras ───────────────────────────────────────
//   // Not on ILogger — call these only when you have AllureLogger directly.
//   // Useful for tagging tests with severity, linking JIRA tickets etc.

//   async severity(level: Severity): Promise<void> {
//     await allure.label(LabelName.SEVERITY, level);
//   }

//   async issue(name: string, url: string): Promise<void> {
//     await allure.issue(name, url);
//   }

//   async label(name: string, value: string): Promise<void> {
//     await allure.label(name as LabelName, value);
//   }
// }