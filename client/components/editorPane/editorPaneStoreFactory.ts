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
   * Direct state setter - only way to update store
   */
  setPaneState: (state: PaneState) => void;
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
 * Factory function to create a new EditorPane store
 *
 * The store handles initialization logic by:
 * 1. Checking if persisted state exists in localStorage
 * 2. If it exists, using persisted state (highest priority)
 * 3. If not, creating initial state with sensible defaults
 *
 * @param storageKey - Unique key for this store's localStorage persistence
 * @returns A new Zustand store instance
 */
export const createEditorPaneStore = (storageKey: string) => {
  const fullStorageKey = `${STORAGE_KEY_PREFIX}_${storageKey}`;

  // Create the initial state with sensible defaults
  // This will be overridden by persisted state if it exists
  const getInitialState = (): PaneState => {
    const initialState = {
      sizes: [0, 0, 0],
      visibility: {
        first: true,
        third: true,
      },
      collapsed: {
        first: false,
        third: false,
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

  return create<EditorPaneStoreWithPersist>()(
    persist(
      set => {
        const initialState = getInitialState();

        return {
          // Initial state - will be overridden by persisted state if it exists
          ...initialState,
          _hasHydrated: false,

          // Actions - only setPaneState for updating store
          setPaneState: (state: PaneState) => {
            set(state);
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
            if (error || !state) {
              return;
            }
            state._hasHydrated = true;
          };
        },
      }
    )
  );
};
