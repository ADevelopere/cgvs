import { create } from "zustand";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { StorageItemUnion } from "../core/storage.type";

// ============================================================================
// STATE INTERFACE
// ============================================================================

export type StorageDataState = {
  items: StorageItemUnion[];
  pagination: Graphql.PageInfo | null;
  params: Graphql.FilesListInput;
  stats: Graphql.StorageStats | null;
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

export type StorageDataStore = StorageDataState & {
  setItems: (items: StorageItemUnion[]) => void;
  setPagination: (pagination: Graphql.PageInfo | null) => void;
  setParams: (params: Graphql.FilesListInput) => void;
  setStats: (stats: Graphql.StorageStats | null) => void;
  reset: () => void;
};

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: StorageDataState = {
  items: [],
  pagination: null,
  params: {
    path: "",
    limit: 50,
    offset: 0,
  },
  stats: null,
};

// ============================================================================
// STORE
// ============================================================================

export const useStorageDataStore = create<StorageDataStore>((set) => ({
  ...initialState,

  setItems: (items) => set({ items }),
  setPagination: (pagination) => set({ pagination }),
  setParams: (params) => set({ params }),
  setStats: (stats) => set({ stats }),
  reset: () => set(initialState),
}));

