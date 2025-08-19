package services

import schema.model.CreateTemplateInput
import schema.model.Template
import repositories.TemplateCategoryRepository
import repositories.TemplateRepository
import schema.model.UpdateTemplateInput
import schema.pagination.PaginationResult
import schema.pagination.PaginationUtils
import schema.model.PaginationArgs
import tables.CategorySpecialType

class TemplateService(
    private val templateRepository: TemplateRepository,
    private val templateCategoryRepository: TemplateCategoryRepository
) {
    /**
     * Find templates with pagination and return pagination info
     */
    suspend fun findPaginatedWithInfo(
        paginationArgs: PaginationArgs? = null,
    ): PaginationResult<Template> {
        return PaginationUtils.findPaginatedWithInfo(
            repository = templateRepository,
            paginationArgs
        )
    }

    suspend fun create(input: CreateTemplateInput): Template {

        // validate name
        check(input.name.length in 3..255) {
            "Template name must be between 3 and 255 characters long."
        }

        val categoryId = input.categoryId

        // Validate category exists
        val category = templateCategoryRepository.findById(categoryId)
            ?: throw IllegalArgumentException("Category with ID ${input.categoryId} does not exist.")

        // Validate not deletion category
        check(category.categorySpecialType != CategorySpecialType.Suspension) {
            "Cannot create template in a deletion category."
        }

        val template = templateRepository.create(
            Template(
                name = input.name,
                description = input.description,
                categoryId = categoryId,
            )
        )

        return template
    }

    suspend fun update(input: UpdateTemplateInput): Template? {
        // Validate template exists
        val existingTemplate = templateRepository.findById(input.id)
            ?: throw IllegalArgumentException("Template with ID ${input.id} does not exist.")

        // Validate name length
        check(input.name?.length in 3..255) {
            "Template name must be between 3 and 255 characters long."
        }


        val newCategoryId = input.categoryId
        val currentCategoryId = existingTemplate.categoryId
        if (currentCategoryId != newCategoryId) {
            // Validate category exists if provided
            val category = templateCategoryRepository.findById(newCategoryId)
                ?: throw IllegalArgumentException("Category with ID $newCategoryId does not exist.")

            // Validate not deletion category
            check(category.categorySpecialType != CategorySpecialType.Suspension) {
                "Cannot update template in a deletion category."
            }
        }


        return templateRepository.update(
            input.id,
            existingTemplate.copy(
                name = input.name ?: existingTemplate.name,
                description = input.description ?: existingTemplate.description,
                categoryId = newCategoryId
            )
        )
    }

    suspend fun delete(id: Int): Template? {
        // Validate template exists
        val existingTemplate = templateRepository.findById(id)
            ?: throw IllegalArgumentException("Template with ID $id does not exist.")

        // Delete the template
        val deleted = templateRepository.delete(id)
        return if (deleted) {
            existingTemplate
        } else {
            null
        }
    }

    suspend fun suspend(id: Int): Template? {
        // Validate template exists
        val existingTemplate = templateRepository.findById(id)
            ?: throw IllegalArgumentException("Template with ID $id does not exist.")

        val suspensionCategory = templateCategoryRepository.suspensionCategory()
            ?: throw IllegalArgumentException("Suspension category does not exist.")

        check(existingTemplate.categoryId != suspensionCategory.id) {
            "Template with ID $id is already suspended."
        }

        val suspendedTemplate = existingTemplate.copy(
            categoryId = suspensionCategory.id,
            preSuspensionCategoryId = existingTemplate.categoryId
        )

        return templateRepository.update(id, suspendedTemplate)
    }

    suspend fun unsuspend(id: Int): Template? {
        // Validate template exists
        val existingTemplate = templateRepository.findById(id)
            ?: throw IllegalArgumentException("Template with ID $id does not exist.")

        val suspensionCategory = templateCategoryRepository.suspensionCategory()
            ?: throw IllegalArgumentException("Suspension category does not exist.")

        val mainCategory = templateCategoryRepository.mainCategory()
            ?: throw IllegalArgumentException("Main category does not exist.")

        // Validate it is suspended
        check(existingTemplate.categoryId == suspensionCategory.id) {
            throw IllegalArgumentException("Template with ID $id is not suspended.")
        }

        check(existingTemplate.categoryId == suspensionCategory.id) {
            throw IllegalArgumentException("Template with ID $id is not in the suspension category.")
        }

        val preSuspensionCategory = existingTemplate.preSuspensionCategoryId?.let {
            templateCategoryRepository.findById(it)
        }

        val unsuspendTemplate = existingTemplate.copy(
            categoryId = preSuspensionCategory?.id ?: mainCategory.id,
            preSuspensionCategoryId = null
        )

        return templateRepository.update(id, unsuspendTemplate)
    }

    suspend fun findByIds(ids: List<Int>): List<Template> {
        return templateRepository.findByIds(ids)
    }

    suspend fun findById(id: Int): Template? {
        return templateRepository.findById(id)
    }

    suspend fun findAll(): List<Template> {
        return templateRepository.findAll()
    }

    suspend fun findByCategoryId(categoryId: Int): List<Template> {
        return templateRepository.findByCategoryId(categoryId)
    }
}
