type TemplateCategoryTranslation = {
    templateCategoriesManagement: string;
    toggleCategoriesPane: string;
    toggleTemplatesPane: string;

    categories: string;
    templates: string;
    name: string;
    addCategory: string;
    addTemplate: string;
    sort: string;
    noCategories: string;
    noTemplates: string;
    selectCategory: string;
    addNewCategory: string;
    addNewTemplate: string;
    edit: string;
    move: string;
    delete: string;
    more: string;
    nameAsc: string;
    nameDesc: string;
    idAsc: string;
    idDesc: string;
    cancel: string;
    add: string;
    save: string;
    retry: string;
    refresh: string;
    categoryAddedSuccessfully: string;
    categoryAddFailed: string;
    errorLoadingCategories: string;
    noDataReturned: string;
    categoryHiddenSuccessfully: string;
    categoryVisibleSuccessfully: string;
    categoryUpdatedSuccessfully: string;
    categoryUpdateFailed: string;
    categoryDeletedSuccessfully: string;
    categoryDeleteFailed: string;

    selectCategoryFirst: string;
    createCategoryFirst: string;
    confirmSwitchCategory: string;
    switchCategoryWhileAddingTemplate: string;
    confirm: string;

    templateAddedSuccessfully: string;
    templateAddFailed: string;
    templateHiddenSuccessfully: string;
    templateVisibleSuccessfully: string;
    templateUpdatedSuccessfully: string;
    templateUpdateFailed: string;
    templateDeletedSuccessfully: string;
    templateDeleteFailed: string;

    nameTooShort: string;
    nameTooLong: string;

    // Error messages from TemplateCategoryManagementContext
    invalidDataFormat: string;
    categoryNotFound: string;
    invalidCategoryId: string;
    failedToDeleteCategory: string;

    // Logging messages
    fetchingCategories: string;
    rawApiResponse: string;
    responseDataType: string;
    responseData: string;
    expectedArrayButReceived: string;
    failedToCreateCategory: string;
    failedToUpdateCategory: string;
    invalidCategoryIdProvided: string;
    attemptingToDeleteCategory: string;
};

export default TemplateCategoryTranslation;
