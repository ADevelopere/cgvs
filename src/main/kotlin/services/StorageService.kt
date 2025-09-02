package services

import com.google.cloud.storage.*
import config.GcsConfig
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.server.application.ApplicationCall
import io.ktor.server.application.log
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respond
import io.ktor.utils.io.InternalAPI
import kotlinx.datetime.Clock
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import kotlinx.io.readByteArray
import kotlinx.coroutines.runBlocking
import schema.model.*
import services.StorageService.Companion.SIGNED_URL_DURATION
import util.timestampToLocalDateTime
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.util.concurrent.TimeUnit

interface StorageService {
    companion object {
        const val MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
        const val SIGNED_URL_DURATION = 15L // minutes

        val PATH_PATTERN = Regex("^[a-zA-Z0-9._/-]+$")
    }

    suspend fun handleFileUpload(call: ApplicationCall, folder: String)

    fun fileExists(path: String): Boolean

    fun generateUploadSignedUrl(path: String, contentType: ContentType): String

    fun validatePath(path: String): String? {
        if (path.contains("..") || path.contains("//")) {
            return "Path contains invalid directory traversal patterns"
        }
        if (!PATH_PATTERN.matches(path)) {
            return "Path contains invalid characters"
        }
        if (path.length > 1024) {
            return "Path is too long (max 1024 characters)"
        }
        return null
    }

    fun validateFileType(contentType: ContentType?, location: UploadLocation): String? {
        if (contentType == null) {
            return "Content type is required"
        }
        if (!location.allowedContentTypes.contains(contentType)) {
            return "File type not allowed for this location: ${contentType.value}"
        }
        return null
    }

    fun validateFileSize(size: Long): String? {
        if (size > MAX_FILE_SIZE) {
            return "File size exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)"
        }
        return null
    }

    fun matchesFileType(fileType: FileType, filter: String): Boolean {
        return when (filter.lowercase()) {
            "image" -> fileType == FileType.IMAGE
            "document" -> fileType == FileType.DOCUMENT
            "video" -> fileType == FileType.VIDEO
            "audio" -> fileType == FileType.AUDIO
            "archive" -> fileType == FileType.ARCHIVE
            else -> true
        }
    }

    fun determineFileType(contentType: ContentType?): FileType {
        return when (contentType) {
            ContentType.JPEG, ContentType.PNG, ContentType.GIF, ContentType.SVG, ContentType.WEBP -> FileType.IMAGE
            ContentType.PDF, ContentType.TEXT, ContentType.JSON -> FileType.DOCUMENT
            else -> FileType.OTHER
        }
    }

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

    fun getFolderInfoByPath(path: String): FolderInfo

    fun getFileInfoByPath(path: String): FileInfo?

    fun getFileInfoById(id: Long): FileInfo?

    fun getFileInfosByIds(ids: List<Long>): List<FileInfo>

    fun getStorageStatistics(path: String? = null): StorageStats

    // New methods for directory tree and bulk operations
    suspend fun fetchDirectoryChildren(path: String? = null): List<FolderInfo>
    suspend fun moveItems(input: MoveItemsInput): BulkOperationResult
    suspend fun copyItems(input: CopyItemsInput): BulkOperationResult
    suspend fun deleteItems(input: DeleteItemsInput): BulkOperationResult
    suspend fun checkFileUsage(input: CheckFileUsageInput): FileUsageResult
    suspend fun updateDirectoryPermissions(input: UpdateDirectoryPermissionsInput): FileOperationResult
    suspend fun setProtection(input: SetProtectionInput): FileOperationResult
}

