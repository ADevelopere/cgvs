package plugins

import services.StorageService
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.server.application.Application
import io.ktor.server.application.log
import io.ktor.server.request.receiveMultipart
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import org.koin.ktor.ext.inject
import kotlinx.serialization.Serializable
import io.ktor.utils.io.jvm.javaio.toInputStream

@Serializable
data class UploadUrlRequest(
    val filename: String,
    val contentType: String = "application/octet-stream",
    val folder: String = ""
)

fun Application.configureStorageRouting() {

    val storageService: StorageService by inject()

    routing {
        post("/api/bucket/upload") {
            val multipart = call.receiveMultipart()
            var path: String? = null
            var file: PartData.FileItem? = null
            var folder: String? = null

            multipart.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        when (part.name) {
                            "path" -> path = part.value
                            "folder" -> folder = part.value
                        }
                    }
                    is PartData.FileItem -> {
                        file = part
                    }
                    else -> {
                        // ignore other parts
                    }
                }
            }

            val finalFile = file
            if (finalFile == null) {
                call.respond(HttpStatusCode.BadRequest, mapOf(
                    "success" to false,
                    "message" to "No file provided"
                ))
                return@post
            }

            val originalFilename = finalFile.originalFileName
            if (originalFilename.isNullOrBlank()) {
                finalFile.dispose()
                call.respond(HttpStatusCode.BadRequest, mapOf(
                    "success" to false,
                    "message" to "File must have a name"
                ))
                return@post
            }

            try {
                // Determine the final path for the file
                val finalPath = when {
                    // If an explicit path is provided, use it
                    !path.isNullOrBlank() -> path
                    // If a folder is provided, combine with filename
                    !folder.isNullOrBlank() -> "${folder.trimEnd('/')}/$originalFilename"
                    // Default: use filename with timestamp to avoid conflicts
                    else -> "${System.currentTimeMillis()}_$originalFilename"
                }

                // Use the enhanced StorageService with validation
                val result = storageService.uploadFile(
                    path = finalPath,
                    inputStream = finalFile.provider().toInputStream(),
                    contentType = finalFile.contentType?.toString(),
                    originalFilename = originalFilename
                )

                if (result.success) {
                    call.respond(HttpStatusCode.OK, mapOf(
                        "success" to true,
                        "message" to result.message,
                        "file" to mapOf(
                            "name" to result.file!!.name,
                            "path" to result.file.path,
                            "size" to result.file.size,
                            "contentType" to result.file.contentType,
                            "url" to result.file.url.toString(),
                            "mediaLink" to result.file.mediaLink,
                            "fileType" to result.file.fileType.name,
                            "created" to result.file.created.toString(),
                            "lastModified" to result.file.lastModified.toString()
                        )
                    ))
                } else {
                    call.respond(HttpStatusCode.BadRequest, mapOf(
                        "success" to false,
                        "message" to result.message
                    ))
                }
            } catch (e: Exception) {
                log.error("Failed to upload file", e)
                call.respond(HttpStatusCode.InternalServerError, mapOf(
                    "success" to false,
                    "message" to "Upload failed: ${e.message}"
                ))
            } finally {
                finalFile.dispose()
            }
        }

        // Additional endpoint for getting upload progress (if needed)
        post("/api/bucket/upload-url") {
            try {
                val request = call.receive<UploadUrlRequest>()

                val path = if (request.folder.isNotBlank()) {
                    "${request.folder.trimEnd('/')}/${request.filename}"
                } else {
                    request.filename
                }

                val signedUrl = storageService.generateUploadSignedUrl(path, request.contentType)

                call.respond(HttpStatusCode.OK, mapOf(
                    "success" to true,
                    "url" to signedUrl,
                    "path" to path
                ))
            } catch (e: Exception) {
                log.error("Failed to generate signed URL", e)
                call.respond(HttpStatusCode.BadRequest, mapOf(
                    "success" to false,
                    "message" to "Failed to generate signed URL: ${e.message}"
                ))
            }
        }
    }
}
