package schema.directive

import com.expediagroup.graphql.generator.directives.KotlinFieldDirectiveEnvironment
import com.expediagroup.graphql.generator.directives.KotlinSchemaDirectiveWiring
import graphql.schema.DataFetcher
import graphql.schema.DataFetchingEnvironment
import graphql.schema.GraphQLFieldDefinition
import schema.pagination.paginationRange
import schema.pagination.PaginationResult
import java.util.concurrent.CompletableFuture

/**
 * Schema directive wiring for the @paginate directive
 *
 * This class handles the runtime behavior of the @paginate directive,
 * transforming field resolvers to support pagination functionality.
 */
class PaginateDirectiveWiring : KotlinSchemaDirectiveWiring {

    override fun onField(environment: KotlinFieldDirectiveEnvironment): GraphQLFieldDefinition {
        val field = environment.element
        val originalDataFetcher =  environment.getDataFetcher()

        // Get directive arguments
        val directive = environment.directive
        val defaultCount = directive.getArgument("defaultCount")?.getValue<Int>() ?: 15
        val maxCount = directive.getArgument("maxCount")?.getValue<Int>() ?: 100
        val type = directive.getArgument("type")?.getValue<String>() ?: "PAGINATOR"
        val includePaginationInfo = directive.getArgument("includePaginationInfo")?.getValue<Boolean>() ?: true

        // Create paginated data fetcher
        val paginatedDataFetcher = DataFetcher<Any?> { dataEnvironment ->
            val paginationArgs = extractPaginationArgs(dataEnvironment, defaultCount, maxCount)

            // Execute original data fetcher
            val originalResult = originalDataFetcher.get(dataEnvironment)

            when (originalResult) {
                is CompletableFuture<*> -> {
                    originalResult.thenApply { result ->
                        paginateResult(result, paginationArgs, type, includePaginationInfo)
                    }
                }

                else -> {
                    paginateResult(originalResult, paginationArgs, type, includePaginationInfo)
                }
            }
        }

        // Update the code registry with the new data fetcher
        environment.setDataFetcher(paginatedDataFetcher)
        return field
    }

    /**
     * Extract pagination arguments from the GraphQL environment
     */
    private fun extractPaginationArgs(
        environment: DataFetchingEnvironment,
        defaultCount: Int,
        maxCount: Int
    ): PaginationArgs {
        val first = environment.getArgument<Int?>("first")
        val skip = environment.getArgument<Int?>("skip")
        val after = environment.getArgument<String?>("after")
        val before = environment.getArgument<String?>("before")
        val last = environment.getArgument<Int?>("last")
        val page = environment.getArgument<Int?>("page")

        // Validate and apply limits
        val validatedFirst = first?.let { minOf(it, maxCount) } ?: defaultCount

        return PaginationArgs(
            first = validatedFirst,
            skip = skip,
            after = after,
            before = before,
            last = last,
            page = page
        )
    }

    /**
     * Apply pagination to the result based on the pagination type
     */
    private fun paginateResult(
        result: Any?,
        paginationArgs: PaginationArgs,
        type: String,
        includePaginationInfo: Boolean
    ): Any? = when (result) {
        is List<*> -> {
            when (type) {
                "PAGINATOR" -> paginateWithInfo(result, paginationArgs, includePaginationInfo)
                "SIMPLE" -> paginateSimple(result, paginationArgs)
                "CONNECTION" -> paginateConnection(result, paginationArgs)
                else -> result
            }
        }

        else -> result
    }


    /**
     * Paginate with full pagination info (like Laravel's LengthAwarePaginator)
     */
    private fun paginateWithInfo(
        items: List<*>,
        paginationArgs: PaginationArgs,
        includePaginationInfo: Boolean
    ): PaginationResult<*> {
        val total = items.size
        val perPage = paginationArgs.first ?: 15
        val currentPage = paginationArgs.page ?: 1
        val skip = paginationArgs.skip ?: ((currentPage - 1) * perPage)

        val paginatedItems = items.drop(skip).take(perPage)
        val lastPage = if (total > 0) ((total - 1) / perPage) + 1 else 1
        val hasMorePages = currentPage < lastPage

        val paginationInfo = if (includePaginationInfo) {
            PaginationInfo(
                count = paginatedItems.size,
                currentPage = currentPage,
                firstItem = if (paginatedItems.isNotEmpty()) skip + 1 else null,
                hasMorePages = hasMorePages,
                lastItem = if (paginatedItems.isNotEmpty()) skip + paginatedItems.size else null,
                lastPage = lastPage,
                perPage = perPage,
                total = total
            )
        } else null

        return PaginationResult(
            data = paginatedItems,
            paginationInfo = paginationInfo
        )
    }

    /**
     * Simple pagination without total count
     */
    private fun paginateSimple(items: List<*>, paginationArgs: PaginationArgs): List<*> {
        val perPage = paginationArgs.first ?: 15
        val skip = paginationArgs.skip ?: 0

        return items.drop(skip).take(perPage)
    }

    /**
     * Connection-style pagination (Relay specification)
     */
    private fun paginateConnection(items: List<*>, paginationArgs: PaginationArgs): Connection<*> {
        val first = paginationArgs.first ?: 15
        val after = paginationArgs.after
        val before = paginationArgs.before

        // For simplicity, using index as cursor
        val (startIndex, endIndex) = paginationRange(after, before, items)

        val paginatedItems = items.subList(startIndex, endIndex).take(first)

        val edges = paginatedItems.mapIndexed { index, item ->
            Edge(
                node = item!!,
                cursor = (startIndex + index).toString()
            )
        }

        val pageInfo = PageInfo(
            hasNextPage = startIndex + paginatedItems.size < items.size,
            hasPreviousPage = startIndex > 0,
            startCursor = edges.firstOrNull()?.cursor,
            endCursor = edges.lastOrNull()?.cursor
        )

        return Connection(
            edges = edges,
            pageInfo = pageInfo
        )
    }
}
