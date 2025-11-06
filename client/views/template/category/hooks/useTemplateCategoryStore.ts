import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Category tab types
 */
export type CategoryTabType = "all" | "deleted";

/**
 * Category UI Store State
 * Manages all UI-related state for category management
 * Stores IDs instead of full objects - objects are derived from Apollo cache
 */
type State = {
  currentTemplateId: number | null;
  activeCategoryTab: CategoryTabType;
  isAddingTemplate: boolean;
  isSwitchWarningOpen: boolean;
  pendingCategory: Graphql.TemplateCategoryWithParentTree | null;

  currentCategory: Graphql.TemplateCategoryWithParentTree | null;
  onNewTemplateCancel?: () => void; // Note: Storing functions is not ideal for persistence, but we'll mirror the current logic.

  // Lazy loading state
  expandedCategoryIds: Set<number>;
  fetchedCategoryIds: Set<number>; // Track which categories have had their children fetched

  // Template query variables per category
  templateQueryVariables: Map<number, Graphql.TemplatesByCategoryIdQueryVariables>;
};

type Actions = {
  onNewTemplateCancel?: () => void; // Note: Storing functions is not ideal for persistence, but we'll mirror the current logic.

  selectCategory: (category: Graphql.TemplateCategoryWithParentTree | null) => void;
  updateSelectedCategory: (category: Graphql.TemplateCategoryWithParentTree | null) => void;
  setCurrentTemplateId: (id: number | null) => void;
  setActiveCategoryTab: (tab: CategoryTabType) => void;
  setIsAddingTemplate: (adding: boolean) => void;

  setOnNewTemplateCancel: (callback?: () => void) => void;

  // Category switching with warning
  confirmSwitch: () => void;
  closeSwitchWarning: () => void;

  // Lazy loading actions
  setExpandedCategoryIds: (ids: Set<number>) => void;
  toggleExpanded: (id: number) => void;
  markAsFetched: (id: number) => void;
  isFetched: (id: number) => boolean;

  // Template query variables actions
  setTemplateQueryVariables: (categoryId: number, vars: Graphql.TemplatesByCategoryIdQueryVariables) => void;
  getTemplateQueryVariables: (categoryId: number) => Graphql.TemplatesByCategoryIdQueryVariables | undefined;
  resetTemplateQueryVariables: (categoryId: number) => void;

  reset: () => void;
};

type CategoryUIState = State & Actions;

const initialState: State = {
  currentTemplateId: null,
  activeCategoryTab: "all" as CategoryTabType,
  isAddingTemplate: false,
  isSwitchWarningOpen: false,
  pendingCategory: null,

  currentCategory: null,

  expandedCategoryIds: new Set<number>(),
  fetchedCategoryIds: new Set<number>(),
  templateQueryVariables: new Map<number, Graphql.TemplatesByCategoryIdQueryVariables>(),
};

/**
 * Zustand store for category UI state
 * Persists selections to sessionStorage for restoration
 */
export const useTemplateCategoryStore = create<CategoryUIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentTemplateId: id => set({ currentTemplateId: id }),

      setActiveCategoryTab: tab =>
        set({
          activeCategoryTab: tab,
        }),

      setIsAddingTemplate: adding => set({ isAddingTemplate: adding }),

      setOnNewTemplateCancel: callback => set({ onNewTemplateCancel: callback }),

      selectCategory: category => {
        set(state => {
          // Early return if selecting the same category
          if (category?.id === state.currentCategory?.id) {
            return state;
          }

          let currentCategory = state.currentCategory;
          let currentTemplateId = state.currentTemplateId;
          if (state.isAddingTemplate && category?.id !== state.currentCategory?.id) {
            return {
              isSwitchWarningOpen: true,
              pendingCategory: category,
            };
          } else {
            if (category?.id !== currentCategory?.id) {
              currentCategory = category;
              currentTemplateId = null;
            }
          }

          const newExpandedIds = new Set(state.expandedCategoryIds);
          const newFetchedIds = new Set(state.fetchedCategoryIds);

          category?.parentTree.forEach(id => {
            newExpandedIds.add(id);
            newFetchedIds.add(id);
          });

          return {
            currentCategory: currentCategory,
            currentTemplateId: currentTemplateId,
            expandedCategoryIds: newExpandedIds,
            fetchedCategoryIds: newFetchedIds,
          };
        });
      },

      updateSelectedCategory: category => {
        set(state => {
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

      confirmSwitch: () => {
        const { pendingCategory, onNewTemplateCancel } = get();
        if (onNewTemplateCancel) {
          onNewTemplateCancel();
        }
        set({
          isAddingTemplate: false,
          currentCategory: pendingCategory,
          currentTemplateId: null,
          isSwitchWarningOpen: false,
          pendingCategory: null,
        });
      },

      closeSwitchWarning: () =>
        set({
          isSwitchWarningOpen: false,
          pendingCategory: null,
        }),

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

      setTemplateQueryVariables: (categoryId, vars) =>
        set(state => {
          const newMap = new Map(state.templateQueryVariables);
          newMap.set(categoryId, vars);
          return { templateQueryVariables: newMap };
        }),

      getTemplateQueryVariables: categoryId => {
        return get().templateQueryVariables.get(categoryId);
      },

      resetTemplateQueryVariables: categoryId =>
        set(state => {
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
      // Exclude non-serializable function from persistence
      // expandedCategoryIds and fetchedCategoryIds are in-memory only (not persisted)
      partialize: state => {
        const { ...rest } = state;
        return {
          currentCategoryId: rest.currentCategory?.id,
          currentTemplateId: rest.currentTemplateId,
          activeCategoryTab: rest.activeCategoryTab,
          currentCategory: rest.currentCategory,
          templateQueryVariables: Array.from(rest.templateQueryVariables.entries()), // Convert Map to Array for JSON
        };
      },
      // Custom merge to handle Set and Map conversion
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<CategoryUIState> & {
          templateQueryVariables?: [number, Graphql.TemplatesByCategoryIdQueryVariables][];
        };

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
          templateQueryVariables: new Map(typedPersistedState?.templateQueryVariables || []), // Convert Array back to Map
        };
      },
    }
  )
);

/**
 * Helper to validate category tab type
 */
export function isValidCategoryTab(tab: string): tab is CategoryTabType {
  return ["all", "deleted"].includes(tab);
}
