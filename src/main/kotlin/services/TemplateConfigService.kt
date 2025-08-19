package services

import schema.model.TemplateConfig
import repositories.TemplateConfigRepository

class TemplateConfigService(private val repository: TemplateConfigRepository) {
    suspend fun templateConfig(): TemplateConfig? {
        return repository.templateConfig()
    }
}
