package repositories.impl

import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.*
import repositories.StorageRepository
import schema.model.*
import tables.*
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class StorageRepositoryImpl : StorageRepository {

    override suspend fun getDirectoryByPath(path: String): DirectoryEntity? = dbQuery {
        StorageDirectories.selectAll()
            .where { StorageDirectories.path eq path }
            .singleOrNull()
            ?.let(::mapDirectoryRow)
    }

    override suspend fun createDirectory(directory: DirectoryEntity): DirectoryEntity = dbQuery {
        val insertStatement = StorageDirectories.insert {
            it[path] = directory.path
            it[name] = directory.name
            it[parentPath] = directory.parentPath
            it[allowUploads] = directory.permissions.allowUploads
            it[allowDelete] = directory.permissions.allowDelete
            it[allowMove] = directory.permissions.allowMove
            it[allowCreateSubDirs] = directory.permissions.allowCreateSubdirs
            it[allowDeleteFiles] = directory.permissions.allowDeleteFiles
            it[allowMoveFiles] = directory.permissions.allowMoveFiles
            it[isProtected] = directory.isProtected
            it[protectChildren] = directory.protectChildren
            it[created] = directory.created
            it[lastModified] = directory.lastModified
            it[createdBy] = directory.createdBy?.toInt()
            it[isFromBucket] = directory.isFromBucket
        }
        val id = insertStatement[StorageDirectories.id]
        directory.copy(id = id)
    }

    override suspend fun updateDirectory(directory: DirectoryEntity): DirectoryEntity? = dbQuery {
        val rowsUpdated = StorageDirectories.update({ StorageDirectories.path eq directory.path }) {
            it[name] = directory.name
            it[parentPath] = directory.parentPath
            it[allowUploads] = directory.permissions.allowUploads
            it[allowDelete] = directory.permissions.allowDelete
            it[allowMove] = directory.permissions.allowMove
            it[allowCreateSubDirs] = directory.permissions.allowCreateSubdirs
            it[allowDeleteFiles] = directory.permissions.allowDeleteFiles
            it[allowMoveFiles] = directory.permissions.allowMoveFiles
            it[isProtected] = directory.isProtected
            it[protectChildren] = directory.protectChildren
            it[lastModified] = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
        }
        if (rowsUpdated > 0) directory else null
    }

    override suspend fun deleteDirectory(path: String): Boolean = dbQuery {
        StorageDirectories.deleteWhere { StorageDirectories.path eq path } > 0
    }

    override suspend fun getDirectoriesByParentPath(parentPath: String?): List<DirectoryEntity> = dbQuery {
        StorageDirectories.selectAll()
            .where {
                if (parentPath == null) StorageDirectories.parentPath.isNull()
                else StorageDirectories.parentPath eq parentPath
            }
            .map(::mapDirectoryRow)
    }

    override suspend fun updateDirectoryPermissions(path: String, permissions: DirectoryPermissions): Boolean =
        transaction {
            StorageDirectories.update({ StorageDirectories.path eq path }) {
                it[allowUploads] = permissions.allowUploads
                it[allowDelete] = permissions.allowDelete
                it[allowMove] = permissions.allowMove
                it[allowCreateSubDirs] = permissions.allowCreateSubdirs
                it[allowDeleteFiles] = permissions.allowDeleteFiles
                it[allowMoveFiles] = permissions.allowMoveFiles
                it[lastModified] = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
            } > 0
        }

    override suspend fun setDirectoryProtection(path: String, isProtected: Boolean, protectChildren: Boolean): Boolean =
        transaction {
            StorageDirectories.update({ StorageDirectories.path eq path }) {
                it[StorageDirectories.isProtected] = isProtected
                it[StorageDirectories.protectChildren] = protectChildren
                it[lastModified] = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
            } > 0
        }

    // File operations
    override suspend fun getFileByPath(path: String): FileEntity? = dbQuery {
        StorageFiles.selectAll().where { StorageFiles.path eq path }.singleOrNull()?.let(::mapFileRow)
    }

    override suspend fun getFileById(id: Long): FileEntity? = dbQuery {
        StorageFiles.selectAll().where { StorageFiles.id eq id }.singleOrNull()?.let(::mapFileRow)
    }

    override suspend fun getFilesByIds(ids: List<Long>): List<FileEntity> = dbQuery {
        StorageFiles.selectAll().where { StorageFiles.id inList ids }.map(::mapFileRow)
    }

    override suspend fun createFile(file: FileEntity): FileEntity = transaction {
        val insertStatement = StorageFiles.insert {
            it[path] = file.path
            it[name] = file.name
            it[directoryPath] = file.directoryPath
            it[size] = file.size
            it[contentType] = file.contentType
            it[md5Hash] = file.md5Hash
            it[isProtected] = file.isProtected
            it[created] = file.created
            it[lastModified] = file.lastModified
            it[createdBy] = file.createdBy?.toInt()
            it[isFromBucket] = file.isFromBucket
        }
        val id = insertStatement[StorageFiles.id]
        file.copy(id = id)
    }

    override suspend fun updateFile(file: FileEntity): FileEntity? = transaction {
        val rowsUpdated = StorageFiles.update({ StorageFiles.path eq file.path }) {
            it[name] = file.name
            it[directoryPath] = file.directoryPath
            it[size] = file.size
            it[contentType] = file.contentType
            it[md5Hash] = file.md5Hash
            it[isProtected] = file.isProtected
            it[lastModified] = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
        }
        if (rowsUpdated > 0) file else null
    }

    override suspend fun deleteFile(path: String): Boolean = transaction {
        StorageFiles.deleteWhere { StorageFiles.path eq path } > 0
    }

    override suspend fun getFilesByDirectoryPath(directoryPath: String): List<FileEntity> = transaction {
        StorageFiles.selectAll().where { StorageFiles.directoryPath eq directoryPath }
            .map(::mapFileRow)
    }

    override suspend fun setFileProtection(path: String, isProtected: Boolean): Boolean = transaction {
        StorageFiles.update({ StorageFiles.path eq path }) {
            it[StorageFiles.isProtected] = isProtected
            it[lastModified] = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
        } > 0
    }

    // File usage operations
    override suspend fun registerFileUsage(usage: FileUsage): FileUsage = transaction {
        val insertStatement = FileUsages.insert {
            it[filePath] = usage.filePath
            it[usageType] = usage.usageType
            it[referenceId] = usage.referenceId
            it[referenceTable] = usage.referenceTable
            it[created] = usage.created
        }
        val id = insertStatement[FileUsages.id]
        usage.copy(id = id)
    }

    override suspend fun unregisterFileUsage(filePath: String, usageType: String, referenceId: Long): Boolean =
        transaction {
            FileUsages.deleteWhere {
                (FileUsages.filePath eq filePath) and (FileUsages.usageType eq usageType) and (FileUsages.referenceId eq referenceId)
            } > 0
        }

    override suspend fun getFileUsages(filePath: String): List<FileUsage> = transaction {
        FileUsages.selectAll().where { FileUsages.filePath eq filePath }
            .map(::mapFileUsageRow)
    }

    override suspend fun isFileInUse(filePath: String): Boolean = transaction {
        FileUsages.selectAll().where { FileUsages.filePath eq filePath }.count() > 0
    }

    override suspend fun getUsagesByReference(referenceTable: String, referenceId: Long): List<FileUsage> =
        transaction {
            FileUsages.selectAll().where {
                (FileUsages.referenceTable eq referenceTable) and
                    (FileUsages.referenceId eq referenceId)
            }.map(::mapFileUsageRow)
        }

    // Fallback operations
    override suspend fun addDirectoryFromBucket(path: String, name: String, parentPath: String?): DirectoryEntity {
        val now = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
        val directory = DirectoryEntity(
            path = path,
            name = name,
            parentPath = parentPath,
            permissions = DirectoryPermissions(),
            isProtected = false,
            protectChildren = false,
            created = now,
            lastModified = now,
            createdBy = null,
            isFromBucket = true
        )
        return createDirectory(directory)
    }

    override suspend fun addFileFromBucket(
        path: String,
        name: String,
        directoryPath: String,
        size: Long,
        contentType: String?,
        md5Hash: String?
    ): FileEntity {
        val now = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
        val file = FileEntity(
            path = path,
            name = name,
            directoryPath = directoryPath,
            size = size,
            contentType = contentType,
            md5Hash = md5Hash,
            isProtected = false,
            created = now,
            lastModified = now,
            createdBy = null,
            isFromBucket = true
        )
        return createFile(file)
    }

    // Bulk operations
    override suspend fun getDirectoriesWithProtection(): List<DirectoryEntity> = transaction {
        StorageDirectories.selectAll().where { StorageDirectories.isProtected eq true }
            .map(::mapDirectoryRow)
    }

    override suspend fun getFilesWithProtection(): List<FileEntity> = transaction {
        StorageFiles.selectAll().where { StorageFiles.isProtected eq true }
            .map(::mapFileRow)
    }

    override suspend fun cleanupOrphanedUsages(): Int = transaction {
        // This would ideally join with StorageFiles to find orphaned usages
        // For now, return 0 as a placeholder
        0
    }

    // Statistics
    override suspend fun getDirectoryCount(): Long = transaction {
        StorageDirectories.selectAll().count()
    }

    override suspend fun getFileCount(): Long = transaction {
        StorageFiles.selectAll().count()
    }

    override suspend fun getTotalFileSize(): Long = transaction {
        StorageFiles.selectAll().sumOf { it[StorageFiles.size] }
    }

    // Mapping functions
    private fun mapDirectoryRow(row: ResultRow): DirectoryEntity = DirectoryEntity(
        id = row[StorageDirectories.id],
        path = row[StorageDirectories.path],
        name = row[StorageDirectories.name],
        parentPath = row[StorageDirectories.parentPath],
        permissions = DirectoryPermissions(
            allowUploads = row[StorageDirectories.allowUploads],
            allowDelete = row[StorageDirectories.allowDelete],
            allowMove = row[StorageDirectories.allowMove],
            allowCreateSubdirs = row[StorageDirectories.allowCreateSubDirs],
            allowDeleteFiles = row[StorageDirectories.allowDeleteFiles],
            allowMoveFiles = row[StorageDirectories.allowMoveFiles]
        ),
        isProtected = row[StorageDirectories.isProtected],
        protectChildren = row[StorageDirectories.protectChildren],
        created = row[StorageDirectories.created],
        lastModified = row[StorageDirectories.lastModified],
        createdBy = row[StorageDirectories.createdBy]?.toLong(),
        isFromBucket = row[StorageDirectories.isFromBucket]
    )

    private fun mapFileRow(row: ResultRow): FileEntity = FileEntity(
        id = row[StorageFiles.id],
        path = row[StorageFiles.path],
        name = row[StorageFiles.name],
        directoryPath = row[StorageFiles.directoryPath],
        size = row[StorageFiles.size],
        contentType = row[StorageFiles.contentType],
        md5Hash = row[StorageFiles.md5Hash],
        isProtected = row[StorageFiles.isProtected],
        created = row[StorageFiles.created],
        lastModified = row[StorageFiles.lastModified],
        createdBy = row[StorageFiles.createdBy]?.toLong(),
        isFromBucket = row[StorageFiles.isFromBucket]
    )

    private fun mapFileUsageRow(row: ResultRow): FileUsage = FileUsage(
        id = row[FileUsages.id],
        filePath = row[FileUsages.filePath],
        usageType = row[FileUsages.usageType],
        referenceId = row[FileUsages.referenceId],
        referenceTable = row[FileUsages.referenceTable],
        created = row[FileUsages.created]
    )

    // Helper function for database queries
    private suspend fun <T> dbQuery(block: () -> T): T =
        withContext(Dispatchers.IO) {
            transaction {
                block()
            }
        }
}
