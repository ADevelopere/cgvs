package schema.query

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.extensions.get
import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import io.ktor.server.application.*
import io.ktor.server.sessions.*
import models.User
import models.UserSession
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.AuthService

class AuthQuery : Query, KoinComponent {
    private val authService: AuthService by inject()

    @GraphQLDescription("Get current authenticated user")
    suspend fun me(dfe: DataFetchingEnvironment): User? {
        dfe.graphQlContext.get<ApplicationCall>()?.let { call ->
            val userSession = call.sessions.get<UserSession>()

            return if (userSession != null) {
                authService.getUserFromSession(userSession.sessionId)
            } else {
                null
            }
        }
        return null
    }

    @GraphQLDescription("Check if user is authenticated")
    suspend fun isAuthenticated(dfe: DataFetchingEnvironment): Boolean {
        dfe.graphQlContext.get<ApplicationCall>()?.let { call ->
            val userSession = call.sessions.get<UserSession>()

            return if (userSession != null) {
                authService.validateSession(userSession.sessionId) != null
            } else {
                false
            }
        }
        return false
    }
}
