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
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { generateUploadSignedUrlMutationDocument } from "@/client/views/storage/core/storage.documents";
import type { ContentType } from "@/client/graphql/generated/gql/graphql";
import { testLogger } from "@/lib/testlogger";

// GraphQL client setup
const httpLink = new HttpLink({
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
 * Get content type enum from file extension (matching server logic)
 */
function getContentTypeFromFileName(fileName: string): ContentType {
  const extension = fileName
    .substring(fileName.lastIndexOf(".") + 1)
    .toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "IMAGE_JPEG";
    case "png":
      return "IMAGE_PNG";
    case "gif":
      return "IMAGE_GIF";
    case "webp":
      return "IMAGE_WEBP";
    case "pdf":
      return "APPLICATION_PDF";
    case "doc":
      return "APPLICATION_MSWORD";
    case "docx":
      return "APPLICATION_DOCX";
    case "xls":
      return "APPLICATION_XLS";
    case "xlsx":
      return "APPLICATION_XLSX";
    case "txt":
      return "TEXT_PLAIN";
    case "zip":
      return "APPLICATION_ZIP";
    case "rar":
      return "APPLICATION_RAR";
    case "mp4":
      return "VIDEO_MP4";
    case "mp3":
      return "AUDIO_MPEG";
    case "wav":
      return "AUDIO_WAV";
    case "otf":
      return "FONT_OTF";
    case "ttf":
      return "FONT_TTF";
    case "woff":
      return "FONT_WOFF";
    case "woff2":
      return "FONT_WOFF2";
    default:
      return "IMAGE_JPEG"; // Default fallback
  }
}

/**
 * Map MIME type to ContentType enum (for backward compatibility)
 */
function mapContentType(mimeType: string): ContentType {
  switch (mimeType.toLowerCase()) {
    case "image/jpeg":
    case "image/jpg":
      return "IMAGE_JPEG";
    case "image/png":
      return "IMAGE_PNG";
    case "image/gif":
      return "IMAGE_GIF";
    case "image/webp":
      return "IMAGE_WEBP";
    case "application/pdf":
      return "APPLICATION_PDF";
    case "application/msword":
      return "APPLICATION_MSWORD";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "APPLICATION_DOCX";
    case "application/vnd.ms-excel":
      return "APPLICATION_XLS";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "APPLICATION_XLSX";
    case "text/plain":
      return "TEXT_PLAIN";
    case "application/zip":
      return "APPLICATION_ZIP";
    case "application/vnd.rar":
      return "APPLICATION_RAR";
    case "video/mp4":
      return "VIDEO_MP4";
    case "audio/mpeg":
      return "AUDIO_MPEG";
    case "audio/wav":
      return "AUDIO_WAV";
    case "font/otf":
      return "FONT_OTF";
    case "font/ttf":
      return "FONT_TTF";
    case "font/woff":
      return "FONT_WOFF";
    case "font/woff2":
      return "FONT_WOFF2";
    default:
      return "IMAGE_JPEG"; // Default fallback
  }
}

/**
 * Convert hex MD5 to base64 format for Content-MD5 header
 */
function hexToBase64(hex: string): string {
  const buffer = Buffer.from(hex, "hex");
  return buffer.toString("base64");
}
async function generateSignedUrl(
  filePath: string,
  uploadPath: string,
  contentType?: string
): Promise<string> {
  try {
    // Get file info
    const fileSize = getFileSize(filePath);
    const contentMd5 = await generateMD5Hash(filePath);
    const fileName = filePath.split("/").pop() || "unknown";

    // Determine content type from file extension (matching server logic)
    const contentTypeEnum = contentType
      ? mapContentType(contentType)
      : getContentTypeFromFileName(fileName);

    // Convert MD5 to base64 format for Google Cloud Storage
    const contentMd5Base64 = hexToBase64(contentMd5);

    testLogger.info("File details", {
      filePath,
      fileName,
      fileSize,
      contentMd5Hex: contentMd5,
      contentMd5Base64,
      uploadPath,
      contentType: contentTypeEnum,
      autoDetected: !contentType,
    });

    // Send GraphQL request
    testLogger.info("Sending GraphQL request to generate signed URL...");

    const { data, error } = await client.mutate({
      mutation: generateUploadSignedUrlMutationDocument,
      variables: {
        input: {
          path: uploadPath,
          contentType: contentTypeEnum,
          fileSize,
          contentMd5: contentMd5Base64,
        },
      },
    });

    if (error) {
      testLogger.error("GraphQL errors", { error });
      throw new Error(`GraphQL errors: ${JSON.stringify(error)}`);
    }

    const signedUrl = data?.generateUploadSignedUrl;
    if (!signedUrl) {
      throw new Error("No signed URL returned from GraphQL mutation");
    }

    testLogger.info("Signed URL generated successfully");
    return signedUrl;
  } catch (error) {
    testLogger.error("Failed to generate signed URL", { error: error });
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    testLogger.error(
      "Usage: node get-signed-url.ts <file-path> <upload-path> [content-type]"
    );
    testLogger.error(
      "Example: node get-signed-url.ts /path/to/local/file.jpg public/uploads/file.jpg"
    );
    testLogger.error(
      "Note: Content type is automatically detected from file extension if not provided"
    );
    process.exit(1);
  }

  const filePath = args[0];
  const uploadPath = args[1] || `public/${args[0].split("/").pop()}`; // Use provided path or default to public/<filename>
  const contentType = args[2]; // Optional - will auto-detect if not provided

  try {
    const signedUrl = await generateSignedUrl(
      filePath,
      uploadPath,
      contentType
    );

    // Get file info for display
    const fileSize = getFileSize(filePath);
    const contentMd5 = await generateMD5Hash(filePath);
    const fileName = filePath.split("/").pop() || "unknown";
    const contentTypeEnum = contentType
      ? mapContentType(contentType)
      : getContentTypeFromFileName(fileName);
    const md5Base64 = hexToBase64(contentMd5);

    testLogger.log("\n" + "=".repeat(80));
    testLogger.log("SIGNED URL GENERATED SUCCESSFULLY");
    testLogger.log("=".repeat(80));
    testLogger.log(signedUrl);
    testLogger.log("=".repeat(80));
    testLogger.log("");
    testLogger.log("File Details:");
    testLogger.log(`- File: ${filePath}`);
    testLogger.log(`- Size: ${fileSize} bytes`);
    testLogger.log(`- MD5 (hex): ${contentMd5}`);
    testLogger.log(`- MD5 (base64): ${md5Base64}`);
    testLogger.log(`- Content-Type: ${contentTypeEnum}`);
    testLogger.log("");
    testLogger.log("You can now use this URL to upload your file via:");
    testLogger.log("1. Postman (PUT request with binary body)");
    testLogger.log(
      `2. curl: curl -X PUT -H 'Content-Type: image/jpeg' -H 'Content-MD5: ${md5Base64}' --data-binary @file.jpg <signed-url>`
    );
    testLogger.log("");
    testLogger.log(
      "Make sure to set the correct Content-Type and Content-MD5 headers!"
    );
    testLogger.log("3. Any HTTP client");
  } catch (error) {
    testLogger.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    testLogger.error("Unhandled error:", error);
    process.exit(1);
  });
}

export { generateSignedUrl, generateMD5Hash, getFileSize };
