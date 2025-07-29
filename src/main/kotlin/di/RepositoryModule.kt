package di

import config.DatabaseConfig
import org.jetbrains.exposed.v1.jdbc.Database
import org.koin.dsl.module
import repositories.UserRepository
import repositories.SessionRepository
import services.AuthService
import io.ktor.server.application.*
import org.koin.core.qualifier.named

val repositoryModule = module {
    single<Database> { Database.connect(DatabaseConfig.dataSource) }
    single<UserRepository> { UserRepository(get()) }
    single<SessionRepository> { SessionRepository(get()) }
}

// Separate module for services that need application context
fun createServiceModule(application: Application) = module {
    single<AuthService> { 
        val config = application.environment.config
        AuthService(
            userRepository = get(),
            sessionRepository = get(),
            jwtSecret = config.property("postgres.secret").getString(),
            jwtDomain = config.property("postgres.domain").getString(),
            jwtAudience = config.property("postgres.audience").getString()
        )
    }
}
