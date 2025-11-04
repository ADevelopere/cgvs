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

import { resolve } from "path";
import { testLogger } from "@/lib/testlogger";
import { config } from "dotenv";
import { execSync } from "child_process";

// Load test environment first
config({ path: resolve(__dirname, "../../.env.test") });

// Validate DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  testLogger.error("DATABASE_URL is not set in .env.test");
  process.exit(1);
}

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

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const GRAPHQL_PATH = process.env.GRAPHQL_PATH || "/api/graphql";
const graphqlEndpoint = `${NEXT_PUBLIC_BASE_URL.replace(/\/+$/, "")}${GRAPHQL_PATH}`;

// Set test environment variables
Object.assign(process.env, {
  NODE_ENV: "test",
  GRAPHQL_ENDPOINT: graphqlEndpoint,
});

// Run migrations directly on the test database
const { runMigrations } = await import("@/server/db/scripts/migrate");

await (async () => {
  try {
    testLogger.info("🔧 Running migrations on test database");
    await runMigrations(false);
    testLogger.info("✓ Migrations completed successfully");
  } catch (err) {
    testLogger.error("Migration failed:", err);
    process.exit(1);
  }
})();

// Import the adapter (env vars already set in setup.ts via .env.test)
import { createLocalAdapter } from "@/server/storage/disk/local";
import type { StorageService } from "@/server/storage/disk/storage.service.interface";
import {
  type FileInfo,
  type DirectoryInfo,
} from "@/server/types/storage.types";
import { db } from "@/server/db/drizzleDb";
import { storageFiles, storageDirectories } from "@/server/db/schema/storage";

