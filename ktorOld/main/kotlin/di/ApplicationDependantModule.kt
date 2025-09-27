package di

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import context.GraphQLAuthenticationHandler
import io.ktor.server.application.Application
import org.koin.dsl.module
import repositories.TemplateConfigRepository
import services.AuthService

data class JwtConfig(
    val secret: String,
    val domain: String,
    val audience: String
)

fun applicationDependantModule(application: Application) = module {
    val config = application.environment.config

    single<GraphQLAuthenticationHandler> { GraphQLAuthenticationHandler() }

    single<TemplateConfigRepository> { TemplateConfigRepository(get(), config) }

    val jwtSecret = config.propertyOrNull("jwt.secret")?.getString() ?: "default-secret-key"
    val jwtDomain = config.propertyOrNull("jwt.domain")?.getString() ?: "your-domain.com"
    val jwtAudience = config.propertyOrNull("jwt.audience")?.getString() ?: "your-audience"

    val jwtConfig = JwtConfig(
        secret = jwtSecret,
        domain = jwtDomain,
        audience = jwtAudience
    )

    val algorithm = Algorithm.HMAC256(jwtSecret)
    val jwtVerifier = JWT.require(algorithm)
        .withAudience(jwtAudience)
        .withIssuer(jwtDomain)
        .build()

    val jwtBuilder = JWT.create()
        .withAudience(jwtAudience)
        .withIssuer(jwtDomain)

    single { jwtVerifier }
    single { jwtBuilder }

    single<AuthService> {
        AuthService(
            userRepository = get(),
            sessionRepository = get(),
            jwtConfig = jwtConfig,
            jwtBuilder = jwtBuilder
        )
    }
}
