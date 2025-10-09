import * as StorageTypes from "../../types/storage.types";

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
        contentType: StorageTypes.FileContentType,
        buffer: Buffer,
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
    ): Promise<StorageTypes.DirectoryInfo | null>;

    /**
     * Get file information by path
     */
    fileInfoByPath(
        path: string,
    ): Promise<StorageTypes.FileInfo | null>;

    /**
     * Get file information by database file ID
     */
    fileInfoByDbFileId(
        id: bigint,
    ): Promise<StorageTypes.FileInfo | null>;

    /**
     * Get storage statistics
     */
    storageStatistics(path?: string | null): Promise<StorageTypes.StorageStats>;

    /**
     * Fetch immediate directory children for lazy loading
     */
    fetchDirectoryChildren(
        path?: string | null,
    ): Promise<StorageTypes.DirectoryInfo[]>;

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
        input: StorageTypes.StorageItemsDeleteInput,
    ): Promise<StorageTypes.BulkOperationResult>;
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
        contentType: StorageTypes.FileContentType,
        location: StorageTypes.UploadLocation,
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
