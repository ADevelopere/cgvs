package schema.type

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalDate
import schema.dataloaders.TemplateDataLoader
import java.util.concurrent.CompletableFuture

@Serializable
data class TemplateVariable(
    val id: Int = 0,
    val templateId: Int,
    val name: String,
    val type: String,
    val description: String? = null,
    val previewValue: String? = null,
    val required: Boolean = false,
    val order: Int,
    // Text variable properties
    val minLength: Int? = null,
    val maxLength: Int? = null,
    val pattern: String? = null,
    // Number variable properties
    val minValue: Int? = null,
    val maxValue: Int? = null,
    val decimalPlaces: Int? = null,
    // Date variable properties
    val minDate: LocalDate? = null,
    val maxDate: LocalDate? = null,
    val format: String? = null,
    // Select variable properties
    val options: List<String>? = null,
    val multiple: Boolean? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
        return dataFetchingEnvironment.getValueFromDataLoader(TemplateDataLoader.dataLoaderName, templateId)
    }
}


data class CreateTemplateVariableInput(
    val templateId: String,
    val name: String,
    val label: String,
    val description: String? = null,
    val order: Int? = null,
    val isRequired: Boolean = false,
    val defaultValue: String? = null
)

data class UpdateTemplateVariableInput(
    val name: String? = null,
    val label: String? = null,
    val description: String? = null,
    val order: Int? = null,
    val isRequired: Boolean? = null,
    val defaultValue: String? = null
)
