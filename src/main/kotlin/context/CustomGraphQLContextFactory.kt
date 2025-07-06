package context

import com.expediagroup.graphql.server.ktor.DefaultKtorGraphQLContextFactory
import graphql.GraphQLContext
import io.ktor.server.application.*
import io.ktor.server.request.*

class CustomGraphQLContextFactory : DefaultKtorGraphQLContextFactory() {
    
    override suspend fun generateContext(request: ApplicationRequest): GraphQLContext {
        val baseContext = super.generateContext(request)
        
        // Add the ApplicationCall to the context
        return baseContext.put("applicationCall", request.call)
    }
}
