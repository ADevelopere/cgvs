import { StudentsOrderByColumn } from "@/client/graphql/generated/gql/graphql";

/**
 * Map column IDs to GraphQL column names for sorting
 */
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
