package dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import graphql.GraphQLContext
import models.TemplateElement
import org.dataloader.DataLoader

val TemplateElementDataLoader = object : KotlinDataLoader<String, TemplateElement> {
    override val dataLoaderName = "TemplateElementDataLoader"
    override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<String, TemplateElement> {
        TODO("Not yet implemented")
    }

}
