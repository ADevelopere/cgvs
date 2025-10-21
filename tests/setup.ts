// Test setup file
import { config } from "dotenv";
import { execSync } from "child_process";
import path from "path";

// Load test environment variables from .env.test
config({ path: path.resolve(process.cwd(), ".env.test") });

// Ensure test directory exists
try {
  execSync("mkdir -p tests/fixtures/storage-test", { stdio: "ignore" });
} catch {
  // Ignore if directory already exists
}

// Set test environment variables
Object.assign(process.env, {
  NODE_ENV: "test",
  GRAPHQL_ENDPOINT:
    process.env.GRAPHQL_ENDPOINT || "http://localhost:3000/api/graphql",
});
