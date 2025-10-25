"use client";

import { useCallback, useMemo } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useRecipientStore } from "../stores/useRecipientStore";
import { useRecipientApolloMutations } from "./useRecipientApolloMutations";
import * as StudentUtils from "@/client/views/student/hook/utils/filter";
import {
  FilterClause,
  TextFilterOperation,
  DateFilterOperation,
} from "@/client/types/filters";

/**
 * Helper function to get column type for filter mapping
 */
const getColumnType = (columnId: string): "text" | "date" | null => {
  const textColumns = ["name", "email"];
  const dateColumns = ["dateOfBirth", "createdAt"];

  if (textColumns.includes(columnId)) return "text";
  if (dateColumns.includes(columnId)) return "date";
  return null;
};

export const useRecipientOperations = (templateId?: number) => {
  const apollo = useRecipientApolloMutations(templateId);
  const store = useRecipientStore();
  const notifications = useNotifications();
  const strings = useAppTranslation("recipientTranslations");

  const addSingleStudentToGroup = useCallback(
    async (input: Graphql.TemplateRecipientCreateInput): Promise<boolean> => {
      try {
        const result = await apollo.createRecipient({ input });
        if (result.data) {
          notifications.show(strings.recipientCreated, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }
        notifications.show(strings.errorCreatingRecipient, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch {
        notifications.show(strings.errorCreatingRecipient, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      }
    },
    [apollo, notifications, strings]
  );

  const addStudentsToGroup = useCallback(
    async (studentIds: number[]): Promise<boolean> => {
      if (!store.selectedGroup?.id || studentIds.length === 0) {
        return false;
      }

      try {
        const result = await apollo.createRecipients({
          input: {
            recipientGroupId: store.selectedGroup.id,
            studentIds,
          },
        });

        if (result.data && result.data.createRecipients.length > 0) {
          notifications.show(strings.addedToGroup, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }

        notifications.show(strings.errorAddingToGroup, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch {
        notifications.show(strings.errorAddingToGroup, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      }
    },
    [
      store.selectedGroup?.id,
      apollo,
      notifications,
      strings.errorAddingToGroup,
      strings.addedToGroup,
    ]
  );

  const deleteRecipient = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const result = await apollo.deleteRecipient({ id });
        if (result.data) {
          notifications.show(strings.recipientDeleted, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }
        notifications.show(strings.errorDeletingRecipient, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch {
        notifications.show(strings.errorDeletingRecipient, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      }
    },
    [apollo, notifications, strings]
  );

  const deleteRecipients = useCallback(
    async (ids: number[]): Promise<boolean> => {
      if (ids.length === 0) return false;

      try {
        const result = await apollo.deleteRecipients({ ids });
        if (result.data) {
          notifications.show(strings.removedFromGroup, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }
        notifications.show(strings.errorRemovingFromGroup, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch {
        notifications.show(strings.errorRemovingFromGroup, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      }
    },
    [apollo, notifications, strings]
  );

  // Pagination operations for students NOT in group
  const onPageChange = useCallback(
    (page: number) => {
      store.setStudentsNotInGroupQueryParams({
        paginationArgs: {
          ...store.studentsNotInGroupQueryParams.paginationArgs,
          page,
        },
      });
    },
    [store]
  );

  const onRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      store.setStudentsNotInGroupQueryParams({
        paginationArgs: { first: rowsPerPage, page: 1 },
      });
    },
    [store]
  );

  // Pagination operations for students IN group
  const onPageChangeInGroup = useCallback(
    (page: number) => {
      store.setStudentsInGroupQueryParams({
        paginationArgs: {
          ...store.recipientsByGroupIdFilteredQuery.paginationArgs,
          page,
        },
      });
    },
    [store]
  );

  const onRowsPerPageChangeInGroup = useCallback(
    (rowsPerPage: number) => {
      store.setStudentsInGroupQueryParams({
        paginationArgs: { first: rowsPerPage, page: 1 },
      });
    },
    [store]
  );

  // Filter operations for students NOT in group
  const setColumnFilter = useCallback(
    (filterClause: FilterClause | null, columnId: string) => {
      // Update filter in store
      store.setFilterNotInGroup(columnId, filterClause);

      // Update query params directly - no sync needed!
      const newFilters = {
        ...store.filtersNotInGroup,
        [columnId]: filterClause,
      };
      const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};

      Object.values(newFilters).forEach(filterClause => {
        if (!filterClause) return;

        const columnId = filterClause.columnId as keyof Graphql.Student;
        const columnType = getColumnType(columnId as string);
        if (!columnType) return;

        let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
        if (columnType === "text") {
          mappedFilter = StudentUtils.mapTextFilter(
            columnId,
            filterClause.operation as TextFilterOperation,
            filterClause.value as string
          );
        } else if (columnType === "date") {
          mappedFilter = StudentUtils.mapDateFilter(
            columnId,
            filterClause.operation as DateFilterOperation,
            filterClause.value as { from?: Date; to?: Date }
          );
        }
        Object.assign(newFilterArgs, mappedFilter);
      });

      store.setStudentsNotInGroupQueryParams({
        filterArgs:
          Object.keys(newFilterArgs).length > 0
            ? (newFilterArgs as Graphql.StudentFilterArgs)
            : null,
        // Preserve existing pagination and orderBy
        paginationArgs: store.studentsNotInGroupQueryParams.paginationArgs,
        orderBy: store.studentsNotInGroupQueryParams.orderBy,
      });
    },
    [store]
  );

  // Filter operations for students IN group
  const setColumnFilterInGroup = useCallback(
    (filterClause: FilterClause | null, columnId: string) => {
      // Update filter in store
      store.setFilterInGroup(columnId, filterClause);

      // Update query params directly - no sync needed!
      const newFilters = { ...store.filtersInGroup, [columnId]: filterClause };
      const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};

      Object.values(newFilters).forEach(filterClause => {
        if (!filterClause) return;

        const columnId = filterClause.columnId as keyof Graphql.Student;
        const columnType = getColumnType(columnId as string);
        if (!columnType) return;

        let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
        if (columnType === "text") {
          mappedFilter = StudentUtils.mapTextFilter(
            columnId,
            filterClause.operation as TextFilterOperation,
            filterClause.value as string
          );
        } else if (columnType === "date") {
          mappedFilter = StudentUtils.mapDateFilter(
            columnId,
            filterClause.operation as DateFilterOperation,
            filterClause.value as { from?: Date; to?: Date }
          );
        }
        Object.assign(newFilterArgs, mappedFilter);
      });

      store.setStudentsInGroupQueryParams({
        filterArgs:
          Object.keys(newFilterArgs).length > 0
            ? (newFilterArgs as Graphql.StudentFilterArgs)
            : null,
        // Preserve existing pagination and orderBy
        paginationArgs: store.recipientsByGroupIdFilteredQuery.paginationArgs,
        orderBy: store.recipientsByGroupIdFilteredQuery.orderBy,
      });
    },
    [store]
  );

  // Sort operations for students NOT in group
  const setSort = useCallback(
    (orderBy: Graphql.StudentsOrderByClause[] | null) => {
      store.setStudentsNotInGroupQueryParams({ orderBy });
    },
    [store]
  );

  // Sort operations for students IN group
  const setSortInGroup = useCallback(
    (orderBy: Graphql.StudentsOrderByClause[] | null) => {
      store.setStudentsInGroupQueryParams({ orderBy });
    },
    [store]
  );

  // Helper function to map column IDs to GraphQL columns
  const mapColumnIdToGraphQLColumn = (
    columnId: string
  ): Graphql.StudentsOrderByColumn | null => {
    const columnMap: Record<string, Graphql.StudentsOrderByColumn> = {
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

  // Update sort for students NOT in group (with column mapping)
  const updateSort = useCallback(
    (
      orderByClause: {
        column: string;
        order: Graphql.OrderSortDirection | null;
      }[]
    ) => {
      // Filter out clauses with null order (clear sort)
      const validClauses = orderByClause.filter(clause => clause.order !== null);
      
      // If no valid clauses, clear the sort
      if (validClauses.length === 0) {
        store.setStudentsNotInGroupQueryParams({
          orderBy: null,
        });
        return;
      }

      const graphqlOrderBy: Graphql.StudentsOrderByClause[] = [];
      
      validClauses.forEach(clause => {
        const graphqlColumn = mapColumnIdToGraphQLColumn(clause.column);
        if (graphqlColumn) {
          graphqlOrderBy.push({
            column: graphqlColumn,
            order: clause.order as Graphql.OrderSortDirection,
          });
        }
      });

      store.setStudentsNotInGroupQueryParams({
        orderBy: graphqlOrderBy.length > 0 ? graphqlOrderBy : null,
      });
    },
    [store]
  );

  // Update sort for students IN group (with column mapping)
  const updateSortInGroup = useCallback(
    (
      orderByClause: {
        column: string;
        order: Graphql.OrderSortDirection | null;
      }[]
    ) => {
      // Filter out clauses with null order (clear sort)
      const validClauses = orderByClause.filter(clause => clause.order !== null);
      
      // If no valid clauses, clear the sort
      if (validClauses.length === 0) {
        store.setStudentsInGroupQueryParams({
          orderBy: null,
        });
        return;
      }

      const graphqlOrderBy: Graphql.StudentsOrderByClause[] = [];
      
      validClauses.forEach(clause => {
        const graphqlColumn = mapColumnIdToGraphQLColumn(clause.column);
        if (graphqlColumn) {
          graphqlOrderBy.push({
            column: graphqlColumn,
            order: clause.order as Graphql.OrderSortDirection,
          });
        }
      });

      store.setStudentsInGroupQueryParams({
        orderBy: graphqlOrderBy.length > 0 ? graphqlOrderBy : null,
      });
    },
    [store]
  );

  // Clear filter for NotInGroup
  const clearFilter = useCallback(
    (columnId: string) => {
      store.clearFilterNotInGroup(columnId);

      // Recalculate filter args
      const newFilters = { ...store.filtersNotInGroup };
      delete newFilters[columnId];

      const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};
      Object.values(newFilters).forEach(filterClause => {
        if (!filterClause) return;

        const columnId = filterClause.columnId as keyof Graphql.Student;
        const columnType = getColumnType(columnId as string);
        if (!columnType) return;

        let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
        if (columnType === "text") {
          mappedFilter = StudentUtils.mapTextFilter(
            columnId,
            filterClause.operation as TextFilterOperation,
            filterClause.value as string
          );
        } else if (columnType === "date") {
          mappedFilter = StudentUtils.mapDateFilter(
            columnId,
            filterClause.operation as DateFilterOperation,
            filterClause.value as { from?: Date; to?: Date }
          );
        }
        Object.assign(newFilterArgs, mappedFilter);
      });

      store.setStudentsNotInGroupQueryParams({
        filterArgs:
          Object.keys(newFilterArgs).length > 0
            ? (newFilterArgs as Graphql.StudentFilterArgs)
            : null,
        paginationArgs: store.studentsNotInGroupQueryParams.paginationArgs,
        orderBy: store.studentsNotInGroupQueryParams.orderBy,
      });
    },
    [store]
  );

  // Clear filter for InGroup
  const clearFilterInGroup = useCallback(
    (columnId: string) => {
      store.clearFilterInGroup(columnId);

      // Recalculate filter args
      const newFilters = { ...store.filtersInGroup };
      delete newFilters[columnId];

      const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};
      Object.values(newFilters).forEach(filterClause => {
        if (!filterClause) return;

        const columnId = filterClause.columnId as keyof Graphql.Student;
        const columnType = getColumnType(columnId as string);
        if (!columnType) return;

        let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
        if (columnType === "text") {
          mappedFilter = StudentUtils.mapTextFilter(
            columnId,
            filterClause.operation as TextFilterOperation,
            filterClause.value as string
          );
        } else if (columnType === "date") {
          mappedFilter = StudentUtils.mapDateFilter(
            columnId,
            filterClause.operation as DateFilterOperation,
            filterClause.value as { from?: Date; to?: Date }
          );
        }
        Object.assign(newFilterArgs, mappedFilter);
      });

      store.setStudentsInGroupQueryParams({
        filterArgs:
          Object.keys(newFilterArgs).length > 0
            ? (newFilterArgs as Graphql.StudentFilterArgs)
            : null,
        paginationArgs: store.recipientsByGroupIdFilteredQuery.paginationArgs,
        orderBy: store.recipientsByGroupIdFilteredQuery.orderBy,
      });
    },
    [store]
  );

  // Return a stable object using useMemo
  return useMemo(
    () => ({
      // Mutations
      addSingleStudentToGroup,
      addStudentsToGroup,
      deleteRecipient,
      deleteRecipients,
      // Pagination - NotInGroup
      onPageChange,
      onRowsPerPageChange,
      // Pagination - InGroup
      onPageChangeInGroup,
      onRowsPerPageChangeInGroup,
      // Filters - NotInGroup
      setColumnFilter,
      clearFilter,
      filtersNotInGroup: store.filtersNotInGroup,
      // Filters - InGroup
      setColumnFilterInGroup,
      clearFilterInGroup,
      filtersInGroup: store.filtersInGroup,
      // Sorting - NotInGroup
      setSort,
      updateSort,
      // Sorting - InGroup
      setSortInGroup,
      updateSortInGroup,
      // Store access
      studentsNotInGroupQueryParams: store.studentsNotInGroupQueryParams,
      recipientsByGroupIdFilteredQuery: store.recipientsByGroupIdFilteredQuery,
    }),
    [
      addSingleStudentToGroup,
      addStudentsToGroup,
      deleteRecipient,
      deleteRecipients,
      onPageChange,
      onRowsPerPageChange,
      onPageChangeInGroup,
      onRowsPerPageChangeInGroup,
      setColumnFilter,
      clearFilter,
      setColumnFilterInGroup,
      clearFilterInGroup,
      setSort,
      setSortInGroup,
      updateSort,
      updateSortInGroup,
      store.filtersNotInGroup,
      store.filtersInGroup,
      store.studentsNotInGroupQueryParams,
      store.recipientsByGroupIdFilteredQuery,
    ]
  );
};
