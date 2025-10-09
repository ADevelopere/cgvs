import logger from "@/lib/logger";
import * as fs from "fs/promises";
import * as path from "path";
import type { FolderCreateInput } from "../../types/storage.types";
import { getStorageService, type StorageService } from "../storage.service";
import * as StorageTypes from "../../types/storage.types";

/**
 * Interface for FileInitializationService
 */
export interface IFileInitializationService {
    /**
     * Initialize required directories and upload demo files
     */
    initializeFileSystem(): Promise<void>;

    /**
     * Create required directories in the storage system
     */
    createRequiredDirectories(): Promise<void>;

    /**
     * Create a directory if it doesn't exist
     */
    createDirectoryIfNotExists(input: FolderCreateInput): Promise<void>;

    /**
     * Upload demo template files from resources
     */
    uploadDemoTemplateFiles(): Promise<void>;

    /**
     * Upload a demo file if it doesn't exist in storage
     */
    uploadDemoFileIfNotExists(fileName: string): Promise<void>;

    /**
     * Verify that all demo files are properly accessible in the bucket
     */
    verifyDemoFilesInDatabase(): Promise<void>;

    /**
     * Get demo files that are available for templates
     * Files are automatically registered in the database when uploaded via StorageService
     * This method retrieves their database IDs for use in templates
     */
    getDemoFileIds(): Promise<bigint[]>;

    /**
     * Register file usage for template covers
     */
    registerTemplateFileUsage(
        templateId: number,
        fileId: bigint,
    ): Promise<void>;

    /**
     * Get content type from file name
     */
    getContentTypeFromFileName(fileName: string): StorageTypes.FileContentType;
}

export class FileInitializationService implements IFileInitializationService {
    private readonly storageService: StorageService;

    constructor(storageService: StorageService) {
        this.storageService = storageService;
    }

    /**
     * Create a directory if it doesn't exist
     */
    async createDirectoryIfNotExists(input: FolderCreateInput): Promise<void> {
        try {
            // Check if directory exists in storage
            const directoryInfo = await this.storageService.directoryInfoByPath(
                input.path,
            );

            if (directoryInfo) {
                logger.info(`   📁 Directory already exists: ${input.path}`);
                return;
            }

            // Create the directory
            const result = await this.storageService.createFolder(input);

            if (result.success) {
                logger.info(`   📁 Created directory: ${input.path}`);
            } else {
                logger.warn(
                    `   ⚠️  Warning: Could not create directory: ${input.path} - ${result.message}`,
                );
            }
        } catch (error) {
            logger.error(
                `   ❌ Error creating directory ${input.path}:`,
                error,
            );
            throw error;
        }
    }

    // Placeholder implementations for other methods
    async initializeFileSystem(): Promise<void> {
        logger.info("🗂️  Initializing file system...");

        // Create required directories
        await this.createRequiredDirectories();

        // Upload demo template files
        await this.uploadDemoTemplateFiles();

        logger.info("✅ File system initialization completed");
    }

    async createRequiredDirectories(): Promise<void> {
        const requiredDirectories: FolderCreateInput[] = [
            { path: "public", protected: true },
            { path: "public/templates", protected: true },
            { path: "public/templates/covers", protected: true },
        ];

        for (const input of requiredDirectories) {
            await this.createDirectoryIfNotExists(input);
        }
    }

    async uploadDemoTemplateFiles(): Promise<void> {
        const demoFiles = ["demo1.jpg", "demo2.jpg", "demo3.jpg", "demo4.jpg"];

        for (const fileName of demoFiles) {
            await this.uploadDemoFileIfNotExists(fileName);
        }

        // After processing all files, verify they are in the database
        logger.info("   🔍 Verifying demo files are registered in database...");
        await this.verifyDemoFilesInDatabase();
    }

    async uploadDemoFileIfNotExists(fileName: string): Promise<void> {
        const bucketPath = `public/templates/covers/${fileName}`;

        try {
            // Check if file exists in storage
            const fileInfo =
                await this.storageService.fileInfoByPath(bucketPath);
            if (fileInfo) {
                logger.info(
                    `   🖼️  Demo file already exists in bucket: ${fileName}`,
                );
                return;
            }
        } catch (error) {
            logger.warn(
                `   ⚠️  Could not check bucket for file: ${fileName} - ${error}`,
            );
        }

        // Upload file from resources using StorageService
        try {
            const resourcePath = path.join(__dirname, "res", fileName);

            // Read file from disk
            const fileBuffer = await fs.readFile(resourcePath);
            const contentType = this.getContentTypeFromFileName(fileName);

            const result = await this.storageService.uploadFile(
                bucketPath,
                contentType,
                fileBuffer,
            );

            if (result.success) {
                logger.info(`   🖼️  Uploaded demo file: ${fileName}`);
            } else {
                logger.error(
                    `   ❌ Failed to upload demo file ${fileName}: ${result.message}`,
                );
            }
        } catch (error) {
            if (
                error instanceof Error &&
                "code" in error &&
                error.code === "ENOENT"
            ) {
                logger.error(`   ❌ Resource not found: ${fileName}`);
            } else {
                logger.error(
                    `   ❌ Failed to upload demo file ${fileName}:`,
                    error,
                );
            }
        }
    }

