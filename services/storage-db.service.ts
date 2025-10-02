import { db } from "@/server/db/drizzleDb";
import { storageFiles, fileUsages, storageDirectories } from "@/server/db/schema/storage";
import { eq, and, sql, inArray } from "drizzle-orm";
import logger from "@/utils/logger";
import {
    CreateFolderInput,
    RegisterFileUsageInput,
    UpdateDirectoryPermissionsInput,
    SetStorageItemProtectionInput,
    CheckFileUsageInput,
    FileOperationResult,
    FileUsageResult
} from "./storage.types";

// Type aliases to match Kotlin entities
export type FileEntity = typeof storageFiles.$inferSelect;
export type DirectoryEntity = typeof storageDirectories.$inferSelect;
export type FileUsageEntity = typeof fileUsages.$inferSelect;

export interface StorageDbService {
    // File operations - matching Kotlin interface exactly
    fileById(id: bigint): Promise<FileEntity | undefined>;
    filesByIds(ids: bigint[]): Promise<FileEntity[]>;
    fileByPath(path: string): Promise<FileEntity | undefined>;

    // Directory methods
    directoryByPath(path: string): Promise<DirectoryEntity | undefined>;
    directoriesByParentPath(parentPath?: string): Promise<DirectoryEntity[]>;
    createDirectory(input: CreateFolderInput): Promise<DirectoryEntity>;
    updateDirectory(directory: DirectoryEntity): Promise<DirectoryEntity | undefined>;
    deleteDirectory(path: string): Promise<boolean>;

    // File operations
    createFile(path: string, isProtected?: boolean): Promise<FileEntity>;
    updateFile(file: FileEntity): Promise<FileEntity | undefined>;
    deleteFile(path: string): Promise<boolean>;

    // File usage and other methods
    isFileInUse(filePath: string): Promise<boolean>;
    getFileUsages(filePath: string): Promise<FileUsageEntity[]>;
    checkFileUsage(input: CheckFileUsageInput): Promise<FileUsageResult>;
    updateDirectoryPermissions(input: UpdateDirectoryPermissionsInput): Promise<FileOperationResult>;
    setProtection(input: SetStorageItemProtectionInput): Promise<FileOperationResult>;
    registerFileUsage(input: RegisterFileUsageInput): Promise<FileOperationResult>;
}

export class StorageDbServiceImpl implements StorageDbService {
    // File operations
    async fileById(id: bigint): Promise<FileEntity | undefined> {
        const result = await db
            .select()
            .from(storageFiles)
            .where(eq(storageFiles.id, id))
            .limit(1);
        return result[0];
    }

    async fileByPath(path: string): Promise<FileEntity | undefined> {
        const result = await db
            .select()
            .from(storageFiles)
            .where(eq(storageFiles.path, path))
            .limit(1);
        return result[0];
    }

    async filesByIds(ids: bigint[]): Promise<FileEntity[]> {
        if (ids.length === 0) return [];
        return await db
            .select()
            .from(storageFiles)
            .where(inArray(storageFiles.id, ids));
    }

    async createFile(path: string, isProtected: boolean = false): Promise<FileEntity> {
        const [file] = await db.insert(storageFiles)
            .values({
                id: sql`nextval('storage_file_id_seq')`,
                path,
                isProtected
            })
            .returning();
        return file;
    }

    async updateFile(file: FileEntity): Promise<FileEntity | undefined> {
        const [updatedFile] = await db.update(storageFiles)
            .set({
                path: file.path,
                isProtected: file.isProtected
            })
            .where(eq(storageFiles.id, file.id))
            .returning();
        return updatedFile;
    }

    async deleteFile(path: string): Promise<boolean> {
        try {
            await db.delete(storageFiles)
                .where(eq(storageFiles.path, path));
            return true;
        } catch (error) {
            logger.error("Failed to delete file:", error);
            return false;
        }
    }

    // Directory operations
    async directoryByPath(path: string): Promise<DirectoryEntity | undefined> {
        const result = await db
            .select()
            .from(storageDirectories)
            .where(eq(storageDirectories.path, path))
            .limit(1);
        return result[0];
    }

    async directoriesByParentPath(parentPath?: string): Promise<DirectoryEntity[]> {
        if (parentPath) {
            return await db
                .select()
                .from(storageDirectories)
                .where(sql`${storageDirectories.path} LIKE ${parentPath + '/%'}`);
        }
        return await db.select().from(storageDirectories);
    }

    async createDirectory(input: CreateFolderInput): Promise<DirectoryEntity> {
        const permissions = input.permissions || {
            allowUploads: true,
            allowDelete: true,
            allowMove: true,
            allowCreateSubDirs: true,
            allowDeleteFiles: true,
            allowMoveFiles: true
        };

        const [directory] = await db.insert(storageDirectories)
            .values({
                id: sql`nextval('storage_directory_id_seq')`,
                path: input.path,
                allowUploads: permissions.allowUploads,
                allowDelete: permissions.allowDelete,
                allowMove: permissions.allowMove,
                allowCreateSubDirs: permissions.allowCreateSubDirs,
                allowDeleteFiles: permissions.allowDeleteFiles,
                allowMoveFiles: permissions.allowMoveFiles,
                isProtected: input.protected || false,
                protectChildren: input.protectChildren || false
            })
            .returning();
        return directory;
    }

