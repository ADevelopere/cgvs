// Test setup file
import { execSync } from "child_process";

// Ensure test directory exists
try {
  execSync("mkdir -p tests", { stdio: "ignore" });
} catch {
  // Ignore if directory already exists
}

// Set test environment variables
Object.assign(process.env, {
  NODE_ENV: "test",
  GRAPHQL_ENDPOINT:
    process.env.GRAPHQL_ENDPOINT || "http://localhost:3000/api/graphql",
});
