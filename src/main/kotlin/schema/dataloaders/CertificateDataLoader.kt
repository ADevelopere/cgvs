package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import graphql.GraphQLContext
import schema.type.Certificate
import org.dataloader.DataLoader

val CertificateDataLoader = object : KotlinDataLoader<String, Certificate> {
    override val dataLoaderName = "CertificateDataLoader"
    override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<String, Certificate> {
        TODO("Not yet implemented")
    }

}
