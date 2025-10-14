"use client";

/**
 * Template Category Management Context
 *
 * Architecture:
 * - UI State: Managed by Zustand (useTemplateCategoryUIStore) with automatic persistence
 *   - Stores category/template IDs (not full objects)
 *   - Dialog states, flags, tab selections
 * - Business Logic: Managed by React Context (this file)
 *   - ONLY CRUD operations (no data queries)
 *   - Navigation helpers
 *   - Callback management
 * - Data: Fetched directly by components using useQuery
 *   - Categories: Fetched by ReactiveCategoryTree component
 *   - Templates: Fetched by template components
 *
 * Benefits:
 * - Zero data management in context (components own their data)
 * - Context only provides business operations
 * - State persists across page navigation automatically
 * - Clean separation: operations in context, data in components
 */

import React from "react";

import * as Graphql from "@/client/graphql/generated/gql/graphql";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useRouter } from "next/navigation";
import { useDashboardLayout } from "@/client/contexts/DashboardLayoutContext";
import { NavigationPageItem } from "@/client/contexts/adminLayout.types";
import { useTemplateCategoryUIStore } from "./3-categories.store";
import { useTemplateCategoryService } from "./2-category.gqlService";

// Note: Tree traversal is no longer needed - ReactiveCategoryTree component handles hierarchical structure

/**
 * Context provides ONLY business logic functions (CRUD operations)
 * Components fetch their own data using useQuery directly
 * UI state is managed by Zustand store
 */
type TemplateCategoryManagementContextType = {
  // Category operations (business logic only)
  createCategory: (name: string, parentId?: number) => void;
  updateCategory: (
    category: Graphql.TemplateCategory,
    parentCategoryId?: number | null,
  ) => void;
  deleteCategory: (categoryId: number) => void;

  // Template operations (business logic only)
  createTemplate: (name: string, categoryId: number) => void;
  updateTemplate: (
    input: Graphql.UpdateTemplateMutationVariables,
  ) => Promise<Graphql.Template | null>;
  suspendTemplate: (templateId: number) => void;
  unsuspendTemplate: (templateId: number) => Promise<void>;
  manageTemplate: (templateId: number) => void;

  // Selection management (delegates to Zustand)
  trySelectCategory: (
    category: Graphql.TemplateCategory | null,
  ) => Promise<boolean>;

  // Callback management
  onNewTemplateCancel?: () => void;
  setOnNewTemplateCancel: (callback: (() => void) | undefined) => void;

  currentCategory: Graphql.TemplateCategoryWithParentTree | null;
  selectCategory: (
    category: Graphql.TemplateCategory | null,
  ) => void;
};

const TemplateCategoryManagementContext = React.createContext<
  TemplateCategoryManagementContextType | undefined
>(undefined);

/**
 * Hook that combines context (data/services) with Zustand store (UI state)
 * Components only use this hook - Zustand is an implementation detail
 */
export const useTemplateCategoryManagement = () => {
  const messages = useAppTranslation("templateCategoryTranslations");
  const context = React.useContext(TemplateCategoryManagementContext);
  const uiStore = useTemplateCategoryUIStore();

  if (!context) {
    throw new Error(messages.useCategoryContextError);
  }

  // Combine context data with UI store state
  return {
    ...context,
    ...uiStore,
  };
};

