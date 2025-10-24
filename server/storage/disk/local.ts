import fs from "fs/promises";
import { Stats, createWriteStream, Dirent } from "fs";
import path from "path";
import crypto from "crypto";
import logger from "@/server/lib/logger";
import * as Types from "@/server/types";
import {
  StorageService,
  StorageValidationError,
  STORAGE_CONFIG,
} from "./storage.service.interface";
import { StorageDbRepository, SignedUrlRepository } from "@/server/db/repo";
import { StorageUtils } from "@/server/utils";
import { OrderSortDirection } from "@/lib/enum";

/**
 * Clean path for local storage - removes leading slashes and normalizes
 */
function cleanLocalPath(inputPath: string): string {
  if (!inputPath || inputPath.length === 0) {
    return "";
  }

  // Remove leading slashes and trailing slashes
  const cleaned = inputPath.replace(/^\/+/, "").replace(/\/$/, "");

  return cleaned;
}

/**
 * Local filesystem storage adapter
 * Stores files in a configurable directory with signed URL support via API routes
 */
class LocalAdapter implements StorageService {
  private readonly basePath: string;
  private readonly baseUrl: string;

  constructor() {
    // Read environment variables in constructor for testability
    const storagePath = process.env.LOCAL_STORAGE_PATH || "./storage/";
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    this.basePath = path.resolve(process.cwd(), storagePath);
    logger.info(`Local storage initialized at: ${this.basePath}`);
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Convert relative user path to secure absolute filesystem path
   * Prevents path traversal attacks
   */
  private getAbsolutePath(relativePath: string): string {
    // Join the user path with base path and resolve it
    const resolvedPath = path.resolve(this.basePath, relativePath);

    // Check if resolved path is within base directory
    const relativeToBase = path.relative(this.basePath, resolvedPath);

    // If path starts with ".." or is absolute, it's trying to escape
    if (relativeToBase.startsWith("..") || path.isAbsolute(relativeToBase)) {
      throw new StorageValidationError("Path traversal detected");
    }

    return resolvedPath;
  }

  /**
   * Convert fs.Stats to BlobMetadata format
   */
  private fileStatsToMetadata(
    stats: Stats,
    filePath: string
  ): Types.BlobMetadata {
    return {
      name: filePath,
      size: stats.size,
      contentType: undefined, // Will be determined by file extension
      timeCreated: stats.birthtime.toISOString(),
      updated: stats.mtime.toISOString(),
      mediaLink: undefined,
      md5Hash: undefined, // Will be calculated separately if needed
    };
  }

  /**
   * Create parent directories if needed
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true, mode: 0o755 });
  }

  /**
   * Calculate MD5 hash of a file
   */
  private async calculateMd5(filePath: string): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);
    const hash = crypto.createHash("md5").update(fileBuffer).digest("base64");
    return hash;
  }

  /**
   * Stream data to file while calculating MD5
   */
  private async streamToFile(
    stream: NodeJS.ReadableStream,
    filePath: string,
    expectedMd5?: string
  ): Promise<void> {
    const hash = crypto.createHash("md5");
    const writeStream = createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => {
        hash.update(chunk);
        writeStream.write(chunk);
      });

      stream.on("end", () => {
        writeStream.end();
        const calculatedMd5 = hash.digest("base64");

        if (expectedMd5 && calculatedMd5 !== expectedMd5) {
          // Delete the file if MD5 doesn't match
          fs.unlink(filePath).catch(() => {
            // Ignore errors during cleanup
          });
          reject(new Error("MD5 hash mismatch"));
        } else {
          resolve();
        }
      });

      stream.on("error", (error: Error) => {
        writeStream.destroy();
        reject(error);
      });

      writeStream.on("error", (error: Error) => {
        reject(error);
      });
    });
  }

  // ============================================================================
  // StorageService Interface Implementation
  // ============================================================================

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const absolutePath = this.getAbsolutePath(filePath);
      await fs.access(absolutePath);
      const stats = await fs.stat(absolutePath);
      return stats.isFile();
    } catch (error) {
      logger.error(`Error checking file existence: ${filePath}`, error);
      return false;
    }
  }

  async generateUploadSignedUrl(
    input: Types.UploadSignedUrlGenerateInput
  ): Promise<string> {
    try {
      // Clean the path
      const cleanedPath = cleanLocalPath(input.path);

      const mimeType = StorageUtils.contentTypeEnumToMimeType(
        input.contentType
      );

      logger.info("🔍 [SERVER DEBUG] Generating signed URL", {
        path: cleanedPath,
        fileSize: input.fileSize,
        inputContentTypeEnum: input.contentType,
        convertedMimeType: mimeType,
        contentMd5: input.contentMd5,
      });

      // Validate upload
      const validationError = await StorageUtils.validateUpload(
        cleanedPath,
        input.fileSize
      );
      if (validationError) {
        throw new StorageValidationError(validationError);
      }

      // Optional lazy cleanup: clean up expired tokens before creating new one
      const cleanupStrategy = process.env.SIGNED_URL_CLEANUP_STRATEGY || "lazy";
      if (cleanupStrategy === "lazy" || cleanupStrategy === "both") {
        try {
          await SignedUrlRepository.deleteExpired();
        } catch (error) {
          // Non-fatal: log but don't block URL generation
          logger.error(
            "Lazy cleanup failed during signed URL generation",
            error
          );
        }
      }

      // Generate unique token ID
      const tokenId = crypto.randomUUID();

      // Calculate expiration time
      const expiresAt = new Date(
        Date.now() + STORAGE_CONFIG.SIGNED_URL_DURATION * 60 * 1000
      );

      // Create signed URL entry in database
      await SignedUrlRepository.createSignedUrl({
        id: tokenId,
        filePath: cleanedPath,
        contentType: mimeType,
        fileSize: BigInt(input.fileSize),
        contentMd5: input.contentMd5,
        expiresAt,
        createdAt: new Date(),
        used: false,
      });

      logger.info("🔍 [SERVER DEBUG] Stored signed URL in database", {
        tokenId,
        filePath: cleanedPath,
        storedContentType: mimeType,
        storedFileSize: input.fileSize,
        storedContentMd5: input.contentMd5,
        expiresAt,
      });

      // Return API route URL
      const signedUrl = `${this.baseUrl}/api/storage/upload/${tokenId}`;

      logger.info("Generated signed URL successfully", {
        tokenId,
        path: cleanedPath,
        expiresAt,
      });

      return signedUrl;
    } catch (error) {
      logger.error("Failed to generate upload signed URL", {
        path: input.path,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  async uploadFile(
    filePath: string,
    contentType: Types.FileContentType,
    buffer: Buffer
  ): Promise<Types.FileUploadResult> {
    try {
      // Clean the file path
      const cleanedFilePath = cleanLocalPath(filePath);
      const fileSize = buffer.byteLength;

      // Validate upload
      const validationError = await StorageUtils.validateUpload(
        filePath,
        fileSize
      );
      if (validationError) {
        return {
          success: false,
          message: validationError,
          data: null,
        };
      }

      // Check directory permissions
      const directoryPath = cleanedFilePath.substring(
        0,
        cleanedFilePath.lastIndexOf("/")
      );
      const dbDirectory =
        await StorageDbRepository.directoryByPath(directoryPath);

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

      // Write file to disk
      const absolutePath = this.getAbsolutePath(cleanedFilePath);
      await this.ensureDirectory(path.dirname(absolutePath));
      await fs.writeFile(absolutePath, buffer);

      // Create file entity in database
      logger.info("💾 uploadFile: Creating file entity in database", {
        filePath: cleanedFilePath,
      });
      const fileEntity = await StorageDbRepository.createFile(
        cleanedFilePath,
        false
      );
      logger.info("💾 uploadFile: File entity created successfully", {
        fileEntity,
      });

      // Get file stats and create metadata
      const stats = await fs.stat(absolutePath);
      const md5Hash = await this.calculateMd5(absolutePath);

      const bucketFile: Types.BucketFile = {
        path: cleanedFilePath,
        directoryPath,
        size: BigInt(stats.size),
        contentType: StorageUtils.contentTypeEnumToMimeType(contentType),
        md5Hash,
        createdAt: stats.birthtime,
        lastModified: stats.mtime,
        url: `${this.baseUrl}/api/storage/files/${cleanedFilePath}`,
        mediaLink: undefined,
        fileType: StorageUtils.getFileTypeFromContentType(
          StorageUtils.contentTypeEnumToMimeType(contentType)
        ),
        isPublic: cleanedFilePath.startsWith("public"),
      };

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

  async listFiles(
    input: Types.FilesListSearchInput
  ): Promise<Types.StorageObjectList> {
    try {
      const searchPath = cleanLocalPath(input.path || "");
      const absolutePath = this.getAbsolutePath(searchPath);

      const items: Array<Types.FileInfo | Types.DirectoryInfo> = [];

      // Read directory contents
      let entries: Dirent[];
      try {
        entries = await fs.readdir(absolutePath, { withFileTypes: true });
      } catch {
        // Directory doesn't exist or not accessible
        return {
          items: [],
          totalCount: 0,
          hasMore: false,
          offset: input.offset || 0,
          limit: input.limit || 50,
        };
      }

      // Separate files and directories
      const filePaths: string[] = [];
      const dirPaths: string[] = [];

      for (const entry of entries) {
        const itemPath = searchPath
          ? `${searchPath}/${entry.name}`
          : entry.name;
        if (entry.isFile()) {
          filePaths.push(itemPath);
        } else if (entry.isDirectory()) {
          dirPaths.push(itemPath);
        }
      }

      // Batch database queries
      const [dbFiles, dbDirectories] = await Promise.all([
        filePaths.length > 0 ? StorageDbRepository.filesByPaths(filePaths) : [],
        dirPaths.length > 0
          ? StorageDbRepository.directoriesByPaths(dirPaths)
          : [],
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

      // Process files
      for (const filePath of filePaths) {
        try {
          const absoluteFilePath = this.getAbsolutePath(filePath);
          const stats = await fs.stat(absoluteFilePath);
          const md5Hash = await this.calculateMd5(absoluteFilePath);
          const directoryPath = StorageUtils.extractDirectoryPath(filePath);

          // Detect content type
          const ext = path.extname(filePath).toLowerCase();
          const contentTypeMap: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".pdf": "application/pdf",
            ".doc": "application/msword",
            ".docx":
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls": "application/vnd.ms-excel",
            ".xlsx":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".txt": "text/plain",
            ".zip": "application/zip",
            ".rar": "application/vnd.rar",
            ".mp4": "video/mp4",
            ".mp3": "audio/mpeg",
            ".wav": "audio/wav",
          };
          const contentType = contentTypeMap[ext] || "application/octet-stream";

          const bucketFile: Types.BucketFile = {
            path: filePath,
            directoryPath,
            size: BigInt(stats.size),
            contentType,
            md5Hash,
            createdAt: stats.birthtime,
            lastModified: stats.mtime,
            url: `${this.baseUrl}/api/storage/files/${filePath}`,
            mediaLink: undefined,
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
          const absoluteDirPath = this.getAbsolutePath(dirPath);
          const stats = await fs.stat(absoluteDirPath);
          const dbDir = dbDirMap.get(dirPath);

          // Count files in directory
          let fileCount = 0;
          try {
            const dirEntries = await fs.readdir(absoluteDirPath);
            fileCount = dirEntries.length;
          } catch {
            fileCount = 0;
          }

          const bucketDir: Types.BucketDirectory = {
            path: dirPath,
            createdAt: stats.birthtime,
            lastModified: stats.mtime,
            isPublic: dirPath.startsWith("public"),
          };

          const dirInfo = StorageUtils.combineDirectoryData(
            bucketDir,
            dbDir,
            fileCount
          );
          items.push(dirInfo);
        } catch (error) {
          logger.warn(`Failed to process directory: ${dirPath}`, error);
        }
      }

      // Apply search filter
      let filteredItems = items;
      if (input.searchTerm && input.searchTerm.length > 0) {
        const searchLower = input.searchTerm.toLowerCase();
        filteredItems = items.filter(item =>
          item.name.toLowerCase().includes(searchLower)
        );
      }

      // Apply file type filter
      if (input.fileType) {
        filteredItems = filteredItems.filter(item => {
          if ("fileType" in item) {
            return item.fileType === input.fileType;
          }
          return false;
        });
      }

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

  async createFolder(
    input: Types.FolderCreateInput
  ): Promise<Types.FileOperationResult> {
    try {
      // Clean the path to remove leading/trailing slashes
      const fullPath = cleanLocalPath(input.path);

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

      // Create folder in filesystem
      const absolutePath = this.getAbsolutePath(fullPath);
      await fs.mkdir(absolutePath, { recursive: true, mode: 0o755 });

      // Only save folder in DB if custom permissions are provided
      const hasCustomPermissions =
        input.permissions != null ||
        input.protected === true ||
        input.protectChildren === true;

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

          newDirectoryInfo = StorageUtils.combineDirectoryData(
            bucketDir,
            directoryEntity
          );
        } catch (error) {
          // If DB operation fails, still return success since folder was created
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

  async renameFile(
    input: Types.FileRenameInput
  ): Promise<Types.FileOperationResult> {
    try {
      // Validate current path
      const pathValidationError = await StorageUtils.validatePath(
        input.currentPath
      );
      if (pathValidationError) {
        return {
          success: false,
          message: pathValidationError,
        };
      }

      // Validate new name
      const nameValidationError = await StorageUtils.validateFileName(
        input.newName
      );
      if (nameValidationError) {
        return {
          success: false,
          message: nameValidationError,
        };
      }

      const directoryPath = StorageUtils.extractDirectoryPath(
        input.currentPath
      );
      const newPath = `${directoryPath}/${input.newName}`;

      // Rename file in filesystem
      const currentAbsolutePath = this.getAbsolutePath(input.currentPath);
      const newAbsolutePath = this.getAbsolutePath(newPath);

      // Ensure target directory exists
      await this.ensureDirectory(path.dirname(newAbsolutePath));

      await fs.rename(currentAbsolutePath, newAbsolutePath);

      // Update database
      let fileEntity: Types.FileEntity | undefined;
      try {
        const dbFile = await StorageDbRepository.fileByPath(input.currentPath);
        if (dbFile) {
          const updatedFile = { ...dbFile, path: newPath };
          fileEntity = await StorageDbRepository.updateFile(updatedFile);
        }
      } catch (error) {
        logger.warn(
          `Failed to update file in database: ${input.currentPath}`,
          error
        );
      }

      // Get file stats and create metadata
      const stats = await fs.stat(newAbsolutePath);
      const md5Hash = await this.calculateMd5(newAbsolutePath);

      // Detect content type from file extension
      const ext = path.extname(newPath).toLowerCase();
      const contentTypeMap: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".txt": "text/plain",
        ".zip": "application/zip",
        ".rar": "application/vnd.rar",
        ".mp4": "video/mp4",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
      };
      const contentType = contentTypeMap[ext] || "application/octet-stream";

      const bucketFile: Types.BucketFile = {
        path: newPath,
        directoryPath,
        size: BigInt(stats.size),
        contentType,
        md5Hash,
        createdAt: stats.birthtime,
        lastModified: stats.mtime,
        url: `${this.baseUrl}/api/storage/files/${newPath}`,
        mediaLink: undefined,
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

      // Delete from filesystem
      const absolutePath = this.getAbsolutePath(filePath);
      await fs.unlink(absolutePath);

      // Delete from database
      try {
        await StorageDbRepository.deleteFile(filePath);
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

  async directoryInfoByPath(
    dirPath: string
  ): Promise<Types.DirectoryInfo | null> {
    try {
      // Check database first
      const dbDirectory = await StorageDbRepository.directoryByPath(dirPath);

      // Check filesystem
      const absolutePath = this.getAbsolutePath(dirPath);
      let dirExists = false;
      let stats: Stats | null = null;

      try {
        stats = await fs.stat(absolutePath);
        dirExists = stats.isDirectory();
      } catch {
        dirExists = false;
      }

      if (!dirExists && !dbDirectory) {
        return null;
      }

      const bucketDir: Types.BucketDirectory = {
        path: dirPath,
        createdAt: stats?.birthtime || new Date(),
        lastModified: stats?.mtime || new Date(),
        isPublic: dirPath.startsWith("public"),
      };

      return StorageUtils.combineDirectoryData(bucketDir, dbDirectory);
    } catch (error) {
      logger.error(`Failed to get directory info: ${dirPath}`, error);
      return null;
    }
  }

  async fileInfoByPath(filePath: string): Promise<Types.FileInfo | null> {
    try {
      const absolutePath = this.getAbsolutePath(filePath);

      // Check if file exists
      try {
        await fs.access(absolutePath);
      } catch {
        return null;
      }

      const stats = await fs.stat(absolutePath);
      if (!stats.isFile()) {
        return null;
      }

      // Calculate MD5 and get file metadata
      const md5Hash = await this.calculateMd5(absolutePath);
      const directoryPath = StorageUtils.extractDirectoryPath(filePath);

      // Detect content type from file extension
      const ext = path.extname(filePath).toLowerCase();
      const contentTypeMap: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".txt": "text/plain",
        ".zip": "application/zip",
        ".rar": "application/vnd.rar",
        ".mp4": "video/mp4",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
      };
      const contentType = contentTypeMap[ext] || "application/octet-stream";

      const bucketFile: Types.BucketFile = {
        path: filePath,
        directoryPath,
        size: BigInt(stats.size),
        contentType,
        md5Hash,
        createdAt: stats.birthtime,
        lastModified: stats.mtime,
        url: `${this.baseUrl}/api/storage/files/${filePath}`,
        mediaLink: undefined,
        fileType: StorageUtils.getFileTypeFromContentType(contentType),
        isPublic: filePath.startsWith("public"),
      };

      const dbFile = await StorageDbRepository.fileByPath(filePath);
      return StorageUtils.combineFileData(bucketFile, dbFile);
    } catch (error) {
      logger.error(`Failed to get file info: ${filePath}`, error);
      return null;
    }
  }

  async fileInfoByDbFileId(id: bigint): Promise<Types.FileInfo | null> {
    try {
      const dbFile = await StorageDbRepository.fileById(id);
      if (!dbFile) {
        return null;
      }

      const absolutePath = this.getAbsolutePath(dbFile.path);

      // Check if file exists
      try {
        await fs.access(absolutePath);
      } catch {
        return null;
      }

      const stats = await fs.stat(absolutePath);
      if (!stats.isFile()) {
        return null;
      }

      // Calculate MD5 and get file metadata
      const md5Hash = await this.calculateMd5(absolutePath);
      const directoryPath = StorageUtils.extractDirectoryPath(dbFile.path);

      // Detect content type from file extension
      const ext = path.extname(dbFile.path).toLowerCase();
      const contentTypeMap: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xls": "application/vnd.ms-excel",
        ".xlsx":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".txt": "text/plain",
        ".zip": "application/zip",
        ".rar": "application/vnd.rar",
        ".mp4": "video/mp4",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
      };
      const contentType = contentTypeMap[ext] || "application/octet-stream";

      const bucketFile: Types.BucketFile = {
        path: dbFile.path,
        directoryPath,
        size: BigInt(stats.size),
        contentType,
        md5Hash,
        createdAt: stats.birthtime,
        lastModified: stats.mtime,
        url: `${this.baseUrl}/api/storage/files/${dbFile.path}`,
        mediaLink: undefined,
        fileType: StorageUtils.getFileTypeFromContentType(contentType),
        isPublic: dbFile.path.startsWith("public"),
      };

      return StorageUtils.combineFileData(bucketFile, dbFile);
    } catch (error) {
      logger.error(`Failed to get file info by id: ${id}`, error);
      return null;
    }
  }

  async storageStatistics(
    searchPath?: string | null
  ): Promise<Types.StorageStats> {
    try {
      const targetPath = searchPath || "";
      const absolutePath = this.getAbsolutePath(targetPath);

      let totalSize = BigInt(0);
      const fileTypeMap = new Map<
        Types.FileTypes,
        { count: number; size: bigint }
      >();
      const directories = new Set<string>();

      // Recursively walk through directory
      const walkDirectory = async (dirPath: string, relativePath: string) => {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
          const entryAbsolutePath = path.join(dirPath, entry.name);
          const entryRelativePath = relativePath
            ? `${relativePath}/${entry.name}`
            : entry.name;

          if (entry.isDirectory()) {
            directories.add(entryRelativePath);
            await walkDirectory(entryAbsolutePath, entryRelativePath);
          } else if (entry.isFile()) {
            const stats = await fs.stat(entryAbsolutePath);
            const size = BigInt(stats.size);
            totalSize += size;

            // Detect content type from file extension
            const ext = path.extname(entry.name).toLowerCase();
            const contentTypeMap: Record<string, string> = {
              ".jpg": "image/jpeg",
              ".jpeg": "image/jpeg",
              ".png": "image/png",
              ".gif": "image/gif",
              ".webp": "image/webp",
              ".pdf": "application/pdf",
              ".doc": "application/msword",
              ".docx":
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ".xls": "application/vnd.ms-excel",
              ".xlsx":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              ".txt": "text/plain",
              ".zip": "application/zip",
              ".rar": "application/vnd.rar",
              ".mp4": "video/mp4",
              ".mp3": "audio/mpeg",
              ".wav": "audio/wav",
            };
            const contentType =
              contentTypeMap[ext] || "application/octet-stream";

            const fileType =
              StorageUtils.getFileTypeFromContentType(contentType);
            const current = fileTypeMap.get(fileType) || {
              count: 0,
              size: BigInt(0),
            };
            fileTypeMap.set(fileType, {
              count: current.count + 1,
              size: current.size + size,
            });
          }
        }
      };

      // Check if path exists
      try {
        await fs.access(absolutePath);
        const stats = await fs.stat(absolutePath);

        if (stats.isDirectory()) {
          await walkDirectory(absolutePath, "");
        } else if (stats.isFile()) {
          // Single file stats
          const size = BigInt(stats.size);
          totalSize = size;

          const ext = path.extname(targetPath).toLowerCase();
          const contentTypeMap: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".pdf": "application/pdf",
            ".doc": "application/msword",
            ".docx":
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls": "application/vnd.ms-excel",
            ".xlsx":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".txt": "text/plain",
            ".zip": "application/zip",
            ".rar": "application/vnd.rar",
            ".mp4": "video/mp4",
            ".mp3": "audio/mpeg",
            ".wav": "audio/wav",
          };
          const contentType = contentTypeMap[ext] || "application/octet-stream";

          const fileType = StorageUtils.getFileTypeFromContentType(contentType);
          fileTypeMap.set(fileType, {
            count: 1,
            size,
          });
        }
      } catch {
        // Path doesn't exist, return empty stats
        return {
          totalFiles: 0,
          totalSize: BigInt(0),
          fileTypeBreakdown: [],
          directoryCount: 0,
        };
      }

      const fileTypeBreakdown = Array.from(fileTypeMap.entries()).map(
        ([type, data]) => ({
          type,
          count: data.count,
          size: data.size,
        })
      );

      const totalFiles = Array.from(fileTypeMap.values()).reduce(
        (sum, data) => sum + data.count,
        0
      );

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

  async fetchDirectoryChildren(
    searchPath?: string | null
  ): Promise<Types.DirectoryInfo[]> {
    try {
      // Default to "public" if empty
      const targetPath =
        !searchPath || searchPath.length === 0 ? "" : searchPath;
      const absolutePath = this.getAbsolutePath(targetPath);

      // Get directories from database
      const dbDirectories =
        await StorageDbRepository.directoriesByParentPath(targetPath);
      const dbDirectoriesByPath = new Map(
        dbDirectories.map(dir => [dir.path, dir])
      );

      const directories: Types.DirectoryInfo[] = [];

      // Read directory contents
      try {
        const entries = await fs.readdir(absolutePath, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isDirectory()) {
            const dirPath = targetPath
              ? `${targetPath}/${entry.name}`
              : entry.name;
            const absoluteDirPath = this.getAbsolutePath(dirPath);
            const stats = await fs.stat(absoluteDirPath);
            const dbDir = dbDirectoriesByPath.get(dirPath);

            const bucketDir: Types.BucketDirectory = {
              path: dirPath,
              createdAt: stats.birthtime,
              lastModified: stats.mtime,
              isPublic: dirPath.startsWith("public"),
            };

            directories.push(
              StorageUtils.combineDirectoryData(bucketDir, dbDir)
            );
          }
        }
      } catch (error) {
        logger.warn(`Failed to read directory: ${targetPath}`, error);
      }

      return directories;
    } catch (error) {
      logger.error(`Failed to fetch directory children: ${searchPath}`, error);
      return [];
    }
  }

  async moveItems(
    input: Types.StorageItemsMoveInput
  ): Promise<Types.BulkOperationResult> {
    let successCount = 0;
    let failureCount = 0;
    const failures: Array<{ path: string; error: string }> = [];
    const successfulItems: Array<Types.FileInfo | Types.DirectoryInfo> = [];

    // Batch check if all source files exist in filesystem
    const sourceExistenceChecks = await Promise.all(
      input.sourcePaths.map(async sourcePath => {
        try {
          const absolutePath = this.getAbsolutePath(sourcePath);
          await fs.access(absolutePath);
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
    const sourceDirectories = [
      ...new Set(
        validSources.map(path => path.substring(0, path.lastIndexOf("/")))
      ),
    ];

    logger.info("💾 moveItems: About to batch load DB entities", {
      validSourcesCount: validSources.length,
      sourceDirectoriesCount: sourceDirectories.length,
    });

    const [dbFiles, dbDirectories, dbSourceDirs, dbDestDir] = await Promise.all(
      [
        StorageDbRepository.filesByPaths(validSources),
        StorageDbRepository.directoriesByPaths(validSources),
        StorageDbRepository.directoriesByPaths(sourceDirectories),
        StorageDbRepository.directoryByPath(input.destinationPath),
      ]
    );

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

        // Perform the move in filesystem
        const fileName = StorageUtils.extractFileName(sourcePath);
        const newPath = `${input.destinationPath.replace(/\/$/, "")}/${fileName}`;

        const sourceAbsolutePath = this.getAbsolutePath(sourcePath);
        const destAbsolutePath = this.getAbsolutePath(newPath);

        // Ensure destination directory exists
        await this.ensureDirectory(path.dirname(destAbsolutePath));

        // Move the file/directory
        await fs.rename(sourceAbsolutePath, destAbsolutePath);

        // Update DB records - check if it's a file or directory and update accordingly
        const dbFile = dbFileMap.get(sourcePath);
        const dbDirectory = dbDirectoryMap.get(sourcePath);

        if (dbFile) {
          // Update file entity path
          await StorageDbRepository.updateFile({
            id: dbFile.id,
            path: newPath,
            isProtected: dbFile.isProtected,
          });

          // Get the updated file info for successful items
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

          // Get the updated directory info for successful items
          const dirInfo = await this.directoryInfoByPath(newPath);
          if (dirInfo) {
            successfulItems.push(dirInfo);
          }
        } else {
          // No DB entity, get info from filesystem
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
        failureCount === 0
          ? "All items moved successfully"
          : `${successCount} items moved, ${failureCount} failed`,
      successCount,
      failureCount,
      failures,
      successfulItems,
    };
  }

  async copyItems(
    input: Types.StorageItemsCopyInput
  ): Promise<Types.BulkOperationResult> {
    let successCount = 0;
    let failureCount = 0;
    const failures: Array<{ path: string; error: string }> = [];
    const successfulItems: Array<Types.FileInfo | Types.DirectoryInfo> = [];

    // Batch check if all source files exist in filesystem
    const sourceExistenceChecks = await Promise.all(
      input.sourcePaths.map(async sourcePath => {
        try {
          const absolutePath = this.getAbsolutePath(sourcePath);
          await fs.access(absolutePath);
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
    const dbDestDir = await StorageDbRepository.directoryByPath(
      input.destinationPath
    );
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

        const sourceAbsolutePath = this.getAbsolutePath(sourcePath);
        const destAbsolutePath = this.getAbsolutePath(destPath);

        // Ensure destination directory exists
        await this.ensureDirectory(path.dirname(destAbsolutePath));

        // Check if source is a file or directory
        const stats = await fs.stat(sourceAbsolutePath);

        if (stats.isDirectory()) {
          // Recursively copy directory
          await this.copyDirectory(sourceAbsolutePath, destAbsolutePath);
        } else {
          // Copy file
          await fs.copyFile(sourceAbsolutePath, destAbsolutePath);
        }

        // Don't create DB entities as requested - just get file info from filesystem
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
        failureCount === 0
          ? "All items copied successfully"
          : `${successCount} items copied, ${failureCount} failed`,
      successCount,
      failureCount,
      failures,
      successfulItems,
    };
  }

  /**
   * Helper method to recursively copy a directory
   */
  private async copyDirectory(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true, mode: 0o755 });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  async deleteItems(
    input: Types.StorageItemsDeleteInput
  ): Promise<Types.BulkOperationResult> {
    let successCount = 0;
    let failureCount = 0;
    const failures: Array<{ path: string; error: string }> = [];
    const successfulItems: Array<Types.FileInfo | Types.DirectoryInfo> = [];

    // Batch load DB entities for all paths and their parent directories
    const parentDirectories = [
      ...new Set(
        input.paths.map(path => path.substring(0, path.lastIndexOf("/")))
      ),
    ];

    const [dbFiles, dbDirectories, dbParentDirs, usageChecks] =
      await Promise.all([
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
          const canDelete = isFile
            ? parentDir.allowDeleteFiles
            : parentDir.allowDelete;
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
        const folderEntity = fileEntity
          ? null
          : await this.directoryInfoByPath(itemPath);

        // Delete from filesystem
        const absolutePath = this.getAbsolutePath(itemPath);
        const stats = await fs.stat(absolutePath);

        if (stats.isDirectory()) {
          // Recursively delete directory
          await fs.rm(absolutePath, { recursive: true, force: true });
        } else {
          // Delete file
          await fs.unlink(absolutePath);
        }

        // Delete from database
        if (dbFile) {
          await StorageDbRepository.deleteFile(itemPath);
          if (fileEntity) {
            successfulItems.push(fileEntity);
          }
        } else if (dbDirectory) {
          await StorageDbRepository.deleteDirectory(itemPath);
          if (folderEntity) {
            successfulItems.push(folderEntity);
          }
        } else if (fileEntity) {
          // No DB entity, just add file to successful items
          successfulItems.push(fileEntity);
        } else if (folderEntity) {
          // No DB entity, just add folder to successful items
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
        failureCount === 0
          ? "All items deleted successfully"
          : `${successCount} items deleted, ${failureCount} failed`,
      successCount,
      failureCount,
      failures,
      successfulItems,
    };
  }
}

/**
 * Factory function to create local storage adapter
 * Includes serverless environment detection kill switch
 */
export async function createLocalAdapter(): Promise<StorageService> {
  // Serverless environment detection - KILL SWITCH
  const isServerless =
    !!process.env.VERCEL ||
    !!process.env.NETLIFY ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    !!process.env.K_SERVICE || // Google Cloud Run
    !!process.env.FUNCTION_TARGET || // Google Cloud Functions
    !!process.env.FUNCTIONS_WORKER_RUNTIME || // Azure Functions
    !!process.env.CF_PAGES || // Cloudflare Pages/Workers
    !!process.env.RAILWAY_ENVIRONMENT; // Railway

  if (isServerless) {
    const detectedEnvs = Object.keys(process.env).filter(k =>
      [
        "VERCEL",
        "NETLIFY",
        "AWS_LAMBDA_FUNCTION_NAME",
        "K_SERVICE",
        "FUNCTION_TARGET",
        "FUNCTIONS_WORKER_RUNTIME",
        "CF_PAGES",
        "RAILWAY_ENVIRONMENT",
      ].includes(k)
    );

    throw new Error(
      "FATAL: The 'local' storage provider is enabled in a serverless environment. " +
        "This is not supported and will lead to data loss. " +
        "Use a compatible cloud provider (e.g., 'gcp', 's3') in your environment configuration. " +
        `Detected environment: ${detectedEnvs.join(", ")}`
    );
  }

  // Ensure storage directory exists
  const storagePath = process.env.LOCAL_STORAGE_PATH || "./storage/";
  const fullPath = path.resolve(process.cwd(), storagePath);
  await fs.mkdir(fullPath, { recursive: true, mode: 0o755 });

  return new LocalAdapter();
}
