package plugins

import com.expediagroup.graphql.server.execution.GraphQLServer
import com.expediagroup.graphql.server.ktor.GraphQL
import com.expediagroup.graphql.server.ktor.KtorGraphQLServer
import com.expediagroup.graphql.server.types.GraphQLRequest
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.utils.io.*
import io.ktor.utils.io.core.readBytes

private suspend inline fun KtorGraphQLServer.executeRequest(call: ApplicationCall) =
    execute(call.request)?.let {
        call.respond(it)
    } ?: call.respond(HttpStatusCode.BadRequest)
/**
 * Enhanced GraphQL POST route that supports both JSON and multipart/form-data requests
 * This extends the standard graphQLPostRoute to handle file uploads via GraphQL multipart request spec
 *
 * @param endpoint GraphQL server POST endpoint, defaults to 'graphql'
 * @param streamingResponse Enable streaming response body without keeping it fully in memory
 * @param jacksonConfiguration Jackson Object Mapper customizations
 */
fun Route.graphQLPostRouteWithMultipart(
    endpoint: String = "graphql",
    streamingResponse: Boolean = true,
    jacksonConfiguration: ObjectMapper.() -> Unit = {}
): Route {
    val graphQLPlugin = this.application.plugin(GraphQL)

    val route = post(endpoint) {
        val contentType = call.request.contentType()

        when {
            contentType.match(ContentType.MultiPart.FormData) -> {
                handleMultipartGraphQLRequest(call, graphQLPlugin.server)
            }
            else -> {
                // Delegate to standard GraphQL server for JSON/GraphQL requests
                graphQLPlugin.server.executeRequest(call)
            }
        }
    }

    route.install(ContentNegotiation) {
        jackson(streamRequestBody = streamingResponse) {
            apply(jacksonConfiguration)
        }
    }
    return route
}

/**
 * Handles multipart GraphQL requests according to the GraphQL multipart request specification
 * See: https://github.com/jaydenseric/graphql-multipart-request-spec
 */
private suspend fun handleMultipartGraphQLRequest(call: ApplicationCall, server: GraphQLServer<*>) {
    try {
        val multipart = call.receiveMultipart()
        var operations: String? = null
        var map: String? = null
        val files = mutableMapOf<String, FileUpload>()

        multipart.forEachPart { part ->
            when (part) {
                is PartData.FormItem -> {
                    when (part.name) {
                        "operations" -> {
                            operations = part.value
                            println("GraphQL Operations: ${part.value}")
                        }
                        "map" -> {
                            map = part.value
                            println("GraphQL Variable Map: ${part.value}")
                        }
                        else -> {
                            println("Additional form field: ${part.name} = ${part.value}")
                        }
                    }
                }
                is PartData.FileItem -> {
                    val fileUpload = processFileUpload(part)
                    files[part.name ?: "unknown"] = fileUpload
                    printFileUploadInfo(part.name ?: "unknown", fileUpload)
                }
                else -> {
                    println("Unsupported part type: ${part::class.simpleName}")
                }
            }
            part.dispose()
        }

        if (operations == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing 'operations' field in multipart request")
            return
        }

        // Parse the GraphQL request
        val objectMapper = ObjectMapper().apply {
            findAndRegisterModules()
        }

        val graphQLRequest = try {
            objectMapper.readValue<GraphQLRequest>(operations)
        } catch (e: Exception) {
            println("Error parsing GraphQL operations: ${e.message}")
            call.respond(HttpStatusCode.BadRequest, "Invalid GraphQL operations: ${e.message}")
            return
        }

        // Process file mappings if provided
        val processedRequest = if (map != null && files.isNotEmpty()) {
            processFileVariables(graphQLRequest, map, files, objectMapper)
        } else {
            graphQLRequest
        }

        println("\n=== PROCESSED GRAPHQL REQUEST ===")
        println("Query: ${processedRequest.query}")
        println("Variables: ${processedRequest.variables}")
        println("Files attached: ${files.size}")

        // Execute the GraphQL request through the server
        // Note: This is a simplified version. You might need to adapt based on your server's execution method
        val response = server.execute(processedRequest)
        call.respond(HttpStatusCode.OK, response)

    } catch (e: Exception) {
        println("Error processing multipart GraphQL request: ${e.message}")
        e.printStackTrace()
        call.respond(HttpStatusCode.InternalServerError, "Error processing request: ${e.message}")
    }
}

