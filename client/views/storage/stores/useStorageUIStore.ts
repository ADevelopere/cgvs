"use client";

import { create } from "zustand";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  StorageItem,
  ViewMode,
  StorageClipboardState,
  LoadingStates,
  OperationErrors,
} from "../core/storage.type";

interface StorageUIState {
  // Selection state
  selectedItems: string[];
  lastSelectedItem: string | null;
  focusedItem: string | null;

  // UI interaction state
  viewMode: ViewMode;
  searchMode: boolean;
  searchResults: StorageItem[];
  clipboard: StorageClipboardState | null;

  // Local UI state
  sortBy: string;
  sortDirection: Graphql.OrderSortDirection;

  // Operation states
  loading: LoadingStates;
  operationErrors: OperationErrors;
}

interface StorageUIActions {
  // Selection actions
  toggleSelect: (path: string) => void;
  selectAll: (items: StorageItem[]) => void;
  clearSelection: () => void;
  selectRange: (fromPath: string, toPath: string, items: StorageItem[]) => void;
  setLastSelectedItem: (path: string | null) => void;
  setFocusedItem: (path: string | null) => void;

  // UI interaction actions
  setViewMode: (mode: ViewMode) => void;
  setSearchMode: (mode: boolean) => void;
  setSearchResults: (results: StorageItem[]) => void;
  copyItems: (items: StorageItem[]) => void;
  cutItems: (items: StorageItem[]) => void;
  clearClipboard: () => void;

  // Sorting actions
  setSortBy: (field: string) => void;
  setSortDirection: (direction: Graphql.OrderSortDirection) => void;

  // Loading and error actions
  updateLoading: (
    key: keyof LoadingStates,
    value: boolean | string | null
  ) => void;
  updateError: (key: keyof OperationErrors, error?: string) => void;
  clearErrors: () => void;

  // Atomic navigation state clearing
  clearNavigationState: () => void;

  // Utility actions
  reset: () => void;
}

const initialLoadingState: LoadingStates = {
  fetchList: false,
  rename: false,
  delete: false,
  move: false,
  copy: false,
  createFolder: false,
  search: false,
  expandingNode: null,
  prefetchingNode: null,
};

const initialState: StorageUIState = {
  selectedItems: [],
  lastSelectedItem: null,
  focusedItem: null,
  viewMode: "grid",
  searchMode: false,
  searchResults: [],
  clipboard: null,
  sortBy: "name",
  sortDirection: "ASC",
  loading: initialLoadingState,
  operationErrors: {},
};

export const useStorageUIStore = create<StorageUIState & StorageUIActions>(
  set => ({
    ...initialState,

    // Selection actions
    toggleSelect: path =>
      set(state => {
        const isSelected = state.selectedItems.includes(path);
        const newSelection = isSelected
          ? state.selectedItems.filter(p => p !== path)
          : [...state.selectedItems, path];

        return {
          selectedItems: newSelection,
          lastSelectedItem: path,
        };
      }),

    selectAll: items =>
      set({
        selectedItems: items.map(item => item.path),
      }),

    clearSelection: () =>
      set({
        selectedItems: [],
        lastSelectedItem: null,
      }),

    selectRange: (fromPath, toPath, items) =>
      set(state => {
        const fromIndex = items.findIndex(item => item.path === fromPath);
        const toIndex = items.findIndex(item => item.path === toPath);

        if (fromIndex === -1 || toIndex === -1) return state;

        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        const rangePaths = items.slice(start, end + 1).map(item => item.path);

        const newSelection = new Set([...state.selectedItems, ...rangePaths]);
        return {
          selectedItems: Array.from(newSelection),
        };
      }),

    setLastSelectedItem: path => set({ lastSelectedItem: path }),
    setFocusedItem: path => set({ focusedItem: path }),

    // UI interaction actions
    setViewMode: mode => set({ viewMode: mode }),
    setSearchMode: mode => set({ searchMode: mode }),
    setSearchResults: results => set({ searchResults: results }),

    copyItems: items => set({ clipboard: { operation: "copy", items } }),
    cutItems: items => set({ clipboard: { operation: "cut", items } }),
    clearClipboard: () => set({ clipboard: null }),

    // Sorting actions
    setSortBy: field => set({ sortBy: field }),
    setSortDirection: direction => set({ sortDirection: direction }),

    // Loading and error actions
    updateLoading: (key, value) =>
      set(state => ({
        loading: { ...state.loading, [key]: value },
      })),

    updateError: (key, error) =>
      set(state => ({
        operationErrors: { ...state.operationErrors, [key]: error },
      })),

    clearErrors: () => set({ operationErrors: {} }),

    // Atomic navigation state clearing - clears all navigation-related UI state
    clearNavigationState: () =>
      set({
        selectedItems: [],
        lastSelectedItem: null,
        searchMode: false,
        searchResults: [],
      }),

    // Utility actions
    reset: () => set(initialState),
  })
);
