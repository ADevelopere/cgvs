package di

import context.GraphQLAuthenticationHandler
import io.ktor.server.application.Application
import org.koin.dsl.module
import repositories.TemplateConfigRepository
import services.AuthService

fun applicationDependantModule(application: Application) = module {
    val config = application.environment.config

    single<GraphQLAuthenticationHandler> { GraphQLAuthenticationHandler() }

    single<TemplateConfigRepository> { TemplateConfigRepository(get(), config) }

    single<AuthService> {
        AuthService(
            userRepository = get(),
            sessionRepository = get(),
            applicationConfig = config
        )
    }
}
