package di

import org.koin.dsl.module
import services.TemplateCategoryService
import services.TemplateConfigService
import services.TemplateService

val serviceModule = module {
    single<TemplateCategoryService> {
        TemplateCategoryService(
            repository = get(),
        )
    }

    single<TemplateService> {
        TemplateService(
            templateRepository = get(),
            templateCategoryRepository = get()
        )
    }

    single<TemplateConfigService> {
        TemplateConfigService(
            repository = get()
        )
    }
}
