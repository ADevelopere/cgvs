"use client";

import { useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useTemplateCategoryGraphQL } from "@/client/graphql/apollo/templateCategory.apollo";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";
import { isAbortError } from "@/client/utils/errorUtils";

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
  * Fetch a single template category by ID
  * Returns null on error or if not found
  */
 const fetchCategory = useCallback(
  async (id: number): Promise<Graphql.TemplateCategory | null | undefined> => {
   try {
    const result = await apollo.templateCategoryQuery({ id });

    if (result.data) {
     return result.data.templateCategory;
    }

    logger.error("Error fetching template category:", result.error);
    notifications.show(strings.errorLoadingCategories, {
     severity: "error",
     autoHideDuration: 3000,
    });
    return null;
   } catch (error) {
    if (!isAbortError(error)) {
     logger.error("Error fetching template category:", error);
     notifications.show(strings.errorLoadingCategories, {
      severity: "error",
      autoHideDuration: 3000,
     });
    } else {
     logger.debug("Query aborted (likely due to navigation):", error);
    }
    return null;
   }
  },
  [apollo, notifications, strings],
 );

 /**
  * Fetch all template categories
  * Returns empty array on error
  */
 const fetchCategories = useCallback(async (): Promise<
  Graphql.TemplateCategory[]
 > => {
  try {
   const result = await apollo.templateCategoriesQuery();

   if (result.data) {
    return result.data.templateCategories;
   }

   logger.error("Error fetching template categories:", result.error);
   notifications.show(strings.errorLoadingCategories, {
    severity: "error",
    autoHideDuration: 3000,
   });
   return [];
  } catch (error) {
   // Don't show error notification if the request was aborted (e.g., during navigation)
   if (!isAbortError(error)) {
    logger.error("Error fetching template categories:", error);
    notifications.show(strings.errorLoadingCategories, {
     severity: "error",
     autoHideDuration: 3000,
    });
   } else {
    logger.debug("Query aborted (likely due to navigation):", error);
   }
   return [];
  }
 }, [apollo, notifications, strings]);

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
     input,
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
     input,
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
     id,
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

 return useMemo(
  () => ({
   fetchCategories,
   fetchCategory,
   createCategory,
   updateCategory,
   deleteCategory,
  }),
  [
   fetchCategories,
   fetchCategory,
   createCategory,
   updateCategory,
   deleteCategory,
  ],
 );
};
