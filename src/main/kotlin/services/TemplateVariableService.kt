package services

import repositories.TemplateRepository
import repositories.TemplateVariableRepository
import schema.model.CreateDateTemplateVariableInput
import schema.model.CreateNumberTemplateVariableInput
import schema.model.CreateSelectTemplateVariableInput
import schema.model.CreateTextTemplateVariableInput
import schema.model.DateTemplateVariable
import schema.model.NumberTemplateVariable
import schema.model.SelectTemplateVariable
import schema.model.CreateTemplateVariableInput
import schema.model.TemplateVariable
import schema.model.TemplateVariableType
import schema.model.TextTemplateVariable
import schema.model.UpdateDateTemplateVariableInput
import schema.model.UpdateNumberTemplateVariableInput
import schema.model.UpdateSelectTemplateVariableInput
import schema.model.UpdateTemplateVariableInput
import schema.model.UpdateTextTemplateVariableInput

class TemplateVariableService(
    private val repository: TemplateVariableRepository,
    private val templateRepository: TemplateRepository
) {
    suspend fun createTextTemplateVariable(input: CreateTextTemplateVariableInput): TextTemplateVariable {
        checkCreateInput(input)

        val order = repository.findMaxOrderByTemplateId(input.templateId) + 1
        return repository.createTextTemplateVariable(
            TextTemplateVariable(
                templateId = input.templateId,
                name = input.name,
                description = input.description,
                textPreviewValue = input.previewValue,
                required = input.required,
                order = order,
                minLength = input.minLength,
                maxLength = input.maxLength,
                pattern = input.pattern
            )
        )
    }

    suspend fun createNumberTemplateVariable(input: CreateNumberTemplateVariableInput): NumberTemplateVariable {
        checkCreateInput(input)

        val order = repository.findMaxOrderByTemplateId(input.templateId) + 1

        return repository.createNumberTemplateVariable(
            NumberTemplateVariable(
                templateId = input.templateId,
                name = input.name,
                description = input.description,
                required = input.required,
                order = order,
                numberPreviewValue = input.previewValue,
                minValue = input.minValue,
                maxValue = input.maxValue,
                decimalPlaces = input.decimalPlaces
            )
        )
    }

    suspend fun createDateTemplateVariable(input: CreateDateTemplateVariableInput): DateTemplateVariable {
        checkCreateInput(input)

        val order = repository.findMaxOrderByTemplateId(input.templateId) + 1

        return repository.createDateTemplateVariable(
            DateTemplateVariable(
                templateId = input.templateId,
                name = input.name,
                description = input.description,
                required = input.required,
                order = order,
                datePreviewValue = input.previewValue,
                minDate = input.minDate,
                maxDate = input.maxDate,
                format = input.format
            )
        )
    }

    suspend fun createSelectTemplateVariable(input: CreateSelectTemplateVariableInput): SelectTemplateVariable {
        checkCreateInput(input)

        val order = repository.findMaxOrderByTemplateId(input.templateId) + 1

        return repository.createSelectTemplateVariable(
            SelectTemplateVariable(
                templateId = input.templateId,
                name = input.name,
                description = input.description,
                required = input.required,
                order = order,
                selectPreviewValue = input.previewValue,
                options = input.options,
                multiple = input.multiple
            )
        )
    }

    suspend fun updateTextTemplateVariable(input: UpdateTextTemplateVariableInput): TextTemplateVariable {
        val existingVariable = checkUpdateInput(input, TemplateVariableType.TEXT)

        return repository.updateTextTemplateVariable(existingVariable as TextTemplateVariable)
            ?: throw IllegalArgumentException("Failed to update text template variable with ID ${input.id}.")
    }

    suspend fun updateNumberTemplateVariable(variable: UpdateNumberTemplateVariableInput): NumberTemplateVariable {
        val existingVariable = checkUpdateInput(variable, TemplateVariableType.NUMBER)

        return repository.updateNumberTemplateVariable(existingVariable as NumberTemplateVariable)
            ?: throw IllegalArgumentException("Failed to update number template variable with ID ${variable.id}.")
    }

    suspend fun updateDateTemplateVariable(input: UpdateDateTemplateVariableInput): DateTemplateVariable {
        val existingVariable = checkUpdateInput(input, TemplateVariableType.DATE)

        return repository.updateDateTemplateVariable(existingVariable as DateTemplateVariable)
            ?: throw IllegalArgumentException("Failed to update date template variable with ID ${input.id}.")
    }

    suspend fun updateSelectTemplateVariable(input: UpdateSelectTemplateVariableInput): SelectTemplateVariable {
        val existingVariable = checkUpdateInput(input, TemplateVariableType.SELECT)

        return repository.updateSelectTemplateVariable(existingVariable as SelectTemplateVariable)
            ?: throw IllegalArgumentException("Failed to update select template variable with ID ${input.id}.")
    }

    suspend fun deleteTemplateVariable(id: Int): TemplateVariable {
        val variable = repository.findTemplateVariableById(id)
            ?: throw IllegalArgumentException("Template variable with ID $id does not exist.")
        require(repository.deleteTemplateVariable(id)) { "Failed to delete template variable with ID $id." }
        return variable
    }

    suspend fun findByTemplateId(templateId: Int): List<TemplateVariable> {
        return repository.findTemplateVariablesByTemplateId(templateId)
    }


    private suspend fun checkCreateInput(input: CreateTemplateVariableInput) {
        check(templateRepository.existsById(input.templateId)) {
            "Template with ID ${input.templateId} does not exist."
        }

        check(input.name.length in 3..255) {
            "Template variable name must be between 3 and 255 characters long."
        }
    }

    private suspend fun checkUpdateInput(
        input: UpdateTemplateVariableInput,
        type: TemplateVariableType
    ): TemplateVariable {
        val existingVariable = repository.findTemplateVariableById(input.id)
            ?: throw IllegalArgumentException("Template variable with ID ${input.id} does not exist.")

        check(existingVariable.type == type) {
            "Template variable type mismatch. Expected ${type.name}, but found ${existingVariable.type.name}."
        }

        check(input.name.length in 3..255) {
            "Template variable name must be between 3 and 255 characters long."
        }
        return existingVariable
    }
}
