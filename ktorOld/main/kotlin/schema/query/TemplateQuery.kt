package schema.query

import com.expediagroup.graphql.server.operations.Query
import schema.model.PaginatedTemplatesResponse
import schema.model.Template
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.model.PaginationArgs
import services.TemplateService
import kotlin.getValue

class TemplateQuery : Query, KoinComponent {
    private val service: TemplateService by inject()

    suspend fun template(id: Int): Template? {
        return service.findById(id)
    }

    suspend fun templates(
        paginationArgs: PaginationArgs? = null,
    ): PaginatedTemplatesResponse {
        // Fetch only the paginated items from database for better performance
        val paginatedResult = service.findPaginatedWithInfo(paginationArgs)

        return PaginatedTemplatesResponse(
            data = paginatedResult.data,
            paginationInfo = paginatedResult.paginationInfo
        )
    }
}
