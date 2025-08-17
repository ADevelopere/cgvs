package schema.type

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalDate
import schema.dataloaders.TemplateDataLoader
import util.now
import java.util.concurrent.CompletableFuture

enum class TemplateVariableType {
    TEXT,
    NUMBER,
    DATE,
    SELECT
}

sealed class TemplateVariable {
    abstract val id: Int
    abstract val templateId: Int
    abstract val name: String
    abstract val description: String?
    abstract val type: TemplateVariableType
    abstract val required: Boolean
    abstract val order: Int
    abstract val createdAt: LocalDateTime
    abstract val updatedAt: LocalDateTime

    open fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
        return dataFetchingEnvironment.getValueFromDataLoader(
            TemplateDataLoader.dataLoaderName, templateId
        )
    }
}

// --- Input Data Classes for Creation/Update ---
interface CreateTemplateVariableInput {
    val templateId: Int
    val name: String
    val description: String?
    val required: Boolean
}

interface UpdateTemplateVariableInput {
    val id: Int
    val name: String
    val description: String?
    val required: Boolean
}

data class CreateTextCreateTemplateVariableInput(
    override val templateId: Int,
    override val name: String,
    override val description: String? = null,
    override val required: Boolean = false,
    val previewValue: String? = null,
    val minLength: Int? = null,
    val maxLength: Int? = null,
    val pattern: String? = null
) : CreateTemplateVariableInput

data class CreateNumberCreateTemplateVariableInput(
    override val templateId: Int,
    override val name: String,
    override val description: String? = null,
    override val required: Boolean = false,
    val previewValue: Double? = null,
    val minValue: Double? = null,
    val maxValue: Double? = null,
    val decimalPlaces: Int? = null
) : CreateTemplateVariableInput

data class CreateDateCreateTemplateVariableInput(
    override val templateId: Int,
    override val name: String,
    override val description: String? = null,
    override val required: Boolean = false,
    val previewValue: LocalDate? = null,
    val minDate: LocalDate? = null,
    val maxDate: LocalDate? = null,
    val format: String? = null
) : CreateTemplateVariableInput

data class CreateSelectCreateTemplateVariableInput(
    override val templateId: Int,
    override val name: String,
    override val description: String? = null,
    override val required: Boolean = false,
    val previewValue: String? = null,
    val options: List<String>,
    val multiple: Boolean = false
) : CreateTemplateVariableInput

data class UpdateTextCreateTemplateVariableInput(
    override val id: Int,
    override val name: String,
    override val description: String? = null,
    override val required: Boolean = false,
    val previewValue: String? = null,
    val minLength: Int? = null,
    val maxLength: Int? = null,
    val pattern: String? = null
) : UpdateTemplateVariableInput

data class UpdateNumberCreateTemplateVariableInput(
    override val id: Int,
    override val name: String,
    override val description: String? = null,
    override val required: Boolean = false,
    val previewValue: Double? = null,
    val minValue: Double? = null,
    val maxValue: Double? = null,
    val decimalPlaces: Int? = null
) : UpdateTemplateVariableInput

data class UpdateDateCreateTemplateVariableInput(
    override val id: Int,
    override val name: String,
    override val description: String? = null,
    override val required: Boolean = false,
    val previewValue: LocalDate? = null,
    val minDate: LocalDate? = null,
    val maxDate: LocalDate? = null,
    val format: String? = null
) : UpdateTemplateVariableInput

data class UpdateSelectCreateTemplateVariableInput(
    override val id: Int,
    override val name: String,
    override val description: String? = null,
    override val required: Boolean = false,
    val previewValue: String? = null,
    val options: List<String>,
    val multiple: Boolean = false
) : UpdateTemplateVariableInput

data class TextTemplateVariable(
    override val id: Int = 0,
    override val templateId: Int,
    override val name: String,
    override val description: String?,
    override val type: TemplateVariableType = TemplateVariableType.TEXT,
    override val required: Boolean,
    override val order: Int,
    override val createdAt: LocalDateTime = now(),
    override val updatedAt: LocalDateTime = now(),
    val previewValue: String?,
    val minLength: Int? = null,
    val maxLength: Int? = null,
    val pattern: String? = null
) : TemplateVariable()

data class NumberTemplateVariable(
    override val id: Int = 0,
    override val templateId: Int,
    override val name: String,
    override val description: String?,
    override val type: TemplateVariableType = TemplateVariableType.NUMBER,
    override val required: Boolean,
    override val order: Int,
    override val createdAt: LocalDateTime = now(),
    override val updatedAt: LocalDateTime = now(),
    val previewValue: Double?,
    val minValue: Double? = null,
    val maxValue: Double? = null,
    val decimalPlaces: Int? = null
) : TemplateVariable()

data class DateTemplateVariable(
    override val id: Int = 0,
    override val templateId: Int,
    override val name: String,
    override val description: String?,
    override val type: TemplateVariableType = TemplateVariableType.DATE,
    override val required: Boolean,
    override val order: Int,
    override val createdAt: LocalDateTime = now(),
    override val updatedAt: LocalDateTime = now(),
    val previewValue: LocalDate?,
    val minDate: LocalDate? = null,
    val maxDate: LocalDate? = null,
    val format: String? = null
) : TemplateVariable()

data class SelectTemplateVariable(
    override val id: Int = 0,
    override val templateId: Int,
    override val name: String,
    override val description: String?,
    override val type: TemplateVariableType = TemplateVariableType.SELECT,
    override val required: Boolean,
    override val order: Int,
    override val createdAt: LocalDateTime = now(),
    override val updatedAt: LocalDateTime = now(),
    val previewValue: String?,
    val options: List<String>? = null,
    val multiple: Boolean? = null
) : TemplateVariable()
