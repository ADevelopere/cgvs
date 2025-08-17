package schema.type

import com.expediagroup.graphql.generator.annotations.GraphQLDescription

/**
 * Pagination arguments that can be used in GraphQL queries
 */
data class PaginationArgs(
    val first: Int? = null,
    val skip: Int? = null,
    val after: String? = null,
    val before: String? = null,
    val last: Int? = null,
    val page: Int? = null,
    val defaultCount: Int? = 10,
    val maxCount: Int? = 100
){
    companion object{
        const val DEFAULT_COUNT = 10
        const val MAX_COUNT = 100
    }
}

/**
 * Pagination information returned with paginated results
 */
data class PaginationInfo(
    val count: Int,
    val currentPage: Int,
    val firstItem: Int?,
    val hasMorePages: Boolean,
    val lastItem: Int?,
    val lastPage: Int?,
    val perPage: Int,
    val total: Int?
)


/**
 * Connection-style pagination for Relay compatibility
 */
data class Connection<T>(
    @param:GraphQLDescription("List of edges")
    val edges: List<Edge<T>>,

    @param:GraphQLDescription("Information about pagination")
    val pageInfo: PageInfo
)

/**
 * Edge for connection-style pagination
 */
data class Edge<T>(
    @param:GraphQLDescription("The item")
    val node: T,

    @param:GraphQLDescription("Cursor for this item")
    val cursor: String
)

/**
 * Page information for connection-style pagination
 */
data class PageInfo(
    @param:GraphQLDescription("Whether there are more items after this page")
    val hasNextPage: Boolean,

    @param:GraphQLDescription("Whether there are more items before this page")
    val hasPreviousPage: Boolean,

    @param:GraphQLDescription("Cursor of the first item in this page")
    val startCursor: String?,

    @param:GraphQLDescription("Cursor of the last item in this page")
    val endCursor: String?
)

/**
 * Enum defining the types of pagination supported
 */
enum class PaginationType {
    /**
     * Offset-based pagination with total count, similar to Laravel's default pagination
     */
    @GraphQLDescription("Offset-based pagination with total count")
    PAGINATOR,

    /**
     * Simple offset-based pagination without total count
     */
    @GraphQLDescription("Simple offset-based pagination without total count")
    SIMPLE,

    /**
     * Cursor-based pagination compatible with Relay specification
     */
    @GraphQLDescription("Cursor-based pagination compatible with Relay specification")
    CONNECTION
}
