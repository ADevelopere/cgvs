package di

import org.koin.dsl.module
import services.TemplateCategoryService
import services.TemplateService

val serviceModule = module {
    single<TemplateCategoryService> {
        TemplateCategoryService(
            templateCategoryRepository = get(),
        )
    }

    single<TemplateService> {
        TemplateService(
            templateRepository = get(),
            templateCategoryRepository = get()
        )
    }
}
