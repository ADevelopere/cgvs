package schema.mutation

import com.expediagroup.graphql.server.operations.Mutation
import models.CreateTemplateCategoryInput
import models.TemplateCategory
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateCategoryService

class TemplateCategoryMutation : Mutation, KoinComponent {
    private val templateCategoryService: TemplateCategoryService by inject()

    suspend fun createTemplateCategory(input: CreateTemplateCategoryInput): TemplateCategory {
        return templateCategoryService.createTemplateCategory(input)
    }
}
