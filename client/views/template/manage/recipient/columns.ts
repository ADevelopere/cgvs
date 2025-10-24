import { StudentsOrderByColumn } from "@/client/graphql/generated/gql/graphql";
import { BaseColumn } from "@/client/components/Table/types/column.type";

// Define columns for the table
export const recipientBaseColumns: BaseColumn[] = [
  {
    id: "name",
    label: "الاسم",
    type: "text",
    accessor: "name",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 200,
  },
  {
    id: "nationality",
    label: "الجنسية",
    type: "country",
    accessor: "nationality",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 150,
  },
  {
    id: "dateOfBirth",
    label: "تاريخ الميلاد",
    type: "date",
    accessor: "dateOfBirth",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 150,
  },
  {
    id: "gender",
    label: "الجنس",
    type: "select",
    accessor: "gender",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 100,
    options: [
      { label: "ذكر", value: "Male" },
      { label: "أنثى", value: "Female" },
    ],
  },
  {
    id: "email",
    label: "البريد الإلكتروني",
    type: "text",
    accessor: "email",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 200,
  },
  {
    id: "createdAt",
    label: "تاريخ الإضافة",
    type: "date",
    accessor: "createdAt",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 150,
  },
];

// Map column IDs to GraphQL column names for sorting
export const mapColumnIdToGraphQLColumn = (
  columnId: string
): StudentsOrderByColumn | null => {
  const columnMap: Record<string, StudentsOrderByColumn> = {
    id: "ID",
    name: "NAME",
    email: "EMAIL",
    dateOfBirth: "DATE_OF_BIRTH",
    gender: "GENDER",
    createdAt: "CREATED_AT",
    updatedAt: "UPDATED_AT",
  };

  return columnMap[columnId] || null;
};
