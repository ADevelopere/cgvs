package plugins

import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.server.application.Application
import io.ktor.server.application.log
import io.ktor.server.request.receiveMultipart
import io.ktor.server.response.respondText
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import io.ktor.utils.io.InternalAPI
import kotlinx.io.readByteArray

@OptIn(InternalAPI::class)
fun Application.configureRouting() {
    routing {
        post("/upload") {
            val multipart = call.receiveMultipart()
            multipart.forEachPart { part ->
                when (part) {
                    is PartData.FileItem -> {
                        val name = part.originalFileName ?: "unknown"
                        val fileBytes = part.provider().readBuffer.readByteArray()
                        // Handle the file (e.g., save it to disk or process it)
                        log.info("Received file: $name with size: ${fileBytes.size} bytes")
                    }

                    is PartData.FormItem -> {
                        log.info("Received form field: ${part.name} with value: ${part.value}")
                    }

                    is PartData.BinaryItem -> {
                        log.info("Received binary item: ${part.name}")
                    }

                    is PartData.BinaryChannelItem -> TODO()
                }
                part.dispose()
            }
            call.respondText("Upload complete")
        }
    }
}
