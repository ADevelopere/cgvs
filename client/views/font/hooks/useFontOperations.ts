"use client";

import { useCallback, useMemo, useRef } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useFontApolloMutations } from "./useFontApolloMutations";
import { useFontStore } from "../stores/useFontStore";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";

type FontOperations = {
  selectFont: (font: Graphql.Font) => void;
  startCreating: () => void;
  cancelCreating: () => void;
  startEditing: () => void;
  cancelEditing: () => void;
  createFont: (input: Graphql.FontCreateInput) => Promise<boolean>;
  updateFont: (input: Graphql.FontUpdateInput) => Promise<boolean>;
  deleteFont: (id: number) => Promise<boolean>;
};

/**
 * Font operations hook
 * Returns ONLY functions for font management
 * Data is managed by Apollo Client in components
 */
export const useFontOperations = (): FontOperations => {
  const store = useFontStore();
  const storeRef = useRef(store);
  storeRef.current = store;
  const notifications = useNotifications();
  const { createFontMutation, updateFontMutation, deleteFontMutation } =
    useFontApolloMutations();

  /**
   * Select a font
   */
  const selectFont = useCallback((font: Graphql.Font) => {
    logger.info("Selecting font:", font.id);
    storeRef.current.setSelectedFont(font);
    storeRef.current.cancelCreating();
    storeRef.current.cancelEditing();
  }, []);

  /**
   * Start creating a new font
   */
  const startCreating = useCallback(() => {
    storeRef.current.startCreating();
  }, []);

  /**
   * Cancel creating a font
   */
  const cancelCreating = useCallback(() => {
    storeRef.current.cancelCreating();
  }, []);

  /**
   * Start editing a font
   */
  const startEditing = useCallback(() => {
    storeRef.current.startEditing();
  }, []);

  /**
   * Cancel editing a font
   */
  const cancelEditing = useCallback(() => {
    storeRef.current.cancelEditing();
  }, []);

  /**
   * Create a new font
   */
  const createFont = useCallback(
    async (input: Graphql.FontCreateInput): Promise<boolean> => {
      try {
        logger.info("Creating font:", input);

        const result = await createFontMutation({
          variables: { input },
        });

        if (result.data?.createFont) {
          notifications.show(
            `${result.data.createFont.name} has been created successfully`,
            {
              severity: "success",
              autoHideDuration: 3000,
            }
          );

          // Select the new font and exit create mode
          storeRef.current.setSelectedFont(
            result.data.createFont as Graphql.Font
          );
          storeRef.current.cancelCreating();

          return true;
        }

        return false;
      } catch (error) {
        logger.error("Error creating font:", error);
        notifications.show(
          error instanceof Error ? error.message : "Error creating font",
          {
            severity: "error",
            autoHideDuration: 3000,
          }
        );
        return false;
      }
    },
    [createFontMutation, notifications]
  );

  /**
   * Update an existing font
   */
  const updateFont = useCallback(
    async (input: Graphql.FontUpdateInput): Promise<boolean> => {
      try {
        logger.info("Updating font:", input);

        const result = await updateFontMutation({
          variables: { input },
        });

        if (result.data?.updateFont) {
          notifications.show(
            `${result.data.updateFont.name} has been updated successfully`,
            {
              severity: "success",
              autoHideDuration: 3000,
            }
          );

          storeRef.current.cancelEditing();
          return true;
        }

        return false;
      } catch (error) {
        logger.error("Error updating font:", error);
        notifications.show(
          error instanceof Error ? error.message : "Error updating font",
          {
            severity: "error",
            autoHideDuration: 3000,
          }
        );
        return false;
      }
    },
    [updateFontMutation, notifications]
  );

  /**
   * Delete a font
   */
  const deleteFont = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        logger.info("Deleting font:", id);

        const result = await deleteFontMutation({
          variables: { id },
        });

        if (result.data?.deleteFont) {
          notifications.show(
            `${result.data.deleteFont.name} has been deleted successfully`,
            {
              severity: "success",
              autoHideDuration: 3000,
            }
          );

          // Clear selection if deleted font was selected
          if (storeRef.current.selectedFont?.id === id) {
            storeRef.current.setSelectedFont(null);
          }

          return true;
        }

        return false;
      } catch (error) {
        logger.error("Error deleting font:", error);
        notifications.show(
          error instanceof Error ? error.message : "Error deleting font",
          {
            severity: "error",
            autoHideDuration: 3000,
          }
        );
        return false;
      }
    },
    [deleteFontMutation, notifications]
  );

  // Return only functions and store accessors, wrapped in useMemo for stability
  return useMemo(
    () => ({
      // Selection
      selectFont,
      // UI actions
      startCreating,
      cancelCreating,
      startEditing,
      cancelEditing,
      // Mutations
      createFont,
      updateFont,
      deleteFont,
    }),
    [
      selectFont,
      startCreating,
      cancelCreating,
      startEditing,
      cancelEditing,
      createFont,
      updateFont,
      deleteFont,
    ]
  );
};
