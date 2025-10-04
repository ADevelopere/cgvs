import { STORAGE_CONFIG } from "./disk/storage.service.interface";
import * as StorageTypes from "../storage/storage.types";
import { SortDirectionServerType } from "../graphql/base/sort.pothos";

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
    const created = blob.timeCreated ? new Date(blob.timeCreated) : new Date();
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
        created,
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
    const created = blob.timeCreated ? new Date(blob.timeCreated) : new Date();
    const lastModified = blob.updated ? new Date(blob.updated) : new Date();
    const isPublic = path.startsWith("public");

    return {
        path,
        created,
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

    return {
        path: bucketDir.path,
        isProtected: dbEntity?.isProtected || false,
        permissions,
        protectChildren: dbEntity?.protectChildren || false,
        created: bucketDir.created,
        lastModified: bucketDir.lastModified,
        isFromBucket: true,
        fileCount,
        folderCount: 0,
        totalSize: 0,
        name: extractFileName(bucketDir.path),
    };
};

export const combineFileData = (
    bucketFile: StorageTypes.BucketFileServerType,
    dbEntity?: StorageTypes.FileEntity,
): StorageTypes.FileInfoServerType => {
    const usages: StorageTypes.FileUsageInfoServerType[] = [];
    const isProtected = dbEntity?.isProtected || false;

    return {
        path: bucketFile.path,
        isProtected,
        directoryPath: bucketFile.directoryPath,
        size: bucketFile.size,
        contentType: bucketFile.contentType,
        md5Hash: bucketFile.md5Hash,
        created: bucketFile.created,
        lastModified: bucketFile.lastModified,
        isFromBucket: true,
        url: bucketFile.url,
        mediaLink: bucketFile.mediaLink,
        fileType: bucketFile.fileType,
        isPublic: bucketFile.isPublic,
        isInUse: false,
        usages,
        name: extractFileName(bucketFile.path),
    };
};

export const createDirectoryFromPath = (
    path: string,
): StorageTypes.DirectoryInfoServerType => {
    return {
        path,
        permissions: {
            allowUploads: true,
            allowDelete: true,
            allowMove: true,
            allowCreateSubDirs: true,
            allowDeleteFiles: true,
            allowMoveFiles: true,
        },
        isProtected: false,
        protectChildren: false,
        created: new Date(),
        lastModified: new Date(),
        isFromBucket: true,
        fileCount: 0,
        folderCount: 0,
        totalSize: 0,
        name: extractFileName(path),
    };
};

export const sortItems = (
    items: Array<
        StorageTypes.FileInfoServerType | StorageTypes.DirectoryInfoServerType
    >,
    sortBy: StorageTypes.FileSortFieldServerType,
    direction: SortDirectionServerType,
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
                comparison = a.created.getTime() - b.created.getTime();
                break;
            case StorageTypes.FileSortFieldServerType.MODIFIED:
                comparison =
                    a.lastModified.getTime() - b.lastModified.getTime();
                break;
        }

        return direction === SortDirectionServerType.ASC
            ? comparison
            : -comparison;
    });

    return sorted;
};
