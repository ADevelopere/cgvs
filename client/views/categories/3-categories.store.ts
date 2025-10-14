import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

/**
 * Category tab types
 */
export type CategoryTabType = "all" | "deleted";

/**
 * Template query variables for pagination, filtering, and sorting
 */
export type TemplateQueryVariables = {
  paginationArgs?: Graphql.PaginationArgs;
  filterArgs?: Graphql.TemplateFilterArgs;
  orderBy?: Graphql.TemplatesOrderByClause[];
};

/**
 * Category UI Store State
 * Manages all UI-related state for category management
 * Stores IDs instead of full objects - objects are derived from Apollo cache
 */
interface CategoryUIState {
  // State - Store IDs, not full objects
  currentCategoryId: number | null;
  currentTemplateId: number | null;
  activeCategoryTab: CategoryTabType;
  isAddingTemplate: boolean;
  isSwitchWarningOpen: boolean;
  pendingCategoryId: number | null;

  // Lazy loading state
  expandedCategoryIds: Set<number>;
  fetchedCategoryIds: Set<number>; // Track which categories have had their children fetched

  // Template query variables per category
  templateQueryVariables: Map<number, TemplateQueryVariables>;

  // Actions
  setCurrentCategoryId: (id: number | null) => void;
  setCurrentTemplateId: (id: number | null) => void;
  setActiveCategoryTab: (tab: CategoryTabType) => void;
  setIsAddingTemplate: (adding: boolean) => void;

  // Category switching with warning
  trySelectCategory: (id: number | null) => boolean;
  setPendingCategory: (id: number | null) => void;
  setIsSwitchWarningOpen: (open: boolean) => void;
  confirmSwitch: () => void;
  closeSwitchWarning: () => void;

  // Category selection with parent tree
  selectCategoryWithParentTree: (
    categoryId: number,
    parentTree: number[]
  ) => void;

  // Lazy loading actions
  setExpandedCategoryIds: (ids: Set<number>) => void;
  toggleExpanded: (id: number) => void;
  markAsFetched: (id: number) => void;
  isFetched: (id: number) => boolean;

  // Template query variables actions
  setTemplateQueryVariables: (
    categoryId: number,
    vars: TemplateQueryVariables
  ) => void;
  getTemplateQueryVariables: (
    categoryId: number
  ) => TemplateQueryVariables | undefined;
  resetTemplateQueryVariables: (categoryId: number) => void;

  reset: () => void;
}

const initialState = {
  currentCategoryId: null,
  currentTemplateId: null,
  activeCategoryTab: "all" as CategoryTabType,
  isAddingTemplate: false,
  isSwitchWarningOpen: false,
  pendingCategoryId: null,
  expandedCategoryIds: new Set<number>(),
  fetchedCategoryIds: new Set<number>(),
  templateQueryVariables: new Map<number, TemplateQueryVariables>(),
};

/**
 * Zustand store for category UI state
 * Persists selections to sessionStorage for restoration
 */
export const useTemplateCategoryUIStore = create<CategoryUIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentCategoryId: (id) =>
        set({
          currentCategoryId: id,
          currentTemplateId: null, // Reset template when category changes
        }),

      setCurrentTemplateId: (id) => set({ currentTemplateId: id }),

      setActiveCategoryTab: (tab) =>
        set({
          activeCategoryTab: tab,
        }),

      setIsAddingTemplate: (adding) => set({ isAddingTemplate: adding }),

      setPendingCategory: (id) => set({ pendingCategoryId: id }),

      setIsSwitchWarningOpen: (open) => set({ isSwitchWarningOpen: open }),

      trySelectCategory: (id) => {
        const { isAddingTemplate } = get();
        if (isAddingTemplate) {
          set({
            isSwitchWarningOpen: true,
            pendingCategoryId: id,
          });
          return false;
        }
        set({
          currentCategoryId: id,
          currentTemplateId: null,
        });
        return true;
      },

      confirmSwitch: () => {
        const { pendingCategoryId } = get();
        set({
          isAddingTemplate: false,
          currentCategoryId: pendingCategoryId,
          currentTemplateId: null,
          isSwitchWarningOpen: false,
          pendingCategoryId: null,
        });
      },

      closeSwitchWarning: () =>
        set({
          isSwitchWarningOpen: false,
          pendingCategoryId: null,
        }),

      selectCategoryWithParentTree: (categoryId, parentTree) => {
        set((state) => {
          const newExpandedIds = new Set(state.expandedCategoryIds);
          const newFetchedIds = new Set(state.fetchedCategoryIds);

          // Mark all IDs in parentTree as fetched and expanded
          parentTree.forEach((id) => {
            newExpandedIds.add(id);
            newFetchedIds.add(id);
          });

          return {
            currentCategoryId: categoryId,
            currentTemplateId: null,
            expandedCategoryIds: newExpandedIds,
            fetchedCategoryIds: newFetchedIds,
          };
        });
      },

      setExpandedCategoryIds: (ids) => set({ expandedCategoryIds: ids }),

      toggleExpanded: (id) =>
        set((state) => {
          const newSet = new Set(state.expandedCategoryIds);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { expandedCategoryIds: newSet };
        }),

      markAsFetched: (id) =>
        set((state) => {
          const newSet = new Set(state.fetchedCategoryIds);
          newSet.add(id);
          return { fetchedCategoryIds: newSet };
        }),

      isFetched: (id) => {
        return get().fetchedCategoryIds.has(id);
      },

      setTemplateQueryVariables: (categoryId, vars) =>
        set((state) => {
          const newMap = new Map(state.templateQueryVariables);
          newMap.set(categoryId, vars);
          return { templateQueryVariables: newMap };
        }),

      getTemplateQueryVariables: (categoryId) => {
        return get().templateQueryVariables.get(categoryId);
      },

      resetTemplateQueryVariables: (categoryId) =>
        set((state) => {
          const newMap = new Map(state.templateQueryVariables);
          newMap.delete(categoryId);
          return { templateQueryVariables: newMap };
        }),

      reset: () => set(initialState),
    }),
    {
      name: "template-category-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist selections for restoration
      partialize: (state) => ({
        currentCategoryId: state.currentCategoryId,
        currentTemplateId: state.currentTemplateId,
        activeCategoryTab: state.activeCategoryTab,
        expandedCategoryIds: Array.from(state.expandedCategoryIds), // Convert Set to Array for JSON
        fetchedCategoryIds: Array.from(state.fetchedCategoryIds), // Convert Set to Array for JSON
        templateQueryVariables: Array.from(state.templateQueryVariables.entries()), // Convert Map to Array for JSON
      }),
      // Custom merge to handle Set and Map conversion
      merge: (persistedState, currentState) => {
        const typedPersistedState =
          persistedState as Partial<CategoryUIState> & {
            expandedCategoryIds?: number[];
            fetchedCategoryIds?: number[];
            templateQueryVariables?: [number, TemplateQueryVariables][];
          };
        return {
          ...currentState,
          ...typedPersistedState,
          expandedCategoryIds: new Set(
            typedPersistedState?.expandedCategoryIds || [],
          ), // Convert Array back to Set
          fetchedCategoryIds: new Set(
            typedPersistedState?.fetchedCategoryIds || [],
          ), // Convert Array back to Set
          templateQueryVariables: new Map(
            typedPersistedState?.templateQueryVariables || [],
          ), // Convert Array back to Map
        };
      },
    },
  ),
);

/**
 * Helper to validate category tab type
 */
export function isValidCategoryTab(tab: string): tab is CategoryTabType {
  return ["all", "deleted"].includes(tab);
}
