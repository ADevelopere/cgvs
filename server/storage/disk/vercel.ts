import crypto from "crypto";
import logger from "@/server/lib/logger";
import * as Types from "@/server/types";
import { StorageService, StorageValidationError, STORAGE_CONFIG } from "./storage.service.interface";
import { StorageDbRepository, SignedUrlRepository } from "@/server/db/repo";
import { StorageUtils } from "@/server/utils";
import { OrderSortDirection } from "@/lib/enum";
import { extToMime } from "@/utils/storage.utils";
import { NEXT_PUBLIC_BASE_URL } from "@/server/lib/server";

// Vercel Blob SDK imports
import { put, del, list, head, copy, ListBlobResult } from "@vercel/blob";

/**
 * Clean path for Vercel Blob storage - removes leading slashes and normalizes
 */
function cleanVercelPath(inputPath: string): string {
  if (!inputPath || inputPath.length === 0) {
    return "";
  }

  // Remove leading slashes and trailing slashes
  const cleaned = inputPath.replace(/^\/+/, "").replace(/\/$/, "");

  return cleaned;
}

/**
 * Vercel Blob storage adapter
 * Stores files in Vercel Blob with client-side upload support
 */
class VercelAdapter implements StorageService {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor() {
    // Read environment variables
    this.baseUrl = NEXT_PUBLIC_BASE_URL;
    this.token = process.env.BLOB_READ_WRITE_TOKEN || "";

    if (!this.token) {
      throw new Error("BLOB_READ_WRITE_TOKEN environment variable is required for Vercel Blob storage");
    }

    logger.info("Vercel Blob storage initialized");
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Convert relative user path to Vercel Blob path
   * Prevents path traversal attacks
   */
  private getVercelBlobPath(relativePath: string): string {
    // Clean the path
    const cleaned = cleanVercelPath(relativePath);

    // Validate no path traversal
    if (cleaned.includes("..")) {
      throw new StorageValidationError("Path traversal detected");
    }

    return cleaned;
  }

  /**
   * Convert Vercel Blob metadata to BlobMetadata format
   */
  private vercelMetadataToBlob(blobInfo: {
    url: string;
    pathname: string;
    size: number;
    uploadedAt: Date;
    contentType?: string;
  }): Types.BlobMetadata {
    return {
      name: blobInfo.pathname,
      size: blobInfo.size,
      contentType: blobInfo.contentType,
      timeCreated: blobInfo.uploadedAt.toISOString(),
      updated: blobInfo.uploadedAt.toISOString(),
      mediaLink: blobInfo.url,
      md5Hash: undefined, // Vercel Blob doesn't provide MD5
    };
  }

  /**
   * Calculate MD5 hash of a buffer
   */
  private calculateMd5(buffer: Buffer): string {
    const hash = crypto.createHash("md5").update(buffer).digest("base64");
    return hash;
  }

  // ============================================================================
  // StorageService Interface Implementation
  // ============================================================================

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const cleanedPath = this.getVercelBlobPath(filePath);

      // Try to get blob metadata
      try {
        const blobInfo = await head(cleanedPath, {
          token: this.token,
        });

        // Blob exists - it's a file
        if (blobInfo) {
          // Check if file has a database record
          const dbFile = await StorageDbRepository.fileByPath(filePath);

          // If file exists in Vercel but not in DB, create a record
          if (!dbFile) {
            try {
              await StorageDbRepository.createFile(filePath, false);
              logger.info(`Created database record for existing file: ${filePath}`);
            } catch (error) {
              logger.warn(`Failed to create database record for file: ${filePath}`, error);
            }
          }

          return true;
        }
      } catch {
        // Blob doesn't exist as a file, check if it's a "directory"
        // In Vercel Blob, directories are simulated by path prefixes
      }

      // Check if path is a "directory" (has files with this prefix)
      const prefix = cleanedPath.endsWith("/") ? cleanedPath : `${cleanedPath}/`;
      const { blobs } = await list({
        token: this.token,
        prefix: prefix,
        limit: 1, // Just need to know if any files exist
      });

      if (blobs.length > 0) {
        // Directory exists (has files with this prefix)
        const dbDirectory = await StorageDbRepository.directoryByPath(filePath);

        // If directory exists in Vercel but not in DB, it's okay
        // We don't auto-create directory records unless they have custom permissions
        if (!dbDirectory) {
          logger.info(`Directory exists in Vercel Blob without DB record: ${filePath}`);
        }

        return true;
      }

