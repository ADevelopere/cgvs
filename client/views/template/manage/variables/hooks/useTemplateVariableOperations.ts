"use client";

import { useEffect, useCallback, useRef } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";
import {
  useTemplateVariableDataStore,
  useTemplateVariableUIStore,
} from "../stores";
import {
  useTemplateVariableApolloQueries,
  useTemplateVariableApolloMutations,
} from "./templateVariable.operations";

/**
 * Main operations hook for template variables
 * Combines data store + Apollo queries/mutations with error handling
 */
export const useTemplateVariableOperations = (templateId: number) => {
  // Track previous templateId to avoid unnecessary updates
  const prevTemplateIdRef = useRef<number | null>(null);

  // Extract stable action references from stores
  const setTemplateId = useTemplateVariableDataStore(
    (state) => state.setTemplateId,
  );
  const setVariables = useTemplateVariableDataStore(
    (state) => state.setVariables,
  );
  const setLoading = useTemplateVariableDataStore((state) => state.setLoading);
  const setError = useTemplateVariableDataStore((state) => state.setError);
  const storeVariables = useTemplateVariableDataStore(
    (state) => state.variables,
  );
  const storeLoading = useTemplateVariableDataStore((state) => state.loading);
  const storeError = useTemplateVariableDataStore((state) => state.error);

  const setOperationError = useTemplateVariableUIStore(
    (state) => state.setOperationError,
  );

  const { variables, loading, error, refetch } =
    useTemplateVariableApolloQueries(templateId);
  const mutations = useTemplateVariableApolloMutations();
  const notifications = useNotifications();
  const strings = useAppTranslation("templateVariableTranslations");

  // Sync query data with store
  useEffect(() => {
    // Only update if templateId actually changed
    if (prevTemplateIdRef.current !== templateId) {
      setTemplateId(templateId);
      prevTemplateIdRef.current = templateId;
    }

    setVariables(variables);
    setLoading(loading);
    setError(error?.message ?? null);
    // Zustand setters are stable and don't need to be in deps
    // Only include data that actually changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, variables, loading, error]);

  // Create variable helper
  const createVariable = useCallback(
    async (
      type: Graphql.TemplateVariableType,
      input:
        | Graphql.TemplateTextVariableCreateInput
        | Graphql.TemplateNumberVariableCreateInput
        | Graphql.TemplateDateVariableCreateInput
        | Graphql.TemplateSelectVariableCreateInput,
    ): Promise<Graphql.TemplateVariable | null> => {
      try {
        setOperationError("create", null);
        setLoading(true);

        let result;
        switch (type) {
          case "TEXT":
            result = await mutations.createTextVariable({
              variables: {
                input: input as Graphql.TemplateTextVariableCreateInput,
              },
            });
            break;
          case "NUMBER":
            result = await mutations.createNumberVariable({
              variables: {
                input: input as Graphql.TemplateNumberVariableCreateInput,
              },
            });
            break;
          case "DATE":
            result = await mutations.createDateVariable({
              variables: {
                input: input as Graphql.TemplateDateVariableCreateInput,
              },
            });
            break;
          case "SELECT":
            result = await mutations.createSelectVariable({
              variables: {
                input: input as Graphql.TemplateSelectVariableCreateInput,
              },
            });
            break;
          default:
            throw new Error(`Unsupported variable type: ${type}`);
        }

        if (result.data) {
          const createdVariable = result.data[
            `createTemplate${type}Variable` as keyof typeof result.data
          ] as Graphql.TemplateVariable;

          notifications.show(strings.variableAddedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });

          return createdVariable;
        }

        logger.error(
          `Error creating ${type.toLowerCase()} variable:`,
          result.error,
        );
        notifications.show(strings.variableAddFailed, {
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
          strings.variableAddFailed;

        logger.error(`Error creating ${type.toLowerCase()} variable:`, error);
        setOperationError("create", errorMessage);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [mutations, notifications, strings, setOperationError, setLoading],
  );

  // Update variable helper
  const updateVariable = useCallback(
    async (
      type: Graphql.TemplateVariableType,
      input:
        | Graphql.TemplateTextVariableUpdateInput
        | Graphql.TemplateNumberVariableUpdateInput
        | Graphql.TemplateDateVariableUpdateInput
        | Graphql.TemplateSelectVariableUpdateInput,
    ): Promise<Graphql.TemplateVariable | null> => {
      try {
        setOperationError("update", null);
        setLoading(true);

        let result;
        switch (type) {
          case "TEXT":
            result = await mutations.updateTextVariable({
              variables: {
                input: input as Graphql.TemplateTextVariableUpdateInput,
              },
            });
            break;
          case "NUMBER":
            result = await mutations.updateNumberVariable({
              variables: {
                input: input as Graphql.TemplateNumberVariableUpdateInput,
              },
            });
            break;
          case "DATE":
            result = await mutations.updateDateVariable({
              variables: {
                input: input as Graphql.TemplateDateVariableUpdateInput,
              },
            });
            break;
          case "SELECT":
            result = await mutations.updateSelectVariable({
              variables: {
                input: input as Graphql.TemplateSelectVariableUpdateInput,
              },
            });
            break;
          default:
            throw new Error(`Unsupported variable type: ${type}`);
        }

        if (result.data) {
          const updatedVariable = result.data[
            `updateTemplate${type}Variable` as keyof typeof result.data
          ] as Graphql.TemplateVariable;

          notifications.show(strings.variableUpdatedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });

          return updatedVariable;
        }

        logger.error(
          `Error updating ${type.toLowerCase()} variable:`,
          result.error,
        );
        notifications.show(strings.variableUpdateFailed, {
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
          strings.variableUpdateFailed;

        logger.error(`Error updating ${type.toLowerCase()} variable:`, error);
        setOperationError("update", errorMessage);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [mutations, notifications, strings, setOperationError, setLoading],
  );

  // Delete variable helper
  const deleteVariable = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setOperationError("delete", null);
        setLoading(true);

        const result = await mutations.deleteVariable({ variables: { id } });

        if (result.data) {
          notifications.show(strings.variableDeletedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }

        logger.error("Error deleting variable:", result.error);
        notifications.show(strings.variableDeleteFailed, {
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
          strings.variableDeleteFailed;

        logger.error("Error deleting variable:", error);
        setOperationError("delete", errorMessage);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [mutations, notifications, strings, setOperationError, setLoading],
  );

  return {
    // Data from store
    variables: storeVariables,
    loading: storeLoading,
    error: storeError,

    // Operations
    createVariable,
    updateVariable,
    deleteVariable,
    refetch,
  };
};
