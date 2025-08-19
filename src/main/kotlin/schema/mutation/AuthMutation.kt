package schema.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import io.ktor.server.application.*
import io.ktor.server.sessions.*
import schema.model.AuthPayload
import schema.model.LoginInput
import schema.model.LogoutResponse
import schema.model.RegisterInput
import schema.model.UserSession
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.AuthService

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
            // Generate JWT token
            val token = authService.generateJWT(user)

            // Create session in database
            val ipAddress = call.request.local.remoteAddress
            val userAgent = call.request.headers["User-Agent"]
            val session = authService.createSession(user, ipAddress, userAgent)

            // Set session cookie
            val userSession = UserSession(
                userId = user.id,
                email = user.email,
                sessionId = session.id,
                isAdmin = user.isAdmin
            )
            call.sessions.set(userSession)

            return AuthPayload(token = token, user = user)
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
            // Generate JWT token
            val token = authService.generateJWT(user)

            // Create session in database
            val ipAddress = call.request.local.remoteAddress
            val userAgent = call.request.headers["User-Agent"]
            val session = authService.createSession(user, ipAddress, userAgent)

            // Set session cookie
            val userSession = UserSession(
                userId = user.id,
                email = user.email,
                sessionId = session.id,
                isAdmin = user.isAdmin
            )
            call.sessions.set(userSession)

            AuthPayload(token = token, user = user)
        } else {
            null
        }
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
}
