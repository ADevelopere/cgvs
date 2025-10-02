/**
 * Storage GraphQL Schema Interface
 * Defines the GraphQL queries and mutations for storage operations
 * Matches the Kotlin StorageQuery and StorageMutation classes
 */

import {
    ListFilesInput,
    StorageObjectList,
    FileInfo,
    DirectoryInfo,
    StorageStats,
    CheckFileUsageInput,
    FileUsageResult,
    RenameFileInput,
    FileOperationResult,
    GenerateUploadSignedUrlInput,
    CreateFolderInput,
    MoveStorageItemsInput,
    BulkOperationResult,
    CopyStorageItemsInput,
    DeleteItemsInput,
    UpdateDirectoryPermissionsInput,
    SetStorageItemProtectionInput
} from './storage.types';

/**
 * Storage Query Interface
 * Matches StorageQuery.kt
 */
export interface StorageQueryOperations {
    /**
     * List files and folders with pagination and filtering
     */
    listFiles(input: ListFilesInput): Promise<StorageObjectList>;

    /**
     * Get file information by path
     */
    fileInfo(path: string): Promise<FileInfo | undefined>;

    /**
     * Get folder information by path
     */
    folderInfo(path: string): Promise<DirectoryInfo>;

    /**
     * Search files with filters
     */
    searchFiles(
        searchTerm: string,
        fileType?: string,
        folder?: string,
        limit?: number
    ): Promise<StorageObjectList>;

    /**
     * Get storage statistics
     */
    storageStats(path?: string): Promise<StorageStats>;

    /**
     * Fetch immediate children directories for lazy loading directory tree
     */
    directoryChildren(path?: string): Promise<DirectoryInfo[]>;

    /**
     * Check if a file is currently in use
     */
    fileUsage(input: CheckFileUsageInput): Promise<FileUsageResult>;
}

/**
 * Storage Mutation Interface  
 * Matches StorageMutation.kt
 */
export interface StorageMutationOperations {
    /**
     * Rename a file
     */
    renameFile(input: RenameFileInput): Promise<FileOperationResult>;

    /**
     * Delete a single file
     */
    deleteFile(path: string): Promise<FileOperationResult>;

    /**
     * Generate a signed URL for file upload
     */
    generateUploadSignedUrl(input: GenerateUploadSignedUrlInput): Promise<string>;

    /**
     * Create a new folder
     */
    createFolder(input: CreateFolderInput): Promise<FileOperationResult>;

    /**
     * Move multiple files/folders to a new location
     */
    moveStorageItems(input: MoveStorageItemsInput): Promise<BulkOperationResult>;

    /**
     * Copy multiple files/folders to a new location
     */
    copyStorageItems(input: CopyStorageItemsInput): Promise<BulkOperationResult>;

    /**
     * Delete multiple files/folders
     */
    deleteStorageItems(input: DeleteItemsInput): Promise<BulkOperationResult>;

    /**
     * Update directory permissions
     */
    updateDirectoryPermissions(input: UpdateDirectoryPermissionsInput): Promise<FileOperationResult>;

    /**
     * Set protection for files or directories
     */
    setStorageItemProtection(input: SetStorageItemProtectionInput): Promise<FileOperationResult>;
}

/**
 * Combined Storage Operations Interface
 */
export interface StorageOperations extends StorageQueryOperations, StorageMutationOperations {}

/**
 * GraphQL Schema Definition Interface
 * This will be implemented in the actual GraphQL schema file
 */
export interface StorageGraphQLSchema {
    /**
     * Register all storage-related GraphQL types
     */
    registerTypes(): void;

    /**
     * Register all storage query fields
     */
    registerQueries(): void;

    /**
     * Register all storage mutation fields
     */
    registerMutations(): void;
}