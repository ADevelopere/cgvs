package plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.plugins.compression.*
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

