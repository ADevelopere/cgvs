package schema.model

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore

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
) {
    companion object {
        const val DEFAULT_COUNT = 10
        const val MAX_COUNT = 5000
    }

    @GraphQLIgnore
    val perPage = minOf(
        first ?: defaultCount ?: DEFAULT_COUNT,
        maxCount ?: MAX_COUNT
    )

    @GraphQLIgnore
    val currentPage = page ?: 1
    @GraphQLIgnore
    val offset: Int = skip ?: ((currentPage - 1) * perPage)
}

fun paginationArgsToInfo(
    args: PaginationArgs?,
    count: Int,
    total: Int,
): PaginationInfo = args?.let {
    val lastPage = if (total > 0) ((total - 1) / it.perPage) + 1 else 1
    val firstItem = if (count > 0) it.offset + 1 else null
    val lastItem = if (count > 0) it.offset + count else null
    PaginationInfo(
        count = count,
        currentPage = it.currentPage,
        firstItem = firstItem,
        hasMorePages = it.currentPage < lastPage,
        lastItem = lastItem,
        lastPage = lastPage,
        perPage = it.perPage,
        total = total
    )
} ?: PaginationInfo(
    count = count,
    currentPage = 1,
    firstItem = 1,
    hasMorePages = false,
    lastItem = count,
    lastPage = 1,
    perPage = count,
    total = total
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
    val lastPage: Int,
    val perPage: Int,
    val total: Int
)