    async verifyDemoFilesInDatabase(): Promise<void> {
        const demoFiles = [
            {
                fileName: "demo1.jpg",
                bucketPath: "public/templates/covers/demo1.jpg",
            },
            {
                fileName: "demo2.jpg",
                bucketPath: "public/templates/covers/demo2.jpg",
            },
            {
                fileName: "demo3.jpg",
                bucketPath: "public/templates/covers/demo3.jpg",
            },
            {
                fileName: "demo4.jpg",
                bucketPath: "public/templates/covers/demo4.jpg",
            },
        ];

        for (const { fileName, bucketPath } of demoFiles) {
            try {
                const fileInfo =
                    await this.storageService.fileInfoByPath(bucketPath);
                if (fileInfo) {
                    logger.info(
                        `   ✅ Demo file exists in bucket: ${fileName}`,
                    );
                } else {
                    logger.error(
                        `   ❌ Demo file NOT found in bucket: ${fileName}`,
                    );
                }
            } catch (error) {
                logger.error(
                    `   ❌ Error checking demo file ${fileName}:`,
                    error,
                );
            }
        }
    }

    async getDemoFileIds(): Promise<bigint[]> {
        const demoFiles = [
            "public/templates/covers/demo1.jpg",
            "public/templates/covers/demo2.jpg",
            "public/templates/covers/demo3.jpg",
            "public/templates/covers/demo4.jpg",
        ];

        logger.info(
            "   🔍 Checking for demo files and retrieving their database IDs...",
        );

        const fileIds: bigint[] = [];

        for (const filePath of demoFiles) {
            try {
                const fileInfo =
                    await this.storageService.fileInfoByPath(filePath);

                if (fileInfo?.dbId) {
                    logger.info(
                        `   ✅ Found demo file in database: ${filePath} (ID: ${fileInfo.dbId})`,
                    );
                    fileIds.push(fileInfo.dbId);
                } else if (fileInfo) {
                    logger.warn(
                        `   ⚠️  Demo file exists in storage but has no database ID: ${filePath}`,
                    );
                } else {
                    logger.error(
                        `   ❌ Demo file NOT found in storage: ${filePath}`,
                    );
                }
            } catch (error) {
                logger.error(
                    `   ❌ Error accessing demo file ${filePath}:`,
                    error,
                );
            }
        }

        logger.info(
            `   📊 Total demo files available: ${fileIds.length} out of ${demoFiles.length}`,
        );
        return fileIds;
    }

    async registerTemplateFileUsage(
        templateId: number,
        fileId: bigint,
    ): Promise<void> {
        try {
            const fileInfo =
                await this.storageService.fileInfoByDbFileId(fileId);

            if (fileInfo) {
                // NOTE: File usage registration through StorageService.registerFileUsage()
                // is not yet implemented in the StorageService interface.
                // Currently, file usage tracking happens when templates reference the files
                // in the database through foreign key relationships.
                //
                // Expected future behavior (to match Kotlin implementation):
                // - Register file usage with type "template_cover"
                // - Track reference to template ID and "templates" table
                // - This enables checking if files can be safely deleted
                logger.info(
                    `   📎 File ${fileId} (${fileInfo.path}) will be used for template ${templateId}`,
                );
                logger.info(
                    `   ℹ️  File usage tracking happens through template-file relationships`,
                );
            } else {
                logger.warn(`   ⚠️  File with ID ${fileId} not found`);
            }
        } catch (error) {
            logger.error(`   ❌ Error accessing file ${fileId}:`, error);
        }
    }

    getContentTypeFromFileName(fileName: string): StorageTypes.FileContentType {
        const extension = fileName
            .substring(fileName.lastIndexOf(".") + 1)
            .toLowerCase();

        switch (extension) {
            case "jpg":
            case "jpeg":
                return StorageTypes.FileContentType.JPEG;
            case "png":
                return StorageTypes.FileContentType.PNG;
            case "gif":
                return StorageTypes.FileContentType.GIF;
            case "webp":
                return StorageTypes.FileContentType.WEBP;
            default:
                return StorageTypes.FileContentType.JPEG;
        }
    }
}

/**
 * Factory function to create FileInitializationService instance
 */
export const createFileInitializationService =
    async (): Promise<FileInitializationService> => {
        const storageService = await getStorageService();
        return new FileInitializationService(storageService);
    };
