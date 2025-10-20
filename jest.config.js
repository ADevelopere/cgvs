module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts", "**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: [
    "client/**/*.ts",
    "!client/**/*.d.ts",
    "!client/**/__tests__/**",
    "!tests/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
