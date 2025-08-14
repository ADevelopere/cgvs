package services

import models.CreateTemplateInput
import models.Template
import repositories.TemplateCategoryRepository
import repositories.TemplateRepository
import tables.CategorySpecialType
import java.lang.IllegalArgumentException

class TemplateService(
    private val templateRepository: TemplateRepository,
    private val templateCategoryRepository: TemplateCategoryRepository
) {


   suspend fun createTemplate(input: CreateTemplateInput): Template{

        // validate name
       check(input.name.length in 3..255) {
            "Template name must be between 3 and 255 characters long."
        }

       val categoryId = input.categoryId

        // Validate category exists
        val category = templateCategoryRepository.findById(categoryId)
            ?: throw IllegalArgumentException("Category with ID ${input.categoryId} does not exist.")

       // Validate not deletion category
       check (category.categorySpecialType != CategorySpecialType.deletion){
           "Cannot create template in a deletion category."
        }

       val template =  templateRepository.create(Template(
           name = input.name,
           description = input.description,
           categoryId = categoryId
       ))

         return template
    }

    suspend fun findByIds(ids: List<Int>): List<Template> {
        return templateRepository.findByIds(ids)
    }
}
