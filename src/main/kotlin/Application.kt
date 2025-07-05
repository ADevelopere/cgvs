import io.ktor.server.application.*
import plugins.configureDatabase
import plugins.configureDI

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureDI()
    configureDatabase()
    graphQLModule()
    configureSecurity()
}
