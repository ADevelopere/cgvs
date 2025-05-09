import type { CountryCode, Student } from "@/graphql/generated/types";

export type StudentTableColumnType = {
    id: keyof Student;
    label: string;
    sortable: boolean;
    filterable: boolean;
    editable: boolean;
};

export const StudentTableColumns: StudentTableColumnType[] = [
    {
        id: "name",
        label: "Name",
        sortable: true,
        filterable: true,
        editable: true,
    },
    {
        id: "email",
        label: "Email",
        sortable: true,
        filterable: true,
        editable: true,
    },
    {
        id: "date_of_birth",
        label: "Date of Birth",
        sortable: true,
        filterable: true,
        editable: true,
    },
    {
        id: "gender",
        label: "Gender",
        sortable: true,
        filterable: true,
        editable: true,
    },
    {
        id: "nationality",
        label: "Nationality",
        sortable: true,
        filterable: true,
        editable: true,
    },
    {
        id: "phone_number",
        label: "Phone Number",
        sortable: true,
        filterable: true,
        editable: true,
    },
    {
        id: "created_at",
        label: "Created At",
        sortable: true,
        filterable: true,
        editable: false,
    },
    {
        id: "updated_at",
        label: "Updated At",
        sortable: true,
        filterable: true,
        editable: false,
    },
];

export const preferredCountries: CountryCode[] = [
    "SA",
    "PS",
    "YE",
    "SY",
    "EG",
    "KW",
    "QA",
    "OM",
    "BH",
    "LB",
    "JO",
    "IQ",
    "LY",
    "AE",
    "TN",
    "DZ",
    "MA",
    "SD",
    "MR",
    "SO",
    "ID",
    "KM",
    "DJ",
    "ER",
    "SS",
    "EH",
];
