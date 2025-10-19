import { STORAGE_CONFIG } from "../storage/disk/storage.service.interface";
import * as Types from "@/server/types";
import { OrderSortDirection } from "@/lib/enum";

export namespace StorageUtils {
  // Mapping functions for GraphQL enums to actual values
  export const CONTENT_TYPE_MAP: Record<Types.FileContentType, string> = {
    [Types.FileContentType.JPEG]: "image/jpeg",
    [Types.FileContentType.PNG]: "image/png",
    [Types.FileContentType.GIF]: "image/gif",
    [Types.FileContentType.WEBP]: "image/webp",
    [Types.FileContentType.PDF]: "application/pdf",
    [Types.FileContentType.DOC]: "application/msword",
    [Types.FileContentType.DOCX]:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    [Types.FileContentType.XLS]: "application/vnd.ms-excel",
    [Types.FileContentType.XLSX]:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    [Types.FileContentType.TXT]: "text/plain",
    [Types.FileContentType.ZIP]: "application/zip",
    [Types.FileContentType.RAR]: "application/vnd.rar",
    [Types.FileContentType.MP4]: "video/mp4",
    [Types.FileContentType.MP3]: "audio/mpeg",
    [Types.FileContentType.WAV]: "audio/wav",
  };

  export const UPLOAD_LOCATION_MAP: Record<Types.UploadLocationPath, string> = {
    [Types.UploadLocationPath.TEMPLATE_COVERS]: "public/templateCover",
  };

  // Reverse mapping for content types
  export const REVERSE_CONTENT_TYPE_MAP: Record<string, Types.FileContentType> =
    Object.entries(CONTENT_TYPE_MAP).reduce(
      (acc, [key, value]) => {
        acc[value] = key as Types.FileContentType;
        return acc;
      },
      {} as Record<string, Types.FileContentType>
    );

  export const contentTypeEnumToMimeType = (
    enumValue: Types.FileContentType
  ): string => {
    return CONTENT_TYPE_MAP[enumValue];
  };

  export const mimeTypeToContentTypeEnum = (
    mimeType: string
  ): Types.FileContentType | null => {
    return REVERSE_CONTENT_TYPE_MAP[mimeType] || null;
  };

  export const uploadLocationEnumToPath = (
    enumValue: Types.UploadLocationPath
  ): string => {
    return UPLOAD_LOCATION_MAP[enumValue];
  };

  const PATH_PATTERN = /^[a-zA-Z0-9._/\- ()]+$/;
  export const validatePath = (path: string): Promise<string | null> => {
    let err: string | null = null;
    if (!path || path.trim().length === 0) {
      err = "Path cannot be empty";
    }
    if (path.includes("..") || path.includes("//")) {
      err = "Path contains invalid directory traversal patterns";
    }
    if (!PATH_PATTERN.test(path)) {
      err = "Path contains invalid characters";
    }
    if (path.length > 1024) {
      err = "Path is too long (max 1024 characters)";
    }
    return Promise.resolve(err);
  };

  const FILE_NAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
  export const validateFileName = (
    fileName: string
  ): Promise<string | null> => {
    let err: string | null = null;
    if (!fileName || fileName.trim().length === 0) {
      err = "File name cannot be empty";
    }
    if (!FILE_NAME_PATTERN.test(fileName)) {
      err = "File name contains invalid characters";
    }
    if (fileName.length > 255) {
      err = "File name is too long (max 255 characters)";
    }
    return Promise.resolve(err);
  };

  export const validateFileType = (
    contentType: Types.FileContentType,
    location: Types.UploadLocation
  ): Promise<string | null> => {
    let err: string | null = null;
    if (contentType == null) {
      err = "Content type is required";
    }

    if (
      !location.allowedContentTypes.some(allowed => allowed === contentType)
    ) {
      err = `File type not allowed for this location: ${contentType}`;
    }

    return Promise.resolve(err);
  };

