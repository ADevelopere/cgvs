/**
 * EditorPane Layout Hook
 *
 * Orchestrates layout calculations and store updates.
 * Components use this hook to trigger calculations without directly accessing the store.
 * The hook reads from store, calls pure calculator functions, and updates store.
 */

import { useMemo } from "react";
import { getEditorPaneStore } from "./editorPaneStoreManager";
import type { PaneInitialConfig } from "./editorPaneStoreFactory";
import {
  calculateInitialLayout,
  scaleLayout,
  togglePaneCollapse,
  setPaneVisibility,
  handleManualResize as calculateManualResize,
} from "./editorPaneLayoutCalculator";

export type PaneConfig = {
  firstVisible: boolean;
  thirdVisible: boolean;
  firstCollapsed: boolean;
  thirdCollapsed: boolean;
  firstPreferredRatio?: number;
  thirdPreferredRatio?: number;
};

export type UseEditorPaneLayoutReturn = {
  handleContainerResize: (width: number, config: PaneConfig) => void;
  handleManualResize: (resizerIndex: 1 | 2, delta: number) => void;
  handleVisibilityChange: (pane: "first" | "third", visible: boolean) => void;
  handleCollapseToggle: (pane: "first" | "third") => void;
};

/**
 * Hook that provides layout calculation functions
 *
 * @param storageKey - Unique key for this pane's store
 * @param initialConfig - Initial configuration for the pane
 * @returns Object with calculation functions
 */
export const useEditorPaneLayout = (
  storageKey: string,
  initialConfig: PaneInitialConfig
): UseEditorPaneLayoutReturn => {
  // Get store reference (stable across renders)
  const store = useMemo(
    () => getEditorPaneStore(storageKey, initialConfig),
    [storageKey, initialConfig]
  );

  // Memoize the calculation functions
  const handlers = useMemo(
    () => ({
      /**
       * Handle container resize - recalculates layout for new width
       */
      handleContainerResize: (width: number, config: PaneConfig) => {
        const currentState = store.getState();
        
        // If we have valid existing sizes, scale them
        if (currentState.sizes.some(s => s > 0)) {
          const newState = scaleLayout(width, currentState);
          store.getState().setPaneState(newState);
        } else {
          // Calculate fresh layout
          const newState = calculateInitialLayout(width, config, currentState);
          store.getState().setPaneState(newState);
        }
      },

      /**
       * Handle manual resize by dragging resizer
       */
      handleManualResize: (resizerIndex: 1 | 2, delta: number) => {
        const currentState = store.getState();
        const newState = calculateManualResize(resizerIndex, delta, currentState);
        store.getState().setPaneState(newState);
      },

      /**
       * Handle visibility change for a pane
       */
      handleVisibilityChange: (pane: "first" | "third", visible: boolean) => {
        const currentState = store.getState();
        const newState = setPaneVisibility(pane, visible, currentState);
        store.getState().setPaneState(newState);
      },

      /**
       * Toggle collapse state for a pane
       */
      handleCollapseToggle: (pane: "first" | "third") => {
        const currentState = store.getState();
        const newState = togglePaneCollapse(pane, currentState);
        store.getState().setPaneState(newState);
      },
    }),
    [store]
  );

  return handlers;
};

