package schema.model

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import kotlinx.datetime.LocalDateTime
import kotlinx.serialization.Serializable
import util.now

// Combined storage objects
@Serializable
@GraphQLIgnore
@GraphQLDescription("Directory with complete information")
data class DirectoryInfo(
    @param:GraphQLDescription("Full path of the directory")
    override val path: String,
    @param:GraphQLDescription("Whether this directory is protected from deletion")
    override val isProtected: Boolean = false,
    @param:GraphQLDescription("Directory permissions")
    val permissions: DirectoryPermissions = DirectoryPermissions(),
    @param:GraphQLDescription("Whether children are protected from deletion")
    val protectChildren: Boolean = false,
    @param:GraphQLDescription("Creation timestamp")
    val created: LocalDateTime = now(),
    @param:GraphQLDescription("Last modified timestamp")
    val lastModified: LocalDateTime = now(),
    @param:GraphQLDescription("ID of user who created this directory")
    val createdBy: Long? = null,
    @param:GraphQLDescription("Whether this directory exists only in bucket (not in DB)")
    val isFromBucket: Boolean = false,
    @param:GraphQLDescription("Number of files in the folder")
    val fileCount: Int = 0,
    @param:GraphQLDescription("Number of subfolders")
    val folderCount: Int = 0,
    @param:GraphQLDescription("Total size of all files in the folder")
    val totalSize: Long = 0
) : StorageObject

@Serializable
@GraphQLIgnore
@GraphQLDescription("File with complete information")
data class FileInfo(
    @param:GraphQLDescription("Full path of the file")
    override val path: String,
    @param:GraphQLDescription("Whether the file is protected from deletion")
    override val isProtected: Boolean = false,
    @param:GraphQLDescription("Directory path containing this file")
    val directoryPath: String,
    @param:GraphQLDescription("File size in bytes")
    val size: Long,
    @param:GraphQLDescription("MIME content type")
    val contentType: String?,
    @param:GraphQLDescription("MD5 hash of the file")
    val md5Hash: String?,

    @param:GraphQLDescription("Creation timestamp")
    val created: LocalDateTime,
    @param:GraphQLDescription("Last modified timestamp")
    val lastModified: LocalDateTime,
    @param:GraphQLDescription("ID of user who created this file")
    val createdBy: Long? = null,
    @param:GraphQLDescription("Whether this file exists only in bucket (not in DB)")
    val isFromBucket: Boolean = false,
    @param:GraphQLDescription("URL for accessing the file")
    val url: String? = null,
    @param:GraphQLDescription("Media link for streaming (if applicable)")
    val mediaLink: String? = null,
    @param:GraphQLDescription("File type category")
    val fileType: FileType = FileType.OTHER,
    @param:GraphQLDescription("Whether the file is publicly accessible")
    val isPublic: Boolean = false,
    @param:GraphQLDescription("Whether the file is currently being used")
    val isInUse: Boolean = false,
    @param:GraphQLDescription("List of current usages")
    val usages: List<FileUsageInfo> = emptyList()
) : StorageObject

@Serializable
@GraphQLDescription("Directory permissions configuration")
data class DirectoryPermissions(
    @param:GraphQLDescription("Whether uploads are allowed to this directory")
    val allowUploads: Boolean = true,
    @param:GraphQLDescription("Whether this directory can be deleted")
    val allowDelete: Boolean = true,
    @param:GraphQLDescription("Whether this directory can be moved")
    val allowMove: Boolean = true,
    @param:GraphQLDescription("Whether subdirectories can be created")
    val allowCreateSubDirs: Boolean = true,
    @param:GraphQLDescription("Whether files in this directory can be deleted")
    val allowDeleteFiles: Boolean = true,
    @param:GraphQLDescription("Whether files in this directory can be moved")
    val allowMoveFiles: Boolean = true
)

@Serializable
@GraphQLDescription("File usage information")
data class FileUsageInfo(
    @param:GraphQLDescription("Database ID of the usage record")
    val id: Long,
    @param:GraphQLDescription("Path of the file being used")
    val filePath: String,
    @param:GraphQLDescription("Type of usage")
    val usageType: String,
    @param:GraphQLDescription("ID of the entity using this file")
    val referenceId: Long,
    @param:GraphQLDescription("Table/entity type using this file")
    val referenceTable: String,
    @param:GraphQLDescription("When this usage was created")
    val created: LocalDateTime
)

