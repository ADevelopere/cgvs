"use client";

import { useCallback, useMemo } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import logger from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useRecipientGroupApolloMutations } from "./useRecipientGroupApolloMutations";
import { useRecipientGroupDialogStore } from "../stores/useRecipientGroupDialogStore";

/**
 * Template Recipient Group Service Hook
 *
 * Provides data operations for template recipient groups
 */
export const useRecipientGroupOperations = () => {
  const recipientGroupApollo = useRecipientGroupApolloMutations();
  const notifications = useNotifications();
  const strings = useAppTranslation("recipientGroupTranslations");

  // Get the dialog store setters
  const { closeCreateDialog, closeSettingsDialog, closeDeleteDialog } =
    useRecipientGroupDialogStore();

  /**
   * Create a new template recipient group.
   */
  const createGroup = useCallback(
    async (input: Graphql.TemplateRecipientGroupCreateInput): Promise<void> => {
      try {
        const result =
          await recipientGroupApollo.createTemplateRecipientGroupMutation({
            variables: { input },
          });

        if (result.data) {
          notifications.show(
            strings.groupCreated || "Group created successfully",
            {
              severity: "success",
            }
          );
          closeCreateDialog();
        } else {
          logger.error(
            "Error creating template recipient group:",
            result.error
          );
          notifications.show(
            strings.errorCreating || "Failed to create group",
            {
              severity: "error",
            }
          );
        }
      } catch (error) {
        const gqlError = error as {
          message?: string;
          graphQLErrors?: Array<{ message: string }>;
        };
        const errorMessage =
          gqlError.graphQLErrors?.[0]?.message ||
          gqlError.message ||
          strings.errorCreating ||
          "Failed to create group";

        logger.error("Error creating template recipient group:", error);
        notifications.show(errorMessage, { severity: "error" });
      }
    },
    [recipientGroupApollo, notifications, strings, closeCreateDialog]
  );

  /**
   * Update an existing template recipient group.
   */
  const updateGroup = useCallback(
    async (input: Graphql.TemplateRecipientGroupUpdateInput): Promise<void> => {
      try {
        const result =
          await recipientGroupApollo.updateTemplateRecipientGroupMutation({
            variables: { input },
          });

        if (result.data) {
          notifications.show(
            strings.groupUpdated || "Group updated successfully",
            {
              severity: "success",
            }
          );
          closeSettingsDialog();
        } else {
          logger.error(
            "Error updating template recipient group:",
            result.error
          );
          notifications.show(
            strings.errorUpdating || "Failed to update group",
            {
              severity: "error",
            }
          );
        }
      } catch (error) {
        const gqlError = error as {
          message?: string;
          graphQLErrors?: Array<{ message: string }>;
        };
        const errorMessage =
          gqlError.graphQLErrors?.[0]?.message ||
          gqlError.message ||
          strings.errorUpdating ||
          "Failed to update group";

        logger.error("Error updating template recipient group:", error);
        notifications.show(errorMessage, { severity: "error" });
      }
    },
    [recipientGroupApollo, notifications, strings, closeSettingsDialog]
  );

  /**
   * Delete a template recipient group.
   */
  const deleteGroup = useCallback(
    async (id: number): Promise<void> => {
      try {
        const result =
          await recipientGroupApollo.deleteTemplateRecipientGroupMutation({
            variables: { id },
          });

        if (result.data) {
          notifications.show(
            strings.groupDeleted || "Group deleted successfully",
            {
              severity: "success",
            }
          );
          closeDeleteDialog();
        } else {
          logger.error(
            "Error deleting template recipient group:",
            result.error
          );
          notifications.show(
            strings.errorDeleting || "Failed to delete group",
            {
              severity: "error",
            }
          );
        }
      } catch (error) {
        const gqlError = error as {
          message?: string;
          graphQLErrors?: Array<{ message: string }>;
        };
        const errorMessage =
          gqlError.graphQLErrors?.[0]?.message ||
          gqlError.message ||
          strings.errorDeleting ||
          "Failed to delete group";

        logger.error("Error deleting template recipient group:", error);
        notifications.show(errorMessage, { severity: "error" });
      }
    },
    [recipientGroupApollo, notifications, strings, closeDeleteDialog]
  );

  return useMemo(
    () => ({
      createGroup,
      updateGroup,
      deleteGroup,
    }),
    [createGroup, updateGroup, deleteGroup]
  );
};
