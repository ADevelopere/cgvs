package repositories

import schema.model.*
import tables.*
import kotlinx.datetime.LocalDateTime

interface StorageRepository {
    // Directory operations
    suspend fun getDirectoryByPath(path: String): DirectoryEntity?
    suspend fun createDirectory(directory: DirectoryEntity): DirectoryEntity
    suspend fun updateDirectory(directory: DirectoryEntity): DirectoryEntity?
    suspend fun deleteDirectory(path: String): Boolean
    suspend fun getDirectoriesByParentPath(parentPath: String?): List<DirectoryEntity>
    suspend fun updateDirectoryPermissions(path: String, permissions: DirectoryPermissions): Boolean
    suspend fun setDirectoryProtection(path: String, isProtected: Boolean, protectChildren: Boolean): Boolean
    
    // File operations
    suspend fun getFileByPath(path: String): FileEntity?
    suspend fun getFileById(id: Long): FileEntity?
    suspend fun getFilesByIds(ids: List<Long>): List<FileEntity>
    suspend fun createFile(file: FileEntity): FileEntity
    suspend fun updateFile(file: FileEntity): FileEntity?
    suspend fun deleteFile(path: String): Boolean
    suspend fun getFilesByDirectoryPath(directoryPath: String): List<FileEntity>
    suspend fun setFileProtection(path: String, isProtected: Boolean): Boolean
    
    // File usage operations
    suspend fun registerFileUsage(usage: FileUsage): FileUsage
    suspend fun unregisterFileUsage(filePath: String, usageType: String, referenceId: Long): Boolean
    suspend fun getFileUsages(filePath: String): List<FileUsage>
    suspend fun isFileInUse(filePath: String): Boolean
    suspend fun getUsagesByReference(referenceTable: String, referenceId: Long): List<FileUsage>
    
    // Fallback operations for bucket-only items
    suspend fun addDirectoryFromBucket(path: String): DirectoryEntity
    suspend fun addFileFromBucket(
        path: String, 
        name: String, 
        directoryPath: String, 
        size: Long, 
        contentType: String?, 
        md5Hash: String?
    ): FileEntity
    
    // Bulk operations
    suspend fun getDirectoriesWithProtection(): List<DirectoryEntity>
    suspend fun getFilesWithProtection(): List<FileEntity>
    suspend fun cleanupOrphanedUsages(): Int // Remove usages for non-existent files
    
    // Statistics
    suspend fun getDirectoryCount(): Long
    suspend fun getFileCount(): Long
    suspend fun getTotalFileSize(): Long
}