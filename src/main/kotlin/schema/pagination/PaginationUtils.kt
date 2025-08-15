package schema.pagination

import schema.directive.PaginationInfo
import schema.directive.Edge
import schema.directive.PageInfo

/**
 * Result wrapper for pagination that doesn't use GraphQL generic types
 */
data class PaginationResult<T>(
    val data: List<T>,
    val paginationInfo: PaginationInfo? = null
)

/**
 * Result wrapper for connection-style pagination
 */
data class ConnectionResult<T>(
    val edges: List<Edge<T>>,
    val pageInfo: PageInfo
)

/**
 * Utility class for handling pagination in GraphQL resolvers
 *
 * This provides helper methods to paginate collections based on
 * different pagination strategies.
 */
object PaginationUtils {

    /**
     * Create a paginated response with full pagination info
     */
    fun <T> paginate(
        items: List<T>,
        first: Int? = null,
        skip: Int? = null,
        page: Int? = null,
        defaultCount: Int = 15,
        maxCount: Int = 100
    ): PaginationResult<T> {
        val perPage = minOf(first ?: defaultCount, maxCount)
        val currentPage = page ?: 1
        val offset = skip ?: ((currentPage - 1) * perPage)

        val total = items.size
        val paginatedItems = items.drop(offset).take(perPage)
        val lastPage = if (total > 0) ((total - 1) / perPage) + 1 else 1
        val hasMorePages = currentPage < lastPage

        val paginationInfo = PaginationInfo(
            count = paginatedItems.size,
            currentPage = currentPage,
            firstItem = if (paginatedItems.isNotEmpty()) offset + 1 else null,
            hasMorePages = hasMorePages,
            lastItem = if (paginatedItems.isNotEmpty()) offset + paginatedItems.size else null,
            lastPage = lastPage,
            perPage = perPage,
            total = total
        )

        return PaginationResult(
            data = paginatedItems,
            paginationInfo = paginationInfo
        )
    }

    /**
     * Create a simple paginated list without pagination info
     */
    fun <T> paginateSimple(
        items: List<T>,
        first: Int? = null,
        skip: Int? = null,
        defaultCount: Int = 15,
        maxCount: Int = 100
    ): List<T> {
        val perPage = minOf(first ?: defaultCount, maxCount)
        val offset = skip ?: 0

        return items.drop(offset).take(perPage)
    }

    /**
     * Create a connection-style paginated response (Relay specification)
     */
    fun <T> paginateConnection(
        items: List<T>,
        first: Int? = null,
        after: String? = null,
        before: String? = null,
        last: Int? = null,
        defaultCount: Int = 15,
        maxCount: Int = 100
    ): ConnectionResult<T> {
        val limit = minOf(first ?: last ?: defaultCount, maxCount)

        // For simplicity, using index as cursor
        val (startIndex, endIndex) = paginationRange(after, before, items)

        val availableItems = items.subList(startIndex, endIndex)
        val paginatedItems = if (last != null) {
            availableItems.takeLast(limit)
        } else {
            availableItems.take(limit)
        }

        val actualStartIndex = if (last != null && availableItems.size > limit) {
            startIndex + availableItems.size - limit
        } else {
            startIndex
        }

        val edges = paginatedItems.mapIndexed { index, item ->
            Edge(
                node = item,
                cursor = (actualStartIndex + index).toString()
            )
        }

        val pageInfo = PageInfo(
            hasNextPage = actualStartIndex + paginatedItems.size < items.size,
            hasPreviousPage = actualStartIndex > 0,
            startCursor = edges.firstOrNull()?.cursor,
            endCursor = edges.lastOrNull()?.cursor
        )

        return ConnectionResult(
            edges = edges,
            pageInfo = pageInfo
        )
    }
}

fun <T> paginationRange(
    after: String?,
    before: String?,
    items: List<T>
): Pair<Int, Int> {
    val startIndex = if (after != null) {
        try {
            after.toInt() + 1
        } catch (e: NumberFormatException) {
            0
        }
    } else 0

    val endIndex = if (before != null) {
        try {
            minOf(before.toInt(), items.size)
        } catch (e: NumberFormatException) {
            items.size
        }
    } else items.size
    return Pair(startIndex, endIndex)
}

/**
 * Extension function to easily paginate any list
 */
fun <T> List<T>.paginate(
    first: Int? = null,
    skip: Int? = null,
    page: Int? = null,
    defaultCount: Int = 15,
    maxCount: Int = 100
): PaginationResult<T> = PaginationUtils.paginate(this, first, skip, page, defaultCount, maxCount)

/**
 * Extension function for simple pagination
 */
fun <T> List<T>.paginateSimple(
    first: Int? = null,
    skip: Int? = null,
    defaultCount: Int = 15,
    maxCount: Int = 100
): List<T> = PaginationUtils.paginateSimple(this, first, skip, defaultCount, maxCount)

/**
 * Extension function for connection-style pagination
 */
fun <T> List<T>.paginateConnection(
    first: Int? = null,
    after: String? = null,
    before: String? = null,
    last: Int? = null,
    defaultCount: Int = 15,
    maxCount: Int = 100
): ConnectionResult<T> = PaginationUtils.paginateConnection(this, first, after, before, last, defaultCount, maxCount)
