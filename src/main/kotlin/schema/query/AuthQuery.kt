package schema.query

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Query
import context.GraphQLAuthenticationHandler
import graphql.schema.DataFetchingEnvironment
import io.ktor.server.application.*
import models.User
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class AuthQuery : Query, KoinComponent {
    private val authHandler: GraphQLAuthenticationHandler by inject()

    @GraphQLDescription("Get current authenticated user")
    suspend fun me(dfe: DataFetchingEnvironment): User? {
        val call = dfe.graphQlContext.get<ApplicationCall>("applicationCall")
        return authHandler.getCurrentUser(call)
    }

    @GraphQLDescription("Check if user is authenticated")
    suspend fun isAuthenticated(dfe: DataFetchingEnvironment): Boolean {
        val call = dfe.graphQlContext.get<ApplicationCall>("applicationCall")
        return authHandler.getCurrentUser(call) != null
    }
}
