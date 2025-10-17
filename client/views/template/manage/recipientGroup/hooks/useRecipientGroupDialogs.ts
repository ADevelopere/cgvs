"use client";

import { useRecipientGroupDialogStore } from "../stores/useRecipientGroupDialogStore";

/**
 * Dialog Management Hook for Recipient Groups
 * Provides dialog state and actions for recipient group management
 */
export const useRecipientGroupDialogs = () => {
  const dialogStore = useRecipientGroupDialogStore();
  
  return {
    // Dialog states
    createDialogOpen: dialogStore.createDialogOpen,
    infoDialogOpen: dialogStore.infoDialogOpen,
    settingsDialogOpen: dialogStore.settingsDialogOpen,
    deleteDialogOpen: dialogStore.deleteDialogOpen,
    selectedGroupId: dialogStore.selectedGroupId,
    
    // Dialog actions
    openCreateDialog: dialogStore.openCreateDialog,
    closeCreateDialog: dialogStore.closeCreateDialog,
    openInfoDialog: dialogStore.openInfoDialog,
    closeInfoDialog: dialogStore.closeInfoDialog,
    openSettingsDialog: dialogStore.openSettingsDialog,
    closeSettingsDialog: dialogStore.closeSettingsDialog,
    openDeleteDialog: dialogStore.openDeleteDialog,
    closeDeleteDialog: dialogStore.closeDeleteDialog
  };
};
