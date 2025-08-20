package schema.model

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import kotlinx.datetime.LocalDateTime

// Input types for file operations
@GraphQLDescription("Input for creating a folder")
data class CreateFolderInput(
    @param:GraphQLDescription("The path where to create the folder")
    val path: String,
    @param:GraphQLDescription("The name of the folder")
    val name: String
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
){
    companion object{
        const val DEFAULT_LIMIT = 20
    }
}

// Enums
enum class FileSortField {
    NAME,
    SIZE,
    MODIFIED,
    TYPE
}

enum class FileType {
    IMAGE,
    DOCUMENT,
    VIDEO,
    AUDIO,
    ARCHIVE,
    OTHER
}

interface StorageObject {
    val name: String
    val path: String
}

// Response types

@GraphQLIgnore
@GraphQLDescription("Enhanced file information with metadata")
data class FileInfo(
    @param:GraphQLDescription("File name")
    override val name: String,
    @param:GraphQLDescription("Full path in the bucket")
    override val path: String,
    @param:GraphQLDescription("File size in bytes")
    val size: Long,
    @param:GraphQLDescription("MIME content type")
    val contentType: String?,
    @param:GraphQLDescription("Last modified timestamp")
    val lastModified: LocalDateTime,
    @param:GraphQLDescription("Creation timestamp")
    val created: LocalDateTime,
    @param:GraphQLDescription("URL for accessing the file")
    val url: String?,
    @param:GraphQLDescription("Media link for streaming (if applicable)")
    val mediaLink: String? = null,
    @param:GraphQLDescription("File type category")
    val fileType: FileType,
    @param:GraphQLDescription("MD5 hash of the file")
    val md5Hash: String?,
    @param:GraphQLDescription("Whether the file is publicly accessible")
    val isPublic: Boolean = false
) : StorageObject

@GraphQLIgnore
@GraphQLDescription("Folder information")
data class FolderInfo(
    @param:GraphQLDescription("Folder name")
    override val name: String,
    @param:GraphQLDescription("Full path in the bucket")
    override val path: String,
    @param:GraphQLDescription("Number of files in the folder")
    val fileCount: Int,
    @param:GraphQLDescription("Number of subfolders")
    val folderCount: Int,
    @param:GraphQLDescription("Total size of all files in the folder")
    val totalSize: Long,
    @param:GraphQLDescription("Creation timestamp")
    val created: LocalDateTime,
    @param:GraphQLDescription("Last modified timestamp")
    val lastModified: LocalDateTime
) : StorageObject

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

@GraphQLDescription("Result of a file operation")
data class FileOperationResult(
    @param:GraphQLDescription("Whether the operation was successful")
    val success: Boolean,
    @param:GraphQLDescription("Success or error message")
    val message: String,
    @param:GraphQLDescription("The affected file/folder (if applicable)")
    val item: StorageObject? = null
)

@GraphQLDescription("File upload result")
data class FileUploadResult(
    @param:GraphQLDescription("Whether the upload was successful")
    val success: Boolean,
    @param:GraphQLDescription("Success or error message")
    val message: String,
    @param:GraphQLDescription("The uploaded file information")
    val file: FileInfo? = null
)

@GraphQLDescription("File type and its count")
data class FileTypeCount(
    @param:GraphQLDescription("File type")
    val type: FileType,
    @param:GraphQLDescription("Number of files of this type")
    val count: Int
)

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
