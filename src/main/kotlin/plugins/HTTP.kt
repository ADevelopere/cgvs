package plugins

import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.plugins.compression.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.doublereceive.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.utils.io.*
import kotlinx.io.readByteArray
import org.slf4j.event.Level

fun Application.configureHTTP() {
    install(DoubleReceive)
    // Log the Content-Type of incoming requests
    install(CallLogging) {
        level = Level.INFO
        filter { call ->
            val contentType = call.request.header(HttpHeaders.ContentType)
            if (contentType == null) {
                call.application.log.info("Request Content-Type: null")
            } else {
                call.application.log.info("Request Content-Type: $contentType")
            }
            true
        }
    }

    // Configure CORS to allow file uploads from frontend
//    install(CORS) {
//        allowMethod(HttpMethod.Get)
//        allowMethod(HttpMethod.Post)
//        allowMethod(HttpMethod.Put)
//        allowMethod(HttpMethod.Delete)
//        allowMethod(HttpMethod.Patch)
//        allowMethod(HttpMethod.Options)
//
//        allowHeader(HttpHeaders.Authorization)
//        allowHeader(HttpHeaders.ContentType)
//        allowHeader(HttpHeaders.Accept)
//        allowHeader("X-Requested-With")
//        allowHeader("Apollo-Require-Preflight") // For Apollo uploads
//        allowHeader("Content-Type: multipart/form-data") // For file uploads
//
//        // Allow credentials for authentication
//        allowCredentials = true
//
//        // TODO: Replace with specific origins in production
//        anyHost()
//    }

    // Configure compression
    install(Compression) {
        gzip {
            priority = 1.0
        }
        deflate {
            priority = 10.0
            minimumSize(1024) // condition
        }
    }
}

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
