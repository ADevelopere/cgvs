package schema.mutation

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Mutation
import org.koin.core.component.KoinComponent
import schema.model.CreateRecipientGroupInput
import services.TemplateRecipientGroupService
import org.koin.core.component.inject
import schema.model.TemplateRecipientGroup
import schema.model.UpdateRecipientGroupInput

@Suppress("unused")
class TemplateRecipientGroupMutation : Mutation, KoinComponent {
    val service by inject<TemplateRecipientGroupService>()

    @GraphQLDescription("Create a new recipient group for a template.")
    suspend fun createRecipientGroup(input: CreateRecipientGroupInput) = service.create(input)

    @GraphQLDescription("Update an existing recipient group.")
    suspend fun updateTemplateRecipientGroup(input: UpdateRecipientGroupInput): TemplateRecipientGroup? =
        service.update(input)

    @GraphQLDescription("Delete a recipient group by ID.")
    suspend fun deleteTemplateRecipientGroup(id: Int): TemplateRecipientGroup? = service.deleteById(id)
}
