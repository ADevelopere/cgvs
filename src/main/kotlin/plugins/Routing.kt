package plugins

import features.storage.StorageService
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.http.content.streamProvider
import io.ktor.server.application.Application
import io.ktor.server.application.log
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respond
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import org.koin.ktor.ext.inject
import schema.model.File

fun Application.configureRouting() {

    val storageService: StorageService by inject()

    routing {
        post("/api/bucket/upload") {
            val multipart = call.receiveMultipart()
            var path: String? = null
            var file: PartData.FileItem? = null

            multipart.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        if (part.name == "path") {
                            path = part.value
                        }
                    }
                    is PartData.FileItem -> {
                        file = part
                    }
                    else -> {
                        part.dispose()
                    }
                }
            }

            val finalPath = path
            val finalFile = file

            if (finalPath != null && finalFile != null) {
                try {
                    val blob = storageService.uploadFile(finalPath, finalFile.streamProvider(), finalFile.contentType.toString())
                    val signedUrl = storageService.getSignedUrl(finalPath)
                    val response = File(
                        name = blob.name,
                        path = blob.name,
                        size = blob.size,
                        contentType = blob.contentType,
                        updated = blob.updateTime.toString(),
                        url = signedUrl
                    )
                    call.respond(response)
                } catch (e: Exception) {
                    log.error("Failed to upload file", e)
                    call.respond(HttpStatusCode.InternalServerError, "Failed to upload file")
                } finally {
                    finalFile.dispose()
                }
            } else {
                file?.dispose()
                call.respond(HttpStatusCode.BadRequest, "Missing path or file part")
            }
        }
    }
}