  export const validateFileSize = (size: number): Promise<string | null> => {
    let err: string | null = null;
    if (size > STORAGE_CONFIG.MAX_FILE_SIZE) {
      err = `File size exceeds maximum allowed size (${STORAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)`;
    }
    return Promise.resolve(err);
  };

  export const validateUpload = async (
    path: string,
    size: number
  ): Promise<string | null> => {
    let error: string | null = null;
    if (!path.startsWith("public/")) {
      error = "Upload signed URLs can only be generated for public paths";
    }

    const fileName = path.slice(path.lastIndexOf("/") + 1);
    validateFileName(fileName).then(err => {
      if (err) error = err;
    });

    validatePath(path).then(err => {
      if (err) error = err;
    });

    validateFileSize(size).then(err => {
      if (err) error = err;
    });
    return Promise.resolve(error);
  };

  export const getFileTypeFromContentType = (
    contentType?: string
  ): Types.FileTypes => {
    if (!contentType) return Types.FileTypes.OTHER;

    if (contentType.startsWith("image/")) return Types.FileTypes.IMAGE;
    if (contentType.startsWith("video/")) return Types.FileTypes.VIDEO;
    if (contentType.startsWith("audio/")) return Types.FileTypes.AUDIO;
    if (
      contentType.includes("pdf") ||
      contentType.includes("document") ||
      contentType.includes("text")
    )
      return Types.FileTypes.DOCUMENT;
    if (contentType.includes("zip") || contentType.includes("rar"))
      return Types.FileTypes.ARCHIVE;

    return Types.FileTypes.OTHER;
  };

  export const extractDirectoryPath = (filePath: string): string => {
    const lastSlashIndex = filePath.lastIndexOf("/");
    return lastSlashIndex > 0 ? filePath.substring(0, lastSlashIndex) : "";
  };

  export const extractFileName = (filePath: string): string => {
    const lastSlashIndex = filePath.lastIndexOf("/");
    return lastSlashIndex >= 0
      ? filePath.substring(lastSlashIndex + 1)
      : filePath;
  };

  export const sanitizePath = (path: string): string => {
    return path.replace(/\/+/g, "/").replace(/(?:^\/|\/(?=$))/g, "");
  };

  export const blobToFileInfo = (
    blob: Types.BlobMetadata,
    baseUrl: string
  ): Types.BucketFile => {
    const path = blob.name || "";
    const size = BigInt(blob.size || 0);
    const contentType = blob.contentType;
    const createdAt = blob.timeCreated
      ? new Date(blob.timeCreated)
      : new Date();
    const lastModified = blob.updated ? new Date(blob.updated) : new Date();
    const url = `${baseUrl}${path}`;
    const mediaLink = blob.mediaLink;
    const fileType = getFileTypeFromContentType(contentType);
    const isPublic = path.startsWith("public");

    return {
      path,
      directoryPath: extractDirectoryPath(path),
      size,
      contentType,
      md5Hash: blob.md5Hash,
      createdAt,
      lastModified,
      url,
      mediaLink,
      fileType,
      isPublic,
    };
  };

  export const blobToDirectoryInfo = (
    blob: Types.BlobMetadata
  ): Types.BucketDirectory => {
    const path = (blob.name || "").replace(/\/$/, "");
    const createdAt = blob.timeCreated
      ? new Date(blob.timeCreated)
      : new Date();
    const lastModified = blob.updated ? new Date(blob.updated) : new Date();
    const isPublic = path.startsWith("public");

    return {
      path,
      createdAt,
      lastModified,
      isPublic,
    };
  };

