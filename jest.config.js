module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts", "**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: [
    "client/**/*.ts",
    "server/storage/**/*.ts",
    "server/db/repo/signedUrl.repository.ts",
    "app/api/storage/**/*.ts",
    "!client/**/*.d.ts",
    "!client/**/__tests__/**",
    "!**/*.d.ts",
    "!tests/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
