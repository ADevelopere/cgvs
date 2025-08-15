package plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.response.*
import io.ktor.server.sessions.*
import kotlinx.serialization.Serializable
import models.UserSession
import org.koin.ktor.ext.inject
import services.AuthService

fun Application.configureSecurity() {
    val authService by inject<AuthService>()

    // Configure Sessions
    install(Sessions) {
        cookie<UserSession>("CGSV_SESSION") {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 3600 // 1 hour
            cookie.httpOnly = true
            cookie.secure = false // Set to true in production with HTTPS
            cookie.extensions["SameSite"] = "lax"
        }
    }
//    install(Sessions) {
//        cookie<plugins.MySession>("MY_SESSION") {
//            cookie.extensions["SameSite"] = "lax"
//        }
//    }
//    authentication {
//        basic(name = "myauth1") {
//            realm = "Ktor Server"
//            validate { credentials ->
//                if (credentials.name == credentials.password) {
//                    UserIdPrincipal(credentials.name)
//                } else {
//                    null
//                }
//            }
//        }
//
//        form(name = "myauth2") {
//            userParamName = "user"
//            passwordParamName = "password"
//            challenge {
//                /**/
//            }
//        }
//    }

    // Read JWT configuration from application.yaml
    val jwtAudience = environment.config.property("postgres.audience").getString()
    val jwtDomain = environment.config.property("postgres.domain").getString()
    val jwtRealm = environment.config.property("postgres.realm").getString()
    val jwtSecret = environment.config.propertyOrNull("postgres.secret")?.getString() ?: "default-secret-key"

    // Configure Authentication
    install(Authentication) {
        jwt("auth-jwt") {
            realm = jwtRealm
            verifier(
                JWT
                    .require(Algorithm.HMAC256(jwtSecret))
                    .withAudience(jwtAudience)
                    .withIssuer(jwtDomain)
                    .build()
            )
            validate { credential ->
                if (credential.payload.audience.contains(jwtAudience)) {
                    JWTPrincipal(credential.payload)
                } else null
            }
        }

        session<UserSession>("auth-session") {
            validate { session ->
                // Validate session with database
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
//    authentication {
//        jwt {
//            realm = jwtRealm
//            verifier(
//                JWT
//                    .require(Algorithm.HMAC256(jwtSecret))
//                    .withAudience(jwtAudience)
//                    .withIssuer(jwtDomain)
//                    .build()
//            )
//            validate { credential ->
//                if (credential.payload.audience.contains(jwtAudience)) JWTPrincipal(credential.payload) else null
//            }
//        }
//    }
//    install(CSRF) {
//        // tests Origin is an expected value
//        allowOrigin("http://localhost:8080")
//        // tests Origin matches Host header
//        originMatchesHost()
//
//        // custom header checks
//        checkHeader("X-CSRF-Token")
//    }

//    install(CORS) {
//        allowHost("127.0.0.1:3000")
//        allowHost("127.0.0.1:3001")
//        // Add your production domain here
//        // allowHost("your-production-domain.com", schemes = listOf("https"))
//
//        allowCredentials = true
//        allowHeader(HttpHeaders.ContentType)
//        allowHeader(HttpHeaders.Authorization)
//        allowHeader("X-CSRF-TOKEN")
//        allowHeader("X-Requested-With")
//
//        allowMethod(HttpMethod.Options)
//        allowMethod(HttpMethod.Get)
//        allowMethod(HttpMethod.Post)
//        allowMethod(HttpMethod.Put)
//        allowMethod(HttpMethod.Delete)
//        allowMethod(HttpMethod.Patch)
//    }

//    authentication {
//        oauth("auth-oauth-google") {
//            urlProvider = { "http://localhost:8080/callback" }
//            providerLookup = {
//                OAuthServerSettings.OAuth2ServerSettings(
//                    name = "google",
//                    authorizeUrl = "https://accounts.google.com/o/oauth2/auth",
//                    accessTokenUrl = "https://accounts.google.com/o/oauth2/token",
//                    requestMethod = HttpMethod.Post,
//                    clientId = System.getenv("GOOGLE_CLIENT_ID"),
//                    clientSecret = System.getenv("GOOGLE_CLIENT_SECRET"),
//                    defaultScopes = listOf("https://www.googleapis.com/auth/userinfo.profile")
//                )
//            }
//            client = HttpClient(Apache)
//        }
//    }
//    routing {
//        get("/session/increment") {
//            val session = call.sessions.get<plugins.MySession>() ?: plugins.MySession()
//            call.sessions.set(session.copy(count = session.count + 1))
//            call.respondText("Counter is ${session.count}. Refresh to increment.")
//        }
//        authenticate("myauth1") {
//            get("/protected/route/basic") {
//                val principal = call.principal<UserIdPrincipal>()!!
//                call.respondText("Hello ${principal.name}")
//            }
//        }
//        authenticate("myauth2") {
//            get("/protected/route/form") {
//                val principal = call.principal<UserIdPrincipal>()!!
//                call.respondText("Hello ${principal.name}")
//            }
//        }
//        authenticate("auth-oauth-google") {
//            get("login") {
//                call.respondRedirect("/callback")
//            }
//
//            get("/callback") {
//                val principal: OAuthAccessTokenResponse.OAuth2? = call.authentication.principal()
//                call.sessions.set(plugins.UserSession(principal?.accessToken.toString()))
//                call.respondRedirect("/hello")
//            }
//        }
//    }
}

@Serializable
data class MySession(val count: Int = 0)

class UserSession(accessToken: String)