// Input types for file operations
@GraphQLDescription("Input for creating a folder with permissions")
data class CreateFolderInput(
    @param:GraphQLDescription("The path where to create the folder + folder name")
    val path: String,
    @param:GraphQLDescription("Initial permissions for the folder")
    val permissions: DirectoryPermissions? = null,
    @param:GraphQLDescription("Whether to protect the folder from deletion")
    val protected: Boolean? = false,
    @param:GraphQLDescription("For directories: whether to protect all children (recursive)")
    val protectChildren: Boolean? = false
)

@GraphQLDescription("Input for updating directory permissions")
data class UpdateDirectoryPermissionsInput(
    @param:GraphQLDescription("The directory path")
    val path: String,
    @param:GraphQLDescription("New permissions configuration")
    val permissions: DirectoryPermissions
)

@GraphQLDescription("Input for setting file/directory protection")
data class SetStorageItemProtectionInput(
    @param:GraphQLDescription("The file or directory path")
    val path: String,
    @param:GraphQLDescription("Whether to protect from deletion")
    val isProtected: Boolean,
    @param:GraphQLDescription("For directories: whether to protect all children (recursive)")
    val protectChildren: Boolean = false
)

@GraphQLDescription("Input for moving files or directories")
data class MoveStorageItemsInput(
    @param:GraphQLDescription("Source paths to move")
    val sourcePaths: List<String>,
    @param:GraphQLDescription("Destination directory path")
    val destinationPath: String
)

@GraphQLDescription("Input for copying files or directories")
data class CopyStorageItemsInput(
    @param:GraphQLDescription("Source paths to copy")
    val sourcePaths: List<String>,
    @param:GraphQLDescription("Destination directory path")
    val destinationPath: String
)

@GraphQLDescription("Input for bulk deletion")
data class DeleteItemsInput(
    @param:GraphQLDescription("Paths to delete")
    val paths: List<String>,
    @param:GraphQLDescription("Force deletion even if files are in use (requires admin)")
    val force: Boolean = false
)

@GraphQLDescription("Input for checking file usage")
data class CheckFileUsageInput(
    @param:GraphQLDescription("File path to check")
    val filePath: String
)

@GraphQLDescription("Input for registering file usage")
data class RegisterFileUsageInput(
    @param:GraphQLDescription("File path being used")
    val filePath: String,
    @param:GraphQLDescription("Type of usage (e.g., 'template_cover', 'certificate_image')")
    val usageType: String,
    @param:GraphQLDescription("ID of the entity using this file")
    val referenceId: Long,
    @param:GraphQLDescription("Table/entity type using this file")
    val referenceTable: String
)

@GraphQLDescription("Input for renaming a file or folder")
data class RenameFileInput(
    @param:GraphQLDescription("The current path of the file/folder")
    val currentPath: String,
    @param:GraphQLDescription("The new name")
    val newName: String
)

@GraphQLDescription("Input for listing files with pagination and filtering")
data class ListFilesInput(
    @param:GraphQLDescription("The folder path to list (empty for root)")
    val path: String = "",
    @param:GraphQLDescription("Number of items per page")
    val limit: Int? = 20,
    @param:GraphQLDescription("Page offset")
    val offset: Int? = 0,
    @param:GraphQLDescription("Filter by file type (e.g., 'image', 'document')")
    val fileType: String? = null,
    @param:GraphQLDescription("Search term for file names")
    val searchTerm: String? = null,
    @param:GraphQLDescription("Sort by field")
    val sortBy: FileSortField? = FileSortField.NAME,
    @param:GraphQLDescription("Sort direction")
    val sortDirection: SortDirection? = SortDirection.ASC
) {
    companion object {
        const val DEFAULT_LIMIT = 20
    }
}

// Enums
@Serializable
enum class FileSortField {
    NAME,
    SIZE,
    MODIFIED,
    TYPE
}

@Serializable
enum class FileType {
    IMAGE,
    DOCUMENT,
    VIDEO,
    AUDIO,
    ARCHIVE,
    OTHER
}

