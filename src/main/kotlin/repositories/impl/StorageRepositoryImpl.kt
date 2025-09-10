package repositories.impl

import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import repositories.StorageRepository
import tables.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.core.inList
import org.jetbrains.exposed.v1.core.like
import org.jetbrains.exposed.v1.core.notLike
import schema.model.CreateFolderInput
import schema.model.RegisterFileUsageInput
import util.now

class StorageRepositoryImpl(
    private val database: Database
) : StorageRepository {

    // Directory operations
    override suspend fun getDirectoryByPath(path: String): DirectoryEntity? = dbQuery {
        DirectoryEntity.find { StorageDirectories.path eq path }.singleOrNull()
    }

    override suspend fun getDirectoriesByParentPath(parentPath: String?): List<DirectoryEntity> = dbQuery {
        if (parentPath == null) {
            // Get root directories (those that don't contain "/" or only have root level paths)
            DirectoryEntity.find { StorageDirectories.path.notLike("%/%") }.toList()
        } else {
            // Get direct children of the parent path
            DirectoryEntity.find {
                StorageDirectories.path.like("$parentPath/%") and
                    StorageDirectories.path.notLike("$parentPath/%/%")
            }.toList()
        }
    }

    override suspend fun createDirectory(input: CreateFolderInput): DirectoryEntity = dbQuery {
        // Check if the directory already exists
        DirectoryEntity.find { StorageDirectories.path eq input.path }.singleOrNull()
            ?: DirectoryEntity.new {
                path = input.path
                allowUploads = input.permissions?.allowUploads == true
                allowDelete = input.permissions?.allowDelete == true
                allowMove = input.permissions?.allowMove == true
                allowCreateSubDirs = input.permissions?.allowCreateSubDirs == true
                allowDeleteFiles = input.permissions?.allowDeleteFiles == true
                allowMoveFiles = input.permissions?.allowMoveFiles == true
                isProtected = input.protected == true
                protectChildren = input.protectChildren == true
            }
    }

    override suspend fun updateDirectory(directory: DirectoryEntity): DirectoryEntity? = dbQuery {
        try {
            // The entity is already managed by the DAO, so changes are automatically persisted
            // Just flush the changes to ensure they're committed
            directory.flush()
            directory
        } catch (_: Exception) {
            null
        }
    }

    override suspend fun deleteDirectory(path: String): Boolean = dbQuery {
        val directory = DirectoryEntity.find { StorageDirectories.path eq path }.singleOrNull()
        if (directory != null) {
            directory.delete()
            true
        } else {
            false
        }
    }

    // File operations
    override suspend fun getFileByPath(path: String): FileEntity? = dbQuery {
        FileEntity.find { StorageFiles.path eq path }.singleOrNull()
    }

    override suspend fun getFileById(id: Long): FileEntity? = dbQuery {
        FileEntity.findById(id)
    }

    override suspend fun filesByIds(ids: List<Long>): List<FileEntity> = dbQuery {
        FileEntity.find { StorageFiles.id inList ids }.toList().sortedBy { ids.indexOf(it.id.value) }
    }

    override suspend fun getFilesByDirectoryPath(directoryPath: String): List<FileEntity> = dbQuery {
        FileEntity.find { StorageFiles.path.like("$directoryPath/%") }.toList()
    }

    override suspend fun getFileCount(): Long = dbQuery {
        FileEntity.count()
    }

    override suspend fun createFile(path: String, isProtected: Boolean): FileEntity = dbQuery {
        // Check if the file already exists
        FileEntity.find { StorageFiles.path eq path }.singleOrNull()
            ?: FileEntity.new {
                this.path = path
                this.isProtected = isProtected
            }
    }

    override suspend fun updateFile(file: FileEntity): FileEntity? = dbQuery {
        try {
            // The entity is already managed by the DAO, so changes are automatically persisted
            file.flush()
            file
        } catch (_: Exception) {
            null
        }
    }

    override suspend fun deleteFile(path: String): Boolean = dbQuery {
        val file = FileEntity.find { StorageFiles.path eq path }.singleOrNull()
        if (file != null) {
            file.delete()
            true
        } else {
            false
        }
    }

    // File usage operations
    override suspend fun getFileUsages(filePath: String): List<FileUsageEntity> = dbQuery {
        FileUsageEntity.find { FileUsages.filePath eq filePath }.toList()
    }

    override suspend fun getUsagesByReference(referenceTable: String, referenceId: Long): List<FileUsageEntity> =
        dbQuery {
            FileUsageEntity.find {
                (FileUsages.referenceTable eq referenceTable) and (FileUsages.referenceId eq referenceId)
            }.toList()
        }

    override suspend fun isFileInUse(filePath: String): Boolean = dbQuery {
        FileUsageEntity.find { FileUsages.filePath eq filePath }.count() > 0
    }

    override suspend fun registerFileUsage(input: RegisterFileUsageInput): FileUsageEntity = dbQuery {
        FileUsageEntity.new {
            filePath = input.filePath
            usageType = input.usageType
            referenceId = input.referenceId
            referenceTable = input.referenceTable
            created = now()
        }
    }

    override suspend fun unregisterFileUsage(filePath: String, usageType: String, referenceId: Long): Boolean =
        dbQuery {
            val usage = FileUsageEntity.find {
                (FileUsages.filePath eq filePath) and
                    (FileUsages.usageType eq usageType) and
                    (FileUsages.referenceId eq referenceId)
            }.singleOrNull()

            if (usage != null) {
                usage.delete()
                true
            } else {
                false
            }
        }


    /**
     * A helper function to execute a database transaction on a dedicated IO thread pool
     */
    private suspend fun <T> dbQuery(block: () -> T): T =
        withContext(Dispatchers.IO) {
            transaction(database) {
                block()
            }
        }
}
