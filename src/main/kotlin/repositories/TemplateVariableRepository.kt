package repositories

import models.TemplateVariable
import tables.TemplateVariables
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
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString
import org.jetbrains.exposed.v1.core.and

class TemplateVariableRepository(private val database: Database) {

    suspend fun create(variable: TemplateVariable): TemplateVariable = dbQuery {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val insertStatement = TemplateVariables.insert {
            it[templateId] = variable.templateId
            it[name] = variable.name
            it[type] = variable.type
            it[description] = variable.description
            it[previewValue] = variable.previewValue
            it[required] = variable.required
            it[order] = variable.order
            it[minLength] = variable.minLength
            it[maxLength] = variable.maxLength
            it[pattern] = variable.pattern
            it[minValue] = variable.minValue?.toBigDecimal()
            it[maxValue] = variable.maxValue?.toBigDecimal()
            it[decimalPlaces] = variable.decimalPlaces
            it[minDate] = variable.minDate
            it[maxDate] = variable.maxDate
            it[format] = variable.format
            it[options] = variable.options?.let { opts -> Json.encodeToString(opts) }
            it[multiple] = variable.multiple
            it[createdAt] = now
            it[updatedAt] = now
        }

        val id = insertStatement[TemplateVariables.id]
        variable.copy(
            id = id,
            createdAt = now,
            updatedAt = now
        )
    }

    suspend fun findById(id: Int): TemplateVariable? = dbQuery {
        TemplateVariables.selectAll()
            .where { TemplateVariables.id eq id }
            .map { rowToTemplateVariable(it) }
            .singleOrNull()
    }

    suspend fun findByTemplate(templateId: Int): List<TemplateVariable> = dbQuery {
        TemplateVariables.selectAll()
            .where { TemplateVariables.templateId eq templateId }
            .orderBy(TemplateVariables.order)
            .map { rowToTemplateVariable(it) }
    }

    suspend fun findByTemplateAndName(templateId: Int, name: String): TemplateVariable? = dbQuery {
        TemplateVariables.selectAll()
            .where { (TemplateVariables.templateId eq templateId) and (TemplateVariables.name eq name) }
            .map { rowToTemplateVariable(it) }
            .singleOrNull()
    }

    suspend fun findByType(type: String): List<TemplateVariable> = dbQuery {
        TemplateVariables.selectAll()
            .where { TemplateVariables.type eq type }
            .map { rowToTemplateVariable(it) }
    }

    suspend fun findRequired(templateId: Int): List<TemplateVariable> = dbQuery {
        TemplateVariables.selectAll()
            .where { (TemplateVariables.templateId eq templateId) and (TemplateVariables.required eq true) }
            .orderBy(TemplateVariables.order)
            .map { rowToTemplateVariable(it) }
    }

    suspend fun findAll(): List<TemplateVariable> = dbQuery {
        TemplateVariables.selectAll()
            .map { rowToTemplateVariable(it) }
    }

    suspend fun update(id: Int, variable: TemplateVariable): TemplateVariable? {
        val updated = dbQuery {
            TemplateVariables.update({ TemplateVariables.id eq id }) {
                it[templateId] = variable.templateId
                it[name] = variable.name
                it[type] = variable.type
                it[description] = variable.description
                it[previewValue] = variable.previewValue
                it[required] = variable.required
                it[order] = variable.order
                it[minLength] = variable.minLength
                it[maxLength] = variable.maxLength
                it[pattern] = variable.pattern
                it[minValue] = variable.minValue?.toBigDecimal()
                it[maxValue] = variable.maxValue?.toBigDecimal()
                it[decimalPlaces] = variable.decimalPlaces
                it[minDate] = variable.minDate
                it[maxDate] = variable.maxDate
                it[format] = variable.format
                it[options] = variable.options?.let { opts -> Json.encodeToString(opts) }
                it[multiple] = variable.multiple
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
        TemplateVariables.deleteWhere { TemplateVariables.id eq id } > 0
    }

    suspend fun deleteByTemplate(templateId: Int): Boolean = dbQuery {
        TemplateVariables.deleteWhere { TemplateVariables.templateId eq templateId } > 0
    }

    private fun rowToTemplateVariable(row: ResultRow): TemplateVariable {
        return TemplateVariable(
            id = row[TemplateVariables.id],
            templateId = row[TemplateVariables.templateId],
            name = row[TemplateVariables.name],
            type = row[TemplateVariables.type],
            description = row[TemplateVariables.description],
            previewValue = row[TemplateVariables.previewValue],
            required = row[TemplateVariables.required],
            order = row[TemplateVariables.order],
            minLength = row[TemplateVariables.minLength],
            maxLength = row[TemplateVariables.maxLength],
            pattern = row[TemplateVariables.pattern],
            minValue = row[TemplateVariables.minValue]?.toInt(),
            maxValue = row[TemplateVariables.maxValue]?.toInt(),
            decimalPlaces = row[TemplateVariables.decimalPlaces],
            minDate = row[TemplateVariables.minDate],
            maxDate = row[TemplateVariables.maxDate],
            format = row[TemplateVariables.format],
            options = row[TemplateVariables.options]?.let { Json.decodeFromString<List<String>>(it) },
            multiple = row[TemplateVariables.multiple],
            createdAt = row[TemplateVariables.createdAt],
            updatedAt = row[TemplateVariables.updatedAt]
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
