"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@toolpad/core/useNotifications";
import logger from "@/lib/logger";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useTemplateMutations, useTemplateOperations } from "../hooks/index";
import { useTemplateCategoryApolloMutations } from "./useTemplateCategoryApolloMutations";
import { useTemplateCategoryStore } from "./useTemplateCategoryStore";

/**
 * Template Category Service Hook
 *
 * Provides data operations for template categories
 */
export const useTemplateCategoryOperations = () => {
  const categoryApollo = useTemplateCategoryApolloMutations();
  const templateApollo = useTemplateMutations();
  const templateOperations = useTemplateOperations();
  const notifications = useNotifications();
  const strings = useAppTranslation("templateCategoryTranslations");

  // Get the state and setters from the store
  const {
    currentCategory,
    currentTemplateId,
    setCurrentTemplateId,
    selectCategory,
  } = useTemplateCategoryStore();

  /**
   * Create a new template category.
   * Updates the store directly on success.
   */
  const createCategory = useCallback(
    async (
      input: Graphql.TemplateCategoryCreateInput,
      parent: Graphql.TemplateCategoryWithParentTree | null
    ): Promise<void> => {
      try {
        const result = await categoryApollo.createTemplateCategoryMutation({
          variables: { input },
        });

        if (result.data) {
          notifications.show(strings.categoryAddedSuccessfully, {
            severity: "success",
          });
          // result.data.createTemplateCategory
          // Directly update the store instead of returning a value
          selectCategory({
            ...result.data.createTemplateCategory,
            __typename: undefined,
            parentTree: [...(parent ? [parent.id, ...parent.parentTree] : [])],
          });
        } else {
          logger.error("Error creating template category:", result.error);
          notifications.show(strings.categoryAddFailed, { severity: "error" });
        }
      } catch (error) {
        logger.error("Error creating template category:", error);
        notifications.show(strings.categoryAddFailed, { severity: "error" });
      }
    },
    [categoryApollo, notifications, strings, selectCategory]
  );

  /**
   * Update an existing template category.
   * Updates the store directly on success.
   */
  const updateCategory = useCallback(
    async (input: Graphql.TemplateCategoryUpdateInput): Promise<void> => {
      try {
        const result = await categoryApollo.updateTemplateCategoryMutation({
          variables: { input },
        });

        if (result.data) {
          notifications.show(strings.categoryUpdatedSuccessfully, {
            severity: "success",
          });
        } else {
          logger.error("Error updating template category:", result.error);
          notifications.show(strings.categoryUpdateFailed, {
            severity: "error",
          });
        }
      } catch (error) {
        logger.error("Error updating template category:", error);
        notifications.show(strings.categoryUpdateFailed, { severity: "error" });
      }
    },
    [categoryApollo, notifications, strings]
  );

  /**
   * Delete a template category.
   * Updates the store directly on success.
   */
  const deleteCategory = useCallback(
    async (id: number): Promise<void> => {
      try {
        const result = await categoryApollo.deleteTemplateCategoryMutation({
          variables: { id },
        });

        if (result.data) {
          notifications.show(strings.categoryDeletedSuccessfully, {
            severity: "success",
          });
          // If the deleted category was the active one, clear it from the store
          if (currentCategory?.id === id) {
            selectCategory(null);
          }
        } else {
          logger.error("Error deleting template category:", result.error);
          notifications.show(strings.categoryDeleteFailed, {
            severity: "error",
          });
        }
      } catch (error) {
        logger.error("Error deleting template category:", error);
        notifications.show(strings.categoryDeleteFailed, { severity: "error" });
      }
    },
    [categoryApollo, notifications, strings, currentCategory, selectCategory]
  );

  /**
   * Create a new template.
   * Updates the store directly on success.
   */
  const createTemplate = useCallback(
    async (
      input: Graphql.CreateTemplateMutationVariables["input"]
    ): Promise<void> => {
      try {
        const result = await templateApollo.createTemplateMutation({
          variables: { input },
        });

        if (result.data?.createTemplate) {
          notifications.show(strings.templateAddedSuccessfully, {
            severity: "success",
          });
          // Directly update the store
          setCurrentTemplateId(result.data.createTemplate.id);
        } else {
          logger.error("Error creating template:", result.error);
          notifications.show(strings.templateAddFailed, { severity: "error" });
        }
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
        notifications.show(errorMessage, { severity: "error" });
      }
    },
    [
      templateApollo,
      notifications,
      strings.templateAddedSuccessfully,
      strings.templateAddFailed,
      setCurrentTemplateId,
    ]
  );

  /**
   * Update an existing template.
   * Updates the store directly on success.
   */
  const updateTemplate = useCallback(
    async (
      input: Graphql.UpdateTemplateMutationVariables["input"]
    ): Promise<void> => {
      const updatedTemplate = await templateOperations.updateTemplate(input);
      if (updatedTemplate) {
        setCurrentTemplateId(updatedTemplate.id);
      }
    },
    [templateOperations, setCurrentTemplateId]
  );

  /**
   * Delete a template (permanently).
   * Updates the store directly on success.
   */
  const deleteTemplate = useCallback(
    async (id: number): Promise<void> => {
      try {
        const result = await templateApollo.deleteTemplateMutation({
          variables: { id },
        });

        if (result.data) {
          notifications.show(
            strings.templateDeletedSuccessfully ||
              "Template deleted successfully",
            { severity: "success" }
          );
          // If the deleted template was the active one, clear it from the store
          if (currentTemplateId === id) {
            setCurrentTemplateId(null);
          }
        } else {
          logger.error("Error deleting template:", result.error);
          notifications.show(
            strings.templateDeleteFailed || "Failed to delete template",
            { severity: "error" }
          );
        }
      } catch (error) {
        logger.error("Error deleting template:", error);
        notifications.show(
          strings.templateDeleteFailed || "Failed to delete template",
          { severity: "error" }
        );
      }
    },
    [
      templateApollo,
      notifications,
      strings.templateDeletedSuccessfully,
      strings.templateDeleteFailed,
      currentTemplateId,
      setCurrentTemplateId,
    ]
  );

  /**
   * Suspend a template (move to deletion category).
   * Updates the store directly on success.
   */
  const suspendTemplate = useCallback(
    async (id: number): Promise<void> => {
      try {
        const result = await templateApollo.suspendTemplateMutation({
          variables: { id },
        });

        if (result.data?.suspendTemplate) {
          notifications.show(strings.templateMovedToDeletionSuccessfully, {
            severity: "success",
          });
          // If the suspended template was the active one, clear it from the store
          if (currentTemplateId === id) {
            setCurrentTemplateId(null);
          }
        } else {
          logger.error("Error suspending template:", result.error);
          notifications.show(strings.templateMoveToDeletionFailed, {
            severity: "error",
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
          strings.templateMoveToDeletionFailed;

        logger.error("Error suspending template:", error);
        notifications.show(errorMessage, { severity: "error" });
      }
    },
    [
      templateApollo,
      notifications,
      strings.templateMovedToDeletionSuccessfully,
      strings.templateMoveToDeletionFailed,
      currentTemplateId,
      setCurrentTemplateId,
    ]
  );

  /**
   * Unsuspend a template (restore from deletion category).
   * Updates the store directly on success.
   */
  const unsuspendTemplate = useCallback(
    async (id: number): Promise<void> => {
      try {
        const result = await templateApollo.unsuspendTemplateMutation({
          variables: { id },
        });

        if (result.data?.unsuspendTemplate) {
          notifications.show(strings.templateRestoredSuccessfully, {
            severity: "success",
          });
          // Directly update the store
          setCurrentTemplateId(result.data.unsuspendTemplate.id);
        } else {
          logger.error("Error unsuspending template:", result.error);
          notifications.show(strings.templateRestoreFailed, {
            severity: "error",
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
          strings.templateRestoreFailed;

        logger.error("Error unsuspending template:", error);
        notifications.show(errorMessage, { severity: "error" });
      }
    },
    [
      templateApollo,
      notifications,
      strings.templateRestoredSuccessfully,
      strings.templateRestoreFailed,
      setCurrentTemplateId,
    ]
  );

  const router = useRouter();

  const manageTemplate = useCallback(
    (templateId: number) => {
      // Navigate to template management page
      router.push(`/admin/templates/${templateId}/manage`);
    },
    [router]
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
      manageTemplate,
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
      manageTemplate,
    ]
  );
};
