package schema.dataloaders

import com.expediagroup.graphql.dataloader.KotlinDataLoader
import com.expediagroup.graphql.generator.extensions.get
import graphql.GraphQLContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.future.future
import schema.model.Template
import schema.model.TemplateCategory
import org.dataloader.DataLoader
import org.dataloader.DataLoaderFactory
import org.dataloader.DataLoaderOptions
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import services.TemplateCategoryService
import services.TemplateService
import kotlin.coroutines.EmptyCoroutineContext

val TemplateCategoryDataLoader: KotlinDataLoader<Int, TemplateCategory> =
    object : KotlinDataLoader<Int, TemplateCategory>, KoinComponent {
        override val dataLoaderName = "TemplateCategoryDataLoader"
        private val templateCategoryService: TemplateCategoryService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, TemplateCategory> =
            DataLoaderFactory.newDataLoader(
                { ids, batchLoaderEnvironment ->
                    val coroutineScope = // 3
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext) // 4

                    coroutineScope.future { // 5
                        templateCategoryService.findByIds(ids)
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }


val TemplateCategoryChildrenDataLoader: KotlinDataLoader<Int, List<TemplateCategory>> =
    object : KotlinDataLoader<Int, List<TemplateCategory>>, KoinComponent {
        override val dataLoaderName = "TemplateCategoryChildrenDataLoader"
        private val templateCategoryService: TemplateCategoryService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, List<TemplateCategory>> =
            DataLoaderFactory.newDataLoader(
                { parentIds, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        // For each parentId, fetch its children
                        parentIds.map { parentId ->
                            templateCategoryService.findByParentId(parentId)
                        }
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }

val TemplateCategoryTemplatesDataLoader: KotlinDataLoader<Int, List<Template>> =
    object : KotlinDataLoader<Int, List<Template>>, KoinComponent {
        override val dataLoaderName = "TemplateCategoryTemplatesDataLoader"
        private val templateService: TemplateService by inject()
        override fun getDataLoader(graphQLContext: GraphQLContext): DataLoader<Int, List<Template>> =
            DataLoaderFactory.newDataLoader(
                { categoryIds, batchLoaderEnvironment ->
                    val coroutineScope =
                        batchLoaderEnvironment.getContext<GraphQLContext>()?.get<CoroutineScope>()
                            ?: CoroutineScope(EmptyCoroutineContext)

                    coroutineScope.future {
                        // For each categoryId, fetch its templates
                        categoryIds.map { categoryId ->
                            templateService.findByCategoryId(categoryId)
                        }
                    }
                },
                DataLoaderOptions.newOptions()
                    .setBatchLoaderContextProvider { graphQLContext }
            )
    }
