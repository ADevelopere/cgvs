"use client";

import { useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";
import { useTemplateVariableUIStore } from "../stores";
import { useTemplateVariableApolloMutations } from "./useTemplateVariableApolloMutations";

/**
 * Template Variable Operations Hook
 * Follows TemplatePane pattern - only handles mutations and notifications
 */
export const useTemplateVariableOperations = () => {
  const apollo = useTemplateVariableApolloMutations();
  const setOperationError = useTemplateVariableUIStore(
    (state) => state.setOperationError,
  );
  const notifications = useNotifications();
  const strings = useAppTranslation("templateVariableTranslations");

  // Create variable helper
  const createVariable = useCallback(
    async (
      type: Graphql.TemplateVariableType,
      input:
        | Graphql.TemplateTextVariableCreateInput
        | Graphql.TemplateNumberVariableCreateInput
        | Graphql.TemplateDateVariableCreateInput
        | Graphql.TemplateSelectVariableCreateInput,
    ): Promise<void> => {
      try {
        setOperationError("create", null);

        let result;
        switch (type) {
          case "TEXT":
            result = await apollo.createTextVariableMutation({
              variables: {
                input: input as Graphql.TemplateTextVariableCreateInput,
              },
            });
            break;
          case "NUMBER":
            result = await apollo.createNumberVariableMutation({
              variables: {
                input: input as Graphql.TemplateNumberVariableCreateInput,
              },
            });
            break;
          case "DATE":
            result = await apollo.createDateVariableMutation({
              variables: {
                input: input as Graphql.TemplateDateVariableCreateInput,
              },
            });
            break;
          case "SELECT":
            result = await apollo.createSelectVariableMutation({
              variables: {
                input: input as Graphql.TemplateSelectVariableCreateInput,
              },
            });
            break;
          default:
            throw new Error(`Unsupported variable type: ${type}`);
        }

        if (result.data) {
          notifications.show(strings.variableAddedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
        } else {
          logger.error(
            `Error creating ${type.toLowerCase()} variable:`,
            result.error,
          );
          notifications.show(strings.variableAddFailed, {
            severity: "error",
            autoHideDuration: 3000,
          });
        }
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
      }
    },
    [apollo, notifications, strings, setOperationError],
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
    ): Promise<void> => {
      try {
        setOperationError("update", null);

        let result;
        switch (type) {
          case "TEXT":
            result = await apollo.updateTextVariableMutation({
              variables: {
                input: input as Graphql.TemplateTextVariableUpdateInput,
              },
            });
            break;
          case "NUMBER":
            result = await apollo.updateNumberVariableMutation({
              variables: {
                input: input as Graphql.TemplateNumberVariableUpdateInput,
              },
            });
            break;
          case "DATE":
            result = await apollo.updateDateVariableMutation({
              variables: {
                input: input as Graphql.TemplateDateVariableUpdateInput,
              },
            });
            break;
          case "SELECT":
            result = await apollo.updateSelectVariableMutation({
              variables: {
                input: input as Graphql.TemplateSelectVariableUpdateInput,
              },
            });
            break;
          default:
            throw new Error(`Unsupported variable type: ${type}`);
        }

        if (result.data) {
          notifications.show(strings.variableUpdatedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
        } else {
          logger.error(
            `Error updating ${type.toLowerCase()} variable:`,
            result.error,
          );
          notifications.show(strings.variableUpdateFailed, {
            severity: "error",
            autoHideDuration: 3000,
          });
        }
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
      }
    },
    [apollo, notifications, strings, setOperationError],
  );

  // Delete variable helper
  const deleteVariable = useCallback(
    async (id: number): Promise<void> => {
      try {
        setOperationError("delete", null);

        const result = await apollo.deleteVariableMutation({
          variables: { id },
        });

        if (result.data) {
          notifications.show(strings.variableDeletedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
        } else {
          logger.error("Error deleting variable:", result.error);
          notifications.show(strings.variableDeleteFailed, {
            severity: "error",
            autoHideDuration: 3000,
          });
        }
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
      }
    },
    [apollo, notifications, strings, setOperationError],
  );

  return useMemo(
    () => ({
      createVariable,
      updateVariable,
      deleteVariable,
    }),
    [createVariable, updateVariable, deleteVariable],
  );
};
