import { TemplatesByCategoryIdQueryVariables } from "@/client/graphql/generated/gql/graphql";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * View mode types
 */
export type ViewMode = "card" | "grid" | "list";

const initialTemplateQueryVariables: TemplatesByCategoryIdQueryVariables = {
  categoryId: null,
  paginationArgs: {
    first: 25,
    page: 1,
  },
  filterArgs: {},
  orderBy: [],
};

const initialState = {
  currentCategoryId: null,
  expandedCategoryIds: new Set<number>(),
  fetchedCategoryIds: new Set<number>(),
  templateQueryVariables: initialTemplateQueryVariables,
  viewMode: "card" as ViewMode,
};

/**
 * Templates Page UI Store State
 * Manages all UI-related state for the templates list page
 */
interface TemplatesPageUIState {
  // State
  currentCategoryId: number | null;
  expandedCategoryIds: Set<number>;
  fetchedCategoryIds: Set<number>;
  templateQueryVariables: TemplatesByCategoryIdQueryVariables;
  viewMode: ViewMode;

  // Actions
  setCurrentCategoryId: (id: number | null) => void;
  clearCurrentCategory: () => void;
  selectCategoryWithParentTree: (
    categoryId: number,
    parentTree: number[],
  ) => void;

  // Lazy loading actions
  setExpandedCategoryIds: (ids: Set<number>) => void;
  toggleExpanded: (id: number) => void;
  markAsFetched: (id: number) => void;
  isFetched: (id: number) => boolean;

  // Template query variables actions
  setTemplateQueryVariables: (
    vars: TemplatesByCategoryIdQueryVariables,
  ) => void;
  updateTemplateQueryVariables: (
    updater: (
      current: TemplatesByCategoryIdQueryVariables,
    ) => TemplatesByCategoryIdQueryVariables,
  ) => void;

  // View mode actions
  setViewMode: (mode: ViewMode) => void;

  reset: () => void;
}

/**
 * Zustand store for templates page UI state
 * Persists selections to sessionStorage for restoration
 */
export const useTemplatesPageStore = create<TemplatesPageUIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentCategoryId: (id) =>
        set((state) => ({
          currentCategoryId: id,
          templateQueryVariables: {
            ...state.templateQueryVariables,
            categoryId: id,
          },
        })),

      clearCurrentCategory: () =>
        set((state) => ({
          currentCategoryId: null,
          templateQueryVariables: {
            ...state.templateQueryVariables,
            categoryId: null,
          },
        })),

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
            expandedCategoryIds: newExpandedIds,
            fetchedCategoryIds: newFetchedIds,
            templateQueryVariables: {
              ...state.templateQueryVariables,
              categoryId: categoryId,
            },
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

      setTemplateQueryVariables: (vars) =>
        set({
          templateQueryVariables: {
            ...vars,
            categoryId: get().currentCategoryId,
          },
        }),

      updateTemplateQueryVariables: (updater) =>
        set((state) => ({
          templateQueryVariables: updater(state.templateQueryVariables),
        })),

      setViewMode: (mode) => set({ viewMode: mode }),

      reset: () => set(initialState),
    }),
    {
      name: "templates-page-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist selections for restoration
      partialize: (state) => ({
        currentCategoryId: state.currentCategoryId,
        expandedCategoryIds: Array.from(state.expandedCategoryIds),
        fetchedCategoryIds: Array.from(state.fetchedCategoryIds),
        templateQueryVariables: state.templateQueryVariables,
        viewMode: state.viewMode,
      }),
      // Custom merge to handle Set conversion
      merge: (persistedState, currentState) => {
        const typedPersistedState =
          persistedState as Partial<TemplatesPageUIState> & {
            expandedCategoryIds?: number[];
            fetchedCategoryIds?: number[];
          };
        return {
          ...currentState,
          ...typedPersistedState,
          expandedCategoryIds: new Set(
            typedPersistedState?.expandedCategoryIds || [],
          ),
          fetchedCategoryIds: new Set(
            typedPersistedState?.fetchedCategoryIds || [],
          ),
        };
      },
    },
  ),
);
