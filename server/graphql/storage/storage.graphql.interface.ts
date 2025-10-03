/**
 * Storage GraphQL Schema Interface
 * Defines the GraphQL queries and mutations for storage operations
 * Matches the Kotlin StorageQuery and StorageMutation classes
 */

import {
    FilesListInput,
    StorageObjectList,
    FileInfoServerType,
    DirectoryInfoServerType,
    StorageStats,
    FileUsageCheckInput,
    FileUsageResult,
    FileRenameInput,
    FileOperationResult,
    UploadSignedUrlGenerateInput,
    FolderCreateInput,
    StorageItemsMoveInput,
    BulkOperationResult,
    StorageItemsCopyInput,
    ItemsDeleteInput,
    DirectoryPermissionsUpdateInput,
    StorageItemProtectionUpdateInput
} from '../../storage/storage.types';

/**
 * Storage Query Interface
 * Matches StorageQuery.kt
 */
export interface StorageQueryOperations {
    /**
     * List files and folders with pagination and filtering
     */
    listFiles(input: FilesListInput): Promise<StorageObjectList>;

    /**
     * Get file information by path
     */
    fileInfo(path: string): Promise<FileInfoServerType | undefined>;

    /**
     * Get folder information by path
     */
    folderInfo(path: string): Promise<DirectoryInfoServerType>;

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
    directoryChildren(path?: string): Promise<DirectoryInfoServerType[]>;

    /**
     * Check if a file is currently in use
     */
    fileUsage(input: FileUsageCheckInput): Promise<FileUsageResult>;
}

/**
 * Storage Mutation Interface  
 * Matches StorageMutation.kt
 */
export interface StorageMutationOperations {
    /**
     * Rename a file
     */
    renameFile(input: FileRenameInput): Promise<FileOperationResult>;

    /**
     * Delete a single file
     */
    deleteFile(path: string): Promise<FileOperationResult>;

    /**
     * Generate a signed URL for file upload
     */
    generateUploadSignedUrl(input: UploadSignedUrlGenerateInput): Promise<string>;

    /**
     * Create a new folder
     */
    createFolder(input: FolderCreateInput): Promise<FileOperationResult>;

    /**
     * Move multiple files/folders to a new location
     */
    moveStorageItems(input: StorageItemsMoveInput): Promise<BulkOperationResult>;

    /**
     * Copy multiple files/folders to a new location
     */
    copyStorageItems(input: StorageItemsCopyInput): Promise<BulkOperationResult>;

    /**
     * Delete multiple files/folders
     */
    deleteStorageItems(input: ItemsDeleteInput): Promise<BulkOperationResult>;

    /**
     * Update directory permissions
     */
    updateDirectoryPermissions(input: DirectoryPermissionsUpdateInput): Promise<FileOperationResult>;

    /**
     * Set protection for files or directories
     */
    setStorageItemProtection(input: StorageItemProtectionUpdateInput): Promise<FileOperationResult>;
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