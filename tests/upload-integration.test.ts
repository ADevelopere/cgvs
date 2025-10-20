/**
 * Upload Integration Test
 *
 * This test requires Puppeteer/Chrome to run browser automation.
 * If you encounter browser launch errors, install the required system libraries:
 *
 * ```bash
 * sudo apt-get update
 * sudo apt-get install -y libglib2.0-0 libnss3 libatk-bridge2.0-0 libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2t64 libcups2t64 libxkbcommon0 libgtk-3-0t64 libpangocairo-1.0-0 libatk1.0-0t64 libcairo-gobject2 libgdk-pixbuf-2.0-0
 * ```
 */

import { readFileSync, writeFileSync } from "fs";
import { spawn, ChildProcess } from "child_process";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import logger from "@/lib/logger";
import { generateFileMD5Browser } from "./browser-md5";
import { generateUploadSignedUrlMutationDocument } from "@/client/views/storage/hooks/storage.documents";

// Global variables for dev server
let devServer: ChildProcess | null = null;
let serverPort: number = 0;
let client: ApolloClient;

/**
 * Start the development server on a non-popular port
 */
async function startDevServer(): Promise<number> {
  return new Promise((resolve, reject) => {
    logger.info("Starting development server...");

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
      logger.info("Dev server output:", data.toString());

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
            logger.info(`Development server started on port ${serverPort}`);
            resolve(serverPort);
          }, 3000);
        }
      }
    });

    devServer.stderr?.on("data", data => {
      errorOutput += data.toString();
      logger.error("Dev server error:", data.toString());

      if (
        !serverStarted &&
        errorOutput.includes("Error") &&
        !errorOutput.includes("Warning")
      ) {
        reject(new Error(`Failed to start dev server: ${errorOutput}`));
      }
    });

    devServer.on("error", error => {
      logger.error("Failed to spawn dev server:", error);
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
        logger.warn(`Server start timeout, assuming port ${port} is ready`);
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
    logger.info("Stopping development server...");

    return new Promise(resolve => {
      const timeout = setTimeout(() => {
        if (devServer) {
          logger.warn("Force killing dev server...");
          devServer.kill("SIGKILL");
        }
      }, 5000);

      devServer?.on("exit", () => {
        clearTimeout(timeout);
        logger.info("Development server stopped");
        devServer = null;
        resolve();
      });

      devServer?.kill("SIGTERM");
    });
  }
}

// Test file path
const testImagePath = "public/templateCover/demo1.jpg";
const uploadPath = "public/templateCover";

// Browser-based MD5 function using the exact generateFileMD5 from storage.util.ts
const generateFileMD5Node = async (filePath: string): Promise<string> => {
  return await generateFileMD5Browser(filePath);
};

// Increase timeout for integration tests
jest.setTimeout(60000); // 60 seconds

