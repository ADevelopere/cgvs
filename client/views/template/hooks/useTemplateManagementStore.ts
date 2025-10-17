import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Tab types for template management
 */
export type TemplateManagementTabType =
  | "basic"
  | "variables"
  | "editor"
  | "recipients"
  | "recipientsManagement"
  | "preview";

/**
 * Tab error structure
 */
export interface TabError {
  message: string;
}

/**
 * Template UI Store State
 * Manages all UI-related state for template management
 */
interface TemplateUIState {
  // State
  activeTab: TemplateManagementTabType;
  unsavedChanges: boolean;
  loadedTabs: TemplateManagementTabType[];
  tabErrors: Record<TemplateManagementTabType, TabError | undefined>;
  initializedFromURL: boolean; // Non-persisted state to track if store was initialized from URL

  // Actions
  setActiveTab: (tab: TemplateManagementTabType) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
  setTabLoaded: (tab: TemplateManagementTabType) => void;
  setTabError: (tab: TemplateManagementTabType, error: TabError) => void;
  clearTabError: (tab: TemplateManagementTabType) => void;
  setInitializedFromURL: (initialized: boolean) => void;
  reset: () => void;
}

const initialTabErrors: Record<
  TemplateManagementTabType,
  TabError | undefined
> = {
  basic: undefined,
  variables: undefined,
  editor: undefined,
  recipients: undefined,
  recipientsManagement: undefined,
  preview: undefined,
};

const initialState = {
  activeTab: "basic" as TemplateManagementTabType,
  unsavedChanges: false,
  loadedTabs: [] as TemplateManagementTabType[],
  tabErrors: initialTabErrors,
  initializedFromURL: false,
};

/**
 * Zustand store for template UI state
 * Persists only activeTab to sessionStorage for restoration
 */
export const useTemplateUIStore = create<TemplateUIState>()(
  persist(
    (set) => ({
      ...initialState,

      setActiveTab: (tab) => set({ activeTab: tab }),

      setUnsavedChanges: (hasChanges) => set({ unsavedChanges: hasChanges }),

      setTabLoaded: (tab) =>
        set((state) => ({
          loadedTabs: state.loadedTabs.includes(tab)
            ? state.loadedTabs
            : [...state.loadedTabs, tab],
        })),

      setTabError: (tab, error) =>
        set((state) => ({
          tabErrors: { ...state.tabErrors, [tab]: error },
        })),

      clearTabError: (tab) =>
        set((state) => ({
          tabErrors: { ...state.tabErrors, [tab]: undefined },
        })),

      setInitializedFromURL: (initialized) =>
        set({ initializedFromURL: initialized }),

      reset: () => set(initialState),
    }),
    {
      name: "template-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist activeTab for restoration
      partialize: (state) => ({
        activeTab: state.activeTab,
      }),
    },
  ),
);

/**
 * Helper to validate tab type
 */
export function isValidTab(tab: string): tab is TemplateManagementTabType {
  return [
    "basic",
    "variables",
    "editor",
    "recipients",
    "recipientsManagement",
    "preview",
  ].includes(tab);
}
