"use client";

import { create } from "zustand";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { FilterClause } from "@/client/types/filters";

interface RecipientState {
  // Selected group for managing recipients
  selectedGroupId: number | null;
  
  // Query variables for students NOT in group
  studentsNotInGroupQueryParams: Graphql.StudentsNotInRecipientGroupQueryVariables;
  
  // Filter state for UI
  filters: Record<string, FilterClause | null>;
}

interface RecipientActions {
  setSelectedGroupId: (groupId: number | null) => void;
  setStudentsNotInGroupQueryParams: (
    params: Partial<Graphql.StudentsNotInRecipientGroupQueryVariables>
  ) => void;
  setFilters: (filters: Record<string, FilterClause | null>) => void;
  setFilter: (columnId: string, filter: FilterClause | null) => void;
  clearFilter: (columnId: string) => void;
  clearAllFilters: () => void;
  reset: () => void;
}

const initialState: RecipientState = {
  selectedGroupId: null,
  studentsNotInGroupQueryParams: {
    recipientGroupId: 0, // Will be set when a group is selected
    paginationArgs: { page: 1, first: 50 }
  },
  filters: {}
};

export const useRecipientStore = create<RecipientState & RecipientActions>((set) => ({
  ...initialState,

  setSelectedGroupId: (groupId) =>
    set((state) => ({
      selectedGroupId: groupId,
      studentsNotInGroupQueryParams: {
        ...state.studentsNotInGroupQueryParams,
        recipientGroupId: groupId || 0,
        paginationArgs: { page: 1, first: 50 }
      }
    })),

  setStudentsNotInGroupQueryParams: (params) =>
    set((state) => ({
      studentsNotInGroupQueryParams: {
        ...state.studentsNotInGroupQueryParams,
        ...params
      }
    })),

  setFilters: (filters) => set({ filters }),
  
  setFilter: (columnId, filter) =>
    set((state) => ({
      filters: { ...state.filters, [columnId]: filter }
    })),

  clearFilter: (columnId) =>
    set((state) => {
      const newFilters = { ...state.filters };
      delete newFilters[columnId];
      return { filters: newFilters };
    }),

  clearAllFilters: () => set({ filters: {} }),

  reset: () => set(initialState)
}));