    async updateDirectory(directory: DirectoryEntity): Promise<DirectoryEntity | undefined> {
        const [updatedDirectory] = await db.update(storageDirectories)
            .set({
                path: directory.path,
                allowUploads: directory.allowUploads,
                allowDelete: directory.allowDelete,
                allowMove: directory.allowMove,
                allowCreateSubDirs: directory.allowCreateSubDirs,
                allowDeleteFiles: directory.allowDeleteFiles,
                allowMoveFiles: directory.allowMoveFiles,
                isProtected: directory.isProtected,
                protectChildren: directory.protectChildren
            })
            .where(eq(storageDirectories.id, directory.id))
            .returning();
        return updatedDirectory;
    }

    async deleteDirectory(path: string): Promise<boolean> {
        try {
            await db.delete(storageDirectories)
                .where(eq(storageDirectories.path, path));
            return true;
        } catch (error) {
            logger.error("Failed to delete directory:", error);
            return false;
        }
    }

    // File usage operations
    async getFileUsages(filePath: string): Promise<FileUsageEntity[]> {
        return await db
            .select()
            .from(fileUsages)
            .where(eq(fileUsages.filePath, filePath));
    }

    async isFileInUse(filePath: string): Promise<boolean> {
        const usages = await this.getFileUsages(filePath);
        return usages.length > 0;
    }

    async registerFileUsage(input: RegisterFileUsageInput): Promise<FileOperationResult> {
        try {
            // Check if file exists in DB, if not, add it
            const fileEntity = await this.fileByPath(input.filePath);
            if (!fileEntity) {
                try {
                    await this.createFile(input.filePath);
                    logger.info(`📁 Registered file in DB upon first usage: ${input.filePath}`);
                } catch (error) {
                    return {
                        success: false,
                        message: `Failed to register file from bucket: ${error}`
                    };
                }
            }

            await db.insert(fileUsages)
                .values({
                    id: sql`nextval('file_usage_id_seq')`,
                    filePath: input.filePath,
                    usageType: input.usageType,
                    referenceId: input.referenceId,
                    referenceTable: input.referenceTable,
                    created: new Date()
                });

            return {
                success: true,
                message: "File usage registered successfully"
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to register file usage: ${error}`
            };
        }
    }

    async unregisterFileUsage(filePath: string, usageType: string, referenceId: bigint): Promise<boolean> {
        try {
            await db.delete(fileUsages)
                .where(and(
                    eq(fileUsages.filePath, filePath),
                    eq(fileUsages.usageType, usageType),
                    eq(fileUsages.referenceId, referenceId)
                ));
            return true;
        } catch (error) {
            logger.error("Failed to unregister file usage:", error);
            return false;
        }
    }

    // Business logic methods
    async checkFileUsage(input: CheckFileUsageInput): Promise<FileUsageResult> {
        try {
            const isInUse = await this.isFileInUse(input.filePath);
            const usages = isInUse ? await this.getFileUsages(input.filePath) : [];
            
            return {
                isInUse,
                usages: usages.map(usage => ({
                    id: usage.id,
                    filePath: usage.filePath,
                    usageType: usage.usageType,
                    referenceId: usage.referenceId,
                    referenceTable: usage.referenceTable,
                    created: usage.created
                })),
                canDelete: !isInUse,
                deleteBlockReason: isInUse ? "File is currently being used" : undefined
            };
        } catch {
            return {
                isInUse: false,
                usages: [],
                canDelete: false,
                deleteBlockReason: "Unable to check file usage"
            };
        }
    }

    async updateDirectoryPermissions(input: UpdateDirectoryPermissionsInput): Promise<FileOperationResult> {
        try {
            const directory = await this.directoryByPath(input.path);
            if (!directory) {
                return {
                    success: false,
                    message: "Directory not found"
                };
            }

            const updatedDirectory = {
                ...directory,
                allowUploads: input.permissions.allowUploads,
                allowDelete: input.permissions.allowDelete,
                allowMove: input.permissions.allowMove,
                allowCreateSubDirs: input.permissions.allowCreateSubDirs,
                allowDeleteFiles: input.permissions.allowDeleteFiles,
                allowMoveFiles: input.permissions.allowMoveFiles
            };

            const updated = await this.updateDirectory(updatedDirectory);

            return {
                success: !!updated,
                message: updated ? "Directory permissions updated successfully" : "Failed to update directory permissions"
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to update permissions: ${error}`
            };
        }
    }

    async setProtection(input: SetStorageItemProtectionInput): Promise<FileOperationResult> {
        try {
            // Check if it's a file
            const file = await this.fileByPath(input.path);
            if (file) {
                const updatedFile = {
                    ...file,
                    isProtected: input.isProtected
                };
                const updated = await this.updateFile(updatedFile);
                return {
                    success: !!updated,
                    message: updated ? "File protection updated successfully" : "Failed to update file protection"
                };
            }

            // Check if it's a directory
            const directory = await this.directoryByPath(input.path);
            if (directory) {
                const updatedDirectory = {
                    ...directory,
                    isProtected: input.isProtected,
                    protectChildren: input.protectChildren || false
                };
                const updated = await this.updateDirectory(updatedDirectory);
                return {
                    success: !!updated,
                    message: updated ? "Directory protection updated successfully" : "Failed to update directory protection"
                };
            }

            return {
                success: false,
                message: "File or directory not found"
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to set protection: ${error}`
            };
        }
    }
}

export const storageDbService = new StorageDbServiceImpl();