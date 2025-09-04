package services

import com.google.cloud.storage.Storage
import config.GcsConfig
import schema.model.*
import repositories.StorageRepository
import tables.FileEntity
import tables.DirectoryEntity

interface StorageDbService {
    suspend fun getFileById(id: Long): FileEntity?
    suspend fun getFilesByIds(ids: List<Long>): List<FileEntity>
    suspend fun getFileByPath(path: String): FileEntity?

    // Directory methods
    suspend fun getDirectoryByPath(path: String): DirectoryEntity?
    suspend fun getDirectoriesByParentPath(parentPath: String?): List<DirectoryEntity>
    suspend fun createDirectory(input: CreateFolderInput): DirectoryEntity
    suspend fun updateDirectory(directory: DirectoryEntity): DirectoryEntity?
    suspend fun deleteDirectory(path: String): Boolean

    // File operations
    suspend fun createFile(path: String, isProtected: Boolean = false): FileEntity
    suspend fun updateFile(file: FileEntity): FileEntity?
    suspend fun deleteFile(path: String): Boolean

    // File usage and other methods
    suspend fun isFileInUse(filePath: String): Boolean
    suspend fun getFileUsages(filePath: String): List<tables.FileUsageEntity>
    suspend fun checkFileUsage(input: CheckFileUsageInput): FileUsageResult
    suspend fun updateDirectoryPermissions(input: UpdateDirectoryPermissionsInput): FileOperationResult
    suspend fun setProtection(input: SetStorageItemProtectionInput): FileOperationResult
    suspend fun registerFileUsage(input: RegisterFileUsageInput): FileOperationResult
    suspend fun createFile(
        path: String,
        name: String,
        directoryPath: String,
        size: Long,
        contentType: String?,
        md5Hash: String?
    ): FileEntity
}

