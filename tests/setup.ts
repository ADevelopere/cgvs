// Jest setup file for integration tests
// This sets global test timeouts

// Set default timeout for all tests to 60 seconds
if (typeof jest !== "undefined" && jest.setTimeout) {
  jest.setTimeout(60000);
}

// For environments that don't support jest.setTimeout (like Bun),
// export a timeout value that tests can use
export const TEST_TIMEOUT = 60000;
