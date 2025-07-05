package di

import config.DatabaseConfig
import org.jetbrains.exposed.v1.jdbc.Database
import org.koin.dsl.module
import repositories.UserRepository

val repositoryModule = module {
    single<Database> { Database.connect(DatabaseConfig.dataSource) }
    single<UserRepository> { UserRepository(get()) }
}
