type StudentTranslations = {
    [key: string]: string;

    studentManagement: string;

    // header columns, same as column id values
    name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    gender: string;
    nationality: string;
    created_at: string;
    updated_at: string;

    // actions and buttons
    actions: string;
    cancel: string;
    delete: string;

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
};

export default StudentTranslations;
