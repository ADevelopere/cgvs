package plugins

import config.DatabaseConfig
import io.ktor.server.application.*

fun Application.configureDatabase() {
    monitor.subscribe(ApplicationStarted) {
        DatabaseConfig.init(environment.config)
    }

    monitor.subscribe(ApplicationStopped) {
        DatabaseConfig.close()
    }
}
