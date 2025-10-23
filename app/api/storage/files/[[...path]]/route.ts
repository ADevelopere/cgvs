import { NextRequest, NextResponse } from "next/server";
import { StorageDbRepository } from "@/server/db/repo/storage.repository";
import fs from "fs/promises";
import { createReadStream, statSync } from "fs";
import path from "path";
import logger from "@/server/lib/logger";
import { extractTokenFromHeader, verifyToken } from "@/server/lib/auth/jwt";

const storagePath = process.env.LOCAL_STORAGE_PATH || "./cgvs/data/files/";

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
 * Detect content type from file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".txt": "text/plain",
    ".json": "application/json",
    ".xml": "application/xml",
    ".zip": "application/zip",
    ".rar": "application/vnd.rar",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
  };
  return contentTypeMap[ext] || "application/octet-stream";
}

/**
 * Parse range header
 */
function parseRange(
  rangeHeader: string,
  fileSize: number
): { start: number; end: number } | null {
  const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
  if (!match) return null;

  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

  if (start >= fileSize || end >= fileSize || start > end) {
    return null;
  }

  return { start, end };
}

/**
 * Handle file downloads and streaming
 * GET /api/storage/files/[[...path]]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    // Step 1: Await params and reconstruct relative file path
    const resolvedParams = await params;
    const relativePath = resolvedParams.path
      ? resolvedParams.path.join("/")
      : "";

    if (!relativePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Step 2: Secure path resolution
    let absolutePath: string;
    try {
      absolutePath = getAbsolutePath(relativePath);
    } catch (error) {
      logger.warn("Path traversal attempt detected", {
        path: relativePath,
        error: error instanceof Error ? error.message : String(error),
      });
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Step 3: Check if file exists
    try {
      await fs.access(absolutePath);
    } catch {
      logger.warn("File not found", { path: relativePath });
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Step 4: Check permissions
    const dbFile = await StorageDbRepository.fileByPath(relativePath);

    // If file is protected, verify authentication
    if (dbFile?.isProtected) {
      const authHeader = request.headers.get("authorization");
      const accessToken = extractTokenFromHeader(authHeader);
      const payload = accessToken ? await verifyToken(accessToken) : null;

      if (!payload || payload.type !== "access") {
        logger.warn("Unauthorized access to protected file", {
          path: relativePath,
        });
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Check parent directory permissions
    const parentPath = relativePath.substring(0, relativePath.lastIndexOf("/"));
    if (parentPath) {
      const parentDir = await StorageDbRepository.directoryByPath(parentPath);
      if (parentDir && parentDir.protectChildren) {
        const authHeader = request.headers.get("authorization");
        const accessToken = extractTokenFromHeader(authHeader);
        const payload = accessToken ? await verifyToken(accessToken) : null;

        if (!payload || payload.type !== "access") {
          logger.warn("Unauthorized access to file in protected directory", {
            path: relativePath,
            parentPath,
          });
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
      }
    }

    // Step 5: Get file stats
    const stats = statSync(absolutePath);
    const fileSize = stats.size;
    const contentType = getContentType(relativePath);

    // Step 6: Handle range requests
    const rangeHeader = request.headers.get("range");

    if (rangeHeader) {
      const range = parseRange(rangeHeader, fileSize);

      if (!range) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        });
      }

      const { start, end } = range;
      const chunkSize = end - start + 1;
      const stream = createReadStream(absolutePath, { start, end });

      logger.info("Streaming partial content", {
        path: relativePath,
        start,
        end,
        chunkSize,
      });

      return new NextResponse(stream as unknown as BodyInit, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": chunkSize.toString(),
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Last-Modified": stats.mtime.toUTCString(),
        },
      });
    }

    // Step 7: Stream full file
    const stream = createReadStream(absolutePath);

    logger.info("Streaming full file", {
      path: relativePath,
      size: fileSize,
    });

    return new NextResponse(stream as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Last-Modified": stats.mtime.toUTCString(),
      },
    });
  } catch (error) {
    logger.error("Unexpected error in file serving handler", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
