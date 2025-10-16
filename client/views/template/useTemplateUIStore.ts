import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

const initialTabErrors: Record<TemplateManagementTabType, TabError | undefined> = {
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

      setTabLoaded: (tab) => set((state) => ({
        loadedTabs: state.loadedTabs.includes(tab)
          ? state.loadedTabs
          : [...state.loadedTabs, tab],
      })),

      setTabError: (tab, error) => set((state) => ({
        tabErrors: { ...state.tabErrors, [tab]: error },
      })),

      clearTabError: (tab) => set((state) => ({
        tabErrors: { ...state.tabErrors, [tab]: undefined },
      })),

      setInitializedFromURL: (initialized) => set({ initializedFromURL: initialized }),

      reset: () => set(initialState),
    }),
    {
      name: 'template-ui-store',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist activeTab for restoration
      partialize: (state) => ({
        activeTab: state.activeTab,
      }),
    }
  )
);

/**
 * Helper to validate tab type
 */
export function isValidTab(tab: string): tab is TemplateManagementTabType {
  return ["basic", "variables", "editor", "recipients", "recipientsManagement", "preview"].includes(tab);
}

/**
 * Helper function to update URL parameters without causing navigation
 */
function updateURLParams(tab: TemplateManagementTabType) {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url.toString());
  }
}

/**
 * Initialize store from URL parameters or sync URL with current store state
 * Call this on mount to handle both initial load and navigation within layout
 */
export function initializeTemplateUIFromURL(searchParams: URLSearchParams) {
  const store = useTemplateUIStore.getState();
  
  // If store has already been initialized from URL, sync URL params to current store state
  if (store.initializedFromURL) {
    updateURLParams(store.activeTab);
    return;
  }
  
  // First time initialization: read from URL params
  const tab = searchParams.get('tab') as TemplateManagementTabType | null;
  
  if (tab && isValidTab(tab)) {
    store.setActiveTab(tab);
  }
  
  // Mark as initialized from URL
  store.setInitializedFromURL(true);
}

