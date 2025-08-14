package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import com.expediagroup.graphql.generator.extensions.get
import graphql.GraphQLContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.future.future
import models.TemplateCategory
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateCategoryService
import kotlin.coroutines.EmptyCoroutineContext

val TemplateCategoryDataLoader: KotlinDataLoader<Int, TemplateCategory> =
    object : KotlinDataLoader<Int, TemplateCategory>, KoinComponent {
        override val dataLoaderName = "TemplateCategoryDataLoader"
        private val service: TemplateCategoryService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, TemplateCategory> =
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


val TemplateCategoryChildrenDataLoader: KotlinDataLoader<Int, List<TemplateCategory>> =
    object : KotlinDataLoader<Int, List<TemplateCategory>>, KoinComponent {
        override val dataLoaderName = "TemplateCategoryChildrenDataLoader"
        private val service: TemplateCategoryService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, List<TemplateCategory>> =
            DataLoaderFactory.newDataLoader(
                { parentIds, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        // For each parentId, fetch its children
                        parentIds.map { parentId ->
                            service.findByParentId(parentId)
                        }
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
