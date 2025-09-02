package services

import config.GcsConfig
import com.google.cloud.storage.Storage
import schema.model.*
import repositories.StorageRepository
import kotlinx.coroutines.runBlocking
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import java.io.InputStream
import kotlinx.io.readByteArray
import java.security.MessageDigest

class FileInitializationService(
    private val storageService: StorageService,
    private val storageRepository: StorageRepository,
    private val storage: Storage,
    private val gcsConfig: GcsConfig
) {

    private val currentTime = Clock.System.now().toLocalDateTime(TimeZone.UTC)

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
    private suspend fun createRequiredDirectories() {
        val requiredDirectories = listOf(
            DirectoryInfo("public", "Public files directory", null),
            DirectoryInfo("public/templates", "Template files directory", "public"),
            DirectoryInfo("public/templates/covers", "Template cover images", "public/templates"),
            DirectoryInfo("public/certificates", "Generated certificate files", "public"),
            DirectoryInfo("public/uploads", "User uploaded files", "public"),
            DirectoryInfo("private", "Private files directory", null),
            DirectoryInfo("private/temp", "Temporary files", "private")
        )

        for (dirInfo in requiredDirectories) {
            createDirectoryIfNotExists(dirInfo)
        }
    }

    /**
     * Create a directory if it doesn't exist
     */
    private suspend fun createDirectoryIfNotExists(dirInfo: DirectoryInfo) {
        // Check if directory exists in database
        val existingDir = storageRepository.getDirectoryByPath(dirInfo.path)
        if (existingDir != null) {
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

        // Register directory in database
        val directoryEntity = DirectoryEntity(
            path = dirInfo.path,
            name = dirInfo.name,
            parentPath = dirInfo.parentPath,
            permissions = DirectoryPermissions(
                allowUploads = true,
                allowDelete = dirInfo.path != "public" && dirInfo.path != "private", // Protect root dirs
                allowMove = dirInfo.path != "public" && dirInfo.path != "private",
                allowCreateSubdirs = true,
                allowDeleteFiles = true,
                allowMoveFiles = true
            ),
            isProtected = dirInfo.path == "public" || dirInfo.path == "private",
            protectChildren = false,
            created = currentTime,
            lastModified = currentTime,
            createdBy = null,
            isFromBucket = false
        )

        storageRepository.createDirectory(directoryEntity)
        println("   📁 Created directory: ${dirInfo.path}")
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
    }

    /**
     * Upload a demo file if it doesn't exist in storage
     */
    private suspend fun uploadDemoFileIfNotExists(fileName: String) {
        val bucketPath = "public/templates/covers/$fileName"
        
        // Check if file exists in database
        val existingFile = storageRepository.getFileByPath(bucketPath)
        if (existingFile != null) {
            println("   🖼️  Demo file already exists: $fileName")
            return
        }

        // Check if file exists in bucket
        try {
            val blob = storage.get(gcsConfig.bucketName, bucketPath)
            if (blob != null && blob.size > 0) {
                // File exists in bucket but not in database - register it
                registerExistingBucketFile(bucketPath, fileName, blob.size, blob.contentType)
                println("   🖼️  Registered existing demo file: $fileName")
                return
            }
        } catch (e: Exception) {
            println("   ⚠️  Could not check bucket for file: $fileName - ${e.message}")
        }

        // Upload file from resources
        try {
            val resourcePath = "/img/$fileName"
            val inputStream = this::class.java.getResourceAsStream(resourcePath)
            
            if (inputStream == null) {
                println("   ❌ Resource not found: $resourcePath")
                return
            }

            inputStream.use { stream ->
                val fileBytes = stream.readBytes()
                val contentType = getContentTypeFromFileName(fileName)
                
                // Upload to bucket
                val blobInfo = com.google.cloud.storage.BlobInfo.newBuilder(gcsConfig.bucketName, bucketPath)
                    .setContentType(contentType.value)
                    .build()
                
                storage.create(blobInfo, fileBytes)
                
                // Register in database
                val md5Hash = calculateMD5(fileBytes)
                registerUploadedFile(bucketPath, fileName, fileBytes.size.toLong(), contentType, md5Hash)
                
                println("   🖼️  Uploaded demo file: $fileName (${fileBytes.size} bytes)")
            }
        } catch (e: Exception) {
            println("   ❌ Failed to upload demo file $fileName: ${e.message}")
        }
    }

    /**
     * Register an existing bucket file in the database
     */
    private suspend fun registerExistingBucketFile(path: String, name: String, size: Long, contentType: String?) {
        val directoryPath = path.substringBeforeLast("/")
        val fileEntity = FileEntity(
            path = path,
            name = name,
            directoryPath = directoryPath,
            size = size,
            contentType = contentType,
            md5Hash = null, // Would need to fetch from bucket to calculate
            isProtected = false,
            created = currentTime,
            lastModified = currentTime,
            createdBy = null,
            isFromBucket = true
        )
        
        storageRepository.createFile(fileEntity)
    }

    /**
     * Register a newly uploaded file in the database
     */
    private suspend fun registerUploadedFile(path: String, name: String, size: Long, contentType: ContentType, md5Hash: String) {
        val directoryPath = path.substringBeforeLast("/")
        val fileEntity = FileEntity(
            path = path,
            name = name,
            directoryPath = directoryPath,
            size = size,
            contentType = contentType.value,
            md5Hash = md5Hash,
            isProtected = false,
            created = currentTime,
            lastModified = currentTime,
            createdBy = null,
            isFromBucket = false
        )
        
        storageRepository.createFile(fileEntity)
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

        return demoFiles.mapNotNull { path ->
            storageRepository.getFileByPath(path)?.id
        }
    }

    /**
     * Register file usage for template covers
     */
    suspend fun registerTemplateFileUsage(templateId: Int, fileId: Long) {
        val file = storageRepository.getFileById(fileId)
        if (file != null) {
            val usage = FileUsage(
                filePath = file.path,
                usageType = "template_cover",
                referenceId = templateId.toLong(),
                referenceTable = "templates",
                created = currentTime
            )
            storageRepository.registerFileUsage(usage)
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

    private fun calculateMD5(data: ByteArray): String {
        val md = MessageDigest.getInstance("MD5")
        val digest = md.digest(data)
        return digest.joinToString("") { "%02x".format(it) }
    }

    private data class DirectoryInfo(
        val path: String,
        val description: String,
        val parentPath: String?
    ) {
        val name: String = path.substringAfterLast("/")
    }
}