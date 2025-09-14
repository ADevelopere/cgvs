package services

import repositories.TemplateRecipientGroupRepository
import repositories.TemplateRepository
import schema.model.CreateRecipientGroupInput
import schema.model.TemplateRecipientGroup
import schema.model.UpdateRecipientGroupInput

class TemplateRecipientGroupService(
    private val repository: TemplateRecipientGroupRepository,
    private val templateRepository: TemplateRepository
) {
    suspend fun create(input: CreateRecipientGroupInput): TemplateRecipientGroup {
        // validate name
        check(input.name.length in 3..255) {
            "Group name must be between 3 and 255 characters long."
        }

        // Validate template exists
        check(templateRepository.existsById(input.templateId)) {
            "Template with ID ${input.templateId} does not exist."
        }

        return repository.create(input)
    }

    suspend fun findAllByTemplateId(templateId: Int): List<TemplateRecipientGroup> =
        repository.findAllByTemplateId(templateId)

    suspend fun findById(id: Int): TemplateRecipientGroup? = repository.findById(id)

    suspend fun findByIds(ids: List<Int>): List<TemplateRecipientGroup> = repository.findByIds(ids)

    suspend fun update(input: UpdateRecipientGroupInput): TemplateRecipientGroup? {
        // validate name
        check(input.name.length in 3..255) {
            "Group name must be between 3 and 255 characters long."
        }

        check(repository.existsById(input.id)) {
            "Group with ID ${input.id} does not exist."
        }


        return repository.update(input)
    }

    suspend fun deleteById(id: Int): TemplateRecipientGroup? {
        val group = repository.findById(id) ?: throw IllegalArgumentException("Group with ID $id does not exist.")
        return if (repository.deleteById(id)) group else null
    }
}
