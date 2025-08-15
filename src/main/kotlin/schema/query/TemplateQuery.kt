package schema.query

import com.expediagroup.graphql.server.operations.Query
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateService
import kotlin.getValue

class TemplateQuery: Query, KoinComponent {
    private val templateService: TemplateService by inject()
}
