"use client";

import { useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";
import { isAbortError } from "@/client/utils/errorUtils";
import { useRecipientGroupGraphQL } from "./recipientGroup.apollo";

/**
 * Recipient Group Service Hook
 *
 * Provides data operations for recipient groups without state management.
 * All functions return values directly and handle errors internally
 * by logging and showing notifications.
 */
export const useRecipientGroupService = () => {
  const apollo = useRecipientGroupGraphQL();
  const notifications = useNotifications();
  const strings = useAppTranslation("recipientGroupTranslations");

  /**
   * Fetch recipient groups by template ID
   * Returns array of groups on success, null on failure
   */
  const fetchGroupsByTemplateId = useCallback(
    async (
      templateId: number,
    ): Promise<Graphql.TemplateRecipientGroup[] | null> => {
      try {
        const result = await apollo.templateRecipientGroupsByTemplateIdQuery({
          templateId,
        });

        if (result.data) {
          return result.data.templateRecipientGroupsByTemplateId;
        }

        logger.error("Error fetching recipient groups:", result.error);
        notifications.show(
          strings.errorLoading || "Error loading recipient groups",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
        );
        return null;
      } catch (error) {
        if (!isAbortError(error)) {
          logger.error("Error fetching recipient groups:", error);
          notifications.show(
            strings.errorLoading || "Error loading recipient groups",
            {
              severity: "error",
              autoHideDuration: 3000,
            },
          );
        } else {
          logger.debug("Query aborted (likely due to navigation):", error);
        }
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  /**
   * Create a new recipient group
   * Returns the created group on success, null on failure
   */
  const createGroup = useCallback(
    async (
      input: Graphql.TemplateRecipientGroupCreateInput,
    ): Promise<Graphql.TemplateRecipientGroup | null> => {
      try {
        const result = await apollo.createTemplateRecipientGroupMutation({
          input,
        });

        if (result.data) {
          notifications.show(strings.groupCreated, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return result.data.createTemplateRecipientGroup;
        }

        logger.error("Error creating recipient group:", result.errors);
        notifications.show(strings.errorCreating, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return null;
      } catch (error) {
        const gqlError = error as {
          message?: string;
          graphQLErrors?: Array<{ message: string }>;
        };
        const errorMessage =
          gqlError.graphQLErrors?.[0]?.message ||
          gqlError.message ||
          strings.errorCreating;

        logger.error("Error creating recipient group:", error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  /**
   * Update an existing recipient group
   * Returns the updated group on success, null on failure
   */
  const updateGroup = useCallback(
    async (
      input: Graphql.TemplateRecipientGroupUpdateInput,
    ): Promise<Graphql.TemplateRecipientGroup | null> => {
      try {
        const result = await apollo.updateTemplateRecipientGroupMutation({
          input,
        });

        if (result.data) {
          notifications.show(strings.groupUpdated, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return result.data.updateTemplateRecipientGroup;
        }

        logger.error("Error updating recipient group:", result.errors);
        notifications.show(strings.errorUpdating, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return null;
      } catch (error) {
        const gqlError = error as {
          message?: string;
          graphQLErrors?: Array<{ message: string }>;
        };
        const errorMessage =
          gqlError.graphQLErrors?.[0]?.message ||
          gqlError.message ||
          strings.errorUpdating;

        logger.error("Error updating recipient group:", error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  /**
   * Update recipient group name (convenience method)
   * Returns the updated group on success, null on failure
   */
  const updateGroupName = useCallback(
    async (
      id: number,
      name: string,
    ): Promise<Graphql.TemplateRecipientGroup | null> => {
      return updateGroup({ id, name });
    },
    [updateGroup],
  );

  /**
   * Delete a recipient group
   * Returns true on success, false on failure
   */
  const deleteGroup = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const result = await apollo.deleteTemplateRecipientGroupMutation({
          id,
        });

        if (result.data) {
          notifications.show(strings.groupDeleted, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }

        logger.error("Error deleting recipient group:", result.errors);
        notifications.show(strings.errorDeleting, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch (error) {
        const gqlError = error as {
          message?: string;
          graphQLErrors?: Array<{ message: string }>;
        };
        const errorMessage =
          gqlError.graphQLErrors?.[0]?.message ||
          gqlError.message ||
          strings.errorDeleting;

        logger.error("Error deleting recipient group:", error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return false;
      }
    },
    [apollo, notifications, strings],
  );

  return useMemo(
    () => ({
      fetchGroupsByTemplateId,
      createGroup,
      updateGroup,
      updateGroupName,
      deleteGroup,
    }),
    [
      fetchGroupsByTemplateId,
      createGroup,
      updateGroup,
      updateGroupName,
      deleteGroup,
    ],
  );
};
