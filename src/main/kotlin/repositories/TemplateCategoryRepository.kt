package repositories

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import models.TemplateCategory
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.max
import org.jetbrains.exposed.v1.jdbc.*
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import tables.CategorySpecialType
import tables.TemplateCategories
import util.now

class TemplateCategoryRepository(private val database: Database) {

    suspend fun create(category: TemplateCategory): TemplateCategory = dbQuery {

        val insertStatement = TemplateCategories.insert {
            it[name] = category.name
            it[description] = category.description
            it[parentCategoryId] = category.parentCategoryId
            it[order] = category.order
            it[categorySpecialType] = category.categorySpecialType
            it[createdAt] = now()
            it[updatedAt] = now()
        }

        val id = insertStatement[TemplateCategories.id]
        category.copy(
            id = id,
        )
    }

    suspend fun findByIds(ids: List<Int>): List<TemplateCategory> = dbQuery {
        val categories = TemplateCategories.selectAll()
            .where { TemplateCategories.id inList ids }
            .map { rowToTemplateCategory(it) }
        // Sort to match the order of input ids
        categories.sortedBy { ids.indexOf(it.id) }
    }

    suspend fun findById(id: Int): TemplateCategory? = dbQuery {
        TemplateCategories.selectAll()
            .where { TemplateCategories.id eq id }
            .map { rowToTemplateCategory(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<TemplateCategory> = dbQuery {
        TemplateCategories.selectAll()
            .map { rowToTemplateCategory(it) }
    }

    suspend fun findByParent(parentId: Int): List<TemplateCategory> = dbQuery {
        TemplateCategories.selectAll()
            .where { TemplateCategories.parentCategoryId eq parentId }
            .map { rowToTemplateCategory(it) }
    }

    suspend fun findRootCategories(): List<TemplateCategory> = dbQuery {
        TemplateCategories.selectAll()
            .where { TemplateCategories.parentCategoryId.isNull() }
            .map { rowToTemplateCategory(it) }
    }

    suspend fun findBySpecialType(categorySpecialType: CategorySpecialType): List<TemplateCategory> = dbQuery {
        TemplateCategories.selectAll()
            .where { TemplateCategories.categorySpecialType eq categorySpecialType }
            .map { rowToTemplateCategory(it) }
    }

    suspend fun update(id: Int, category: TemplateCategory): TemplateCategory? {
        val updated = dbQuery {
            TemplateCategories.update({ TemplateCategories.id eq id }) {
                it[name] = category.name
                it[description] = category.description
                it[parentCategoryId] = category.parentCategoryId
                it[order] = category.order
                it[categorySpecialType] = category.categorySpecialType
                it[updatedAt] = now()
            }
        }
        return if (updated > 0) {
            findById(id)
        } else {
            null
        }
    }

    suspend fun findMaxOrderByParentCategoryId(parentCategoryId: Int?): Int = dbQuery {
        val maxOrderExpr = TemplateCategories.order.max()
        val query = if (parentCategoryId == null) {
            TemplateCategories
                .select(maxOrderExpr)
                .where { TemplateCategories.parentCategoryId.isNull() }
        } else {
            TemplateCategories
                .select(maxOrderExpr)
                .where { TemplateCategories.parentCategoryId eq parentCategoryId }
        }
        val maxOrder = query.map { it[maxOrderExpr] }.singleOrNull()
        maxOrder ?: 1
    }

    private fun rowToTemplateCategory(row: ResultRow): TemplateCategory {
        return TemplateCategory(
            id = row[TemplateCategories.id],
            name = row[TemplateCategories.name],
            description = row[TemplateCategories.description],
            parentCategoryId = row[TemplateCategories.parentCategoryId],
            order = row[TemplateCategories.order],
            categorySpecialType = row[TemplateCategories.categorySpecialType],
            createdAt = row[TemplateCategories.createdAt],
            updatedAt = row[TemplateCategories.updatedAt]
        )
    }

    /**
     * A helper function to execute a database transaction on a dedicated IO thread pool
     */
    private suspend fun <T> dbQuery(block: () -> T): T =
        withContext(Dispatchers.IO) {
            transaction(database) {
                block()
            }
        }
}
