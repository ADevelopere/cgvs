package config

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.config.ApplicationConfig
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.SchemaUtils
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import tables.*

object DatabaseConfig {
    lateinit var dataSource: HikariDataSource
        private set

    fun init(config: ApplicationConfig) {
        val hikariConfig = HikariConfig().apply {
            jdbcUrl = config.property("postgres.url").getString()
            username = config.property("postgres.user").getString()
            password = config.property("postgres.password").getString()
            driverClassName = "org.postgresql.Driver"
            maximumPoolSize = 10
            minimumIdle = 5
            idleTimeout = 300000
            connectionTimeout = 30000
            leakDetectionThreshold = 60000
            poolName = "CGSV-HikariCP"
        }

        dataSource = HikariDataSource(hikariConfig)
        Database.connect(dataSource)

        // Create tables if they don't exist
        createTables()
    }

    private fun createTables() {
        transaction {
            SchemaUtils.create(
                Users,
                PasswordResetTokens,
                Sessions,
                TemplateCategories,
                // Create storage tables first (they are referenced by templates)
                StorageDirectories,
                StorageFiles,
                FileUsages,
                Templates,
                TemplateConfigs,
                Students,
                TemplateElements,
                TemplateStaticTextElements,
                TemplateDataTextElements,
                TemplateDataDateElements,
                TemplateImageElements,
                TemplateQrCodeElements,
                TemplateVariableBase,
                TextTemplateVariables,
                NumberTemplateVariables,
                DateTemplateVariables,
                SelectTemplateVariables,
                TemplateRecipientGroups,
                TemplateRecipientGroupItems,
                RecipientGroupItemVariableValues,
                Certificates
            )
        }
    }

    fun close() {
        if (::dataSource.isInitialized) {
            dataSource.close()
        }
    }
}
