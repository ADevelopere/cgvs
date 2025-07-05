package repositories

import models.TemplateRecipientGroup
import tables.TemplateRecipientGroups
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

class TemplateRecipientGroupRepository(private val database: Database) {

    suspend fun create(group: TemplateRecipientGroup): TemplateRecipientGroup = dbQuery {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val insertStatement = TemplateRecipientGroups.insert {
            it[templateId] = group.templateId
            it[name] = group.name
            it[description] = group.description
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[TemplateRecipientGroups.id]
        group.copy(
            id = id,
            createdAt = now,
            updatedAt = now
        )
    }

    suspend fun findById(id: Int): TemplateRecipientGroup? = dbQuery {
        TemplateRecipientGroups.selectAll()
            .where { TemplateRecipientGroups.id eq id }
            .map { rowToTemplateRecipientGroup(it) }
            .singleOrNull()
    }

    suspend fun findByTemplate(templateId: Int): List<TemplateRecipientGroup> = dbQuery {
        TemplateRecipientGroups.selectAll()
            .where { TemplateRecipientGroups.templateId eq templateId }
            .map { rowToTemplateRecipientGroup(it) }
    }

    suspend fun findByName(name: String): List<TemplateRecipientGroup> = dbQuery {
        TemplateRecipientGroups.selectAll()
            .where { TemplateRecipientGroups.name eq name }
            .map { rowToTemplateRecipientGroup(it) }
    }

    suspend fun findByTemplateAndName(templateId: Int, name: String): TemplateRecipientGroup? = dbQuery {
        TemplateRecipientGroups.selectAll()
            .where { (TemplateRecipientGroups.templateId eq templateId) and (TemplateRecipientGroups.name eq name) }
            .map { rowToTemplateRecipientGroup(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<TemplateRecipientGroup> = dbQuery {
        TemplateRecipientGroups.selectAll()
            .map { rowToTemplateRecipientGroup(it) }
    }

    suspend fun update(id: Int, group: TemplateRecipientGroup): TemplateRecipientGroup? {
        val updated = dbQuery {
            TemplateRecipientGroups.update({ TemplateRecipientGroups.id eq id }) {
                it[templateId] = group.templateId
                it[name] = group.name
                it[description] = group.description
                it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
            }
        }
        return if (updated > 0) {
            findById(id)
        } else {
            null
        }
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        TemplateRecipientGroups.deleteWhere { TemplateRecipientGroups.id eq id } > 0
    }

    suspend fun deleteByTemplate(templateId: Int): Boolean = dbQuery {
        TemplateRecipientGroups.deleteWhere { TemplateRecipientGroups.templateId eq templateId } > 0
    }

    private fun rowToTemplateRecipientGroup(row: ResultRow): TemplateRecipientGroup {
        return TemplateRecipientGroup(
            id = row[TemplateRecipientGroups.id],
            templateId = row[TemplateRecipientGroups.templateId],
            name = row[TemplateRecipientGroups.name],
            description = row[TemplateRecipientGroups.description],
            createdAt = row[TemplateRecipientGroups.createdAt],
            updatedAt = row[TemplateRecipientGroups.updatedAt]
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
