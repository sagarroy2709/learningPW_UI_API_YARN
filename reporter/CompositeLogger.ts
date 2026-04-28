// ============================================================
// FILE: utils/logger/CompositeLogger.ts
//
// Composite Pattern — fans out every ILogger call to all
// registered loggers simultaneously.
//
// Design decisions:
//   - Uses Promise.allSettled so one failing logger (e.g. Allure
//     not configured) never kills the test or the other loggers.
//   - Logs a console.warn for any rejection so failures aren't silent.
//   - Holds ILogger[] — has no knowledge of Playwright or Allure.
//     Adding a third logger (e.g. Slack, DataDog) requires zero
//     changes here — just push another ILogger into the array.
// ============================================================

import { ILogger } from './ILogger';

export class CompositeLogger implements ILogger {

  // loggers is ILogger[] — not PlaywrightLogger[], not AllureLogger[].
  // This is the key — CompositeLogger is decoupled from all implementations.
  constructor(private readonly loggers: ILogger[]) {}

  async info(message: string): Promise<void> {
    await this.fanOut(l => l.info(message));
  }

  async warn(message: string): Promise<void> {
    await this.fanOut(l => l.warn(message));
  }

  async error(message: string, error?: Error): Promise<void> {
    await this.fanOut(l => l.error(message, error));
  }

  async debug(message: string): Promise<void> {
    await this.fanOut(l => l.debug(message));
  }

  async step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    // Steps are different — they wrap a function, not just fire-and-forget.
    // We need to run fn() exactly once, not once per logger.
    // Strategy: run fn() inside the first logger's step wrapper,
    // then notify the rest with a lightweight start/end annotation.
    const [first, ...rest] = this.loggers;

    if (!first) return fn();

    // First logger owns the actual step execution
    return first.step(name, async () => {
      // Remaining loggers just get notified — they don't re-execute fn()
      await this.fanOut(l => l.info(`▶ STEP: ${name}`), rest);
      const result = await fn();
      await this.fanOut(l => l.info(`✅ STEP DONE: ${name}`), rest);
      return result;
    });
  }

  async attach(
    name: string,
    content: string | Buffer,
    contentType: string = 'text/plain',
  ): Promise<void> {
    await this.fanOut(l => l.attach(name, content, contentType));
  }

  // ── Core fan-out logic ───────────────────────────────────────
  // allSettled = all loggers always run, rejections are captured not thrown.
  // The optional `targets` param lets step() fan out to a subset.
  private async fanOut(
    fn: (logger: ILogger) => Promise<void>,
    targets: ILogger[] = this.loggers,
  ): Promise<void> {
    const results = await Promise.allSettled(targets.map(fn));

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        // Warn but never throw — a broken reporter must not fail a test
        console.warn(
          `[CompositeLogger] Logger #${index} (${targets[index]?.constructor.name}) failed: ${result.reason}`,
        );
      }
    });
  }
}