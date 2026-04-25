import { mergeTests, expect } from "@playwright/test";
import {test as authTest} from "./auth.fixture"
import {test as credentialTest} from "./credentials.fixture"

// Single import for all tests — tests never import individual fixture files
export const test = mergeTests(authTest, credentialTest);
export {expect};