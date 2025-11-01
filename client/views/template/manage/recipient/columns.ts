import { StudentsOrderByColumn } from "@/client/graphql/generated/gql/graphql";

/**
 * Map column IDs to GraphQL column names for sorting
 */
export const mapColumnIdToGraphQLColumn = (
  columnId: string
): StudentsOrderByColumn | null => {
  const columnMap: Record<string, StudentsOrderByColumn> = {
    id: StudentsOrderByColumn.Id,
    name: StudentsOrderByColumn.Name,
    email: StudentsOrderByColumn.Email,
    dateOfBirth: StudentsOrderByColumn.DateOfBirth,
    gender: StudentsOrderByColumn.Gender,
    createdAt: StudentsOrderByColumn.CreatedAt,
    updatedAt: StudentsOrderByColumn.UpdatedAt,
  };

  return columnMap[columnId] || null;
};
