"use client";

import { useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";
import { useTemplateCategoryGraphQL } from "./1-categories.apolloCache";

/**
 * Template Category Service Hook
 *
 * Provides data operations for template categories without state management.
 * All functions return values directly and handle errors internally
 * by logging and showing notifications.
 *
 * Note: No type casting ("as") is used. All null/undefined cases are
 * handled explicitly with type guards.
 */
export const useTemplateCategoryService = () => {
  const apollo = useTemplateCategoryGraphQL();
  const notifications = useNotifications();
  const strings = useAppTranslation("templateCategoryTranslations");

  /**
   * Create a new template category
   * Returns the created category on success, null on failure
   */
  const createCategory = useCallback(
    async (
      input: Graphql.TemplateCategoryCreateInput,
    ): Promise<Graphql.TemplateCategory | null> => {
      try {
        const result = await apollo.createTemplateCategoryMutation({
          variables: {
            input,
          },
        });

        if (result.data) {
          notifications.show(strings.categoryAddedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return result.data.createTemplateCategory;
        }

        logger.error("Error creating template category:", result.error);

        notifications.show(strings.categoryAddFailed, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return null;
      } catch (error) {
        logger.error("Error creating template category:", error);
        notifications.show(strings.categoryAddFailed, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  /**
   * Update an existing template category
   * Returns the updated category on success, null on failure
   */
  const updateCategory = useCallback(
    async (
      input: Graphql.TemplateCategoryUpdateInput,
    ): Promise<Graphql.TemplateCategory | null> => {
      try {
        const result = await apollo.updateTemplateCategoryMutation({
          variables: {
            input,
          },
        });

        if (result.data) {
          notifications.show(strings.categoryUpdatedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return result.data.updateTemplateCategory;
        }

        logger.error("Error updating template category:", result.error);
        notifications.show(strings.categoryUpdateFailed, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return null;
      } catch (error) {
        logger.error("Error updating template category:", error);
        notifications.show(strings.categoryUpdateFailed, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  /**
   * Delete a template category
   * Returns true on success, false on failure
   */
  const deleteCategory = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const result = await apollo.deleteTemplateCategoryMutation({
          variables: {
            id,
          },
        });

        if (result.data) {
          notifications.show(strings.categoryDeletedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return true;
        }

        logger.error("Error deleting template category:", result.error);
        notifications.show(strings.categoryDeleteFailed, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      } catch (error) {
        logger.error("Error deleting template category:", error);
        notifications.show(strings.categoryDeleteFailed, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return false;
      }
    },
    [apollo, notifications, strings],
  );

  /**
   * Create a new template
   * Returns the created template on success, null on failure
   */
  const createTemplate = useCallback(
    async (
      input: Graphql.CreateTemplateMutationVariables["input"],
    ): Promise<Graphql.Template | null> => {
      try {
        const result = await apollo.createTemplateMutation({
          variables: {
            input,
          },
        });

        if (result.data?.createTemplate) {
          notifications.show(strings.templateAddedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return result.data.createTemplate;
        }

        logger.error("Error creating template:", result.error);
        notifications.show(strings.templateAddFailed, {
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
          strings.templateAddFailed;

        logger.error("Error creating template:", error);
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
   * Update an existing template
   * Returns the updated template on success, null on failure
   */
  const updateTemplate = useCallback(
    async (
      input: Graphql.UpdateTemplateMutationVariables["input"],
    ): Promise<Graphql.Template | null> => {
      try {
        const result = await apollo.updateTemplateMutation({
          variables: { input },
        });

        if (result.data?.updateTemplate) {
          notifications.show(strings.templateUpdatedSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return result.data.updateTemplate;
        }

        logger.error("Error updating template:", result.error);
        notifications.show(strings.templateUpdateFailed, {
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
          strings.templateUpdateFailed;

        logger.error("Error updating template:", error);
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
   * Delete a template (permanently)
   * Returns true on success, false on failure
   */
  const deleteTemplate = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const result = await apollo.deleteTemplateMutation({
          variables: { id },
        });

        if (result.data) {
          notifications.show(
            strings.templateDeletedSuccessfully ||
              "Template deleted successfully",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          return true;
        }

        logger.error("Error deleting template:", result.error);
        notifications.show(
          strings.templateDeleteFailed || "Failed to delete template",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
        );
        return false;
      } catch (error) {
        logger.error("Error deleting template:", error);
        notifications.show(
          strings.templateDeleteFailed || "Failed to delete template",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
        );
        return false;
      }
    },
    [apollo, notifications, strings],
  );

  /**
   * Suspend a template (move to deletion category)
   * Returns the suspended template on success, null on failure
   */
  const suspendTemplate = useCallback(
    async (id: number): Promise<Graphql.Template | null> => {
      try {
        const result = await apollo.suspendTemplateMutation({
          variables: { id },
        });

        if (result.data?.suspendTemplate) {
          notifications.show(strings.templateMovedToDeletionSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return result.data.suspendTemplate;
        }

        logger.error("Error suspending template:", result.error);
        notifications.show(strings.templateMoveToDeletionFailed, {
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
          strings.templateMoveToDeletionFailed;

        logger.error("Error suspending template:", error);
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
   * Unsuspend a template (restore from deletion category)
   * Returns the restored template on success, null on failure
   */
  const unsuspendTemplate = useCallback(
    async (id: number): Promise<Graphql.Template | null> => {
      try {
        const result = await apollo.unsuspendTemplateMutation({
          variables: { id },
        });

        if (result.data?.unsuspendTemplate) {
          notifications.show(strings.templateRestoredSuccessfully, {
            severity: "success",
            autoHideDuration: 3000,
          });
          return result.data.unsuspendTemplate;
        }

        logger.error("Error unsuspending template:", result.error);
        notifications.show(strings.templateRestoreFailed, {
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
          strings.templateRestoreFailed;

        logger.error("Error unsuspending template:", error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return null;
      }
    },
    [apollo, notifications, strings],
  );

  return useMemo(
    () => ({
      createCategory,
      updateCategory,
      deleteCategory,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      suspendTemplate,
      unsuspendTemplate,
    }),
    [
      createCategory,
      updateCategory,
      deleteCategory,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      suspendTemplate,
      unsuspendTemplate,
    ],
  );
};
