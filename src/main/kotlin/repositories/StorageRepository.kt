package repositories

import schema.model.CreateFolderInput
import schema.model.RegisterFileUsageInput
import tables.DirectoryEntity
import tables.FileEntity
import tables.FileUsageEntity

data class CreateDirectoryInput(
    val path: String,
    val allowUploads: Boolean = true,
    val allowDelete: Boolean = true,
    val allowMove: Boolean = true,
    val allowCreateSubDirs: Boolean = true,
    val allowDeleteFiles: Boolean = true,
    val allowMoveFiles: Boolean = true,
    val isProtected: Boolean = false,
    val protectChildren: Boolean = false
)

interface StorageRepository {
    // Directory operations
    suspend fun getDirectoryByPath(path: String): DirectoryEntity?
    suspend fun getDirectoriesByParentPath(parentPath: String?): List<DirectoryEntity>

    suspend fun createDirectory(input: CreateFolderInput): DirectoryEntity
    suspend fun updateDirectory(directory: DirectoryEntity): DirectoryEntity?
    suspend fun deleteDirectory(path: String): Boolean

    // File operations
    suspend fun getFileByPath(path: String): FileEntity?
    suspend fun getFileById(id: Long): FileEntity?
    suspend fun getFilesByIds(ids: List<Long>): List<FileEntity>
    suspend fun getFilesByDirectoryPath(directoryPath: String): List<FileEntity>
    suspend fun getFileCount(): Long

    suspend fun createFile(path: String, isProtected: Boolean = false): FileEntity
    suspend fun updateFile(file: FileEntity): FileEntity?
    suspend fun deleteFile(path: String): Boolean

    // File usage operations
    suspend fun getFileUsages(filePath: String): List<FileUsageEntity>
    suspend fun getUsagesByReference(referenceTable: String, referenceId: Long): List<FileUsageEntity>
    suspend fun isFileInUse(filePath: String): Boolean

    suspend fun registerFileUsage(input: RegisterFileUsageInput): FileUsageEntity
    suspend fun unregisterFileUsage(filePath: String, usageType: String, referenceId: Long): Boolean
}
