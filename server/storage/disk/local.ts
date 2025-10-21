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

const storagePath = process.env.LOCAL_STORAGE_PATH || "./cgvs/data/files/";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Local filesystem storage adapter
 * Stores files in a configurable directory with signed URL support via API routes
 */
class LocalAdapter implements StorageService {
  private readonly basePath: string;

  constructor() {
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
    throw new Error("Not implemented yet");
  }

  async uploadFile(
    filePath: string,
    contentType: Types.FileContentType,
    buffer: Buffer
  ): Promise<Types.FileUploadResult> {
    try {
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
      const directoryPath = filePath.substring(0, filePath.lastIndexOf("/"));
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
      } else {
        // Directory not in DB, check if it exists in filesystem
        if (directoryPath.length > 0) {
          try {
            const absoluteDirPath = this.getAbsolutePath(directoryPath);
            const dirStats = await fs.stat(absoluteDirPath);
            if (!dirStats.isDirectory()) {
              return {
                success: false,
                message: "Directory does not exist",
                data: null,
              };
            }
          } catch {
            return {
              success: false,
              message: "Directory does not exist",
              data: null,
            };
          }
        }
      }

      // Write file to disk
      const absolutePath = this.getAbsolutePath(filePath);
      await this.ensureDirectory(path.dirname(absolutePath));
      await fs.writeFile(absolutePath, buffer);

      // Create file entity in database
      const fileEntity = await StorageDbRepository.createFile(filePath, false);

      // Get file stats and create metadata
      const stats = await fs.stat(absolutePath);
      const md5Hash = await this.calculateMd5(absolutePath);

      const bucketFile: Types.BucketFile = {
        path: filePath,
        directoryPath,
        size: BigInt(stats.size),
        contentType: StorageUtils.contentTypeEnumToMimeType(contentType),
        md5Hash,
        createdAt: stats.birthtime,
        lastModified: stats.mtime,
        url: `${baseUrl}/api/storage/files/${filePath}`,
        mediaLink: undefined,
        fileType: StorageUtils.getFileTypeFromContentType(
          StorageUtils.contentTypeEnumToMimeType(contentType)
        ),
        isPublic: filePath.startsWith("public"),
      };

      const fileInfo = StorageUtils.combineFileData(bucketFile, fileEntity);

      return {
        success: true,
        message: "File uploaded successfully",
        data: fileInfo,
      };
    } catch (error) {
      logger.error(`Failed to upload file: ${filePath}`, error);
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
      const searchPath = input.path || "";
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
            url: `${baseUrl}/api/storage/files/${filePath}`,
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
      // Validate path
      const validationError = await StorageUtils.validatePath(input.path);
      if (validationError) {
        throw new StorageValidationError(validationError);
      }

      const fullPath = input.path;

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
          const directoryEntity =
            await StorageDbRepository.createDirectory(input);

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
        url: `${baseUrl}/api/storage/files/${newPath}`,
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
        url: `${baseUrl}/api/storage/files/${filePath}`,
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
        url: `${baseUrl}/api/storage/files/${dbFile.path}`,
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

  async storageStatistics(path?: string | null): Promise<Types.StorageStats> {
    throw new Error("Not implemented yet");
  }

  async fetchDirectoryChildren(
    searchPath?: string | null
  ): Promise<Types.DirectoryInfo[]> {
    try {
      // Default to "public" if empty
      const targetPath =
        !searchPath || searchPath.length === 0 ? "public" : searchPath;
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
    throw new Error("Not implemented yet");
  }

  async copyItems(
    input: Types.StorageItemsCopyInput
  ): Promise<Types.BulkOperationResult> {
    throw new Error("Not implemented yet");
  }

  async deleteItems(
    input: Types.StorageItemsDeleteInput
  ): Promise<Types.BulkOperationResult> {
    throw new Error("Not implemented yet");
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
  const fullPath = path.resolve(process.cwd(), storagePath);
  await fs.mkdir(fullPath, { recursive: true, mode: 0o755 });

  return new LocalAdapter();
}
