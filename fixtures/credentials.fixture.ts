import { test as base } from "@playwright/test";
import { USERS, Users } from "../config/env.config";

type CredentialsFixtures = {
  credentials: Users;
};

export const test = base.extend<CredentialsFixtures>({

  credentials: async ({}, use) => {
    await use(USERS);
  },
});