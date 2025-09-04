package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import com.expediagroup.graphql.generator.extensions.get
import graphql.GraphQLContext
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.future.future
import services.StorageDbService
import kotlin.coroutines.EmptyCoroutineContext

val UrlDataLoader: KotlinDataLoader<Long, String> =
    object : KotlinDataLoader<Long, String>, KoinComponent {
        override val dataLoaderName = "UrlDataLoader"
        private val storageDbService: StorageDbService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Long, String> =
            DataLoaderFactory.newDataLoader(
                { ids, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        storageDbService.getFilesByIds(ids).map {
                            it.path
                        }
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
