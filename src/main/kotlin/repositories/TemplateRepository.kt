package repositories

import schema.type.Template
import tables.Templates
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.update
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.v1.core.max
import org.jetbrains.exposed.v1.jdbc.select
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import util.now

class TemplateRepository(private val database: Database) : PaginatableRepository<Template> {
    /**
     * Fetches templates with pagination (limit/offset)
     */
    override suspend fun findPaginated(limit: Int, offset: Int): List<Template> = dbQuery {
        Templates.selectAll()
            .limit(limit)
            .offset(offset.toLong())
            .map { rowToTemplate(it) }
    }

    /**
     * Returns the total count of templates
     */
    override suspend fun countAll(): Long = dbQuery {
        Templates.selectAll().count()
    }

    suspend fun create(template: Template): Template = dbQuery {
        val insertStatement = Templates.insert {
            it[name] = template.name
            it[description] = template.description
            it[imageUrl] = template.imageUrl
            it[categoryId] = template.categoryId
            it[order] = template.order
            it[createdAt] = now()
            it[updatedAt] = now()
        }

        val id = insertStatement[Templates.id]
        template.copy(
            id = id,
        )
    }

    suspend fun findByIds(ids: List<Int>): List<Template> = dbQuery {
        val templates = Templates.selectAll()
            .where { Templates.id inList ids }
            .map { rowToTemplate(it) }
        // Sort to match the order of input ids
        templates.sortedBy { ids.indexOf(it.id) }
    }

    suspend fun findById(id: Int): Template? = dbQuery {
        Templates.selectAll()
            .where { Templates.id eq id }
            .map { rowToTemplate(it) }
            .singleOrNull()
    }

    suspend fun exists(id: Int): Boolean = dbQuery {
        Templates.selectAll()
            .where { Templates.id eq id }
            .count() > 0
    }

    suspend fun findAll(): List<Template> = dbQuery {
        Templates.selectAll()
            .map { rowToTemplate(it) }
    }

    suspend fun findByCategoryId(categoryId: Int): List<Template> = dbQuery {
        Templates.selectAll()
            .where { Templates.categoryId eq categoryId }
            .map { rowToTemplate(it) }
    }

    suspend fun update(id: Int, template: Template): Template? {
        val updated = dbQuery {
            Templates.update({ Templates.id eq id }) {
                it[name] = template.name
                it[description] = template.description
                it[imageUrl] = template.imageUrl
                it[categoryId] = template.categoryId
                it[order] = template.order
                it[updatedAt] = now()
            }
        }
        return if (updated > 0) {
            findById(id)
        } else {
            null
        }
    }


    suspend fun delete(id: Int): Boolean = dbQuery {
        Templates.deleteWhere { Templates.id eq id } > 0
    }

    suspend fun findMaxOrderByCategoryId(categoryId: Int): Int = dbQuery {
        val maxOrderExpr = Templates.order.max()
        val query = Templates
            .select(maxOrderExpr)
            .where { Templates.categoryId eq categoryId }

        val maxOrder = query.map { it[maxOrderExpr] }.singleOrNull()
        maxOrder ?: 1
    }

    private fun rowToTemplate(row: ResultRow): Template {
        return Template(
            id = row[Templates.id],
            name = row[Templates.name],
            description = row[Templates.description],
            imageUrl = row[Templates.imageUrl],
            categoryId = row[Templates.categoryId],
            order = row[Templates.order],
            createdAt = row[Templates.createdAt],
            updatedAt = row[Templates.updatedAt]
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
