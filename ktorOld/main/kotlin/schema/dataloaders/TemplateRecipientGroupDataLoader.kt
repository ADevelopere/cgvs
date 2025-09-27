package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import com.expediagroup.graphql.generator.extensions.get
import graphql.GraphQLContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.future.future
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import schema.model.TemplateRecipientGroup
import services.TemplateRecipientGroupService
import kotlin.coroutines.EmptyCoroutineContext
import kotlin.getValue

val TemplateRecipientGroupDataLoader: KotlinDataLoader<Int, TemplateRecipientGroup> =
    object : KotlinDataLoader<Int, TemplateRecipientGroup>, KoinComponent {
        override val dataLoaderName = "TemplateRecipientGroupDataLoader"
        private val service: TemplateRecipientGroupService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, TemplateRecipientGroup> =
            DataLoaderFactory.newDataLoader(
                { ids, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        service.findByIds(ids)
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
