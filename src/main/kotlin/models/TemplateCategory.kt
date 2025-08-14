package models

import com.expediagroup.graphql.server.extensions.getValueFromDataLoader
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.Serializable
import kotlinx.datetime.LocalDateTime
import dataloaders.TemplateCategoryDataLoader
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateCategoryService
import tables.CategorySpecialType
import util.now
import java.util.concurrent.CompletableFuture
import kotlin.getValue


object TemplateCategoryHelper : KoinComponent {
    private val service: TemplateCategoryService by inject()
}

@Serializable
data class TemplateCategory(
    val id: Int = 0,
    val name: String,
    val description: String? = null,
    val parentCategoryId: Int? = null,
    val order: Int? = null,
    val categorySpecialType: CategorySpecialType? = null,
    val deletedAt: LocalDateTime? = null,
    val createdAt: LocalDateTime = now(),
    val updatedAt: LocalDateTime = now()
) {
    fun parentCategory(dataFetchingEnvironment: DataFetchingEnvironment): CompletableFuture<TemplateCategory?> {
        return if (parentCategoryId != null) {
            dataFetchingEnvironment.getValueFromDataLoader(TemplateCategoryDataLoader.dataLoaderName, parentCategoryId)
        } else CompletableFuture.completedFuture(null)
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
    val order: Int
)
