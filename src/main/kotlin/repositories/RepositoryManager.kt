package repositories

import org.jetbrains.exposed.v1.jdbc.Database
import repositories.impl.StorageRepositoryImpl

/**
 * Repository manager that provides access to all repositories
 * This follows the repository pattern and provides a single point of access
 */
class RepositoryManager(private val database: Database) {

    // Core repositories
    val userRepository: UserRepository by lazy { UserRepository(database) }
    val sessionRepository: SessionRepository by lazy { SessionRepository(database) }
    val passwordResetTokenRepository: PasswordResetTokenRepository by lazy { PasswordResetTokenRepository(database) }

    // Student management
    val studentRepository: StudentRepository by lazy { StudentRepository(database) }
    val certificateRepository: CertificateRepository by lazy { CertificateRepository(database) }

    // Template management
    val templateRepository: TemplateRepository by lazy { TemplateRepository(database) }
    val templateCategoryRepository: TemplateCategoryRepository by lazy { TemplateCategoryRepository(database) }
    val templateVariableRepository: TemplateVariableRepository by lazy { TemplateVariableRepository(database) }
//    val templateElementRepository: TemplateElementRepository by lazy { TemplateElementRepository(database) }

    // Recipient management
    val templateRecipientGroupRepository: TemplateRecipientGroupRepository by lazy { TemplateRecipientGroupRepository(database) }
    val templateRecipientGroupItemRepository: TemplateRecipientGroupItemRepository by lazy { TemplateRecipientGroupItemRepository(database) }
    val recipientGroupItemVariableValueRepository: RecipientGroupItemVariableValueRepository by lazy { RecipientGroupItemVariableValueRepository(database) }


    val storageRepository : StorageRepository by lazy { StorageRepositoryImpl(database) }

    companion object {
        @Volatile
        private var INSTANCE: RepositoryManager? = null

        fun getInstance(database: Database): RepositoryManager {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: RepositoryManager(database).also { INSTANCE = it }
            }
        }
    }
}
