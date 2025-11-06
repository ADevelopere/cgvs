import { NextRequest, NextResponse } from "next/server";
import { SignedUrlRepository } from "@/server/db/repo";
import { StorageDbRepository } from "@/server/db/repo/storage.repository";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import crypto from "crypto";
import path from "path";
import logger from "@/server/lib/logger";

const storagePath = process.env.LOCAL_STORAGE_PATH || "./storage/";

/**
 * Convert relative user path to secure absolute filesystem path
 * Prevents path traversal attacks
 */
function getAbsolutePath(relativePath: string): string {
  const basePath = path.resolve(process.cwd(), storagePath);
  const resolvedPath = path.resolve(basePath, relativePath);
  const relativeToBase = path.relative(basePath, resolvedPath);

  if (relativeToBase.startsWith("..") || path.isAbsolute(relativeToBase)) {
    throw new Error("Path traversal detected");
  }

  return resolvedPath;
}

/**
 * Stream request body to file while calculating MD5
 */
async function streamToFile(stream: ReadableStream<Uint8Array>, filePath: string, expectedMd5: string): Promise<void> {
  const hash = crypto.createHash("md5");
  const writeStream = createWriteStream(filePath);
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      hash.update(value);
      await new Promise<void>((resolve, reject) => {
        writeStream.write(value, (err: Error | null | undefined) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    await new Promise<void>((resolve, reject) => {
      writeStream.end((err: Error | null | undefined) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const actualMd5 = hash.digest("base64");
    if (actualMd5 !== expectedMd5) {
      await fs.unlink(filePath);
      throw new Error("MD5 hash mismatch");
    }
  } catch (error) {
    try {
      await fs.unlink(filePath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Handle signed URL file uploads
 * PUT /api/storage/upload/[id]
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tokenId } = await params;

    // Step 1: Atomically claim the token
    const signedUrl = await SignedUrlRepository.claimSignedUrl(tokenId);

    if (!signedUrl) {
      logger.warn("Invalid or expired signed URL token", { tokenId });
      return NextResponse.json({ error: "Invalid, expired, or already used token" }, { status: 403 });
    }

    logger.info("🔍 [API DEBUG] Claimed signed URL", {
      tokenId,
      expectedContentType: signedUrl.contentType,
      expectedFileSize: signedUrl.fileSize.toString(),
      expectedContentMd5: signedUrl.contentMd5,
      filePath: signedUrl.filePath,
    });

    // Step 2: Validate metadata headers
    const contentType = request.headers.get("content-type");
    const contentLength = request.headers.get("content-length");
    const contentMd5 = request.headers.get("content-md5");

    logger.info("🔍 [API DEBUG] Received upload request headers", {
      tokenId,
      receivedContentType: contentType,
      receivedContentLength: contentLength,
      receivedContentMd5: contentMd5,
    });

    if (contentType !== signedUrl.contentType) {
      logger.warn("🔍 [API DEBUG] Content-Type mismatch", {
        tokenId,
        expected: signedUrl.contentType,
        received: contentType,
        match: contentType === signedUrl.contentType,
      });
      return NextResponse.json(
        {
          error: `Content-Type mismatch. Expected: ${signedUrl.contentType}`,
        },
        { status: 400 }
      );
    }

    if (contentLength && BigInt(contentLength) > signedUrl.fileSize) {
      logger.warn("Content-Length exceeds declared size", {
        tokenId,
        expected: signedUrl.fileSize.toString(),
        received: contentLength,
      });
      return NextResponse.json(
        {
          error: `Content-Length exceeds declared size of ${signedUrl.fileSize} bytes`,
        },
        { status: 413 }
      );
    }

    if (!contentMd5) {
      logger.warn("Missing Content-MD5 header", { tokenId });
      return NextResponse.json({ error: "Content-MD5 header is required" }, { status: 400 });
    }

    if (contentMd5 !== signedUrl.contentMd5) {
      logger.warn("Content-MD5 mismatch", {
        tokenId,
        expected: signedUrl.contentMd5,
        received: contentMd5,
      });
      return NextResponse.json(
        {
          error: "Content-MD5 mismatch",
        },
        { status: 400 }
      );
    }

    // Step 3: Secure path resolution
    let absolutePath: string;
    try {
      absolutePath = getAbsolutePath(signedUrl.filePath);
    } catch (error) {
      logger.error("Path traversal attempt detected", {
        tokenId,
        path: signedUrl.filePath,
        error: error instanceof Error ? error.message : String(error),
      });
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Step 4: Ensure parent directory exists
    await fs.mkdir(path.dirname(absolutePath), {
      recursive: true,
      mode: 0o755,
    });

    // Step 5: Stream to disk with MD5 verification
    if (!request.body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    try {
      await streamToFile(request.body, absolutePath, signedUrl.contentMd5);
    } catch (error) {
      logger.error("Failed to stream file to disk", {
        tokenId,
        path: signedUrl.filePath,
        error: error instanceof Error ? error.message : String(error),
      });
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Failed to write file",
        },
        { status: 400 }
      );
    }

    // Step 6: Create file record with transaction safety
    try {
      const fileEntity = await StorageDbRepository.createFile(signedUrl.filePath, false);

      const stats = await fs.stat(absolutePath);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      logger.info("🔍 [API DEBUG] File uploaded successfully via signed URL", {
        tokenId,
        path: signedUrl.filePath,
        absolutePath,
        size: stats.size,
        fileExistsOnDisk: true,
      });

      return NextResponse.json(
        {
          id: fileEntity.id.toString(),
          path: signedUrl.filePath,
          size: stats.size,
          contentType: signedUrl.contentType,
          url: `${baseUrl}/api/storage/files/${signedUrl.filePath}`,
          createdAt: stats.birthtime.toISOString(),
          isProtected: fileEntity.isProtected,
        },
        { status: 201 }
      );
    } catch (error) {
      // Database insert failed - delete orphaned file
      try {
        await fs.unlink(absolutePath);
      } catch {
        // Ignore cleanup errors
      }

      logger.error("Failed to create file record", {
        tokenId,
        path: signedUrl.filePath,
        error: error instanceof Error ? error.message : String(error),
      });

      return NextResponse.json({ error: "Failed to create file record" }, { status: 500 });
    }
  } catch (error) {
    logger.error("Unexpected error in upload handler", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
