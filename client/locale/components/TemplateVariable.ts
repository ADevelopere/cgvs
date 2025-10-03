export type TemplateVariableTranslation = {
    name: string;
    description: string;
    minimumLength: string;
    maximumLength: string;
    pattern: string;
    patternHelperText: string;
    previewValue: string;
    required: string;
    updateVariable: string;
    options: string;
    addOptionPlaceholder: string;
    allowMultipleSelection: string;
    minimumValue: string;
    maximumValue: string;
    decimalPlaces: string;
    format: string;
    formatHelperText: string;
    invalidDateRangeError: string;
    minimumDate: string;
    maximumDate: string;
    invalidDateError: string;

    noVariables: string;

    // Delete variable
    deleteVariable: string;
    delete: string;
    cancel: string;
    confirm: string;
    confirmDelete: string;

    // create variable
    createVariable: string;
    textVariable: string;
    numberVariable: string;
    dateVariable: string;
    selectVariable: string;

    // type labels
    textTypeLabel: string;
    numberTypeLabel: string;
    dateTypeLabel: string;
    selectTypeLabel: string;

    // edit/create modal
    editVariable: string;
};
