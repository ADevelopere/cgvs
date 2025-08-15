package schema.directive

import com.expediagroup.graphql.generator.annotations.GraphQLDirective
import graphql.introspection.Introspection.DirectiveLocation
import com.expediagroup.graphql.generator.annotations.GraphQLDescription

/**
 * GraphQL Directive for pagination support
 *
 * This directive can be applied to fields to enable pagination functionality.
 * It supports both offset-based pagination (similar to Laravel's default pagination)
 * and simple pagination (without total count).
 */
@GraphQLDirective(
    name = "paginate",
    description = "Enable pagination for this field with configurable options",
    locations = [DirectiveLocation.FIELD_DEFINITION]
)
@GraphQLDescription("Enable pagination for this field with configurable options")
@Suppress("unused")
annotation class PaginateDirective(
    /**
     * The default number of items per page when not specified by the client
     */
    @param:GraphQLDescription("Default number of items per page")
    val defaultCount: Int = 15,

    /**
     * Maximum number of items that can be requested per page
     */
    @param:GraphQLDescription("Maximum number of items per page")
    val maxCount: Int = 100,

    /**
     * The type of pagination to use
     */
    @param:GraphQLDescription("Type of pagination: PAGINATOR (with total count) or SIMPLE (without total count)")
    val type: PaginationType = PaginationType.PAGINATOR,

    /**
     * Whether to include pagination info in the response
     */
    @param:GraphQLDescription("Whether to include pagination info in the response")
    val includePaginationInfo: Boolean = true,

    /**
     * The name of the connection edge type (for Relay-style pagination)
     */
    @param:GraphQLDescription("Name of the connection edge type for Relay-style pagination")
    val edgeType: String = ""
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

/**
 * Pagination arguments that can be used in GraphQL queries
 */
data class PaginationArgs(
    val first: Int? = null,
    val skip: Int? = null,
    val after: String? = null,
    val before: String? = null,
    val last: Int? = null,
    val page: Int? = null
)

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
