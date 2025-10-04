import {
    storageFiles,
    fileUsages,
    storageDirectories,
} from "@/server/db/schema/storage";

// Type aliases to match Kotlin entities
export type FileEntity = typeof storageFiles.$inferSelect;
export type FileEntityInput = typeof storageFiles.$inferInsert;

export type DirectoryEntity = typeof storageDirectories.$inferSelect;
export type DirectoryEntityInput = typeof storageDirectories.$inferInsert;

export type FileUsageEntity = typeof fileUsages.$inferSelect;
export type FileUsageEntityInput = typeof fileUsages.$inferInsert;

export interface DirectoryPermissionsServerType {
    allowUploads: boolean;
    allowDelete: boolean;
    allowMove: boolean;
    allowCreateSubDirs: boolean;
    allowDeleteFiles: boolean;
    allowMoveFiles: boolean;
}

export interface FileUsageInfoServerType {
    id: bigint;
    filePath: string;
    usageType: string;
    referenceId: bigint;
    referenceTable: string;
    created: Date;
}

// info from db, and storage service
export interface DirectoryInfoServerType {
    path: string;
    isProtected: boolean;
    permissions: DirectoryPermissionsServerType;
    protectChildren: boolean;
    created: Date;
    lastModified: Date;
    isFromBucket: boolean;
    fileCount: number;
    folderCount: number;
    totalSize: number;
    name: string;
}

export interface FileInfoServerType {
    path: string;
    isProtected: boolean;
    directoryPath: string;
    size: bigint;
    contentType?: string;
    md5Hash?: string;
    created: Date;
    lastModified: Date;
    isFromBucket: boolean;
    url: string;
    mediaLink?: string;
    fileType: FileTypeServerType;
    isPublic: boolean;
    isInUse: boolean;
    usages: FileUsageInfoServerType[];
    name: string;
}

export interface BucketFileServerType {
    path: string;
    directoryPath: string;
    size: bigint;
    contentType?: string;
    md5Hash?: string;
    created: Date;
    lastModified: Date;
    url: string;
    mediaLink?: string;
    fileType: FileTypeServerType;
    isPublic: boolean;
}

export interface BucketDirectoryServerType {
    path: string;
    created: Date;
    lastModified: Date;
    isPublic: boolean;
}

export enum FileTypeServerType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    DOCUMENT = "DOCUMENT",
    ARCHIVE = "ARCHIVE",
    OTHER = "OTHER",
}

export enum FileSortFieldServerType {
    NAME = "NAME",
    SIZE = "SIZE",
    TYPE = "TYPE",
    CREATED = "CREATED",
    MODIFIED = "MODIFIED",
}

export enum SortDirectionServerType {
    ASC = "ASC",
    DESC = "DESC",
}

export enum ContentTypeServerType {
    JPEG = "image/jpeg",
    PNG = "image/png",
    GIF = "image/gif",
    WEBP = "image/webp",
    PDF = "application/pdf",
    DOC = "application/msword",
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLS = "application/vnd.ms-excel",
    XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    TXT = "text/plain",
    ZIP = "application/zip",
    RAR = "application/vnd.rar",
    MP4 = "video/mp4",
    MP3 = "audio/mpeg",
    WAV = "audio/wav",
}

export enum UploadLocationPath {
    TEMPLATE_COVERS = "public/templateCover",
}

export type UploadLocationServerType = {
    path: UploadLocationPath;
    allowedContentTypes: ContentTypeServerType[];
};

export const UploadLocations: UploadLocationServerType[] = [
    {
        path: UploadLocationPath.TEMPLATE_COVERS,
        allowedContentTypes: [
            ContentTypeServerType.JPEG,
            ContentTypeServerType.PNG,
            ContentTypeServerType.WEBP,
        ],
    },
];

// Input types
export interface FolderCreateInput {
    path: string;
    permissions?: DirectoryPermissionsServerType;
    protected?: boolean;
    protectChildren?: boolean;
}

export interface DirectoryPermissionsUpdateInput {
    path: string;
    permissions: DirectoryPermissionsServerType;
}

export interface StorageItemProtectionUpdateInput {
    path: string;
    isProtected: boolean;
    protectChildren?: boolean;
}

export interface StorageItemsMoveInput {
    sourcePaths: string[];
    destinationPath: string;
}

export interface StorageItemsCopyInput {
    sourcePaths: string[];
    destinationPath: string;
}

export interface ItemsDeleteInput {
    paths: string[];
    force?: boolean;
}

export interface FileUsageCheckInput {
    filePath: string;
}

export interface FileUsageRegisterInput {
    filePath: string;
    usageType: string;
    referenceId: bigint;
    referenceTable: string;
}

export interface FileRenameInput {
    currentPath: string;
    newName: string;
}

export interface FilesListInput {
    path?: string;
    limit?: number;
    offset?: number;
    searchTerm?: string;
    fileType?: string;
    sortBy?: FileSortFieldServerType;
    sortDirection?: SortDirectionServerType;
}

export interface UploadSignedUrlGenerateInput {
    path: string;
    contentType: ContentTypeServerType;
    fileSize: number;
    contentMd5: string;
}

// Result types
export interface FileOperationResult {
    success: boolean;
    message: string;
    data?: FileInfoServerType | DirectoryInfoServerType | null;
}

export interface FileUsageResult {
    isInUse: boolean;
    usages: FileUsageInfoServerType[];
    canDelete: boolean;
    deleteBlockReason?: string;
}

export interface BulkOperationResult {
    success: boolean;
    message: string;
    successCount: number;
    failureCount: number;
    failures: Array<{ path: string; error: string }>;
}

export interface FileUploadResult {
    success: boolean;
    message: string;
    data?: FileInfoServerType | null;
}

export interface StorageStats {
    totalFiles: number;
    totalSize: bigint;
    fileTypeBreakdown: Array<{
        type: FileTypeServerType;
        count: number;
        size: bigint;
    }>;
    directoryCount: number;
}

export interface StorageObjectList {
    items: Array<FileInfoServerType | DirectoryInfoServerType>;
    totalCount: number;
    hasMore: boolean;
    offset: number;
    limit: number;
}

export interface StorageObject {
    path: string;
    name: string;
    isProtected: boolean;
}

export type BlobMetadata = {
    name?: string;
    size?: number | string;
    contentType?: string;
    timeCreated?: string;
    updated?: string;
    mediaLink?: string;
    md5Hash?: string;
};
