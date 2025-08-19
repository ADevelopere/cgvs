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
import schema.model.TemplateVariable
import services.TemplateVariableService
import kotlin.coroutines.EmptyCoroutineContext

val TemplateVariablesDataLoader: KotlinDataLoader<Int, List<TemplateVariable>> =
    object : KotlinDataLoader<Int, List<TemplateVariable>>, KoinComponent {
        override val dataLoaderName = "TemplateVariablesDataLoader"
        private val service: TemplateVariableService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, List<TemplateVariable>> =
            DataLoaderFactory.newDataLoader(
                { templateIds, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        // For each templateId, fetch its variables
                        templateIds.map { templateId ->
                            service.findByTemplateId(templateId)
                        }
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }

