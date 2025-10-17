"use client";

import { useEffect } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useRecipientGroupDataStore } from "../stores/useRecipientGroupDataStore";
import { useRecipientGroupDialogStore } from "../stores/useRecipientGroupDialogStore";
import { 
  useRecipientGroupApolloQueries, 
  useRecipientGroupApolloMutations 
} from "./recipientGroup.operations";
import logger from "@/lib/logger";

/**
 * Business Logic Hook for Recipient Group Operations
 * Composes stores and operations with error handling and notifications
 */
export const useRecipientGroupOperations = (templateId: number) => {
  const dataStore = useRecipientGroupDataStore();
  const dialogStore = useRecipientGroupDialogStore();
  const { groups, loading, error, refetch } = useRecipientGroupApolloQueries(templateId);
  const mutations = useRecipientGroupApolloMutations();
  const notifications = useNotifications();
  const strings = useAppTranslation("recipientGroupTranslations");
  
  // Sync query data with store
  useEffect(() => {
    dataStore.setTemplateId(templateId);
    dataStore.setGroups(groups);
    dataStore.setLoading(loading);
    dataStore.setError(error?.message || null);
  }, [templateId, groups, loading, error, dataStore]);
  
  const createGroup = async (input: Graphql.TemplateRecipientGroupCreateInput): Promise<boolean> => {
    try {
      logger.log("Creating recipient group", input);
      const result = await mutations.createGroup(input);
      
      if (result.data?.createTemplateRecipientGroup) {
        notifications.show(strings.groupCreated || "Group created successfully", {
          severity: "success",
          autoHideDuration: 3000,
        });
        dialogStore.closeCreateDialog();
        return true;
      }
      
      logger.error("Error creating recipient group:", result.errors);
      notifications.show(strings.errorCreating || "Failed to create group", {
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
        strings.errorCreating ||
        "Failed to create group";

      logger.error("Error creating recipient group:", error);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 5000,
      });
      return false;
    }
  };
  
  const updateGroup = async (input: Graphql.TemplateRecipientGroupUpdateInput): Promise<boolean> => {
    try {
      logger.log("Updating recipient group", input);
      const result = await mutations.updateGroup(input);
      
      if (result.data?.updateTemplateRecipientGroup) {
        notifications.show(strings.groupUpdated || "Group updated successfully", {
          severity: "success",
          autoHideDuration: 3000,
        });
        dialogStore.closeSettingsDialog();
        return true;
      }
      
      logger.error("Error updating recipient group:", result.errors);
      notifications.show(strings.errorUpdating || "Failed to update group", {
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
        strings.errorUpdating ||
        "Failed to update group";

      logger.error("Error updating recipient group:", error);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 5000,
      });
      return false;
    }
  };
  
  const updateGroupName = async (id: number, name: string): Promise<boolean> => {
    return updateGroup({ id, name });
  };
  
  const deleteGroup = async (id: number): Promise<boolean> => {
    try {
      logger.log("Deleting recipient group", { id });
      const result = await mutations.deleteGroup(id);
      
      if (result.data?.deleteTemplateRecipientGroup) {
        notifications.show(strings.groupDeleted || "Group deleted successfully", {
          severity: "success",
          autoHideDuration: 3000,
        });
        dialogStore.closeDeleteDialog();
        return true;
      }
      
      logger.error("Error deleting recipient group:", result.errors);
      notifications.show(strings.errorDeleting || "Failed to delete group", {
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
        strings.errorDeleting ||
        "Failed to delete group";

      logger.error("Error deleting recipient group:", error);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 5000,
      });
      return false;
    }
  };
  
  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    updateGroupName,
    deleteGroup,
    refetch
  };
};
