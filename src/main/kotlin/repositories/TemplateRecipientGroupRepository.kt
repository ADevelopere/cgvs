package repositories

import schema.model.TemplateRecipientGroup
import tables.TemplateRecipientGroups
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.update
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import schema.model.CreateRecipientGroupInput
import schema.model.UpdateRecipientGroupInput
import util.now

class TemplateRecipientGroupRepository(private val database: Database) {

    suspend fun create(group: CreateRecipientGroupInput): TemplateRecipientGroup = dbQuery {
        val now = now()
        val insertStatement = TemplateRecipientGroups.insert {
            it[templateId] = group.templateId
            it[name] = group.name
            it[description] = group.description
            it[date] = group.date
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[TemplateRecipientGroups.id]
        group.toRecipientGroup(
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

    suspend fun findAllByTemplateId(templateId: Int): List<TemplateRecipientGroup> = dbQuery {
        TemplateRecipientGroups.selectAll()
            .where { TemplateRecipientGroups.templateId eq templateId }
            .map { rowToTemplateRecipientGroup(it) }
    }

    suspend fun searchByTemplateIdAndName(templateId: Int, name: String): TemplateRecipientGroup? = dbQuery {
        TemplateRecipientGroups.selectAll()
            .where { (TemplateRecipientGroups.templateId eq templateId) and (TemplateRecipientGroups.name eq name) }
            .map { rowToTemplateRecipientGroup(it) }
            .singleOrNull()
    }

    suspend fun existsById(id: Int): Boolean = dbQuery {
        TemplateRecipientGroups.selectAll()
            .where { TemplateRecipientGroups.id eq id }
            .count() > 0
    }

    suspend fun update(input: UpdateRecipientGroupInput): TemplateRecipientGroup? {
        val updated = dbQuery {
            TemplateRecipientGroups.update({ TemplateRecipientGroups.id eq input.id }) {
                it[name] = input.name
                it[description] = input.description
                it[date] = input.date
                it[updatedAt] = now()
            }
        }
        return if (updated > 0) {
            findById(input.id)
        } else {
            null
        }
    }

    suspend fun deleteById(id: Int): Boolean = dbQuery {
        TemplateRecipientGroups.deleteWhere { TemplateRecipientGroups.id eq id } > 0
    }

    private fun rowToTemplateRecipientGroup(row: ResultRow): TemplateRecipientGroup {
        return TemplateRecipientGroup(
            id = row[TemplateRecipientGroups.id],
            templateId = row[TemplateRecipientGroups.templateId],
            name = row[TemplateRecipientGroups.name],
            description = row[TemplateRecipientGroups.description],
            date = row[TemplateRecipientGroups.date],
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
