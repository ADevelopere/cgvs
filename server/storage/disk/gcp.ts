import { Storage, Bucket, GetFilesResponse } from "@google-cloud/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import logger from "@/lib/logger";
import * as StorageTypes from "../storage.types";
import {
    StorageService,
    StorageValidationError,
    STORAGE_CONFIG,
} from "./storage.service.interface";
import { StorageDbRepository } from "../db/storage-db.service";
import * as StorageUtils from "../storage.utils";
import { OrderSortDirection } from "@/lib/enum";

type GcsApiResponse = {
    prefixes?: string[];
};

const bucketName = process.env.GCP_BUCKET_NAME;
const projectId = process.env.GCP_PROJECT_ID;
const secretId = process.env.GCP_SECRET_ID;
const secretVersion = process.env.GCP_SECRET_VERSION || "latest";

export const gcpBaseUrl = `https://storage.googleapis.com/${bucketName}/`;

/**
 * Clean path for GCS - removes leading slashes and normalizes trailing slashes
 */
function cleanGcsPath(path: string, addTrailingSlash = false): string {
    if (!path || path.length === 0) {
        return "";
    }

    // Remove leading slashes and trailing slashes
    const cleaned = path.replace(/^\/+/, "").replace(/\/$/, "");

    // Add trailing slash if requested and path is not empty
    return addTrailingSlash && cleaned.length > 0 ? `${cleaned}/` : cleaned;
}

const getStorageFromSecretManager = async (): Promise<Storage | null> => {
    try {
        const client = new SecretManagerServiceClient();
        const name = `projects/${projectId}/secrets/${secretId}/versions/${secretVersion}`;

        const [version] = await client.accessSecretVersion({ name });
        const payload = version.payload?.data;

        if (!payload) {
            throw new Error("No payload found in secret version");
        }

        const credentials = JSON.parse(payload.toString());

        return new Storage({
            projectId,
            credentials,
        });
    } catch (error) {
        logger.error(
            `Failed to access secret version: ${secretId} in project: ${projectId}`,
            error,
        );
        return null;
    }
};

export async function createGcpStorage(): Promise<Storage> {
    if (projectId && secretId) {
        const storageFromSecret = await getStorageFromSecretManager();
        if (storageFromSecret) {
            return storageFromSecret;
        }
    }

    // Fallback to default credentials
    return new Storage({
        projectId,
    });
}

class GcpAdapter implements StorageService {
    private readonly storage: Storage;
    private readonly bucket: Bucket;

    constructor(storage: Storage) {
        if (!bucketName) {
            throw new Error("GCP_BUCKET_NAME environment variable is required");
        }
        this.storage = storage;
        this.bucket = storage.bucket(bucketName);
    }

    async fileExists(path: string): Promise<boolean> {
        try {
            const file = this.bucket.file(path);
            const [exists] = await file.exists();
            return exists;
        } catch (error) {
            logger.error(`Error checking file existence: ${path}`, error);
            return false;
        }
    }

    async generateUploadSignedUrl(
        input: StorageTypes.UploadSignedUrlGenerateInput,
    ): Promise<string> {
        StorageUtils.validateUpload(input.path, input.fileSize).then((err) => {
            if (err) throw new StorageValidationError(err);
        });

        const file = this.bucket.file(input.path);

        if (!file.signer) {
            throw new Error("Signer is not available for the file.");
        }

        const [url] = await file.signer.getSignedUrl({
            version: "v4",
            expires:
                Date.now() + STORAGE_CONFIG.SIGNED_URL_DURATION * 60 * 1000,
            contentType: StorageUtils.contentTypeEnumToMimeType(
                input.contentType,
            ),
            method: "PUT",
            contentMd5: input.contentMd5,
        });

        return url;
    }

