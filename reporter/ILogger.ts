// ============================================================
// FILE: utils/logger/ILogger.ts
//
// The single contract every logger must satisfy.
// All concrete loggers (Playwright, Allure, Composite) implement
// this — nothing in your test code ever imports a concrete class.
// ============================================================

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface ILogger {
  info(message: string): Promise<void>;
  warn(message: string): Promise<void>;
  error(message: string, error?: Error): Promise<void>;
  debug(message: string): Promise<void>;

  // Wraps an async block in a named step shown in the report.
  // Generic <T> preserves the return type so callers don't need to cast.
  step<T>(name: string, fn: () => Promise<T>): Promise<T>;

  // Attaches arbitrary content (screenshots, JSON, HAR files etc.)
  attach(name: string, content: string | Buffer, contentType?: string): Promise<void>;
}