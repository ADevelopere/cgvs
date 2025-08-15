package schema.mutation

import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import models.CreateTemplateInput
import models.ReorderTemplateInput
import models.Template
import models.UpdateTemplateInput
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateService

@Suppress("unused")
class TemplateMutation : Mutation, KoinComponent {
    private val templateService: TemplateService by inject()

    suspend fun createTemplate(input: CreateTemplateInput): Template {
        return templateService.createTemplate(input)
    }

    suspend fun updateTemplate(
        input: UpdateTemplateInput,
        dfe: DataFetchingEnvironment
    ): Template? {
        return templateService.updateTemplate(input)
    }

    suspend fun deleteTemplate(id: Int): Template? {
        return templateService.deleteTemplate(id)
    }

    suspend fun reorderTemplate(input: ReorderTemplateInput): Template? {
        return templateService.reorderTemplate(input)
    }

    suspend fun suspendTemplate(id: Int): Template? {
        return templateService.suspendTemplate(id)
    }

    suspend fun unsuspendTemplate(id: Int): Template? {
        return templateService.unsuspendTemplate(id)
    }
}
