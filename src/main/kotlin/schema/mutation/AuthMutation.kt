package schema.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import io.ktor.server.application.*
import io.ktor.server.sessions.*
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.model.*
import services.AuthService

@Suppress("unused")
class AuthMutation : Mutation, KoinComponent {
    private val authService: AuthService by inject()

    @GraphQLDescription("Login user with email and password")
    suspend fun login(
        input: LoginInput,
        dfe: DataFetchingEnvironment
    ): AuthPayload? {
        val call = dfe.graphQlContext.get<ApplicationCall>("applicationCall")

        val user = authService.authenticateUser(input.email, input.password)

        if (user != null) {
            val accessToken = generateAccessTokenAndSession(user, call)
            return AuthPayload(token = accessToken, user = user)
        }

        return null
    }

    @GraphQLDescription("Register a new user")
    suspend fun register(
        input: RegisterInput,
        dfe: DataFetchingEnvironment
    ): AuthPayload? {
        val call = dfe.graphQlContext.get<ApplicationCall>("applicationCall")

        val user = authService.registerUser(input)

        return if (user != null) {
            val accessToken = generateAccessTokenAndSession(user, call)
            AuthPayload(token = accessToken, user = user)
        } else {
            null
        }
    }

    @GraphQLDescription("Refresh the access token using the session cookie")
    suspend fun refreshToken(dfe: DataFetchingEnvironment): AuthPayload? {
        val call = dfe.graphQlContext.get<ApplicationCall>("applicationCall")
        val userSession = call.sessions.get<UserSession>()

        if (userSession != null) {
            // The session cookie acts as the refresh token.
            // We validate it and get the associated user.
            val user = authService.getUserFromSession(userSession.sessionId)
            if (user != null) {
                // If the user is valid, generate a new, short-lived access token.
                val newAccessToken = authService.generateAccessToken(user)
                return AuthPayload(token = newAccessToken, user = user)
            }
        }
        return null
    }

    @GraphQLDescription("Logout current user")
    suspend fun logout(dfe: DataFetchingEnvironment): LogoutResponse {
        val call = dfe.graphQlContext.get<ApplicationCall>("applicationCall")

        val userSession = call.sessions.get<UserSession>()

        if (userSession != null) {
            // Invalidate session in database
            authService.invalidateSession(userSession.sessionId)
            // Clear session cookie
            call.sessions.clear<UserSession>()
        }

        return LogoutResponse(message = "Logged out successfully")
    }

    @GraphQLIgnore
    private suspend fun generateAccessTokenAndSession(user: User, call: ApplicationCall): String {
        // Generate a short-lived access token
        val accessToken = authService.generateAccessToken(user)

        // Create a long-lived session in the database
        val ipAddress = call.request.local.remoteAddress
        val userAgent = call.request.headers["User-Agent"]
        val session = authService.createSession(user, ipAddress, userAgent)

        // Set the session cookie, which will act as our refresh token
        val userSession = UserSession(
            userId = user.id,
            email = user.email,
            sessionId = session.id,
            isAdmin = user.isAdmin
        )
        call.sessions.set(userSession)

        return accessToken
    }
}
