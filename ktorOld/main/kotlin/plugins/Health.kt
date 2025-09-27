package plugins

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureHealth() {
    routing {
        head("/health") {
            call.respond(HttpStatusCode.OK)
        }
    }
}
