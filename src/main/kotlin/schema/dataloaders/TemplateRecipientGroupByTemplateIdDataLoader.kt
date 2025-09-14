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

val TemplateRecipientGroupDataLoader: KotlinDataLoader<Int, List<TemplateRecipientGroup>> =
    object : KotlinDataLoader<Int, List<TemplateRecipientGroup>>, KoinComponent {
        override val dataLoaderName = "TemplateVariablesDataLoader"
        private val service: TemplateRecipientGroupService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, List<TemplateRecipientGroup>> =
            DataLoaderFactory.newDataLoader(
                { templateIds, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        // For each templateId, fetch its variables
                        templateIds.map { templateId ->
                            service.findAllByTemplateId(templateId)
                        }
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
