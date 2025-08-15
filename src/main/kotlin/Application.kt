import io.ktor.server.application.*
import plugins.configureDatabase
import plugins.configureDI
import plugins.configureHTTP
import plugins.configureRouting
import plugins.configureSecurity
import plugins.graphQLModule

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureDI()
    configureDatabase()
    configureHTTP()
    configureRouting()
    graphQLModule()
    configureSecurity()
}
