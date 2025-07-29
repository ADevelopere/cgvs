package models

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime
import dataloaders.TemplateCategoryDataLoader
import java.util.concurrent.CompletableFuture

@Serializable
data class Template(
    val id: Int = 0,
    val name: String,
    val description: String? = null,
    val imageUrl: String? = null,
    val categoryId: Int,
    val preDeletionCategoryId: Int? = null,
    val order: Int? = null,
    val trashedAt: LocalDateTime? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
){
    fun category(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory> {
        return dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, categoryId)
    }

    fun preDeletionCategory(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory> {
        return if (preDeletionCategoryId != null) {
            dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, preDeletionCategoryId)
        } else CompletableFuture.completedFuture(null)
    }
}


// Template configuration
data class TemplateConfig(
    val maxBackgroundSize: Int = 10485760, // 10MB in bytes
    val allowedFileTypes: List<String> = listOf("jpg", "jpeg", "png", "pdf")
)

// Template preview
data class TemplatePreview(
    val url: String? = null,
    val html: String? = null
)

// Input types for mutations
data class CreateTemplateInput(
    val name: String,
    val description: String? = null,
    val categoryId: String
)

data class UpdateTemplateInput(
    val name: String? = null,
    val description: String? = null,
    val categoryId: String? = null
)

data class UpdateTemplateWithImageInput(
    val name: String? = null,
    val description: String? = null,
    val categoryId: String? = null,
    val imageFile: String? = null // This would be a file upload in real implementation
)

data class ReorderTemplateInput(
    val id: String,
    val order: Int
)
