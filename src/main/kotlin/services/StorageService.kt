package services

import com.google.cloud.storage.*
import com.google.cloud.storage.HttpMethod
import config.GcsConfig
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.utils.io.*
import kotlinx.coroutines.runBlocking
import kotlinx.datetime.LocalDateTime
import kotlinx.io.readByteArray
import schema.model.*
import schema.model.ContentType
import services.StorageService.Companion.SIGNED_URL_DURATION
import tables.DirectoryEntity
import tables.FileEntity
import util.*
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.util.concurrent.TimeUnit


// Data classes for bucket blob representations
data class BucketFile(
    val path: String,
    val directoryPath: String,
    val size: Long,
    val contentType: String?,
    val md5Hash: String?,
    val created: LocalDateTime,
    val lastModified: LocalDateTime,
    val url: String,
    val mediaLink: String?,
    val fileType: FileType,
    val isPublic: Boolean
)

data class BucketDirectory(
    val path: String,
    val created: LocalDateTime,
    val lastModified: LocalDateTime,
    val isPublic: Boolean
)

interface StorageService {
    companion object {
        const val SIGNED_URL_DURATION = 15L // minutes
    }

    suspend fun handleFileUpload(call: ApplicationCall, folder: String)

    fun fileExists(path: String): Boolean

    fun generateUploadSignedUrl(path: String, contentType: ContentType): String

    fun uploadFile(
        path: String,
        inputStream: InputStream,
        contentType: ContentType?,
        originalFilename: String? = null,
        location: UploadLocation
    ): FileUploadResult

    fun listFiles(input: ListFilesInput): StorageObjectList

    fun createFolder(input: CreateFolderInput): FileOperationResult

    fun renameFile(input: RenameFileInput): FileOperationResult

    fun deleteFile(path: String): FileOperationResult

    fun directoryInfoByPath(path: String): DirectoryInfo

    fun fileInfoByPath(path: String): FileInfo?

    fun fileInfoByDbFileId(id: Long): FileInfo?

    fun storageStatistics(path: String? = null): StorageStats

    // New methods for directory tree and bulk operations
    suspend fun fetchDirectoryChildren(path: String? = null): List<DirectoryInfo>
    suspend fun moveItems(input: MoveStorageItemsInput): BulkOperationResult
    suspend fun copyItems(input: CopyStorageItemsInput): BulkOperationResult
    suspend fun deleteItems(input: DeleteItemsInput): BulkOperationResult
}

// Helper function to combine bucket file data with DB entity
private fun combineFileData(bucketFile: BucketFile, dbEntity: FileEntity?): FileInfo {
    return if (dbEntity != null) {
        FileInfo(
            path = bucketFile.path,
            directoryPath = bucketFile.directoryPath,
            size = bucketFile.size,
            contentType = bucketFile.contentType,
            md5Hash = bucketFile.md5Hash,
            isProtected = dbEntity.isProtected,
            created = bucketFile.created,
            lastModified = bucketFile.lastModified,
            isFromBucket = false,
            url = bucketFile.url,
            mediaLink = bucketFile.mediaLink,
            fileType = bucketFile.fileType,
            isPublic = bucketFile.isPublic
        )
    } else {
        FileInfo(
            path = bucketFile.path,
            directoryPath = bucketFile.directoryPath,
            size = bucketFile.size,
            contentType = bucketFile.contentType,
            md5Hash = bucketFile.md5Hash,
            isProtected = false,
            created = bucketFile.created,
            lastModified = bucketFile.lastModified,
            isFromBucket = true,
            url = bucketFile.url,
            mediaLink = bucketFile.mediaLink,
            fileType = bucketFile.fileType,
            isPublic = bucketFile.isPublic
        )
    }
}

// Helper function to combine bucket directory data with DB entity
private fun combineDirectoryData(bucketDir: BucketDirectory, dbEntity: DirectoryEntity?): DirectoryInfo {
    return if (dbEntity != null) {
        DirectoryInfo(
            path = bucketDir.path,
            permissions = DirectoryPermissions(
                allowUploads = dbEntity.allowUploads,
                allowDelete = dbEntity.allowDelete,
                allowMove = dbEntity.allowMove,
                allowCreateSubDirs = dbEntity.allowCreateSubDirs,
                allowDeleteFiles = dbEntity.allowDeleteFiles,
                allowMoveFiles = dbEntity.allowMoveFiles
            ),
            isProtected = dbEntity.isProtected,
            protectChildren = dbEntity.protectChildren,
            created = bucketDir.created,
            lastModified = bucketDir.lastModified,
            isFromBucket = false
        )
    } else {
        DirectoryInfo(
            path = bucketDir.path,
            permissions = DirectoryPermissions(), // Default permissions
            isProtected = false,
            protectChildren = false,
            created = bucketDir.created,
            lastModified = bucketDir.lastModified,
            isFromBucket = true
        )
    }
}

