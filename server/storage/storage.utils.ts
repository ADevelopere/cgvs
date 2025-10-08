import { STORAGE_CONFIG } from "./disk/storage.service.interface";
import * as StorageTypes from "../storage/storage.types";
import { OrderSortDirection } from "@/lib/enum";

// Mapping functions for GraphQL enums to actual values
export const CONTENT_TYPE_MAP: Record<
    StorageTypes.ContentTypeServerType,
    string
> = {
    [StorageTypes.ContentTypeServerType.JPEG]: "image/jpeg",
    [StorageTypes.ContentTypeServerType.PNG]: "image/png",
    [StorageTypes.ContentTypeServerType.GIF]: "image/gif",
    [StorageTypes.ContentTypeServerType.WEBP]: "image/webp",
    [StorageTypes.ContentTypeServerType.PDF]: "application/pdf",
    [StorageTypes.ContentTypeServerType.DOC]: "application/msword",
    [StorageTypes.ContentTypeServerType.DOCX]:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    [StorageTypes.ContentTypeServerType.XLS]: "application/vnd.ms-excel",
    [StorageTypes.ContentTypeServerType.XLSX]:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    [StorageTypes.ContentTypeServerType.TXT]: "text/plain",
    [StorageTypes.ContentTypeServerType.ZIP]: "application/zip",
    [StorageTypes.ContentTypeServerType.RAR]: "application/vnd.rar",
    [StorageTypes.ContentTypeServerType.MP4]: "video/mp4",
    [StorageTypes.ContentTypeServerType.MP3]: "audio/mpeg",
    [StorageTypes.ContentTypeServerType.WAV]: "audio/wav",
};

export const UPLOAD_LOCATION_MAP: Record<
    StorageTypes.UploadLocationPath,
    string
> = {
    [StorageTypes.UploadLocationPath.TEMPLATE_COVERS]: "public/templateCover",
};

// Reverse mapping for content types
export const REVERSE_CONTENT_TYPE_MAP: Record<
    string,
    StorageTypes.ContentTypeServerType
> = Object.entries(CONTENT_TYPE_MAP).reduce(
    (acc, [key, value]) => {
        acc[value] = key as StorageTypes.ContentTypeServerType;
        return acc;
    },
    {} as Record<string, StorageTypes.ContentTypeServerType>,
);

export const contentTypeEnumToMimeType = (
    enumValue: StorageTypes.ContentTypeServerType,
): string => {
    return CONTENT_TYPE_MAP[enumValue];
};

export const mimeTypeToContentTypeEnum = (
    mimeType: string,
): StorageTypes.ContentTypeServerType | null => {
    return REVERSE_CONTENT_TYPE_MAP[mimeType] || null;
};