    async uploadFile(
        path: string,
        contentType: StorageTypes.ContentTypeServerType,
        buffer: Buffer,
    ): Promise<StorageTypes.FileUploadResult> {
        try {
            const fileSize = buffer.byteLength;

            StorageUtils.validateUpload(path, fileSize).then((err) => {
                if (err)
                    return {
                        success: false,
                        message: err,
                        data: null,
                    };
            });

            // Check if the directory exists in DB and get permissions
            const directoryPath = path.substring(0, path.lastIndexOf("/"));

            // Check if the directory exists in DB and get permissions
            const dbDirectory =
                await StorageDbRepository.directoryByPath(directoryPath);

            if (dbDirectory) {
                // Directory exists in DB, check permissions
                if (!dbDirectory.allowUploads) {
                    return {
                        success: false,
                        message: "Uploads not allowed in this directory",
                        data: null,
                    };
                }
            } else {
                // Directory not in DB, check if it exists in bucket (default permissions apply)
                let bucketDirExists = false;
                try {
                    const folderBlob = `${directoryPath}/`;
                    const file = this.bucket.file(folderBlob);
                    const [exists] = await file.exists();
                    bucketDirExists = exists;
                } catch {
                    bucketDirExists = false;
                }

                if (!bucketDirExists && directoryPath.length > 0) {
                    return {
                        success: false,
                        message: "Directory does not exist",
                        data: null,
                    };
                }
            }

            const file = this.bucket.file(path);
            await file.save(buffer, {
                contentType:
                    StorageUtils.contentTypeEnumToMimeType(contentType),
            });

            // Create file entity in database
            const fileEntity = await StorageDbRepository.createFile(
                path,
                false,
            );

            const [metadata] = await file.getMetadata();
            const bucketFile = StorageUtils.blobToFileInfo(
                metadata,
                gcpBaseUrl,
            );
            const fileInfo = StorageUtils.combineFileData(
                bucketFile,
                fileEntity,
            );

            return {
                success: true,
                message: "File uploaded successfully",
                data: fileInfo,
            };
        } catch (error) {
            logger.error(`Failed to upload file: ${path}`, error);
            return {
                success: false,
                message: `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`,
                data: null,
            };
        }
    }

    async listFiles(
        input: StorageTypes.FilesListInput,
    ): Promise<StorageTypes.StorageObjectList> {
        // Clean the input path and add trailing slash for prefix
        const prefix = cleanGcsPath(input.path || "", true);
        const delimiter = "/";

        // Single API call to get both files and directories
        const response: GetFilesResponse = await this.bucket.getFiles({
            prefix,
            delimiter,
            autoPaginate: false,
        });

        const [files] = response;
        const apiResponse = response[2] as GcsApiResponse | undefined;

        const items: Array<
            | StorageTypes.FileInfoServerType
            | StorageTypes.DirectoryInfoServerType
        > = [];

        // Collect all file paths for batch DB query
        const filePaths: string[] = [];
        const validFiles = files.filter((file) => file.name !== prefix); // Skip folder markers

        for (const file of validFiles) {
            filePaths.push(file.name);
        }

        // Collect all directory paths for batch DB query
        const dirPaths: string[] = [];
        if (apiResponse?.prefixes) {
            for (const dirPrefix of apiResponse.prefixes) {
                const dirPath = dirPrefix.replace(/\/$/, "");
                dirPaths.push(dirPath);
            }
        }

        // Batch database queries
        const [dbFiles, dbDirectories] = await Promise.all([
            filePaths.length > 0
                ? StorageDbRepository.filesByPaths(filePaths)
                : [],
            dirPaths.length > 0
                ? StorageDbRepository.directoriesByPaths(dirPaths)
                : [],
        ]);

        // Create lookup maps for O(1) access
        const dbFileMap = new Map();
        dbFiles.forEach((dbFile) => {
            if (dbFile) {
                dbFileMap.set(dbFile.path, dbFile);
            }
        });

        const dbDirMap = new Map();
        dbDirectories.forEach((dbDir) => {
            if (dbDir) {
                dbDirMap.set(dbDir.path, dbDir);
            }
        });

        // Create folder file count map for efficient lookup
        const folderFileCountMap = new Map<string, number>();
        if (apiResponse?.prefixes) {
            // Count files in each directory from the already fetched files
            for (const file of files) {
                for (const dirPrefix of apiResponse.prefixes) {
                    if (
                        file.name.startsWith(dirPrefix) &&
                        file.name !== dirPrefix
                    ) {
                        const dirPath = dirPrefix.replace(/\/$/, "");
                        folderFileCountMap.set(
                            dirPath,
                            (folderFileCountMap.get(dirPath) || 0) + 1,
                        );
                    }
                }
            }

            // For more accurate count, we still need individual folder queries
            // But we can do them in parallel
            const folderCountPromises = dirPaths.map(async (dirPath) => {
                const dirPrefix = `${dirPath}/`;
                const [folderFiles] = await this.bucket.getFiles({
                    prefix: dirPrefix,
                });
                return { dirPath, count: folderFiles.length };
            });

            const folderCounts = await Promise.all(folderCountPromises);
            folderCounts.forEach(({ dirPath, count }) => {
                folderFileCountMap.set(dirPath, count);
            });
        }

        // Process files
        for (const file of validFiles) {
            const bucketFile = StorageUtils.blobToFileInfo(
                file.metadata,
                gcpBaseUrl,
            );
            const dbFile = dbFileMap.get(file.name);
            const fileInfo = StorageUtils.combineFileData(bucketFile, dbFile);
            items.push(fileInfo);
        }

        // Process directories (prefixes)
        if (apiResponse?.prefixes) {
            for (const dirPrefix of apiResponse.prefixes) {
                const dirPath = dirPrefix.replace(/\/$/, "");
                const dbDir = dbDirMap.get(dirPath);

                const bucketDir: StorageTypes.BucketDirectoryServerType = {
                    path: dirPath,
                    createdAt: new Date(),
                    lastModified: new Date(),
                    isPublic: dirPath.startsWith("public"),
                };

                const fileCount = folderFileCountMap.get(dirPath) || 0;
                const dirInfo = StorageUtils.combineDirectoryData(
                    bucketDir,
                    dbDir,
                    fileCount,
                );
                items.push(dirInfo);
            }
        }

        // Apply search filter
        let filteredItems = items;
        if (input.searchTerm && input.searchTerm.length > 0) {
            const searchLower = input.searchTerm.toLowerCase();
            filteredItems = items.filter((item) =>
                item.name.toLowerCase().includes(searchLower),
            );
        }

        // Apply file type filter
        if (input.fileType) {
            filteredItems = filteredItems.filter((item) => {
                if ("fileType" in item) {
                    return item.fileType === input.fileType;
                }
                return false;
            });
        }

        // Sort items
        const sortedItems = StorageUtils.sortItems(
            filteredItems,
            input.sortBy || StorageTypes.FileSortFieldServerType.NAME,
            input.sortDirection || OrderSortDirection.ASC,
        );

        // Apply pagination
        const totalCount = sortedItems.length;
        const offset = input.offset || 0;
        const limit = input.limit || 50;
        const paginatedItems = sortedItems.slice(offset, offset + limit);
        const hasMore = offset + limit < totalCount;

        return {
            items: paginatedItems,
            totalCount,
            hasMore,
            offset,
            limit,
        };
    }

