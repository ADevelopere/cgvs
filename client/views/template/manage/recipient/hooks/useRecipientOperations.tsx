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
import { BaseColumn } from "@/client/types/table.type";

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
    [apollo, notifications, strings],
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
    ],
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
    [apollo, notifications, strings],
  );

  const deleteRecipients = useCallback(
    async (ids: number[]): Promise<boolean> => {
      if (ids.length === 0) return false;

      try {
        const result = await apollo.deleteRecipients({ ids });
        if (result.data) {
          notifications.show(strings.recipientsDeleted, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }
        notifications.show(strings.errorDeletingRecipients, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch {
        notifications.show(strings.errorDeletingRecipients, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      }
    },
    [apollo, notifications, strings],
  );

  // Pagination operations
  const onPageChange = useCallback(
    (page: number) => {
      store.setStudentsNotInGroupQueryParams({
        paginationArgs: {
          ...store.studentsNotInGroupQueryParams.paginationArgs,
          page,
        },
      });
    },
    [store],
  );

  const onRowsPerPageChange = useCallback(
    (rowsPerPage: number) => {
      store.setStudentsNotInGroupQueryParams({
        paginationArgs: { first: rowsPerPage, page: 1 },
      });
    },
    [store],
  );

  // Filter operations
  const setColumnFilter = useCallback(
    (columnId: string, filterClause: FilterClause | null) => {
      store.setFilter(columnId, filterClause);
    },
    [store],
  );

  // Sync filters to GraphQL query params
  const syncFiltersToQueryParams = useCallback(
    (
      activeFilters: Record<string, FilterClause | null>,
      baseColumns: BaseColumn[],
    ) => {
      const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};

      Object.values(activeFilters).forEach((filterClause) => {
        if (!filterClause) return;

        const columnId = filterClause.columnId as keyof Graphql.Student;
        const column = baseColumns.find((col) => col.id === columnId);
        if (!column) return;

        let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
        if (column.type === "text") {
          mappedFilter = StudentUtils.mapTextFilter(
            columnId,
            filterClause.operation as TextFilterOperation,
            filterClause.value as string,
          );
        } else if (column.type === "date") {
          mappedFilter = StudentUtils.mapDateFilter(
            columnId,
            filterClause.operation as DateFilterOperation,
            filterClause.value as { from?: Date; to?: Date },
          );
        }
        Object.assign(newFilterArgs, mappedFilter);
      });

      store.setStudentsNotInGroupQueryParams({
        filterArgs:
          Object.keys(newFilterArgs).length > 0
            ? (newFilterArgs as Graphql.StudentFilterArgs)
            : null,
        paginationArgs: { page: 1, first: 50 },
      });
    },
    [store],
  );

  // Sort operations
  const setSort = useCallback(
    (orderBy: Graphql.StudentsOrderByClause[] | null) => {
      store.setStudentsNotInGroupQueryParams({ orderBy });
    },
    [store],
  );

  // Return a stable object using useMemo
  return useMemo(
    () => ({
      addSingleStudentToGroup,
      addStudentsToGroup,
      deleteRecipient,
      deleteRecipients,
      onPageChange,
      onRowsPerPageChange,
      setColumnFilter,
      syncFiltersToQueryParams,
      setSort,
    }),
    [
      addSingleStudentToGroup,
      addStudentsToGroup,
      deleteRecipient,
      deleteRecipients,
      onPageChange,
      onRowsPerPageChange,
      setColumnFilter,
      syncFiltersToQueryParams,
      setSort,
    ],
  );
};
