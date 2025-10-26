"use client";

import { useQuery, useLazyQuery } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useFontApolloMutations } from "./useFontApolloMutations";
import { useFontStore } from "../stores/useFontStore";
import * as Document from "./font.documents";
import { FontFormData, FontUsageCheckResult } from "../types";
import logger from "@/client/lib/logger";
import { useEffect } from "react";

/**
 * Font operations hook
 * Integrates Apollo mutations with Zustand store
 * Provides high-level operations for font management
 */
export const useFontOperations = () => {
  const store = useFontStore();
  const notifications = useNotifications();
  const {
    createFontMutation,
    updateFontMutation,
    deleteFontMutation,
  } = useFontApolloMutations();

  // Load all fonts query
  const {
    data: fontsData,
    loading: fontsLoading,
    error: fontsError,
    refetch: refetchFonts,
  } = useQuery(Document.fontsQueryDocument);

  // Update store when fonts data changes
  useEffect(() => {
    if (fontsData?.fonts) {
      store.setFonts(fontsData.fonts);
      logger.info("Fonts loaded:", fontsData.fonts.length);
    }
  }, [fontsData, store]);

  // Handle fonts query errors
  useEffect(() => {
    if (fontsError) {
      logger.error("Error loading fonts:", fontsError);
      notifications.show("Error loading fonts", {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [fontsError, notifications]);

  // Lazy query for single font
  const [loadFont, { data: fontData, loading: fontLoading, error: fontError }] =
    useLazyQuery(Document.fontQueryDocument);

  // Update store when font data changes
  useEffect(() => {
    if (fontData?.font) {
      store.setCurrentFont(fontData.font);
      logger.info("Font loaded:", fontData.font.id);
    }
  }, [fontData, store]);

  // Handle font query errors
  useEffect(() => {
    if (fontError) {
      logger.error("Error loading font:", fontError);
      notifications.show("Error loading font", {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [fontError, notifications]);

  // Lazy query for search
  const [searchFonts, { data: searchData, loading: searchLoading, error: searchError }] =
    useLazyQuery(Document.searchFontsQueryDocument);

  // Update store when search data changes
  useEffect(() => {
    if (searchData?.searchFonts) {
      store.setFonts(searchData.searchFonts);
      logger.info("Search results:", searchData.searchFonts.length);
    }
  }, [searchData, store]);

  // Handle search query errors
  useEffect(() => {
    if (searchError) {
      logger.error("Error searching fonts:", searchError);
      notifications.show("Error searching fonts", {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  }, [searchError, notifications]);

  // Lazy query for usage check
  const [checkUsage] = useLazyQuery(Document.checkFontUsageQueryDocument);

  /**
   * Select a font by ID
   */
  const selectFont = async (id: number) => {
    logger.info("Selecting font:", id);
    store.setSelectedFontId(id);
    await loadFont({ variables: { id } });
  };

  /**
   * Search fonts by name
   */
  const handleSearch = async (term: string) => {
    logger.info("Searching fonts:", term);
    store.setSearchTerm(term);
    
    if (term.trim().length === 0) {
      // If search is empty, load all fonts
      await refetchFonts();
    } else {
      // Search with term
      await searchFonts({
        variables: {
          name: term,
          limit: 50,
        },
      });
    }
  };

  /**
   * Create a new font
   */
  const createFont = async (formData: FontFormData): Promise<boolean> => {
    if (!formData.storageFileId) {
      notifications.show("Please select a font file", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return false;
    }

    if (formData.locale.length === 0) {
      notifications.show("Please select at least one locale", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return false;
    }

    try {
      store.setSaving(true);
      logger.info("Creating font:", formData);

      const result = await createFontMutation({
        variables: {
          input: {
            name: formData.name,
            locale: formData.locale,
            storageFileId: formData.storageFileId,
          },
        },
      });

      if (result.data?.createFont) {
        notifications.show(`${result.data.createFont.name} has been created successfully`, {
          severity: "success",
          autoHideDuration: 3000,
        });
        
        // Select the new font
        await selectFont(result.data.createFont.id);
        store.cancelCreating();
        
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
    } finally {
      store.setSaving(false);
    }
  };

  /**
   * Update an existing font
   */
  const updateFont = async (
    id: number,
    formData: FontFormData
  ): Promise<boolean> => {
    if (!formData.storageFileId) {
      notifications.show("Please select a font file", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return false;
    }

    if (formData.locale.length === 0) {
      notifications.show("Please select at least one locale", {
        severity: "error",
        autoHideDuration: 3000,
      });
      return false;
    }

    try {
      store.setSaving(true);
      logger.info("Updating font:", id, formData);

      const result = await updateFontMutation({
        variables: {
          input: {
            id,
            name: formData.name,
            locale: formData.locale,
            storageFileId: formData.storageFileId,
          },
        },
      });

      if (result.data?.updateFont) {
        notifications.show(`${result.data.updateFont.name} has been updated successfully`, {
          severity: "success",
          autoHideDuration: 3000,
        });
        
        // Reload the updated font
        await selectFont(id);
        store.cancelEditing();
        
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
    } finally {
      store.setSaving(false);
    }
  };

  /**
   * Delete a font (with usage check)
   */
  const deleteFont = async (id: number): Promise<boolean> => {
    try {
      // First check usage
      logger.info("Checking font usage before delete:", id);
      const usageResult = await checkUsage({
        variables: { id },
      });

      const usageData = usageResult.data?.checkFontUsage;
      
      if (usageData && !usageData.canDelete) {
        notifications.show(
          usageData.deleteBlockReason || "Font is currently in use",
          {
            severity: "error",
            autoHideDuration: 3000,
          }
        );
        return false;
      }

      // Proceed with deletion
      store.setLoading(true);
      logger.info("Deleting font:", id);

      const result = await deleteFontMutation({
        variables: { id },
      });

      if (result.data?.deleteFont) {
        notifications.show(`${result.data.deleteFont.name} has been deleted successfully`, {
          severity: "success",
          autoHideDuration: 3000,
        });
        
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
    } finally {
      store.setLoading(false);
    }
  };

  /**
   * Check font usage
   */
  const checkFontUsage = async (
    id: number
  ): Promise<FontUsageCheckResult | null> => {
    try {
      logger.info("Checking font usage:", id);
      const result = await checkUsage({
        variables: { id },
      });

      return result.data?.checkFontUsage || null;
    } catch (error) {
      logger.error("Error checking font usage:", error);
      return null;
    }
  };

  return {
    // Data
    fonts: fontsData?.fonts || [],
    currentFont: store.currentFont,
    selectedFontId: store.selectedFontId,
    searchTerm: store.searchTerm,

    // Loading states
    isLoading: fontsLoading || fontLoading || store.isLoading,
    isSaving: store.isSaving,
    isSearching: searchLoading,

    // Operations
    selectFont,
    handleSearch,
    createFont,
    updateFont,
    deleteFont,
    checkFontUsage,
    refetchFonts,

    // Store actions (selected)
    setFonts: store.setFonts,
    setCurrentFont: store.setCurrentFont,
    setSelectedFontId: store.setSelectedFontId,
    setSearchTerm: store.setSearchTerm,
    clearSearch: store.clearSearch,
    openFilePicker: store.openFilePicker,
    closeFilePicker: store.closeFilePicker,
    startCreating: store.startCreating,
    cancelCreating: store.cancelCreating,
    startEditing: store.startEditing,
    cancelEditing: store.cancelEditing,
    setLoading: store.setLoading,
    setSaving: store.setSaving,
    reset: store.reset,
    isFilePickerOpen: store.isFilePickerOpen,
    isCreating: store.isCreating,
    isEditing: store.isEditing,
  };
};

