"use client";

import { useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useTemplateVariableGraphQL } from "@/client/graphql/apollo/templateVariable/templateVariable.apollo";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";
import { isAbortError } from "@/client/utils/errorUtils";

/**
 * Template Variable Service Hook
 *
 * Provides data operations for template variables without state management.
 * All functions return values directly and handle errors internally
 * by logging and showing notifications.
 *
 * Supports all variable types: Text, Number, Date, and Select
 */
export const useTemplateVariableService = () => {
  const apollo = useTemplateVariableGraphQL();
  const notifications = useNotifications();
  const strings = useAppTranslation("templateVariableTranslations");

  // ==================== TEXT VARIABLE OPERATIONS ====================

  /**
   * Create a new text template variable
   * Returns the created variable on success, null on failure
   */
  const createTextVariable = useCallback(
    async (
      input: Graphql.CreateTemplateTextVariableMutationVariables["input"],
    ): Promise<Graphql.TemplateTextVariable | null> => {
      try {
        const result = await apollo.createTemplateTextVariableMutation({
          input,
        });

        if (result.data) {
          notifications.show(
            strings.variableAddedSuccessfully || "Variable added successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return result.data.createTemplateTextVariable;
        }

        logger.error("Error creating text variable:", result.errors);
        notifications.show(
          strings.variableAddFailed || "Failed to add variable",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
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

        logger.error("Error creating text variable:", error);
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
   * Update an existing text template variable
   * Returns the updated variable on success, null on failure
   */
  const updateTextVariable = useCallback(
    async (
      input: Graphql.UpdateTemplateTextVariableMutationVariables["input"],
    ): Promise<Graphql.TemplateTextVariable | null> => {
      try {
        const result = await apollo.updateTemplateTextVariableMutation({
          input,
        });

        if (result.data) {
          notifications.show(
            strings.variableUpdatedSuccessfully ||
              "Variable updated successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return result.data.updateTemplateTextVariable;
        }

        logger.error("Error updating text variable:", result.errors);
        notifications.show(
          strings.variableUpdateFailed || "Failed to update variable",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
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

        logger.error("Error updating text variable:", error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  // ==================== NUMBER VARIABLE OPERATIONS ====================

  /**
   * Create a new number template variable
   * Returns the created variable on success, null on failure
   */
  const createNumberVariable = useCallback(
    async (
      input: Graphql.CreateTemplateNumberVariableMutationVariables["input"],
    ): Promise<Graphql.TemplateNumberVariable | null> => {
      try {
        const result = await apollo.createTemplateNumberVariableMutation({
          input,
        });

        if (result.data) {
          notifications.show(
            strings.variableAddedSuccessfully || "Variable added successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return result.data.createTemplateNumberVariable;
        }

        logger.error("Error creating number variable:", result.errors);
        notifications.show(
          strings.variableAddFailed || "Failed to add variable",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
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

        logger.error("Error creating number variable:", error);
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
   * Update an existing number template variable
   * Returns the updated variable on success, null on failure
   */
  const updateNumberVariable = useCallback(
    async (
      input: Graphql.UpdateTemplateNumberVariableMutationVariables["input"],
    ): Promise<Graphql.TemplateNumberVariable | null> => {
      try {
        const result = await apollo.updateTemplateNumberVariableMutation({
          input,
        });

        if (result.data) {
          notifications.show(
            strings.variableUpdatedSuccessfully ||
              "Variable updated successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return result.data.updateTemplateNumberVariable;
        }

        logger.error("Error updating number variable:", result.errors);
        notifications.show(
          strings.variableUpdateFailed || "Failed to update variable",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
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

        logger.error("Error updating number variable:", error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  // ==================== DATE VARIABLE OPERATIONS ====================

  /**
   * Create a new date template variable
   * Returns the created variable on success, null on failure
   */
  const createDateVariable = useCallback(
    async (
      input: Graphql.CreateTemplateDateVariableMutationVariables["input"],
    ): Promise<Graphql.TemplateDateVariable | null> => {
      try {
        const result = await apollo.createTemplateDateVariableMutation({
          input,
        });

        if (result.data) {
          notifications.show(
            strings.variableAddedSuccessfully || "Variable added successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return result.data.createTemplateDateVariable;
        }

        logger.error("Error creating date variable:", result.errors);
        notifications.show(
          strings.variableAddFailed || "Failed to add variable",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
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

        logger.error("Error creating date variable:", error);
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
   * Update an existing date template variable
   * Returns the updated variable on success, null on failure
   */
  const updateDateVariable = useCallback(
    async (
      input: Graphql.UpdateTemplateDateVariableMutationVariables["input"],
    ): Promise<Graphql.TemplateDateVariable | null> => {
      try {
        const result = await apollo.updateTemplateDateVariableMutation({
          input,
        });

        if (result.data) {
          notifications.show(
            strings.variableUpdatedSuccessfully ||
              "Variable updated successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return result.data.updateTemplateDateVariable;
        }

        logger.error("Error updating date variable:", result.errors);
        notifications.show(
          strings.variableUpdateFailed || "Failed to update variable",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
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

        logger.error("Error updating date variable:", error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  // ==================== SELECT VARIABLE OPERATIONS ====================

  /**
   * Create a new select template variable
   * Returns the created variable on success, null on failure
   */
  const createSelectVariable = useCallback(
    async (
      input: Graphql.CreateTemplateSelectVariableMutationVariables["input"],
    ): Promise<Graphql.TemplateSelectVariable | null> => {
      try {
        const result = await apollo.createTemplateSelectVariableMutation({
          input,
        });

        if (result.data) {
          notifications.show(
            strings.variableAddedSuccessfully || "Variable added successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return result.data.createTemplateSelectVariable;
        }

        logger.error("Error creating select variable:", result.errors);
        notifications.show(
          strings.variableAddFailed || "Failed to add variable",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
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

        logger.error("Error creating select variable:", error);
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
   * Update an existing select template variable
   * Returns the updated variable on success, null on failure
   */
  const updateSelectVariable = useCallback(
    async (
      input: Graphql.UpdateTemplateSelectVariableMutationVariables["input"],
    ): Promise<Graphql.TemplateSelectVariable | null> => {
      try {
        const result = await apollo.updateTemplateSelectVariableMutation({
          input,
        });

        if (result.data) {
          notifications.show(
            strings.variableUpdatedSuccessfully ||
              "Variable updated successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return result.data.updateTemplateSelectVariable;
        }

        logger.error("Error updating select variable:", result.errors);
        notifications.show(
          strings.variableUpdateFailed || "Failed to update variable",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
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

        logger.error("Error updating select variable:", error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  // ==================== COMMON OPERATIONS ====================

  /**
   * Delete a template variable (any type)
   * Returns true on success, false on failure
   */
  const deleteVariable = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const result = await apollo.deleteTemplateVariableMutation({ id });

        if (result.data) {
          notifications.show(
            strings.variableDeletedSuccessfully ||
              "Variable deleted successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return true;
        }

        logger.error("Error deleting variable:", result.errors);
        notifications.show(
          strings.variableDeleteFailed || "Failed to delete variable",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
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
      // Text variable operations
      createTextVariable,
      updateTextVariable,
      // Number variable operations
      createNumberVariable,
      updateNumberVariable,
      // Date variable operations
      createDateVariable,
      updateDateVariable,
      // Select variable operations
      createSelectVariable,
      updateSelectVariable,
      // Common operations
      deleteVariable,
    }),
    [
      createTextVariable,
      updateTextVariable,
      createNumberVariable,
      updateNumberVariable,
      createDateVariable,
      updateDateVariable,
      createSelectVariable,
      updateSelectVariable,
      deleteVariable,
    ],
  );
};
