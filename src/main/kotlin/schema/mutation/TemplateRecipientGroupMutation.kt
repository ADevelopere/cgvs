package schema.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Mutation
import org.koin.core.component.KoinComponent
import schema.model.CreateRecipientGroupInput
import services.TemplateRecipientGroupService
import org.koin.core.component.inject

@Suppress("unused")
class TemplateRecipientGroupMutation : Mutation, KoinComponent {
    val service by inject<TemplateRecipientGroupService>()

    @GraphQLDescription("Create a new recipient group for a template.")
    suspend fun createRecipientGroup(input: CreateRecipientGroupInput) = service.create(input)

    @GraphQLDescription("Get all recipient groups for a template.")
    suspend fun templateRecipientGroup(id: Int) = service.findAllByTemplateId(id)
}
