// Storage Types and Interfaces

export interface DirectoryPermissions {
    allowUploads: boolean;
    allowDelete: boolean;
    allowMove: boolean;
    allowCreateSubDirs: boolean;
    allowDeleteFiles: boolean;
    allowMoveFiles: boolean;
}

export interface FileUsageInfo {
    id: bigint;
    filePath: string;
    usageType: string;
    referenceId: bigint;
    referenceTable: string;
    created: Date;
}

export interface DirectoryInfo {
    path: string;
    isProtected: boolean;
    permissions: DirectoryPermissions;
    protectChildren: boolean;
    created: Date;
    lastModified: Date;
    isFromBucket: boolean;
    fileCount: number;
    folderCount: number;
    totalSize: number;
    name: string;
}

export interface FileInfo {
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
    fileType: FileType;
    isPublic: boolean;
    isInUse: boolean;
    usages: FileUsageInfo[];
    name: string;
}

export interface BucketFile {
    path: string;
    directoryPath: string;
    size: bigint;
    contentType?: string;
    md5Hash?: string;
    created: Date;
    lastModified: Date;
    url: string;
    mediaLink?: string;
    fileType: FileType;
    isPublic: boolean;
}

export interface BucketDirectory {
    path: string;
    created: Date;
    lastModified: Date;
    isPublic: boolean;
}

export enum FileType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO", 
    AUDIO = "AUDIO",
    DOCUMENT = "DOCUMENT",
    ARCHIVE = "ARCHIVE",
    OTHER = "OTHER"
}

export enum FileSortField {
    NAME = "NAME",
    SIZE = "SIZE",
    TYPE = "TYPE",
    CREATED = "CREATED",
    MODIFIED = "MODIFIED"
}

export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export enum ContentType {
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
    WAV = "audio/wav"
}

export enum UploadLocation {
    PUBLIC = "public",
    TEMPLATE_COVERS = "public/templateCover",
    CERTIFICATES = "public/certificates",
    PROFILE_PICTURES = "public/profiles"
}

// Input types
export interface CreateFolderInput {
    path: string;
    permissions?: DirectoryPermissions;
    protected?: boolean;
    protectChildren?: boolean;
}

export interface UpdateDirectoryPermissionsInput {
    path: string;
    permissions: DirectoryPermissions;
}

export interface SetStorageItemProtectionInput {
    path: string;
    isProtected: boolean;
    protectChildren?: boolean;
}

export interface MoveStorageItemsInput {
    sourcePaths: string[];
    destinationPath: string;
}

export interface CopyStorageItemsInput {
    sourcePaths: string[];
    destinationPath: string;
}

export interface DeleteItemsInput {
    paths: string[];
    force?: boolean;
}

export interface CheckFileUsageInput {
    filePath: string;
}

export interface RegisterFileUsageInput {
    filePath: string;
    usageType: string;
    referenceId: bigint;
    referenceTable: string;
}

export interface RenameFileInput {
    currentPath: string;
    newName: string;
}

export interface ListFilesInput {
    path?: string;
    limit?: number;
    offset?: number;
    searchTerm?: string;
    fileType?: string;
    sortBy?: FileSortField;
    sortDirection?: SortDirection;
}

export interface GenerateUploadSignedUrlInput {
    fileName: string;
    contentType: ContentType;
    location: UploadLocation;
}

// Result types
export interface FileOperationResult {
    success: boolean;
    message: string;
    data?: FileInfo | DirectoryInfo | null;
}

export interface FileUsageResult {
    isInUse: boolean;
    usages: FileUsageInfo[];
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
    data?: FileInfo | null;
}

export interface StorageStats {
    totalFiles: number;
    totalSize: bigint;
    fileTypeBreakdown: Array<{ type: FileType; count: number; size: bigint }>;
    directoryCount: number;
}

export interface StorageObjectList {
    items: Array<FileInfo | DirectoryInfo>;
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