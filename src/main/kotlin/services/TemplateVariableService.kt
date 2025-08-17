package services

import repositories.TemplateRepository
import repositories.TemplateVariableRepository
import schema.type.CreateTextTemplateVariableInput
import schema.type.TextTemplateVariable

class TemplateVariableService(
    private val repository: TemplateVariableRepository,
    private val templateRepository: TemplateRepository
) {
    suspend fun createTextTemplateVariable(input: CreateTextTemplateVariableInput): TextTemplateVariable {
        val exisitingTemplate = templateRepository.findById(input.templateId)
            ?: throw IllegalArgumentException("Template with ID ${input.templateId} does not exist.")

        check(input.name.length in 3..255) {
            "Template variable name must be between 3 and 255 characters long."
        }

        val maxOrder = repository.findMaxOrderByTemplateId(input.templateId)
    }
}
