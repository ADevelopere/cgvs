package repositories

/**
 * Interface for repositories that support pagination
 * Any repository implementing this interface can use the generic pagination utilities
 */
interface PaginatableRepository<T> {
    /**
     * Fetch paginated items from the repository
     */
    suspend fun findPaginated(limit: Int, offset: Int): List<T>
    
    /**
     * Get the total count of items in the repository
     */
    suspend fun countAll(): Int
}
