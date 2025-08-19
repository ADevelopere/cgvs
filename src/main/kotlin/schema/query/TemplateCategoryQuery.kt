package schema.query

import com.expediagroup.graphql.server.operations.Query
import schema.model.TemplateCategory
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateCategoryService
import kotlin.getValue

class TemplateCategoryQuery : Query, KoinComponent {
    private val service: TemplateCategoryService by inject()

    suspend fun templateCategory(id: Int): TemplateCategory? {
        return service.findById(id)
    }

    suspend fun templateCategories(): List<TemplateCategory> {
        return service.findAll()
    }

    suspend fun mainTemplateCategory(): TemplateCategory? {
        return service.mainTemplateCategory()
    }

    suspend fun suspensionTemplateCategory(): TemplateCategory? {
        return service.suspensionTemplateCategory()
    }
}
