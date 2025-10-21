// Test setup file
import { config } from "dotenv";
import { execSync } from "child_process";
import path from "path";
import fs from "fs/promises";

// Load test environment variables from .env.test
config({ path: path.resolve(process.cwd(), ".env.test") });

// Ensure test directory exists
try {
  execSync("mkdir -p tests/fixtures/storage-test", { stdio: "ignore" });
} catch {
  // Ignore if directory already exists
}

// Create storage test directory structure
const testStorageDir = path.resolve(
  process.cwd(),
  process.env.LOCAL_STORAGE_PATH || "./tests/fixtures/storage-test"
);

// Set up storage test directories
(async () => {
  try {
    await fs.mkdir(testStorageDir, { recursive: true, mode: 0o755 });
    await fs.mkdir(path.join(testStorageDir, "public"), {
      recursive: true,
      mode: 0o755,
    });
    await fs.mkdir(path.join(testStorageDir, "private"), {
      recursive: true,
      mode: 0o755,
    });
  } catch {
    // Ignore if directories already exist
  }
})();

// Set test environment variables
Object.assign(process.env, {
  NODE_ENV: "test",
  GRAPHQL_ENDPOINT:
    process.env.GRAPHQL_ENDPOINT || "http://localhost:3000/api/graphql",
});
