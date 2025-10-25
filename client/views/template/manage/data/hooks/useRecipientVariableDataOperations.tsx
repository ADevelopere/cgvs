"use client";

import { useCallback, useMemo } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { isAbortError } from "@/client/utils/errorUtils";
import logger from "@/client/lib/logger";
import { useRecipientVariableDataApolloMutations } from "./useRecipientVariableDataApolloMutations";
import { useRecipientVariableDataStore } from "../stores/useRecipientVariableDataStore";

/**
 * Recipient Variable Data Operations Hook
 * Business logic layer combining Apollo mutations + Store + Notifications
 */
export const useRecipientVariableDataOperations = () => {
  const apollo = useRecipientVariableDataApolloMutations();
  const store = useRecipientVariableDataStore();
  const notifications = useNotifications();
  const strings = useAppTranslation("recipientVariableDataTranslations");

  /**
   * Update a single recipient variable value
   */
  const updateRecipientVariableValue = useCallback(
    async <T = unknown>(
      recipientGroupItemId: number,
      variableId: number,
      value: T | null | undefined
    ): Promise<boolean> => {
      try {
        const result = await apollo.setRecipientVariableValuesMutation({
          variables: {
            recipientGroupItemId,
            values: [
              {
                variableId,
                value: value as string,
              },
            ],
          },
        });

        if (result.data?.setRecipientVariableValues) {
          notifications.show(strings.valueUpdatedSuccess, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }

        notifications.show(strings.errorUpdatingValue, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch (error) {
        if (!isAbortError(error)) {
          logger.error(
            "🔍 useRecipientVariableDataOperations: Error updating variable value:",
            error
          );
          notifications.show(strings.errorUpdatingValue, {
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
      strings.valueUpdatedSuccess,
      strings.errorUpdatingValue,
    ]
  );

  /**
   * Handle page change
   */
  const onPageChange = useCallback(
    (newPage: number) => {
      const currentLimit = store.queryParams.limit;
      const newOffset = (newPage - 1) * currentLimit;

      logger.info(
        "🔍 useRecipientVariableDataOperations: onPageChange called with:",
        {
          newPage,
          currentLimit,
          newOffset,
        }
      );

      store.setPagination(currentLimit, newOffset);
    },
    [store]
  );

  /**
   * Handle rows per page change
   */
  const onRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      logger.info(
        "🔍 useRecipientVariableDataOperations: onRowsPerPageChange called with:",
        {
          newRowsPerPage,
        }
      );

      store.setPagination(newRowsPerPage, 0); // Reset to first page when changing page size
    },
    [store]
  );

  /**
   * Set selected group
   */
  const setSelectedGroup = useCallback(
    (group: Graphql.TemplateRecipientGroup | null) => {
      logger.info(
        "🔍 useRecipientVariableDataOperations: setSelectedGroup called with:",
        group
      );
      store.setSelectedGroup(group);
    },
    [store]
  );

  /**
   * Reset store
   */
  const reset = useCallback(() => {
    logger.info("🔍 useRecipientVariableDataOperations: reset called");
    store.reset();
  }, [store]);

  return useMemo(
    () => ({
      // Mutations
      updateRecipientVariableValue,
      // Pagination
      onPageChange,
      onRowsPerPageChange,
      // Group management
      setSelectedGroup,
      reset,
      // Store access
      queryParams: store.queryParams,
      selectedGroup: store.selectedGroup,
      selectedGroupId: store.selectedGroupId,
    }),
    [
      updateRecipientVariableValue,
      onPageChange,
      onRowsPerPageChange,
      setSelectedGroup,
      reset,
      store.queryParams,
      store.selectedGroup,
      store.selectedGroupId,
    ]
  );
};