    async createFolder(
        input: StorageTypes.FolderCreateInput,
    ): Promise<StorageTypes.FileOperationResult> {
        try {
            StorageUtils.validatePath(input.path).then((err) => {
                if (err) throw new StorageValidationError(err);
            });

            const fullPath = cleanGcsPath(input.path);

            // Check parent directory permissions
            const parentPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
            if (parentPath.length > 0) {
                const parentDir =
                    await StorageDbRepository.directoryByPath(parentPath);
                if (parentDir && !parentDir.allowCreateSubDirs) {
                    return {
                        success: false,
                        message:
                            "Creating subdirectories not allowed in parent directory",
                    };
                }
            }

            // Create folder marker in bucket
            const folderPath = `${fullPath}/`;
            const file = this.bucket.file(folderPath);
            await file.save("", {
                contentType: "application/x-directory",
            });

            // Only save folder in DB if custom permissions are provided
            const hasCustomPermissions =
                input.permissions != null ||
                input.protected === true ||
                input.protectChildren === true;

            let newDirectoryInfo: StorageTypes.DirectoryInfoServerType;

            if (hasCustomPermissions) {
                try {
                    const directoryEntity =
                        await StorageDbRepository.createDirectory(input);

                    const bucketDir: StorageTypes.BucketDirectoryServerType = {
                        path: fullPath,
                        createdAt: new Date(),
                        lastModified: new Date(),
                        isPublic: fullPath.startsWith("public"),
                    };

                    newDirectoryInfo = StorageUtils.combineDirectoryData(
                        bucketDir,
                        directoryEntity,
                    );
                } catch (error) {
                    // If DB operation fails, still return success since folder was created in bucket
                    logger.warn(
                        `Failed to save folder permissions in DB: ${error instanceof Error ? error.message : String(error)}`,
                    );
                    newDirectoryInfo =
                        StorageUtils.createDirectoryFromPath(fullPath);
                }
            } else {
                newDirectoryInfo =
                    StorageUtils.createDirectoryFromPath(fullPath);
            }

            return {
                success: true,
                message: "Folder created successfully",
                data: newDirectoryInfo,
            };
        } catch (error) {
            logger.error(`Failed to create folder: ${input.path}`, error);
            return {
                success: false,
                message: `Failed to create folder: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }

    async renameFile(
        input: StorageTypes.FileRenameInput,
    ): Promise<StorageTypes.FileOperationResult> {
        try {
            StorageUtils.validatePath(input.currentPath).then((err) => {
                if (err) {
                    const result: StorageTypes.FileOperationResult = {
                        success: false,
                        message: err,
                    };
                    return result;
                }
            });

            StorageUtils.validateFileName(input.newName).then((err) => {
                if (err) {
                    const result: StorageTypes.FileOperationResult = {
                        success: false,
                        message: err,
                    };
                    return result;
                }
            });

            const directoryPath = StorageUtils.extractDirectoryPath(
                input.currentPath,
            );

            const newPath = `${directoryPath}/${input.newName}`;

            // Copy to new location
            const sourceFile = this.bucket.file(input.currentPath);
            const destFile = this.bucket.file(newPath);
            await sourceFile.move(destFile);

            // Update database
            let fileEntity: StorageTypes.FileEntity | undefined;
            try {
                const dbFile = await StorageDbRepository.fileByPath(
                    input.currentPath,
                );
                if (dbFile) {
                    const updatedFile = { ...dbFile, path: newPath };
                    fileEntity =
                        await StorageDbRepository.updateFile(updatedFile);
                }
            } catch {}

            const [metadata] = await destFile.getMetadata();
            const bucketFile = StorageUtils.blobToFileInfo(
                metadata,
                gcpBaseUrl,
            );

            const fileInfo = StorageUtils.combineFileData(
                bucketFile,
                fileEntity,
            );

            return {
                success: true,
                message: "File renamed successfully",
                data: fileInfo,
            };
        } catch (error) {
            logger.error(`Failed to rename file: ${input.currentPath}`, error);
            return {
                success: false,
                message: `Failed to rename file: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }

    async deleteFile(path: string): Promise<StorageTypes.FileOperationResult> {
        try {
            StorageUtils.validatePath(path).then((err) => {
                if (err) {
                    const result: StorageTypes.FileOperationResult = {
                        success: false,
                        message: err,
                    };
                    return result;
                }
            });

            // Check permissions and protection
            // Check if file is in use
            await StorageDbRepository.checkFileUsage({
                path: path,
            }).then((usageCheck) => {
                if (usageCheck.isInUse) {
                    return {
                        success: false,
                        message:
                            usageCheck.deleteBlockReason || "File is in use",
                    };
                }
            });

            // Check if the file is protected
            const dbFile = await StorageDbRepository.fileByPath(path);
            if (dbFile?.isProtected === true) {
                return {
                    success: false,
                    message: "File is protected from deletion",
                };
            }

            // Check parent directory permissions
            const parentPath = path.substring(0, path.lastIndexOf("/"));
            const parentDir =
                await StorageDbRepository.directoryByPath(parentPath);
            if (parentDir && !parentDir.allowDeleteFiles) {
                return {
                    success: false,
                    message: "File deletion not allowed in this directory",
                };
            }

            // Delete from bucket
            const file = this.bucket.file(path);
            await file.delete();

            // Delete from database
            try {
                await StorageDbRepository.deleteFile(path);
            } catch {}

            return {
                success: true,
                message: "File deleted successfully",
            };
        } catch (error) {
            logger.error(`Failed to delete file: ${path}`, error);
            return {
                success: false,
                message: `Failed to delete file: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }

    async directoryInfoByPath(
        path: string,
    ): Promise<StorageTypes.DirectoryInfoServerType> {
        // Check database first
        const dbDirectory = await StorageDbRepository.directoryByPath(path);

        // Check bucket
        const folderPath = `${path}/`;
        const [files] = await this.bucket.getFiles({
            prefix: folderPath,
            maxResults: 1,
        });

        const folderExists = files.length > 0;

        if (!folderExists && !dbDirectory) {
            // Return default entity
            return StorageUtils.createDirectoryFromPath(path);
        }

        const bucketDir: StorageTypes.BucketDirectoryServerType = {
            path,
            createdAt: new Date(),
            lastModified: new Date(),
            isPublic: path.startsWith("public"),
        };

        return StorageUtils.combineDirectoryData(bucketDir, dbDirectory);
    }

    async fileInfoByPath(
        path: string,
    ): Promise<StorageTypes.FileInfoServerType | null> {
        try {
            const file = this.bucket.file(path);
            const [exists] = await file.exists();

            if (!exists) {
                return null;
            }

            const [metadata] = await file.getMetadata();
            const bucketFile = StorageUtils.blobToFileInfo(
                metadata,
                gcpBaseUrl,
            );
            const dbFile = await StorageDbRepository.fileByPath(path);

            return StorageUtils.combineFileData(bucketFile, dbFile);
        } catch (error) {
            logger.error(`Failed to get file info: ${path}`, error);
            return null;
        }
    }

    async fileInfoByDbFileId(
        id: bigint,
    ): Promise<StorageTypes.FileInfoServerType | null> {
        try {
            const dbFile = await StorageDbRepository.fileById(id);
            if (!dbFile) {
                return null;
            }

            const file = this.bucket.file(dbFile.path);
            const [exists] = await file.exists();

            if (!exists) {
                return null;
            }

            const [metadata] = await file.getMetadata();
            const bucketFile = StorageUtils.blobToFileInfo(
                metadata,
                gcpBaseUrl,
            );

            return StorageUtils.combineFileData(bucketFile, dbFile);
        } catch (error) {
            logger.error(`Failed to get file info by id: ${id}`, error);
            return null;
        }
    }

    async storageStatistics(path?: string): Promise<StorageTypes.StorageStats> {
        try {
            const prefix = path ? `${path}/` : "";
            const [files] = await this.bucket.getFiles({ prefix });

            let totalSize = BigInt(0);
            const fileTypeMap = new Map<
                StorageTypes.FileTypeServerType,
                { count: number; size: bigint }
            >();

            for (const file of files) {
                const size = BigInt(file.metadata.size || 0);
                totalSize += size;

                const fileType = StorageUtils.getFileTypeFromContentType(
                    file.metadata.contentType,
                );
                const current = fileTypeMap.get(fileType) || {
                    count: 0,
                    size: BigInt(0),
                };
                fileTypeMap.set(fileType, {
                    count: current.count + 1,
                    size: current.size + size,
                });
            }

            const fileTypeBreakdown = Array.from(fileTypeMap.entries()).map(
                ([type, data]) => ({
                    type,
                    count: data.count,
                    size: data.size,
                }),
            );

            // Count directories
            const response: GetFilesResponse = await this.bucket.getFiles({
                prefix,
                delimiter: "/",
            });
            const apiResponse = response[2] as GcsApiResponse | undefined;
            const directoryCount = apiResponse?.prefixes?.length || 0;

            return {
                totalFiles: files.length,
                totalSize,
                fileTypeBreakdown,
                directoryCount,
            };
        } catch (error) {
            logger.error("Failed to get storage statistics", error);
            return {
                totalFiles: 0,
                totalSize: BigInt(0),
                fileTypeBreakdown: [],
                directoryCount: 0,
            };
        }
    }

    async fetchDirectoryChildren(
        path?: string,
    ): Promise<StorageTypes.DirectoryInfoServerType[]> {
        // Clean path, default to "public" if empty
        const searchPath =
            !path || path.length === 0 ? "public" : cleanGcsPath(path);
        const prefix = cleanGcsPath(searchPath, true);

        // Get directories from database
        const dbDirectories =
            await StorageDbRepository.directoriesByParentPath(searchPath);
        const dbDirectoriesByPath = new Map(
            dbDirectories.map((dir) => [dir.path, dir]),
        );

        // Get directories from bucket
        const responseData: GetFilesResponse = await this.bucket.getFiles({
            prefix,
            delimiter: "/",
            autoPaginate: false,
        });

        const directories: StorageTypes.DirectoryInfoServerType[] = [];
        const apiResponse = responseData[2] as GcsApiResponse | undefined;

        if (apiResponse?.prefixes) {
            for (const dirPrefix of apiResponse.prefixes) {
                const dirPath = dirPrefix.replace(/\/$/, "");
                const dbDir = dbDirectoriesByPath.get(dirPath);

                const bucketDir: StorageTypes.BucketDirectoryServerType = {
                    path: dirPath,
                    createdAt: new Date(),
                    lastModified: new Date(),
                    isPublic: dirPath.startsWith("public"),
                };

                directories.push(
                    StorageUtils.combineDirectoryData(bucketDir, dbDir),
                );
            }
        }

        return directories;
    }

    async moveItems(
        input: StorageTypes.StorageItemsMoveInput,
    ): Promise<StorageTypes.BulkOperationResult> {
        let successCount = 0;
        let failureCount = 0;
        const failures: Array<{ path: string; error: string }> = [];
        const successfulItems: Array<
            | StorageTypes.FileInfoServerType
            | StorageTypes.DirectoryInfoServerType
        > = [];

        // Batch check if all source files exist in bucket
        const sourceExistenceChecks = await Promise.all(
            input.sourcePaths.map(async (sourcePath) => {
                const sourceFile = this.bucket.file(sourcePath);
                const [exists] = await sourceFile.exists();
                return { path: sourcePath, exists };
            }),
        );

        // Filter out non-existent sources
        const validSources = sourceExistenceChecks
            .filter((check) => {
                if (!check.exists) {
                    failureCount++;
                    failures.push({
                        path: check.path,
                        error: "Source path not found",
                    });
                    return false;
                }
                return true;
            })
            .map((check) => check.path);

        if (validSources.length === 0) {
            return {
                success: failureCount === 0,
                message: "No valid source files to move",
                successCount,
                failureCount,
                failures,
                successfulItems,
            };
        }

        // Batch load DB entities for source paths and directories
        const sourceDirectories = [
            ...new Set(
                validSources.map((path) =>
                    path.substring(0, path.lastIndexOf("/")),
                ),
            ),
        ];

        const [dbFiles, dbDirectories, dbSourceDirs, dbDestDir] =
            await Promise.all([
                StorageDbRepository.filesByPaths(validSources),
                StorageDbRepository.directoriesByPaths(validSources),
                StorageDbRepository.directoriesByPaths(sourceDirectories),
                StorageDbRepository.directoryByPath(input.destinationPath),
            ]);

        // Create lookup maps for O(1) access - fix the map creation
        const dbFileMap = new Map();
        dbFiles.forEach((file) => {
            if (file) {
                dbFileMap.set(file.path, file);
            }
        });

        const dbDirectoryMap = new Map();
        dbDirectories.forEach((dir) => {
            if (dir) {
                dbDirectoryMap.set(dir.path, dir);
            }
        });

        const dbSourceDirMap = new Map();
        dbSourceDirs.forEach((dir) => {
            if (dir) {
                dbSourceDirMap.set(dir.path, dir);
            }
        });

        // Check destination directory permissions once
        if (dbDestDir && !dbDestDir.allowUploads) {
            return {
                success: false,
                message: "Uploads not allowed to destination directory",
                successCount: 0,
                failureCount: validSources.length,
                failures: validSources.map((path) => ({
                    path,
                    error: "Uploads not allowed to destination directory",
                })),
                successfulItems,
            };
        }

        // Process each valid source
        for (const sourcePath of validSources) {
            try {
                // Check permissions for source directory
                const sourceDir = sourcePath.substring(
                    0,
                    sourcePath.lastIndexOf("/"),
                );
                const dbSourceDir = dbSourceDirMap.get(sourceDir);
                if (dbSourceDir && !dbSourceDir.allowMove) {
                    failureCount++;
                    failures.push({
                        path: sourcePath,
                        error: `Move not allowed from directory: ${sourceDir}`,
                    });
                    continue;
                }

                // Perform the move in bucket (copy then delete)
                const fileName = StorageUtils.extractFileName(sourcePath);
                const newPath = `${input.destinationPath.replace(/\/$/, "")}/${fileName}`;

                const sourceFile = this.bucket.file(sourcePath);
                const destFile = this.bucket.file(newPath);
                await sourceFile.copy(destFile);
                await sourceFile.delete();

                // Update DB records - check if it's a file or directory and update accordingly
                const dbFile = dbFileMap.get(sourcePath);
                const dbDirectory = dbDirectoryMap.get(sourcePath);

                if (dbFile) {
                    // Update file entity path
                    await StorageDbRepository.updateFile({
                        id: dbFile.id,
                        path: newPath,
                        isProtected: dbFile.isProtected,
                    });

                    // Get the updated file info for successful items
                    const fileInfo = await this.fileInfoByPath(newPath);
                    if (fileInfo) {
                        successfulItems.push(fileInfo);
                    }
                } else if (dbDirectory) {
                    // Update directory entity path
                    await StorageDbRepository.updateDirectory({
                        ...dbDirectory,
                        path: newPath,
                    });

                    // Get the updated directory info for successful items
                    const dirInfo = await this.directoryInfoByPath(newPath);
                    successfulItems.push(dirInfo);
                } else {
                    // No DB entity, get info from bucket
                    const fileInfo = await this.fileInfoByPath(newPath);
                    if (fileInfo) {
                        successfulItems.push(fileInfo);
                    }
                }

                successCount++;
            } catch (error) {
                failureCount++;
                failures.push({
                    path: sourcePath,
                    error:
                        error instanceof Error ? error.message : String(error),
                });
            }
        }

        return {
            success: failureCount === 0,
            message:
                failureCount === 0
                    ? "All items moved successfully"
                    : `${successCount} items moved, ${failureCount} failed`,
            successCount,
            failureCount,
            failures,
            successfulItems,
        };
    }

    async copyItems(
        input: StorageTypes.StorageItemsCopyInput,
    ): Promise<StorageTypes.BulkOperationResult> {
        let successCount = 0;
        let failureCount = 0;
        const failures: Array<{ path: string; error: string }> = [];
        const successfulItems: Array<
            | StorageTypes.FileInfoServerType
            | StorageTypes.DirectoryInfoServerType
        > = [];

        // Batch check if all source files exist in bucket
        const sourceExistenceChecks = await Promise.all(
            input.sourcePaths.map(async (sourcePath) => {
                const sourceFile = this.bucket.file(sourcePath);
                const [exists] = await sourceFile.exists();
                return { path: sourcePath, exists };
            }),
        );

        // Filter out non-existent sources
        const validSources = sourceExistenceChecks
            .filter((check) => {
                if (!check.exists) {
                    failureCount++;
                    failures.push({
                        path: check.path,
                        error: "Source path not found",
                    });
                    return false;
                }
                return true;
            })
            .map((check) => check.path);

        if (validSources.length === 0) {
            return {
                success: failureCount === 0,
                message: "No valid source files to copy",
                successCount,
                failureCount,
                failures,
                successfulItems,
            };
        }

        // Check destination directory permissions once
        const dbDestDir = await StorageDbRepository.directoryByPath(
            input.destinationPath,
        );
        if (dbDestDir && !dbDestDir.allowUploads) {
            return {
                success: false,
                message: "Uploads not allowed to destination directory",
                successCount: 0,
                failureCount: validSources.length,
                failures: validSources.map((path) => ({
                    path,
                    error: "Uploads not allowed to destination directory",
                })),
                successfulItems,
            };
        }

        // Process each valid source
        for (const sourcePath of validSources) {
            try {
                const fileName = StorageUtils.extractFileName(sourcePath);
                const destPath = `${input.destinationPath.replace(/\/$/, "")}/${fileName}`;

                // Copy file in bucket
                const sourceFile = this.bucket.file(sourcePath);
                const destFile = this.bucket.file(destPath);
                await sourceFile.copy(destFile);

                // Don't create DB entities as requested - just get file info from bucket
                const fileInfo = await this.fileInfoByPath(destPath);
                if (fileInfo) {
                    successfulItems.push(fileInfo);
                }

                successCount++;
            } catch (error) {
                failureCount++;
                failures.push({
                    path: sourcePath,
                    error:
                        error instanceof Error ? error.message : String(error),
                });
            }
        }

        return {
            success: failureCount === 0,
            message:
                failureCount === 0
                    ? "All items copied successfully"
                    : `${successCount} items copied, ${failureCount} failed`,
            successCount,
            failureCount,
            failures,
            successfulItems,
        };
    }

    async deleteItems(
        input: StorageTypes.StorageItemsDeleteInput,
    ): Promise<StorageTypes.BulkOperationResult> {
        let successCount = 0;
        let failureCount = 0;
        const failures: Array<{ path: string; error: string }> = [];
        const successfulItems: Array<
            | StorageTypes.FileInfoServerType
            | StorageTypes.DirectoryInfoServerType
        > = [];

        // Batch load DB entities for all paths and their parent directories
        const parentDirectories = [
            ...new Set(
                input.paths.map((path) =>
                    path.substring(0, path.lastIndexOf("/")),
                ),
            ),
        ];

        const [dbFiles, dbDirectories, dbParentDirs, usageChecks] =
            await Promise.all([
                StorageDbRepository.filesByPaths(input.paths),
                StorageDbRepository.directoriesByPaths(input.paths),
                StorageDbRepository.directoriesByPaths(parentDirectories),
                // Batch check file usage if not force delete
                input.force
                    ? Promise.resolve([])
                    : Promise.all(
                          input.paths.map((path) =>
                              StorageDbRepository.checkFileUsage({
                                  path: path,
                              })
                                  .then((result) => ({ path, ...result }))
                                  .catch(() => ({
                                      path,
                                      isInUse: false,
                                      deleteBlockReason: null,
                                  })),
                          ),
                      ),
            ]);

        // Create lookup maps for O(1) access
        const dbFileMap = new Map();
        dbFiles.forEach((file) => {
            if (file) {
                dbFileMap.set(file.path, file);
            }
        });

        const dbDirectoryMap = new Map();
        dbDirectories.forEach((dir) => {
            if (dir) {
                dbDirectoryMap.set(dir.path, dir);
            }
        });

        const dbParentDirMap = new Map();
        dbParentDirs.forEach((dir) => {
            if (dir) {
                dbParentDirMap.set(dir.path, dir);
            }
        });

        const usageCheckMap = new Map();
        usageChecks.forEach((check) => {
            usageCheckMap.set(check.path, check);
        });

        // Process each path
        for (const path of input.paths) {
            try {
                // Check if file is in use (unless force delete)
                if (!input.force) {
                    const usageCheck = usageCheckMap.get(path);
                    if (usageCheck?.isInUse) {
                        failureCount++;
                        failures.push({
                            path,
                            error:
                                usageCheck.deleteBlockReason ||
                                "File is currently in use",
                        });
                        continue;
                    }
                }

                // Check if file/directory is protected
                const dbFile = dbFileMap.get(path);
                const dbDirectory = dbDirectoryMap.get(path);

                if (
                    dbFile?.isProtected === true ||
                    dbDirectory?.isProtected === true
                ) {
                    failureCount++;
                    failures.push({
                        path,
                        error: "Item is protected from deletion",
                    });
                    continue;
                }

                // Check parent directory permissions
                const parentPath = path.substring(0, path.lastIndexOf("/"));
                const parentDir = dbParentDirMap.get(parentPath);
                if (parentDir) {
                    const isFile = dbFile != null;
                    const canDelete = isFile
                        ? parentDir.allowDeleteFiles
                        : parentDir.allowDelete;
                    if (!canDelete) {
                        failureCount++;
                        failures.push({
                            path,
                            error: "Deletion not allowed in parent directory",
                        });
                        continue;
                    }
                }

                // Get entity before deleting for the result
                const fileEntity = await this.fileInfoByPath(path);
                const folderEntity = fileEntity
                    ? null
                    : await this.directoryInfoByPath(path);

                // Delete from bucket
                const file = this.bucket.file(path);
                await file.delete();

                // Delete from database
                if (dbFile) {
                    await StorageDbRepository.deleteFile(path);
                    if (fileEntity) {
                        successfulItems.push(fileEntity);
                    }
                } else if (dbDirectory) {
                    await StorageDbRepository.deleteDirectory(path);
                    if (folderEntity) {
                        successfulItems.push(folderEntity);
                    }
                } else if (fileEntity) {
                    // No DB entity, just add file to successful items
                    successfulItems.push(fileEntity);
                } else if (folderEntity) {
                    // No DB entity, just add folder to successful items
                    successfulItems.push(folderEntity);
                }

                successCount++;
            } catch (error) {
                failureCount++;
                failures.push({
                    path,
                    error:
                        error instanceof Error ? error.message : String(error),
                });
            }
        }

        return {
            success: failureCount === 0,
            message:
                failureCount === 0
                    ? "All items deleted successfully"
                    : `${successCount} items deleted, ${failureCount} failed`,
            successCount,
            failureCount,
            failures,
            successfulItems,
        };
    }
}

export async function createGcpAdapter(): Promise<StorageService> {
    const storage = await createGcpStorage();
    return new GcpAdapter(storage);
}
