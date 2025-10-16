import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Navigation state structure for each page
 */
interface PageState {
  params: string; // URLSearchParams as string
  timestamp: number;
}

/**
 * Navigation State Store
 *
 * Automatically tracks and persists URL parameters for every page.
 * Used by AutomatedNavigationProvider to save/restore page states.
 */
interface NavigationStateStore {
  // State
  pageStates: Record<string, PageState>; // pathname -> PageState
  lastVisitedChildren: Record<string, string>; // parent path -> last visited child path

  // Actions
  savePageState: (pathname: string, params: string) => void;
  saveLastVisitedChild: (parentPath: string, childPath: string) => void;
  restorePageState: (pathname: string) => string | null;
  restoreLastVisitedChild: (parentPath: string) => string | null;
  clearPageState: (pathname: string) => void;
  clearAllStates: () => void;
}

/**
 * Zustand store for navigation state management
 * Persists to sessionStorage for cross-navigation preservation
 */
export const useNavigationStateStore = create<NavigationStateStore>()(
  persist(
    (set, get) => ({
      // Initial state
      pageStates: {},
      lastVisitedChildren: {},

      /**
       * Save current page's URL parameters
       * @param pathname - The page path (e.g., '/admin/templates/15/manage')
       * @param params - URLSearchParams as string (e.g., 'tab=editor&filter=active')
       */
      savePageState: (pathname: string, params: string) => {
        set((state) => ({
          pageStates: {
            ...state.pageStates,
            [pathname]: {
              params,
              timestamp: Date.now(),
            },
          },
        }));
      },

      /**
       * Save the last visited child path for a parent segment
       * Used for sidebar navigation to remember the last sub-page
       * @param parentPath - Parent path (e.g., '/admin/templates')
       * @param childPath - Last visited child path (e.g., '/admin/templates/15/manage?tab=editor')
       */
      saveLastVisitedChild: (parentPath: string, childPath: string) => {
        set((state) => ({
          lastVisitedChildren: {
            ...state.lastVisitedChildren,
            [parentPath]: childPath,
          },
        }));
      },

      /**
       * Restore saved URL parameters for a page
       * @param pathname - The page path to restore
       * @returns Saved params string or null if not found
       */
      restorePageState: (pathname: string): string | null => {
        const state = get();
        const pageState = state.pageStates[pathname];
        return pageState?.params || null;
      },

      /**
       * Get the last visited child path for a parent segment
       * @param parentPath - Parent path (e.g., '/admin/templates')
       * @returns Last visited child path or null if not found
       */
      restoreLastVisitedChild: (parentPath: string): string | null => {
        const state = get();
        return state.lastVisitedChildren[parentPath] || null;
      },

      /**
       * Clear saved state for a specific page
       * @param pathname - The page path to clear
       */
      clearPageState: (pathname: string) => {
        set((state) => {
          const newPageStates = { ...state.pageStates };
          delete newPageStates[pathname];
          return { pageStates: newPageStates };
        });
      },

      /**
       * Clear all saved states
       * Useful for logout or reset scenarios
       */
      clearAllStates: () => {
        set({
          pageStates: {},
          lastVisitedChildren: {},
        });
      },
    }),
    {
      name: "navigation-state-store",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the actual state data
      partialize: (state) => ({
        pageStates: state.pageStates,
        lastVisitedChildren: state.lastVisitedChildren,
      }),
    },
  ),
);
