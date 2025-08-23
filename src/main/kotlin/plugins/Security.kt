package plugins

import com.auth0.jwt.JWTVerifier
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.response.*
import io.ktor.server.sessions.*
import org.koin.ktor.ext.inject
import schema.model.UserSession
import services.AuthService
import kotlin.time.Duration.Companion.days

fun Application.configureSecurity() {
    val authService by inject<AuthService>()
    val jwtVerifier: JWTVerifier by inject()

    install(CORS) {
        // Be very explicit about the allowed origin.
        allowHost("localhost:3000", schemes = listOf("http"))

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


        allowCredentials = true // This is essential for sending and receiving cookies.
    }

    install(Sessions) {
        cookie<UserSession>("cgvs_refresh_token") {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 7.days.inWholeSeconds
            cookie.httpOnly = true

            // In production, SameSite=None requires Secure=true.
            // In development (HTTP), we must use Lax and secure=false.
            if (true) {
                cookie.secure = false
                cookie.extensions["SameSite"] = "Lax"
            } else {
                cookie.secure = true
                cookie.extensions["SameSite"] = "None"
            }
        }
    }

    val jwtRealm = environment.config.property("jwt.realm").getString()

    install(Authentication) {
        jwt("auth-jwt") {
            realm = jwtRealm
            verifier(jwtVerifier)
            validate { credential ->
                JWTPrincipal(credential.payload)
            }
        }

        session<UserSession>("auth-session") {
            validate { session ->
                val dbSession = authService.validateSession(session.sessionId)
                if (dbSession != null && session.isAuthenticated) {
                    session
                } else null
            }
            challenge {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Authentication required"))
            }
        }
    }
}
