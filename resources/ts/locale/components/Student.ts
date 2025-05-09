type StudentTranslations = {
    [key: string]: string;

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
};

export default StudentTranslations;
