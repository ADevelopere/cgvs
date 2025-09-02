package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import com.expediagroup.graphql.generator.extensions.get
import graphql.GraphQLContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.future.future
import schema.model.FileInfo
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.StorageDbService
import kotlin.coroutines.EmptyCoroutineContext

val StorageFileDataLoader: KotlinDataLoader<Long, FileInfo> =
    object : KotlinDataLoader<Long, FileInfo>, KoinComponent {
        override val dataLoaderName = "StorageFileDataLoader"
        private val storageDbService: StorageDbService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Long, FileInfo> =
            DataLoaderFactory.newDataLoader(
                { ids, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        storageDbService.getFileInfosByIds(ids)
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }