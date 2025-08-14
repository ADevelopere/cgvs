package services

import models.CreateTemplateCategoryInput
import models.TemplateCategory
import repositories.TemplateCategoryRepository
import tables.CategorySpecialType
import java.lang.IllegalArgumentException

class TemplateCategoryService(
    private val templateCategoryRepository: TemplateCategoryRepository
) {
    suspend fun createTemplateCategory(
        input: CreateTemplateCategoryInput
    ): TemplateCategory {
        // Validate name length
        check(input.name.length in 3..255) {
            "Category name must be between 3 and 255 characters long."
        }

        val newOrder: Int

        // Validate parent category ID if provided
        if (input.parentCategoryId != null ) {
            val parentCategoryId = input.parentCategoryId
            check (parentCategoryId > 0) {
                "Parent category ID must be a positive integer."
            }

            // Check if the parent category exists
            val existingParentCategory = templateCategoryRepository.findById(parentCategoryId)
                ?: throw IllegalArgumentException("Parent category with ID ${input.parentCategoryId} does not exist.")

            // Validate not deletion category
            check (existingParentCategory.categorySpecialType != CategorySpecialType.deletion) {
                "Cannot create a category under a deletion category."
            }

            // find the new category order
            // by getting the max order of the parent category
            newOrder = templateCategoryRepository.findMaxOrderByParentCategoryId(parentCategoryId) + 1
        } else {
            newOrder = templateCategoryRepository.findMaxOrderByParentCategoryId(null) + 1
        }

        val category = templateCategoryRepository.create(
            TemplateCategory(
                name = input.name,
                description = input.description,
                parentCategoryId = input.parentCategoryId,
                order = newOrder,
            )
        )

        return category
    }

    suspend fun findById(id: Int): TemplateCategory? {
        return templateCategoryRepository.findById(id)
    }

    suspend fun findByIds(ids: List<Int>): List<TemplateCategory> {
      return  templateCategoryRepository.findByIds(ids)
    }

    suspend fun findByParentId(parentId: Int): List<TemplateCategory> {
        return templateCategoryRepository.findByParentId(parentId)
    }
}
