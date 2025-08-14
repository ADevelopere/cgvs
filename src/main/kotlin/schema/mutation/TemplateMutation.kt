package schema.mutation

import com.expediagroup.graphql.server.operations.Mutation
import models.CreateTemplateInput
import models.Template
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateService

class TemplateMutation  : Mutation, KoinComponent {
    private val templateService: TemplateService by inject()

    suspend fun createTemplate(input: CreateTemplateInput): Template {
        return templateService.createTemplate(input)
    }
}
