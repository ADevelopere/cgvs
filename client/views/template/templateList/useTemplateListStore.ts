import * as Graphql from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * View mode types
 */
export type ViewMode = "card" | "grid" | "list";

/**
 * Templates Page UI Store State
 * Manages all UI-related state for the templates list page
 */
type State = {
  currentCategory: Graphql.TemplateCategoryWithParentTree | null;
  expandedCategoryIds: Set<number>;
  fetchedCategoryIds: Set<number>;
  templateQueryVariables: Graphql.TemplatesByCategoryIdQueryVariables;
  viewMode: ViewMode;
};
type Actions = {
  // Category selection actions
  selectCategory: (category: Graphql.TemplateCategoryWithParentTree | null) => void;
  updateSelectedCategory: (category: Graphql.TemplateCategoryWithParentTree | null) => void;

  // Lazy loading actions
  setExpandedCategoryIds: (ids: Set<number>) => void;
  toggleExpanded: (id: number) => void;
  markAsFetched: (id: number) => void;
  isFetched: (id: number) => boolean;

  // Template query variables actions
  setTemplateQueryVariables: (vars: Graphql.TemplatesByCategoryIdQueryVariables) => void;
  updateTemplateQueryVariables: (
    updater: (current: Graphql.TemplatesByCategoryIdQueryVariables) => Graphql.TemplatesByCategoryIdQueryVariables
  ) => void;

  // View mode actions
  setViewMode: (mode: ViewMode) => void;

  reset: () => void;
};

type TemplateListState = State & Actions;

const initialTemplateQueryVariables: Graphql.TemplatesByCategoryIdQueryVariables = {
  categoryId: null,
  paginationArgs: {
    first: 25,
    page: 1,
  },
  filterArgs: {},
  orderBy: [],
};

const initialState: State = {
  currentCategory: null,
  expandedCategoryIds: new Set<number>(),
  fetchedCategoryIds: new Set<number>(),
  templateQueryVariables: initialTemplateQueryVariables,
  viewMode: "card" as ViewMode,
};

/**
 * Zustand store for templates page UI state
 * Persists selections to sessionStorage for restoration
 */
export const useTemplateListStore = create<TemplateListState>()(
  persist(
    (set, get) => ({
      ...initialState,

      selectCategory: category => {
        set(state => {
          // Early return if selecting the same category
          if (category?.id === state.currentCategory?.id) {
            return state;
          }

          // Handle clearing category when null
          if (!category) {
            return {
              currentCategory: null,
              templateQueryVariables: {
                ...state.templateQueryVariables,
                categoryId: null,
              },
            };
          }

          const newExpandedIds = new Set(state.expandedCategoryIds);
          const newFetchedIds = new Set(state.fetchedCategoryIds);

          // Mark all IDs in parentTree as fetched and expanded
          category.parentTree.forEach(id => {
            newExpandedIds.add(id);
            newFetchedIds.add(id);
          });

          return {
            currentCategory: category,
            expandedCategoryIds: newExpandedIds,
            fetchedCategoryIds: newFetchedIds,
            templateQueryVariables: {
              ...state.templateQueryVariables,
              categoryId: category.id,
            },
          };
        });
      },

      updateSelectedCategory: category => {
        set(state => {
          logger.log({ caller: "useTemplateListStore" }, category);
          logger.log({ caller: "useTemplateListStore" }, state.currentCategory);
          // Only update if we have a current category and the new category has the same ID
          if (!state.currentCategory || !category || state.currentCategory.id !== category.id) {
            return state;
          }

          // Only update if the category object has actually changed
          if (state.currentCategory === category) {
            return state;
          }

          // Update the category object with the latest data from Apollo cache
          return {
            currentCategory: category,
          };
        });
      },

      setExpandedCategoryIds: ids => set({ expandedCategoryIds: ids }),

      toggleExpanded: id =>
        set(state => {
          const newSet = new Set(state.expandedCategoryIds);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { expandedCategoryIds: newSet };
        }),

      markAsFetched: id =>
        set(state => {
          const newSet = new Set(state.fetchedCategoryIds);
          newSet.add(id);
          return { fetchedCategoryIds: newSet };
        }),

      isFetched: id => {
        return get().fetchedCategoryIds.has(id);
      },

      setTemplateQueryVariables: vars =>
        set({
          templateQueryVariables: {
            ...vars,
            categoryId: get().currentCategory?.id || null,
          },
        }),

      updateTemplateQueryVariables: updater =>
        set(state => ({
          templateQueryVariables: updater(state.templateQueryVariables),
        })),

      setViewMode: mode => set({ viewMode: mode }),

      reset: () => set(initialState),
    }),
    {
      name: "templates-page-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist selections for restoration
      // expandedCategoryIds and fetchedCategoryIds are in-memory only (not persisted)
      partialize: state => ({
        currentCategory: state.currentCategory,
        templateQueryVariables: state.templateQueryVariables,
        viewMode: state.viewMode,
      }),
      // Custom merge to handle Set conversion
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<TemplateListState>;

        // Initialize expandedCategoryIds from current category's parent tree
        const currentCategory = typedPersistedState?.currentCategory || currentState.currentCategory;
        const expandedCategoryIds = new Set<number>();
        const fetchedCategoryIds = new Set<number>();

        if (currentCategory?.parentTree) {
          currentCategory.parentTree.forEach(id => {
            expandedCategoryIds.add(id);
            fetchedCategoryIds.add(id);
          });
        }

        return {
          ...currentState,
          ...typedPersistedState,
          // Initialize expandedCategoryIds from current category's parent tree
          expandedCategoryIds,
          fetchedCategoryIds,
        };
      },
    }
  )
);
