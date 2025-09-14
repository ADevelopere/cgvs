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
import schema.model.TemplateRecipientGroupItem
import services.TemplateRecipientGroupItemService
import kotlin.coroutines.EmptyCoroutineContext
import kotlin.getValue

val TemplateRecipientGroupItemsDataLoader: KotlinDataLoader<Int, List<TemplateRecipientGroupItem>> =
    object : KotlinDataLoader<Int, List<TemplateRecipientGroupItem>>, KoinComponent {
        override val dataLoaderName = "TemplateRecipientGroupItemsDataLoader"
        private val service: TemplateRecipientGroupItemService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, List<TemplateRecipientGroupItem>> =
            DataLoaderFactory.newDataLoader(
                { templateIds, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        // For each templateId, fetch its variables
                        templateIds.map { templateId ->
                            service.findAllStudentsByGroupId(templateId)
                        }
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
