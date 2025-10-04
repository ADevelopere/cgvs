import {
    storageFiles,
    fileUsages,
    storageDirectories,
} from "@/server/db/schema/storage";
import { SortDirectionServerType } from "../graphql/base/sort.pothos";

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

export enum ContentTypeServerType {
    JPEG = "JPEG",
    PNG = "PNG",
    GIF = "GIF",
    WEBP = "WEBP",
    PDF = "PDF",
    DOC = "DOC",
    DOCX = "DOCX",
    XLS = "XLS",
    XLSX = "XLSX",
    TXT = "TXT",
    ZIP = "ZIP",
    RAR = "RAR",
    MP4 = "MP4",
    MP3 = "MP3",
    WAV = "WAV",
}

export enum UploadLocationPath {
    TEMPLATE_COVERS = "TEMPLATE_COVERS",
}

export type UploadLocationServerType = {
    path: UploadLocationPath;
    allowedContentTypes: ContentTypeServerType[];
    actualPath: string; // The actual file system path
};

export const UploadLocations: UploadLocationServerType[] = [
    {
        path: UploadLocationPath.TEMPLATE_COVERS,
        actualPath: "public/templateCover",
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
    permissions?: DirectoryPermissionsServerType | null;
    protected?: boolean | null;
    protectChildren?: boolean | null;
}

export interface DirectoryPermissionsUpdateInput {
    path: string;
    permissions: DirectoryPermissionsServerType;
}

export interface StorageItemProtectionUpdateInput {
    path: string;
    isProtected: boolean;
    protectChildren?: boolean | null;
}

export interface StorageItemsMoveInput {
    sourcePaths: string[];
    destinationPath: string;
}

export interface StorageItemsCopyInput {
    sourcePaths: string[];
    destinationPath: string;
}

export interface StorageItemsDeleteInput {
    paths: string[];
    force?: boolean | null;
}

export interface FileUsageCheckInput {
    path: string;
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
    path: string;
    limit?: number | null;
    offset?: number | null;
    searchTerm?: string | null;
    fileType?: string | null;
    sortBy?: FileSortFieldServerType | null;
    sortDirection?: SortDirectionServerType | null;
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
    successfulItems: Array<FileInfoServerType | DirectoryInfoServerType>;
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
