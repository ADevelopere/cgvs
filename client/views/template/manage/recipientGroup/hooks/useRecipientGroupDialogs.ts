"use client";

import { useRecipientGroupDialogStore } from "../stores/useRecipientGroupDialogStore";

/**
 * Dialog Management Hook for Recipient Groups
 * Provides dialog state and actions for recipient group management
 */
export const useRecipientGroupDialogs = () => {
  // Extract stable references from store
  const createDialogOpen = useRecipientGroupDialogStore((state) => state.createDialogOpen);
  const infoDialogOpen = useRecipientGroupDialogStore((state) => state.infoDialogOpen);
  const settingsDialogOpen = useRecipientGroupDialogStore((state) => state.settingsDialogOpen);
  const deleteDialogOpen = useRecipientGroupDialogStore((state) => state.deleteDialogOpen);
  const selectedGroupId = useRecipientGroupDialogStore((state) => state.selectedGroupId);
  const openCreateDialog = useRecipientGroupDialogStore((state) => state.openCreateDialog);
  const closeCreateDialog = useRecipientGroupDialogStore((state) => state.closeCreateDialog);
  const openInfoDialog = useRecipientGroupDialogStore((state) => state.openInfoDialog);
  const closeInfoDialog = useRecipientGroupDialogStore((state) => state.closeInfoDialog);
  const openSettingsDialog = useRecipientGroupDialogStore((state) => state.openSettingsDialog);
  const closeSettingsDialog = useRecipientGroupDialogStore((state) => state.closeSettingsDialog);
  const openDeleteDialog = useRecipientGroupDialogStore((state) => state.openDeleteDialog);
  const closeDeleteDialog = useRecipientGroupDialogStore((state) => state.closeDeleteDialog);

  return {
    // Dialog states
    createDialogOpen,
    infoDialogOpen,
    settingsDialogOpen,
    deleteDialogOpen,
    selectedGroupId,

    // Dialog actions
    openCreateDialog,
    closeCreateDialog,
    openInfoDialog,
    closeInfoDialog,
    openSettingsDialog,
    closeSettingsDialog,
    openDeleteDialog,
    closeDeleteDialog
  };
};
