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
    fun initializeFileSystem() {
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
            CreateFolderInput(path = "public", protected = true),
            CreateFolderInput(path = "public/templates", protected = true),
            CreateFolderInput(path = "public/templates/covers", protected = true)
        )

        for (input in requiredDirectories) {
            createDirectoryIfNotExists(input)
        }
    }

    /**
     * Create a directory if it doesn't exist
     */
    private fun createDirectoryIfNotExists(input: CreateFolderInput) {
        // Check if directory exists in the bucket
        val bucketPath = "${input.path}/"
        try {
            val blob = storage.get(gcsConfig.bucketName, bucketPath)
            if (blob == null) {
                // Create the directory marker in the bucket
                val blobInfo = com.google.cloud.storage.BlobInfo.newBuilder(gcsConfig.bucketName, bucketPath)
                    .setContentType("application/x-directory")
                    .build()
                storage.create(blobInfo, ByteArray(0))
                println("   📁 Created directory in bucket: ${input.path}")
            } else {
                println("   📁 Directory already exists in bucket: ${input.path}")
            }
        } catch (e: Exception) {
            println("   ⚠️  Warning: Could not create directory in bucket: ${input.path} - ${e.message}")
        }

        val result = storageService.createFolder(input)
        if (result.success) {
            println("   📁 Created directory with permissions: ${input.path}")
        } else {
            println("   ⚠️  Warning: Could not register directory permissions in database: ${result.message}")
        }
    }

    /**
     * Upload demo template files from resources
     */
    private fun uploadDemoTemplateFiles() {
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
    private fun uploadDemoFileIfNotExists(fileName: String) {
        val bucketPath = "public/templates/covers/$fileName"

        // Check if file exists in the bucket
        try {
            val blob = storage.get(gcsConfig.bucketName, bucketPath)
            if (blob != null && blob.size > 0) {
                println("   🖼️  Demo file already exists in bucket: $fileName")
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
     * Verify that all demo files are properly accessible in the bucket
     */
    private fun verifyDemoFilesInDatabase() {
        val demoFiles = listOf(
            "demo1.jpg" to "public/templates/covers/demo1.jpg",
            "demo2.jpg" to "public/templates/covers/demo2.jpg",
            "demo3.jpg" to "public/templates/covers/demo3.jpg",
            "demo4.jpg" to "public/templates/covers/demo4.jpg"
        )

        for ((fileName, bucketPath) in demoFiles) {
            try {
                val blob = storage.get(gcsConfig.bucketName, bucketPath)
                if (blob != null && blob.size > 0) {
                    println("   ✅ Demo file exists in bucket: $fileName")
                } else {
                    println("   ❌ Demo file NOT found in bucket: $fileName")
                }
            } catch (e: Exception) {
                println("   ❌ Error checking demo file $fileName: ${e.message}")
            }
        }
    }

    /**
     * Get demo files that are available for templates
     * Since files are no longer automatically stored in DB,
     * we'll register them in DB when they're first used
     */
    suspend fun getDemoFileIds(): List<Long> {
        val demoFiles = listOf(
            "public/templates/covers/demo1.jpg",
            "public/templates/covers/demo2.jpg",
            "public/templates/covers/demo3.jpg",
            "public/templates/covers/demo4.jpg"
        )

        println("   🔍 Checking for demo files and registering as needed...")
        val fileIds = demoFiles.mapNotNull { path ->
            // First check if already in DB
            val existingFile = storageDbService.fileByPath(path)
            if (existingFile != null) {
                println("   ✅ Found demo file in database: $path (ID: ${existingFile.id})")
                existingFile.id
            } else {
                // Check if exists in bucket and register it for use
                try {
                    val blob = storage.get(gcsConfig.bucketName, path)
                    if (blob != null && blob.size > 0) {
                        val fileName = path.substringAfterLast('/')
                        val directoryPath = path.substringBeforeLast('/')
                        val contentType = getContentTypeFromFileName(fileName)

                        val fileEntity = storageDbService.createFile(
                            path = path,
                            name = fileName,
                            directoryPath = directoryPath,
                            size = blob.size,
                            contentType = contentType.value,
                            md5Hash = blob.md5ToHexString
                        )

                        println("   ✅ Registered demo file for use: $path (ID: ${fileEntity.id})")
                        fileEntity.id
                    } else {
                        println("   ❌ Demo file NOT found in bucket: $path")
                        null
                    }
                } catch (e: Exception) {
                    println("   ❌ Error accessing demo file $path: ${e.message}")
                    null
                }
            }
        }

        println("   📊 Total demo files available: ${fileIds.size} out of ${demoFiles.size}")
        return fileIds.map { it.value }
    }

    /**
     * Register file usage for template covers
     */
    suspend fun registerTemplateFileUsage(templateId: Int, fileId: Long) {
        val fileEntity = storageDbService.fileById(fileId)
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
}
