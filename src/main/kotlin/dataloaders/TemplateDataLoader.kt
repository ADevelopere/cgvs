package dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import graphql.GraphQLContext
import models.Template
import org.dataloader.DataLoader

val TemplateDataLoader = object : KotlinDataLoader<String, Template> {
    override val dataLoaderName = "TemplateDataLoader"
    override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<String, Template> {
        TODO("Not yet implemented")
    }

}
