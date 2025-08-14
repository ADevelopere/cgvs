package models

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime
import dataloaders.TemplateCategoryDataLoader
import util.now
import java.util.concurrent.CompletableFuture

@Serializable
data class Template(
    val id: Int = 0,
    val name: String,
    val description: String? = null,
    val imageUrl: String? = null,
    val categoryId: Int,
    val order: Int? = null,
    val createdAt: LocalDateTime = now(),
    val updatedAt: LocalDateTime = now()
){
    fun category(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory> {
        return dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, categoryId)
    }
}


// Template configuration
data class TemplateConfig(
    val maxBackgroundSize: Int = 10485760, // 10MB in bytes
    val allowedFileTypes: List<String> = listOf("jpg", "jpeg", "png", "pdf")
)


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
    val categoryId: Int? = null
)

data class UpdateTemplateWithImageInput(
    val id: Int,
    val name: String? = null,
    val description: String? = null,
    val categoryId: Int? = null,
    val imageFile: String? = null // This would be a file upload in real implementation
)

data class ReorderTemplateInput(
    val id: String,
    val order: Int
)
