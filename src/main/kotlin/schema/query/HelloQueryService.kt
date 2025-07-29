package schema.query

import com.expediagroup.graphql.server.operations.Query

class HelloQueryService : Query {
    fun hello() = "World!"
}
