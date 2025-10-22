"use client";

import { create } from "zustand";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { StorageItem } from "../hooks/storage.type";

interface StorageDataState {
  // Data state
  items: StorageItem[];
  pagination: Graphql.PageInfo | null;
  params: Graphql.FilesListInput;
  stats: Graphql.StorageStats | null;
}

interface StorageDataActions {
  // Data actions
  setItems: (items: StorageItem[]) => void;
  setPagination: (pagination: Graphql.PageInfo | null) => void;
  setParams: (params: Graphql.FilesListInput) => void;
  updateParams: (partial: Partial<Graphql.FilesListInput>) => void;
  setStats: (stats: Graphql.StorageStats | null) => void;

  // Atomic navigation action
  navigateToDirectory: (data: {
    params: Graphql.FilesListInput;
    items: StorageItem[];
    pagination: Graphql.PageInfo;
  }) => void;

  reset: () => void;
}

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

export const useStorageDataStore = create<
  StorageDataState & StorageDataActions
>(set => ({
  ...initialState,

  setItems: items => set({ items }),

  setPagination: pagination => set({ pagination }),

  setParams: params => set({ params }),

  updateParams: partial =>
    set(state => ({
      params: { ...state.params, ...partial },
    })),

  setStats: stats => set({ stats }),

  // Atomic navigation action - updates all navigation state in one call
  navigateToDirectory: data =>
    set({
      params: data.params,
      items: data.items,
      pagination: data.pagination,
    }),

  reset: () => set(initialState),
}));
