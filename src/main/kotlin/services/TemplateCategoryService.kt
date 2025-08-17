package services

import schema.type.CreateTemplateCategoryInput
import schema.type.TemplateCategory
import schema.type.UpdateTemplateCategoryInput
import repositories.TemplateCategoryRepository
import tables.CategorySpecialType
import java.lang.IllegalArgumentException

class TemplateCategoryService(
    private val repository: TemplateCategoryRepository
) {
    suspend fun create(
        input: CreateTemplateCategoryInput
    ): TemplateCategory {
        // Validate name length
        check(input.name.length in 3..255) {
            "Category name must be between 3 and 255 characters long."
        }

        val newOrder: Int

        // Validate parent category ID if provided
        if (input.parentCategoryId != null) {
            val parentCategoryId = input.parentCategoryId
            check(parentCategoryId > 0) {
                "Parent category ID must be a positive integer."
            }

            // Check if the parent category exists
            val existingParentCategory = repository.findById(parentCategoryId)
                ?: throw IllegalArgumentException("Parent category with ID ${input.parentCategoryId} does not exist.")

            // Validate not suspension category
            check(existingParentCategory.categorySpecialType != CategorySpecialType.Suspension) {
                "Cannot create a category under a suspension category."
            }

            // find the new category order
            // by getting the max order of the parent category
            newOrder = repository.findMaxOrderByParentCategoryId(parentCategoryId) + 1
        } else {
            newOrder = repository.findMaxOrderByParentCategoryId(null) + 1
        }

        val category = repository.create(
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
        return repository.findById(id)
    }

    suspend fun findByIds(ids: List<Int>): List<TemplateCategory> {
        return repository.findByIds(ids)
    }

    suspend fun findByParentId(parentId: Int): List<TemplateCategory> {
        return repository.findByParentId(parentId)
    }

    suspend fun findAll(): List<TemplateCategory> {
        return repository.findAll()
    }

    suspend fun mainTemplateCategory(): TemplateCategory? {
        return repository.mainCategory()
    }

    suspend fun suspensionTemplateCategory(): TemplateCategory? {
        return repository.suspensionCategory()
    }

    suspend fun update(input: UpdateTemplateCategoryInput): TemplateCategory {
        val existingCategory = repository.findById(input.id)
            ?: throw IllegalArgumentException("Template category with ID ${input.id} does not exist.")

        // Validate name length
        check(input.name.length in 3..255) {
            "Category name must be between 3 and 255 characters long."
        }

        val newParentCategoryId = input.parentCategoryId
        check(newParentCategoryId == null || newParentCategoryId > 0) {
            "Parent category ID must be a positive integer or null."
        }


        // Validate parent category ID if provided
        if (newParentCategoryId != null &&
            newParentCategoryId != existingCategory.parentCategoryId
        ) {
            // Check if the parent category exists
            val existingParentCategory = repository.findById(newParentCategoryId)
                ?: throw IllegalArgumentException("Parent category with ID $newParentCategoryId does not exist.")

            // Validate not suspension category
            check(existingParentCategory.categorySpecialType != CategorySpecialType.Suspension) {
                "Cannot create a category under a suspension category."
            }

            // check if the parent category is not the same as the current category
            check(existingCategory.id != newParentCategoryId) {
                "Cannot set the parent category to itself."
            }

        }
        return repository.update(
            id = input.id,
            category = existingCategory.copy(
                name = input.name,
                description = input.description,
                parentCategoryId = newParentCategoryId
            )
        ) ?: throw IllegalArgumentException("Failed to update template category with ID ${input.id}.")
    }

    suspend fun delete(id: Int): TemplateCategory {
        val existingCategory = repository.findById(id)
            ?: throw IllegalArgumentException("Template category with ID $id does not exist.")

        // Check if the category is a suspension category
        check(existingCategory.categorySpecialType != CategorySpecialType.Suspension) {
            "Cannot delete a suspension category."
        }

        // Check if the category has child categories
        val childCategories = repository.findByParentId(id)
        check(childCategories.isEmpty()) {
            "Cannot delete a category that has child categories."
        }

        repository.delete(id)
            ?: throw IllegalArgumentException("Failed to delete template category with ID $id.")
        return existingCategory
    }

}
