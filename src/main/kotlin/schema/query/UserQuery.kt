package schema.query

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.generator.extensions.get
import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import io.ktor.server.application.*
import io.ktor.server.sessions.*
import schema.type.User
import schema.type.UserSession
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import repositories.UserRepository
import services.AuthService

class UserQuery : Query, KoinComponent {
    private val userRepository: UserRepository by inject()
    private val authService: AuthService by inject()

    @GraphQLDescription("Get all users (admin only)")
    suspend fun users(dfe: DataFetchingEnvironment): List<User>? {
        dfe.graphQlContext.get<ApplicationCall>()?.let { call ->
            val userSession = call.sessions.get<UserSession>()

            // Check if user is authenticated and is admin
            if (userSession != null && userSession.isAdmin) {
                val sessionValid = authService.validateSession(userSession.sessionId)
                if (sessionValid != null) {
                    return userRepository.findAll()
                }
            }
        }

        return null
    }

    @GraphQLDescription("Get user by ID (authenticated users only)")
    suspend fun user(id: Int, dfe: DataFetchingEnvironment): User? {
        dfe.graphQlContext.get<ApplicationCall>()?.let { call ->
            val userSession = call.sessions.get<UserSession>()

            // Check if user is authenticated
            if (userSession != null) {
                val sessionValid = authService.validateSession(userSession.sessionId)
                if (sessionValid != null) {
                    // Users can only access their own profile unless they are admin
                    if (userSession.isAdmin || userSession.userId == id) {
                        return userRepository.findById(id)
                    }
                }
            }
        }
        return null
    }
}
