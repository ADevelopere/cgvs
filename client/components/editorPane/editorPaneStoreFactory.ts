/**
 * EditorPane Store Factory
 *
 * This module provides a factory function to create individual Zustand stores
 * for EditorPane state management. Each store is isolated and persists its
 * state to localStorage independently.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Type representing the state of an EditorPane
 * Matches the PaneState type from EditorPane.tsx
 */
export type PaneState = {
  sizes: number[];
  visibility: {
    first: boolean;
    third: boolean;
  };
  collapsed: {
    first: boolean;
    third: boolean;
  };
  previousSizes: {
    first: number | null;
    third: number | null;
  };
  preCollapseSizes: {
    first: number | null;
    third: number | null;
  };
};

/**
 * Layout calculation constants
 */
export const MIN_PANE_SIZE = 50;
export const COLLAPSED_PANE_WIDTH = 40;
export const RESIZER_WIDTH = 4;

/**
 * Store actions for managing pane state
 */
export type EditorPaneStoreActions = {
  /**
   * Initialize or recalculate layout when container width changes
   */
  handleContainerResize: (
    containerWidth: number,
    config: {
      firstVisible: boolean;
      thirdVisible: boolean;
      firstCollapsed: boolean;
      thirdCollapsed: boolean;
      firstPreferredRatio?: number;
      thirdPreferredRatio?: number;
    }
  ) => void;

  /**
   * Handle manual resize by dragging resizer
   */
  handleManualResize: (resizerIndex: 1 | 2, delta: number) => void;

  /**
   * Toggle collapse state for a pane
   */
  toggleCollapse: (pane: "first" | "third") => void;

  /**
   * Set visibility for a pane
   */
  setVisibility: (pane: "first" | "third", visible: boolean) => void;

  /**
   * Direct state setter (for migration purposes)
   */
  setPaneState: (state: PaneState) => void;

  /**
   * Reset to initial state
   */
  reset: (initialState: PaneState) => void;
};

/**
 * Combined store type
 */
export type EditorPaneStore = PaneState & EditorPaneStoreActions;

/**
 * Store with persist API
 */
export type EditorPaneStoreWithPersist = EditorPaneStore & {
  _hasHydrated?: boolean;
};

/**
 * Storage key prefix for localStorage
 */
const STORAGE_KEY_PREFIX = "editorPane";

/**
 * Initial values for pane configuration
 */
export type PaneInitialConfig = {
  firstVisible: boolean;
  thirdVisible: boolean;
  firstCollapsed: boolean;
  thirdCollapsed: boolean;
};

/**
 * Factory function to create a new EditorPane store
 *
 * The store handles initialization logic by:
 * 1. Checking if persisted state exists in localStorage
 * 2. If it exists, using persisted state
 * 3. If not, creating initial state from the provided config
 *
 * @param storageKey - Unique key for this store's localStorage persistence
 * @param config - Initial configuration for the pane
 * @returns A new Zustand store instance
 */
export const createEditorPaneStore = (
  storageKey: string,
  config: PaneInitialConfig
) => {
  const fullStorageKey = `${STORAGE_KEY_PREFIX}_${storageKey}`;

  // Create the initial state from config
  const getInitialState = (): PaneState => {
    const initialState = {
      sizes: [0, 0, 0],
      visibility: {
        first: config.firstVisible,
        third: config.thirdVisible,
      },
      collapsed: {
        first: config.firstCollapsed,
        third: config.thirdCollapsed,
      },
      previousSizes: {
        first: null,
        third: null,
      },
      preCollapseSizes: {
        first: null,
        third: null,
      },
    };
    return initialState;
  };

  Z;
  return create<EditorPaneStoreWithPersist>()(
    persist(
      set => {
        const initialState = getInitialState();

        return {
          // Initial state - will be overridden by persisted state if it exists
          ...initialState,
          _hasHydrated: false,

          // Actions
          setPaneState: (state: PaneState) => {
            set(state);
          },

          updateSizes: (sizes: number[]) => {
            set({ sizes });
          },

          updateVisibility: (visibility: {
            first: boolean;
            third: boolean;
          }) => {
            set({ visibility });
          },

          updateCollapsed: (collapsed: { first: boolean; third: boolean }) => {
            set({ collapsed });
          },

          updatePreviousSizes: (previousSizes: {
            first: number | null;
            third: number | null;
          }) => {
            set({ previousSizes });
          },

          updatePreCollapseSizes: (preCollapseSizes: {
            first: number | null;
            third: number | null;
          }) => {
            set({ preCollapseSizes });
          },

          reset: (newInitialState: PaneState) => {
            set(newInitialState);
          },
        };
      },
      {
        name: fullStorageKey,
        storage: createJSONStorage(() => localStorage),
        // Only persist the actual pane state, not the action functions
        partialize: state => {
          const persistedState = {
            sizes: state.sizes,
            visibility: state.visibility,
            collapsed: state.collapsed,
            previousSizes: state.previousSizes,
            preCollapseSizes: state.preCollapseSizes,
          };
          return persistedState;
        },
        // Track when hydration is complete
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error) {
              state._hasHydrated = true;
            }
          };
        },
      }
    )
  );
};
