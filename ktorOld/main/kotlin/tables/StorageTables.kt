package tables

import org.jetbrains.exposed.v1.dao.LongEntity
import org.jetbrains.exposed.v1.dao.LongEntityClass
import org.jetbrains.exposed.v1.datetime.datetime
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.LongIdTable
import schema.model.FileUsageInfo

object StorageDirectories : LongIdTable("storage_directories") {
    val path = varchar("path", 1024).uniqueIndex()

    // Directory permissions
    val allowUploads = bool("allow_uploads").default(true)
    val allowDelete = bool("allow_delete").default(true)
    val allowMove = bool("allow_move").default(true)
    val allowCreateSubDirs = bool("allow_create_subDirs").default(true)
    val allowDeleteFiles = bool("allow_delete_files").default(true)
    val allowMoveFiles = bool("allow_move_files").default(true)

    // Protection flags
    val isProtected = bool("is_protected").default(false)
    val protectChildren = bool("protect_children").default(false)
}

object StorageFiles : LongIdTable("storage_files") {
    val path = varchar("path", 1024).uniqueIndex()

    // Protection flag
    val isProtected = bool("is_protected").default(false)
}

object FileUsages : LongIdTable("file_usages") {
    val filePath = varchar("file_path", 1024)
    val usageType = varchar("usage_type", 100) // e.g., 'template_cover', 'certificate_image'
    val referenceId = long("reference_id") // ID of the entity using this file
    val referenceTable = varchar("reference_table", 100) // Table name of the entity
    val created = datetime("created")
}

// DAO Entity Classes
class DirectoryEntity(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<DirectoryEntity>(StorageDirectories)

    var path by StorageDirectories.path
    var allowUploads by StorageDirectories.allowUploads
    var allowDelete by StorageDirectories.allowDelete
    var allowMove by StorageDirectories.allowMove
    var allowCreateSubDirs by StorageDirectories.allowCreateSubDirs
    var allowDeleteFiles by StorageDirectories.allowDeleteFiles
    var allowMoveFiles by StorageDirectories.allowMoveFiles
    var isProtected by StorageDirectories.isProtected
    var protectChildren by StorageDirectories.protectChildren
}

class FileEntity(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<FileEntity>(StorageFiles)

    var path by StorageFiles.path
    var isProtected by StorageFiles.isProtected
}

class FileUsageEntity(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<FileUsageEntity>(FileUsages)

    var filePath by FileUsages.filePath
    var usageType by FileUsages.usageType
    var referenceId by FileUsages.referenceId
    var referenceTable by FileUsages.referenceTable
    var created by FileUsages.created

    fun toFileUsageInfo() = FileUsageInfo(
        id = this.id.value,
        filePath = this.filePath,
        usageType = this.usageType,
        referenceId = this.referenceId,
        referenceTable = this.referenceTable,
        created = this.created
    )
}
