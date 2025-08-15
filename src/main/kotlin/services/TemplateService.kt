package services

import models.CreateTemplateInput
import models.ReorderTemplateInput
import models.Template
import repositories.TemplateCategoryRepository
import repositories.TemplateRepository
import tables.CategorySpecialType

class TemplateService(
    private val templateRepository: TemplateRepository,
    private val templateCategoryRepository: TemplateCategoryRepository
) {
    suspend fun createTemplate(input: CreateTemplateInput): Template {

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

        val order = templateRepository.findMaxOrderByCategoryId(categoryId) + 1

        val template = templateRepository.create(
            Template(
                name = input.name,
                description = input.description,
                categoryId = categoryId,
                order = order,
            )
        )

        return template
    }

    suspend fun updateTemplate(input: models.UpdateTemplateInput): Template? {
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

    suspend fun reorderTemplate(input: ReorderTemplateInput): Template? {
        // Validate template exists
        val existingTemplate = templateRepository.findById(input.id)
            ?: throw IllegalArgumentException("Template with ID ${input.id} does not exist.")

        // Validate order is non-negative
        check(input.order >= 0) {
            "Order must be a non-negative integer."
        }

        return templateRepository.update(
            input.id,
            existingTemplate.copy(order = input.order)
        )
    }

    suspend fun deleteTemplate(id: Int): Template? {
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

    suspend fun suspendTemplate(id: Int): Template? {
        // Validate template exists
        val existingTemplate = templateRepository.findById(id)
            ?: throw IllegalArgumentException("Template with ID $id does not exist.")

        val suspensionCategory = templateCategoryRepository.suspensionCategory()
            ?: throw IllegalArgumentException("Suspension category does not exist.")

        val suspendedTemplate = existingTemplate.copy(
            categoryId = suspensionCategory.id,
            preSuspensionCategoryId = existingTemplate.categoryId
        )

        return templateRepository.update(id, suspendedTemplate)
    }

    suspend fun unsuspendTemplate(id: Int): Template? {
        // Validate template exists
        val existingTemplate = templateRepository.findById(id)
            ?: throw IllegalArgumentException("Template with ID $id does not exist.")

        val suspensionCategory = templateCategoryRepository.suspensionCategory()
            ?: throw IllegalArgumentException("Suspension category does not exist.")

        val mainCategory = templateCategoryRepository.mainCategory()
            ?: throw IllegalArgumentException("Main category does not exist.")

        // Validate it is suspended
        check(existingTemplate.preSuspensionCategoryId != null) {
            throw IllegalArgumentException("Template with ID $id is not suspended.")
        }

        check(existingTemplate.categoryId == suspensionCategory.id) {
            throw IllegalArgumentException("Template with ID $id is not in the suspension category.")
        }

        val restoredTemplate = templateCategoryRepository.findById(existingTemplate.preSuspensionCategoryId)
            ?.let { preSuspensionCategory ->
                existingTemplate.copy(
                    categoryId = preSuspensionCategory.id,
                    preSuspensionCategoryId = null
                )
            } ?: existingTemplate.copy(
            categoryId = mainCategory.id,
            preSuspensionCategoryId = null
        )

        return templateRepository.update(id, restoredTemplate)
    }

    suspend fun findByIds(ids: List<Int>): List<Template> {
        return templateRepository.findByIds(ids)
    }
}