/**
 * Processes a file upload from multipart data
 */
private suspend fun processFileUpload(part: PartData.FileItem): FileUpload {
    val bytes = part.provider().readRemaining().readBytes()
    return FileUpload(
        filename = part.originalFileName ?: "unknown",
        contentType = part.contentType?.toString() ?: "application/octet-stream",
        size = bytes.size,
        content = bytes
    )
}

/**
 * Processes file variables according to the GraphQL multipart request spec
 * Maps uploaded files to GraphQL variables based on the provided mapping
 */
private fun processFileVariables(
    request: GraphQLRequest,
    mapJson: String,
    files: Map<String, FileUpload>,
    objectMapper: ObjectMapper
): GraphQLRequest {
    try {
        val fileMap = objectMapper.readValue<Map<String, List<String>>>(mapJson)
        val mutableVariables = request.variables?.toMutableMap() ?: mutableMapOf()

        fileMap.forEach { (fileKey, variablePaths) ->
            val file = files[fileKey]
            if (file != null) {
                variablePaths.forEach { path ->
                    // This is a simplified version - you might need more sophisticated path resolution
                    // For paths like "variables.file" or "variables.files.0"
                    val cleanPath = path.removePrefix("variables.")
                    mutableVariables[cleanPath] = file
                    println("Mapped file '$fileKey' to variable '$cleanPath'")
                }
            }
        }

        return request.copy(variables = mutableVariables)
    } catch (e: Exception) {
        println("Error processing file variables: ${e.message}")
        return request
    }
}

/**
 * Prints detailed information about uploaded files
 */
private fun printFileUploadInfo(fieldName: String, upload: FileUpload) {
    println("\n=== FILE UPLOAD: $fieldName ===")
    println("Filename: ${upload.filename}")
    println("Content Type: ${upload.contentType}")
    println("Size: ${upload.size} bytes (${formatFileSize(upload.size)})")

    // Print first few bytes for debugging
    if (upload.content.isNotEmpty()) {
        val preview = upload.content.take(16).joinToString(" ") { "%02x".format(it) }
        println("First 16 bytes: $preview")
    }

    // Detect file type from magic bytes
    val detectedType = detectFileType(upload.content)
    if (detectedType != null) {
        println("Detected file type: $detectedType")
    }
    println("================================")
}

/**
 * Data class representing an uploaded file
 */
data class FileUpload(
    val filename: String,
    val contentType: String,
    val size: Int,
    val content: ByteArray
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as FileUpload
        return filename == other.filename && contentType == other.contentType && size == other.size
    }

    override fun hashCode(): Int {
        var result = filename.hashCode()
        result = 31 * result + contentType.hashCode()
        result = 31 * result + size
        return result
    }
}

private fun formatFileSize(bytes: Int): String {
    val units = arrayOf("B", "KB", "MB", "GB")
    var size = bytes.toDouble()
    var unitIndex = 0

    while (size >= 1024 && unitIndex < units.size - 1) {
        size /= 1024
        unitIndex++
    }

    return "%.2f %s".format(size, units[unitIndex])
}

private fun detectFileType(bytes: ByteArray): String? {
    if (bytes.size < 4) return null

    return when {
        bytes.sliceArray(0..3).contentEquals(byteArrayOf(0x89.toByte(), 0x50, 0x4E, 0x47)) -> "PNG"
        bytes.sliceArray(0..1).contentEquals(byteArrayOf(0xFF.toByte(), 0xD8.toByte())) -> "JPEG"
        bytes.sliceArray(0..3).contentEquals(byteArrayOf(0x47, 0x49, 0x46, 0x38)) -> "GIF"
        bytes.sliceArray(0..3).contentEquals(byteArrayOf(0x25, 0x50, 0x44, 0x46)) -> "PDF"
        bytes.sliceArray(0..3).contentEquals(byteArrayOf(0x50, 0x4B, 0x03, 0x04)) -> "ZIP/DOCX/XLSX"
        else -> null
    }
}
