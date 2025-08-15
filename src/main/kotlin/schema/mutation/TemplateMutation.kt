package schema.mutation

import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import io.ktor.http.content.PartData
import io.ktor.http.content.forEachPart
import io.ktor.server.application.ApplicationCall
import io.ktor.server.request.receiveMultipart
import io.ktor.utils.io.InternalAPI
import models.CreateTemplateInput
import models.Template
import models.UpdateTemplateWithImageInput
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateService

class TemplateMutation : Mutation, KoinComponent {
    private val templateService: TemplateService by inject()

    suspend fun createTemplate(input: CreateTemplateInput): Template {
        return templateService.createTemplate(input)
    }


    @OptIn(InternalAPI::class)
    fun updateTemplateWithImage(
        input: UpdateTemplateWithImageInput,
        dfe: DataFetchingEnvironment
    ): Template {

        // Return template with diagnostic info
        return Template(
            id = input.id,
            name = input.name ?: "",
            description = input.description,
            categoryId = input.categoryId ?: 0,
            imageUrl = null // This would be set after saving the file
        )
    }
}