export const TemplateCategoryManagementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const messages = useAppTranslation("templateCategoryTranslations");
  const notifications = useNotifications();
  const { setNavigation } = useDashboardLayout();
  const router = useRouter();

  const [currentCategory, setCurrentCategory] =
    React.useState<Graphql.TemplateCategoryWithParentTree | null>(null);

  // Get UI state from Zustand store (only what's needed by provider logic)
  const {
    currentCategoryId,
    currentTemplateId,
    setCurrentCategoryId,
    setCurrentTemplateId,
    isSwitchWarningOpen,
    closeSwitchWarning,
    confirmSwitch: confirmSwitchStore,
    trySelectCategory: trySelectCategoryStore,
  } = useTemplateCategoryUIStore();

  // Callback state (stays in component)
  const [onNewTemplateCancel, setOnNewTemplateCancel] = React.useState<
    (() => void) | undefined
  >(undefined);

  // No queries here! Components use useQuery directly for their data needs
  // Context only provides business logic functions

  const apolloService = useTemplateCategoryService();

  const selectCategory = React.useCallback(
    (category: Graphql.TemplateCategory | null) => {
      setCurrentCategoryId(category?.id ?? null);
      if (category) {
        setCurrentCategory({
          id: category.id,
          name: category.name,
          parentTree: [],
        });
      }
    },
    [setCurrentCategoryId],
  );

  const createCategory = React.useCallback(
    async (name: string, parentId?: number) => {
      const newCategory = await apolloService.createCategory({
        name,
        parentCategoryId: parentId,
      });

      if (newCategory) {
        setCurrentCategoryId(newCategory.id);
      }
    },
    [apolloService, setCurrentCategoryId],
  );

  const updateCategory = React.useCallback(
    async (
      category: Graphql.TemplateCategory,
      parentCategoryId?: number | null,
    ) => {
      if (!category.name) {
        notifications.show(messages.categoryNameRequired, {
          severity: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      await apolloService.updateCategory({
        id: category.id,
        name: category.name,
        description: category.description,
        parentCategoryId: parentCategoryId,
      });
    },
    [apolloService, notifications, messages],
  );

  const deleteCategory = React.useCallback(
    async (categoryId: number) => {
      const success = await apolloService.deleteCategory(categoryId);

      if (success && currentCategoryId === categoryId) {
        setCurrentCategoryId(null);
      }
    },
    [apolloService, currentCategoryId, setCurrentCategoryId],
  );

  const createTemplate = React.useCallback(
    async (name: string, categoryId: number, description?: string) => {
      const newTemplate = await apolloService.createTemplate({
        name,
        categoryId,
        description,
      });

      if (newTemplate) {
        setCurrentTemplateId(newTemplate.id);
        return newTemplate;
      } else {
        throw new Error(messages.templateAddFailed);
      }
    },
    [apolloService, setCurrentTemplateId, messages],
  );

  const updateTemplate = React.useCallback(
    async (variables: Graphql.UpdateTemplateMutationVariables) => {
      const updatedTemplate = await apolloService.updateTemplate(
        variables.input,
      );

      if (updatedTemplate) {
        setCurrentTemplateId(updatedTemplate.id);
        return updatedTemplate;
      }

      return null;
    },
    [apolloService, setCurrentTemplateId],
  );

  const suspendTemplate = React.useCallback(
    async (templateId: number) => {
      const suspended = await apolloService.suspendTemplate(templateId);

      if (suspended) {
        if (currentTemplateId === templateId) {
          setCurrentTemplateId(null);
        }
      } else {
        throw new Error(messages.templateMoveToDeletionFailed);
      }
    },
    [apolloService, currentTemplateId, setCurrentTemplateId, messages],
  );

  const unsuspendTemplate = React.useCallback(
    async (templateId: number) => {
      const restored = await apolloService.unsuspendTemplate(templateId);

      if (!restored) {
        throw new Error(messages.templateRestoreFailed);
      }
    },
    [apolloService, messages],
  );

  const manageTemplate = React.useCallback(
    (templateId: number) => {
      // Navigate to template management page
      setNavigation((prevNav) => {
        if (!prevNav) return prevNav;
        return prevNav.map((item) => {
          if ("id" in item && item.id === "templates") {
            return {
              ...item,
              segment: `admin/templates/${templateId}/manage`,
            } as NavigationPageItem;
          }
          return item;
        });
      });
      router.push(`/admin/templates/${templateId}/manage`);
    },
    [setNavigation, router],
  );

  // Category switching logic (wraps store logic with callback handling)
  const trySelectCategory = React.useCallback(
    async (category: Graphql.TemplateCategory | null): Promise<boolean> => {
      const result = trySelectCategoryStore(category?.id ?? null);
      return result;
    },
    [trySelectCategoryStore],
  );

  const confirmSwitch = React.useCallback(() => {
    if (onNewTemplateCancel) {
      onNewTemplateCancel();
    }
    confirmSwitchStore();
  }, [onNewTemplateCancel, confirmSwitchStore]);

  // Context value - only business logic functions
  const value: TemplateCategoryManagementContextType = {
    // Category operations
    createCategory,
    updateCategory,
    deleteCategory,
    currentCategory,
    selectCategory,
    trySelectCategory,
    // Template operations
    createTemplate,
    updateTemplate,
    suspendTemplate,
    unsuspendTemplate,
    manageTemplate,
    // Callback management
    onNewTemplateCancel,
    setOnNewTemplateCancel,
  };

  return (
    <>
      <TemplateCategoryManagementContext.Provider value={value}>
        {children}
      </TemplateCategoryManagementContext.Provider>
      <Dialog open={isSwitchWarningOpen} onClose={closeSwitchWarning}>
        <DialogTitle>{messages.confirmSwitchCategory}</DialogTitle>
        <DialogContent>
          {messages.switchCategoryWhileAddingTemplate}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSwitchWarning}>{messages.cancel}</Button>
          <Button onClick={confirmSwitch} color="primary">
            {messages.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
