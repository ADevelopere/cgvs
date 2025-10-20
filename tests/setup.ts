// Test setup file
import { execSync } from "child_process";

// Ensure test directory exists
try {
  execSync("mkdir -p tests", { stdio: "ignore" });
} catch {
  // Ignore if directory already exists
}

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://localhost:3000/api/graphql";
