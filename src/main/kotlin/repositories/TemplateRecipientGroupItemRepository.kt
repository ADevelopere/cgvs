package repositories

import schema.model.TemplateRecipientGroupItem
import tables.TemplateRecipientGroupItems
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

class TemplateRecipientGroupItemRepository(private val database: Database) {

    suspend fun create(item: TemplateRecipientGroupItem): TemplateRecipientGroupItem = dbQuery {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val insertStatement = TemplateRecipientGroupItems.insert {
            it[templateRecipientGroupId] = item.templateRecipientGroupId
            it[studentId] = item.studentId
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[TemplateRecipientGroupItems.id]
        item.copy(
            id = id,
            createdAt = now,
            updatedAt = now
        )
    }

    suspend fun findById(id: Int): TemplateRecipientGroupItem? = dbQuery {
        TemplateRecipientGroupItems.selectAll()
            .where { TemplateRecipientGroupItems.id eq id }
            .map { rowToTemplateRecipientGroupItem(it) }
            .singleOrNull()
    }

    suspend fun findByGroup(groupId: Int): List<TemplateRecipientGroupItem> = dbQuery {
        TemplateRecipientGroupItems.selectAll()
            .where { TemplateRecipientGroupItems.templateRecipientGroupId eq groupId }
            .map { rowToTemplateRecipientGroupItem(it) }
    }

    suspend fun findByStudent(studentId: Int): List<TemplateRecipientGroupItem> = dbQuery {
        TemplateRecipientGroupItems.selectAll()
            .where { TemplateRecipientGroupItems.studentId eq studentId }
            .map { rowToTemplateRecipientGroupItem(it) }
    }

    suspend fun findByGroupAndStudent(groupId: Int, studentId: Int): TemplateRecipientGroupItem? = dbQuery {
        TemplateRecipientGroupItems.selectAll()
            .where {
                (TemplateRecipientGroupItems.templateRecipientGroupId eq groupId) and
                (TemplateRecipientGroupItems.studentId eq studentId)
            }
            .map { rowToTemplateRecipientGroupItem(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<TemplateRecipientGroupItem> = dbQuery {
        TemplateRecipientGroupItems.selectAll()
            .map { rowToTemplateRecipientGroupItem(it) }
    }

    suspend fun update(id: Int, item: TemplateRecipientGroupItem): TemplateRecipientGroupItem? {
        val updated = dbQuery {
            TemplateRecipientGroupItems.update({ TemplateRecipientGroupItems.id eq id }) {
                it[templateRecipientGroupId] = item.templateRecipientGroupId
                it[studentId] = item.studentId
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
        TemplateRecipientGroupItems.deleteWhere { TemplateRecipientGroupItems.id eq id } > 0
    }

    suspend fun deleteByGroup(groupId: Int): Boolean = dbQuery {
        TemplateRecipientGroupItems.deleteWhere { TemplateRecipientGroupItems.templateRecipientGroupId eq groupId } > 0
    }

    suspend fun deleteByStudent(studentId: Int): Boolean = dbQuery {
        TemplateRecipientGroupItems.deleteWhere { TemplateRecipientGroupItems.studentId eq studentId } > 0
    }

    suspend fun deleteByGroupAndStudent(groupId: Int, studentId: Int): Boolean = dbQuery {
        TemplateRecipientGroupItems.deleteWhere {
            (TemplateRecipientGroupItems.templateRecipientGroupId eq groupId) and
            (TemplateRecipientGroupItems.studentId eq studentId)
        } > 0
    }

    private fun rowToTemplateRecipientGroupItem(row: ResultRow): TemplateRecipientGroupItem {
        return TemplateRecipientGroupItem(
            id = row[TemplateRecipientGroupItems.id],
            templateRecipientGroupId = row[TemplateRecipientGroupItems.templateRecipientGroupId],
            studentId = row[TemplateRecipientGroupItems.studentId],
            createdAt = row[TemplateRecipientGroupItems.createdAt],
            updatedAt = row[TemplateRecipientGroupItems.updatedAt]
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
