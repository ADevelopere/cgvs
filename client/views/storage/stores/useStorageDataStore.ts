import { create } from "zustand";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

// ============================================================================
// STATE INTERFACE
// ============================================================================

export type StorageDataState = {
  params: Graphql.FilesListInput;
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

export type StorageDataStore = StorageDataState & {
  setParams: (params: Graphql.FilesListInput) => void;
  reset: () => void;
};

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: StorageDataState = {
  params: {
    path: "",
    limit: 50,
    offset: 0,
  },
};

// ============================================================================
// STORE
// ============================================================================

export const useStorageDataStore = create<StorageDataStore>((set) => ({
  ...initialState,

  setParams: (params) => set({ params }),
  reset: () => set(initialState),
}));

