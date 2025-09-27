package repositories

import schema.model.RecipientGroupItemVariableValue
import tables.RecipientGroupItemVariableValues
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
import util.now

class RecipientGroupItemVariableValueRepository(private val database: Database) {

    suspend fun create(value: RecipientGroupItemVariableValue): RecipientGroupItemVariableValue = dbQuery {
        val now = now()
        val insertStatement = RecipientGroupItemVariableValues.insert {
            it[templateRecipientGroupItemId] = value.templateRecipientGroupItemId
            it[templateVariableId] = value.templateVariableId
            it[this.value] = value.value
            it[valueIndexed] = value.valueIndexed
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[RecipientGroupItemVariableValues.id]
        value.copy(
            id = id,
            createdAt = now,
            updatedAt = now
        )
    }

    suspend fun findById(id: Int): RecipientGroupItemVariableValue? = dbQuery {
        RecipientGroupItemVariableValues.selectAll()
            .where { RecipientGroupItemVariableValues.id eq id }
            .map { rowToRecipientGroupItemVariableValue(it) }
            .singleOrNull()
    }

    suspend fun findByGroupItem(itemId: Int): List<RecipientGroupItemVariableValue> = dbQuery {
        RecipientGroupItemVariableValues.selectAll()
            .where { RecipientGroupItemVariableValues.templateRecipientGroupItemId eq itemId }
            .map { rowToRecipientGroupItemVariableValue(it) }
    }

    suspend fun findByVariable(variableId: Int): List<RecipientGroupItemVariableValue> = dbQuery {
        RecipientGroupItemVariableValues.selectAll()
            .where { RecipientGroupItemVariableValues.templateVariableId eq variableId }
            .map { rowToRecipientGroupItemVariableValue(it) }
    }

    suspend fun findByGroupItemAndVariable(
        itemId: Int,
        variableId: Int
    ): RecipientGroupItemVariableValue? = dbQuery {
        RecipientGroupItemVariableValues.selectAll()
            .where {
                (RecipientGroupItemVariableValues.templateRecipientGroupItemId eq itemId) and
                (RecipientGroupItemVariableValues.templateVariableId eq variableId)
            }
            .map { rowToRecipientGroupItemVariableValue(it) }
            .singleOrNull()
    }

    suspend fun findAll(): List<RecipientGroupItemVariableValue> = dbQuery {
        RecipientGroupItemVariableValues.selectAll()
            .map { rowToRecipientGroupItemVariableValue(it) }
    }

    suspend fun update(id: Int, value: RecipientGroupItemVariableValue): RecipientGroupItemVariableValue? {
        val updated = dbQuery {
            RecipientGroupItemVariableValues.update({ RecipientGroupItemVariableValues.id eq id }) {
                it[templateRecipientGroupItemId] = value.templateRecipientGroupItemId
                it[templateVariableId] = value.templateVariableId
                it[this.value] = value.value
                it[valueIndexed] = value.valueIndexed
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
        RecipientGroupItemVariableValues.deleteWhere { RecipientGroupItemVariableValues.id eq id } > 0
    }

    suspend fun deleteByGroupItem(itemId: Int): Boolean = dbQuery {
        RecipientGroupItemVariableValues.deleteWhere {
            RecipientGroupItemVariableValues.templateRecipientGroupItemId eq itemId
        } > 0
    }

    suspend fun deleteByVariable(variableId: Int): Boolean = dbQuery {
        RecipientGroupItemVariableValues.deleteWhere {
            RecipientGroupItemVariableValues.templateVariableId eq variableId
        } > 0
    }

    private fun rowToRecipientGroupItemVariableValue(row: ResultRow): RecipientGroupItemVariableValue {
        return RecipientGroupItemVariableValue(
            id = row[RecipientGroupItemVariableValues.id],
            templateRecipientGroupItemId = row[RecipientGroupItemVariableValues.templateRecipientGroupItemId],
            templateVariableId = row[RecipientGroupItemVariableValues.templateVariableId],
            value = row[RecipientGroupItemVariableValues.value],
            valueIndexed = row[RecipientGroupItemVariableValues.valueIndexed],
            createdAt = row[RecipientGroupItemVariableValues.createdAt],
            updatedAt = row[RecipientGroupItemVariableValues.updatedAt]
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
