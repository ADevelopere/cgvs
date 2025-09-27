package context

import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.exceptions.JWTVerificationException
import io.ktor.server.application.*
import io.ktor.server.sessions.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.model.User
import schema.model.UserSession
import services.AuthService

class GraphQLAuthenticationHandler : KoinComponent {
    private val authService: AuthService by inject()
    val jwtVerifier: JWTVerifier by inject()

    suspend fun getCurrentUser(call: ApplicationCall): User? {
        // First try JWT authentication
        val jwtUser = tryJWTAuthentication(call)
        if (jwtUser != null) return jwtUser

        // Fallback to session authentication
        return trySessionAuthentication(call)
    }

    private suspend fun tryJWTAuthentication(call: ApplicationCall): User? {
        val authHeader = call.request.headers["Authorization"]
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.removePrefix("Bearer ")
            try {
                val decodedJWT = jwtVerifier.verify(token)
                val userId = decodedJWT.getClaim("userId").asInt()

                if (userId != null) {
                    return authService.getUserById(userId)
                }
            } catch (e: JWTVerificationException) {
                // JWT is invalid, continue to session auth
                println("Invalid JWT token" + e.message)
            }
        }
        return null
    }

    private suspend fun trySessionAuthentication(call: ApplicationCall): User? {
        val userSession = call.sessions.get<UserSession>()
        return if (userSession != null) {
            authService.getUserFromSession(userSession.sessionId)
        } else {
            null
        }
    }

    suspend fun requireAuthentication(call: ApplicationCall): User {
        return getCurrentUser(call) ?: throw AuthenticationException("Authentication required")
    }

    suspend fun requireAdmin(call: ApplicationCall): User {
        val user = requireAuthentication(call)
        if (!user.isAdmin) {
            throw AuthorizationException("Admin access required")
        }
        return user
    }
}

class AuthenticationException(message: String) : Exception(message)
class AuthorizationException(message: String) : Exception(message)