fun storageDbService(
    storageRepository: StorageRepository,
    gcsConfig: GcsConfig,
    storage: Storage
) = object : StorageDbService {

    override suspend fun getFileById(id: Long): FileEntity? {
        return storageRepository.getFileById(id)
    }

    override suspend fun getFilesByIds(ids: List<Long>): List<FileEntity> {
        return storageRepository.getFilesByIds(ids)
    }

    override suspend fun getFileByPath(path: String): FileEntity? {
        return storageRepository.getFileByPath(path)
    }

    // File operations
    override suspend fun createFile(path: String, isProtected: Boolean): FileEntity {
        return storageRepository.createFile(path, isProtected)
    }

    override suspend fun updateFile(file: FileEntity): FileEntity? {
        return storageRepository.updateFile(file)
    }

    override suspend fun deleteFile(path: String): Boolean {
        return storageRepository.deleteFile(path)
    }

    // Directory methods
    override suspend fun getDirectoryByPath(path: String): DirectoryEntity? {
        return storageRepository.getDirectoryByPath(path)
    }

    override suspend fun getDirectoriesByParentPath(parentPath: String?): List<DirectoryEntity> {
        return storageRepository.getDirectoriesByParentPath(parentPath)
    }

    override suspend fun createDirectory(input: CreateFolderInput): DirectoryEntity {
        return storageRepository.createDirectory(input)
    }

    override suspend fun updateDirectory(directory: DirectoryEntity): DirectoryEntity? {
        return storageRepository.updateDirectory(directory)
    }

    override suspend fun deleteDirectory(path: String): Boolean {
        return storageRepository.deleteDirectory(path)
    }

    // File usage methods
    override suspend fun isFileInUse(filePath: String): Boolean {
        return storageRepository.isFileInUse(filePath)
    }

    override suspend fun getFileUsages(filePath: String): List<tables.FileUsageEntity> {
        return storageRepository.getFileUsages(filePath)
    }

    override suspend fun checkFileUsage(input: CheckFileUsageInput): FileUsageResult {
        return try {
            val isInUse = storageRepository.isFileInUse(input.filePath)
            val usages = if (isInUse) {
                storageRepository.getFileUsages(input.filePath).map { it.toFileUsageInfo() }
            } else {
                emptyList()
            }

            FileUsageResult(
                isInUse = isInUse,
                usages = usages,
                canDelete = !isInUse,
                deleteBlockReason = if (isInUse) "File is currently being used" else null
            )
        } catch (_: Exception) {
            FileUsageResult(
                isInUse = false,
                usages = emptyList(),
                canDelete = false,
                deleteBlockReason = "Unable to check file usage"
            )
        }
    }

    override suspend fun updateDirectoryPermissions(input: UpdateDirectoryPermissionsInput): FileOperationResult {
        return try {
            val directory = storageRepository.getDirectoryByPath(input.path)
            if (directory != null) {
                // Update the directory permissions
                directory.allowUploads = input.permissions.allowUploads
                directory.allowDelete = input.permissions.allowDelete
                directory.allowMove = input.permissions.allowMove
                directory.allowCreateSubDirs = input.permissions.allowCreateSubDirs
                directory.allowDeleteFiles = input.permissions.allowDeleteFiles
                directory.allowMoveFiles = input.permissions.allowMoveFiles

                val updated = storageRepository.updateDirectory(directory)
                if (updated != null) {
                    FileOperationResult(true, "Directory permissions updated successfully", null)
                } else {
                    FileOperationResult(false, "Failed to update directory permissions", null)
                }
            } else {
                FileOperationResult(false, "Directory not found", null)
            }
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to update permissions: ${e.message}", null)
        }
    }

    override suspend fun setProtection(input: SetStorageItemProtectionInput): FileOperationResult {
        return try {
            // Check if it's a file or directory
            val dbFile = storageRepository.getFileByPath(input.path)
            val dbDir = storageRepository.getDirectoryByPath(input.path)

            when {
                dbFile != null -> {
                    // It's a file - update the file protection
                    dbFile.isProtected = input.isProtected
                    val updated = storageRepository.updateFile(dbFile)
                    if (updated != null) {
                        FileOperationResult(true, "File protection updated successfully", null)
                    } else {
                        FileOperationResult(false, "Failed to update file protection", null)
                    }
                }

                dbDir != null -> {
                    // It's a directory - update the directory protection
                    dbDir.isProtected = input.isProtected
                    dbDir.protectChildren = input.protectChildren
                    val updated = storageRepository.updateDirectory(dbDir)
                    if (updated != null) {
                        FileOperationResult(true, "Directory protection updated successfully", null)
                    } else {
                        FileOperationResult(false, "Failed to update directory protection", null)
                    }
                }

                else -> {
                    FileOperationResult(false, "File or directory not found in database", null)
                }
            }
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to set protection: ${e.message}", null)
        }
    }

    override suspend fun registerFileUsage(input: RegisterFileUsageInput): FileOperationResult {
        return try {
            // Check if file exists in DB, if not, add it from bucket
            val fileEntity = storageRepository.getFileByPath(input.filePath)
            if (fileEntity == null) {
                // File not in DB, try to add it from bucket
                try {
                    storage.get(gcsConfig.bucketName, input.filePath) ?: return FileOperationResult(
                        false,
                        "File not found in bucket: ${input.filePath}",
                        null
                    )

                    storageRepository.createFile(input.filePath)
                    println("📁 Registered file in DB upon first usage: ${input.filePath}")
                } catch (e: Exception) {
                    return FileOperationResult(false, "Failed to register file from bucket: ${e.message}", null)
                }
            }

            storageRepository.registerFileUsage(input)

            FileOperationResult(true, "File usage registered successfully", null)
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to register file usage: ${e.message}", null)
        }
    }

    override suspend fun createFile(
        path: String,
        name: String,
        directoryPath: String,
        size: Long,
        contentType: String?,
        md5Hash: String?
    ): FileEntity {
        val fileEntity = storageRepository.createFile(path)
        return fileEntity
    }

}
