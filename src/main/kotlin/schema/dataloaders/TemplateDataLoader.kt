package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import com.expediagroup.graphql.generator.extensions.get
import graphql.GraphQLContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.future.future
import schema.model.Template
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateService
import kotlin.coroutines.EmptyCoroutineContext
import kotlin.getValue


val TemplateDataLoader: KotlinDataLoader<Int, Template> =
    object : KotlinDataLoader<Int, Template>, KoinComponent {
        override val dataLoaderName = "TemplateDataLoader"
        private val service: TemplateService by inject()

        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, Template> =
            DataLoaderFactory.newDataLoader(
                { ids, batchLoaderEnvironment ->
                    val coroutineScope = // 3
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext) // 4

                    coroutineScope.future { // 5
                        service.findByIds(ids)
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
