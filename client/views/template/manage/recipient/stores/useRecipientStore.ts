"use client";

import { create } from "zustand";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { FilterClause } from "@/client/types/filters";

interface RecipientState {
  // Selected group for managing recipients
  selectedGroup: Graphql.TemplateRecipientGroup | null;

  // Query variables for students NOT in group
  studentsNotInGroupQueryParams: Graphql.StudentsNotInRecipientGroupQueryVariables;

  // Filter state for UI
  filters: Record<string, FilterClause | null>;
}

interface RecipientActions {
  setSelectedGroup: (group: Graphql.TemplateRecipientGroup | null) => void;
  setStudentsNotInGroupQueryParams: (
    params: Partial<Graphql.StudentsNotInRecipientGroupQueryVariables>,
  ) => void;
  setFilters: (filters: Record<string, FilterClause | null>) => void;
  setFilter: (columnId: string, filter: FilterClause | null) => void;
  clearFilter: (columnId: string) => void;
  clearAllFilters: () => void;
  reset: () => void;
}

const initialState: RecipientState = {
  selectedGroup: null,
  studentsNotInGroupQueryParams: {
    recipientGroupId: 0, // Will be set when a group is selected
    paginationArgs: { page: 1, first: 50 },
  },
  filters: {},
};

export const useRecipientStore = create<RecipientState & RecipientActions>(
  (set) => ({
    ...initialState,

    setSelectedGroup: (group) =>
      set((state) => ({
        selectedGroup: group,
        studentsNotInGroupQueryParams: {
          ...state.studentsNotInGroupQueryParams,
          recipientGroupId: group?.id || 0,
          paginationArgs: { page: 1, first: 50 },
        },
      })),

    setStudentsNotInGroupQueryParams: (params) =>
      set((state) => ({
        studentsNotInGroupQueryParams: {
          ...state.studentsNotInGroupQueryParams,
          ...params,
        },
      })),

    setFilters: (filters) => set({ filters }),

    setFilter: (columnId, filter) =>
      set((state) => ({
        filters: { ...state.filters, [columnId]: filter },
      })),

    clearFilter: (columnId) =>
      set((state) => {
        const newFilters = { ...state.filters };
        delete newFilters[columnId];
        return { filters: newFilters };
      }),

    clearAllFilters: () => set({ filters: {} }),

    reset: () => set(initialState),
  }),
);