interface StorageObject {
    val path: String
    val isProtected: Boolean
}

@Serializable
@GraphQLDescription("Paginated list of storage objects")
data class StorageObjectList(
    @param:GraphQLDescription("List of files and folders")
    val items: List<StorageObject>,
    @param:GraphQLDescription("Total number of items")
    val totalCount: Int,
    @param:GraphQLDescription("Current page offset")
    val offset: Int,
    @param:GraphQLDescription("Items per page")
    val limit: Int,
    @param:GraphQLDescription("Whether there are more items")
    val hasMore: Boolean
)

@Serializable
@GraphQLDescription("Result of a file operation")
data class FileOperationResult(
    @param:GraphQLDescription("Whether the operation was successful")
    val success: Boolean,
    @param:GraphQLDescription("Success or error message")
    val message: String,
    @param:GraphQLDescription("The affected file/folder (if applicable)")
    val item: StorageObject? = null
)

@Serializable
@GraphQLDescription("Result of checking file usage")
data class FileUsageResult(
    @param:GraphQLDescription("Whether the file is currently in use")
    val isInUse: Boolean,
    @param:GraphQLDescription("List of current usages")
    val usages: List<FileUsageInfo>,
    @param:GraphQLDescription("Whether the file can be safely deleted")
    val canDelete: Boolean,
    @param:GraphQLDescription("Reason why file cannot be deleted (if applicable)")
    val deleteBlockReason: String? = null
)

@Serializable
@GraphQLDescription("Result of bulk operations")
data class BulkOperationResult(
    @param:GraphQLDescription("Number of items successfully processed")
    val successCount: Int,
    @param:GraphQLDescription("Number of items that failed")
    val failureCount: Int,
    @param:GraphQLDescription("List of error messages for failed items")
    val errors: List<String>,
    @param:GraphQLDescription("List of successfully processed items")
    val successfulItems: List<StorageObject> = emptyList()
)

@Serializable
@GraphQLDescription("File upload result")
data class FileUploadResult(
    @param:GraphQLDescription("Whether the upload was successful")
    val success: Boolean,
    @param:GraphQLDescription("Success or error message")
    val message: String,
    @param:GraphQLDescription("The uploaded file information")
    val fileInfo: FileInfo? = null
)

@Serializable
@GraphQLDescription("File type and its count")
data class FileTypeCount(
    @param:GraphQLDescription("File type")
    val type: FileType,
    @param:GraphQLDescription("Number of files of this type")
    val count: Int
)

@Serializable
@GraphQLDescription("Storage statistics")
data class StorageStats(
    @param:GraphQLDescription("Total number of files")
    val totalFiles: Int,
    @param:GraphQLDescription("Total number of folders")
    val totalFolders: Int,
    @param:GraphQLDescription("Total size in bytes")
    val totalSize: Long,
    @param:GraphQLDescription("Breakdown by file type")
    val fileTypeBreakdown: List<FileTypeCount>
)

@GraphQLDescription("Supported content types for file uploads.")
enum class ContentType(val value: String) {
    // Image types
    JPEG("image/jpeg"),
    PNG("image/png"),
    GIF("image/gif"),
    SVG("image/svg+xml"),
    WEBP("image/webp"),

    // Document types
    PDF("application/pdf"),
    JSON("application/json"),

    // Font types
    TTF("font/ttf"),
    OTF("font/otf"),
    WOFF("font/woff"),
    WOFF2("font/woff2"),

    // Other
    TEXT("text/plain"),
}

@Suppress("unused")
enum class UploadLocation(val path: String, val allowedContentTypes: List<ContentType>) {
    TEMPLATE_COVER("public/templateCover", listOf(ContentType.JPEG, ContentType.PNG, ContentType.WEBP))
}

@GraphQLDescription("Input for generating a signed URL for file upload")
data class GenerateUploadSignedUrlInput(
    @param:GraphQLDescription("The location where the file will be stored.")
    val location: UploadLocation,
    @param:GraphQLDescription("The name of the file.")
    val fileName: String,
    @param:GraphQLDescription("The content type of the file to be uploaded (e.g., 'image/jpeg', 'application/pdf').")
    val contentType: ContentType
)
