"use client";

import { create } from "zustand";

interface RecipientGroupDialogState {
  createDialogOpen: boolean;
  infoDialogOpen: boolean;
  settingsDialogOpen: boolean;
  deleteDialogOpen: boolean;
  selectedGroupId: number | null;
}

interface RecipientGroupDialogActions {
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  openInfoDialog: (groupId: number) => void;
  closeInfoDialog: () => void;
  openSettingsDialog: (groupId: number) => void;
  closeSettingsDialog: () => void;
  openDeleteDialog: (groupId: number) => void;
  closeDeleteDialog: () => void;
  reset: () => void;
}

const initialState: RecipientGroupDialogState = {
  createDialogOpen: false,
  infoDialogOpen: false,
  settingsDialogOpen: false,
  deleteDialogOpen: false,
  selectedGroupId: null,
};

export const useRecipientGroupDialogStore = create<
  RecipientGroupDialogState & RecipientGroupDialogActions
>(set => ({
  ...initialState,

  openCreateDialog: () => set({ createDialogOpen: true }),
  closeCreateDialog: () => set({ createDialogOpen: false }),

  openInfoDialog: groupId =>
    set({
      infoDialogOpen: true,
      selectedGroupId: groupId,
    }),
  closeInfoDialog: () =>
    set({
      infoDialogOpen: false,
      selectedGroupId: null,
    }),

  openSettingsDialog: groupId =>
    set({
      settingsDialogOpen: true,
      selectedGroupId: groupId,
    }),
  closeSettingsDialog: () =>
    set({
      settingsDialogOpen: false,
      selectedGroupId: null,
    }),

  openDeleteDialog: groupId =>
    set({
      deleteDialogOpen: true,
      selectedGroupId: groupId,
    }),
  closeDeleteDialog: () =>
    set({
      deleteDialogOpen: false,
      selectedGroupId: null,
    }),

  reset: () => set(initialState),
}));