      return false;
    } catch (error) {
      logger.error(`Error checking file existence: ${filePath}`, error);
      return false;
    }
  }

  async prepareUpload(input: Types.UploadPreparationInput): Promise<Types.UploadPreparationResult> {
    try {
      // Clean the path
      const cleanedPath = cleanVercelPath(input.path);

      // The contentType is already a MIME type
      const mimeType = input.contentType;

      logger.info("🔍 [VERCEL DEBUG] Preparing upload", {
        path: cleanedPath,
        fileSize: input.fileSize,
        contentType: mimeType,
        contentMd5: input.contentMd5,
      });

      // Validate upload
      const validationError = await StorageUtils.validateUpload(cleanedPath, input.fileSize, mimeType);
      if (validationError) {
        throw new StorageValidationError(validationError);
      }

      // Optional lazy cleanup: clean up expired tokens before creating new one
      const cleanupStrategy = process.env.SIGNED_URL_CLEANUP_STRATEGY || "lazy";
      if (cleanupStrategy === "lazy" || cleanupStrategy === "both") {
        try {
          await SignedUrlRepository.deleteExpired();
        } catch (error) {
          // Non-fatal: log but don't block upload preparation
          logger.error("Lazy cleanup failed during upload preparation", error);
        }
      }

      // Generate unique session ID
      const sessionId = crypto.randomUUID();

      // Calculate expiration time
      const expiresAt = new Date(Date.now() + STORAGE_CONFIG.SIGNED_URL_DURATION * 60 * 1000);

      // Create upload session entry in database (for tracking)
      await SignedUrlRepository.createSignedUrl({
        id: sessionId,
        filePath: cleanedPath,
        contentType: mimeType,
        fileSize: BigInt(input.fileSize),
        contentMd5: input.contentMd5,
        expiresAt,
        createdAt: new Date(),
        used: false,
      });

      logger.info("🔍 [VERCEL DEBUG] Stored upload session in database", {
        sessionId,
        filePath: cleanedPath,
        storedContentType: mimeType,
        storedFileSize: input.fileSize,
        storedContentMd5: input.contentMd5,
        expiresAt,
      });

      // Return upload preparation result with VERCEL type
      const result: Types.UploadPreparationResult = {
        id: sessionId,
        url: `${this.baseUrl}/api/storage/vercel-upload`,
        uploadType: Types.UploadType.VERCEL_BLOB_CLIENT,
      };

      logger.info("Prepared Vercel upload successfully", {
        sessionId,
        path: cleanedPath,
        uploadType: "VERCEL",
        expiresAt,
      });

      return result;
    } catch (error) {
      logger.error("Failed to prepare Vercel upload", {
        path: input.path,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  async uploadFile(filePath: string, contentType: string, buffer: Buffer): Promise<Types.FileUploadResult> {
    try {
      // Clean the file path
      const cleanedFilePath = cleanVercelPath(filePath);
      const fileSize = buffer.byteLength;

      // Validate upload
      const validationError = await StorageUtils.validateUpload(filePath, fileSize, contentType);
      if (validationError) {
        return {
          success: false,
          message: validationError,
          data: null,
        };
      }

      // Check directory permissions
      const directoryPath = cleanedFilePath.substring(0, cleanedFilePath.lastIndexOf("/"));
      const dbDirectory = await StorageDbRepository.directoryByPath(directoryPath);

      if (dbDirectory) {
        // Directory exists in DB, check permissions
        if (!dbDirectory.allowUploads) {
          return {
            success: false,
            message: "Uploads not allowed in this directory",
            data: null,
          };
        }
      }
      // If directory not in DB, allow upload (will be created automatically)

      // Upload file to Vercel Blob
      logger.info("📤 uploadFile: Uploading to Vercel Blob", {
        filePath: cleanedFilePath,
        size: fileSize,
        contentType,
      });

      const blob = await put(cleanedFilePath, buffer, {
        token: this.token,
        contentType: contentType,
        access: "public", // All blobs are public, use DB isProtected for access control
      });

      logger.info("📤 uploadFile: Upload to Vercel Blob successful", {
        url: blob.url,
        pathname: blob.pathname,
      });

      // Create file entity in database
      logger.info("💾 uploadFile: Creating file entity in database", {
        filePath: cleanedFilePath,
      });
      const fileEntity = await StorageDbRepository.createFile(cleanedFilePath, false);
      logger.info("💾 uploadFile: File entity created successfully", {
        fileEntity,
      });

      // Calculate MD5 hash from buffer
      const md5Hash = this.calculateMd5(buffer);

      // NOTE: PutBlobResult only contains url, downloadUrl, pathname, contentType, contentDisposition
      // It does NOT contain size or uploadedAt - we calculate size from buffer and use current time
      const uploadedAt = new Date();

      // Create BucketFile object
      const bucketFile: Types.BucketFile = {
        path: cleanedFilePath,
        directoryPath,
        size: BigInt(fileSize), // Calculate from buffer since Vercel doesn't return size
        contentType: contentType,
        md5Hash, // Calculated from buffer
        createdAt: uploadedAt, // Use current time since Vercel doesn't return uploadedAt
        lastModified: uploadedAt,
        url: blob.url, // Vercel Blob URL
        mediaLink: blob.url,
        fileType: StorageUtils.getFileTypeFromContentType(contentType),
        isPublic: cleanedFilePath.startsWith("public"),
      };

      // Combine bucket file with DB entity
      const fileInfo = StorageUtils.combineFileData(bucketFile, fileEntity);

      return {
        success: true,
        message: "File uploaded successfully",
        data: fileInfo,
      };
    } catch (error) {
      const errorPath = filePath; // Use original path for error logging
      logger.error(`Failed to upload file: ${errorPath}`, error);
      return {
        success: false,
        message: `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`,
        data: null,
      };
    }
  }

  async listFiles(input: Types.FilesListSearchInput): Promise<Types.StorageObjectList> {
    try {
      const searchPath = cleanVercelPath(input.path || "");
      const items: Array<Types.FileInfo | Types.DirectoryInfo> = [];

      // List blobs from Vercel with prefix
      const prefix = searchPath ? `${searchPath}/` : "";
      let allBlobs: Array<{
        url: string;
        pathname: string;
        size: number;
        uploadedAt: Date;
      }> = [];

      // Fetch all blobs with pagination
      let cursor: string | undefined = undefined;
      let hasMoreBlobs = true;

      while (hasMoreBlobs) {
        try {
          const result: ListBlobResult = await list({
            token: this.token,
            prefix: prefix,
            limit: 1000,
            cursor: cursor,
          });

          allBlobs = allBlobs.concat(result.blobs);
          cursor = result.cursor;
          hasMoreBlobs = result.hasMore;
        } catch (error) {
          logger.error("Failed to list blobs from Vercel", { prefix, error });
          break;
        }
      }

      if (allBlobs.length === 0) {
        return {
          items: [],
          totalCount: 0,
          hasMore: false,
          offset: input.offset || 0,
          limit: input.limit || 50,
        };
      }

      // Separate direct children from nested items
      const filePaths: string[] = [];
      const dirPathsSet = new Set<string>();

      for (const blob of allBlobs) {
        const relativePath = blob.pathname.startsWith(prefix) ? blob.pathname.slice(prefix.length) : blob.pathname;

        const slashIndex = relativePath.indexOf("/");

        if (slashIndex === -1) {
          filePaths.push(blob.pathname);
        } else {
          const dirName = relativePath.substring(0, slashIndex);
          const dirPath = searchPath ? `${searchPath}/${dirName}` : dirName;
          dirPathsSet.add(dirPath);
        }
      }

      const dirPaths = Array.from(dirPathsSet);

      // Batch database queries
      const [dbFiles, dbDirectories] = await Promise.all([
        filePaths.length > 0 ? StorageDbRepository.filesByPaths(filePaths) : [],
        dirPaths.length > 0 ? StorageDbRepository.directoriesByPaths(dirPaths) : [],
      ]);

      // Create lookup maps
      const dbFileMap = new Map();
      dbFiles.forEach(dbFile => {
        if (dbFile) {
          dbFileMap.set(dbFile.path, dbFile);
        }
      });

      const dbDirMap = new Map();
      dbDirectories.forEach(dbDir => {
        if (dbDir) {
          dbDirMap.set(dbDir.path, dbDir);
        }
      });

      const blobMap = new Map();
      allBlobs.forEach(blob => {
        blobMap.set(blob.pathname, blob);
      });

      // Process files
      for (const filePath of filePaths) {
        try {
          const blob = blobMap.get(filePath);
          if (!blob) continue;

          const directoryPath = StorageUtils.extractDirectoryPath(filePath);
          const ext = filePath.split(".").pop()?.toLowerCase() || "";
          const contentType = extToMime[ext] || "application/octet-stream";

          const bucketFile: Types.BucketFile = {
            path: filePath,
            directoryPath,
            size: BigInt(blob.size),
            contentType,
            md5Hash: undefined,
            createdAt: blob.uploadedAt,
            lastModified: blob.uploadedAt,
            url: blob.url,
            mediaLink: blob.url,
            fileType: StorageUtils.getFileTypeFromContentType(contentType),
            isPublic: filePath.startsWith("public"),
          };

          const dbFile = dbFileMap.get(filePath);
          const fileInfo = StorageUtils.combineFileData(bucketFile, dbFile);
          items.push(fileInfo);
        } catch (error) {
          logger.warn(`Failed to process file: ${filePath}`, error);
        }
      }

      // Process directories
      for (const dirPath of dirPaths) {
        try {
          const dbDir = dbDirMap.get(dirPath);
          const dirPrefix = `${dirPath}/`;
          const filesInDir = allBlobs.filter(blob => blob.pathname.startsWith(dirPrefix));
          const fileCount = filesInDir.length;

          const uploadDates = filesInDir.map(b => b.uploadedAt);
          const createdAt =
            uploadDates.length > 0 ? new Date(Math.min(...uploadDates.map(d => d.getTime()))) : new Date();
          const lastModified =
            uploadDates.length > 0 ? new Date(Math.max(...uploadDates.map(d => d.getTime()))) : new Date();

          const bucketDir: Types.BucketDirectory = {
            path: dirPath,
            createdAt,
            lastModified,
            isPublic: dirPath.startsWith("public"),
          };

          const dirInfo = StorageUtils.combineDirectoryData(bucketDir, dbDir, fileCount);
          items.push(dirInfo);
        } catch (error) {
          logger.warn(`Failed to process directory: ${dirPath}`, error);
        }
      }

      // Apply search filter
      let filteredItems = items;
      if (input.searchTerm && input.searchTerm.length > 0) {
        const searchLower = input.searchTerm.toLowerCase();
        filteredItems = items.filter(item => item.name.toLowerCase().includes(searchLower));
      }

      logger.info("[VercelAdapter] filteredItems", { filteredItems });

      // Apply file type and content type filters
      filteredItems = StorageUtils.filterStorageItems(filteredItems, {
        includeDirectories: input.includeDirectories,
        fileType: input.fileType,
        fileTypes: input.fileTypes,
        contentTypes: input.contentTypes,
      });

      // Sort items
      const sortedItems = StorageUtils.sortItems(
        filteredItems,
        input.sortBy || Types.FileSortField.NAME,
        input.sortDirection || OrderSortDirection.ASC
      );

      // Apply pagination
      const totalCount = sortedItems.length;
      const offset = input.offset || 0;
      const limit = input.limit || 50;
      const paginatedItems = sortedItems.slice(offset, offset + limit);
      const hasMore = offset + limit < totalCount;

      return {
        items: paginatedItems,
        totalCount,
        hasMore,
        offset,
        limit,
      };
    } catch (error) {
      logger.error(`Failed to list files: ${input.path}`, error);
      return {
        items: [],
        totalCount: 0,
        hasMore: false,
        offset: input.offset || 0,
        limit: input.limit || 50,
      };
    }
  }

  async createFolder(input: Types.FolderCreateInput): Promise<Types.FileOperationResult> {
    try {
      // Clean the path to remove leading/trailing slashes
      const fullPath = cleanVercelPath(input.path);

      // Validate path
      const validationError = await StorageUtils.validatePath(fullPath);
      if (validationError) {
        throw new StorageValidationError(validationError);
      }

      // Check parent directory permissions
      const parentPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
      if (parentPath.length > 0) {
        const parentDir = await StorageDbRepository.directoryByPath(parentPath);
        if (parentDir && !parentDir.allowCreateSubDirs) {
          return {
            success: false,
            message: "Creating subdirectories not allowed in parent directory",
          };
        }
      }

      // Note: In Vercel Blob, folders don't physically exist - they are simulated by path prefixes
      // Folders become visible when files are uploaded with that prefix

      // Only save folder in DB if custom permissions are provided
      const hasCustomPermissions =
        input.permissions != null || input.protected === true || input.protectChildren === true;

      let newDirectoryInfo: Types.DirectoryInfo;

      if (hasCustomPermissions) {
        try {
          // Create directory with cleaned path
          const directoryEntity = await StorageDbRepository.createDirectory({
            ...input,
            path: fullPath,
          });

          const bucketDir: Types.BucketDirectory = {
            path: fullPath,
            createdAt: new Date(),
            lastModified: new Date(),
            isPublic: fullPath.startsWith("public"),
          };

          newDirectoryInfo = StorageUtils.combineDirectoryData(bucketDir, directoryEntity);
        } catch (error) {
          // If DB operation fails, still return success since folder concept exists
          logger.warn(
            `Failed to save folder permissions in DB: ${error instanceof Error ? error.message : String(error)}`
          );
          newDirectoryInfo = StorageUtils.createDirectoryFromPath(fullPath);
        }
      } else {
        newDirectoryInfo = StorageUtils.createDirectoryFromPath(fullPath);
      }

      return {
        success: true,
        message: "Folder created successfully",
        data: newDirectoryInfo,
      };
    } catch (error) {
      logger.error(`Failed to create folder: ${input.path}`, error);
      return {
        success: false,
        message: `Failed to create folder: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  async renameFile(input: Types.FileRenameInput): Promise<Types.FileOperationResult> {
    try {
      // Validate current path
      const pathValidationError = await StorageUtils.validatePath(input.currentPath);
      if (pathValidationError) {
        return {
          success: false,
          message: pathValidationError,
        };
      }

      // Validate new name
      const nameValidationError = await StorageUtils.validateFileName(input.newName);
      if (nameValidationError) {
        return {
          success: false,
          message: nameValidationError,
        };
      }

      const directoryPath = StorageUtils.extractDirectoryPath(input.currentPath);
      const newPath = `${directoryPath}/${input.newName}`;

      // Get original blob metadata
      let originalBlob;
      try {
        originalBlob = await head(input.currentPath, {
          token: this.token,
        });
      } catch {
        return {
          success: false,
          message: `File not found: ${input.currentPath}`,
        };
      }

      // Copy blob to new path (Vercel doesn't have rename)
      logger.info("📋 renameFile: Copying blob to new path", {
        from: input.currentPath,
        to: newPath,
      });

      const newBlob = await copy(originalBlob.url, newPath, {
        token: this.token,
        access: "public",
      });

      logger.info("📋 renameFile: Copy successful", {
        newUrl: newBlob.url,
      });

      // Delete original blob
      logger.info("🗑️ renameFile: Deleting original blob", {
        path: input.currentPath,
      });

      try {
        await del(originalBlob.url, {
          token: this.token,
        });
        logger.info("🗑️ renameFile: Original blob deleted");
      } catch (deleteError) {
        // Delete failed - try to rollback
        logger.error("Failed to delete original after copy", deleteError);
        try {
          await del(newBlob.url, { token: this.token });
          logger.info("Rollback successful: deleted copied blob");
        } catch (rollbackError) {
          logger.error("Failed to rollback copy", rollbackError);
        }
        throw deleteError;
      }

      // Update database
      let fileEntity: Types.FileEntity | undefined;
      try {
        const dbFile = await StorageDbRepository.fileByPath(input.currentPath);
        if (dbFile) {
          const updatedFile = { ...dbFile, path: newPath };
          fileEntity = await StorageDbRepository.updateFile(updatedFile);
        }
      } catch (error) {
        logger.warn(`Failed to update file in database: ${input.currentPath}`, error);
      }

      // Detect content type from file extension
      const ext = newPath.split(".").pop()?.toLowerCase() || "";
      const contentType = extToMime[ext] || "application/octet-stream";

      // NOTE: copy() returns CopyBlobResult which has url, pathname, contentType, contentDisposition
      // It does NOT have size or uploadedAt - we use current time and get size from head()
      const uploadedAt = new Date();

      // Get size from original blob since copy doesn't return it
      const bucketFile: Types.BucketFile = {
        path: newPath,
        directoryPath,
        size: BigInt(originalBlob.size),
        contentType,
        md5Hash: undefined,
        createdAt: uploadedAt,
        lastModified: uploadedAt,
        url: newBlob.url,
        mediaLink: newBlob.url,
        fileType: StorageUtils.getFileTypeFromContentType(contentType),
        isPublic: newPath.startsWith("public"),
      };

      const fileInfo = StorageUtils.combineFileData(bucketFile, fileEntity);

      return {
        success: true,
        message: "File renamed successfully",
        data: fileInfo,
      };
    } catch (error) {
      logger.error(`Failed to rename file: ${input.currentPath}`, error);
      return {
        success: false,
        message: `Failed to rename file: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  async deleteFile(filePath: string): Promise<Types.FileOperationResult> {
    try {
      // Validate path
      const validationError = await StorageUtils.validatePath(filePath);
      if (validationError) {
        return {
          success: false,
          message: validationError,
        };
      }

      // Check if file is in use
      const usageCheck = await StorageDbRepository.checkFileUsage({
        path: filePath,
      });

      if (usageCheck.isInUse) {
        return {
          success: false,
          message: usageCheck.deleteBlockReason || "File is in use",
        };
      }

      // Check if the file is protected
      const dbFile = await StorageDbRepository.fileByPath(filePath);
      if (dbFile?.isProtected === true) {
        return {
          success: false,
          message: "File is protected from deletion",
        };
      }

      // Check parent directory permissions
      const parentPath = filePath.substring(0, filePath.lastIndexOf("/"));
      const parentDir = await StorageDbRepository.directoryByPath(parentPath);
      if (parentDir && !parentDir.allowDeleteFiles) {
        return {
          success: false,
          message: "File deletion not allowed in this directory",
        };
      }

      // Get blob URL for deletion
      let blobUrl: string;
      try {
        const blobInfo = await head(filePath, {
          token: this.token,
        });
        blobUrl = blobInfo.url;
      } catch (error) {
        // File doesn't exist in Vercel Blob
        logger.warn(`File not found in Vercel Blob: ${filePath}`, error);

        // Still try to delete from database
        try {
          await StorageDbRepository.deleteFile(filePath);
        } catch (dbError) {
          logger.warn(`Failed to delete file from database: ${filePath}`, dbError);
        }

        return {
          success: false,
          message: "File not found",
        };
      }

      // Delete from Vercel Blob
      logger.info("🗑️ deleteFile: Deleting from Vercel Blob", {
        filePath,
        url: blobUrl,
      });

      await del(blobUrl, {
        token: this.token,
      });

      logger.info("🗑️ deleteFile: Deleted from Vercel Blob successfully");

      // Delete from database
      try {
        await StorageDbRepository.deleteFile(filePath);
        logger.info("🗑️ deleteFile: Deleted from database successfully");
      } catch (error) {
        logger.warn(`Failed to delete file from database: ${filePath}`, error);
      }

      return {
        success: true,
        message: "File deleted successfully",
      };
    } catch (error) {
      logger.error(`Failed to delete file: ${filePath}`, error);
      return {
        success: false,
        message: `Failed to delete file: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  async directoryInfoByPath(dirPath: string): Promise<Types.DirectoryInfo | null> {
    try {
      // Check database first
      const dbDirectory = await StorageDbRepository.directoryByPath(dirPath);

      // Check if directory exists in Vercel Blob (has files with this prefix)
      const prefix = dirPath ? `${dirPath}/` : "";
      let dirExists = false;
      let createdAt = new Date();
      let lastModified = new Date();
      let fileCount = 0;

      try {
        const result = await list({
          token: this.token,
          prefix: prefix,
          limit: 1000,
        });

        if (result.blobs.length > 0) {
          dirExists = true;
          fileCount = result.blobs.length;

          // Use earliest upload date as created date
          const uploadDates = result.blobs.map(b => b.uploadedAt);
          createdAt = new Date(Math.min(...uploadDates.map(d => d.getTime())));

          // Use latest upload date as modified date
          lastModified = new Date(Math.max(...uploadDates.map(d => d.getTime())));
        }
      } catch (error) {
        logger.warn(`Failed to check directory in Vercel Blob: ${dirPath}`, error);
        dirExists = false;
      }

      // If directory doesn't exist in storage or DB, return null
      if (!dirExists && !dbDirectory) {
        return null;
      }

      const bucketDir: Types.BucketDirectory = {
        path: dirPath,
        createdAt,
        lastModified,
        isPublic: dirPath.startsWith("public"),
      };

      return StorageUtils.combineDirectoryData(bucketDir, dbDirectory, fileCount);
    } catch (error) {
      logger.error(`Failed to get directory info: ${dirPath}`, error);
      return null;
    }
  }

  async fileInfoByPath(filePath: string): Promise<Types.FileInfo | null> {
    try {
      // Check if file exists in Vercel Blob
      let blobInfo;
      try {
        blobInfo = await head(filePath, {
          token: this.token,
        });
      } catch {
        // File doesn't exist
        return null;
      }

      // Extract directory path
      const directoryPath = StorageUtils.extractDirectoryPath(filePath);

      // Detect content type from file extension or use blob's content type
      const ext = filePath.split(".").pop()?.toLowerCase() || "";
      const contentType = extToMime[ext] || "application/octet-stream";

      // Create BucketFile object
      const bucketFile: Types.BucketFile = {
        path: filePath,
        directoryPath,
        size: BigInt(blobInfo.size),
        contentType,
        md5Hash: undefined, // Vercel doesn't provide MD5
        createdAt: blobInfo.uploadedAt,
        lastModified: blobInfo.uploadedAt,
        url: blobInfo.url,
        mediaLink: blobInfo.url,
        fileType: StorageUtils.getFileTypeFromContentType(contentType),
        isPublic: filePath.startsWith("public"),
      };

      // Get database record
      const dbFile = await StorageDbRepository.fileByPath(filePath);

      // Combine and return
      return StorageUtils.combineFileData(bucketFile, dbFile);
    } catch (error) {
      logger.error(`Failed to get file info: ${filePath}`, error);
      return null;
    }
  }

  async fileInfoByDbFileId(id: bigint): Promise<Types.FileInfo | null> {
    try {
      // Get file record from database
      const dbFile = await StorageDbRepository.fileById(id);
      if (!dbFile) {
        return null;
      }

      // Check if file exists in Vercel Blob
      let blobInfo;
      try {
        blobInfo = await head(dbFile.path, {
          token: this.token,
        });
      } catch (error) {
        // File doesn't exist in Vercel Blob (orphaned DB record)
        logger.warn(`File in DB but not in Vercel Blob: ${dbFile.path}`, error);
        return null;
      }

      // Extract directory path
      const directoryPath = StorageUtils.extractDirectoryPath(dbFile.path);

      // Detect content type from file extension
      const ext = dbFile.path.split(".").pop()?.toLowerCase() || "";
      const contentType = extToMime[ext] || "application/octet-stream";

      // Create BucketFile object
      const bucketFile: Types.BucketFile = {
        path: dbFile.path,
        directoryPath,
        size: BigInt(blobInfo.size),
        contentType,
        md5Hash: undefined, // Vercel doesn't provide MD5
        createdAt: blobInfo.uploadedAt,
        lastModified: blobInfo.uploadedAt,
        url: blobInfo.url,
        mediaLink: blobInfo.url,
        fileType: StorageUtils.getFileTypeFromContentType(contentType),
        isPublic: dbFile.path.startsWith("public"),
      };

      // Combine and return
      return StorageUtils.combineFileData(bucketFile, dbFile);
    } catch (error) {
      logger.error(`Failed to get file info by id: ${id}`, error);
      return null;
    }
  }

  async storageStatistics(searchPath?: string | null): Promise<Types.StorageStats> {
    try {
      const targetPath = searchPath || "";
      const prefix = targetPath ? `${targetPath}/` : "";

      let totalSize = BigInt(0);
      const fileTypeMap = new Map<Types.FileTypes, { count: number; size: bigint }>();
      const directories = new Set<string>();

      // Fetch all blobs with prefix
      let allBlobs: Array<{
        url: string;
        pathname: string;
        size: number;
        uploadedAt: Date;
      }> = [];

      let cursor: string | undefined = undefined;
      let hasMoreBlobs = true;

      while (hasMoreBlobs) {
        try {
          const result: ListBlobResult = await list({
            token: this.token,
            prefix: prefix,
            limit: 1000,
            cursor: cursor,
          });

          allBlobs = allBlobs.concat(result.blobs);
          cursor = result.cursor;
          hasMoreBlobs = result.hasMore;
        } catch (error) {
          logger.error("Failed to list blobs for statistics", { prefix, error });
          break;
        }
      }

      if (allBlobs.length === 0) {
        return {
          totalFiles: 0,
          totalSize: BigInt(0),
          fileTypeBreakdown: [],
          directoryCount: 0,
        };
      }

      // Process each blob
      for (const blob of allBlobs) {
        const size = BigInt(blob.size);
        totalSize += size;

        // Detect content type from extension
        const ext = blob.pathname.split(".").pop()?.toLowerCase() || "";
        const contentType = extToMime[ext] || "application/octet-stream";

        const fileType = StorageUtils.getFileTypeFromContentType(contentType);
        const current = fileTypeMap.get(fileType) || {
          count: 0,
          size: BigInt(0),
        };
        fileTypeMap.set(fileType, {
          count: current.count + 1,
          size: current.size + size,
        });

        // Extract directory path
        const relativePath = blob.pathname.startsWith(prefix) ? blob.pathname.slice(prefix.length) : blob.pathname;

        const lastSlashIndex = relativePath.lastIndexOf("/");
        if (lastSlashIndex !== -1) {
          const dirPath = relativePath.substring(0, lastSlashIndex);
          const fullDirPath = targetPath ? `${targetPath}/${dirPath}` : dirPath;

          // Add all parent directories
          const parts = fullDirPath.split("/");
          let currentPath = "";
          for (const part of parts) {
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            directories.add(currentPath);
          }
        }
      }

      const fileTypeBreakdown = Array.from(fileTypeMap.entries()).map(([type, data]) => ({
        type,
        count: data.count,
        size: data.size,
      }));

      const totalFiles = Array.from(fileTypeMap.values()).reduce((sum, data) => sum + data.count, 0);

      return {
        totalFiles,
        totalSize,
        fileTypeBreakdown,
        directoryCount: directories.size,
      };
    } catch (error) {
      logger.error("Failed to get storage statistics", error);
      return {
        totalFiles: 0,
        totalSize: BigInt(0),
        fileTypeBreakdown: [],
        directoryCount: 0,
      };
    }
  }

  async fetchDirectoryChildren(searchPath?: string | null): Promise<Types.DirectoryInfo[]> {
    try {
      // Default to root if empty
      const targetPath = !searchPath || searchPath.length === 0 ? "" : searchPath;
      const prefix = targetPath ? `${targetPath}/` : "";

      // Get directories from database
      const dbDirectories = await StorageDbRepository.directoriesByParentPath(targetPath);
      const dbDirectoriesByPath = new Map(dbDirectories.map(dir => [dir.path, dir]));

      const directories: Types.DirectoryInfo[] = [];

      // Fetch all blobs with prefix to find child directories
      let allBlobs: Array<{
        url: string;
        pathname: string;
        size: number;
        uploadedAt: Date;
      }> = [];

      let cursor: string | undefined = undefined;
      let hasMoreBlobs = true;

      while (hasMoreBlobs) {
        try {
          const result: ListBlobResult = await list({
            token: this.token,
            prefix: prefix,
            limit: 1000,
            cursor: cursor,
          });

          allBlobs = allBlobs.concat(result.blobs);
          cursor = result.cursor;
          hasMoreBlobs = result.hasMore;
        } catch (error) {
          logger.warn(`Failed to list blobs for directory children: ${targetPath}`, error);
          break;
        }
      }

      // Extract unique immediate child directories
      const childDirPaths = new Set<string>();

      for (const blob of allBlobs) {
        // Get relative path from prefix
        const relativePath = blob.pathname.startsWith(prefix) ? blob.pathname.slice(prefix.length) : blob.pathname;

        // Check if this blob is in a subdirectory
        const firstSlashIndex = relativePath.indexOf("/");
        if (firstSlashIndex !== -1) {
          // Extract immediate child directory name
          const childDirName = relativePath.substring(0, firstSlashIndex);
          const childDirPath = targetPath ? `${targetPath}/${childDirName}` : childDirName;
          childDirPaths.add(childDirPath);
        }
      }

      // Process each child directory
      for (const dirPath of childDirPaths) {
        try {
          const dbDir = dbDirectoriesByPath.get(dirPath);

          // Get files in this directory for metadata
          const dirPrefix = `${dirPath}/`;
          const filesInDir = allBlobs.filter(blob => blob.pathname.startsWith(dirPrefix));

          // Calculate directory dates from files
          const uploadDates = filesInDir.map(b => b.uploadedAt);
          const createdAt =
            uploadDates.length > 0 ? new Date(Math.min(...uploadDates.map(d => d.getTime()))) : new Date();
          const lastModified =
            uploadDates.length > 0 ? new Date(Math.max(...uploadDates.map(d => d.getTime()))) : new Date();

          const bucketDir: Types.BucketDirectory = {
            path: dirPath,
            createdAt,
            lastModified,
            isPublic: dirPath.startsWith("public"),
          };

          const fileCount = filesInDir.length;
          directories.push(StorageUtils.combineDirectoryData(bucketDir, dbDir, fileCount));
        } catch (error) {
          logger.warn(`Failed to process directory: ${dirPath}`, error);
        }
      }

      return directories;
    } catch (error) {
      logger.error(`Failed to fetch directory children: ${searchPath}`, error);
      return [];
    }
  }

  async moveItems(input: Types.StorageItemsMoveInput): Promise<Types.BulkOperationResult> {
    let successCount = 0;
    let failureCount = 0;
    const failures: Array<{ path: string; error: string }> = [];
    const successfulItems: Array<Types.FileInfo | Types.DirectoryInfo> = [];

    // Batch check if all source files exist in Vercel Blob
    const sourceExistenceChecks = await Promise.all(
      input.sourcePaths.map(async sourcePath => {
        try {
          await head(sourcePath, { token: this.token });
          return { path: sourcePath, exists: true };
        } catch {
          return { path: sourcePath, exists: false };
        }
      })
    );

    // Filter out non-existent sources
    const validSources = sourceExistenceChecks
      .filter(check => {
        if (!check.exists) {
          failureCount++;
          failures.push({
            path: check.path,
            error: "Source path not found",
          });
          return false;
        }
        return true;
      })
      .map(check => check.path);

    if (validSources.length === 0) {
      return {
        success: failureCount === 0,
        message: "No valid source files to move",
        successCount,
        failureCount,
        failures,
        successfulItems,
      };
    }

    // Batch load DB entities for source paths and directories
    const sourceDirectories = [...new Set(validSources.map(path => path.substring(0, path.lastIndexOf("/"))))];

    logger.info("💾 moveItems: About to batch load DB entities", {
      validSourcesCount: validSources.length,
      sourceDirectoriesCount: sourceDirectories.length,
    });

    const [dbFiles, dbDirectories, dbSourceDirs, dbDestDir] = await Promise.all([
      StorageDbRepository.filesByPaths(validSources),
      StorageDbRepository.directoriesByPaths(validSources),
      StorageDbRepository.directoriesByPaths(sourceDirectories),
      StorageDbRepository.directoryByPath(input.destinationPath),
    ]);

    logger.info("💾 moveItems: DB entities loaded", {
      dbFilesCount: dbFiles.length,
      dbDirectoriesCount: dbDirectories.length,
      dbSourceDirsCount: dbSourceDirs.length,
      hasDbDestDir: !!dbDestDir,
    });

    // Create lookup maps for O(1) access
    const dbFileMap = new Map();
    dbFiles.forEach(file => {
      if (file) {
        dbFileMap.set(file.path, file);
      }
    });

    const dbDirectoryMap = new Map();
    dbDirectories.forEach(dir => {
      if (dir) {
        dbDirectoryMap.set(dir.path, dir);
      }
    });

    const dbSourceDirMap = new Map();
    dbSourceDirs.forEach(dir => {
      if (dir) {
        dbSourceDirMap.set(dir.path, dir);
      }
    });

    // Check destination directory permissions once
    if (dbDestDir && !dbDestDir.allowUploads) {
      return {
        success: false,
        message: "Uploads not allowed to destination directory",
        successCount: 0,
        failureCount: validSources.length,
        failures: validSources.map(path => ({
          path,
          error: "Uploads not allowed to destination directory",
        })),
        successfulItems,
      };
    }

    // Process each valid source
    for (const sourcePath of validSources) {
      try {
        // Check permissions for source directory
        const sourceDir = sourcePath.substring(0, sourcePath.lastIndexOf("/"));
        const dbSourceDir = dbSourceDirMap.get(sourceDir);
        if (dbSourceDir && !dbSourceDir.allowMove) {
          failureCount++;
          failures.push({
            path: sourcePath,
            error: `Move not allowed from directory: ${sourceDir}`,
          });
          continue;
        }

        // Construct new path
        const fileName = StorageUtils.extractFileName(sourcePath);
        const newPath = `${input.destinationPath.replace(/\/$/, "")}/${fileName}`;

        // Check if source is a file or directory (has files with prefix)
        const isDirectory = await this.isDirectory(sourcePath);

        if (isDirectory) {
          // Move directory (all files with prefix)
          await this.moveDirectory(sourcePath, newPath);
        } else {
          // Move single file
          await this.moveSingleFile(sourcePath, newPath);
        }

        // Update DB records
        const dbFile = dbFileMap.get(sourcePath);
        const dbDirectory = dbDirectoryMap.get(sourcePath);

        if (dbFile) {
          // Update file entity path
          await StorageDbRepository.updateFile({
            id: dbFile.id,
            path: newPath,
            isProtected: dbFile.isProtected,
          });

          // Get the updated file info
          const fileInfo = await this.fileInfoByPath(newPath);
          if (fileInfo) {
            successfulItems.push(fileInfo);
          }
        } else if (dbDirectory) {
          // Update directory entity path
          await StorageDbRepository.updateDirectory({
            ...dbDirectory,
            path: newPath,
          });

          // Get the updated directory info
          const dirInfo = await this.directoryInfoByPath(newPath);
          if (dirInfo) {
            successfulItems.push(dirInfo);
          }
        } else {
          // No DB entity, get info from storage
          const fileInfo = await this.fileInfoByPath(newPath);
          if (fileInfo) {
            successfulItems.push(fileInfo);
          }
        }

        successCount++;
      } catch (error) {
        failureCount++;
        failures.push({
          path: sourcePath,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      success: failureCount === 0,
      message:
        failureCount === 0 ? "All items moved successfully" : `${successCount} items moved, ${failureCount} failed`,
      successCount,
      failureCount,
      failures,
      successfulItems,
    };
  }

  /**
   * Helper: Check if path is a directory (has files with prefix)
   */
  private async isDirectory(path: string): Promise<boolean> {
    try {
      const prefix = `${path}/`;
      const result: ListBlobResult = await list({
        token: this.token,
        prefix: prefix,
        limit: 1,
      });
      return result.blobs.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Helper: Move single file
   */
  private async moveSingleFile(sourcePath: string, destPath: string): Promise<void> {
    // Get source blob
    const sourceBlob = await head(sourcePath, { token: this.token });

    // Copy to destination
    const newBlob = await copy(sourceBlob.url, destPath, { token: this.token, access: "public" });

    logger.info("📋 moveSingleFile: Copied blob", {
      from: sourcePath,
      to: destPath,
      url: newBlob.url,
    });

    // Delete original
    await del(sourceBlob.url, { token: this.token });

    logger.info("🗑️ moveSingleFile: Deleted original blob", { path: sourcePath });
  }

  /**
   * Helper: Move directory (all files with prefix)
   */
  private async moveDirectory(sourcePath: string, destPath: string): Promise<void> {
    // List all files in source directory
    const prefix = `${sourcePath}/`;
    let allBlobs: Array<{ url: string; pathname: string }> = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const result: ListBlobResult = await list({
        token: this.token,
        prefix: prefix,
        limit: 1000,
        cursor: cursor,
      });
      allBlobs = allBlobs.concat(result.blobs);
      cursor = result.cursor;
      hasMore = result.hasMore;
    }

    logger.info("📋 moveDirectory: Found files to move", {
      sourceDir: sourcePath,
      fileCount: allBlobs.length,
    });

    // Move each file
    for (const blob of allBlobs) {
      const relativePath = blob.pathname.slice(prefix.length);
      const newFilePath = `${destPath}/${relativePath}`;

      try {
        // Copy file
        await copy(blob.url, newFilePath, { token: this.token, access: "public" });

        // Delete original
        await del(blob.url, { token: this.token });

        // Update DB record if exists
        const dbFile = await StorageDbRepository.fileByPath(blob.pathname);
        if (dbFile) {
          await StorageDbRepository.updateFile({
            id: dbFile.id,
            path: newFilePath,
            isProtected: dbFile.isProtected,
          });
        }
      } catch (error) {
        logger.error(`Failed to move file in directory: ${blob.pathname}`, error);
        throw error;
      }
    }

    logger.info("✅ moveDirectory: All files moved", {
      sourceDir: sourcePath,
      destDir: destPath,
      fileCount: allBlobs.length,
    });
  }

  async copyItems(input: Types.StorageItemsCopyInput): Promise<Types.BulkOperationResult> {
    let successCount = 0;
    let failureCount = 0;
    const failures: Array<{ path: string; error: string }> = [];
    const successfulItems: Array<Types.FileInfo | Types.DirectoryInfo> = [];

    // Batch check if all source files exist in Vercel Blob
    const sourceExistenceChecks = await Promise.all(
      input.sourcePaths.map(async sourcePath => {
        try {
          await head(sourcePath, { token: this.token });
          return { path: sourcePath, exists: true };
        } catch {
          return { path: sourcePath, exists: false };
        }
      })
    );

    // Filter out non-existent sources
    const validSources = sourceExistenceChecks
      .filter(check => {
        if (!check.exists) {
          failureCount++;
          failures.push({
            path: check.path,
            error: "Source path not found",
          });
          return false;
        }
        return true;
      })
      .map(check => check.path);

    if (validSources.length === 0) {
      return {
        success: failureCount === 0,
        message: "No valid source files to copy",
        successCount,
        failureCount,
        failures,
        successfulItems,
      };
    }

    // Check destination directory permissions once
    const dbDestDir = await StorageDbRepository.directoryByPath(input.destinationPath);
    if (dbDestDir && !dbDestDir.allowUploads) {
      return {
        success: false,
        message: "Uploads not allowed to destination directory",
        successCount: 0,
        failureCount: validSources.length,
        failures: validSources.map(path => ({
          path,
          error: "Uploads not allowed to destination directory",
        })),
        successfulItems,
      };
    }

    // Process each valid source
    for (const sourcePath of validSources) {
      try {
        const fileName = StorageUtils.extractFileName(sourcePath);
        const destPath = `${input.destinationPath.replace(/\/$/, "")}/${fileName}`;

        // Check if source is a file or directory
        const isDirectory = await this.isDirectory(sourcePath);

        if (isDirectory) {
          // Recursively copy directory
          await this.copyDirectory(sourcePath, destPath);
        } else {
          // Copy single file
          await this.copySingleFile(sourcePath, destPath);
        }

        // Don't create DB entities - just get file info from storage
        const fileInfo = await this.fileInfoByPath(destPath);
        if (fileInfo) {
          successfulItems.push(fileInfo);
        }

        successCount++;
      } catch (error) {
        failureCount++;
        failures.push({
          path: sourcePath,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      success: failureCount === 0,
      message:
        failureCount === 0 ? "All items copied successfully" : `${successCount} items copied, ${failureCount} failed`,
      successCount,
      failureCount,
      failures,
      successfulItems,
    };
  }

  /**
   * Helper: Copy single file
   */
  private async copySingleFile(sourcePath: string, destPath: string): Promise<void> {
    // Get source blob
    const sourceBlob = await head(sourcePath, { token: this.token });

    // Copy to destination
    const newBlob = await copy(sourceBlob.url, destPath, { token: this.token, access: "public" });

    logger.info("📋 copySingleFile: Copied blob", {
      from: sourcePath,
      to: destPath,
      url: newBlob.url,
    });
  }

  /**
   * Helper: Recursively copy directory
   */
  private async copyDirectory(sourcePath: string, destPath: string): Promise<void> {
    // List all files in source directory
    const prefix = `${sourcePath}/`;
    let allBlobs: Array<{ url: string; pathname: string }> = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const result: ListBlobResult = await list({
        token: this.token,
        prefix: prefix,
        limit: 1000,
        cursor: cursor,
      });
      allBlobs = allBlobs.concat(result.blobs);
      cursor = result.cursor;
      hasMore = result.hasMore;
    }

    logger.info("📋 copyDirectory: Found files to copy", {
      sourceDir: sourcePath,
      fileCount: allBlobs.length,
    });

    // Copy each file
    for (const blob of allBlobs) {
      const relativePath = blob.pathname.slice(prefix.length);
      const newFilePath = `${destPath}/${relativePath}`;

      try {
        // Copy file
        await copy(blob.url, newFilePath, { token: this.token, access: "public" });

        logger.info("📋 copyDirectory: Copied file", {
          from: blob.pathname,
          to: newFilePath,
        });
      } catch (error) {
        logger.error(`Failed to copy file in directory: ${blob.pathname}`, error);
        throw error;
      }
    }

    logger.info("✅ copyDirectory: All files copied", {
      sourceDir: sourcePath,
      destDir: destPath,
      fileCount: allBlobs.length,
    });
  }

  async deleteItems(input: Types.StorageItemsDeleteInput): Promise<Types.BulkOperationResult> {
    let successCount = 0;
    let failureCount = 0;
    const failures: Array<{ path: string; error: string }> = [];
    const successfulItems: Array<Types.FileInfo | Types.DirectoryInfo> = [];

    // Batch load DB entities for all paths and their parent directories
    const parentDirectories = [...new Set(input.paths.map(path => path.substring(0, path.lastIndexOf("/"))))];

    const [dbFiles, dbDirectories, dbParentDirs, usageChecks] = await Promise.all([
      StorageDbRepository.filesByPaths(input.paths),
      StorageDbRepository.directoriesByPaths(input.paths),
      StorageDbRepository.directoriesByPaths(parentDirectories),
      // Batch check file usage if not force delete
      input.force
        ? Promise.resolve([])
        : Promise.all(
            input.paths.map(filePath =>
              StorageDbRepository.checkFileUsage({
                path: filePath,
              })
                .then(result => ({ path: filePath, ...result }))
                .catch(() => ({
                  path: filePath,
                  isInUse: false,
                  deleteBlockReason: null,
                }))
            )
          ),
    ]);

    // Create lookup maps for O(1) access
    const dbFileMap = new Map();
    dbFiles.forEach(file => {
      if (file) {
        dbFileMap.set(file.path, file);
      }
    });

    const dbDirectoryMap = new Map();
    dbDirectories.forEach(dir => {
      if (dir) {
        dbDirectoryMap.set(dir.path, dir);
      }
    });

    const dbParentDirMap = new Map();
    dbParentDirs.forEach(dir => {
      if (dir) {
        dbParentDirMap.set(dir.path, dir);
      }
    });

    const usageCheckMap = new Map();
    usageChecks.forEach(check => {
      usageCheckMap.set(check.path, check);
    });

    // Process each path
    for (const itemPath of input.paths) {
      try {
        // Check if file is in use (unless force delete)
        if (!input.force) {
          const usageCheck = usageCheckMap.get(itemPath);
          if (usageCheck?.isInUse) {
            failureCount++;
            failures.push({
              path: itemPath,
              error: usageCheck.deleteBlockReason || "File is currently in use",
            });
            continue;
          }
        }

        // Check if file/directory is protected
        const dbFile = dbFileMap.get(itemPath);
        const dbDirectory = dbDirectoryMap.get(itemPath);

        if (dbFile?.isProtected === true || dbDirectory?.isProtected === true) {
          failureCount++;
          failures.push({
            path: itemPath,
            error: "Item is protected from deletion",
          });
          continue;
        }

        // Check parent directory permissions
        const parentPath = itemPath.substring(0, itemPath.lastIndexOf("/"));
        const parentDir = dbParentDirMap.get(parentPath);
        if (parentDir) {
          const isFile = dbFile != null;
          const canDelete = isFile ? parentDir.allowDeleteFiles : parentDir.allowDelete;
          if (!canDelete) {
            failureCount++;
            failures.push({
              path: itemPath,
              error: "Deletion not allowed in parent directory",
            });
            continue;
          }
        }

        // Get entity before deleting for the result
        const fileEntity = await this.fileInfoByPath(itemPath);
        const folderEntity = fileEntity ? null : await this.directoryInfoByPath(itemPath);

        // Check if it's a directory (has files with prefix)
        const isDirectory = await this.isDirectory(itemPath);

        if (isDirectory) {
          // Delete directory (all files with prefix)
          await this.deleteDirectory(itemPath);
        } else {
          // Delete single file
          await this.deleteSingleFile(itemPath);
        }

        // Delete from database
        if (dbFile) {
          await StorageDbRepository.deleteFile(itemPath);
        } else if (dbDirectory) {
          await StorageDbRepository.deleteDirectory(dbDirectory.id);
        }

        // Add to successful items
        if (fileEntity) {
          successfulItems.push(fileEntity);
        } else if (folderEntity) {
          successfulItems.push(folderEntity);
        }

        successCount++;
      } catch (error) {
        failureCount++;
        failures.push({
          path: itemPath,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      success: failureCount === 0,
      message:
        failureCount === 0 ? "All items deleted successfully" : `${successCount} items deleted, ${failureCount} failed`,
      successCount,
      failureCount,
      failures,
      successfulItems,
    };
  }

  /**
   * Helper: Delete single file
   */
  private async deleteSingleFile(filePath: string): Promise<void> {
    // Get blob URL
    const blobInfo = await head(filePath, { token: this.token });

    // Delete from Vercel Blob
    await del(blobInfo.url, { token: this.token });

    logger.info("🗑️ deleteSingleFile: Deleted blob", { path: filePath });
  }

  /**
   * Helper: Delete directory (all files with prefix)
   */
  private async deleteDirectory(dirPath: string): Promise<void> {
    // List all files in directory
    const prefix = `${dirPath}/`;
    let allBlobs: Array<{ url: string; pathname: string }> = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const result: ListBlobResult = await list({
        token: this.token,
        prefix: prefix,
        limit: 1000,
        cursor: cursor,
      });
      allBlobs = allBlobs.concat(result.blobs);
      cursor = result.cursor;
      hasMore = result.hasMore;
    }

    logger.info("🗑️ deleteDirectory: Found files to delete", {
      dir: dirPath,
      fileCount: allBlobs.length,
    });

    // Delete each file
    for (const blob of allBlobs) {
      try {
        await del(blob.url, { token: this.token });

        // Delete DB record if exists
        const dbFile = await StorageDbRepository.fileByPath(blob.pathname);
        if (dbFile) {
          await StorageDbRepository.deleteFile(blob.pathname);
        }

        logger.info("🗑️ deleteDirectory: Deleted file", { path: blob.pathname });
      } catch (error) {
        logger.error(`Failed to delete file in directory: ${blob.pathname}`, error);
        throw error;
      }
    }

    logger.info("✅ deleteDirectory: All files deleted", {
      dir: dirPath,
      fileCount: allBlobs.length,
    });
  }
}

/**
 * Factory function to create Vercel storage adapter
 */
export async function createVercelAdapter(): Promise<StorageService> {
  return new VercelAdapter();
}

export default VercelAdapter;
