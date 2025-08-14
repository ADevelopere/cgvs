package repositories

import models.Template
import tables.Templates
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
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import util.now

class TemplateRepository(private val database: Database) {

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

    suspend fun findById(id: Int): Template? = dbQuery {
        Templates.selectAll()
            .where { Templates.id eq id }
            .map { rowToTemplate(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<Template> = dbQuery {
        Templates.selectAll()
            .map { rowToTemplate(it) }
    }

    suspend fun findByCategory(categoryId: Int): List<Template> = dbQuery {
        Templates.selectAll()
            .where { Templates.categoryId eq categoryId }
            .map { rowToTemplate(it) }
    }

    suspend fun findActive(): List<Template> = dbQuery {
        Templates.selectAll()
            .where { Templates.deletedAt.isNull() and Templates.trashedAt.isNull() }
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
        val updated = dbQuery {
            Templates.update({ Templates.id eq id }) {
                it[deletedAt] = now()
                it[updatedAt] = now()
            }
        }
        return updated > 0
    }

    suspend fun trash(id: Int): Boolean {
        val updated = dbQuery {
            Templates.update({ Templates.id eq id }) {
                it[trashedAt] = now()
                it[updatedAt] = now()
            }
        }
        return updated > 0
    }

    suspend fun restore(id: Int): Boolean {
        val updated = dbQuery {
            Templates.update({ Templates.id eq id }) {
                it[deletedAt] = null
                it[trashedAt] = null
                it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
            }
        }
        return updated > 0
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        Templates.deleteWhere { Templates.id eq id } > 0
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
