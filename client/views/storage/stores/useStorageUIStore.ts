import { create } from "zustand";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { StorageItemUnion, ViewMode, StorageClipboardState } from "../core/storage.type";

// ============================================================================
// STATE INTERFACE
// ============================================================================

export type StorageUIState = {
  selectedItems: string[];
  lastSelectedItem: string | null;
  focusedItem: string | null;
  viewMode: ViewMode;
  searchMode: boolean;
  searchResults: StorageItemUnion[];
  clipboard: StorageClipboardState | null;
  sortBy: string;
  sortDirection: GQL.OrderSortDirection;
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

export type StorageUIStore = StorageUIState & {
  setSelectedItems: (items: string[]) => void;
  setLastSelectedItem: (item: string | null) => void;
  setFocusedItem: (item: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchMode: (mode: boolean) => void;
  setSearchResults: (results: StorageItemUnion[]) => void;
  setClipboard: (clipboard: StorageClipboardState | null) => void;
  setSortBy: (field: string) => void;
  setSortDirection: (direction: GQL.OrderSortDirection) => void;
  reset: () => void;
};

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: StorageUIState = {
  selectedItems: [],
  lastSelectedItem: null,
  focusedItem: null,
  viewMode: "grid",
  searchMode: false,
  searchResults: [],
  clipboard: null,
  sortBy: "name",
  sortDirection: GQL.OrderSortDirection.Asc,
};

// ============================================================================
// STORE
// ============================================================================

export const useStorageUIStore = create<StorageUIStore>(set => ({
  ...initialState,

  setSelectedItems: selectedItems => set({ selectedItems }),
  setLastSelectedItem: lastSelectedItem => set({ lastSelectedItem }),
  setFocusedItem: focusedItem => set({ focusedItem }),
  setViewMode: viewMode => set({ viewMode }),
  setSearchMode: searchMode => set({ searchMode }),
  setSearchResults: searchResults => set({ searchResults }),
  setClipboard: clipboard => set({ clipboard }),
  setSortBy: sortBy => set({ sortBy }),
  setSortDirection: sortDirection => set({ sortDirection }),
  reset: () => set(initialState),
}));
