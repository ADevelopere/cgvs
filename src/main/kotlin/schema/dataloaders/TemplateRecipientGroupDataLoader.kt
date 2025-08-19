package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import graphql.GraphQLContext
import schema.model.TemplateRecipientGroup
import org.dataloader.DataLoader

val TemplateRecipientGroupDataLoader = object : KotlinDataLoader<String, TemplateRecipientGroup> {
    override val dataLoaderName = "TemplateRecipientGroupDataLoader"
    override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<String, TemplateRecipientGroup> {
        TODO("Not yet implemented")
    }
}