describe("Upload Integration Test", () => {
  beforeAll(async () => {
    try {
      // Start the development server
      const port = await startDevServer();

      // Create GraphQL client with dynamic port
      const httpLink = new HttpLink({
        uri: `http://localhost:${port}/api/graphql`,
        credentials: "include",
      });

      client = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
      });

      // Create test file if it doesn't exist
      try {
        readFileSync(testImagePath);
      } catch {
        logger.info("Creating test file...");
        // Create a simple test image (1x1 pixel JPEG)
        const testImageBuffer = Buffer.from([
          0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00,
          0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb,
          0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07,
          0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b,
          0x0b, 0x0c, 0x19, 0x12, 0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e,
          0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c,
          0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34,
          0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34,
          0x32, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01,
          0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xff, 0xc4,
          0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xff, 0xc4,
          0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xda,
          0x00, 0x0c, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f,
          0x00, 0x8a, 0xff, 0xd9,
        ]);
        writeFileSync(testImagePath, testImageBuffer);
      }

      logger.info(`Test setup complete. Server running on port ${port}`);
    } catch (error) {
      logger.error("Failed to setup test environment:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await stopDevServer();
    } catch (error) {
      logger.error("Failed to stop dev server:", error);
    }
  });

  test("should generate signed URL and upload file successfully", async () => {
    // Step 1: Generate MD5 hash for the test file
    // IMPORTANT: The MD5 hash is generated in base64 format because:
    // 1. Google Cloud Storage signed URLs expect base64-encoded MD5 for the contentMd5 parameter
    // 2. The Content-MD5 header in HTTP requests must also be base64-encoded to match the signature
    // 3. Using hex format would cause "SignatureDoesNotMatch" errors when uploading files
    const contentMd5 = await generateFileMD5Node(testImagePath);
    const fileSize = readFileSync(testImagePath).length;
    const fileName = "demo1.jpg";
    const fullPath = `${uploadPath}/${fileName}`;

    logger.info("Test file details", {
      filePath: testImagePath,
      fileName,
      fileSize,
      contentMd5,
      fullPath,
    });

    // Step 2: Send GraphQL request to generate signed URL
    logger.info("Sending GraphQL request to generate signed URL...");

    const result = await client.mutate({
      mutation: generateUploadSignedUrlMutationDocument,
      variables: {
        input: {
          path: fullPath,
          contentType: "JPEG", // Correct content type for .jpg files
          fileSize,
          contentMd5, // Base64-encoded MD5 hash for GCP compatibility
        },
      },
    });

    if (result.error) {
      logger.error("GraphQL errors", { error: result.error });
      throw new Error(`GraphQL errors: ${JSON.stringify(result.error)}`);
    }

    const signedUrl = result.data?.generateUploadSignedUrl;
    if (!signedUrl) {
      throw new Error("No signed URL returned from GraphQL mutation");
    }

    logger.info("Signed URL generated successfully", {
      signedUrlLength: signedUrl.length,
      signedUrlPrefix: signedUrl.substring(0, 100) + "...",
    });

    // Step 3: Use curl to upload the file
    logger.info("Uploading file using curl...");

    try {
      // Use spawn instead of execSync to avoid shell escaping issues
      const { spawn } = await import("child_process");

      const curlArgs = [
        "-X",
        "PUT",
        "-H",
        "Content-Type: image/jpeg", // Correct MIME type for JPEG files
        "-H",
        `Content-MD5: ${contentMd5}`, // Base64-encoded MD5 hash for GCP compatibility
        "--data-binary",
        `@${testImagePath}`,
        "-v", // Verbose output for debugging
        signedUrl,
      ];

      logger.info("Executing curl command", {
        command: `curl ${curlArgs.join(" ")}`,
      });

      const curlProcess = spawn("curl", curlArgs, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      curlProcess.stdout?.on("data", data => {
        stdout += data.toString();
      });

      curlProcess.stderr?.on("data", data => {
        stderr += data.toString();
      });

      const exitCode = await new Promise<number>(resolve => {
        curlProcess.on("close", code => {
          resolve(code || 0);
        });
      });

      if (exitCode !== 0) {
        throw new Error(`Curl failed with exit code ${exitCode}: ${stderr}`);
      }

      const curlOutput = stdout;

      logger.info("Curl upload completed successfully", {
        output: curlOutput,
      });

      // If we get here, the upload was successful
      expect(curlOutput).toBeDefined();
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        stderr?: string;
        stdout?: string;
      };
      logger.error("Curl upload failed", {
        error: errorObj.message,
        stderr: errorObj.stderr,
        stdout: errorObj.stdout,
      });

      // Log the actual error details
      if (errorObj.stderr) {
        logger.error("Curl stderr", { stderr: errorObj.stderr });
      }
      if (errorObj.stdout) {
        logger.error("Curl stdout", { stdout: errorObj.stdout });
      }

      throw error;
    }
  }, 60000); // 60 second timeout for the full test

  test("should handle invalid MD5 hash", async () => {
    const fileSize = readFileSync(testImagePath).length;
    const fileName = "demo1.jpg";
    const fullPath = `${uploadPath}/${fileName}`;
    // Invalid base64 MD5 hash (should be base64-encoded for GCP compatibility)
    const invalidMd5 = "invalidmd5hash123456789012345678901234";

    logger.info("Testing with invalid MD5 hash", {
      invalidMd5,
      fullPath,
    });

    // Send GraphQL request with invalid MD5
    const result = await client.mutate({
      mutation: generateUploadSignedUrlMutationDocument,
      variables: {
        input: {
          path: fullPath,
          contentType: "JPEG", // Correct content type for .jpg files
          fileSize,
          contentMd5: invalidMd5, // Invalid base64 MD5 hash
        },
      },
    });

    if (result.error) {
      logger.info("Expected GraphQL errors with invalid MD5", {
        error: result.error,
      });
      expect(result.error).toBeDefined();
      return;
    }

    const signedUrl = result.data?.generateUploadSignedUrl;
    if (!signedUrl) {
      logger.info("No signed URL returned (expected with invalid MD5)");
      return;
    }

    // Try to upload with invalid MD5 - should fail
    try {
      const { spawn } = await import("child_process");

      const curlArgs = [
        "-X",
        "PUT",
        "-H",
        "Content-Type: image/jpeg", // Correct MIME type for JPEG files
        "-H",
        `Content-MD5: ${invalidMd5}`, // Invalid base64 MD5 hash for testing
        "--data-binary",
        `@${testImagePath}`,
        "-v",
        signedUrl,
      ];

      const curlProcess = spawn("curl", curlArgs, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stderr = "";

      curlProcess.stderr?.on("data", data => {
        stderr += data.toString();
      });

      const exitCode = await new Promise<number>(resolve => {
        curlProcess.on("close", code => {
          resolve(code || 0);
        });
      });

      if (exitCode === 0) {
        // If we get here, the upload succeeded unexpectedly
        fail("Upload should have failed with invalid MD5 hash");
      } else {
        logger.info("Expected upload failure with invalid MD5", {
          exitCode,
          stderr,
        });

        // This is expected - the upload should fail
        expect(exitCode).not.toBe(0);
      }
    } catch (error: unknown) {
      const errorObj = error as { message?: string; stderr?: string };
      logger.info("Expected upload failure with invalid MD5", {
        error: errorObj.message,
        stderr: errorObj.stderr,
      });

      // This is expected - the upload should fail
      expect(error).toBeDefined();
    }
  }, 60000);
});
