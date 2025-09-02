package services

import config.GcsConfig
import schema.model.*
import util.determineFileType
import kotlinx.datetime.toLocalDateTime

interface StorageDbService {
    suspend fun getFileInfoById(id: Long): FileInfo?
    suspend fun getFileInfosByIds(ids: List<Long>): List<FileInfo>
    suspend fun getFileEntityById(id: Long): FileEntity?
    suspend fun getFileEntityByPath(path: String): FileEntity?
    suspend fun checkFileUsage(input: CheckFileUsageInput): FileUsageResult
    suspend fun updateDirectoryPermissions(input: UpdateDirectoryPermissionsInput): FileOperationResult
    suspend fun setProtection(input: SetProtectionInput): FileOperationResult
    suspend fun registerFileUsage(input: RegisterFileUsageInput): FileOperationResult
    suspend fun unregisterFileUsage(input: UnregisterFileUsageInput): FileOperationResult
    suspend fun addFileFromBucket(
        path: String,
        name: String,
        directoryPath: String,
        size: Long,
        contentType: String?,
        md5Hash: String?
    ): FileEntity
}

fun storageDbService(
    storageRepository: repositories.StorageRepository,
    gcsConfig: GcsConfig
) = object : StorageDbService {

    override suspend fun getFileInfoById(id: Long): FileInfo? {
        return storageRepository.getFileById(id)?.let { fileEntityToFileInfo(it) }
    }

    override suspend fun getFileInfosByIds(ids: List<Long>): List<FileInfo> {
        return storageRepository.getFilesByIds(ids).map { fileEntityToFileInfo(it) }
    }

    override suspend fun getFileEntityById(id: Long): FileEntity? {
        return storageRepository.getFileById(id)
    }

    override suspend fun getFileEntityByPath(path: String): FileEntity? {
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
                val folderInfo = updatedDir?.let { directoryEntityToFolderInfo(it) }
                FileOperationResult(true, "Directory permissions updated successfully", folderInfo)
            } else {
                FileOperationResult(false, "Directory not found or permissions not updated", null)
            }
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to update permissions: ${e.message}", null)
        }
    }

    override suspend fun setProtection(input: SetProtectionInput): FileOperationResult {
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
                        val fileInfo = updatedFile?.let { fileEntityToFileInfo(it) }
                        FileOperationResult(true, "File protection updated successfully", fileInfo)
                    } else {
                        FileOperationResult(false, "Failed to update file protection", null)
                    }
                }
                dbDir != null -> {
                    // It's a directory
                    val updated = storageRepository.setDirectoryProtection(input.path, input.isProtected, input.protectChildren)
                    if (updated) {
                        val updatedDir = storageRepository.getDirectoryByPath(input.path)
                        val folderInfo = updatedDir?.let { directoryEntityToFolderInfo(it) }
                        FileOperationResult(true, "Directory protection updated successfully", folderInfo)
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
            val fileInfo = fileEntityToFileInfo(dbFile)
            
            FileOperationResult(true, "File usage registered successfully", fileInfo)
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to register file usage: ${e.message}", null)
        }
    }

    override suspend fun unregisterFileUsage(input: UnregisterFileUsageInput): FileOperationResult {
        return try {
            val success = storageRepository.unregisterFileUsage(input.filePath, input.usageType, input.referenceId)
            if (success) {
                val dbFile = storageRepository.getFileByPath(input.filePath)
                val fileInfo = dbFile?.let { fileEntityToFileInfo(it) }
                FileOperationResult(true, "File usage unregistered successfully", fileInfo)
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
    ): FileEntity {
        return storageRepository.addFileFromBucket(
            path = path,
            name = name,
            directoryPath = directoryPath,
            size = size,
            contentType = contentType,
            md5Hash = md5Hash
        )
    }

    // Helper functions
    private fun directoryEntityToFolderInfo(dir: DirectoryEntity): FolderInfo {
        return FolderInfo(
            name = dir.name,
            path = dir.path,
            permissions = dir.permissions,
            isProtected = dir.isProtected,
            protectChildren = dir.protectChildren,
            fileCount = 0, // Could be populated with actual count if needed
            folderCount = 0, // Could be populated with actual count if needed
            totalSize = 0, // Could be populated with actual size if needed
            created = dir.created,
            lastModified = dir.lastModified,
            isFromBucketOnly = dir.isFromBucket
        )
    }

    private fun fileEntityToFileInfo(file: FileEntity): FileInfo {
        return FileInfo(
            name = file.name,
            path = file.path,
            size = file.size,
            contentType = file.contentType,
            fileType = determineFileType(ContentType.entries.find { it.value == file.contentType }),
            lastModified = file.lastModified,
            created = file.created,
            url = gcsConfig.baseUrl + file.path,
            mediaLink = null,
            md5Hash = file.md5Hash,
            isPublic = file.path.startsWith("public/"),
            isProtected = file.isProtected,
            isInUse = false, // Could be populated if needed
            usages = emptyList(), // Could be populated if needed
            isFromBucketOnly = file.isFromBucket
        )
    }
}
