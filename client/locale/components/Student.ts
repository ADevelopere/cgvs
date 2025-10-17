export type StudentTranslations = {
    [key: string]: string;

    studentManagement: string;

    // header columns, same as column id values
    name: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    createdAt: string;
    updatedAt: string;

    // actions and buttons
    actions: string;
    cancel: string;
    delete: string;
    confirm: string;
    create: string;

    sortAsc: string;
    sortDesc: string;
    clearSort: string;

    filter: string;
    clearFilter: string;
    filterBy: string;
    contains: string;

    // validation messages
    nameRequired: string;
    fullNameMinWords: string;
    nameMinLength: string;
    nameInvalidChars: string;
    emailRequired: string;
    emailInvalid: string;
    genderRequired: string;
    genderInvalid: string;
    nationalityRequired: string;
    nationalityInvalid: string;
    dateOfBirthRequired: string;
    dateOfBirthInvalid: string;
    dateOfBirthFuture: string;
    phoneNumberRequired: string;
    phoneNumberInvalid: string;

    // UI placeholders and messages
    namePlaceholder: string;
    emailPlaceholder: string;
    genderPlaceholder: string;
    nationalityPlaceholder: string;
    fillRequiredFields: string;
    createStudentShortcut: string;
    creating: string;
    studentCreatedSuccess: string;
    studentCreateError: string;
    studentUpdatedSuccess: string;
    studentUpdateError: string;
    studentDeletedSuccess: string;
    studentDeleteError: string;
};