describe("Local Storage Adapter", () => {
  let adapter: StorageService;
  let testDir: string;

  beforeAll(async () => {
    testDir = path.resolve(
      process.cwd(),
      process.env.LOCAL_STORAGE_PATH || "./tests/fixtures/storage-test"
    );

    testLogger.info("🔧 beforeAll: Creating local adapter");
    testLogger.info("⚠️  Pool status: checking if pool is still available");

    // Create the adapter (env vars from .env.test are already loaded)
    adapter = await createLocalAdapter();

    testLogger.info("✓ beforeAll: Adapter created successfully");
  });

  afterAll(async () => {
    try {
      // Clean up filesystem
      await fs.rm(testDir, { recursive: true, force: true });
      testLogger.info("✓ Cleaned up test storage directory");
    } catch (error) {
      testLogger.error("Cleanup error:", error);
    }
  });

  beforeEach(async () => {
    // Clean database tables first
    await db.delete(storageFiles);
    await db.delete(storageDirectories);

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

  describe("File Upload Operations", () => {
    it("should upload file successfully with valid buffer", async () => {
      testLogger.info("📤 Test: Uploading file public/test.txt");
      const buffer = Buffer.from("test content");
      testLogger.info("📤 Calling adapter.uploadFile...");
      const result = await adapter.uploadFile(
        "public/test.txt",
        "text/plain",
        buffer
      );
      testLogger.info("📤 Upload result:", {
        success: result.success,
        message: result.message,
      });

      expect(result.success).toBe(true);
      expect(result.data?.path).toBe("public/test.txt");

      // Verify file exists on disk
      const filePath = path.join(testDir, "public", "test.txt");
      const content = await fs.readFile(filePath, "utf-8");
      expect(content).toBe("test content");
    });

    it("should create parent directories automatically", async () => {
      const buffer = Buffer.from("nested content");
      const result = await adapter.uploadFile(
        "public/deep/nested/path/file.txt",
        "text/plain",
        buffer
      );

      expect(result.success).toBe(true);

      // Verify directory structure was created
      const dirPath = path.join(testDir, "public", "deep", "nested", "path");
      const stats = await fs.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    it("should handle binary data correctly", async () => {
      const binaryData = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]);
      const result = await adapter.uploadFile(
        "public/binary.dat",
        "application/zip",
        binaryData
      );

      expect(result.success).toBe(true);

      // Verify binary data integrity
      const filePath = path.join(testDir, "public", "binary.dat");
      const readData = await fs.readFile(filePath);
      expect(Buffer.compare(readData, binaryData)).toBe(0);
    });
  });

  describe("File Deletion Operations", () => {
    beforeEach(async () => {
      // Create test files for deletion
      await fs.writeFile(
        path.join(testDir, "public", "delete-me.txt"),
        "to be deleted"
      );
    });

    it("should delete existing file", async () => {
      const result = await adapter.deleteFile("public/delete-me.txt");

      expect(result.success).toBe(true);

      // Verify file no longer exists
      const filePath = path.join(testDir, "public", "delete-me.txt");
      await expect(fs.access(filePath)).rejects.toThrow();
    });

    it("should return success false for non-existent file", async () => {
      const result = await adapter.deleteFile("public/non-existent.txt");

      expect(result.success).toBe(false);
    });
  });

  describe("File Rename Operations", () => {
    beforeEach(async () => {
      await fs.writeFile(
        path.join(testDir, "public", "old-name.txt"),
        "content"
      );
    });

    it("should rename file successfully", async () => {
      const result = await adapter.renameFile({
        currentPath: "public/old-name.txt",
        newName: "new-name.txt",
      });

      expect(result.success).toBe(true);

      // Verify old file doesn't exist
      const oldPath = path.join(testDir, "public", "old-name.txt");
      await expect(fs.access(oldPath)).rejects.toThrow();

      // Verify new file exists with same content
      const newPath = path.join(testDir, "public", "new-name.txt");
      const content = await fs.readFile(newPath, "utf-8");
      expect(content).toBe("content");
    });

    it("should rename file in same directory", async () => {
      const result = await adapter.renameFile({
        currentPath: "public/old-name.txt",
        newName: "renamed.txt",
      });

      expect(result.success).toBe(true);

      // Verify old file doesn't exist
      const oldPath = path.join(testDir, "public", "old-name.txt");
      await expect(fs.access(oldPath)).rejects.toThrow();

      // Verify new file exists in same directory
      const newPath = path.join(testDir, "public", "renamed.txt");
      const content = await fs.readFile(newPath, "utf-8");
      expect(content).toBe("content");
    });
  });

  describe("Directory Operations", () => {
    it("should create nested directories", async () => {
      const result = await adapter.createFolder({
        path: "public/nested/deep/folder",
      });

      expect(result.success).toBe(true);

      const dirPath = path.join(testDir, "public", "nested", "deep", "folder");
      const stats = await fs.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    it("should list directory contents", async () => {
      // Create test structure
      await fs.writeFile(path.join(testDir, "public", "file1.txt"), "one");
      await fs.writeFile(path.join(testDir, "public", "file2.txt"), "two");
      await fs.mkdir(path.join(testDir, "public", "subdir"), {
        recursive: true,
      });

      const result = await adapter.listFiles({ path: "public" });

      expect(result.items.length).toBeGreaterThanOrEqual(2);
      expect(
        result.items.some(
          (f: FileInfo | DirectoryInfo) => f.name === "file1.txt"
        )
      ).toBe(true);
      expect(
        result.items.some(
          (f: FileInfo | DirectoryInfo) => f.name === "file2.txt"
        )
      ).toBe(true);
    });

    it("should fetch immediate child directories only (no files)", async () => {
      // Create nested structure with directories and files
      await fs.mkdir(path.join(testDir, "public", "nested"), {
        recursive: true,
      });
      await fs.mkdir(path.join(testDir, "public", "another"), {
        recursive: true,
      });
      await fs.writeFile(path.join(testDir, "public", "root.txt"), "root");
      await fs.writeFile(
        path.join(testDir, "public", "nested", "child.txt"),
        "child"
      );

      const result = await adapter.fetchDirectoryChildren("public");

      // fetchDirectoryChildren returns ONLY directories, not files (matching GCP behavior)
      expect(result.some((c: DirectoryInfo) => c.name === "nested")).toBe(true);
      expect(result.some((c: DirectoryInfo) => c.name === "another")).toBe(
        true
      );
      // Should NOT include files like root.txt
      expect(result.some((c: DirectoryInfo) => c.name === "root.txt")).toBe(
        false
      );
      // Should NOT include nested children
      expect(result.some((c: DirectoryInfo) => c.name === "child.txt")).toBe(
        false
      );
    });
  });

  describe("Bulk Operations", () => {
    beforeEach(async () => {
      await fs.mkdir(path.join(testDir, "source"), { recursive: true });
      await fs.mkdir(path.join(testDir, "dest"), { recursive: true });
      await fs.writeFile(path.join(testDir, "source", "file1.txt"), "one");
      await fs.writeFile(path.join(testDir, "source", "file2.txt"), "two");
      await fs.writeFile(path.join(testDir, "source", "file3.txt"), "three");
    });

    it("should move multiple files", async () => {
      testLogger.info("🔄 Test: Moving multiple files");
      testLogger.info(
        "🔄 About to call adapter.moveItems with database operations"
      );
      const result = await adapter.moveItems({
        sourcePaths: ["source/file1.txt", "source/file2.txt"],
        destinationPath: "dest",
      });
      testLogger.info("🔄 Move result:", {
        success: result.success,
        successCount: result.successCount,
        failureCount: result.failureCount,
      });

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(2);

      // Verify files moved
      await expect(
        fs.access(path.join(testDir, "source", "file1.txt"))
      ).rejects.toThrow();
      const destFile = path.join(testDir, "dest", "file1.txt");
      // fs.access() resolves to undefined on success, rejects on failure
      await fs.access(destFile); // Will throw if file doesn't exist
      expect(true).toBe(true); // If we get here, file exists
    });

    it("should copy multiple files", async () => {
      const result = await adapter.copyItems({
        sourcePaths: ["source/file1.txt", "source/file2.txt"],
        destinationPath: "dest",
      });

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(2);

      // Verify files copied (originals still exist)
      const sourceFile = path.join(testDir, "source", "file1.txt");
      const destFile = path.join(testDir, "dest", "file1.txt");
      // fs.access() resolves to undefined on success, rejects on failure
      await fs.access(sourceFile); // Will throw if file doesn't exist
      await fs.access(destFile); // Will throw if file doesn't exist
      expect(true).toBe(true); // If we get here, both files exist
    });

    it("should delete multiple files", async () => {
      const result = await adapter.deleteItems({
        paths: ["source/file1.txt", "source/file2.txt"],
      });

      expect(result.success).toBe(true);
      expect(result.successCount).toBe(2);

      // Verify files deleted
      await expect(
        fs.access(path.join(testDir, "source", "file1.txt"))
      ).rejects.toThrow();
      await expect(
        fs.access(path.join(testDir, "source", "file2.txt"))
      ).rejects.toThrow();
    });
  });

  describe("Storage Statistics", () => {
    beforeEach(async () => {
      await fs.writeFile(path.join(testDir, "public", "small.txt"), "hi");
      await fs.writeFile(
        path.join(testDir, "public", "large.txt"),
        "x".repeat(10000)
      );
    });

    it("should calculate storage statistics", async () => {
      const stats = await adapter.storageStatistics();

      expect(stats.totalFiles).toBeGreaterThanOrEqual(2);
      expect(stats.totalSize).toBeGreaterThan(10000);
    });
  });
});
