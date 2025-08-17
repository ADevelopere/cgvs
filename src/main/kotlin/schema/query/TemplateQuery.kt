package schema.query

import com.expediagroup.graphql.server.operations.Query
import schema.type.PaginatedTemplatesResponse
import schema.type.Template
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.directive.PaginateDirective
import services.TemplateService
import kotlin.getValue

class TemplateQuery : Query, KoinComponent {
    private val service: TemplateService by inject()

    suspend fun template(id: Int): Template? {
        return service.findById(id)
    }

    suspend fun templates(): List<Template> {
        return service.findAll()
    }

    @PaginateDirective(defaultCount = 15, maxCount = 100)
    suspend fun paginatedTemplates(
        first: Int? = null,
        skip: Int? = null,
        page: Int? = null
    ): PaginatedTemplatesResponse {
        // Fetch only the paginated items from database for better performance
        val paginatedResult = service.findPaginatedWithInfo(first, skip, page)

        return PaginatedTemplatesResponse(
            data = paginatedResult.data,
            paginationInfo = paginatedResult.paginationInfo
        )
    }
}
