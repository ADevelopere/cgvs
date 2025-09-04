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
import services.StorageService
import kotlin.coroutines.EmptyCoroutineContext

val StorageFileInfoDataLoader: KotlinDataLoader<String, FileInfo> =
    object : KotlinDataLoader<String, FileInfo>, KoinComponent {
        override val dataLoaderName = "StorageFileDataLoader"
        private val storageService: StorageService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<String, FileInfo> =
            DataLoaderFactory.newDataLoader(
                { paths, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        paths.mapNotNull { path ->
                            storageService.getFileEntityByPath(path)
                        }
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
