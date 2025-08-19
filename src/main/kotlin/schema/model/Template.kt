package schema.model

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime
import schema.dataloaders.TemplateCategoryDataLoader
import schema.dataloaders.TemplateVariablesDataLoader
import services.StorageService
import util.now
import java.util.concurrent.CompletableFuture

@Serializable
@Suppress("unused")
data class Template(
    val id: Int = 0,
    val name: String,
    val description: String? = null,
    @GraphQLIgnore val imageFileName: String? = null,
    @GraphQLIgnore val categoryId: Int,
    val order: Int = 0,
    @GraphQLIgnore val preSuspensionCategoryId: Int? = null,
    val createdAt: LocalDateTime? = now(),
    val updatedAt: LocalDateTime? = now()
){
    fun category(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory> {
        return dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, categoryId)
    }

    fun preSuspensionCategory(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory?> {
        return if (preSuspensionCategoryId != null) {
            dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, preSuspensionCategoryId)
        } else {
            CompletableFuture.completedFuture(null)
        }
    }

    fun variables(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<List<TemplateVariable>?> {
        return dataFetchingEnvironment.getValueFromDataLoader(
            TemplateVariablesDataLoader.dataLoaderName, id
        )
    }

    fun imageUrl(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<String?> {
        return CompletableFuture.completedFuture(
            if (imageFileName != null) StorageService.TEMPLATE_BASE_URL + imageFileName else null
        )
    }
}

// Input types for mutations
data class CreateTemplateInput(
    val name: String,
    val description: String? = null,
    val categoryId: Int
)

data class UpdateTemplateInput(
    val id: Int,
    val name: String? = null,
    val description: String? = null,
    val categoryId: Int
)

data class PaginatedTemplatesResponse(
    val data: List<Template>,
    val paginationInfo: PaginationInfo? = null
)
