"use client";

import { useCallback, useMemo } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { isAbortError } from "@/client/utils/errorUtils";
import {
  DateFilterOperation,
  TextFilterOperation,
  DateFilterValue,
  FilterClause,
} from "@/client/types/filters";
import {
  getColumnDef,
  mapDateFilter,
  mapTextFilter,
} from "./hook/utils/filter";
import logger from "@/lib/logger";
import { useStudentApolloMutations } from "./useStudentApolloMutations";
import { useStudentStore } from "./stores/useStudentStore";

/**
 * Helper function to map table column IDs to GraphQL OrderStudentsByColumn enum values
 */
const mapColumnIdToGraphQLColumn = (
  columnId: string,
): Graphql.StudentsOrderByColumn | null => {
  const columnMap: Record<string, Graphql.StudentsOrderByColumn> = {
    id: "ID",
    name: "NAME",
    email: "EMAIL",
    dateOfBirth: "DATE_OF_BIRTH",
    gender: "GENDER",
    createdAt: "CREATED_AT",
    updatedAt: "UPDATED_AT",
    // phoneNumber and nationality are not sortable in the GraphQL schema
  };

  return columnMap[columnId] || null;
};

/**
 * Define the types for the filter operations and values
 */
type TextFilterMap = Partial<Record<TextFilterOperation, string | boolean>>;
type DateFilterMap = Partial<
  Record<DateFilterOperation, DateFilterValue | string | boolean>
>;

/**
 * Type for the main applyFilters function parameter
 */
type ApplyFiltersParams =
  | { columnId: keyof Graphql.Student; type: "text"; filters: TextFilterMap }
  | {
      columnId: keyof Graphql.Student;
      type: "date";
      filters: DateFilterMap;
    };

/**
 * Student Operations Hook
 * Business logic layer combining Apollo mutations + Store + Notifications
 */
