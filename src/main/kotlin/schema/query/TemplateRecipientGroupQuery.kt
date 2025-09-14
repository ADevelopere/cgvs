package schema.query

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Query
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateRecipientGroupService
import kotlin.getValue

@Suppress("unused")
class TemplateRecipientGroupQuery : Query, KoinComponent {
    val service by inject<TemplateRecipientGroupService>()

    @GraphQLDescription("Get all recipient groups for a template.")
    suspend fun templateRecipientGroups(templateId: Int) = service.findAllByTemplateId(templateId)
}
