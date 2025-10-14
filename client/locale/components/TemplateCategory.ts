export type TemplateCategoryTranslation = {
    templateCategoriesManagement: string;
    theDeleted: string;
    toggleCategoriesPane: string;
    toggleTemplatesPane: string;

    // General terms
    categories: string;
    templates: string;
    name: string;
    addCategory: string;
    addTemplate: string;
    sort: string;
    actions: string;
    image: string;
    createdAt: string;
    deletedAt: string;
    restoreTemplate: string;

    // Empty states
    noCategories: string;
    noTemplates: string;
    noDeletedTemplates: string;

    // Form and button actions
    selectCategory: string;
    selectParentCategory: string;
    createChildCategory: string;
    addNewCategory: string;
    addNewTemplate: string;
    edit: string;
    move: string;
    delete: string;
    more: string;
    manage: string;
    manageButton: string;
    manageTemplateButtonTitle: string;

    // Sorting options
    nameAsc: string;
    nameDesc: string;
    idAsc: string;
    idDesc: string;

    // Action buttons
    cancel: string;
    add: string;
    save: string;
    saving: string;
    retry: string;
    refresh: string;
    filter: string;

    // Success messages
    categoryAddedSuccessfully: string;
    categoryHiddenSuccessfully: string;
    categoryVisibleSuccessfully: string;
    categoryUpdatedSuccessfully: string;
    categoryDeletedSuccessfully: string;
    templateAddedSuccessfully: string;
    templateHiddenSuccessfully: string;
    templateVisibleSuccessfully: string;
    templateUpdatedSuccessfully: string;
    templateDeletedSuccessfully: string;
    templateRestoredSuccessfully: string;

    // Error messages
    categoryAddFailed: string;
    errorLoadingCategories: string;
    noDataReturned: string;
    categoryUpdateFailed: string;
    categoryDeleteFailed: string;
    templateAddFailed: string;
    templateUpdateFailed: string;
    templateDeleteFailed: string;
    templateRestoreFailed: string;
    errorRestoringTemplate: string;
    categoryNameRequired: string;

    // Validation messages
    nameTooShort: string;
    nameTooLong: string;

    // Category selection and switching
    selectCategoryFirst: string;
    createCategoryFirst: string;
    confirmSwitchCategory: string;
    switchCategoryWhileAddingTemplate: string;
    confirm: string;

    // Error messages from context
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
    errorDeletingCategory: string;
    movingTemplateToDeletion: string;
    errorMovingToDeletion: string;
    errorUpdatingTemplate: string;

    // Template movement messages
    templateMoveToDeletionFailed: string;
    templateMovedToDeletionSuccessfully: string;

    // Context error messages
    useCategoryContextError: string;

    // Template generation and processing messages
    failedToProcessFile: string;
    noTemplateDataReceived: string;
    generatedTemplateEmpty: string;
    noTemplateVariablesDefined: string;
    serverReturnedStatus: string;
    receivedEmptyTemplate: string;
    failedToGenerateContent: string;
    templateIdRequired: string;
    templateNotFound: string;

    // Category editing
    description: string;
    parentCategory: string;

    // Template list search and empty states
    searchTemplatesPlaceholder: string;
    noTemplatesFoundSearch: string;
    noTemplatesFoundCreate: string;

    // List view column headers
    columnBackground: string;
    columnName: string;
    columnDescription: string;
    columnCreated: string;
    columnActions: string;
    createdLabel: string;

    // List view actions
    buttonManage: string;

    // Template management tabs
    tabBasicInfo: string;
    tabVariables: string;
    tabRecipients: string;
    tabEditor: string;
    tabPreview: string;

    // basic info tab
    recommendedImageSize: string;
    uploadImage: string;

    // Pagination
    showing: string;
    of: string;
    perPage: string;
};
