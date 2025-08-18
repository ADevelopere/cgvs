package repositories

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.core.max
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.deleteWhere
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.select
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import org.jetbrains.exposed.v1.jdbc.update
import schema.type.*
import tables.*
import util.now
import kotlin.toBigDecimal

class TemplateVariableRepository(private val database: Database) {

    private suspend fun insertIntoBase(
        variable: TemplateVariable,
        variableType: TemplateVariableType
    ): Int = dbQuery {
        TemplateVariableBase.insert {
            it[templateId] = variable.templateId
            it[name] = variable.name
            it[type] = variableType
            it[description] = variable.description
            it[required] = variable.required
            it[order] = variable.order
            it[createdAt] = variable.createdAt
            it[updatedAt] = variable.updatedAt
        }[TemplateVariableBase.id]
    }

    suspend fun exists(id: Int): Boolean = dbQuery {
        TemplateVariableBase.selectAll()
            .where { TemplateVariableBase.id eq id }
            .count() > 0
    }

    private suspend fun updateBase(variable: TemplateVariable): Boolean = dbQuery {
        // Update base table
        val updated = TemplateVariableBase.update({ TemplateVariableBase.id eq variable.id }) {
            it[name] = variable.name
            it[description] = variable.description
            it[required] = variable.required
            it[updatedAt] = now()
        }

        updated > 0
    }

    // --- Text Template Variable Functions ---
    suspend fun createTextTemplateVariable(variable: TextTemplateVariable): TextTemplateVariable = dbQuery {
        // Insert into base table
        val baseId = runBlocking { insertIntoBase(variable, TemplateVariableType.TEXT) }

        // Insert into text-specific table
        TextTemplateVariables.insert {
            it[id] = baseId
            it[minLength] = variable.minLength
            it[maxLength] = variable.maxLength
            it[pattern] = variable.pattern
            it[previewValue] = variable.textPreviewValue
        }

        variable.apply { id = baseId }
    }

    suspend fun updateTextTemplateVariable(variable: TextTemplateVariable): TextTemplateVariable? = dbQuery {
        val baseUpdated = runBlocking { updateBase(variable) }

        if (baseUpdated) {
            val updated = TextTemplateVariables.update({ TextTemplateVariables.id eq variable.id }) {
                it[minLength] = variable.minLength
                it[maxLength] = variable.maxLength
                it[pattern] = variable.pattern
                it[previewValue] = variable.textPreviewValue
            }
            if (updated > 0) {
                runBlocking { findTextTemplateVariableById(variable.id) }
            } else null
        } else null
    }

    suspend fun findTextTemplateVariableById(id: Int): TextTemplateVariable? = dbQuery {
        (TemplateVariableBase innerJoin TextTemplateVariables)
            .selectAll()
            .where { TemplateVariableBase.id eq id }
            .map { rowToTextTemplateVariable(it) }
            .singleOrNull()
    }

    // --- Number Template Variable Functions ---
    suspend fun createNumberTemplateVariable(variable: NumberTemplateVariable): NumberTemplateVariable =
        dbQuery {
            val baseId = runBlocking { insertIntoBase(variable, TemplateVariableType.NUMBER) }

            NumberTemplateVariables.insert {
                it[id] = baseId
                it[minValue] = variable.minValue?.toBigDecimal()
                it[maxValue] = variable.maxValue?.toBigDecimal()
                it[decimalPlaces] = variable.decimalPlaces
                it[previewValue] = variable.numberPreviewValue?.toBigDecimal()
            }

            variable.apply { id = baseId }
        }

    suspend fun updateNumberTemplateVariable(variable: NumberTemplateVariable): NumberTemplateVariable? =
        dbQuery {
            val baseUpdated = runBlocking { updateBase(variable) }


            if (baseUpdated) {
                val updated = NumberTemplateVariables.update({ NumberTemplateVariables.id eq variable.id }) {
                    it[minValue] = variable.minValue?.toBigDecimal()
                    it[maxValue] = variable.maxValue?.toBigDecimal()
                    it[decimalPlaces] = variable.decimalPlaces
                    it[previewValue] = variable.numberPreviewValue?.toBigDecimal()
                }

                if (updated > 0) {
                    runBlocking { findNumberTemplateVariableById(variable.id) }
                } else null
            } else null
        }

