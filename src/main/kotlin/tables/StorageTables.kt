package tables

import org.jetbrains.exposed.v1.core.dao.id.IdTable
import org.jetbrains.exposed.v1.datetime.datetime

object StorageDirectories : IdTable<Long>("storage_directories") {
    override val id = long("id").autoIncrement().entityId()
    val path = varchar("path", 1024).uniqueIndex()
    val name = varchar("name", 255)
    val parentPath = varchar("parent_path", 1024).nullable()

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

    // Audit fields
    val created = datetime("created")
    val lastModified = datetime("last_modified")
    val createdBy = reference("created_by", Users.id).nullable()

    // Fallback flag
    val isFromBucket = bool("is_from_bucket").default(false)
}

object StorageFiles : IdTable<Long>("storage_files") {
    override val id = long("id").autoIncrement().entityId()
    val path = varchar("path", 1024).uniqueIndex()
    val name = varchar("name", 255)
    val directoryPath = varchar("directory_path", 1024)
    val size = long("size")
    val contentType = varchar("content_type", 255).nullable()
    val md5Hash = varchar("md5_hash", 32).nullable()

    // Protection flag
    val isProtected = bool("is_protected").default(false)

    // Audit fields
    val created = datetime("created")
    val lastModified = datetime("last_modified")
    val createdBy = reference("created_by", Users.id).nullable()

    // Fallback flag
    val isFromBucket = bool("is_from_bucket").default(false)
}

object FileUsages : IdTable<Long>("file_usages") {
    override val id = long("id").autoIncrement().entityId()
    val filePath = varchar("file_path", 1024)
    val usageType = varchar("usage_type", 100) // e.g., 'template_cover', 'certificate_image'
    val referenceId = long("reference_id") // ID of the entity using this file
    val referenceTable = varchar("reference_table", 100) // Table name of the entity
    val created = datetime("created")
}
