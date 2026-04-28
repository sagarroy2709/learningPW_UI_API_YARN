import { mergeTests, expect } from "@playwright/test";
import { authTest } from "./auth.fixture";
import { credentialsTest } from "./credentials.fixture"
import { loggerTest } from "./logger.fixture";

// Single import for all tests — tests never import individual fixture files
export const test = mergeTests(authTest, credentialsTest, loggerTest);
export { expect };