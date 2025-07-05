package repositories

import models.TemplateCategory
import tables.TemplateCategories
import tables.SpecialType
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.update
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

class TemplateCategoryRepository(private val database: Database) {

    suspend fun create(category: TemplateCategory): TemplateCategory = dbQuery {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val insertStatement = TemplateCategories.insert {
            it[name] = category.name
            it[description] = category.description
            it[parentCategoryId] = category.parentCategoryId
            it[order] = category.order
            it[specialType] = category.specialType
            it[deletedAt] = category.deletedAt
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[TemplateCategories.id]
        category.copy(
            id = id,
            createdAt = now,
            updatedAt = now
        )
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

    suspend fun findActive(): List<TemplateCategory> = dbQuery {
        TemplateCategories.selectAll()
            .where { TemplateCategories.deletedAt.isNull() }
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

    suspend fun findBySpecialType(specialType: SpecialType): List<TemplateCategory> = dbQuery {
        TemplateCategories.selectAll()
            .where { TemplateCategories.specialType eq specialType }
            .map { rowToTemplateCategory(it) }
    }

    suspend fun update(id: Int, category: TemplateCategory): TemplateCategory? {
        val updated = dbQuery {
            TemplateCategories.update({ TemplateCategories.id eq id }) {
                it[name] = category.name
                it[description] = category.description
                it[parentCategoryId] = category.parentCategoryId
                it[order] = category.order
                it[specialType] = category.specialType
                it[deletedAt] = category.deletedAt
                it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
            }
        }
        return if (updated > 0) {
            findById(id)
        } else {
            null
        }
    }

    suspend fun softDelete(id: Int): Boolean {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val updated = dbQuery {
            TemplateCategories.update({ TemplateCategories.id eq id }) {
                it[deletedAt] = now
                it[updatedAt] = now
            }
        }
        return updated > 0
    }

    suspend fun restore(id: Int): Boolean {
        val updated = dbQuery {
            TemplateCategories.update({ TemplateCategories.id eq id }) {
                it[deletedAt] = null
                it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
            }
        }
        return updated > 0
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        TemplateCategories.deleteWhere { TemplateCategories.id eq id } > 0
    }

    private fun rowToTemplateCategory(row: ResultRow): TemplateCategory {
        return TemplateCategory(
            id = row[TemplateCategories.id],
            name = row[TemplateCategories.name],
            description = row[TemplateCategories.description],
            parentCategoryId = row[TemplateCategories.parentCategoryId],
            order = row[TemplateCategories.order],
            specialType = row[TemplateCategories.specialType],
            deletedAt = row[TemplateCategories.deletedAt],
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