// Helper function to create Directory from bucket path (when no blob exists)
private fun createDirectoryFromPath(path: String): DirectoryInfo {
    return DirectoryInfo(
        path = path,
        permissions = DirectoryPermissions(), // Default permissions
        isProtected = false,
        protectChildren = false,
        created = now(),
        lastModified = now(),
        isFromBucket = true
    )
}

@OptIn(InternalAPI::class)
fun storageService(
    storage: Storage,
    gcsConfig: GcsConfig,
    storageDbService: StorageDbService
) = object : StorageService {
    override suspend fun handleFileUpload(call: ApplicationCall, folder: String) {
        try {
            val parts = call.receiveMultipart()
            var fileName: String? = null
            var fileBytes: ByteArray? = null
            var fileContentType: ContentType? = null
            var originalFileName: String? = null

            parts.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        if (part.name == "fileName") {
                            fileName = part.value
                        }
                    }

                    is PartData.FileItem -> {
                        if (fileBytes == null) {
                            originalFileName = part.originalFileName
                            fileContentType = ContentType.entries.find { it.value == part.contentType?.toString() }
                            fileBytes = part.provider().readBuffer.readByteArray()
                        }
                    }

                    else -> {}
                }
                part.dispose()
            }

            if (fileBytes == null) {
                call.respond(HttpStatusCode.BadRequest, FileUploadResult(success = false, message = "No file provided"))
                return
            }

            val finalFileName = if (!fileName.isNullOrBlank()) fileName else originalFileName

            if (finalFileName.isNullOrBlank()) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    FileUploadResult(success = false, message = "File must have a name")
                )
                return
            }

            val finalPath = if (folder.isNotBlank()) {
                "${folder.trimEnd('/')}/$finalFileName"
            } else {
                finalFileName
            }

            val result = uploadFile(
                path = finalPath,
                inputStream = ByteArrayInputStream(fileBytes),
                contentType = fileContentType,
                originalFilename = finalFileName,
                location = UploadLocation.valueOf(folder.uppercase())
            )

            if (result.success) {
                call.respond(HttpStatusCode.OK, result)
            } else {
                call.respond(HttpStatusCode.BadRequest, result)
            }
        } catch (e: Exception) {
            call.application.log.error("Failed to upload file to $folder", e)
            call.respond(
                HttpStatusCode.InternalServerError, FileUploadResult(
                    success = false,
                    message = "Upload failed: ${e.message}"
                )
            )
        }
    }

    override fun fileExists(path: String): Boolean {
        return try {
            storage.get(gcsConfig.bucketName, path) != null
        } catch (e: StorageException) {
            if (e.code == 403) {
                // This can happen if the service account doesn't have storage.objects.get permission.
                // In this case, we can't check for existence, so we'll assume it doesn't exist.
                // This is a security measure to avoid exposing sensitive information.
                return false
            }
            throw e
        }
    }

    override fun generateUploadSignedUrl(path: String, contentType: ContentType): String {
        validatePath(path)?.let { throw Exception(it) }
        val location =
            UploadLocation.entries.find { path.startsWith(it.path) } ?: throw Exception("Invalid upload location")
        validateFileType(contentType, location)?.let { throw Exception(it) }

        check(path.startsWith("public/")) {
            "Uploads are restricted to the 'public' directory."
        }

        val blobInfo = BlobInfo.newBuilder(BlobId.of(gcsConfig.bucketName, path))
            .setContentType(contentType.value)
            .build()

        val options = listOf(
            Storage.SignUrlOption.httpMethod(HttpMethod.PUT),
            Storage.SignUrlOption.withV4Signature(),
            Storage.SignUrlOption.withContentType()
        )

        return storage.signUrl(
            blobInfo,
            SIGNED_URL_DURATION,
            TimeUnit.MINUTES,
            *options.toTypedArray()
        ).toString()
    }

    override fun uploadFile(
        path: String,
        inputStream: InputStream,
        contentType: ContentType?,
        originalFilename: String?,
        location: UploadLocation
    ): FileUploadResult {
        try {
            if (!path.startsWith("public/")) {
                return FileUploadResult(false, "Uploads are restricted to the 'public' directory", null)
            }

            // Validate path
            validatePath(path)?.let { return FileUploadResult(false, it, null) }

            // Validate file type
            validateFileType(contentType, location)?.let { return FileUploadResult(false, it, null) }

            // Read bytes from input stream
            val bytes = inputStream.readBytes()
            validateFileSize(bytes.size.toLong())?.let { return FileUploadResult(false, it, null) }

            // Get directory path for permission check
            val directoryPath = path.substringBeforeLast('/')

            // Check if the directory exists in DB and get permissions
            runBlocking {
                val dbDirectory = storageDbService.directoryByPath(directoryPath)

                if (dbDirectory != null) {
                    // Directory exists in DB, check permissions
                    if (!dbDirectory.allowUploads) {
                        return@runBlocking FileUploadResult(false, "Uploads not allowed in this directory", null)
                    }
                } else {
                    // Directory not in DB, check if it exists in bucket (default permissions apply)
                    val bucketDirExists = try {
                        val folderBlob = "${directoryPath}/"
                        storage.get(gcsConfig.bucketName, folderBlob) != null
                    } catch (_: Exception) {
                        false
                    }

                    if (!bucketDirExists && directoryPath.isNotEmpty()) {
                        return@runBlocking FileUploadResult(false, "Directory does not exist", null)
                    }
                    // If a directory exists in bucket or is root, allow upload (default permissions)
                }
            }

            // Upload to GCS
            val blobId = BlobId.of(gcsConfig.bucketName, path)
            val blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(contentType?.value)
                .build()

            val blob = storage.create(blobInfo, bytes)
            val bucketFile = blobToFileInfo(blob)

            // Create file entity for response only (don't store in DB unless used)
            val createdFileEntity = combineFileData(bucketFile, null)

            return FileUploadResult(true, "File uploaded successfully", createdFileEntity)
        } catch (e: Exception) {
            return FileUploadResult(false, "Upload failed: ${e.message}", null)
        }
    }

    override fun listFiles(input: ListFilesInput): StorageObjectList {
        val prefix = if (input.path.isEmpty()) "" else "${input.path.trimEnd('/')}/"
        val options = listOf(
            Storage.BlobListOption.prefix(prefix),
            Storage.BlobListOption.currentDirectory(),
            Storage.BlobListOption.pageSize(
                ((input.limit ?: ListFilesInput.DEFAULT_LIMIT) + (input.offset ?: 0) + 1).toLong()
            )
        )

        val blobs = storage.list(gcsConfig.bucketName, *options.toTypedArray()).values.toList()
        val items = mutableListOf<StorageObject>()

        // Process blobs
        for (blob in blobs) {
            if (blob.name == prefix) continue // Skip the folder itself

            if (blob.name.endsWith("/")) {
                // It's a folder
                val folderName = blob.name.removeSuffix("/").substringAfterLast('/')
                if (folderName.isNotEmpty()) {
                    val folderEntity = directoryInfoByPath(blob.name.removeSuffix("/"))
                    items.add(folderEntity)
                }
            } else {
                // It's a file
                val fileEntity = fileInfoByPath(blob.name)
                val fileName = blob.name.substringAfterLast('/')
                if (fileEntity != null) {
                    // Apply filters
                    if (input.fileType != null) {
                        val fileType =
                            determineFileType(ContentType.entries.find { it.value == fileEntity.contentType })
                        if (!matchesFileType(fileType, input.fileType)) {
                            continue
                        }
                    }
                    if (input.searchTerm != null && !fileName.contains(input.searchTerm, ignoreCase = true)) {
                        continue
                    }

                    items.add(fileEntity)
                }
            }
        }

        // Sort items
        val sortedItems: List<StorageObject> = when (input.sortBy) {
            FileSortField.NAME -> {
                if (input.sortDirection == SortDirection.ASC) items.sortedBy { it.path.substringAfterLast('/') }
                else items.sortedByDescending { it.path.substringAfterLast('/') }
            }

            FileSortField.SIZE -> {
                if (input.sortDirection == SortDirection.ASC) items.sortedBy {
                    when (it) {
                        is FileInfo -> it.size
                        is DirectoryInfo -> 0L // Directories don't have size
                        else -> 0L
                    }
                }
                else items.sortedByDescending {
                    when (it) {
                        is FileInfo -> it.size
                        is DirectoryInfo -> 0L // Directories don't have size
                        else -> 0L
                    }
                }
            }

            FileSortField.MODIFIED -> {
                if (input.sortDirection == SortDirection.ASC) items.sortedBy {
                    when (it) {
                        is FileInfo -> it.lastModified
                        is DirectoryInfo -> it.lastModified
                        else -> LocalDateTime(1900, 1, 1, 0, 0, 0)
                    }
                }
                else items.sortedByDescending {
                    when (it) {
                        is FileInfo -> it.lastModified
                        is DirectoryInfo -> it.lastModified
                        else -> LocalDateTime(1900, 1, 1, 0, 0, 0)
                    }
                }
            }

            FileSortField.TYPE -> {
                if (input.sortDirection == SortDirection.ASC) items.sortedBy { it::class.simpleName }
                else items.sortedByDescending { it::class.simpleName }
            }

            null -> items
        }

        // Apply pagination
        val totalCount = sortedItems.size
        val paginatedItems =
            sortedItems.drop(input.offset ?: 0).take(input.limit ?: ListFilesInput.DEFAULT_LIMIT)
        val hasMore = (input.offset ?: 0) + (input.limit ?: ListFilesInput.DEFAULT_LIMIT) < totalCount

        return StorageObjectList(
            items = paginatedItems,
            totalCount = totalCount,
            offset = input.offset ?: 0,
            limit = input.limit ?: ListFilesInput.DEFAULT_LIMIT,
            hasMore = hasMore
        )
    }

    override fun createFolder(input: CreateFolderInput): FileOperationResult {
        try {
            validatePath(input.path)?.let { error ->
                return FileOperationResult(false, error)
            }

            val fullPath = input.path.trimEnd('/').removePrefix("/")

            // Check parent directory permissions
            runBlocking {
                val parentDir = storageDbService.directoryByPath(input.path)
                if (parentDir != null && !parentDir.allowCreateSubDirs) {
                    return@runBlocking FileOperationResult(
                        false,
                        "Creating subdirectories not allowed in parent directory"
                    )
                }
            }

            val folderPath = "$fullPath/"
            val blobId = BlobId.of(gcsConfig.bucketName, folderPath)
            val blobInfo = BlobInfo.newBuilder(blobId).build()
            storage.create(blobInfo)

            // Only save folder in DB if custom permissions are provided
            val createdEntity = runBlocking {
                val hasCustomPermissions =
                    input.permissions != null || input.protected == true || input.protectChildren == true

                if (hasCustomPermissions) {
                    try {
                        val directoryEntity = storageDbService.createDirectory(input)
                        // Convert entity to schema model
                        DirectoryInfo(
                            path = directoryEntity.path,
                            permissions = DirectoryPermissions(
                                allowUploads = directoryEntity.allowUploads,
                                allowDelete = directoryEntity.allowDelete,
                                allowMove = directoryEntity.allowMove,
                                allowCreateSubDirs = directoryEntity.allowCreateSubDirs,
                                allowDeleteFiles = directoryEntity.allowDeleteFiles,
                                allowMoveFiles = directoryEntity.allowMoveFiles
                            ),
                            isProtected = directoryEntity.isProtected,
                            protectChildren = directoryEntity.protectChildren,
                            created = now(),
                            lastModified = now(),
                            isFromBucket = false
                        )
                    } catch (e: Exception) {
                        // If DB operation fails, still return success since folder was created in bucket
                        println("Failed to save folder permissions in DB: ${e.message}")
                        DirectoryInfo(path = fullPath)
                    }
                } else {
                    DirectoryInfo(path = fullPath)
                }
            }

            return FileOperationResult(true, "Folder created successfully", createdEntity)
        } catch (e: Exception) {
            return FileOperationResult(false, "Failed to create folder: ${e.message}")
        }
    }

    override fun renameFile(input: RenameFileInput): FileOperationResult {
        try {
            validatePath(input.currentPath)?.let { error ->
                return FileOperationResult(false, error)
            }
            validatePath(input.newName)?.let { error ->
                return FileOperationResult(false, "Invalid new name: $error")
            }

            // Prevent renaming folders
            if (input.currentPath.endsWith("/")) {
                return FileOperationResult(false, "Renaming folders is not supported.")
            }
            if (input.newName.endsWith("/")) {
                return FileOperationResult(false, "New name cannot be a folder.")
            }

            val sourceBlob = storage.get(gcsConfig.bucketName, input.currentPath)
                ?: return FileOperationResult(false, "File not found: {input.currentPath}")

            val newPath = input.currentPath.substringBeforeLast('/') + '/' + input.newName
            val targetBlobId = BlobId.of(gcsConfig.bucketName, newPath)

            // Copy to new location
            sourceBlob.copyTo(targetBlobId)

            // Delete original
            sourceBlob.delete()

            val newBlob = storage.get(gcsConfig.bucketName, newPath)!!

            // Update file in database and get the entity
            val fileEntity = runBlocking {
                try {
                    // Get old file from DB first
                    val oldDbFile = storageDbService.fileByPath(input.currentPath)

                    if (oldDbFile != null) {
                        // Delete the old file record first
                        storageDbService.deleteFile(input.currentPath)

                        // Create a new file in DB if the old one was there
                        val newFileEntity = storageDbService.createFile(newPath, oldDbFile.isProtected)

                        // Convert to schema model
                        combineFileData(blobToFileInfo(newBlob), newFileEntity)
                    } else {
                        // File wasn't in DB, just return bucket entity
                        fileInfoByPath(newPath)
                    }
                } catch (_: Exception) {
                    // Fallback to creating a new entity
                    fileInfoByPath(newPath)
                }
            }

            return FileOperationResult(true, "File renamed successfully", fileEntity)
        } catch (e: Exception) {
            return FileOperationResult(false, "Failed to rename file: ${e.message}")
        }
    }

    override fun deleteFile(path: String): FileOperationResult {
        try {
            validatePath(path)?.let { error ->
                return FileOperationResult(false, error)
            }

            // Check permissions and protection
            runBlocking {
                // Check if the file is in use
                val isInUse = storageDbService.isFileInUse(path)
                if (isInUse) {
                    return@runBlocking FileOperationResult(false, "File is currently in use and cannot be deleted")
                }

                // Check if the file is protected
                val dbFile = storageDbService.fileByPath(path)
                if (dbFile?.isProtected == true) {
                    return@runBlocking FileOperationResult(false, "File is protected from deletion")
                }

                // Check parent directory permissions
                val parentPath = path.substringBeforeLast('/')
                val parentDir = storageDbService.directoryByPath(parentPath)
                if (parentDir != null && !parentDir.allowDeleteFiles) {
                    return@runBlocking FileOperationResult(false, "File deletion not allowed in this directory")
                }
            }

            val blobId = BlobId.of(gcsConfig.bucketName, path)
            val deleted = storage.delete(blobId)

            return if (deleted) {
                // Remove from DB if exists
                runBlocking {
                    try {
                        storageDbService.deleteFile(path)
                    } catch (e: Exception) {
                        // Log but don't fail the operation since the file was deleted from bucket
                        println("Failed to remove file from DB: ${e.message}")
                    }
                }
                FileOperationResult(true, "File deleted successfully")
            } else {
                FileOperationResult(false, "File not found: $path")
            }
        } catch (e: Exception) {
            return FileOperationResult(false, "Failed to delete file: ${e.message}")
        }
    }

    override fun fileInfoByPath(path: String): FileInfo? {
        return try {
            // First check bucket to get file data
            val blob = storage.get(gcsConfig.bucketName, path) ?: return null
            val bucketFile = blobToFileInfo(blob)

            // Then check if file exists in the database
            val dbFile = runBlocking { storageDbService.fileByPath(path) }

            // Combine bucket data with DB data
            return combineFileData(bucketFile, dbFile)
        } catch (_: Exception) {
            null
        }
    }

    override fun fileInfoByDbFileId(id: Long): FileInfo? = try {
        // First check DB to get file data
        val dbFile = runBlocking { storageDbService.fileById(id) } ?: return null

        // Then check bucket to get file data
        val blob = storage.get(gcsConfig.bucketName, dbFile.path) ?: return null
        val bucketFile = blobToFileInfo(blob)

        // Combine bucket data with DB data
        combineFileData(bucketFile, dbFile)
    } catch (_: Exception) {
        null
    }


    override fun storageStatistics(path: String?): StorageStats {
        return try {
            val prefix = path?.let { "$it/" } ?: ""
            val blobs = storage.list(
                gcsConfig.bucketName,
                Storage.BlobListOption.prefix(prefix)
            ).values.toList()

            var totalFiles = 0
            var totalFolders = 0
            var totalSize = 0L
            val fileTypes = mutableListOf<FileTypeCount>()

            for (blob in blobs) {
                if (blob.name == prefix) continue

                if (blob.name.endsWith("/")) {
                    totalFolders++
                } else {
                    totalFiles++
                    totalSize += blob.size
                    val fileType = determineFileType(ContentType.entries.find { it.value == blob.contentType })
                    val existing = fileTypes.find { it.type == fileType }
                    if (existing != null) {
                        fileTypes[fileTypes.indexOf(existing)] = existing.copy(count = existing.count + 1)
                    } else {
                        fileTypes.add(FileTypeCount(fileType, 1))
                    }
                }
            }

            StorageStats(
                totalFiles = totalFiles,
                totalFolders = totalFolders,
                totalSize = totalSize,
                fileTypeBreakdown = fileTypes
            )
        } catch (_: Exception) {
            StorageStats(0, 0, 0, emptyList())
        }
    }

    override fun directoryInfoByPath(path: String): DirectoryInfo {
        // First check if directory exists in database (only for folders with special permissions)
        val dbDirectory = runBlocking { storageDbService.directoryByPath(path) }
        if (dbDirectory != null) {
            // Convert entity to schema model
            return DirectoryInfo(
                path = dbDirectory.path,
                permissions = DirectoryPermissions(
                    allowUploads = dbDirectory.allowUploads,
                    allowDelete = dbDirectory.allowDelete,
                    allowMove = dbDirectory.allowMove,
                    allowCreateSubDirs = dbDirectory.allowCreateSubDirs,
                    allowDeleteFiles = dbDirectory.allowDeleteFiles,
                    allowMoveFiles = dbDirectory.allowMoveFiles
                ),
                isProtected = dbDirectory.isProtected,
                protectChildren = dbDirectory.protectChildren,
                created = now(),
                lastModified = now(),
                isFromBucket = false
            )
        }

        // If not in DB, check bucket and return bucket-only entity
        val folderPath = "$path/"
        val blobs = storage.list(gcsConfig.bucketName, Storage.BlobListOption.prefix(folderPath)).values.toList()

        // Check if folder exists in bucket (has files or subfolder marker)
        val folderExists = blobs.isNotEmpty() || storage.get(gcsConfig.bucketName, folderPath) != null

        if (folderExists) {
            // Return bucket-only entity (don't add to DB automatically)
            return createFolderEntityFromBucket(path)
        }

        // Return a default entity if the folder doesn't exist
        return createFolderEntityFromBucket(path)
    }

    private fun createFolderEntityFromBucket(path: String): DirectoryInfo {
        return createDirectoryFromPath(path)
    }

    fun blobToDirectoryInfo(blob: Blob): BucketDirectory {
        val createdTime = blob.createTimeOffsetDateTime?.toInstant()?.toEpochMilli()
            ?: System.currentTimeMillis()
        val updatedTime = blob.updateTimeOffsetDateTime?.toInstant()?.toEpochMilli()
            ?: createdTime

        return BucketDirectory(
            path = blob.name.trimEnd('/'),
            created = timestampToLocalDateTime(createdTime),
            lastModified = timestampToLocalDateTime(updatedTime),
            isPublic = blob.name.startsWith("public/")
        )
    }

    fun blobToFileInfo(blob: Blob): BucketFile {
        return BucketFile(
            path = blob.name,
            directoryPath = blob.name.substringBeforeLast('/'),
            size = blob.size,
            contentType = blob.contentType,
            lastModified = timestampToLocalDateTime(blob.updateTimeOffsetDateTime.toInstant().toEpochMilli()),
            created = timestampToLocalDateTime(blob.createTimeOffsetDateTime.toInstant().toEpochMilli()),
            url = gcsConfig.baseUrl + blob.name,
            mediaLink = blob.mediaLink,
            fileType = determineFileType(ContentType.entries.find { it.value == blob.contentType }),
            md5Hash = blob.md5,
            isPublic = blob.name.startsWith("public/")
        )
    }

    // New implementations for missing methods
    override suspend fun fetchDirectoryChildren(path: String?): List<DirectoryInfo> {
        val searchPath = if (path.isNullOrEmpty()) "public" else path.trimEnd('/')

        // Get directories from DB first
        val dbDirectories = storageDbService.directoriesByParentPath(searchPath.takeIf { it.isNotEmpty() })

        // Get directories from bucket that might not be in DB
        val prefix = if (searchPath.isEmpty()) "" else "$searchPath/"
        val options = listOf(
            Storage.BlobListOption.prefix(prefix),
            Storage.BlobListOption.delimiter("/"),
            Storage.BlobListOption.pageSize(1000)
        )

        val page = storage.list(gcsConfig.bucketName, *options.toTypedArray())
        val bucketFolders = mutableListOf<DirectoryInfo>()
        val dbDirectoriesByPath = dbDirectories.associateBy { it.path }

        // Process prefixes (folders) from bucket
        page.iterateAll().forEach { blob ->
            val folderPath = blob.name.trimEnd('/')
            // Ensure we don't include the parent folder itself in the results
            if (blob.isDirectory && folderPath != prefix.trimEnd('/') && folderPath != searchPath) {
                // Create a BucketDirectory and find matching DB entity
                val bucketDir = blobToDirectoryInfo(blob)
                val dbEntity = dbDirectoriesByPath[bucketDir.path]
                val bucketFolder = combineDirectoryData(bucketDir, dbEntity)
                bucketFolders.add(bucketFolder)
            }
        }

        // Return only bucket folders (bucket-first approach - ignore DB-only directories)
        return bucketFolders.sortedBy { it.path.substringAfterLast('/') }
    }

    override suspend fun moveItems(input: MoveStorageItemsInput): BulkOperationResult {
        val errors = mutableListOf<String>()
        val successfulItems = mutableListOf<StorageObject>()

        for (sourcePath in input.sourcePaths) {
            try {
                // Check if source exists in the bucket
                val sourceBlob = storage.get(gcsConfig.bucketName, sourcePath)
                if (sourceBlob == null) {
                    errors.add("Source path not found: $sourcePath")
                    continue
                }

                // Check permissions for source directory
                val sourceDir = sourcePath.substringBeforeLast('/')
                val dbSourceDir = storageDbService.directoryByPath(sourceDir)
                if (dbSourceDir != null && !dbSourceDir.allowMove) {
                    errors.add("Move not allowed from directory: $sourceDir")
                    continue
                }

                // Check permissions for destination directory
                val dbDestDir = storageDbService.directoryByPath(input.destinationPath)
                if (dbDestDir != null && !dbDestDir.allowUploads) {
                    errors.add("Uploads not allowed to destination directory")
                    continue
                }

                // Perform the move in bucket (copy then delete)
                val fileName = sourcePath.substringAfterLast('/')
                val newPath = "${input.destinationPath.trimEnd('/')}/$fileName"

                val sourceBlobId = BlobId.of(gcsConfig.bucketName, sourcePath)
                val targetBlobId = BlobId.of(gcsConfig.bucketName, newPath)

                storage.copy(
                    Storage.CopyRequest.newBuilder()
                        .setSource(sourceBlobId)
                        .setTarget(targetBlobId)
                        .build()
                ).result

                storage.delete(sourceBlobId)

                // Update DB records
                val dbFile = storageDbService.fileByPath(sourcePath)
                if (dbFile != null) {
                    storageDbService.deleteFile(sourcePath)
                    val newFileEntity = storageDbService.createFile(newPath, dbFile.isProtected)
                    val updatedFile =
                        combineFileData(blobToFileInfo(storage.get(gcsConfig.bucketName, newPath)!!), newFileEntity)
                    successfulItems.add(updatedFile)
                } else {
                    // File not in DB, get entity from bucket
                    fileInfoByPath(newPath)?.let { successfulItems.add(it) }
                }

            } catch (e: Exception) {
                errors.add("Move failed for $sourcePath: ${e.message}")
            }
        }

        return BulkOperationResult(
            successCount = successfulItems.size,
            failureCount = errors.size,
            errors = errors,
            successfulItems = successfulItems
        )
    }

    override suspend fun copyItems(input: CopyStorageItemsInput): BulkOperationResult {
        val errors = mutableListOf<String>()
        val successfulItems = mutableListOf<StorageObject>()

        for (sourcePath in input.sourcePaths) {
            try {
                // Check if source exists in the bucket
                val sourceBlob = storage.get(gcsConfig.bucketName, sourcePath)
                if (sourceBlob == null) {
                    errors.add("Source path not found: $sourcePath")
                    continue
                }

                // Check permissions for destination directory
                val dbDestDir = storageDbService.directoryByPath(input.destinationPath)
                if (dbDestDir != null && !dbDestDir.allowUploads) {
                    errors.add("Uploads not allowed to destination directory")
                    continue
                }

                // Perform the copy in bucket
                val fileName = sourcePath.substringAfterLast('/')
                val newPath = "${input.destinationPath.trimEnd('/')}/$fileName"

                val sourceBlobId = BlobId.of(gcsConfig.bucketName, sourcePath)
                val targetBlobId = BlobId.of(gcsConfig.bucketName, newPath)

                storage.copy(
                    Storage.CopyRequest.newBuilder()
                        .setSource(sourceBlobId)
                        .setTarget(targetBlobId)
                        .build()
                ).result

                // Add to DB if source was in DB
                val dbFile = storageDbService.fileByPath(sourcePath)
                if (dbFile != null) {
                    val copiedFileEntity = storageDbService.createFile(newPath, dbFile.isProtected)
                    val copiedFile =
                        combineFileData(blobToFileInfo(storage.get(gcsConfig.bucketName, newPath)!!), copiedFileEntity)
                    successfulItems.add(copiedFile)
                } else {
                    // File not in DB, get entity from bucket
                    fileInfoByPath(newPath)?.let { successfulItems.add(it) }
                }

            } catch (e: Exception) {
                errors.add("Copy failed for $sourcePath: ${e.message}")
            }
        }

        return BulkOperationResult(
            successCount = successfulItems.size,
            failureCount = errors.size,
            errors = errors,
            successfulItems = successfulItems
        )
    }

    override suspend fun deleteItems(input: DeleteItemsInput): BulkOperationResult {
        val errors = mutableListOf<String>()
        val successfulItems = mutableListOf<StorageObject>()

        for (path in input.paths) {
            try {
                // Check if file is in use (unless force is true)
                if (!input.force) {
                    val isInUse = storageDbService.isFileInUse(path)
                    if (isInUse) {
                        errors.add("File is currently in use: $path")
                        continue
                    }
                }

                // Check if file/directory is protected
                val dbFile = storageDbService.fileByPath(path)
                val dbDir = storageDbService.directoryByPath(path)

                if (dbFile?.isProtected == true || dbDir?.isProtected == true) {
                    errors.add("Item is protected from deletion: $path")
                    continue
                }

                // Check parent directory permissions
                val parentPath = path.substringBeforeLast('/')
                val parentDir = storageDbService.directoryByPath(parentPath)
                if (parentDir != null) {
                    val isFile = dbFile != null
                    val canDelete = if (isFile) parentDir.allowDeleteFiles else parentDir.allowDelete
                    if (!canDelete) {
                        errors.add("Deletion not allowed in parent directory: $path")
                        continue
                    }
                }

                // Get entity before deleting for the result
                val fileEntity = fileInfoByPath(path)
                val folderEntity = if (fileEntity == null) directoryInfoByPath(path) else null

                // Delete from bucket
                val deleted = storage.delete(gcsConfig.bucketName, path)
                if (!deleted) {
                    errors.add("Failed to delete from storage: $path")
                    continue
                }

                // Delete from DB
                if (dbFile != null) {
                    storageDbService.deleteFile(path)
                    fileEntity?.let { successfulItems.add(it) }
                } else if (dbDir != null) {
                    storageDbService.deleteDirectory(path)
                    folderEntity?.let { successfulItems.add(it) }
                }

            } catch (e: Exception) {
                errors.add("Delete failed for $path: ${e.message}")
            }
        }

        return BulkOperationResult(
            successCount = successfulItems.size,
            failureCount = errors.size,
            errors = errors,
            successfulItems = successfulItems
        )
    }

}