  export const combineDirectoryData = (
    bucketDir: Types.BucketDirectory,
    dbEntity?: Types.DirectoryEntity | null,
    fileCount: number = 0
  ): Types.DirectoryInfo => {
    const permissions: Types.DirectoryPermissions = dbEntity
      ? {
          allowUploads: dbEntity.allowUploads,
          allowDelete: dbEntity.allowDelete,
          allowMove: dbEntity.allowMove,
          allowCreateSubDirs: dbEntity.allowCreateSubDirs,
          allowDeleteFiles: dbEntity.allowDeleteFiles,
          allowMoveFiles: dbEntity.allowMoveFiles,
        }
      : {
          allowUploads: true,
          allowDelete: true,
          allowMove: true,
          allowCreateSubDirs: true,
          allowDeleteFiles: true,
          allowMoveFiles: true,
        };

    const result: Types.DirectoryInfo = {
      dbId: dbEntity?.id,
      path: bucketDir.path,
      name: extractFileName(bucketDir.path),
      isProtected: dbEntity?.isProtected || false,
      permissions: permissions,
      protectChildren: dbEntity?.protectChildren || false,
      createdAt: bucketDir.createdAt,
      lastModified: bucketDir.lastModified,
      fileCount: fileCount,
      isFromBucket: true,
      isPublic: bucketDir.isPublic,
      // todo: implement following
      folderCount: 0,
      totalSize: 0,
    };
    return result;
  };

  export const combineFileData = (
    bucketFile: Types.BucketFile,
    dbEntity?: Types.FileEntity
  ): Types.FileInfo => {
    const usages: Types.FileUsageInfo[] = [];
    const isProtected = dbEntity?.isProtected || false;

    const result: Types.FileInfo = {
      dbId: dbEntity?.id,
      path: bucketFile.path,
      name: extractFileName(bucketFile.path),
      isProtected,
      directoryPath: bucketFile.directoryPath,
      size: bucketFile.size,
      contentType: bucketFile.contentType,
      md5Hash: bucketFile.md5Hash,
      createdAt: bucketFile.createdAt,
      lastModified: bucketFile.lastModified,
      url: bucketFile.url,
      mediaLink: bucketFile.mediaLink,
      fileType: bucketFile.fileType,
      isPublic: bucketFile.isPublic,
      isFromBucket: true,
      usages: usages,
      isInUse: usages.length > 0,
    };

    return result;
  };

  export const createDirectoryFromPath = (
    path: string
  ): Types.DirectoryInfo => {
    const now = new Date();
    const result: Types.DirectoryInfo = {
      path: path,
      name: extractFileName(path),
      isProtected: false,
      permissions: {
        allowUploads: true,
        allowDelete: true,
        allowMove: true,
        allowCreateSubDirs: true,
        allowDeleteFiles: true,
        allowMoveFiles: true,
      },
      protectChildren: false,
      createdAt: now,
      lastModified: now,
      fileCount: 0,
      isFromBucket: false,
      isPublic: path.startsWith("public"),
      // todo: implement following
      folderCount: 0,
      totalSize: 0,
    };

    return result;
  };

  export const sortItems = (
    items: Array<Types.FileInfo | Types.DirectoryInfo>,
    sortBy: Types.FileSortField,
    direction: OrderSortDirection
  ): Array<Types.FileInfo | Types.DirectoryInfo> => {
    const sorted = [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case Types.FileSortField.NAME:
          comparison = a.name.localeCompare(b.name);
          break;
        case Types.FileSortField.SIZE: {
          const sizeA = "size" in a ? Number(a.size) : 0;
          const sizeB = "size" in b ? Number(b.size) : 0;
          comparison = sizeA - sizeB;
          break;
        }
        case Types.FileSortField.TYPE: {
          const typeA = "fileType" in a ? a.fileType : "DIRECTORY";
          const typeB = "fileType" in b ? b.fileType : "DIRECTORY";
          comparison = typeA.localeCompare(typeB);
          break;
        }
        case Types.FileSortField.CREATED:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case Types.FileSortField.MODIFIED:
          comparison = a.lastModified.getTime() - b.lastModified.getTime();
          break;
      }

      return direction === OrderSortDirection.ASC ? comparison : -comparison;
    });

    return sorted;
  };
}
