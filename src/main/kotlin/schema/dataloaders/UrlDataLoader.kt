package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import graphql.GraphQLContext
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import config.GcsConfig
import java.util.concurrent.CompletableFuture

val UrlDataLoader: KotlinDataLoader<String, String> =
    object : KotlinDataLoader<String, String>, KoinComponent {
        override val dataLoaderName = "UrlDataLoader"
        private val gcsConfig: GcsConfig by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<String, String> =
            DataLoaderFactory.newDataLoader(
                { fileNames, _ ->
                    CompletableFuture.supplyAsync {
                        fileNames.map { fileName ->
                            if (fileName.isNullOrBlank()) "" else gcsConfig.baseUrl + fileName
                        }
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
