package di

import org.koin.dsl.module
import services.StudentService
import services.TemplateCategoryService
import services.TemplateConfigService
import services.TemplateService
import services.TemplateVariableService
import services.FileInitializationService
import services.TemplateRecipientGroupItemService
import services.TemplateRecipientGroupService

val serviceModule = module {
    single<TemplateCategoryService> {
        TemplateCategoryService(
            repository = get(),
        )
    }

    single<TemplateService> {
        TemplateService(
            templateRepository = get(),
            templateCategoryRepository = get(),
            storageService = get(),
            storageDbService = get(),
        )
    }

    single<TemplateConfigService> {
        TemplateConfigService(
            repository = get()
        )
    }

    single<StudentService> {
        StudentService(
            repository = get()
        )
    }

    single<TemplateVariableService> {
        TemplateVariableService(
            repository = get(),
            templateRepository = get()
        )
    }

    single<FileInitializationService> {
        FileInitializationService(
            get(), get(), get(), get(),
        )
    }

    single<TemplateRecipientGroupService> {
        TemplateRecipientGroupService(get(), get())
    }

    single<TemplateRecipientGroupItemService> {
        TemplateRecipientGroupItemService(get(), get(), get())
    }
}