export const useStudentOperations = () => {
  const apollo = useStudentApolloMutations();
  const store = useStudentStore();
  const notifications = useNotifications();
  const strings = useAppTranslation("studentTranslations");

  /**
   * Create a new student
   */
  const createStudent = useCallback(
    async (
      variables: Graphql.CreateStudentMutationVariables,
    ): Promise<boolean> => {
      try {
        const result = await apollo.createStudentMutation({ variables });
        if (result.data?.createStudent) {
          notifications.show(strings.studentCreatedSuccess, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }
        notifications.show(strings.studentCreateError, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch (error) {
        // Don't show error notification if the request was aborted
        if (!isAbortError(error)) {
          notifications.show(strings.studentCreateError, {
            severity: "error",
            autoHideDuration: 3000,
          });
        }
        return false;
      }
    },
    [
      apollo,
      notifications,
      strings.studentCreatedSuccess,
      strings.studentCreateError,
    ],
  );

  /**
   * Update an existing student
   */
  const partialUpdateStudent = useCallback(
    async (
      variables: Graphql.PartiallyUpdateStudentMutationVariables,
    ): Promise<boolean> => {
      try {
        const result = await apollo.partialUpdateStudentMutation({ variables });
        if (result.data?.partiallyUpdateStudent) {
          notifications.show(strings.studentUpdatedSuccess, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }
        notifications.show(strings.studentUpdateError, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch (error) {
        if (!isAbortError(error)) {
          notifications.show(strings.studentUpdateError, {
            severity: "error",
            autoHideDuration: 3000,
          });
        }
        return false;
      }
    },
    [
      apollo,
      notifications,
      strings.studentUpdatedSuccess,
      strings.studentUpdateError,
    ],
  );

  /**
   * Delete a student
   */
  const deleteStudent = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const result = await apollo.deleteStudentMutation({
          variables: { id },
        });
        if (result.data?.deleteStudent) {
          notifications.show(strings.studentDeletedSuccess, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }
        notifications.show(strings.studentDeleteError, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch (error) {
        if (!isAbortError(error)) {
          notifications.show(strings.studentDeleteError, {
            severity: "error",
            autoHideDuration: 3000,
          });
        }
        return false;
      }
    },
    [
      apollo,
      notifications,
      strings.studentDeletedSuccess,
      strings.studentDeleteError,
    ],
  );

  /**
   * Handle page change
   */
  const onPageChange = useCallback(
    (newPage: number) => {
      store.setQueryParams({
        paginationArgs: {
          ...store.queryParams.paginationArgs,
          page: newPage,
        },
      });
    },
    [store],
  );

  /**
   * Handle rows per page change
   */
  const onRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      store.setQueryParams({
        paginationArgs: {
          ...store.queryParams.paginationArgs,
          first: newRowsPerPage,
          page: 1, // Reset to first page when changing page size
        },
      });
    },
    [store],
  );

  /**
   * Update sort order
   */
  const updateSort = useCallback(
    (
      orderByClause: {
        column: string;
        order: Graphql.OrderSortDirection;
      }[],
    ) => {
      // Convert generic OrderByClause to GraphQL-specific OrderStudentsByClauseInput
      const graphqlOrderBy: Graphql.StudentsOrderByClause[] = orderByClause
        .map((clause) => {
          const graphqlColumn = mapColumnIdToGraphQLColumn(clause.column);
          if (!graphqlColumn) {
            logger.warn(
              `Column ${clause.column} is not sortable in GraphQL schema`,
            );
            return null;
          }
          const result: Graphql.StudentsOrderByClause = {
            column: graphqlColumn,
            order: clause.order,
          };
          return result;
        })
        .filter(
          (clause): clause is Graphql.StudentsOrderByClause => clause !== null,
        );

      store.setQueryParams({
        orderBy: graphqlOrderBy,
        paginationArgs: {
          first: 100,
          page: 1,
        },
      });
    },
    [store],
  );

  /**
   * Sync filters to query parameters
   */
  const syncFiltersToQueryParams = useCallback(() => {
    const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};

    Object.values(store.filters).forEach((filterClause) => {
      if (!filterClause) return;

      const columnId = filterClause.columnId as keyof Graphql.Student;
      const columnDef = getColumnDef(columnId);
      if (!columnDef) return;

      let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
      if (columnDef.type === "text" || columnDef.type === "phone") {
        mappedFilter = mapTextFilter(
          columnId,
          filterClause.operation as TextFilterOperation,
          filterClause.value,
        );
      } else if (columnDef.type === "date") {
        mappedFilter = mapDateFilter(
          columnId,
          filterClause.operation as DateFilterOperation,
          filterClause.value,
        );
      }
      Object.assign(newFilterArgs, mappedFilter);
    });

    store.setQueryParams({
      filterArgs: newFilterArgs,
      paginationArgs: {
        first: 100,
        page: 1,
      },
      // Preserve existing orderBy
      orderBy: store.queryParams.orderBy,
    });
  }, [store]);

  /**
   * Apply filters to a column
   */
  const applyFilters = useCallback(
    (params: ApplyFiltersParams) => {
      const { columnId, filters: newColumnFilters } = params;

      const newFilters = { ...store.filters };
      const filterEntries = Object.entries(newColumnFilters);

      if (filterEntries.length > 0) {
        // This logic assumes one operation per column from the popovers.
        const [op, value] = filterEntries[0];
        newFilters[columnId as string] = {
          columnId: columnId as string,
          operation: op,
          value,
        };
      } else {
        delete newFilters[columnId as string];
      }

      store.setFilters(newFilters);
      // Sync filters to query parameters
      setTimeout(() => syncFiltersToQueryParams(), 0);
    },
    [store, syncFiltersToQueryParams],
  );

  /**
   * Set search filter (replaces all other filters)
   */
  const setSearchFilter = useCallback(
    (filterClause: FilterClause | null) => {
      logger.info("🔍 setSearchFilter called with:", filterClause);
      if (!filterClause) {
        // Only clear the search filter (name column), not all filters
        logger.info("🔍 Clearing name filter only");
        store.clearFilter("name");
      } else {
        // This replaces all other filters, which is the desired behavior for the search bar.
        logger.info("🔍 Setting search filter:", filterClause);
        store.setFilters({ [filterClause.columnId]: filterClause });
      }
      // Sync filters to query parameters
      setTimeout(() => syncFiltersToQueryParams(), 0);
    },
    [store, syncFiltersToQueryParams],
  );

  /**
   * Set column filter
   */
  const setColumnFilter = useCallback(
    (filterClause: FilterClause | null, columnId: string) => {
      store.setColumnFilter(filterClause, columnId);
      // Sync filters to query parameters
      setTimeout(() => syncFiltersToQueryParams(), 0);
    },
    [store, syncFiltersToQueryParams],
  );

  /**
   * Clear filter for a column
   */
  const clearFilter = useCallback(
    (columnId: keyof Graphql.Student) => {
      store.clearFilter(columnId as string);
      // Sync filters to query parameters
      setTimeout(() => syncFiltersToQueryParams(), 0);
    },
    [store, syncFiltersToQueryParams],
  );

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback(() => {
    store.clearAllFilters();
    store.setQueryParams({
      filterArgs: {},
      // Only reset pagination, preserve orderBy and other query params
      paginationArgs: {
        first: 100,
        page: 1,
      },
      // Preserve existing orderBy
      orderBy: store.queryParams.orderBy,
    });
  }, [store]);

  return useMemo(
    () => ({
      // Mutations
      createStudent,
      partialUpdateStudent,
      deleteStudent,
      // Pagination
      onPageChange,
      onRowsPerPageChange,
      // Sorting
      updateSort,
      // Filters
      applyFilters,
      setSearchFilter,
      setColumnFilter,
      clearFilter,
      clearAllFilters,
      // Store access
      queryParams: store.queryParams,
      filters: store.filters,
      selectedStudents: store.selectedStudents,
      toggleStudentSelect: store.toggleStudentSelect,
      selectAllStudents: store.selectAllStudents,
      clearSelectedStudents: store.clearSelectedStudents,
    }),
    [
      createStudent,
      partialUpdateStudent,
      deleteStudent,
      onPageChange,
      onRowsPerPageChange,
      updateSort,
      applyFilters,
      setSearchFilter,
      setColumnFilter,
      clearFilter,
      clearAllFilters,
      store.queryParams,
      store.filters,
      store.selectedStudents,
      store.toggleStudentSelect,
      store.selectAllStudents,
      store.clearSelectedStudents,
    ],
  );
};
