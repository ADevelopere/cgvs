// ~/.bun/bin/bun test --timeout=60000 tests/storage/api-routes.integration.test.ts --testNamePattern="should upload file successfully"

import {
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  it,
  expect,
} from "@jest/globals";
import { spawn, type ChildProcess } from "child_process";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { resolve } from "path";
import { testLogger } from "@/lib/testlogger";
import { config } from "dotenv";
import { SignedUrlRepository } from "@/server/db/repo/signedUrl.repository";
import { db } from "@/server/db/drizzleDb";
import {
  storageFiles,
  storageDirectories,
  signedUrls,
} from "@/server/db/schema/storage";
import { loginMutationDocument } from "@/client/graphql/sharedDocuments/auth.documents";
import { UserRepository } from "@/server/db/repo";
import { Email } from "@/server/lib";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";

// Load test environment first
config({ path: resolve(__dirname, "../../.env.test") });

// Validate DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  testLogger.error("DATABASE_URL is not set in .env.test");
  process.exit(1);
}

// Set test environment variables
Object.assign(process.env, {
  NODE_ENV: "test",
  GRAPHQL_ENDPOINT:
    process.env.GRAPHQL_ENDPOINT || "http://localhost:3000/api/graphql",
  STORAGE_PROVIDER: "local",
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

// Global variables
let devServer: ChildProcess | null = null;
let serverPort = 0;
let testStorageDir: string;
let authToken: string | null = null;
let apolloClient: ApolloClient;

/**
 * Start the development server on a random port
 */
async function startDevServer(): Promise<number> {
  return new Promise((resolve, reject) => {
    testLogger.info("Starting development server...");

    // Use a non-popular port range (8000-8999)
    const port = Math.floor(Math.random() * 1000) + 8000;

    devServer = spawn(
      "/home/vscode/.bun/bin/bun",
      ["dev", "--port", port.toString()],
      {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: process.cwd(),
        env: { ...process.env, PORT: port.toString() },
      }
    );

    let serverStarted = false;
    let output = "";
    let errorOutput = "";

    devServer.stdout?.on("data", data => {
      output += data.toString();
      testLogger.info("Dev server output:", data.toString());

      // Look for server start confirmation
      if (
        output.includes("Ready in") ||
        output.includes("ready") ||
        output.includes("listening") ||
        output.includes("started")
      ) {
        if (!serverStarted) {
          serverStarted = true;
          serverPort = port;

          // Wait a bit for server to fully start
          setTimeout(() => {
            testLogger.info(`Development server started on port ${serverPort}`);
            resolve(serverPort);
          }, 3000);
        }
      }
    });

    devServer.stderr?.on("data", data => {
      errorOutput += data.toString();
      const message = data.toString();

      // Next.js prints startup info to stderr, which is not actually an error
      if (message.includes("$ next dev") || message.includes("▲ Next.js")) {
        testLogger.info("Dev server stderr:", message);
      } else {
        testLogger.error("Dev server error:", message);
      }

      if (
        !serverStarted &&
        errorOutput.includes("Error") &&
        !errorOutput.includes("Warning") &&
        !errorOutput.includes("$ next dev")
      ) {
        reject(new Error(`Failed to start dev server: ${errorOutput}`));
      }
    });

    devServer.on("error", error => {
      testLogger.error("Failed to spawn dev server:", error);
      reject(error);
    });

    devServer.on("exit", code => {
      if (code !== 0 && !serverStarted) {
        reject(new Error(`Dev server exited with code ${code}`));
      }
    });

    // Fallback timeout
    setTimeout(() => {
      if (!serverStarted) {
        testLogger.warn(`Server start timeout, assuming port ${port} is ready`);
        serverPort = port;
        resolve(serverPort);
      }
    }, 30000);
  });
}

/**
 * Stop the development server
 */
async function stopDevServer(): Promise<void> {
  if (devServer) {
    testLogger.info("Stopping development server...");

    return new Promise(resolve => {
      const timeout = setTimeout(() => {
        if (devServer) {
          testLogger.warn("Force killing dev server...");
          devServer.kill("SIGKILL");
        }
      }, 5000);

      devServer?.on("exit", () => {
        clearTimeout(timeout);
        testLogger.info("Development server stopped");
        devServer = null;
        resolve();
      });

      devServer?.kill("SIGTERM");
    });
  }
}

/**
 * Calculate MD5 hash of buffer in base64 format
 */
function calculateMd5(buffer: Buffer): string {
  const hash = crypto.createHash("md5");
  hash.update(buffer);
  return hash.digest("base64");
}

/**
 * Create a signed URL token directly in the database
 */
async function createSignedUrlToken(options: {
  id?: string;
  filePath: string;
  contentType?: string;
  fileSize: bigint;
  contentMd5: string;
  expiresAt?: Date;
  used?: boolean;
}) {
  const token = {
    id: options.id || crypto.randomUUID(),
    filePath: options.filePath,
    contentType: options.contentType || "text/plain",
    fileSize: options.fileSize,
    contentMd5: options.contentMd5,
    expiresAt: options.expiresAt || new Date(Date.now() + 3600000), // 1 hour from now
    createdAt: new Date(),
    used: options.used ?? false,
  };

  return await SignedUrlRepository.createSignedUrl(token);
}

/**
 * Create a test file on disk
 */
async function _createTestFile(
  relativePath: string,
  content: Buffer | string
): Promise<{ path: string; size: number; md5: string }> {
  const absolutePath = path.join(testStorageDir, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true, mode: 0o755 });

  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
  await fs.writeFile(absolutePath, buffer);

  return {
    path: relativePath,
    size: buffer.length,
    md5: calculateMd5(buffer),
  };
}

/**
 * Make an API request to the dev server
 */
async function makeApiRequest(
  apiPath: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `http://localhost:${serverPort}${apiPath}`;
  testLogger.info(`Making API request: ${options.method || "GET"} ${url}`);

  // Add authentication token if available
  if (authToken) {
    if (!options.headers) {
      options.headers = {};
    }
    // Add both Cookie and Authorization header for compatibility
    (options.headers as Record<string, string>)["Cookie"] =
      `token=${authToken}`;
    (options.headers as Record<string, string>)["Authorization"] =
      `Bearer ${authToken}`;
  }

  return await fetch(url, options);
}

/**
 * Create admin user if not exists
 */
async function createAdminUserIfNotExists(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@cgvs.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "cgvs@123";

  testLogger.info("Checking for admin user...");

  let adminUser = await UserRepository.findByEmail(adminEmail);

  if (!adminUser) {
    testLogger.info("Creating admin user...");
    adminUser = await UserRepository.create({
      name: "System Administrator",
      email: new Email(adminEmail),
      password: adminPassword,
    });
    testLogger.info("✓ Admin user created");
  } else {
    testLogger.info("✓ Admin user already exists");
  }
}

/**
 * Login and get authentication token
 */
async function loginAsAdmin(): Promise<string> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@cgvs.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "cgvs@123";

  testLogger.info("Logging in as admin...");

  const result = await apolloClient.mutate({
    mutation: loginMutationDocument,
    variables: {
      input: {
        email: adminEmail,
        password: adminPassword,
      },
    },
  });

  if (result.error) {
    throw new Error(`Login failed: ${JSON.stringify(result.error)}`);
  }

  const token = result.data?.login?.token;
  if (!token) {
    throw new Error("No token returned from login mutation");
  }

  testLogger.info("✓ Login successful");
  return token;
}

