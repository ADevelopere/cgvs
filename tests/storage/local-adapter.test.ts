import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import fs from "fs/promises";
import path from "path";

// Import the adapter (env vars already set in setup.ts via .env.test)
import { createLocalAdapter } from "@/server/storage/disk/local";
import type { StorageService } from "@/server/storage/disk/storage.service.interface";

describe("Local Storage Adapter", () => {
  let adapter: StorageService;
  let testDir: string;

  beforeAll(async () => {
    // Get test directory from environment (set in .env.test and created in setup.ts)
    testDir = path.resolve(
      process.cwd(),
      process.env.LOCAL_STORAGE_PATH || "./tests/fixtures/storage-test"
    );

    // Create the adapter (env vars from .env.test are already loaded)
    adapter = await createLocalAdapter();
  });

  afterAll(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  beforeEach(async () => {
    // Reset test directory before each test
    await fs.rm(testDir, { recursive: true, force: true });
    await fs.mkdir(testDir, { recursive: true, mode: 0o755 });
    await fs.mkdir(path.join(testDir, "public"), {
      recursive: true,
      mode: 0o755,
    });
    await fs.mkdir(path.join(testDir, "private"), {
      recursive: true,
      mode: 0o755,
    });
  });

  describe("Serverless Environment Detection", () => {
    it("should throw fatal error when VERCEL environment variable is set", async () => {
      const originalVercel = process.env.VERCEL;
      process.env.VERCEL = "1";

      await expect(createLocalAdapter()).rejects.toThrow(
        /FATAL.*local.*storage provider.*serverless/i
      );

      // Restore
      if (originalVercel !== undefined) {
        process.env.VERCEL = originalVercel;
      } else {
        delete process.env.VERCEL;
      }
    });

    it("should throw fatal error when AWS_LAMBDA_FUNCTION_NAME is set", async () => {
      const originalLambda = process.env.AWS_LAMBDA_FUNCTION_NAME;
      process.env.AWS_LAMBDA_FUNCTION_NAME = "test-function";

      await expect(createLocalAdapter()).rejects.toThrow(
        /FATAL.*local.*storage provider.*serverless/i
      );

      // Restore
      if (originalLambda !== undefined) {
        process.env.AWS_LAMBDA_FUNCTION_NAME = originalLambda;
      } else {
        delete process.env.AWS_LAMBDA_FUNCTION_NAME;
      }
    });

    it("should throw fatal error when K_SERVICE is set", async () => {
      const originalKService = process.env.K_SERVICE;
      process.env.K_SERVICE = "cloud-run-service";

      await expect(createLocalAdapter()).rejects.toThrow(
        /FATAL.*local.*storage provider.*serverless/i
      );

      // Restore
      if (originalKService !== undefined) {
        process.env.K_SERVICE = originalKService;
      } else {
        delete process.env.K_SERVICE;
      }
    });
  });

  describe("Path Traversal Protection", () => {
    it("should reject path traversal with ../", async () => {
      const result = await adapter.fileInfoByPath("../../etc/passwd");
      // Path traversal should return null (file not accessible)
      expect(result).toBeNull();
    });

    it("should reject absolute paths", async () => {
      const result = await adapter.fileInfoByPath("/etc/passwd");
      // Absolute paths should return null (file not accessible)
      expect(result).toBeNull();
    });

    it("should reject complex traversal patterns", async () => {
      const result = await adapter.fileInfoByPath(
        "public/../private/secret.txt"
      );
      // Complex traversal should return null (file not accessible)
      expect(result).toBeNull();
    });

    it("should accept valid relative paths", async () => {
      // Create a test file first
      const testPath = path.join(testDir, "public", "test.txt");
      await fs.writeFile(testPath, "test content");

      // Test with fileExists which doesn't require database
      const result = await adapter.fileExists("public/test.txt");
      expect(result).toBe(true);
    });
  });
});
