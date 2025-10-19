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
import { recipientBaseColumns } from "../columns";

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
          ...store.studentsInGroupQueryParams.paginationArgs,
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
    (columnId: string, filterClause: FilterClause | null) => {
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
        const column = recipientBaseColumns.find(col => col.id === columnId);
        if (!column) return;

        let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
        if (column.type === "text") {
          mappedFilter = StudentUtils.mapTextFilter(
            columnId,
            filterClause.operation as TextFilterOperation,
            filterClause.value as string
          );
        } else if (column.type === "date") {
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
    (columnId: string, filterClause: FilterClause | null) => {
      // Update filter in store
      store.setFilterInGroup(columnId, filterClause);

      // Update query params directly - no sync needed!
      const newFilters = { ...store.filtersInGroup, [columnId]: filterClause };
      const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};

      Object.values(newFilters).forEach(filterClause => {
        if (!filterClause) return;

        const columnId = filterClause.columnId as keyof Graphql.Student;
        const column = recipientBaseColumns.find(col => col.id === columnId);
        if (!column) return;

        let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
        if (column.type === "text") {
          mappedFilter = StudentUtils.mapTextFilter(
            columnId,
            filterClause.operation as TextFilterOperation,
            filterClause.value as string
          );
        } else if (column.type === "date") {
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
        paginationArgs: store.studentsInGroupQueryParams.paginationArgs,
        orderBy: store.studentsInGroupQueryParams.orderBy,
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

  // Return a stable object using useMemo
  return useMemo(
    () => ({
      addSingleStudentToGroup,
      addStudentsToGroup,
      deleteRecipient,
      deleteRecipients,
      onPageChange,
      onRowsPerPageChange,
      onPageChangeInGroup,
      onRowsPerPageChangeInGroup,
      setColumnFilter,
      setColumnFilterInGroup,
      setSort,
      setSortInGroup,
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
      setColumnFilterInGroup,
      setSort,
      setSortInGroup,
    ]
  );
};
