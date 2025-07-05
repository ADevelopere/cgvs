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
import schema.query.HelloQueryService
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
            packages = listOf("models")
            queries = listOf(
                HelloQueryService()
            )
//            mutations = listOf(
//            )
        }
        engine {
            dataLoaderRegistryFactory = KotlinDataLoaderRegistryFactory(
            )
        }
        server {
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
