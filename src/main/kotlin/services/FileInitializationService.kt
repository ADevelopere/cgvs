package services

import com.google.cloud.storage.Storage
import config.GcsConfig
import schema.model.*

class FileInitializationService(
    private val storageService: StorageService,
    private val storageDbService: StorageDbService,
    private val storage: Storage,
    private val gcsConfig: GcsConfig
) {
    /**
     * Initialize required directories and upload demo files
     */
    suspend fun initializeFileSystem() {
        println("🗂️  Initializing file system...")

        // Create required directories
        createRequiredDirectories()

        // Upload demo template files
        uploadDemoTemplateFiles()

        println("✅ File system initialization completed")
    }

    /**
     * Create required directories in the storage system
     */
    private fun createRequiredDirectories() {
        val requiredDirectories = listOf(
            DirectoryInfo("public", "Public files directory", null),
            DirectoryInfo("public/templates", "Template files directory", "public"),
            DirectoryInfo("public/templates/covers", "Template cover images", "public/templates"),
            DirectoryInfo("public/certificates", "Generated certificate files", "public"),
            DirectoryInfo("public/uploads", "User uploaded files", "public"),
            DirectoryInfo("public/temp", "Temporary files", "public")
        )

        for (dirInfo in requiredDirectories) {
            createDirectoryIfNotExists(dirInfo)
        }
    }

    /**
     * Create a directory if it doesn't exist
     */
    private fun createDirectoryIfNotExists(dirInfo: DirectoryInfo) {
        // Check if directory exists by trying to get folder entity
        val existingFolder = try {
            storageService.getFolderEntityByPath(dirInfo.path)
        } catch (_: Exception) {
            null
        }

        if (existingFolder != null) {
            println("   📁 Directory already exists: ${dirInfo.path}")
            return
        }

        // Create directory in bucket (as an empty object with trailing slash)
        val bucketPath = "${dirInfo.path}/"
        try {
            val blob = storage.get(gcsConfig.bucketName, bucketPath)
            if (blob == null) {
                // Create the directory marker in the bucket
                val blobInfo = com.google.cloud.storage.BlobInfo.newBuilder(gcsConfig.bucketName, bucketPath)
                    .setContentType("application/x-directory")
                    .build()
                storage.create(blobInfo, ByteArray(0))
                println("   📁 Created directory in bucket: ${dirInfo.path}")
            }
        } catch (e: Exception) {
            println("   ⚠️  Warning: Could not create directory in bucket: ${dirInfo.path} - ${e.message}")
        }

        // Register directory using StorageService
        val createFolderInput = CreateFolderInput(
            path = dirInfo.parentPath ?: "",
            name = dirInfo.name,
            permissions = DirectoryPermissions(
                allowUploads = true,
                allowDelete = dirInfo.path != "public", // Protect root public dir
                allowMove = dirInfo.path != "public",
                allowCreateSubDirs = true,
                allowDeleteFiles = true,
                allowMoveFiles = true
            )
        )

        val result = storageService.createFolder(createFolderInput)
        if (result.success) {
            println("   📁 Created directory: ${dirInfo.path}")
        } else {
            println("   ⚠️  Warning: Could not register directory in database: ${result.message}")
        }
    }

    /**
     * Upload demo template files from resources
     */
    private suspend fun uploadDemoTemplateFiles() {
        val demoFiles = listOf(
            "demo1.jpg",
            "demo2.jpg",
            "demo3.jpg",
            "demo4.jpg"
        )

        for (fileName in demoFiles) {
            uploadDemoFileIfNotExists(fileName)
        }

        // After processing all files, verify they are in the database
        println("   🔍 Verifying demo files are registered in database...")
        verifyDemoFilesInDatabase()
    }

    /**
     * Upload a demo file if it doesn't exist in storage
     */
    private suspend fun uploadDemoFileIfNotExists(fileName: String) {
        val bucketPath = "public/templates/covers/$fileName"

        // First check if file exists in database using StorageDbService
        val existingFileInDb = storageDbService.getFileEntityByPath(bucketPath)
        if (existingFileInDb != null) {
            println("   🖼️  Demo file already exists in database: $fileName (ID: ${existingFileInDb.id})")
            return
        }

        // Check if file exists using StorageService (this might find files in bucket but not in DB)
        val existingFile = storageService.getFileEntityByPath(bucketPath)
        if (existingFile != null) {
            if (existingFile.isFromBucket == true) {
                // File exists in bucket but not properly in database - this shouldn't happen normally
                // but let's register it properly in the database
                println("   🖼️  Demo file exists in bucket only, registering in database: $fileName")
            } else {
                // File exists and is properly registered
                println("   🖼️  Demo file already exists in storage service: $fileName")
                return
            }
        }

        // Check if file exists in the bucket
        try {
            val blob = storage.get(gcsConfig.bucketName, bucketPath)
            if (blob != null && blob.size > 0) {
                // File exists in bucket but not in database - register it in the database
                println("   🖼️  Demo file exists in bucket, registering in database: $fileName")

                try {
                    val contentType = getContentTypeFromFileName(fileName)
                    val directoryPath = "public/templates/covers"

                    // Register the existing file in the database using storageDbService
                    val fileEntity = storageDbService.addFileFromBucket(
                        path = bucketPath,
                        name = fileName,
                        directoryPath = directoryPath,
                        size = blob.size,
                        contentType = contentType.value,
                        md5Hash = blob.md5ToHexString
                    )

                    println("   ✅ Registered existing demo file in database: $fileName (ID: ${fileEntity.id})")
                } catch (e: Exception) {
                    println("   ⚠️  Error registering existing demo file: ${e.message}")
                }
                return
            }
        } catch (e: Exception) {
            println("   ⚠️  Could not check bucket for file: $fileName - ${e.message}")
        }

        // Upload file from resources using StorageService
        try {
            val resourcePath = "/img/$fileName"
            val inputStream = this::class.java.getResourceAsStream(resourcePath)

            if (inputStream == null) {
                println("   ❌ Resource not found: $resourcePath")
                return
            }

            inputStream.use { stream ->
                val contentType = getContentTypeFromFileName(fileName)

                val result = storageService.uploadFile(
                    path = bucketPath,
                    inputStream = stream,
                    contentType = contentType,
                    originalFilename = fileName,
                    location = UploadLocation.TEMPLATE_COVER
                )

                if (result.success) {
                    println("   🖼️  Uploaded demo file: $fileName")
                } else {
                    println("   ❌ Failed to upload demo file $fileName: ${result.message}")
                }
            }
        } catch (e: Exception) {
            println("   ❌ Failed to upload demo file $fileName: ${e.message}")
        }
    }

    /**
     * Verify that all demo files are properly registered in the database
     */
    private suspend fun verifyDemoFilesInDatabase() {
        val demoFiles = listOf(
            "demo1.jpg" to "public/templates/covers/demo1.jpg",
            "demo2.jpg" to "public/templates/covers/demo2.jpg",
            "demo3.jpg" to "public/templates/covers/demo3.jpg",
            "demo4.jpg" to "public/templates/covers/demo4.jpg"
        )

        for ((fileName, bucketPath) in demoFiles) {
            val existingFileInDb = storageDbService.getFileEntityByPath(bucketPath)
            if (existingFileInDb == null) {
                println("   ⚠️  Demo file $fileName not found in database, attempting to register...")

                // Check if it exists in bucket and register it
                try {
                    val blob = storage.get(gcsConfig.bucketName, bucketPath)
                    if (blob != null && blob.size > 0) {
                        val contentType = getContentTypeFromFileName(fileName)
                        val directoryPath = "public/templates/covers"

                        val fileEntity = storageDbService.addFileFromBucket(
                            path = bucketPath,
                            name = fileName,
                            directoryPath = directoryPath,
                            size = blob.size,
                            contentType = contentType.value,
                            md5Hash = blob.md5ToHexString
                        )

                        println("   ✅ Registered demo file in database: $fileName (ID: ${fileEntity.id})")
                    } else {
                        println("   ❌ Demo file $fileName not found in bucket either")
                    }
                } catch (e: Exception) {
                    println("   ❌ Error registering demo file $fileName: ${e.message}")
                }
            } else {
                println("   ✅ Demo file $fileName already in database (ID: ${existingFileInDb.id})")
            }
        }
    }

    /**
     * Get demo files that are available for templates
     */
    suspend fun getDemoFileIds(): List<Long> {
        val demoFiles = listOf(
            "public/templates/covers/demo1.jpg",
            "public/templates/covers/demo2.jpg",
            "public/templates/covers/demo3.jpg",
            "public/templates/covers/demo4.jpg"
        )

        println("   🔍 Checking for demo files in database...")
        val fileIds = demoFiles.mapNotNull { path ->
            val fileEntity = storageDbService.getFileEntityByPath(path)
            if (fileEntity != null) {
                println("   ✅ Found demo file in database: $path (ID: ${fileEntity.id})")
                fileEntity.id
            } else {
                println("   ❌ Demo file NOT found in database: $path")
                null
            }
        }

        println("   📊 Total demo files found: ${fileIds.size} out of ${demoFiles.size}")
        return fileIds
    }

    /**
     * Get demo file paths (alternative to IDs for better service layer compatibility)
     */
    suspend fun getDemoFilePaths(): List<String> {
        val demoFiles = listOf(
            "public/templates/covers/demo1.jpg",
            "public/templates/covers/demo2.jpg",
            "public/templates/covers/demo3.jpg",
            "public/templates/covers/demo4.jpg"
        )

        return demoFiles.filter { path ->
            storageDbService.getFileEntityByPath(path) != null
        }
    }

    /**
     * Register file usage for template covers
     */
    suspend fun registerTemplateFileUsage(templateId: Int, fileId: Long) {
        val fileEntity = storageDbService.getFileEntityById(fileId)
        if (fileEntity != null) {
            val input = RegisterFileUsageInput(
                filePath = fileEntity.path,
                usageType = "template_cover",
                referenceId = templateId.toLong(),
                referenceTable = "templates"
            )

            val result = storageDbService.registerFileUsage(input)
            if (result.success) {
                println("   📎 Registered file usage for template $templateId with file $fileId at path: ${fileEntity.path}")
            } else {
                println("   ⚠️  Failed to register file usage: ${result.message}")
            }
        } else {
            println("   ⚠️  File with ID $fileId not found")
        }
    }

    private fun getContentTypeFromFileName(fileName: String): ContentType {
        return when (fileName.substringAfterLast(".").lowercase()) {
            "jpg", "jpeg" -> ContentType.JPEG
            "png" -> ContentType.PNG
            "gif" -> ContentType.GIF
            "svg" -> ContentType.SVG
            else -> ContentType.JPEG
        }
    }

    private data class DirectoryInfo(
        val path: String,
        val description: String,
        val parentPath: String?
    ) {
        val name: String = path.substringAfterLast("/")
    }
}
