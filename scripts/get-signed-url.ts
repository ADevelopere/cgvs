#!/usr/bin/env node

/**
 * Get Signed URL Script
 *
 * This script generates a signed URL for file upload using GraphQL.
 * It calculates MD5 hash using terminal commands and sends a GraphQL request.
 *
 * Usage: node get-signed-url.ts <file-path>
 * Example: node get-signed-url.ts public/templateCover/demo1.jpg
 */

import { readFileSync } from "fs";
import { spawn } from "child_process";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { gql } from "@apollo/client";
import logger from "@/lib/logger";

// GraphQL mutation for generating signed URL
const GENERATE_UPLOAD_SIGNED_URL = gql`
  mutation generateUploadSignedUrl($input: UploadSignedUrlGenerateInput!) {
    generateUploadSignedUrl(input: $input)
  }
`;

// GraphQL client setup
const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_ENDPOINT || "http://localhost:3000/api/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

/**
 * Generate MD5 hash using terminal command
 */
async function generateMD5Hash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const md5Process = spawn("md5sum", [filePath]);

    let stdout = "";
    let stderr = "";

    md5Process.stdout?.on("data", data => {
      stdout += data.toString();
    });

    md5Process.stderr?.on("data", data => {
      stderr += data.toString();
    });

    md5Process.on("close", code => {
      if (code === 0) {
        // Extract MD5 hash from output (format: "hash  filename")
        const md5Hash = stdout.split(" ")[0].trim();
        resolve(md5Hash);
      } else {
        reject(new Error(`md5sum failed with code ${code}: ${stderr}`));
      }
    });

    md5Process.on("error", error => {
      reject(new Error(`Failed to run md5sum: ${error.message}`));
    });
  });
}

/**
 * Get file size
 */
function getFileSize(filePath: string): number {
  try {
    const stats = readFileSync(filePath);
    return stats.length;
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error}`);
  }
}

/**
 * Map MIME type to ContentType enum
 */
function mapContentType(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case "image/jpeg":
    case "image/jpg":
      return "JPEG";
    case "image/png":
      return "PNG";
    case "image/gif":
      return "GIF";
    case "application/pdf":
      return "PDF";
    case "text/plain":
      return "TXT";
    case "application/json":
      return "JSON";
    default:
      return "PNG"; // Default fallback
  }
}

/**
 * Generate signed URL
 */
async function generateSignedUrl(
  filePath: string,
  contentType: string = "image/jpeg"
): Promise<string> {
  try {
    // Get file info
    const fileSize = getFileSize(filePath);
    const contentMd5 = await generateMD5Hash(filePath);
    const fileName = filePath.split("/").pop() || "unknown";
    const uploadPath = `public/templateCover/${fileName}`;

    // Map MIME type to enum
    const contentTypeEnum = mapContentType(contentType);

    logger.info("File details", {
      filePath,
      fileName,
      fileSize,
      contentMd5,
      uploadPath,
      contentType: contentTypeEnum,
    });

    // Send GraphQL request
    logger.info("Sending GraphQL request to generate signed URL...");

    const { data, errors } = await client.mutate({
      mutation: GENERATE_UPLOAD_SIGNED_URL,
      variables: {
        input: {
          path: uploadPath,
          contentType: contentTypeEnum,
          fileSize,
          contentMd5,
        },
      },
    });

    if (errors) {
      logger.error("GraphQL errors", { errors });
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    const signedUrl = data?.generateUploadSignedUrl;
    if (!signedUrl) {
      throw new Error("No signed URL returned from GraphQL mutation");
    }

    logger.info("Signed URL generated successfully");
    return signedUrl;
  } catch (error) {
    logger.error("Failed to generate signed URL", { error: error.message });
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    logger.error("Usage: node get-signed-url.ts <file-path> [content-type]");
    logger.error(
      "Example: node get-signed-url.ts public/templateCover/demo1.jpg image/jpeg"
    );
    process.exit(1);
  }

  const filePath = args[0];
  const contentType = args[1] || "image/jpeg";

  try {
    const signedUrl = await generateSignedUrl(filePath, contentType);

    logger.log("\n" + "=".repeat(80));
    logger.log("SIGNED URL GENERATED SUCCESSFULLY");
    logger.log("=".repeat(80));
    logger.log(signedUrl);
    logger.log("=".repeat(80));
    logger.log("\nYou can now use this URL to upload your file via:");
    logger.log("1. Postman (PUT request with binary body)");
    logger.log(
      "2. curl: curl -X PUT -H 'Content-Type: image/jpeg' --data-binary @file.jpg <signed-url>"
    );
    logger.log("3. Any HTTP client");
  } catch (error) {
    logger.error("Error:", error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    logger.error("Unhandled error:", error);
    process.exit(1);
  });
}

export { generateSignedUrl, generateMD5Hash, getFileSize };
