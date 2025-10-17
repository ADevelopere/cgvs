"use client";

import { useEffect, useCallback } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";
import { useTemplateVariableDataStore, useTemplateVariableUIStore } from "../stores";
import { useTemplateVariableApolloQueries, useTemplateVariableApolloMutations } from "./templateVariable.operations";

/**
 * Main operations hook for template variables
 * Combines data store + Apollo queries/mutations with error handling
 */
export const useTemplateVariableOperations = (templateId: number) => {
  const dataStore = useTemplateVariableDataStore();
  const uiStore = useTemplateVariableUIStore();
  const { variables, loading, error, refetch } = useTemplateVariableApolloQueries(templateId);
  const mutations = useTemplateVariableApolloMutations();
  const notifications = useNotifications();
  const strings = useAppTranslation("templateVariableTranslations");

  // Sync query data with store
  useEffect(() => {
    dataStore.setTemplateId(templateId);
    dataStore.setVariables(variables);
    dataStore.setLoading(loading);
    dataStore.setError(error?.message || null);
  }, [templateId, variables, loading, error, dataStore]);

  // Create variable helper
  const createVariable = useCallback(async (
    type: Graphql.TemplateVariableType,
    input: any
  ): Promise<Graphql.TemplateVariable | null> => {
    try {
      uiStore.setOperationError("create", null);
      dataStore.setLoading(true);

      let result;
      switch (type) {
        case "TEXT":
          result = await mutations.createTextVariable({ variables: { input } });
          break;
        case "NUMBER":
          result = await mutations.createNumberVariable({ variables: { input } });
          break;
        case "DATE":
          result = await mutations.createDateVariable({ variables: { input } });
          break;
        case "SELECT":
          result = await mutations.createSelectVariable({ variables: { input } });
          break;
        default:
          throw new Error(`Unsupported variable type: ${type}`);
      }

      if (result.data) {
        const createdVariable = result.data[`createTemplate${type}Variable` as keyof typeof result.data] as Graphql.TemplateVariable;
        
        notifications.show(
          strings.variableAddedSuccessfully || "Variable added successfully",
          {
            severity: "success",
            autoHideDuration: 3000,
          }
        );
        
        return createdVariable;
      }

      logger.error(`Error creating ${type.toLowerCase()} variable:`, result.errors);
      notifications.show(
        strings.variableAddFailed || "Failed to add variable",
        {
          severity: "error",
          autoHideDuration: 3000,
        }
      );
      return null;
    } catch (error) {
      const gqlError = error as {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      };
      const errorMessage =
        gqlError.graphQLErrors?.[0]?.message ||
        gqlError.message ||
        strings.variableAddFailed ||
        "Failed to add variable";

      logger.error(`Error creating ${type.toLowerCase()} variable:`, error);
      uiStore.setOperationError("create", errorMessage);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 5000,
      });
      return null;
    } finally {
      dataStore.setLoading(false);
    }
  }, [mutations, notifications, strings, uiStore, dataStore]);

  // Update variable helper
  const updateVariable = useCallback(async (
    id: number,
    type: Graphql.TemplateVariableType,
    input: any
  ): Promise<Graphql.TemplateVariable | null> => {
    try {
      uiStore.setOperationError("update", null);
      dataStore.setLoading(true);

      let result;
      switch (type) {
        case "TEXT":
          result = await mutations.updateTextVariable({ variables: { input: { ...input, id } } });
          break;
        case "NUMBER":
          result = await mutations.updateNumberVariable({ variables: { input: { ...input, id } } });
          break;
        case "DATE":
          result = await mutations.updateDateVariable({ variables: { input: { ...input, id } } });
          break;
        case "SELECT":
          result = await mutations.updateSelectVariable({ variables: { input: { ...input, id } } });
          break;
        default:
          throw new Error(`Unsupported variable type: ${type}`);
      }

      if (result.data) {
        const updatedVariable = result.data[`updateTemplate${type}Variable` as keyof typeof result.data] as Graphql.TemplateVariable;
        
        notifications.show(
          strings.variableUpdatedSuccessfully || "Variable updated successfully",
          {
            severity: "success",
            autoHideDuration: 3000,
          }
        );
        
        return updatedVariable;
      }

      logger.error(`Error updating ${type.toLowerCase()} variable:`, result.errors);
      notifications.show(
        strings.variableUpdateFailed || "Failed to update variable",
        {
          severity: "error",
          autoHideDuration: 3000,
        }
      );
      return null;
    } catch (error) {
      const gqlError = error as {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      };
      const errorMessage =
        gqlError.graphQLErrors?.[0]?.message ||
        gqlError.message ||
        strings.variableUpdateFailed ||
        "Failed to update variable";

      logger.error(`Error updating ${type.toLowerCase()} variable:`, error);
      uiStore.setOperationError("update", errorMessage);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 5000,
      });
      return null;
    } finally {
      dataStore.setLoading(false);
    }
  }, [mutations, notifications, strings, uiStore, dataStore]);

  // Delete variable helper
  const deleteVariable = useCallback(async (id: number): Promise<boolean> => {
    try {
      uiStore.setOperationError("delete", null);
      dataStore.setLoading(true);

      const result = await mutations.deleteVariable({ variables: { id } });

      if (result.data) {
        notifications.show(
          strings.variableDeletedSuccessfully || "Variable deleted successfully",
          {
            severity: "success",
            autoHideDuration: 3000,
          }
        );
        return true;
      }

      logger.error("Error deleting variable:", result.errors);
      notifications.show(
        strings.variableDeleteFailed || "Failed to delete variable",
        {
          severity: "error",
          autoHideDuration: 3000,
        }
      );
      return false;
    } catch (error) {
      const gqlError = error as {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      };
      const errorMessage =
        gqlError.graphQLErrors?.[0]?.message ||
        gqlError.message ||
        strings.variableDeleteFailed ||
        "Failed to delete variable";

      logger.error("Error deleting variable:", error);
      uiStore.setOperationError("delete", errorMessage);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 5000,
      });
      return false;
    } finally {
      dataStore.setLoading(false);
    }
  }, [mutations, notifications, strings, uiStore, dataStore]);

  return {
    // Data from store
    variables: dataStore.variables,
    loading: dataStore.loading,
    error: dataStore.error,
    
    // Operations
    createVariable,
    updateVariable,
    deleteVariable,
    refetch,
    
    // Store access for advanced usage
    dataStore,
    uiStore,
  };
};
