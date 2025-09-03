package services

import config.GcsConfig
import schema.model.*
import util.determineFileType
import kotlinx.datetime.toLocalDateTime

interface StorageDbService {
    suspend fun getFileById(id: Long): File?
    suspend fun getFilesByIds(ids: List<Long>): List<File>
    suspend fun getFileByPath(path: String): File?
    suspend fun checkFileUsage(input: CheckFileUsageInput): FileUsageResult
    suspend fun updateDirectoryPermissions(input: UpdateDirectoryPermissionsInput): FileOperationResult
    suspend fun setProtection(input: SetStorageItemProtectionInput): FileOperationResult
    suspend fun registerFileUsage(input: RegisterFileUsageInput): FileOperationResult
    suspend fun unregisterFileUsage(input: UnregisterFileUsageInput): FileOperationResult
    suspend fun addFileFromBucket(
        path: String,
        name: String,
        directoryPath: String,
        size: Long,
        contentType: String?,
        md5Hash: String?
    ): File
}

fun storageDbService(
    storageRepository: repositories.StorageRepository,
    gcsConfig: GcsConfig
) = object : StorageDbService {

    override suspend fun getFileById(id: Long): File? {
        return storageRepository.getFileById(id)
    }

    override suspend fun getFilesByIds(ids: List<Long>): List<File> {
        return storageRepository.getFilesByIds(ids)
    }

    override suspend fun getFileByPath(path: String): File? {
        return storageRepository.getFileByPath(path)
    }

    override suspend fun checkFileUsage(input: CheckFileUsageInput): FileUsageResult {
        return try {
            val isInUse = storageRepository.isFileInUse(input.filePath)
            val usages = if (isInUse) {
                storageRepository.getFileUsages(input.filePath).map { usage ->
                    FileUsageInfo(
                        usageType = usage.usageType,
                        referenceId = usage.referenceId,
                        referenceTable = usage.referenceTable,
                        created = usage.created
                    )
                }
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
            val updated = storageRepository.updateDirectoryPermissions(input.path, input.permissions)
            if (updated) {
                val updatedDir = storageRepository.getDirectoryByPath(input.path)
                FileOperationResult(true, "Directory permissions updated successfully", updatedDir)
            } else {
                FileOperationResult(false, "Directory not found or permissions not updated", null)
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
                    // It's a file
                    val updated = storageRepository.setFileProtection(input.path, input.isProtected)
                    if (updated) {
                        val updatedFile = storageRepository.getFileByPath(input.path)
                        FileOperationResult(true, "File protection updated successfully", updatedFile)
                    } else {
                        FileOperationResult(false, "Failed to update file protection", null)
                    }
                }
                dbDir != null -> {
                    // It's a directory
                    val updated = storageRepository.setDirectoryProtection(input.path, input.isProtected, input.protectChildren)
                    if (updated) {
                        val updatedDir = storageRepository.getDirectoryByPath(input.path)
                        FileOperationResult(true, "Directory protection updated successfully", updatedDir)
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
            // Check if file exists
            val dbFile = storageRepository.getFileByPath(input.filePath)
            if (dbFile == null) {
                return FileOperationResult(false, "File not found: ${input.filePath}", null)
            }

            // Create file usage
            val usage = FileUsage(
                filePath = input.filePath,
                usageType = input.usageType,
                referenceId = input.referenceId,
                referenceTable = input.referenceTable,
                created = kotlinx.datetime.Clock.System.now().toLocalDateTime(kotlinx.datetime.TimeZone.UTC)
            )

            val registeredUsage = storageRepository.registerFileUsage(usage)

            FileOperationResult(true, "File usage registered successfully", dbFile)
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to register file usage: ${e.message}", null)
        }
    }

    override suspend fun unregisterFileUsage(input: UnregisterFileUsageInput): FileOperationResult {
        return try {
            val success = storageRepository.unregisterFileUsage(input.filePath, input.usageType, input.referenceId)
            if (success) {
                val dbFile = storageRepository.getFileByPath(input.filePath)
                FileOperationResult(true, "File usage unregistered successfully", dbFile)
            } else {
                FileOperationResult(false, "File usage not found or could not be removed", null)
            }
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to unregister file usage: ${e.message}", null)
        }
    }

    override suspend fun addFileFromBucket(
        path: String,
        name: String,
        directoryPath: String,
        size: Long,
        contentType: String?,
        md5Hash: String?
    ): File {
        return storageRepository.addFileFromBucket(
            path = path,
            name = name,
            directoryPath = directoryPath,
            size = size,
            contentType = contentType,
            md5Hash = md5Hash
        )
    }

}
