import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import logger from "@/lib/logger";

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
 * Used by DashboardLayoutContext to save/restore page states.
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
  clearLastVisitedChild: (parentPath: string) => void;
  clearAllStates: () => void;
}

/**
 * Zustand store for navigation state management
 * Persists to sessionStorage for cross-navigation preservation
 */
export const useNavigationStateStore = create<NavigationStateStore>()(
  persist(
    (set, get) => {
      logger.log("[NavigationStateStore] Store initialized");
      return {
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
          logger.log("[NavigationStateStore] saveLastVisitedChild called:", {
            parentPath,
            childPath,
            timestamp: new Date().toISOString(),
          });
          set((state) => {
            const newState = {
              lastVisitedChildren: {
                ...state.lastVisitedChildren,
                [parentPath]: childPath,
              },
            };
            logger.log(
              "[NavigationStateStore] saveLastVisitedChild updating state:",
              {
                parentPath,
                childPath,
                previousChildren: state.lastVisitedChildren,
                newChildren: newState.lastVisitedChildren,
              },
            );
            return newState;
          });
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
          const result = state.lastVisitedChildren[parentPath];
          // Return null if the value is empty string or undefined
          const finalResult = result && result !== "" ? result : null;
          logger.log("[NavigationStateStore] restoreLastVisitedChild called:", {
            parentPath,
            result,
            finalResult,
            allChildren: state.lastVisitedChildren,
            timestamp: new Date().toISOString(),
          });
          return finalResult;
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
         * Clear the last visited child for a parent path
         * @param parentPath - Parent path to clear
         */
        clearLastVisitedChild: (parentPath: string) => {
          logger.log("[NavigationStateStore] clearLastVisitedChild called:", {
            parentPath,
            timestamp: new Date().toISOString(),
          });
          set((state) => {
            const newLastVisitedChildren = { ...state.lastVisitedChildren };
            delete newLastVisitedChildren[parentPath];
            logger.log(
              "[NavigationStateStore] clearLastVisitedChild updating state:",
              {
                parentPath,
                previousChildren: state.lastVisitedChildren,
                newChildren: newLastVisitedChildren,
              },
            );
            return { lastVisitedChildren: newLastVisitedChildren };
          });
        },

        /**
         * Clear all saved states
         * Useful for logout or reset scenarios
         */
        clearAllStates: () => {
          logger.log("[NavigationStateStore] clearAllStates called");
          set({
            pageStates: {},
            lastVisitedChildren: {},
          });
        },
      };
    },
    {
      name: "navigation-state-store",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the actual state data
      partialize: (state) => ({
        pageStates: state.pageStates,
        lastVisitedChildren: state.lastVisitedChildren,
      }),
      onRehydrateStorage: () => (state) => {
        logger.log(
          "[NavigationStateStore] Store rehydrated from sessionStorage:",
          {
            state: state
              ? {
                  pageStatesCount: Object.keys(state.pageStates || {}).length,
                  lastVisitedChildrenCount: Object.keys(
                    state.lastVisitedChildren || {},
                  ).length,
                  lastVisitedChildren: state.lastVisitedChildren,
                }
              : "No state",
          },
        );
      },
    },
  ),
);