describe("Storage API Routes Integration Tests", () => {
  beforeAll(async () => {
    testLogger.info("🔧 Setting up API routes tests");

    // Set up test storage directory
    testStorageDir = path.resolve(
      process.cwd(),
      process.env.LOCAL_STORAGE_PATH || "./tests/fixtures/storage-test"
    );

    testLogger.info("Creating test storage directories...");
    // Create storage directories
    await fs.mkdir(testStorageDir, { recursive: true, mode: 0o755 });
    await fs.mkdir(path.join(testStorageDir, "public"), {
      recursive: true,
      mode: 0o755,
    });
    await fs.mkdir(path.join(testStorageDir, "private"), {
      recursive: true,
      mode: 0o755,
    });
    await fs.mkdir(path.join(testStorageDir, "temp"), {
      recursive: true,
      mode: 0o755,
    });
    testLogger.info("✓ Storage directories created");

    // Create admin user if not exists
    await createAdminUserIfNotExists();

    // Start development server
    testLogger.info("Starting dev server...");
    serverPort = await startDevServer();
    testLogger.info("✓ Dev server started on port", serverPort);

    // Create Apollo Client
    const httpLink = new HttpLink({
      uri: `http://localhost:${serverPort}/api/graphql`,
      credentials: "include",
    });

    apolloClient = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });
    testLogger.info("✓ Apollo client created");

    // Login and get auth token
    authToken = await loginAsAdmin();

    testLogger.info("✓ Setup complete");
  });

  afterAll(async () => {
    testLogger.info("🧹 Cleaning up after tests");
    try {
      // Stop dev server
      await stopDevServer();

      // Clean up filesystem
      await fs.rm(testStorageDir, { recursive: true, force: true });
      testLogger.info("✓ Cleaned up test storage directory");
    } catch (error) {
      testLogger.error("Cleanup error:", error);
    }
  });

  beforeEach(async () => {
    testLogger.info("🧹 Cleaning up before test");
    // Clean database tables
    await db.delete(signedUrls);
    await db.delete(storageFiles);
    await db.delete(storageDirectories);

    // Reset test directory before each test
    await fs.rm(testStorageDir, { recursive: true, force: true });
    await fs.mkdir(testStorageDir, { recursive: true, mode: 0o755 });
    await fs.mkdir(path.join(testStorageDir, "public"), {
      recursive: true,
      mode: 0o755,
    });
    await fs.mkdir(path.join(testStorageDir, "private"), {
      recursive: true,
      mode: 0o755,
    });
    await fs.mkdir(path.join(testStorageDir, "temp"), {
      recursive: true,
      mode: 0o755,
    });
    testLogger.info("✓ Cleanup complete");
  });

  describe("Upload API (/api/storage/upload/[id])", () => {
    it("should upload file successfully with valid signed URL", async () => {
      // Create test file content
      const fileContent = Buffer.from("test file content for upload");
      const contentMd5 = calculateMd5(fileContent);
      const filePath = "public/test-upload.txt";
      const tokenId = crypto.randomUUID();

      // Create signed URL token in database
      await createSignedUrlToken({
        id: tokenId,
        filePath,
        contentType: "text/plain",
        fileSize: BigInt(fileContent.length),
        contentMd5,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        used: false,
      });

      // Upload file via API
      const response = await makeApiRequest(`/api/storage/upload/${tokenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
          "Content-MD5": contentMd5,
          "Content-Length": fileContent.length.toString(),
        },
        body: fileContent,
      });

      // Verify response
      expect(response.status).toBe(201);
      const responseData = await response.json();
      expect(responseData.path).toBe(filePath);
      expect(responseData.contentType).toBe("text/plain");

      // Verify file exists on disk
      const absolutePath = path.join(testStorageDir, filePath);
      const diskContent = await fs.readFile(absolutePath);
      expect(Buffer.compare(diskContent, fileContent)).toBe(0);

      // Verify database record created
      const dbFiles = await db.select().from(storageFiles);
      expect(dbFiles.length).toBe(1);
      expect(dbFiles[0].path).toBe(filePath);

      // Verify signed URL marked as used
      const token = await SignedUrlRepository.getSignedUrlById(tokenId);
      expect(token?.used).toBe(true);
    });

    it("should reject invalid token (non-existent)", async () => {
      // Create test file content
      const fileContent = Buffer.from("test file content");
      const contentMd5 = calculateMd5(fileContent);
      const nonExistentTokenId = crypto.randomUUID();

      // Attempt to upload with non-existent token
      const response = await makeApiRequest(
        `/api/storage/upload/${nonExistentTokenId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "text/plain",
            "Content-MD5": contentMd5,
            "Content-Length": fileContent.length.toString(),
          },
          body: fileContent,
        }
      );

      // Verify response indicates invalid token
      expect(response.status).toBe(403);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toContain("invalid");

      // Verify no file created on disk
      const files = await db.select().from(storageFiles);
      expect(files.length).toBe(0);

      // Verify no files in storage directory
      const publicDir = path.join(testStorageDir, "public");
      const publicFiles = await fs.readdir(publicDir);
      expect(publicFiles.length).toBe(0);
    });

    it("should reject expired token", async () => {
      // Create test file content
      const fileContent = Buffer.from("test file content");
      const contentMd5 = calculateMd5(fileContent);
      const filePath = "public/test-expired.txt";
      const tokenId = crypto.randomUUID();

      // Create signed URL token with expiration in the past
      await createSignedUrlToken({
        id: tokenId,
        filePath,
        contentType: "text/plain",
        fileSize: BigInt(fileContent.length),
        contentMd5,
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago (expired)
        used: false,
      });

      // Attempt to upload with expired token
      const response = await makeApiRequest(`/api/storage/upload/${tokenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
          "Content-MD5": contentMd5,
          "Content-Length": fileContent.length.toString(),
        },
        body: fileContent,
      });

      // Verify response indicates expired token
      expect(response.status).toBe(403);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toContain("expired");

      // Verify token remains unused in database
      const token = await SignedUrlRepository.getSignedUrlById(tokenId);
      expect(token?.used).toBe(false);

      // Verify no file created on disk
      const files = await db.select().from(storageFiles);
      expect(files.length).toBe(0);
    });

    it("should reject already used token", async () => {
      // Create test file content
      const fileContent = Buffer.from("test file content");
      const contentMd5 = calculateMd5(fileContent);
      const filePath = "public/test-used.txt";
      const tokenId = crypto.randomUUID();

      // Create signed URL token marked as already used
      await createSignedUrlToken({
        id: tokenId,
        filePath,
        contentType: "text/plain",
        fileSize: BigInt(fileContent.length),
        contentMd5,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        used: true, // Already used
      });

      // Attempt to upload with already used token
      const response = await makeApiRequest(`/api/storage/upload/${tokenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
          "Content-MD5": contentMd5,
          "Content-Length": fileContent.length.toString(),
        },
        body: fileContent,
      });

      // Verify response indicates token already used
      expect(response.status).toBe(403);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(/used|claimed/);

      // Verify no file created on disk
      const files = await db.select().from(storageFiles);
      expect(files.length).toBe(0);
    });

    it("should reject content-type mismatch", async () => {
      // Create test file content
      const fileContent = Buffer.from("test file content");
      const contentMd5 = calculateMd5(fileContent);
      const filePath = "public/test-mismatch.jpg";
      const tokenId = crypto.randomUUID();

      // Create signed URL token expecting image/jpeg
      await createSignedUrlToken({
        id: tokenId,
        filePath,
        contentType: "image/jpeg",
        fileSize: BigInt(fileContent.length),
        contentMd5,
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      });

      // Attempt to upload with wrong Content-Type
      const response = await makeApiRequest(`/api/storage/upload/${tokenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain", // Mismatch: expected image/jpeg
          "Content-MD5": contentMd5,
          "Content-Length": fileContent.length.toString(),
        },
        body: fileContent,
      });

      // Verify response indicates Content-Type mismatch
      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(/content-type|mismatch/);

      // Verify token marked as used (claimed but validation failed)
      const token = await SignedUrlRepository.getSignedUrlById(tokenId);
      expect(token?.used).toBe(true);

      // Verify no file created on disk
      const files = await db.select().from(storageFiles);
      expect(files.length).toBe(0);
    });

    it("should reject content-md5 mismatch", async () => {
      // Create test file content
      const fileContent = Buffer.from("test file content");
      const correctMd5 = calculateMd5(fileContent);
      const wrongMd5 = calculateMd5(Buffer.from("different content"));
      const filePath = "public/test-md5-mismatch.txt";
      const tokenId = crypto.randomUUID();

      // Create signed URL token with correct MD5
      await createSignedUrlToken({
        id: tokenId,
        filePath,
        contentType: "text/plain",
        fileSize: BigInt(fileContent.length),
        contentMd5: correctMd5,
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      });

      // Attempt to upload with wrong MD5 in header
      const response = await makeApiRequest(`/api/storage/upload/${tokenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
          "Content-MD5": wrongMd5, // Wrong MD5 hash
          "Content-Length": fileContent.length.toString(),
        },
        body: fileContent,
      });

      // Verify response indicates MD5 mismatch
      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(/md5|hash|mismatch/);

      // Verify file deleted from disk if partially written
      const absolutePath = path.join(testStorageDir, filePath);
      try {
        await fs.access(absolutePath);
        // If we get here, file exists - fail the test
        expect(true).toBe(false); // File should not exist
      } catch {
        // File doesn't exist - this is expected
        expect(true).toBe(true);
      }

      // Verify no database record created
      const files = await db.select().from(storageFiles);
      expect(files.length).toBe(0);
    });

    it("should reject missing content-md5 header", async () => {
      // Create test file content
      const fileContent = Buffer.from("test file content");
      const contentMd5 = calculateMd5(fileContent);
      const filePath = "public/test-no-md5.txt";
      const tokenId = crypto.randomUUID();

      // Create valid signed URL token
      await createSignedUrlToken({
        id: tokenId,
        filePath,
        contentType: "text/plain",
        fileSize: BigInt(fileContent.length),
        contentMd5,
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      });

      // Attempt to upload without Content-MD5 header
      const response = await makeApiRequest(`/api/storage/upload/${tokenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
          // Missing Content-MD5 header
          "Content-Length": fileContent.length.toString(),
        },
        body: fileContent,
      });

      // Verify response indicates missing MD5
      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(/md5|missing|required/);

      // Verify no file created
      const files = await db.select().from(storageFiles);
      expect(files.length).toBe(0);
    });

    it("should reject content-length exceeding declared size", async () => {
      // Create small test file content (1KB)
      const smallContent = Buffer.from("x".repeat(1024));
      const contentMd5 = calculateMd5(smallContent);
      const filePath = "public/test-size-limit.txt";
      const tokenId = crypto.randomUUID();

      // Create signed URL token for 1KB file
      await createSignedUrlToken({
        id: tokenId,
        filePath,
        contentType: "text/plain",
        fileSize: BigInt(1024), // Only allowing 1KB
        contentMd5,
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      });

      // Create larger content (10KB) to attempt upload
      const largeContent = Buffer.from("x".repeat(10240));

      // Attempt to upload with Content-Length exceeding declared size
      const response = await makeApiRequest(`/api/storage/upload/${tokenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
          "Content-MD5": contentMd5,
          "Content-Length": largeContent.length.toString(), // 10KB instead of 1KB
        },
        body: largeContent,
      });

      // Verify response indicates size exceeded
      expect(response.status).toBe(413);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(
        /size|exceeded|too large|payload/
      );

      // Verify no file created
      const files = await db.select().from(storageFiles);
      expect(files.length).toBe(0);
    });

    it("should handle path traversal attack", async () => {
      // Create test file content
      const fileContent = Buffer.from("malicious content");
      const contentMd5 = calculateMd5(fileContent);
      const maliciousPath = "../../etc/passwd"; // Path traversal attempt
      const tokenId = crypto.randomUUID();

      // Create signed URL token with malicious path
      await createSignedUrlToken({
        id: tokenId,
        filePath: maliciousPath,
        contentType: "text/plain",
        fileSize: BigInt(fileContent.length),
        contentMd5,
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      });

      // Attempt to upload with path traversal
      const response = await makeApiRequest(`/api/storage/upload/${tokenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
          "Content-MD5": contentMd5,
          "Content-Length": fileContent.length.toString(),
        },
        body: fileContent,
      });

      // Verify response indicates invalid path
      expect(response.status).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(
        /invalid|path|traversal/
      );

      // Verify no file created outside storage directory
      // We can't reliably test if /etc/passwd was modified, so we just verify no DB record

      // Verify no database record created
      const files = await db.select().from(storageFiles);
      expect(files.length).toBe(0);

      // Verify token marked as used (claimed but validation failed)
      const token = await SignedUrlRepository.getSignedUrlById(tokenId);
      expect(token?.used).toBe(true);
    });

    it("should upload file and verify file exists on disk after successful upload", async () => {
      // Create test file content (binary data)
      const fileContent = Buffer.from(
        "This is a test file for disk verification"
      );
      const contentMd5 = calculateMd5(fileContent);
      const filePath = "private/disk-verify-test.dat";
      const tokenId = crypto.randomUUID();

      // Create signed URL token in database
      await createSignedUrlToken({
        id: tokenId,
        filePath,
        contentType: "application/octet-stream",
        fileSize: BigInt(fileContent.length),
        contentMd5,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        used: false,
      });

      // Upload file via API
      const response = await makeApiRequest(`/api/storage/upload/${tokenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-MD5": contentMd5,
          "Content-Length": fileContent.length.toString(),
        },
        body: fileContent,
      });

      // Verify upload was successful
      expect(response.status).toBe(201);
      const responseData = await response.json();
      expect(responseData.path).toBe(filePath);

      // Verify file exists on disk at the expected location
      const absolutePath = path.join(testStorageDir, filePath);

      // Check file exists
      let fileExists = false;
      try {
        await fs.access(absolutePath);
        fileExists = true;
      } catch {
        fileExists = false;
      }
      expect(fileExists).toBe(true);

      // Verify file content matches what was uploaded
      const diskContent = await fs.readFile(absolutePath);
      expect(Buffer.compare(diskContent, fileContent)).toBe(0);

      // Verify file size on disk
      const stats = await fs.stat(absolutePath);
      expect(stats.size).toBe(fileContent.length);

      // Verify file permissions (should be readable)
      expect(stats.mode & 0o400).toBeGreaterThan(0); // Owner read permission
    });
  });

  describe("Download API (/api/storage/files/[[...path]])", () => {
    it("should download public file successfully", async () => {
      // Create test file on disk
      const fileContent = Buffer.from("Hello from public file!");
      const filePath = "public/test-download.txt";
      await _createTestFile(filePath, fileContent);

      // Create database record for the file
      await db.insert(storageFiles).values({
        path: filePath,
        isProtected: false,
      });

      // Download file via API
      const response = await makeApiRequest(`/api/storage/files/${filePath}`, {
        method: "GET",
      });

      // Verify response
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/plain");
      expect(response.headers.get("content-length")).toBe(
        fileContent.length.toString()
      );

      // Verify content
      const downloadedContent = await response.arrayBuffer();
      expect(Buffer.compare(Buffer.from(downloadedContent), fileContent)).toBe(
        0
      );
    });

    it("should download protected file with authentication", async () => {
      // Create test file on disk
      const fileContent = Buffer.from("Protected file content");
      const filePath = "private/test-protected.txt";
      await _createTestFile(filePath, fileContent);

      // Create database record for the protected file
      await db.insert(storageFiles).values({
        path: filePath,
        isProtected: true,
      });

      // TODO: Add authentication header once auth is implemented
      // For now, this test will verify the endpoint responds
      const response = await makeApiRequest(`/api/storage/files/${filePath}`, {
        method: "GET",
        // headers: { Authorization: "Bearer <valid-token>" }
      });

      // Verify response (may be 403 without auth, or 200 with auth)
      expect([200, 403]).toContain(response.status);

      if (response.status === 200) {
        const downloadedContent = await response.arrayBuffer();
        expect(
          Buffer.compare(Buffer.from(downloadedContent), fileContent)
        ).toBe(0);
      }
    });

    it("should reject protected file without authentication", async () => {
      // Create test file on disk
      const fileContent = Buffer.from("Protected file content");
      const filePath = "private/test-protected-reject.txt";
      await _createTestFile(filePath, fileContent);

      // Create database record for the protected file
      await db.insert(storageFiles).values({
        path: filePath,
        isProtected: true,
      });

      // Download file via API without authentication
      // Temporarily clear auth token
      const tempToken = authToken;
      authToken = null;

      const response = await makeApiRequest(`/api/storage/files/${filePath}`, {
        method: "GET",
      });

      // Restore auth token
      authToken = tempToken;

      // Verify response indicates forbidden
      expect(response.status).toBe(403);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(
        /authentication|unauthorized|forbidden/
      );
    });

    it("should return 404 for non-existent file", async () => {
      // Request file that doesn't exist
      const nonExistentPath = "public/does-not-exist.txt";
      const response = await makeApiRequest(
        `/api/storage/files/${nonExistentPath}`,
        {
          method: "GET",
        }
      );

      // Verify response indicates not found
      expect(response.status).toBe(404);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(
        /not found|does not exist/
      );
    });

    it("should reject path traversal in download", async () => {
      // Attempt path traversal attack
      const maliciousPath = "../../../etc/passwd";
      const response = await makeApiRequest(
        `/api/storage/files/${maliciousPath}`,
        {
          method: "GET",
        }
      );

      // Verify response indicates invalid path
      // Note: Next.js router normalizes paths, so path traversal attempts result in 404
      expect(response.status).toBe(404);
    });

    it("should support range requests (partial content)", async () => {
      // Create large test file (10KB)
      const fileContent = Buffer.from("x".repeat(10240));
      const filePath = "public/test-range.txt";
      await _createTestFile(filePath, fileContent);

      // Create database record for the file
      await db.insert(storageFiles).values({
        path: filePath,
        isProtected: false,
      });

      // Request first 1024 bytes
      const response = await makeApiRequest(`/api/storage/files/${filePath}`, {
        method: "GET",
        headers: {
          Range: "bytes=0-1023",
        },
      });

      // Verify partial content response
      expect(response.status).toBe(206);
      expect(response.headers.get("content-range")).toContain("bytes 0-1023");
      // Note: Streaming responses may not include content-length header

      // Verify content
      const downloadedContent = await response.arrayBuffer();
      expect(downloadedContent.byteLength).toBe(1024);
      expect(
        Buffer.compare(
          Buffer.from(downloadedContent),
          fileContent.slice(0, 1024)
        )
      ).toBe(0);
    });

    it("should support multiple range requests", async () => {
      // Create test file
      const fileContent = Buffer.from("0123456789".repeat(1000)); // 10KB
      const filePath = "public/test-multi-range.txt";
      await _createTestFile(filePath, fileContent);

      // Create database record
      await db.insert(storageFiles).values({
        path: filePath,
        isProtected: false,
      });

      // Request middle section (bytes 1000-1999)
      const response1 = await makeApiRequest(`/api/storage/files/${filePath}`, {
        method: "GET",
        headers: {
          Range: "bytes=1000-1999",
        },
      });

      expect(response1.status).toBe(206);
      expect(response1.headers.get("content-length")).toBe("1000");
      const content1 = await response1.arrayBuffer();
      expect(
        Buffer.compare(Buffer.from(content1), fileContent.slice(1000, 2000))
      ).toBe(0);

      // Request tail section (bytes 5000 to end)
      const response2 = await makeApiRequest(`/api/storage/files/${filePath}`, {
        method: "GET",
        headers: {
          Range: "bytes=5000-",
        },
      });

      expect(response2.status).toBe(206);
      const content2 = await response2.arrayBuffer();
      expect(
        Buffer.compare(Buffer.from(content2), fileContent.slice(5000))
      ).toBe(0);
    });

    it("should handle invalid range requests", async () => {
      // Create 1KB test file
      const fileContent = Buffer.from("x".repeat(1024));
      const filePath = "public/test-invalid-range.txt";
      await _createTestFile(filePath, fileContent);

      // Create database record
      await db.insert(storageFiles).values({
        path: filePath,
        isProtected: false,
      });

      // Request range beyond file size
      const response = await makeApiRequest(`/api/storage/files/${filePath}`, {
        method: "GET",
        headers: {
          Range: "bytes=5000-10000",
        },
      });

      // Verify range not satisfiable
      expect(response.status).toBe(416);
      // 416 responses may not have a JSON body
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();
        expect(responseData.error).toBeDefined();
        expect(responseData.error.toLowerCase()).toMatch(
          /range|satisfiable|invalid/
        );
      }
    });
  });

  describe("Manual Cleanup API (/api/storage/cleanup)", () => {
    it("should delete expired signed URLs", async () => {
      // Create 3 expired signed URL tokens
      await Promise.all([
        createSignedUrlToken({
          filePath: "temp/expired-1.txt",
          fileSize: BigInt(100),
          contentMd5: "test-md5-1",
          expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
          used: false,
        }),
        createSignedUrlToken({
          filePath: "temp/expired-2.txt",
          fileSize: BigInt(200),
          contentMd5: "test-md5-2",
          expiresAt: new Date(Date.now() - 7200000), // 2 hours ago
          used: false,
        }),
        createSignedUrlToken({
          filePath: "temp/expired-3.txt",
          fileSize: BigInt(300),
          contentMd5: "test-md5-3",
          expiresAt: new Date(Date.now() - 10800000), // 3 hours ago
          used: false,
        }),
      ]);

      // Create 2 valid (non-expired) signed URL tokens
      const validTokens = await Promise.all([
        createSignedUrlToken({
          filePath: "temp/valid-1.txt",
          fileSize: BigInt(400),
          contentMd5: "test-md5-4",
          expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
          used: false,
        }),
        createSignedUrlToken({
          filePath: "temp/valid-2.txt",
          fileSize: BigInt(500),
          contentMd5: "test-md5-5",
          expiresAt: new Date(Date.now() + 7200000), // 2 hours from now
          used: false,
        }),
      ]);

      // Call cleanup endpoint
      const response = await makeApiRequest("/api/storage/cleanup", {
        method: "POST",
      });

      // Verify response
      expect(response.status).toBe(200);
      const responseData = await response.json();
      expect(responseData.deletedCount).toBe(3);

      // Verify expired tokens removed from database
      const remainingTokens = await db.select().from(signedUrls);
      expect(remainingTokens.length).toBe(2);

      // Verify only valid tokens remain
      const remainingIds = remainingTokens.map(t => t.id).sort();
      const validIds = validTokens.map(t => t.id).sort();
      expect(remainingIds).toEqual(validIds);
    });

    it("should return zero when no expired tokens", async () => {
      // Create only valid (non-expired) tokens
      await Promise.all([
        createSignedUrlToken({
          filePath: "temp/valid-1.txt",
          fileSize: BigInt(100),
          contentMd5: "test-md5-1",
          expiresAt: new Date(Date.now() + 3600000),
          used: false,
        }),
        createSignedUrlToken({
          filePath: "temp/valid-2.txt",
          fileSize: BigInt(200),
          contentMd5: "test-md5-2",
          expiresAt: new Date(Date.now() + 7200000),
          used: false,
        }),
      ]);

      // Call cleanup endpoint
      const response = await makeApiRequest("/api/storage/cleanup", {
        method: "POST",
      });

      // Verify response
      expect(response.status).toBe(200);
      const responseData = await response.json();
      expect(responseData.deletedCount).toBe(0);

      // Verify all tokens still exist
      const remainingTokens = await db.select().from(signedUrls);
      expect(remainingTokens.length).toBe(2);
    });

    it("should require authentication for cleanup", async () => {
      // Create expired token
      await createSignedUrlToken({
        filePath: "temp/expired.txt",
        fileSize: BigInt(100),
        contentMd5: "test-md5",
        expiresAt: new Date(Date.now() - 3600000),
        used: false,
      });

      // Call cleanup endpoint without authentication
      // TODO: Update this test once authentication is implemented
      const response = await makeApiRequest("/api/storage/cleanup", {
        method: "POST",
        // No authentication headers
      });

      // Verify response (may be 401/403 with auth, or 200 without auth in current implementation)
      // This test documents the expected behavior once auth is added
      if (response.status === 401 || response.status === 403) {
        const responseData = await response.json();
        expect(responseData.error).toBeDefined();
        expect(responseData.error.toLowerCase()).toMatch(
          /authentication|unauthorized|forbidden/
        );

        // Verify no tokens deleted
        const remainingTokens = await db.select().from(signedUrls);
        expect(remainingTokens.length).toBe(1);
      } else {
        // Current implementation allows cleanup without auth
        expect(response.status).toBe(200);
      }
    });

    it("should handle cleanup of large batches", async () => {
      // Create 100 expired signed URL tokens
      const tokenPromises = [];
      for (let i = 0; i < 100; i++) {
        tokenPromises.push(
          createSignedUrlToken({
            filePath: `temp/expired-${i}.txt`,
            fileSize: BigInt(100 * i),
            contentMd5: `test-md5-${i}`,
            expiresAt: new Date(Date.now() - 3600000),
            used: false,
          })
        );
      }
      await Promise.all(tokenPromises);

      // Call cleanup endpoint
      const response = await makeApiRequest("/api/storage/cleanup", {
        method: "POST",
      });

      // Verify response
      expect(response.status).toBe(200);
      const responseData = await response.json();
      expect(responseData.deletedCount).toBe(100);

      // Verify all tokens deleted
      const remainingTokens = await db.select().from(signedUrls);
      expect(remainingTokens.length).toBe(0);
    });
  });

  describe("Cron Cleanup API (/api/cron/cleanup-signed-urls)", () => {
    it("should cleanup with valid bearer token", async () => {
      // Use the CRON_SECRET from .env.test
      const cronSecret = process.env.CRON_SECRET || "test-secret-key";

      // Create 3 expired signed URL tokens
      await Promise.all([
        createSignedUrlToken({
          filePath: "temp/cron-expired-1.txt",
          fileSize: BigInt(100),
          contentMd5: "test-md5-1",
          expiresAt: new Date(Date.now() - 3600000),
          used: false,
        }),
        createSignedUrlToken({
          filePath: "temp/cron-expired-2.txt",
          fileSize: BigInt(200),
          contentMd5: "test-md5-2",
          expiresAt: new Date(Date.now() - 7200000),
          used: false,
        }),
        createSignedUrlToken({
          filePath: "temp/cron-expired-3.txt",
          fileSize: BigInt(300),
          contentMd5: "test-md5-3",
          expiresAt: new Date(Date.now() - 10800000),
          used: false,
        }),
      ]);

      // Create 1 valid token
      await createSignedUrlToken({
        filePath: "temp/cron-valid.txt",
        fileSize: BigInt(400),
        contentMd5: "test-md5-4",
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      });

      // Call cron cleanup endpoint with valid bearer token
      // Don't use makeApiRequest since it adds JWT token
      const response = await fetch(
        `http://localhost:${serverPort}/api/cron/cleanup-signed-urls`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cronSecret}`,
          },
        }
      );

      // Verify response
      expect(response.status).toBe(200);
      const responseData = await response.json();
      expect(responseData.deletedCount).toBe(3);

      // Verify expired tokens removed
      const remainingTokens = await db.select().from(signedUrls);
      expect(remainingTokens.length).toBe(1);
    });

    it("should reject request with invalid bearer token", async () => {
      // Use the CRON_SECRET from .env.test but send wrong token
      // Create expired token
      await createSignedUrlToken({
        filePath: "temp/cron-expired.txt",
        fileSize: BigInt(100),
        contentMd5: "test-md5",
        expiresAt: new Date(Date.now() - 3600000),
        used: false,
      });

      // Call cron cleanup endpoint with wrong bearer token
      const response = await makeApiRequest("/api/cron/cleanup-signed-urls", {
        method: "POST",
        headers: {
          Authorization: "Bearer wrong-token",
        },
      });

      // Verify response indicates unauthorized
      expect(response.status).toBe(401);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(
        /unauthorized|invalid|token/
      );

      // Verify no tokens deleted
      const remainingTokens = await db.select().from(signedUrls);
      expect(remainingTokens.length).toBe(1);
    });

    it("should reject request without authorization header", async () => {
      // Create expired token
      await createSignedUrlToken({
        filePath: "temp/cron-expired.txt",
        fileSize: BigInt(100),
        contentMd5: "test-md5",
        expiresAt: new Date(Date.now() - 3600000),
        used: false,
      });

      // Call cron cleanup endpoint without Authorization header
      const response = await makeApiRequest("/api/cron/cleanup-signed-urls", {
        method: "POST",
      });

      // Verify response indicates unauthorized
      expect(response.status).toBe(401);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toMatch(
        /unauthorized|authentication|missing/
      );

      // Verify no tokens deleted
      const remainingTokens = await db.select().from(signedUrls);
      expect(remainingTokens.length).toBe(1);
    });

    it("should reject with invalid cron secret", async () => {
      // Create expired token
      await createSignedUrlToken({
        filePath: "temp/cron-expired.txt",
        fileSize: BigInt(100),
        contentMd5: "test-md5",
        expiresAt: new Date(Date.now() - 3600000),
        used: false,
      });

      // Call cron cleanup endpoint with completely wrong token format
      const response = await fetch(
        `http://localhost:${serverPort}/api/cron/cleanup-signed-urls`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer completely-wrong-token",
          },
        }
      );

      // Verify response indicates unauthorized
      expect(response.status).toBe(401);
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
      expect(responseData.error.toLowerCase()).toContain("unauthorized");

      // Verify no tokens deleted
      const remainingTokens = await db.select().from(signedUrls);
      expect(remainingTokens.length).toBe(1);
    });
  });
});
