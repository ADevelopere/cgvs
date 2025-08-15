package plugins

import di.repositoryModule
import di.createServiceModule
import io.ktor.server.application.*
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun Application.configureDI() {
    install(Koin) {
        slf4jLogger()
        modules(
            repositoryModule,
            createServiceModule(this@configureDI)
        )
    }
}
