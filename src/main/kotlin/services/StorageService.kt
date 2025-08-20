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

        val ALLOWED_FILE_TYPES = setOf(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
            "application/pdf", "text/plain", "text/csv",
            "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/zip", "application/x-rar-compressed"
        )

        val PATH_PATTERN = Regex("^[a-zA-Z0-9._/-]+$")
    }

    suspend fun handleFileUpload(call: ApplicationCall, folder: String)

    fun fileExists(path: String): Boolean

    fun generateUploadSignedUrl(path: String, contentType: String): String

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

    fun validateFileType(contentType: String?): String? {
        if (contentType == null) {
            return "Content type is required"
        }
        if (!ALLOWED_FILE_TYPES.contains(contentType.lowercase())) {
            return "File type not allowed: $contentType"
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

    fun determineFileType(contentType: String?): FileType {
        return when {
            contentType?.startsWith("image/") == true -> FileType.IMAGE
            contentType?.startsWith("video/") == true -> FileType.VIDEO
            contentType?.startsWith("audio/") == true -> FileType.AUDIO
            contentType in listOf(
                "application/pdf", "text/plain", "text/csv",
                "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ) -> FileType.DOCUMENT

            contentType in listOf("application/zip", "application/x-rar-compressed") -> FileType.ARCHIVE
            else -> FileType.OTHER
        }
    }

    fun uploadFile(
        path: String,
        inputStream: InputStream,
        contentType: String?,
        originalFilename: String? = null
    ): FileUploadResult

    fun listFiles(input: ListFilesInput): StorageObjectList

    fun createFolder(input: CreateFolderInput): FileOperationResult

    fun renameFile(input: RenameFileInput): FileOperationResult

    fun deleteFile(path: String): FileOperationResult

    fun getFolderInfoByPath(path: String): FolderInfo

    fun getFileInfoByPath(path: String): FileInfo?

    fun getStorageStatistics(path: String? = null): StorageStats
}

@OptIn(InternalAPI::class)
fun storageService(
    storage: Storage,
    gcsConfig: GcsConfig
) = object : StorageService {
    override suspend fun handleFileUpload(call: ApplicationCall, folder: String) {
        try {
            val parts = call.receiveMultipart()
            var fileName: String? = null
            var fileBytes: ByteArray? = null
            var fileContentType: String? = null
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
                            fileContentType = part.contentType?.toString()
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
                call.respond(HttpStatusCode.BadRequest, FileUploadResult(success = false, message = "File must have a name"))
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
                originalFilename = finalFileName
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

    override fun generateUploadSignedUrl(path: String, contentType: String): String {
        validatePath(path)?.let { throw Exception(it) }
        validateFileType(contentType)?.let { throw Exception(it) }

        val blobInfo = BlobInfo.newBuilder(BlobId.of(gcsConfig.bucketName, path))
            .setContentType(contentType)
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
        contentType: String?,
        originalFilename: String?
    ): FileUploadResult {
        try {
            if (!path.startsWith("public/")) {
                return FileUploadResult(false, "Uploads are restricted to the 'public' directory.")
            }

            // Validate path
            validatePath(path)?.let { error ->
                return FileUploadResult(false, error)
            }

            if (fileExists(path)) {
                return FileUploadResult(false, "File with the same name already exists in this folder.")
            }

            // Validate content type
            validateFileType(contentType)?.let { error ->
                return FileUploadResult(false, error)
            }

            // Read input stream to validate size
            val bytes = inputStream.readBytes()
            validateFileSize(bytes.size.toLong())?.let { error ->
                return FileUploadResult(false, error)
            }

            val blobId = BlobId.of(gcsConfig.bucketName, path)
            val blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(contentType)
                .apply {
                    originalFilename?.let { setMetadata(mapOf("originalFilename" to it)) }
                }
                .build()

            val blob = storage.create(blobInfo, bytes)

            val fileInfo = FileInfo(
                name = originalFilename ?: blob.name.substringAfterLast('/'),
                path = blob.name,
                size = blob.size,
                contentType = blob.contentType,
                lastModified = timestampToLocalDateTime(blob.updateTimeOffsetDateTime.toInstant().toEpochMilli()),
                created = timestampToLocalDateTime(blob.createTimeOffsetDateTime.toInstant().toEpochMilli()),
                url = gcsConfig.baseUrl + blob.name,
                mediaLink = blob.mediaLink,
                fileType = determineFileType(blob.contentType),
                md5Hash = blob.md5,
                isPublic = false
            )

            return FileUploadResult(true, "File uploaded successfully", fileInfo)
        } catch (_: Exception) {
            return FileUploadResult(false, "An unexpected error occurred during file upload.")
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

            val fullPath = "${input.path.trimEnd('/')}/${input.name}/"
            val blobId = BlobId.of(gcsConfig.bucketName, fullPath)
            val blobInfo = BlobInfo.newBuilder(blobId).build()
            storage.create(blobInfo)

            val folderInfo = getFolderInfoByPath(fullPath.removeSuffix("/"))
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

            val blobId = BlobId.of(gcsConfig.bucketName, path)
            val deleted = storage.delete(blobId)

            return if (deleted) {
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
                    val fileType = determineFileType(blob.contentType)
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
            fileType = determineFileType(blob.contentType),
            md5Hash = blob.md5,
            isPublic = blob.name.startsWith("public/")
        )
    }
}
