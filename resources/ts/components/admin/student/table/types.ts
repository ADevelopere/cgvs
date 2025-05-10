import type { CountryCode, Student } from "@/graphql/generated/types";

export type StudentTableColumnType = {
    id: keyof Student;
    label: string;
    sortable: boolean;
    filterable: boolean;
    editable: boolean;
    initialWidth: number;
    widthStorageKey?: string;
};

export const StudentTableColumns: StudentTableColumnType[] = [
    {
        id: "name",
        label: "Name",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 20,
        widthStorageKey: "student_table_student_name_column_width",
    },
    {
        id: "email",
        label: "Email",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 20,
        widthStorageKey: "student_table_student_email_column_width",
    },
    {
        id: "date_of_birth",
        label: "Date of Birth",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 20,
        widthStorageKey: "student_table_student_date_of_birth_column_width",
    },
    {
        id: "gender",
        label: "Gender",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 20,
        widthStorageKey: "student_table_student_gender_column_width",
    },
    {
        id: "nationality",
        label: "Nationality",
        sortable: true,
        filterable: true,
        editable: true,
        initialWidth: 20,
        widthStorageKey: "student_table_student_nationality_column_width",
    },
    {
        id: "phone_number",
        label: "Phone Number",
        sortable: false,
        filterable: true,
        editable: true,
        initialWidth: 20,
        widthStorageKey: "student_table_student_phone_number_column_width",
    },
    {
        id: "created_at",
        label: "Created At",
        sortable: true,
        filterable: true,
        editable: false,
        initialWidth: 20,
        widthStorageKey: "student_table_student_created_at_column_width",
    },
    {
        id: "updated_at",
        label: "Updated At",
        sortable: true,
        filterable: true,
        editable: false,
        initialWidth: 20,
        widthStorageKey: "student_table_student_updated_at_column_width",
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

export type CellProps = {
    value: any;
    onEdit: (value: string) => void;
    onSave: () => void;
    isEditing: boolean;
    editable?: boolean;
};
