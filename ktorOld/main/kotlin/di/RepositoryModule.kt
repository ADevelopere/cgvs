package di

import config.DatabaseConfig
import org.jetbrains.exposed.v1.jdbc.Database
import org.koin.dsl.module
import repositories.SessionRepository
import repositories.StorageRepository
import repositories.StudentRepository
import repositories.TemplateCategoryRepository
import repositories.TemplateRecipientGroupItemRepository
import repositories.TemplateRecipientGroupRepository
import repositories.TemplateRepository
import repositories.TemplateVariableRepository
import repositories.UserRepository
import repositories.impl.StorageRepositoryImpl

val repositoryModule = module {
    single<Database> { Database.connect(DatabaseConfig.dataSource) }
    single<UserRepository> { UserRepository(get()) }
    single<SessionRepository> { SessionRepository(get()) }
    single<TemplateCategoryRepository> { TemplateCategoryRepository(get()) }
    single<TemplateRepository> { TemplateRepository(get()) }
    single<StudentRepository> { StudentRepository(get()) }
    single<TemplateVariableRepository> { TemplateVariableRepository(get()) }
    single<StorageRepository> { StorageRepositoryImpl(get()) }

    single<TemplateRecipientGroupRepository> { TemplateRecipientGroupRepository(get()) }
    single<TemplateRecipientGroupItemRepository> { TemplateRecipientGroupItemRepository(get()) }
}
