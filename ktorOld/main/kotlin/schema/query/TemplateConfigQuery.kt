package schema.query

import com.expediagroup.graphql.server.operations.Query
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateConfigService

class TemplateConfigQuery: Query, KoinComponent {
    private val templateConfigQueryService: TemplateConfigService by inject()

    suspend fun templateConfig() = templateConfigQueryService.templateConfig()
}
