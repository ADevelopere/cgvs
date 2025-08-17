package schema.mutation

import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import schema.type.CreateTemplateInput
import schema.type.Template
import schema.type.UpdateTemplateInput
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateService

@Suppress("unused")
class TemplateMutation : Mutation, KoinComponent {
    private val templateService: TemplateService by inject()

    suspend fun createTemplate(input: CreateTemplateInput): Template {
        return templateService.create(input)
    }

    suspend fun updateTemplate(
        input: UpdateTemplateInput,
        dfe: DataFetchingEnvironment
    ): Template? {
        return templateService.update(input)
    }

    suspend fun deleteTemplate(id: Int): Template? {
        return templateService.delete(id)
    }

    suspend fun suspendTemplate(id: Int): Template? {
        return templateService.suspend(id)
    }

    suspend fun unsuspendTemplate(id: Int): Template? {
        return templateService.unsuspend(id)
    }
}
