package schema.query

import com.expediagroup.graphql.server.operations.Query
import schema.directive.PaginateDirective
import schema.directive.PaginationInfo
import schema.pagination.paginate
import schema.pagination.paginateConnection

/**
 * Mock User model for demonstration
 * In practice, this would be your actual User model from the models package
 */
data class DumpUser(
    val id: String,
    val name: String,
    val email: String
)

/**
 * Concrete implementation of PaginatedResponse for User type
 * This is required because GraphQL doesn't support generic types directly
 */
data class PaginatedUsersResponse(
    val data: List<DumpUser>,
    val paginationInfo: PaginationInfo? = null
)

/**
 * Concrete implementation of Connection for User type
 */
data class UserConnection(
    val edges: List<UserEdge>,
    val pageInfo: schema.directive.PageInfo
)

/**
 * Concrete implementation of Edge for User type
 */
data class UserEdge(
    val node: DumpUser,
    val cursor: String
)


/**
 * Example GraphQL Query demonstrating the usage of the @paginate directive
 * and pagination utilities
 */
class PaginatedUserQuery : Query {

    /**
     * Get paginated users with full pagination info
     *
     * Usage in GraphQL:
     * query {
     *   paginatedUsers(first: 10, page: 1) {
     *     data {
     *       id
     *       name
     *       email
     *     }
     *     paginationInfo {
     *       count
     *       currentPage
     *       hasMorePages
     *       total
     *       perPage
     *     }
     *   }
     * }
     */
    @PaginateDirective(defaultCount = 15, maxCount = 100)
    fun paginatedUsers(
        first: Int? = null,
        skip: Int? = null,
        page: Int? = null
    ): PaginatedUsersResponse {
        // Simulate fetching users from database
        val allUsers = getUsersFromDataSource()

        // Use the pagination utility to paginate the results
        val paginatedResult = allUsers.paginate(first, skip, page)

        return PaginatedUsersResponse(
            data = paginatedResult.data,
            paginationInfo = paginatedResult.paginationInfo
        )
    }

    /**
     * Get users using connection-style pagination (Relay specification)
     *
     * Usage in GraphQL:
     * query {
     *   userConnection(first: 10, after: "cursor") {
     *     edges {
     *       node {
     *         id
     *         name
     *         email
     *       }
     *       cursor
     *     }
     *     pageInfo {
     *       hasNextPage
     *       hasPreviousPage
     *       startCursor
     *       endCursor
     *     }
     *   }
     * }
     */
    @PaginateDirective(type = schema.directive.PaginationType.CONNECTION)
    fun userConnection(
        first: Int? = null,
        after: String? = null,
        before: String? = null,
        last: Int? = null
    ): UserConnection {
        val allUsers = getUsersFromDataSource()

        val connectionResult = allUsers.paginateConnection(first, after, before, last)

        return UserConnection(
            edges = connectionResult.edges.map { edge ->
                UserEdge(
                    node = edge.node,
                    cursor = edge.cursor
                )
            },
            pageInfo = connectionResult.pageInfo
        )
    }

    /**
     * Get users with simple pagination (no pagination info)
     *
     * Usage in GraphQL:
     * query {
     *   simpleUsers(first: 10, skip: 20) {
     *     id
     *     name
     *     email
     *   }
     * }
     */
    @PaginateDirective(type = schema.directive.PaginationType.SIMPLE)
    fun simpleUsers(
        first: Int? = null,
        skip: Int? = null
    ): List<DumpUser> {
        val allUsers = getUsersFromDataSource()

        return allUsers.drop(skip ?: 0).take(first ?: 15)
    }

    /**
     * Simulate fetching users from a data source
     */
    private fun getUsersFromDataSource(): List<DumpUser> {
        // This would typically fetch from your database
        // For demonstration, returning a mock list
        return (1..100).map { index ->
            DumpUser(
                id = index.toString(),
                name = "User $index",
                email = "user$index@example.com"
            )
        }
    }
}
