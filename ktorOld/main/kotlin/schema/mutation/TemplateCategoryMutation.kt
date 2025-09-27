package schema.mutation

import com.expediagroup.graphql.server.operations.Mutation
import schema.model.CreateTemplateCategoryInput
import schema.model.TemplateCategory
import schema.model.UpdateTemplateCategoryInput
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateCategoryService


class TemplateCategoryMutation : Mutation, KoinComponent {
    private val templateCategoryService: TemplateCategoryService by inject()

    suspend fun createTemplateCategory(input: CreateTemplateCategoryInput): TemplateCategory {
        return templateCategoryService.create(input)
    }

    suspend fun updateTemplateCategory(input: UpdateTemplateCategoryInput): TemplateCategory {
        return templateCategoryService.update(input)
    }

    suspend fun deleteTemplateCategory(id: Int): TemplateCategory {
        return templateCategoryService.delete(id)
    }
}
