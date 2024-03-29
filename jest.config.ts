import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest/presets/js-with-ts",
  transform: {
    "^.+\\.mjs$": "ts-jest",
  },
  moduleNameMapper: {
    "~/(.*)": ["<rootDir>/src/$1"],
    "@server/(.*)": ["<rootDir>/src/server/$1"],
    "@utils/(.*)": ["<rootDir>/src/utils/$1"],
    "@context/(.*)": ["<rootDir>/src/context/$1"],
    "@components/(.*)": ["<rootDir>/src/components/$1"],
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