@OptIn(InternalAPI::class)
fun storageService(
    storage: Storage,
    gcsConfig: GcsConfig,
    storageRepository: repositories.StorageRepository
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
                val dbDirectory = storageRepository.getDirectoryByPath(directoryPath)

                if (dbDirectory != null) {
                    // Directory exists in DB, check permissions
                    if (!dbDirectory.permissions.allowUploads) {
                        return@runBlocking FileUploadResult(false, "Uploads not allowed in this directory", null)
                    }
                } else {
                    // Directory not in DB, check if it exists in bucket (fallback)
                    val bucketDirExists = try {
                        val folderBlob = "${directoryPath}/"
                        storage.get(gcsConfig.bucketName, folderBlob) != null
                    } catch (_: Exception) {
                        false
                    }

                    if (bucketDirExists || directoryPath.isEmpty()) {
                        // Add directory to DB with default permissions
                        val dirName = directoryPath.substringAfterLast('/').takeIf { it.isNotEmpty() } ?: "root"
                        val parentPath = directoryPath.substringBeforeLast('/').takeIf { it.isNotEmpty() }

                        storageRepository.addDirectoryFromBucket(directoryPath, dirName, parentPath)
                    } else {
                        return@runBlocking FileUploadResult(false, "Directory does not exist", null)
                    }
                }
            }

            // Upload to GCS
            val blobId = BlobId.of(gcsConfig.bucketName, path)
            val blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(contentType?.value)
                .build()

            val blob = storage.create(blobInfo, bytes)
            val fileInfo = blobToFileInfo(blob)

            // Add file to DB
            runBlocking {
                try {
                    val now = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
                    val fileEntity = FileEntity(
                        path = path,
                        name = fileInfo.name,
                        directoryPath = directoryPath,
                        size = fileInfo.size,
                        contentType = contentType?.value,
                        md5Hash = blob.md5ToHexString,
                        created = now,
                        lastModified = fileInfo.lastModified,
                        isFromBucket = false
                    )
                    storageRepository.createFile(fileEntity)
                } catch (e: Exception) {
                    // Log but don't fail the upload since the file is already in bucket
                    println("Failed to add file to DB: ${e.message}")
                }
            }

            return FileUploadResult(true, "File uploaded successfully", fileInfo)
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
                    val folderInfo = getFolderInfoByPath(blob.name.removeSuffix("/"))
                    items.add(folderInfo)
                }
            } else {
                // It's a file
                val fileInfo = blobToFileInfo(blob)

                // Apply filters
                if (input.fileType != null && !matchesFileType(fileInfo.fileType, input.fileType)) {
                    continue
                }
                if (input.searchTerm != null && !fileInfo.name.contains(input.searchTerm, ignoreCase = true)) {
                    continue
                }

                items.add(fileInfo)
            }
        }

        // Sort items
        val sortedItems = when (input.sortBy) {
            FileSortField.NAME -> {
                if (input.sortDirection == SortDirection.ASC) items.sortedBy { it.name }
                else items.sortedByDescending { it.name }
            }

            FileSortField.SIZE -> {
                if (input.sortDirection == SortDirection.ASC) items.sortedBy {
                    when (it) {
                        is FileInfo -> it.size
                        is FolderInfo -> it.totalSize
                        else -> 0L
                    }
                }
                else items.sortedByDescending {
                    when (it) {
                        is FileInfo -> it.size
                        is FolderInfo -> it.totalSize
                        else -> 0L
                    }
                }
            }

            FileSortField.MODIFIED -> {
                if (input.sortDirection == SortDirection.ASC) items.sortedBy {
                    when (it) {
                        is FileInfo -> it.lastModified
                        is FolderInfo -> it.lastModified
                        else -> LocalDateTime(1900, 1, 1, 0, 0, 0)
                    }
                }
                else items.sortedByDescending {
                    when (it) {
                        is FileInfo -> it.lastModified
                        is FolderInfo -> it.lastModified
                        else -> LocalDateTime(1900, 1, 1, 0, 0, 0)
                    }
                }
            }

            FileSortField.TYPE -> {
                if (input.sortDirection == SortDirection.ASC) items.sortedBy { it::class.simpleName }
                else items.sortedByDescending { it::class.simpleName }
            }

            null -> TODO()
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
            validatePath(input.name)?.let { error ->
                return FileOperationResult(false, "Invalid folder name: $error")
            }

            val fullPath = "${input.path.trimEnd('/')}/${input.name}".removePrefix("/")

            // Check parent directory permissions
            runBlocking {
                val parentDir = storageRepository.getDirectoryByPath(input.path)
                if (parentDir != null && !parentDir.permissions.allowCreateSubdirs) {
                    return@runBlocking FileOperationResult(false, "Creating subdirectories not allowed in parent directory")
                }
            }

            val folderPath = "$fullPath/"
            val blobId = BlobId.of(gcsConfig.bucketName, folderPath)
            val blobInfo = BlobInfo.newBuilder(blobId).build()
            storage.create(blobInfo)

            // Create folder in DB
            val folderInfo = runBlocking {
                try {
                    val now = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
                    val directoryEntity = DirectoryEntity(
                        path = fullPath,
                        name = input.name,
                        parentPath = input.path.takeIf { it.isNotEmpty() },
                        permissions = input.permissions ?: DirectoryPermissions(),
                        created = now,
                        lastModified = now,
                        isFromBucket = false
                    )
                    val created = storageRepository.createDirectory(directoryEntity)
                    directoryEntityToFolderInfo(created)
                } catch (_: Exception) {
                    // If DB operation fails, still return success since folder was created in bucket
                    getFolderInfoByPath(fullPath)
                }
            }

            return FileOperationResult(true, "Folder created successfully", folderInfo)
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
            val fileInfo = blobToFileInfo(newBlob)

            return FileOperationResult(true, "File renamed successfully", fileInfo)
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
                val isInUse = storageRepository.isFileInUse(path)
                if (isInUse) {
                    return@runBlocking FileOperationResult(false, "File is currently in use and cannot be deleted")
                }

                // Check if the file is protected
                val dbFile = storageRepository.getFileByPath(path)
                if (dbFile?.isProtected == true) {
                    return@runBlocking FileOperationResult(false, "File is protected from deletion")
                }

                // Check parent directory permissions
                val parentPath = path.substringBeforeLast('/')
                val parentDir = storageRepository.getDirectoryByPath(parentPath)
                if (parentDir != null && !parentDir.permissions.allowDeleteFiles) {
                    return@runBlocking FileOperationResult(false, "File deletion not allowed in this directory")
                }
            }

            val blobId = BlobId.of(gcsConfig.bucketName, path)
            val deleted = storage.delete(blobId)

            return if (deleted) {
                // Remove from DB if exists
                runBlocking {
                    try {
                        storageRepository.deleteFile(path)
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

    override fun getFileInfoByPath(path: String): FileInfo? {
        return try {
            val blob = storage.get(gcsConfig.bucketName, path) ?: return null
            blobToFileInfo(blob)
        } catch (_: Exception) {
            null
        }
    }

    override fun getFileInfoById(id: Long): FileInfo? {
        return runBlocking {
            storageRepository.getFileById(id)?.let { fileEntityToFileInfo(it) }
        }
    }

    override fun getFileInfosByIds(ids: List<Long>): List<FileInfo> {
        return runBlocking {
            storageRepository.getFilesByIds(ids).map { fileEntityToFileInfo(it) }
        }
    }

    override fun getStorageStatistics(path: String?): StorageStats {
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

    override fun getFolderInfoByPath(path: String): FolderInfo {
        val folderPath = "$path/"
        val blobs = storage.list(gcsConfig.bucketName, Storage.BlobListOption.prefix(folderPath)).values.toList()

        var fileCount = 0
        var folderCount = 0
        var totalSize = 0L
        var latestModified = LocalDateTime(1900, 1, 1, 0, 0, 0)
        var created = LocalDateTime(2100, 1, 1, 0, 0, 0)

        for (blob in blobs) {
            if (blob.name == folderPath) continue

            val blobTime = timestampToLocalDateTime(blob.updateTimeOffsetDateTime.toInstant().toEpochMilli())
            val blobCreated = timestampToLocalDateTime(blob.createTimeOffsetDateTime.toInstant().toEpochMilli())

            if (blobTime > latestModified) latestModified = blobTime
            if (blobCreated < created) created = blobCreated

            if (blob.name.endsWith("/")) {
                folderCount++
            } else {
                fileCount++
                totalSize += blob.size
            }
        }

        return FolderInfo(
            name = path.substringAfterLast('/'),
            path = path,
            fileCount = fileCount,
            folderCount = folderCount,
            totalSize = totalSize,
            created = if (created == LocalDateTime(2100, 1, 1, 0, 0, 0)) Clock.System.now()
                .toLocalDateTime(TimeZone.currentSystemDefault()) else created,
            lastModified = if (latestModified == LocalDateTime(1900, 1, 1, 0, 0, 0)) Clock.System.now()
                .toLocalDateTime(TimeZone.currentSystemDefault()) else latestModified
        )
    }

    @Suppress("unused")
    fun createFolder(path: String): Blob {
        val blobId = BlobId.of(gcsConfig.bucketName, "$path/")
        val blobInfo = BlobInfo.newBuilder(blobId).build()
        return storage.create(blobInfo)
    }

    fun blobToFileInfo(blob: Blob): FileInfo {
        return FileInfo(
            name = blob.name.substringAfterLast('/'),
            path = blob.name,
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
    override suspend fun fetchDirectoryChildren(path: String?): List<FolderInfo> {
        val searchPath = if (path.isNullOrEmpty()) "" else path.trimEnd('/')

        // Get directories from DB first
        val dbDirectories = storageRepository.getDirectoriesByParentPath(searchPath.takeIf { it.isNotEmpty() })
        val dbPaths = dbDirectories.map { it.path }.toSet()

        // Get directories from bucket that might not be in DB
        val prefix = if (searchPath.isEmpty()) "" else "$searchPath/"
        val options = listOf(
            Storage.BlobListOption.prefix(prefix),
            Storage.BlobListOption.delimiter("/"),
            Storage.BlobListOption.pageSize(1000)
        )

        val page = storage.list(gcsConfig.bucketName, *options.toTypedArray())
        val bucketFolders = mutableListOf<FolderInfo>()

        // Process prefixes (folders) from bucket
        page.iterateAll().forEach { blob ->
            if (blob.isDirectory && blob.name !=prefix) {
                val folderPath = blob.name.trimEnd('/')
                if (!dbPaths.contains(folderPath)) {
                    // Folder exists in bucket but not in DB - add it with fallback
                    val folderName = folderPath.substringAfterLast('/')
                    val parentPath = folderPath.substringBeforeLast('/').takeIf { it.isNotEmpty() }

                    try {
                        val addedDir = storageRepository.addDirectoryFromBucket(folderPath, folderName, parentPath)
                        bucketFolders.add(directoryEntityToFolderInfo(addedDir))
                    } catch (_: Exception) {
                        // If DB operation fails, still show the folder but mark it as bucket-only
                        bucketFolders.add(FolderInfo(
                            name = folderName,
                            path = folderPath,
                            permissions = DirectoryPermissions(), // Default permissions
                            isProtected = false,
                            fileCount = 0,
                            folderCount = 0,
                            totalSize = 0,
                            created = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
                            lastModified = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
                            isFromBucketOnly = true
                        ))
                    }
                }
            }
        }

        // Convert DB directories to FolderInfo and combine with bucket folders
        val dbFolders = dbDirectories.map { directoryEntityToFolderInfo(it) }
        return (dbFolders + bucketFolders).sortedBy { it.name }
    }

    override suspend fun moveItems(input: MoveItemsInput): BulkOperationResult {
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
                val dbSourceDir = storageRepository.getDirectoryByPath(sourceDir)
                if (dbSourceDir != null && !dbSourceDir.permissions.allowMove) {
                    errors.add("Move not allowed from directory: $sourceDir")
                    continue
                }

                // Check permissions for destination directory
                val dbDestDir = storageRepository.getDirectoryByPath(input.destinationPath)
                if (dbDestDir != null && !dbDestDir.permissions.allowUploads) {
                    errors.add("Uploads not allowed to destination directory")
                    continue
                }

                // Perform the move in bucket (copy then delete)
                val fileName = sourcePath.substringAfterLast('/')
                val newPath = "${input.destinationPath.trimEnd('/')}/$fileName"

                val sourceBlobId = BlobId.of(gcsConfig.bucketName, sourcePath)
                val targetBlobId = BlobId.of(gcsConfig.bucketName, newPath)

                val copiedBlob = storage.copy(
                    Storage.CopyRequest.newBuilder()
                        .setSource(sourceBlobId)
                        .setTarget(targetBlobId)
                        .build()
                ).result

                storage.delete(sourceBlobId)

                // Update DB records
                val dbFile = storageRepository.getFileByPath(sourcePath)
                if (dbFile != null) {
                    storageRepository.deleteFile(sourcePath)
                    val updatedFile = dbFile.copy(
                        path = newPath,
                        directoryPath = input.destinationPath,
                        lastModified = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
                    )
                    storageRepository.createFile(updatedFile)
                }

                successfulItems.add(blobToFileInfo(copiedBlob))

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

    override suspend fun copyItems(input: CopyItemsInput): BulkOperationResult {
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
                val dbDestDir = storageRepository.getDirectoryByPath(input.destinationPath)
                if (dbDestDir != null && !dbDestDir.permissions.allowUploads) {
                    errors.add("Uploads not allowed to destination directory")
                    continue
                }

                // Perform the copy in bucket
                val fileName = sourcePath.substringAfterLast('/')
                val newPath = "${input.destinationPath.trimEnd('/')}/$fileName"

                val sourceBlobId = BlobId.of(gcsConfig.bucketName, sourcePath)
                val targetBlobId = BlobId.of(gcsConfig.bucketName, newPath)

                val copiedBlob = storage.copy(
                    Storage.CopyRequest.newBuilder()
                        .setSource(sourceBlobId)
                        .setTarget(targetBlobId)
                        .build()
                ).result

                // Add to DB if source was in DB
                val dbFile = storageRepository.getFileByPath(sourcePath)
                if (dbFile != null) {
                    val copiedFile = dbFile.copy(
                        id = null,
                        path = newPath,
                        directoryPath = input.destinationPath,
                        created = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
                        lastModified = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
                    )
                    storageRepository.createFile(copiedFile)
                }

                successfulItems.add(blobToFileInfo(copiedBlob))

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
                    val isInUse = storageRepository.isFileInUse(path)
                    if (isInUse) {
                        errors.add("File is currently in use: $path")
                        continue
                    }
                }

                // Check if file/directory is protected
                val dbFile = storageRepository.getFileByPath(path)
                val dbDir = storageRepository.getDirectoryByPath(path)

                if (dbFile?.isProtected == true || dbDir?.isProtected == true) {
                    errors.add("Item is protected from deletion: $path")
                    continue
                }

                // Check parent directory permissions
                val parentPath = path.substringBeforeLast('/')
                val parentDir = storageRepository.getDirectoryByPath(parentPath)
                if (parentDir != null) {
                    val isFile = dbFile != null
                    val canDelete = if (isFile) parentDir.permissions.allowDeleteFiles else parentDir.permissions.allowDelete
                    if (!canDelete) {
                        errors.add("Deletion not allowed in parent directory: $path")
                        continue
                    }
                }

                // Get info before deleting for the result
                val fileInfo = getFileInfoByPath(path)
                val folderInfo = if (fileInfo == null) getFolderInfoByPath(path) else null

                // Delete from bucket
                val deleted = storage.delete(gcsConfig.bucketName, path)
                if (!deleted) {
                    errors.add("Failed to delete from storage: $path")
                    continue
                }

                // Delete from DB
                if (dbFile != null) {
                    storageRepository.deleteFile(path)
                    fileInfo?.let { successfulItems.add(it) }
                } else if (dbDir != null) {
                    storageRepository.deleteDirectory(path)
                    folderInfo?.let { successfulItems.add(it) }
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
                deleteBlockReason = if (isInUse) "File is currently in use" else null
            )
        } catch (_: Exception) {
            FileUsageResult(
                isInUse = false,
                usages = emptyList(),
                canDelete = true,
                deleteBlockReason = null
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
                FileOperationResult(false, "Directory not found", null)
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
                    FileOperationResult(false, "Path not found in database", null)
                }
            }
        } catch (e: Exception) {
            FileOperationResult(false, "Failed to set protection: ${e.message}", null)
        }
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
