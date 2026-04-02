/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/lib/**/*.{ts,tsx}",
    "!src/lib/**/context.ts",
    "!src/lib/**/context.tsx",
    "!**/*.d.ts",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "html", "json-summary"],
  coverageThreshold: {
    global: {
      lines: 20,
      functions: 20,
      statements: 20,
      branches: 10,
    },
  },
};

