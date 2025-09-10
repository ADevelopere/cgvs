package schema.model

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.datetime.LocalDateTime
import schema.dataloaders.TemplateDataLoader
import util.now
import java.util.concurrent.CompletableFuture

data class TemplateRecipientGroup(
    val id: Int,
    val templateId: Int,
    val name: String,
    val description: String? = null,
    val date: LocalDateTime? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
        return dataFetchingEnvironment.getValueFromDataLoader(TemplateDataLoader.dataLoaderName, templateId)
    }
}


data class CreateRecipientGroupInput(
    val templateId: Int,
    val name: String,
    val description: String? = null,
    val date: LocalDateTime? = null
) {
    fun toRecipientGroup(
        id: Int,
        createdAt: LocalDateTime,
        updatedAt: LocalDateTime
    ) = TemplateRecipientGroup(
        id = id,
        templateId = templateId,
        name = name,
        description = description,
        date = date,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

data class UpdateRecipientGroupInput(
    val id: Int,
    val name: String,
    val description: String? = null,
    val date: LocalDateTime? = null
)
