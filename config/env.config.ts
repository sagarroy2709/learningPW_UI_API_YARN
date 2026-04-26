import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from project root — does nothing if file doesn't exist (e.g. CI)
// CI injects variables directly into process.env, no file needed
const env = process.env.NODE_ENV ?? "test";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

// Validates a variable exists at startup — fails loudly rather than
// silently passing undefined into test code
function required(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(
            `Missing required environment variable: "${key}"\n` +
            `Check .env.example for the full list of required variables.`
        );
    }
    return value;
}

// Auth directory anchored to project root
const AUTH_DIR = path.resolve(process.cwd(), ".auth");

// Each user is a complete self-contained record:
// credentials (from .env) + auth file path (derived from their name)
// AUTH_PATHS are co-located here because path and credentials
// describe the same entity — the user
export const USERS = {
    standardUser: {
        username: required("STANDARD_USER_USERNAME"),
        password: required("STANDARD_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "standard-user.json"),
    },
    lockedOutUser: {
        username: required("LOCKED_OUT_USER_USERNAME"),
        password: required("LOCKED_OUT_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "locked-out-user.json"),
    },
    problemUser: {
        username: required("PROBLEM_USER_USERNAME"),
        password: required("PROBLEM_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "problem-user.json"),
    },
    performanceGlitchUser: {
        username: required("PERFORMANCE_GLITCH_USER_USERNAME"),
        password: required("PERFORMANCE_GLITCH_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "performance-glitch-user.json"),
    },
    errorUser: {
        username: required("ERROR_USER_USERNAME"),
        password: required("ERROR_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "error-user.json"),
    },
    visualUser: {
        username: required("VISUAL_USER_USERNAME"),
        password: required("VISUAL_USER_PASSWORD"),
        authFile: path.join(AUTH_DIR, "visual-user.json"),
    },
} as const;


export type Users = typeof USERS;
export type UserKey = keyof Users;
export type User = Users[UserKey];

export const ENV = {
    BASE_URL: required("BASE_URL"),
    USERS,
} as const;