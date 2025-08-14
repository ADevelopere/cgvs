package di

import config.DatabaseConfig
import context.GraphQLAuthenticationHandler
import org.jetbrains.exposed.v1.jdbc.Database
import org.koin.dsl.module
import repositories.UserRepository
import repositories.SessionRepository
import services.AuthService
import io.ktor.server.application.*
import org.koin.core.qualifier.named
import repositories.TemplateCategoryRepository
import repositories.TemplateRepository
import services.TemplateCategoryService
import services.TemplateService

val repositoryModule = module {
    single<Database> { Database.connect(DatabaseConfig.dataSource) }
    single<UserRepository> { UserRepository(get()) }
    single<SessionRepository> { SessionRepository(get()) }
    single<TemplateCategoryRepository> { TemplateCategoryRepository(get()) }
    single<TemplateRepository> { TemplateRepository(get()) }
}

// Separate module for services
fun createServiceModule(application: Application) = module {
    single<GraphQLAuthenticationHandler> { GraphQLAuthenticationHandler() }

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

    single< TemplateCategoryService>{
        TemplateCategoryService(
            templateCategoryRepository = get(),
        )
    }

    single<TemplateService> {
        TemplateService(
            templateRepository = get(),
            templateCategoryRepository = get()
        )
    }
}
