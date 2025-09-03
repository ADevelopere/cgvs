package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import com.expediagroup.graphql.generator.extensions.get
import config.GcsConfig
import graphql.GraphQLContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.future.future
import schema.model.File
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.StorageDbService
import kotlin.coroutines.EmptyCoroutineContext

val StorageFileDataLoader: KotlinDataLoader<Long, File> =
    object : KotlinDataLoader<Long, File>, KoinComponent {
        override val dataLoaderName = "StorageFileDataLoader"
        private val storageDbService: StorageDbService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Long, File> =
            DataLoaderFactory.newDataLoader(
                { ids, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        storageDbService.getFilesByIds(ids)
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