export const uploadLocationEnumToPath = (
    enumValue: StorageTypes.UploadLocationPath,
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
export const validateFileName = (fileName: string): Promise<string | null> => {
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
    contentType: StorageTypes.ContentTypeServerType,
    location: StorageTypes.UploadLocationServerType,
): Promise<string | null> => {
    let err: string | null = null;
    if (contentType == null) {
        err = "Content type is required";
    }

    if (
        !location.allowedContentTypes.some((allowed) => allowed === contentType)
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
    size: number,
): Promise<string | null> => {
    let error: string | null = null;
    if (!path.startsWith("public/")) {
        error = "Upload signed URLs can only be generated for public paths";
    }

    const fileName = path.slice(path.lastIndexOf("/") + 1);
    validateFileName(fileName).then((err) => {
        if (err) error = err;
    });

    validatePath(path).then((err) => {
        if (err) error = err;
    });

    validateFileSize(size).then((err) => {
        if (err) error = err;
    });
    return Promise.resolve(error);
};

export const getFileTypeFromContentType = (
    contentType?: string,
): StorageTypes.FileTypeServerType => {
    if (!contentType) return StorageTypes.FileTypeServerType.OTHER;

    if (contentType.startsWith("image/"))
        return StorageTypes.FileTypeServerType.IMAGE;
    if (contentType.startsWith("video/"))
        return StorageTypes.FileTypeServerType.VIDEO;
    if (contentType.startsWith("audio/"))
        return StorageTypes.FileTypeServerType.AUDIO;
    if (
        contentType.includes("pdf") ||
        contentType.includes("document") ||
        contentType.includes("text")
    )
        return StorageTypes.FileTypeServerType.DOCUMENT;
    if (contentType.includes("zip") || contentType.includes("rar"))
        return StorageTypes.FileTypeServerType.ARCHIVE;

    return StorageTypes.FileTypeServerType.OTHER;
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
    blob: StorageTypes.BlobMetadata,
    baseUrl: string,
): StorageTypes.BucketFileServerType => {
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
    blob: StorageTypes.BlobMetadata,
): StorageTypes.BucketDirectoryServerType => {
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
    bucketDir: StorageTypes.BucketDirectoryServerType,
    dbEntity?: StorageTypes.DirectoryEntity,
    fileCount: number = 0,
): StorageTypes.DirectoryInfoServerType => {
    const permissions: StorageTypes.DirectoryPermissionsServerType = dbEntity
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

    return new StorageTypes.DirectoryInfoServerType(
        bucketDir.path,
        extractFileName(bucketDir.path),
        dbEntity?.isProtected || false,
        permissions,
        dbEntity?.protectChildren || false,
        bucketDir.createdAt,
        bucketDir.lastModified,
        true,
        fileCount,
        0,
        0,
    );
};

export const combineFileData = (
    bucketFile: StorageTypes.BucketFileServerType,
    dbEntity?: StorageTypes.FileEntity,
): StorageTypes.FileInfoServerType => {
    const usages: StorageTypes.FileUsageInfoServerType[] = [];
    const isProtected = dbEntity?.isProtected || false;

    return new StorageTypes.FileInfoServerType(
        bucketFile.path,
        extractFileName(bucketFile.path),
        isProtected,
        bucketFile.directoryPath,
        bucketFile.size,
        bucketFile.contentType,
        bucketFile.md5Hash,
        bucketFile.createdAt,
        bucketFile.lastModified,
        true,
        bucketFile.url,
        bucketFile.mediaLink,
        bucketFile.fileType,
        bucketFile.isPublic,
        false,
        usages,
    );
};

export const createDirectoryFromPath = (
    path: string,
): StorageTypes.DirectoryInfoServerType => {
    return new StorageTypes.DirectoryInfoServerType(
        path,
        extractFileName(path),
        false,
        {
            allowUploads: true,
            allowDelete: true,
            allowMove: true,
            allowCreateSubDirs: true,
            allowDeleteFiles: true,
            allowMoveFiles: true,
        },
        false,
        new Date(),
        new Date(),
        true,
        0,
        0,
        0,
    );
};

export const sortItems = (
    items: Array<
        StorageTypes.FileInfoServerType | StorageTypes.DirectoryInfoServerType
    >,
    sortBy: StorageTypes.FileSortFieldServerType,
    direction: OrderSortDirection,
): Array<
    StorageTypes.FileInfoServerType | StorageTypes.DirectoryInfoServerType
> => {
    const sorted = [...items].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case StorageTypes.FileSortFieldServerType.NAME:
                comparison = a.name.localeCompare(b.name);
                break;
            case StorageTypes.FileSortFieldServerType.SIZE: {
                const sizeA = "size" in a ? Number(a.size) : 0;
                const sizeB = "size" in b ? Number(b.size) : 0;
                comparison = sizeA - sizeB;
                break;
            }
            case StorageTypes.FileSortFieldServerType.TYPE: {
                const typeA = "fileType" in a ? a.fileType : "DIRECTORY";
                const typeB = "fileType" in b ? b.fileType : "DIRECTORY";
                comparison = typeA.localeCompare(typeB);
                break;
            }
            case StorageTypes.FileSortFieldServerType.CREATED:
                comparison = a.createdAt.getTime() - b.createdAt.getTime();
                break;
            case StorageTypes.FileSortFieldServerType.MODIFIED:
                comparison =
                    a.lastModified.getTime() - b.lastModified.getTime();
                break;
        }

        return direction === OrderSortDirection.ASC ? comparison : -comparison;
    });

    return sorted;
};
