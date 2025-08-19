package repositories

import io.ktor.server.config.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import schema.model.TemplateConfig
import schema.model.TemplateConfigKey
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction
import tables.TemplateConfigs

class TemplateConfigRepository(private val database: Database, private val applicationConfig: ApplicationConfig) {
    suspend fun templateConfig(): TemplateConfig = dbQuery {
        val rows = TemplateConfigs.selectAll()
        var maxBackgroundSize = applicationConfig.property("filesystem.upload_limit").getString().toInt()
        val allowedFileTypes = applicationConfig.property("filesystem.allowed_extensions").getList().toMutableList()

        rows.forEach { row ->
            when (TemplateConfigKey.valueOf(row[TemplateConfigs.key].toString())) {
                TemplateConfigKey.MAX_BACKGROUND_SIZE -> {
                    maxBackgroundSize = row[TemplateConfigs.value].toInt()
                }
                TemplateConfigKey.ALLOWED_FILE_TYPES -> {
                    allowedFileTypes.add(row[TemplateConfigs.value])
                }
            }
        }

        TemplateConfig(maxBackgroundSize, allowedFileTypes)
    }

    private suspend fun <T> dbQuery(block: () -> T): T =
        withContext(Dispatchers.IO) {
            transaction(database) {
                block()
            }
        }
}
