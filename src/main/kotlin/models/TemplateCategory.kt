package models

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime
import dataloaders.TemplateCategoryDataLoader
import tables.SpecialType
import java.util.concurrent.CompletableFuture

@Serializable
data class TemplateCategory(
    val id: Int = 0,
    val name: String,
    val description: String? = null,
    val parentCategoryId: Int? = null,
    val order: Int? = null,
    val specialType: SpecialType? = null,
    val deletedAt: LocalDateTime? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
){
    fun parentCategory(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory?> {
        return if (parentCategoryId != null) {
            dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, parentCategoryId)
        } else CompletableFuture.completedFuture(null)
    }
}

data class CreateTemplateCategoryInput(
    val name: String,
    val description: String? = null,
    val parentCategoryId: String? = null,
    val order: Int? = null,
    val specialType: String? = null
)

data class UpdateTemplateCategoryInput(
    val name: String? = null,
    val description: String? = null,
    val parentCategoryId: String? = null,
    val order: Int? = null,
    val specialType: String? = null
)
