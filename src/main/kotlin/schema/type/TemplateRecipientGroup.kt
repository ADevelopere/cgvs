package models

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime
import schema.dataloaders.TemplateDataLoader
import java.util.concurrent.CompletableFuture

@Serializable
data class TemplateRecipientGroup(
    val id: Int = 0,
    val templateId: Int,
    val name: String,
    val description: String? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    fun template(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<Template?> {
        return dataFetchingEnvironment.getValueFromDataLoader(TemplateDataLoader.dataLoaderName, templateId)
    }
}
