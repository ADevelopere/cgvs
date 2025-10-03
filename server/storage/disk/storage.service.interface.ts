import * as StorageTypes from "../storage.types";

type StorageProvider = "gcp";

/**
 * Storage Service Interface
 * Handles cloud storage operations (GCP Cloud Storage) and integrates with database
 * Matches the Kotlin StorageService interface
 */
export interface StorageService {
    /**
     * Check if a file exists in cloud storage
     */
    fileExists(path: string): Promise<boolean>;

    /**
     * Generate a signed URL for file upload
     */
    generateUploadSignedUrl(
        input: StorageTypes.UploadSignedUrlGenerateInput,
    ): Promise<string>;

    /**
     * Upload a file to cloud storage
     */
    uploadFile(
        path: string,
        buffer: Buffer,
        contentType?: StorageTypes.ContentTypeServerType,
        originalFilename?: string,
        location?: StorageTypes.UploadLocationServerType,
    ): Promise<StorageTypes.FileUploadResult>;

    /**
     * List files and directories with pagination and filtering
     */
    listFiles(
        input: StorageTypes.FilesListInput,
    ): Promise<StorageTypes.StorageObjectList>;

    /**
     * Create a folder in cloud storage
     */
    createFolder(
        input: StorageTypes.FolderCreateInput,
    ): Promise<StorageTypes.FileOperationResult>;

    /**
     * Rename a file or folder
     */
    renameFile(
        input: StorageTypes.FileRenameInput,
    ): Promise<StorageTypes.FileOperationResult>;

    /**
     * Delete a single file
     */
    deleteFile(path: string): Promise<StorageTypes.FileOperationResult>;

    /**
     * Get directory information by path
     */
    directoryInfoByPath(
        path: string,
    ): Promise<StorageTypes.DirectoryInfoServerType>;

    /**
     * Get file information by path
     */
    fileInfoByPath(
        path: string,
    ): Promise<StorageTypes.FileInfoServerType | undefined>;

    /**
     * Get file information by database file ID
     */
    fileInfoByDbFileId(
        id: bigint,
    ): Promise<StorageTypes.FileInfoServerType | undefined>;

    /**
     * Get storage statistics
     */
    storageStatistics(path?: string): Promise<StorageTypes.StorageStats>;

    /**
     * Fetch immediate directory children for lazy loading
     */
    fetchDirectoryChildren(
        path?: string,
    ): Promise<StorageTypes.DirectoryInfoServerType[]>;

    /**
     * Move multiple files/folders
     */
    moveItems(
        input: StorageTypes.StorageItemsMoveInput,
    ): Promise<StorageTypes.BulkOperationResult>;

    /**
     * Copy multiple files/folders
     */
    copyItems(
        input: StorageTypes.StorageItemsCopyInput,
    ): Promise<StorageTypes.BulkOperationResult>;

    /**
     * Delete multiple items
     */
    deleteItems(
        input: StorageTypes.ItemsDeleteInput,
    ): Promise<StorageTypes.BulkOperationResult>;

    // Helper methods for internal use
    blobToFileInfo(blob: unknown): StorageTypes.BucketFileServerType;
    blobToDirectoryInfo(blob: unknown): StorageTypes.BucketDirectoryServerType;
    combineFileData(
        bucketFile: StorageTypes.BucketFileServerType,
        dbEntity?: unknown,
    ): StorageTypes.FileInfoServerType;
    combineDirectoryData(
        bucketDir: StorageTypes.BucketDirectoryServerType,
        dbEntity?: unknown,
    ): StorageTypes.DirectoryInfoServerType;
}

/**
 * Factory function to create StorageService instance
 * Matches the Kotlin storageService factory function
 */
export declare function createStorageService(
    provider: StorageProvider,
): StorageService;

/**
 * Configuration constants matching Kotlin companion object
 */
export const STORAGE_CONFIG = {
    SIGNED_URL_DURATION: 15, // minutes
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    DEFAULT_CONTENT_TYPE: "application/octet-stream",
} as const;

/**
 * Helper functions for file type detection and validation
 */
export interface StorageUtils {
    getFileTypeFromContentType(contentType?: string): string;
    validatePath(path: string): string | null;
    validateFileType(
        contentType: StorageTypes.ContentTypeServerType,
        location: StorageTypes.UploadLocationServerType,
    ): string | null;
    extractDirectoryPath(filePath: string): string;
    extractFileName(filePath: string): string;
    sanitizePath(path: string): string;
}

/**
 * Error classes for storage operations
 */
export class StorageError extends Error {
    constructor(
        message: string,
        public readonly code?: string,
    ) {
        super(message);
        this.name = "StorageError";
    }
}

export class StorageValidationError extends StorageError {
    constructor(message: string) {
        super(message, "VALIDATION_ERROR");
        this.name = "StorageValidationError";
    }
}

export class StorageNotFoundError extends StorageError {
    constructor(path: string) {
        super(`File or directory not found: ${path}`, "NOT_FOUND");
        this.name = "StorageNotFoundError";
    }
}

export class StoragePermissionError extends StorageError {
    constructor(message: string) {
        super(message, "PERMISSION_DENIED");
        this.name = "StoragePermissionError";
    }
}
