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
import util.*
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.util.concurrent.TimeUnit

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

    fun listFiles(input: ListFilesInput): StorageEntityList

    fun createFolder(input: CreateFolderInput): FileOperationResult

    fun renameFile(input: RenameFileInput): FileOperationResult

    fun deleteFile(path: String): FileOperationResult

    fun getFolderEntityByPath(path: String): DirectoryEntity

    fun getFileEntityByPath(path: String): FileEntity?

    fun getStorageStatistics(path: String? = null): StorageStats

    // New methods for directory tree and bulk operations
    suspend fun fetchDirectoryChildren(path: String? = null): List<DirectoryEntity>
    suspend fun moveItems(input: MoveStorageItemsInput): BulkOperationResult
    suspend fun copyItems(input: CopyStorageItemsInput): BulkOperationResult
    suspend fun deleteItems(input: DeleteItemsInput): BulkOperationResult
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
            val createdFileEntity = runBlocking {
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
                    // Return a fallback entity
                    FileEntity(
                        path = path,
                        name = fileInfo.name,
                        directoryPath = directoryPath,
                        size = fileInfo.size,
                        contentType = contentType?.value,
                        md5Hash = blob.md5ToHexString,
                        created = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
                        lastModified = fileInfo.lastModified,
                        isFromBucket = true
                    )
                }
            }

            return FileUploadResult(true, "File uploaded successfully", createdFileEntity)
        } catch (e: Exception) {
            return FileUploadResult(false, "Upload failed: ${e.message}", null)
        }
    }

    override fun listFiles(input: ListFilesInput): StorageEntityList {
        val prefix = if (input.path.isEmpty()) "" else "${input.path.trimEnd('/')}/"
        val options = listOf(
            Storage.BlobListOption.prefix(prefix),
            Storage.BlobListOption.currentDirectory(),
            Storage.BlobListOption.pageSize(
                ((input.limit ?: ListFilesInput.DEFAULT_LIMIT) + (input.offset ?: 0) + 1).toLong()
            )
        )

        val blobs = storage.list(gcsConfig.bucketName, *options.toTypedArray()).values.toList()
        val items = mutableListOf<StorageEntity>()

        // Process blobs
        for (blob in blobs) {
            if (blob.name == prefix) continue // Skip the folder itself

            if (blob.name.endsWith("/")) {
                // It's a folder
                val folderName = blob.name.removeSuffix("/").substringAfterLast('/')
                if (folderName.isNotEmpty()) {
                    val folderEntity = getFolderEntityByPath(blob.name.removeSuffix("/"))
                    items.add(folderEntity)
                }
            } else {
                // It's a file
                val fileEntity = getFileEntityByPath(blob.name)
                if (fileEntity != null) {
                    // Apply filters
                    if (input.fileType != null) {
                        val fileType = determineFileType(ContentType.entries.find { it.value == fileEntity.contentType })
                        if (!matchesFileType(fileType, input.fileType)) {
                            continue
                        }
                    }
                    if (input.searchTerm != null && !fileEntity.name.contains(input.searchTerm, ignoreCase = true)) {
                        continue
                    }

                    items.add(fileEntity)
                }
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
                        is FileEntity -> it.size
                        is DirectoryEntity -> 0L // Directories don't have size
                        else -> 0L
                    }
                }
                else items.sortedByDescending {
                    when (it) {
                        is FileEntity -> it.size
                        is DirectoryEntity -> 0L // Directories don't have size
                        else -> 0L
                    }
                }
            }

            FileSortField.MODIFIED -> {
                if (input.sortDirection == SortDirection.ASC) items.sortedBy {
                    when (it) {
                        is FileEntity -> it.lastModified
                        is DirectoryEntity -> it.lastModified
                        else -> LocalDateTime(1900, 1, 1, 0, 0, 0)
                    }
                }
                else items.sortedByDescending {
                    when (it) {
                        is FileEntity -> it.lastModified
                        is DirectoryEntity -> it.lastModified
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

        return StorageEntityList(
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
                if (parentDir != null && !parentDir.permissions.allowCreateSubDirs) {
                    return@runBlocking FileOperationResult(false, "Creating subdirectories not allowed in parent directory")
                }
            }

            val folderPath = "$fullPath/"
            val blobId = BlobId.of(gcsConfig.bucketName, folderPath)
            val blobInfo = BlobInfo.newBuilder(blobId).build()
            storage.create(blobInfo)

            // Create folder in DB
            val createdEntity = runBlocking {
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
                    storageRepository.createDirectory(directoryEntity)
                } catch (_: Exception) {
                    // If DB operation fails, still return success since folder was created in bucket
                    getFolderEntityByPath(fullPath)
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
                    // Delete old file record and create new one
                    storageRepository.deleteFile(input.currentPath)

                    // Add the file with new path
                    val fileName = input.newName
                    val directoryPath = newPath.substringBeforeLast('/')
                    storageRepository.addFileFromBucket(
                        path = newPath,
                        name = fileName,
                        directoryPath = directoryPath,
                        size = newBlob.size,
                        contentType = newBlob.contentType,
                        md5Hash = newBlob.md5
                    )
                } catch (_: Exception) {
                    // Fallback to creating a new entity
                    getFileEntityByPath(newPath)
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

    override fun getFileEntityByPath(path: String): FileEntity? {
        return try {
            // First check if file exists in database
            val dbFile = runBlocking { storageRepository.getFileByPath(path) }
            if (dbFile != null) {
                return dbFile
            }

            // If not in DB, check bucket and add to DB if it exists
            val blob = storage.get(gcsConfig.bucketName, path) ?: return null

            // Add file to database
            val fileName = path.substringAfterLast('/')
            val directoryPath = path.substringBeforeLast('/')
            return runBlocking {
                storageRepository.addFileFromBucket(
                    path = path,
                    name = fileName,
                    directoryPath = directoryPath,
                    size = blob.size,
                    contentType = blob.contentType,
                    md5Hash = blob.md5
                )
            }
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

    override fun getFolderEntityByPath(path: String): DirectoryEntity {
        // First check if directory exists in database
        val dbDirectory = runBlocking { storageRepository.getDirectoryByPath(path) }
        if (dbDirectory != null) {
            return dbDirectory
        }

        // If not in DB, check bucket and add to DB if it exists
        val folderPath = "$path/"
        val blobs = storage.list(gcsConfig.bucketName, Storage.BlobListOption.prefix(folderPath)).values.toList()

        // Check if folder exists in bucket (has files or subfolder marker)
        val folderExists = blobs.isNotEmpty() || storage.get(gcsConfig.bucketName, folderPath) != null

        if (folderExists) {
            // Add directory to database
            val folderName = path.substringAfterLast('/')
            val parentPath = path.substringBeforeLast('/').takeIf { it.isNotEmpty() }

            return runBlocking {
                try {
                    storageRepository.addDirectoryFromBucket(path, folderName, parentPath)
                } catch (_: Exception) {
                    // If DB operation fails, return a temporary entity
                    DirectoryEntity(
                        name = folderName,
                        path = path,
                        parentPath = parentPath,
                        permissions = DirectoryPermissions(),
                        isProtected = false,
                        created = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
                        lastModified = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
                        isFromBucket = true
                    )
                }
            }
        }

        // Return a default entity if folder doesn't exist
        return DirectoryEntity(
            name = path.substringAfterLast('/'),
            path = path,
            parentPath = path.substringBeforeLast('/').takeIf { it.isNotEmpty() },
            permissions = DirectoryPermissions(),
            isProtected = false,
            created = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
            lastModified = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
            isFromBucket = false
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
    override suspend fun fetchDirectoryChildren(path: String?): List<DirectoryEntity> {
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
        val bucketFolders = mutableListOf<DirectoryEntity>()

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
                        bucketFolders.add(addedDir)
                    } catch (_: Exception) {
                        // If DB operation fails, still show the folder but mark it as bucket-only
                        bucketFolders.add(DirectoryEntity(
                            name = folderName,
                            path = folderPath,
                            parentPath = parentPath,
                            permissions = DirectoryPermissions(), // Default permissions
                            isProtected = false,
                            created = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
                            lastModified = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()),
                            isFromBucket = true
                        ))
                    }
                }
            }
        }

        // Convert DB directories and combine with bucket folders
        return (dbDirectories + bucketFolders).sortedBy { it.name }
    }

    override suspend fun moveItems(input: MoveStorageItemsInput): BulkOperationResult {
        val errors = mutableListOf<String>()
        val successfulItems = mutableListOf<StorageEntity>()

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
                    successfulItems.add(updatedFile)
                } else {
                    // File not in DB, get entity from bucket
                    getFileEntityByPath(newPath)?.let { successfulItems.add(it) }
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
        val successfulItems = mutableListOf<StorageEntity>()

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
                    val createdFile = storageRepository.createFile(copiedFile)
                    successfulItems.add(createdFile)
                } else {
                    // File not in DB, get entity from bucket
                    getFileEntityByPath(newPath)?.let { successfulItems.add(it) }
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
        val successfulItems = mutableListOf<StorageEntity>()

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

                // Get entity before deleting for the result
                val fileEntity = getFileEntityByPath(path)
                val folderEntity = if (fileEntity == null) getFolderEntityByPath(path) else null

                // Delete from bucket
                val deleted = storage.delete(gcsConfig.bucketName, path)
                if (!deleted) {
                    errors.add("Failed to delete from storage: $path")
                    continue
                }

                // Delete from DB
                if (dbFile != null) {
                    storageRepository.deleteFile(path)
                    fileEntity?.let { successfulItems.add(it) }
                } else if (dbDir != null) {
                    storageRepository.deleteDirectory(path)
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

}
