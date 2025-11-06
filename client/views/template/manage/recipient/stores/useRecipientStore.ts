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

  // Query variables for recipients by group id filtered
  recipientsByGroupIdFilteredQuery:
    | Graphql.StudentsInRecipientGroupQueryVariables
    | Graphql.RecipientsByGroupIdFilteredQueryVariables;

  // Filter state for UI - separate for each tab
  filtersNotInGroup: Record<string, FilterClause | null>;
  filtersInGroup: Record<string, FilterClause | null>;

  // Selected student IDs - separate for each tab (not persisted)
  selectedStudentIdsNotInGroup: number[];
  // Selected recipient IDs in group (new)
  selectedRecipientIdsInGroup: number[];

  // Sub-tab state
  activeSubTab: "manage" | "add";
}

interface RecipientActions {
  setSelectedGroup: (group: Graphql.TemplateRecipientGroup | null) => void;
  setSelectedGroupId: (groupId: number | null) => void;
  setStudentsNotInGroupQueryParams: (params: Partial<Graphql.StudentsNotInRecipientGroupQueryVariables>) => void;
  setStudentsInGroupQueryParams: (
    params:
      | Partial<Graphql.StudentsInRecipientGroupQueryVariables>
      | Partial<Graphql.RecipientsByGroupIdFilteredQueryVariables>
  ) => void;
  setFiltersNotInGroup: (filters: Record<string, FilterClause | null>) => void;
  setFiltersInGroup: (filters: Record<string, FilterClause | null>) => void;
  setFilterNotInGroup: (columnId: string, filter: FilterClause | null) => void;
  setFilterInGroup: (columnId: string, filter: FilterClause | null) => void;
  clearFilterNotInGroup: (columnId: string) => void;
  clearFilterInGroup: (columnId: string) => void;
  clearAllFiltersNotInGroup: () => void;
  clearAllFiltersInGroup: () => void;
  setSelectedStudentIdsNotInGroup: (ids: number[]) => void;
  clearSelectedStudentIdsNotInGroup: () => void;
  setSelectedRecipientIdsInGroup: (ids: number[]) => void;
  clearSelectedRecipientIdsInGroup: () => void;
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
  recipientsByGroupIdFilteredQuery: {
    recipientGroupId: 0, // Will be set when a group is selected
    paginationArgs: { page: 1, first: 50 },
  },
  filtersNotInGroup: {},
  filtersInGroup: {},
  selectedStudentIdsNotInGroup: [],
  selectedRecipientIdsInGroup: [],
  activeSubTab: getPersistedActiveSubTab(),
};

export const useRecipientStore = create<RecipientState & RecipientActions>(set => ({
  ...initialState,

  setSelectedGroup: group =>
    set(state => {
      const groupId = group?.id || null;
      setPersistedGroupId(groupId);
      return {
        selectedGroup: group,
        selectedGroupId: groupId,
        studentsNotInGroupQueryParams: {
          ...state.studentsNotInGroupQueryParams,
          recipientGroupId: group?.id || 0,
          paginationArgs: { page: 1, first: 50 }, // Reset pagination when group changes
          // Preserve existing orderBy
          orderBy: state.studentsNotInGroupQueryParams.orderBy,
        },
        recipientsByGroupIdFilteredQuery: {
          ...state.recipientsByGroupIdFilteredQuery,
          recipientGroupId: group?.id || 0,
          paginationArgs: { page: 1, first: 50 }, // Reset pagination when group changes
          // Preserve existing orderBy
          orderBy: state.recipientsByGroupIdFilteredQuery.orderBy,
        },
      };
    }),

  setSelectedGroupId: groupId =>
    set(state => {
      setPersistedGroupId(groupId);
      return {
        selectedGroupId: groupId,
        studentsNotInGroupQueryParams: {
          ...state.studentsNotInGroupQueryParams,
          recipientGroupId: groupId || 0,
          paginationArgs: { page: 1, first: 50 }, // Reset pagination when group changes
          // Preserve existing orderBy
          orderBy: state.studentsNotInGroupQueryParams.orderBy,
        },
        recipientsByGroupIdFilteredQuery: {
          ...state.recipientsByGroupIdFilteredQuery,
          recipientGroupId: groupId || 0,
          paginationArgs: { page: 1, first: 50 }, // Reset pagination when group changes
          // Preserve existing orderBy
          orderBy: state.recipientsByGroupIdFilteredQuery.orderBy,
        },
      };
    }),

  setStudentsNotInGroupQueryParams: params =>
    set(state => ({
      studentsNotInGroupQueryParams: {
        ...state.studentsNotInGroupQueryParams,
        ...params,
      },
    })),

  setStudentsInGroupQueryParams: params =>
    set(state => ({
      recipientsByGroupIdFilteredQuery: {
        ...state.recipientsByGroupIdFilteredQuery,
        ...params,
      },
    })),

  setFiltersNotInGroup: filters => set({ filtersNotInGroup: filters }),

  setFiltersInGroup: filters => set({ filtersInGroup: filters }),

  setFilterNotInGroup: (columnId, filter) =>
    set(state => ({
      filtersNotInGroup: { ...state.filtersNotInGroup, [columnId]: filter },
    })),

  setFilterInGroup: (columnId, filter) =>
    set(state => ({
      filtersInGroup: { ...state.filtersInGroup, [columnId]: filter },
    })),

  clearFilterNotInGroup: columnId =>
    set(state => {
      const newFilters = { ...state.filtersNotInGroup };
      delete newFilters[columnId];
      return { filtersNotInGroup: newFilters };
    }),

  clearFilterInGroup: columnId =>
    set(state => {
      const newFilters = { ...state.filtersInGroup };
      delete newFilters[columnId];
      return { filtersInGroup: newFilters };
    }),

  clearAllFiltersNotInGroup: () => set({ filtersNotInGroup: {} }),

  clearAllFiltersInGroup: () => set({ filtersInGroup: {} }),

  setSelectedStudentIdsNotInGroup: ids => set({ selectedStudentIdsNotInGroup: ids }),

  setSelectedRecipientIdsInGroup: ids => set({ selectedRecipientIdsInGroup: ids }),

  clearSelectedStudentIdsNotInGroup: () => set({ selectedStudentIdsNotInGroup: [] }),

  clearSelectedRecipientIdsInGroup: () => set({ selectedRecipientIdsInGroup: [] }),

  setActiveSubTab: tab => {
    setPersistedActiveSubTab(tab);
    set({ activeSubTab: tab });
  },

  reset: () => set(initialState),
}));

// Hook to initialize the store with persisted group data
export const useRecipientStoreInitializer = () => {
  const { selectedGroupId, setSelectedGroup } = useRecipientStore();

  const { data, loading, error } = useQuery(templateRecipientGroupByIdQueryDocument, {
    variables: { id: selectedGroupId! },
    skip: !selectedGroupId,
  });

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