    suspend fun findNumberTemplateVariableById(id: Int): NumberTemplateVariable? = dbQuery {
        (TemplateVariableBase innerJoin NumberTemplateVariables)
            .selectAll()
            .where { TemplateVariableBase.id eq id }
            .map { rowToNumberTemplateVariable(it) }
            .singleOrNull()
    }

    // --- Date Template Variable Functions ---
    suspend fun createDateTemplateVariable(variable: DateTemplateVariable): DateTemplateVariable = dbQuery {
        val baseId = runBlocking { insertIntoBase(variable, TemplateVariableType.DATE) }

        DateTemplateVariables.insert {
            it[id] = baseId
            it[minDate] = variable.minDate
            it[maxDate] = variable.maxDate
            it[format] = variable.format
            it[previewValue] = variable.datePreviewValue
        }

        variable.apply { id = baseId }
    }

    suspend fun updateDateTemplateVariable(variable: DateTemplateVariable): DateTemplateVariable? =
        dbQuery {

            val baseUpdated = runBlocking { updateBase(variable) }


            if (baseUpdated) {
                // Update date-specific table
                val updated = DateTemplateVariables.update({ DateTemplateVariables.id eq variable.id }) {
                    it[minDate] = variable.minDate
                    it[maxDate] = variable.maxDate
                    it[format] = variable.format
                    it[previewValue] = variable.datePreviewValue
                }

                if (updated > 0) {
                    runBlocking { findDateTemplateVariableById(variable.id) }
                } else null
            } else null
        }

    suspend fun findDateTemplateVariableById(id: Int): DateTemplateVariable? = dbQuery {
        (TemplateVariableBase innerJoin DateTemplateVariables)
            .selectAll()
            .where { TemplateVariableBase.id eq id }
            .map { rowToDateTemplateVariable(it) }
            .singleOrNull()
    }

    // --- Select Template Variable Functions ---
    suspend fun createSelectTemplateVariable(variable: SelectTemplateVariable): SelectTemplateVariable =
        dbQuery {
            val baseId = runBlocking { insertIntoBase(variable, TemplateVariableType.SELECT) }

            SelectTemplateVariables.insert {
                it[id] = baseId
                it[options] = Json.encodeToString(variable.options)
                it[multiple] = variable.multiple
                it[previewValue] = variable.selectPreviewValue
            }

            variable.apply { id = baseId }
        }

    suspend fun updateSelectTemplateVariable(variable: SelectTemplateVariable): SelectTemplateVariable? =
        dbQuery {
            val baseUpdated = runBlocking { updateBase(variable) }


            if (baseUpdated) {
                val updated = SelectTemplateVariables.update({ SelectTemplateVariables.id eq variable.id }) {
                    it[options] = Json.encodeToString(variable.options)
                    it[multiple] = variable.multiple
                }

                if (updated > 0) {
                    runBlocking { findSelectTemplateVariableById(variable.id) }
                } else null
            } else null
        }

    suspend fun findSelectTemplateVariableById(id: Int): SelectTemplateVariable? = dbQuery {
        (TemplateVariableBase innerJoin SelectTemplateVariables)
            .selectAll()
            .where { TemplateVariableBase.id eq id }
            .map { rowToSelectTemplateVariable(it) }
            .singleOrNull()
    }

    // --- Generic Template Variable Functions ---
    suspend fun findTemplateVariableById(id: Int): TemplateVariable? = dbQuery {
        val baseRow = TemplateVariableBase.selectAll()
            .where { TemplateVariableBase.id eq id }
            .singleOrNull() ?: return@dbQuery null
        runBlocking {
            when (baseRow[TemplateVariableBase.type]) {
                TemplateVariableType.TEXT -> findTextTemplateVariableById(id)
                TemplateVariableType.NUMBER -> findNumberTemplateVariableById(id)
                TemplateVariableType.DATE -> findDateTemplateVariableById(id)
                TemplateVariableType.SELECT -> findSelectTemplateVariableById(id)
            }
        }
    }

    suspend fun findTemplateVariablesByTemplateId(templateId: Int): List<TemplateVariable> = dbQuery {
        val baseRows = TemplateVariableBase.selectAll()
            .where { TemplateVariableBase.templateId eq templateId }
            .orderBy(TemplateVariableBase.order)

        runBlocking {
            baseRows.mapNotNull { baseRow ->
                when (baseRow[TemplateVariableBase.type]) {
                    TemplateVariableType.TEXT -> findTextTemplateVariableById(baseRow[TemplateVariableBase.id])
                    TemplateVariableType.NUMBER -> findNumberTemplateVariableById(baseRow[TemplateVariableBase.id])
                    TemplateVariableType.DATE -> findDateTemplateVariableById(baseRow[TemplateVariableBase.id])
                    TemplateVariableType.SELECT -> findSelectTemplateVariableById(baseRow[TemplateVariableBase.id])
                }
            }
        }
    }

