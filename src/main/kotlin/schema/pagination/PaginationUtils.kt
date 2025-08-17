package schema.pagination

import schema.type.PaginationArgs
import schema.type.PaginationInfo


/**
 * Result wrapper for pagination that doesn't use GraphQL generic types
 */
data class PaginationResult<T>(
    val data: List<T>,
    val paginationInfo: PaginationInfo? = null
)

/**
 * Utility class for handling pagination in GraphQL resolvers
 *
 * This provides helper methods to paginate collections based on
 * different pagination strategies.
 */
object PaginationUtils {
    /**
     * Create a pagination result from already paginated data (for database performance optimization)
     * This function is useful when you've already fetched a specific page from the database
     * and need to create pagination info without having all the data in memory.
     */
    fun <T> createPaginationResultFromPaginatedData(
        items: List<T>,
        total: Int,
        perPage: Int,
        currentPage: Int,
        offset: Int
    ): PaginationResult<T> {
        val lastPage = if (total > 0) ((total - 1) / perPage) + 1 else 1
        val hasMorePages = currentPage < lastPage

        val paginationInfo = PaginationInfo(
            count = items.size,
            currentPage = currentPage,
            firstItem = if (items.isNotEmpty()) offset + 1 else null,
            hasMorePages = hasMorePages,
            lastItem = if (items.isNotEmpty()) offset + items.size else null,
            lastPage = lastPage,
            perPage = perPage,
            total = total
        )

        return PaginationResult(
            data = items,
            paginationInfo = paginationInfo
        )
    }

    /**
     * Generic function to fetch paginated data from any repository that implements Paginatable Repository
     * This eliminates duplication across service classes
     */
    suspend fun <T> findPaginatedWithInfo(
        repository: repositories.PaginatableRepository<T>,
        paginationArgs: PaginationArgs?,
    ): PaginationResult<T> {
        val total = repository.countAll().toInt()
        val perPage = minOf(
            paginationArgs?.first ?: paginationArgs?.defaultCount ?: PaginationArgs.DEFAULT_COUNT,
            paginationArgs?.maxCount ?: PaginationArgs.MAX_COUNT
        )
        val currentPage = paginationArgs?.page ?: 1
        val offset = paginationArgs?.skip ?: ((currentPage - 1) * perPage)

        // Fetch only the required items from database
        val paginatedItems = repository.findPaginated(perPage, offset)

        // Create pagination info for the already paginated items
        return createPaginationResultFromPaginatedData(
            items = paginatedItems,
            total = total,
            perPage = perPage,
            currentPage = currentPage,
            offset = offset
        )
    }
}

