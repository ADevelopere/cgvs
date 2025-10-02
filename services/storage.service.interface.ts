import { Storage } from '@google-cloud/storage';
import { GcsConfig } from '../config/gcs.config';
import { StorageDbService } from './storage-db.service';
import {
    BucketFile,
    BucketDirectory,
    FileInfo,
    DirectoryInfo,
    ContentType,
    UploadLocation,
    FileUploadResult,
    ListFilesInput,
    StorageObjectList,
    CreateFolderInput,
    FileOperationResult,
    RenameFileInput,
    StorageStats,
    MoveStorageItemsInput,
    BulkOperationResult,
    CopyStorageItemsInput,
    DeleteItemsInput,
    GenerateUploadSignedUrlInput
} from './storage.types';

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
    generateUploadSignedUrl(input: GenerateUploadSignedUrlInput): Promise<string>;

    /**
     * Upload a file to cloud storage
     */
    uploadFile(
        path: string,
        buffer: Buffer,
        contentType?: ContentType,
        originalFilename?: string,
        location?: UploadLocation
    ): Promise<FileUploadResult>;

    /**
     * List files and directories with pagination and filtering
     */
    listFiles(input: ListFilesInput): Promise<StorageObjectList>;

    /**
     * Create a folder in cloud storage
     */
    createFolder(input: CreateFolderInput): Promise<FileOperationResult>;

    /**
     * Rename a file or folder
     */
    renameFile(input: RenameFileInput): Promise<FileOperationResult>;

    /**
     * Delete a single file
     */
    deleteFile(path: string): Promise<FileOperationResult>;

    /**
     * Get directory information by path
     */
    directoryInfoByPath(path: string): Promise<DirectoryInfo>;

    /**
     * Get file information by path
     */
    fileInfoByPath(path: string): Promise<FileInfo | undefined>;

    /**
     * Get file information by database file ID
     */
    fileInfoByDbFileId(id: bigint): Promise<FileInfo | undefined>;

    /**
     * Get storage statistics
     */
    storageStatistics(path?: string): Promise<StorageStats>;

    /**
     * Fetch immediate directory children for lazy loading
     */
    fetchDirectoryChildren(path?: string): Promise<DirectoryInfo[]>;

    /**
     * Move multiple files/folders
     */
    moveItems(input: MoveStorageItemsInput): Promise<BulkOperationResult>;

    /**
     * Copy multiple files/folders
     */
    copyItems(input: CopyStorageItemsInput): Promise<BulkOperationResult>;

    /**
     * Delete multiple items
     */
    deleteItems(input: DeleteItemsInput): Promise<BulkOperationResult>;

    // Helper methods for internal use
    blobToFileInfo(blob: any): BucketFile;
    blobToDirectoryInfo(blob: any): BucketDirectory;
    combineFileData(bucketFile: BucketFile, dbEntity?: any): FileInfo;
    combineDirectoryData(bucketDir: BucketDirectory, dbEntity?: any): DirectoryInfo;
}

/**
 * Factory function to create StorageService instance
 * Matches the Kotlin storageService factory function
 */
export declare function createStorageService(
    storage: Storage,
    gcsConfig: GcsConfig,
    storageDbService: StorageDbService
): StorageService;

/**
 * Configuration constants matching Kotlin companion object
 */
export const STORAGE_CONFIG = {
    SIGNED_URL_DURATION: 15, // minutes
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    DEFAULT_CONTENT_TYPE: 'application/octet-stream'
} as const;

/**
 * Helper functions for file type detection and validation
 */
export interface StorageUtils {
    getFileTypeFromContentType(contentType?: string): string;
    validatePath(path: string): string | null;
    validateFileType(contentType: ContentType, location: UploadLocation): string | null;
    extractDirectoryPath(filePath: string): string;
    extractFileName(filePath: string): string;
    sanitizePath(path: string): string;
}

/**
 * Error classes for storage operations
 */
export class StorageError extends Error {
    constructor(message: string, public readonly code?: string) {
        super(message);
        this.name = 'StorageError';
    }
}

export class StorageValidationError extends StorageError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'StorageValidationError';
    }
}

export class StorageNotFoundError extends StorageError {
    constructor(path: string) {
        super(`File or directory not found: ${path}`, 'NOT_FOUND');
        this.name = 'StorageNotFoundError';
    }
}

export class StoragePermissionError extends StorageError {
    constructor(message: string) {
        super(message, 'PERMISSION_DENIED');
        this.name = 'StoragePermissionError';
    }
}