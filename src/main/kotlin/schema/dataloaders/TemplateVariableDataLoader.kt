package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import graphql.GraphQLContext
import schema.model.TemplateVariable
import org.dataloader.DataLoader

val TemplateVariableDataLoader = object : KotlinDataLoader<String, TemplateVariable> {
    override val dataLoaderName = "TemplateVariableDataLoader"
    override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<String, TemplateVariable> {
        TODO("Not yet implemented")
    }
}
