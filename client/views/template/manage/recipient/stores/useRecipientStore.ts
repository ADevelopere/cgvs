"use client";

import { create } from "zustand";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { FilterClause } from "@/client/types/filters";
import { templateRecipientGroupByIdQueryDocument } from "../../recipientGroup/hooks/recipientGroup.documents";

interface RecipientState {
  // Selected group for managing recipients
  selectedGroup: Graphql.TemplateRecipientGroup | null;

  // Persisted group ID (not exposed, used for persistence)
  selectedGroupId: number | null;

  // Query variables for students NOT in group
  studentsNotInGroupQueryParams: Graphql.StudentsNotInRecipientGroupQueryVariables;

  // Filter state for UI
  filters: Record<string, FilterClause | null>;

  // Sub-tab state
  activeSubTab: "manage" | "add";
}

interface RecipientActions {
  setSelectedGroup: (group: Graphql.TemplateRecipientGroup | null) => void;
  setSelectedGroupId: (groupId: number | null) => void;
  setStudentsNotInGroupQueryParams: (
    params: Partial<Graphql.StudentsNotInRecipientGroupQueryVariables>,
  ) => void;
  setFilters: (filters: Record<string, FilterClause | null>) => void;
  setFilter: (columnId: string, filter: FilterClause | null) => void;
  clearFilter: (columnId: string) => void;
  clearAllFilters: () => void;
  setActiveSubTab: (tab: "manage" | "add") => void;
  reset: () => void;
}

// Persistence keys
const SELECTED_GROUP_ID_KEY = "recipient-selected-group-id";
const ACTIVE_SUB_TAB_KEY = "recipient-active-sub-tab";

// Helper functions for persistence
const getPersistedGroupId = (): number | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(SELECTED_GROUP_ID_KEY);
  return stored ? parseInt(stored, 10) : null;
};

const getPersistedActiveSubTab = (): "manage" | "add" => {
  if (typeof window === "undefined") return "manage";
  const stored = localStorage.getItem(ACTIVE_SUB_TAB_KEY);
  return (stored as "manage" | "add") || "manage";
};

const setPersistedGroupId = (groupId: number | null) => {
  if (typeof window === "undefined") return;
  if (groupId === null) {
    localStorage.removeItem(SELECTED_GROUP_ID_KEY);
  } else {
    localStorage.setItem(SELECTED_GROUP_ID_KEY, groupId.toString());
  }
};

const setPersistedActiveSubTab = (tab: "manage" | "add") => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_SUB_TAB_KEY, tab);
};

const initialState: RecipientState = {
  selectedGroup: null,
  selectedGroupId: getPersistedGroupId(),
  studentsNotInGroupQueryParams: {
    recipientGroupId: 0, // Will be set when a group is selected
    paginationArgs: { page: 1, first: 50 },
  },
  filters: {},
  activeSubTab: getPersistedActiveSubTab(),
};

export const useRecipientStore = create<RecipientState & RecipientActions>(
  (set) => ({
    ...initialState,

    setSelectedGroup: (group) =>
      set((state) => {
        const groupId = group?.id || null;
        setPersistedGroupId(groupId);
        return {
          selectedGroup: group,
          selectedGroupId: groupId,
          studentsNotInGroupQueryParams: {
            ...state.studentsNotInGroupQueryParams,
            recipientGroupId: group?.id || 0,
            paginationArgs: { page: 1, first: 50 },
          },
        };
      }),

    setSelectedGroupId: (groupId) =>
      set((state) => {
        setPersistedGroupId(groupId);
        return {
          selectedGroupId: groupId,
          studentsNotInGroupQueryParams: {
            ...state.studentsNotInGroupQueryParams,
            recipientGroupId: groupId || 0,
            paginationArgs: { page: 1, first: 50 },
          },
        };
      }),

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

    setActiveSubTab: (tab) => {
      setPersistedActiveSubTab(tab);
      set({ activeSubTab: tab });
    },

    reset: () => set(initialState),
  }),
);

// Hook to initialize the store with persisted group data
export const useRecipientStoreInitializer = () => {
  const { selectedGroupId, setSelectedGroup } = useRecipientStore();

  const { data, loading, error } = useQuery(
    templateRecipientGroupByIdQueryDocument,
    {
      variables: { id: selectedGroupId! },
      skip: !selectedGroupId,
    }
  );

  useEffect(() => {
    if (data?.templateRecipientGroupById) {
      setSelectedGroup(data.templateRecipientGroupById);
    } else if (data && !data.templateRecipientGroupById) {
      // Group not found, clear the persisted ID
      setSelectedGroup(null);
    }
  }, [data, setSelectedGroup]);

  useEffect(() => {
    if (error) {
      // On error, clear the persisted ID
      setSelectedGroup(null);
    }
  }, [error, setSelectedGroup]);

  return { loading, error };
};
