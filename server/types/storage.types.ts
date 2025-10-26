import {
  storageFiles,
  fileUsages,
  storageDirectories,
} from "@/server/db/schema/storage";
import { OrderSortDirection } from "@/lib/enum";

// Type aliases to match Kotlin entities
export type FileEntity = typeof storageFiles.$inferSelect;
export type FileEntityInput = typeof storageFiles.$inferInsert;

export type DirectoryEntity = typeof storageDirectories.$inferSelect;
export type DirectoryEntityInput = typeof storageDirectories.$inferInsert;

export type FileUsageEntity = typeof fileUsages.$inferSelect;
export type FileUsageEntityInput = typeof fileUsages.$inferInsert;

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
  createdAt: Date;
}

// info from db, and storage service

export type StorageObject = {
  path: string;
  name: string;
  isProtected: boolean;
};

export type BucketDirectory = {
  path: string;
  createdAt: Date;
  lastModified: Date;
  isPublic: boolean;
};

export type DirectoryInfo = StorageObject &
  Omit<DirectoryEntity, keyof DirectoryPermissions | "id"> &
  BucketDirectory & {
    path: string;
    name: string;
    isProtected: boolean;
    dbId?: bigint | null;
    permissions: DirectoryPermissions;
    protectChildren: boolean;
    isFromBucket: boolean;
    fileCount: number;
    folderCount: number;
    totalSize: number;
  };

export type BucketFile = {
  path: string;
  directoryPath: string;
  size: bigint;
  contentType?: string;
  md5Hash?: string;
  createdAt: Date;
  lastModified: Date;
  url: string;
  mediaLink?: string;
  fileType: FileTypes;
  isPublic: boolean;
};

export type FileInfo = Omit<FileEntity, "id"> &
  BucketFile &
  StorageObject & {
    path: string;
    name: string;
    isProtected: boolean;
    dbId?: bigint | null;
    isFromBucket: boolean;
    isInUse: boolean;
    usages: FileUsageInfo[];
  };

export type StorageObjectList = {
  items: Array<FileInfo | DirectoryInfo>;
  totalCount: number;
  hasMore: boolean;
  offset: number;
  limit: number;
};

export enum FileTypes {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
  ARCHIVE = "ARCHIVE",
  OTHER = "OTHER",
}

export enum FileSortField {
  NAME = "NAME",
  SIZE = "SIZE",
  TYPE = "TYPE",
  CREATED = "CREATED",
  MODIFIED = "MODIFIED",
}

export enum FileContentType {
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

// Input types
export interface FolderCreateInput {
  path: string;
  permissions?: DirectoryPermissions | null;
  protected?: boolean | null;
  protectChildren?: boolean | null;
}

export interface DirectoryPermissionsUpdateInput {
  path: string;
  permissions: DirectoryPermissions;
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

export interface FilesListSearchInput {
  path: string;
  limit?: number | null;
  offset?: number | null;
  searchTerm?: string | null;
  fileType?: string | null;
  sortBy?: FileSortField | null;
  sortDirection?: OrderSortDirection | null;
}

export interface UploadSignedUrlGenerateInput {
  path: string;
  contentType: FileContentType;
  fileSize: number;
  contentMd5: string;
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
  successfulItems: Array<FileInfo | DirectoryInfo>;
}

export interface FileUploadResult {
  success: boolean;
  message: string;
  data?: FileInfo | null;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: bigint;
  fileTypeBreakdown: Array<{
    type: FileTypes;
    count: number;
    size: bigint;
  }>;
  directoryCount: number;
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