    suspend fun deleteTemplateVariable(id: Int): Boolean = dbQuery {
        // Delete from base table (cascading will handle the specific tables)
        TemplateVariableBase.deleteWhere { TemplateVariableBase.id eq id } > 0
    }

    suspend fun deleteTemplateVariablesByTemplate(templateId: Int): Boolean = dbQuery {
        TemplateVariableBase.deleteWhere { TemplateVariableBase.templateId eq templateId } > 0
    }

    suspend fun findMaxOrderByTemplateId(categoryId: Int): Int = dbQuery {
        val maxOrderExpr = TemplateVariableBase.order.max()
        val query = TemplateVariableBase
            .select(maxOrderExpr)
            .where { TemplateVariableBase.templateId eq categoryId }

        val maxOrder = query.map { it[maxOrderExpr] }.singleOrNull()
        maxOrder ?: 1
    }

    // --- Row Mapping Functions ---
    private fun rowToTextTemplateVariable(row: ResultRow): TextTemplateVariable {
        return TextTemplateVariable(
            id = row[TemplateVariableBase.id],
            templateId = row[TemplateVariableBase.templateId],
            name = row[TemplateVariableBase.name],
            description = row[TemplateVariableBase.description],
            required = row[TemplateVariableBase.required],
            order = row[TemplateVariableBase.order],
            createdAt = row[TemplateVariableBase.createdAt],
            updatedAt = row[TemplateVariableBase.updatedAt],
            minLength = row[TextTemplateVariables.minLength],
            maxLength = row[TextTemplateVariables.maxLength],
            pattern = row[TextTemplateVariables.pattern],
            textPreviewValue = row[TextTemplateVariables.previewValue],
        )
    }

    private fun rowToNumberTemplateVariable(row: ResultRow): NumberTemplateVariable {
        return NumberTemplateVariable(
            id = row[TemplateVariableBase.id],
            templateId = row[TemplateVariableBase.templateId],
            name = row[TemplateVariableBase.name],
            description = row[TemplateVariableBase.description],
            required = row[TemplateVariableBase.required],
            order = row[TemplateVariableBase.order],
            createdAt = row[TemplateVariableBase.createdAt],
            updatedAt = row[TemplateVariableBase.updatedAt],
            minValue = row[NumberTemplateVariables.minValue]?.toDouble(),
            maxValue = row[NumberTemplateVariables.maxValue]?.toDouble(),
            decimalPlaces = row[NumberTemplateVariables.decimalPlaces],
            numberPreviewValue = row[NumberTemplateVariables.previewValue]?.toDouble(),
        )
    }

    private fun rowToDateTemplateVariable(row: ResultRow): DateTemplateVariable {
        return DateTemplateVariable(
            id = row[TemplateVariableBase.id],
            templateId = row[TemplateVariableBase.templateId],
            name = row[TemplateVariableBase.name],
            description = row[TemplateVariableBase.description],
            required = row[TemplateVariableBase.required],
            order = row[TemplateVariableBase.order],
            createdAt = row[TemplateVariableBase.createdAt],
            updatedAt = row[TemplateVariableBase.updatedAt],
            minDate = row[DateTemplateVariables.minDate],
            maxDate = row[DateTemplateVariables.maxDate],
            format = row[DateTemplateVariables.format],
            datePreviewValue = row[DateTemplateVariables.previewValue],
        )
    }

    private fun rowToSelectTemplateVariable(row: ResultRow): SelectTemplateVariable {
        return SelectTemplateVariable(
            id = row[TemplateVariableBase.id],
            templateId = row[TemplateVariableBase.templateId],
            name = row[TemplateVariableBase.name],
            description = row[TemplateVariableBase.description],
            required = row[TemplateVariableBase.required],
            order = row[TemplateVariableBase.order],
            createdAt = row[TemplateVariableBase.createdAt],
            updatedAt = row[TemplateVariableBase.updatedAt],
            options = row[SelectTemplateVariables.options]?.let { Json.decodeFromString<List<String>>(it) },
            multiple = row[SelectTemplateVariables.multiple],
            selectPreviewValue = row[SelectTemplateVariables.previewValue],
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
