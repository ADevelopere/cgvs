package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import graphql.GraphQLContext
import models.Student
import org.dataloader.DataLoader

val StudentDataLoader = object : KotlinDataLoader<String, Student> {
    override val dataLoaderName = "StudentDataLoader"
    override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<String, Student> {
        TODO("Not yet implemented")
    }
}
