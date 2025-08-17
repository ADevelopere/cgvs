package models

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime
import schema.dataloaders.TemplateCategoryChildrenDataLoader
import schema.dataloaders.TemplateCategoryDataLoader
import schema.dataloaders.TemplateCategoryTemplatesDataLoader
import tables.CategorySpecialType
import util.now
import java.util.concurrent.CompletableFuture


@Serializable
data class TemplateCategory(
    val id: Int = 0,
    val name: String,
    val description: String? = null,
    @GraphQLIgnore val parentCategoryId: Int? = null,
    val order: Int? = null,
    val categorySpecialType: CategorySpecialType? = null,
    val createdAt: LocalDateTime = now(),
    val updatedAt: LocalDateTime = now()
) {
    @Suppress("unused")
    fun parentCategory(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory?> {
        return if (parentCategoryId != null) {
            dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, parentCategoryId)
        } else CompletableFuture.completedFuture(null)
    }

    @Suppress("unused")
    fun childCategories(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<List<TemplateCategory>> {
        return dataFetchingEnvironment.getValueFromDataLoader(
            TemplateCategoryChildrenDataLoader.dataLoaderName,
            id
        )
    }

    fun templates(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<List<Template>> {
        return dataFetchingEnvironment.getValueFromDataLoader(
            TemplateCategoryTemplatesDataLoader.dataLoaderName,
            id
        )
    }
}

data class CreateTemplateCategoryInput(
    val name: String,
    val description: String?,
    val parentCategoryId: Int?,
)

data class UpdateTemplateCategoryInput(
    val id: Int,
    val name: String,
    val description: String?,
    val parentCategoryId: Int?,
)
