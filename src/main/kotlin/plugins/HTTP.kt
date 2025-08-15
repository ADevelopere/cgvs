package plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.plugins.compression.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.doublereceive.*
import io.ktor.server.request.*
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
    install(CORS) {
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Options)

        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Accept)
        allowHeader("X-Requested-With")

        // Allow credentials for authentication
        allowCredentials = true

        // TODO: Replace with specific origins in production
        anyHost()
    }

    // Configure compression - exclude GraphQL endpoints to prevent codegen issues
    install(Compression) {
        gzip {
            priority = 1.0
            // Exclude GraphQL endpoints to prevent issues with GraphQL Code Generator
            condition {
                !request.uri.startsWith("/graphql")
            }
        }
        deflate {
            priority = 10.0
            minimumSize(1024)
            // Exclude GraphQL endpoints to prevent issues with GraphQL Code Generator
            condition {
                !request.uri.startsWith("/graphql")
            }
        }
    }
}

