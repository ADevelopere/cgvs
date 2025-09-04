package plugins

import com.expediagroup.graphql.dataloader.KotlinDataLoaderRegistryFactory
import com.expediagroup.graphql.server.ktor.GraphQL
import com.expediagroup.graphql.server.ktor.defaultGraphQLStatusPages
import com.expediagroup.graphql.server.ktor.graphQLGetRoute
import com.expediagroup.graphql.server.ktor.graphQLPostRoute
import com.expediagroup.graphql.server.ktor.graphQLSDLRoute
import com.expediagroup.graphql.server.ktor.graphQLSubscriptionsRoute
import com.expediagroup.graphql.server.ktor.graphiQLRoute
import io.ktor.serialization.jackson.JacksonWebsocketContentConverter
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.routing.routing
import io.ktor.server.websocket.WebSockets
import io.ktor.server.websocket.pingPeriod
import schema.query.AuthQuery
import schema.query.UserQuery
import schema.query.StorageQuery
import schema.mutation.AuthMutation
import context.CustomGraphQLContextFactory
import context.CustomDataFetcherExceptionHandler
import hooks.customSchemaGeneratorHooks
import schema.dataloaders.StorageFileInfoDataLoader
import schema.dataloaders.TemplateCategoryChildrenDataLoader
import schema.dataloaders.TemplateCategoryDataLoader
import schema.dataloaders.TemplateCategoryTemplatesDataLoader
import schema.dataloaders.TemplateDataLoader
import schema.dataloaders.TemplateVariablesDataLoader
import schema.dataloaders.UrlDataLoader
import schema.mutation.StudentMutation
import schema.mutation.TemplateCategoryMutation
import schema.mutation.TemplateMutation
import schema.mutation.TemplateVariableMutation
import schema.mutation.StorageMutation
import schema.query.StudentQuery
import schema.query.TemplateCategoryQuery
import schema.query.TemplateConfigQuery
import schema.query.TemplateQuery
import kotlin.time.Duration.Companion.seconds


fun Application.graphQLModule() {
    install(WebSockets) {
        pingPeriod = 1.seconds
        contentConverter = JacksonWebsocketContentConverter()
    }

    install(StatusPages) {
        defaultGraphQLStatusPages()
    }

    install(GraphQL) {
        schema {
            packages = listOf("schema", "com.google.i18n.phonenumbers")
            queries = listOf(
                AuthQuery(),
                UserQuery(),
                StorageQuery(),
                TemplateQuery(),
                TemplateConfigQuery(),
                TemplateCategoryQuery(),
                StudentQuery(),
            )
            mutations = listOf(
                AuthMutation(),
                StorageMutation(),
                TemplateCategoryMutation(),
                TemplateMutation(),
                TemplateVariableMutation(),
                StudentMutation()
            )
            hooks = customSchemaGeneratorHooks
        }
        engine {
            dataLoaderRegistryFactory = KotlinDataLoaderRegistryFactory(
                TemplateCategoryDataLoader,
                TemplateCategoryChildrenDataLoader,
                TemplateCategoryTemplatesDataLoader,
                TemplateDataLoader,
                TemplateVariablesDataLoader,
                UrlDataLoader,
                StorageFileInfoDataLoader
            )
            exceptionHandler = CustomDataFetcherExceptionHandler()
        }
        server {
            contextFactory = CustomGraphQLContextFactory()
        }
    }

    routing {
        graphQLGetRoute()
        graphQLPostRoute()
        graphQLSubscriptionsRoute()
        graphiQLRoute()
        graphQLSDLRoute()
    }
}
