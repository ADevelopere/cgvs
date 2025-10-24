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
  getFilterKeysForColumn,
  mapDateFilter,
  mapTextFilter,
} from "./utils/filter";
import logger from "@/client/lib/logger";
import { useStudentApolloMutations } from "./useStudentApolloMutations";
import { useStudentStore } from "../stores/useStudentStore";

/**
 * Helper function to map table column IDs to GraphQL OrderStudentsByColumn enum values
 */
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
      variables: Graphql.CreateStudentMutationVariables
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
    ]
  );

  /**
   * Update an existing student
   */
  const partialUpdateStudent = useCallback(
    async (
      variables: Graphql.PartiallyUpdateStudentMutationVariables
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
    ]
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
    ]
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
    [store]
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
    [store]
  );

  /**
   * Update sort order
   */
  const updateSort = useCallback(
    (
      orderByClause: {
        column: string;
        order: Graphql.OrderSortDirection;
      }[]
    ) => {
      // Convert generic OrderByClause to GraphQL-specific OrderStudentsByClauseInput
      const graphqlOrderBy: Graphql.StudentsOrderByClause[] = orderByClause
        .map(clause => {
          const graphqlColumn = mapColumnIdToGraphQLColumn(clause.column);
          if (!graphqlColumn) {
            logger.warn(
              `Column ${clause.column} is not sortable in GraphQL schema`
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
          (clause): clause is Graphql.StudentsOrderByClause => clause !== null
        );

      store.setQueryParams({
        orderBy: graphqlOrderBy,
        paginationArgs: {
          first: 100,
          page: 1,
        },
      });
    },
    [store]
  );

  /**
   * Sync filters to query parameters
   */
  const syncFiltersToQueryParams = useCallback(
    (currentFilters?: Record<string, FilterClause | null>) => {
      const filtersToUse = currentFilters ?? store.filters;
      logger.info("🔍 useStudentOperations: syncFiltersToQueryParams called");
      logger.info("🔍 useStudentOperations: filtersToUse:", filtersToUse);
      logger.info(
        "🔍 useStudentOperations: store.queryParams.filterArgs at start:",
        store.queryParams.filterArgs
      );

      // Start with current filterArgs to preserve filters not managed by store.filters
      const currentFilterArgs = { ...store.queryParams.filterArgs };
      logger.info(
        "🔍 useStudentOperations: currentFilterArgs copy:",
        currentFilterArgs
      );

      // Get all columns that currently have filters
      const activeColumns = new Set(
        Object.values(filtersToUse)
          .filter(f => f !== null)
          .map(f => f!.columnId as keyof Graphql.Student)
      );
      logger.info(
        "🔍 useStudentOperations: activeColumns:",
        Array.from(activeColumns)
      );

      // Clear all filter keys for columns that are no longer active
      const allPossibleColumns: (keyof Graphql.Student)[] = [
        "name",
        "email",
        "phoneNumber",
        "dateOfBirth",
        "gender",
        "nationality",
        "createdAt",
      ];

      allPossibleColumns.forEach(columnId => {
        if (!activeColumns.has(columnId)) {
          // Column filter was removed - clear ALL possible filter arg keys for it
          const keysToRemove = getFilterKeysForColumn(columnId);
          logger.info(
            `🔍 useStudentOperations: clearing keys for inactive column ${columnId}:`,
            keysToRemove
          );
          keysToRemove.forEach(key => {
            const hadKey = key in currentFilterArgs;
            delete currentFilterArgs[key];
            if (hadKey) {
              logger.info(
                `🔍 useStudentOperations: removed key ${key} from currentFilterArgs`
              );
            }
          });
        }
      });
      logger.info(
        "🔍 useStudentOperations: currentFilterArgs after clearing inactive columns:",
        currentFilterArgs
      );

      // Build new filters from active filtersToUse
      const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};
      Object.values(filtersToUse).forEach(filterClause => {
        if (!filterClause) return;

        const columnId = filterClause.columnId as keyof Graphql.Student;
        const columnDef = getColumnDef(columnId);
        if (!columnDef) return;

        let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
        if (columnDef.type === "text" || columnDef.type === "phone") {
          mappedFilter = mapTextFilter(
            columnId,
            filterClause.operation as TextFilterOperation,
            filterClause.value
          );
        } else if (columnDef.type === "date") {
          mappedFilter = mapDateFilter(
            columnId,
            filterClause.operation as DateFilterOperation,
            filterClause.value
          );
        }
        logger.info(
          `🔍 useStudentOperations: mapped filter for ${columnId}:`,
          mappedFilter
        );
        Object.assign(newFilterArgs, mappedFilter);
      });
      logger.info(
        "🔍 useStudentOperations: newFilterArgs built from active filters:",
        newFilterArgs
      );

      // Merge: start with cleaned currentFilterArgs, override with new filters
      const finalFilterArgs = { ...currentFilterArgs, ...newFilterArgs };
      logger.info(
        "🔍 useStudentOperations: finalFilterArgs after merge:",
        finalFilterArgs
      );

      logger.info(
        "🔍 useStudentOperations: calling store.setQueryParams with finalFilterArgs"
      );
      store.setQueryParams({
        filterArgs: finalFilterArgs,
        paginationArgs: {
          first: 100,
          page: 1,
        },
        // Preserve existing orderBy
        orderBy: store.queryParams.orderBy,
      });
      logger.info(
        "🔍 useStudentOperations: store.queryParams after setQueryParams:",
        store.queryParams
      );
    },
    [store]
  );

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
    [store, syncFiltersToQueryParams]
  );

  /**
   * Set search filter (replaces all other filters)
   */
  const setSearchFilter = useCallback(
    (filterClause: FilterClause | null) => {
      logger.info(
        "🔍 useStudentOperations: setSearchFilter called with:",
        filterClause
      );
      logger.info(
        "🔍 useStudentOperations: current store.filters before:",
        store.filters
      );
      logger.info(
        "🔍 useStudentOperations: current queryParams.filterArgs before:",
        store.queryParams.filterArgs
      );

      if (!filterClause) {
        // Only clear the search filter (name column), not all filters
        logger.info("🔍 useStudentOperations: Clearing name filter only");
        store.clearFilter("name");
        logger.info(
          "🔍 useStudentOperations: store.filters after clearFilter:",
          store.filters
        );

        // Calculate the new filter state after clearing name filter
        const newFilters = { ...store.filters };
        delete newFilters["name"];

        // Sync filters to query parameters
        logger.info(
          "🔍 useStudentOperations: calling syncFiltersToQueryParams immediately"
        );
        syncFiltersToQueryParams(newFilters);
      } else {
        // This replaces all other filters, which is the desired behavior for the search bar.
        logger.info(
          "🔍 useStudentOperations: Setting search filter:",
          filterClause
        );
        store.setFilters({ [filterClause.columnId]: filterClause });
        logger.info(
          "🔍 useStudentOperations: store.filters after setFilters:",
          store.filters
        );

        // Calculate the new filter state after setting search filter
        const newFilters = { [filterClause.columnId]: filterClause };

        // Sync filters to query parameters
        logger.info(
          "🔍 useStudentOperations: calling syncFiltersToQueryParams immediately"
        );
        syncFiltersToQueryParams(newFilters);
      }
    },
    [store, syncFiltersToQueryParams]
  );

  /**
   * Set column filter
   */
  const setColumnFilter = useCallback(
    (filterClause: FilterClause | null, columnId: string) => {
      logger.info("🔍 useStudentOperations: setColumnFilter called with:", {
        filterClause,
        columnId,
      });
      logger.info(
        "🔍 useStudentOperations: current store.filters before:",
        store.filters
      );
      logger.info(
        "🔍 useStudentOperations: current queryParams.filterArgs before:",
        store.queryParams.filterArgs
      );

      store.setColumnFilter(filterClause, columnId);
      logger.info(
        "🔍 useStudentOperations: store.filters after setColumnFilter:",
        store.filters
      );

      // Calculate the new filter state after the store update
      const newFilters = { ...store.filters };
      if (filterClause) {
        newFilters[columnId] = filterClause;
      } else {
        delete newFilters[columnId];
      }

      // Sync filters to query parameters
      logger.info(
        "🔍 useStudentOperations: calling syncFiltersToQueryParams immediately for setColumnFilter"
      );
      syncFiltersToQueryParams(newFilters);
    },
    [store, syncFiltersToQueryParams]
  );

  /**
   * Clear filter for a column
   */
  const clearFilter = useCallback(
    (columnId: keyof Graphql.Student) => {
      logger.info(
        "🔍 useStudentOperations: clearFilter called with columnId:",
        columnId
      );
      logger.info(
        "🔍 useStudentOperations: current store.filters before:",
        store.filters
      );
      logger.info(
        "🔍 useStudentOperations: current queryParams.filterArgs before:",
        store.queryParams.filterArgs
      );

      store.clearFilter(columnId as string);
      logger.info(
        "🔍 useStudentOperations: store.filters after clearFilter:",
        store.filters
      );

      // Calculate the new filter state after the store update
      const newFilters = { ...store.filters };
      delete newFilters[columnId as string];

      // Sync filters to query parameters
      logger.info(
        "🔍 useStudentOperations: calling syncFiltersToQueryParams immediately for clearFilter"
      );
      syncFiltersToQueryParams(newFilters);
    },
    [store, syncFiltersToQueryParams]
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
    ]
  );
};
