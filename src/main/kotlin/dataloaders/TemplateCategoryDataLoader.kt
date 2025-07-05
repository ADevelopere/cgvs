package dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import graphql.GraphQLContext
import models.TemplateCategory
import org.dataloader.DataLoader

val TemplateCategoryDataLoader = object : KotlinDataLoader<String, TemplateCategory> {
    override val dataLoaderName = "TemplateCategoryDataLoader"
    override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<String, TemplateCategory> {
        TODO("Not yet implemented")
    }
}
