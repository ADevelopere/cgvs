"use client";

import { create } from "zustand";

export interface CancelTarget {
  type: "all" | "file";
  fileKey?: string;
  fileName?: string;
}

interface UploadProgressUIState {
  // UI states
  isCollapsed: boolean;
  showCancelDialog: boolean;
  cancelTarget: CancelTarget | null;
}

interface UploadProgressUIActions {
  // UI state actions
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapse: () => void;
  setShowCancelDialog: (show: boolean) => void;
  setCancelTarget: (target: CancelTarget | null) => void;
  clearCancelDialog: () => void;
  reset: () => void;
}

const initialState: UploadProgressUIState = {
  isCollapsed: false,
  showCancelDialog: false,
  cancelTarget: null,
};

export const useUploadProgressUIStore = create<UploadProgressUIState & UploadProgressUIActions>(set => ({
  ...initialState,

  // UI state actions
  setIsCollapsed: collapsed => set({ isCollapsed: collapsed }),

  toggleCollapse: () => set(state => ({ isCollapsed: !state.isCollapsed })),

  setShowCancelDialog: show => set({ showCancelDialog: show }),

  setCancelTarget: target => set({ cancelTarget: target }),

  clearCancelDialog: () =>
    set({
      showCancelDialog: false,
      cancelTarget: null,
    }),

  reset: () => set(initialState),
}));
