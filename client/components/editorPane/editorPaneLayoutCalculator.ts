/**
 * EditorPane Layout Calculator
 *
 * Pure functions for calculating pane layouts.
 * Separated from the store for testability and reusability.
 */

import type { PaneState } from "./editorPaneStoreFactory";

export const MIN_PANE_SIZE = 50;
export const COLLAPSED_PANE_WIDTH = 40;
export const RESIZER_WIDTH = 4;

/**
 * Helper to calculate number of visible resizers
 */
export const getVisibleResizerCount = (
  firstVisible: boolean,
  thirdVisible: boolean
): number => {
  return (firstVisible ? 1 : 0) + (thirdVisible ? 1 : 0);
};

/**
 * Calculate available width for panes (excluding resizers)
 */
export const getAvailableWidth = (
  totalWidth: number,
  firstVisible: boolean,
  thirdVisible: boolean
): number => {
  const resizerCount = getVisibleResizerCount(firstVisible, thirdVisible);
  return totalWidth - resizerCount * RESIZER_WIDTH;
};

/**
 * Calculate initial layout when component mounts or container size changes significantly
 */
export const calculateInitialLayout = (
  containerWidth: number,
  config: {
    firstVisible: boolean;
    thirdVisible: boolean;
    firstCollapsed: boolean;
    thirdCollapsed: boolean;
    firstPreferredRatio?: number;
    thirdPreferredRatio?: number;
  },
  currentState?: PaneState
): PaneState => {
  const availableWidth = getAvailableWidth(
    containerWidth,
    config.firstVisible,
    config.thirdVisible
  );

  // If we have a current state with valid sizes, scale them proportionally
  if (currentState && currentState.sizes.some((s) => s > 0)) {
    return scaleLayout(containerWidth, currentState);
  }

  // Calculate fresh layout
  const collapsedWidth =
    (config.firstVisible && config.firstCollapsed ? COLLAPSED_PANE_WIDTH : 0) +
    (config.thirdVisible && config.thirdCollapsed ? COLLAPSED_PANE_WIDTH : 0);

  const adjustableWidth = availableWidth - collapsedWidth;
  const visiblePanesCount = [
    config.firstVisible && !config.firstCollapsed,
    true, // Middle pane always counts
    config.thirdVisible && !config.thirdCollapsed,
  ].filter(Boolean).length;

  const sizePerPane = adjustableWidth / visiblePanesCount;

  return {
    sizes: [
      config.firstVisible
        ? config.firstCollapsed
          ? COLLAPSED_PANE_WIDTH
          : Math.max(MIN_PANE_SIZE, sizePerPane)
        : 0,
      Math.max(MIN_PANE_SIZE, sizePerPane),
      config.thirdVisible
        ? config.thirdCollapsed
          ? COLLAPSED_PANE_WIDTH
          : Math.max(MIN_PANE_SIZE, sizePerPane)
        : 0,
    ],
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
};

/**
 * Scale existing layout proportionally to new container width
 */
export const scaleLayout = (
  newWidth: number,
  currentState: PaneState
): PaneState => {
  const availableWidth = getAvailableWidth(
    newWidth,
    currentState.visibility.first,
    currentState.visibility.third
  );

  const collapsedWidth =
    (currentState.visibility.first && currentState.collapsed.first
      ? COLLAPSED_PANE_WIDTH
      : 0) +
    (currentState.visibility.third && currentState.collapsed.third
      ? COLLAPSED_PANE_WIDTH
      : 0);

  const currentNonCollapsedSize =
    (currentState.visibility.first && !currentState.collapsed.first
      ? currentState.sizes[0]
      : 0) +
    currentState.sizes[1] +
    (currentState.visibility.third && !currentState.collapsed.third
      ? currentState.sizes[2]
      : 0);

  const targetNonCollapsedWidth = availableWidth - collapsedWidth;
  
  if (currentNonCollapsedSize === 0) {
    return currentState;
  }

  const scale = targetNonCollapsedWidth / currentNonCollapsedSize;

  const newSizes = currentState.sizes.map((size, index) => {
    // Keep collapsed panes at fixed width
    if (index === 0 && currentState.collapsed.first) return COLLAPSED_PANE_WIDTH;
    if (index === 2 && currentState.collapsed.third) return COLLAPSED_PANE_WIDTH;
    
    // Hide invisible panes
    if (index === 0 && !currentState.visibility.first) return 0;
    if (index === 2 && !currentState.visibility.third) return 0;

    return Math.max(MIN_PANE_SIZE, size * scale);
  });

  return {
    ...currentState,
    sizes: newSizes,
  };
};

/**
 * Toggle collapse state for a pane
 */
export const togglePaneCollapse = (
  pane: 'first' | 'third',
  currentState: PaneState
): PaneState => {
  const paneIndex = pane === 'first' ? 0 : 2;
  const isCurrentlyCollapsed =
    pane === 'first' ? currentState.collapsed.first : currentState.collapsed.third;

  if (isCurrentlyCollapsed) {
    // Uncollapse: restore from preCollapseSizes
    const sizeToRestore =
      pane === 'first'
        ? currentState.preCollapseSizes.first
        : currentState.preCollapseSizes.third;

    if (!sizeToRestore || sizeToRestore <= COLLAPSED_PANE_WIDTH) {
      return currentState; // Nothing to restore
    }

    const sizeToTake = sizeToRestore - COLLAPSED_PANE_WIDTH;
    const newMiddleSize = currentState.sizes[1] - sizeToTake;

    if (newMiddleSize < MIN_PANE_SIZE) {
      // Can't fully restore
      const availableSize = currentState.sizes[1] - MIN_PANE_SIZE;
      const newSizes = [...currentState.sizes];
      newSizes[paneIndex] = COLLAPSED_PANE_WIDTH + availableSize;
      newSizes[1] = MIN_PANE_SIZE;

      return {
        ...currentState,
        sizes: newSizes,
        collapsed: {
          ...currentState.collapsed,
          [pane]: false,
        },
        preCollapseSizes: {
          ...currentState.preCollapseSizes,
          [pane]: null,
        },
      };
    }

    const newSizes = [...currentState.sizes];
    newSizes[paneIndex] = sizeToRestore;
    newSizes[1] = newMiddleSize;

    return {
      ...currentState,
      sizes: newSizes,
      collapsed: {
        ...currentState.collapsed,
        [pane]: false,
      },
      preCollapseSizes: {
        ...currentState.preCollapseSizes,
        [pane]: null,
      },
    };
  } else {
    // Collapse: save current size and collapse
    const currentSize = currentState.sizes[paneIndex];
    const sizeToRedistribute = currentSize - COLLAPSED_PANE_WIDTH;

    const newSizes = [...currentState.sizes];
    newSizes[paneIndex] = COLLAPSED_PANE_WIDTH;
    newSizes[1] = currentState.sizes[1] + sizeToRedistribute;

    return {
      ...currentState,
      sizes: newSizes,
      collapsed: {
        ...currentState.collapsed,
        [pane]: true,
      },
      preCollapseSizes: {
        ...currentState.preCollapseSizes,
        [pane]: currentSize,
      },
    };
  }
};

/**
 * Handle manual resize by dragging a resizer
 */
export const handleManualResize = (
  resizerIndex: 1 | 2,
  delta: number,
  currentState: PaneState
): PaneState => {
  const newSizes = [...currentState.sizes];

  if (resizerIndex === 1) {
    // Resizing between first and middle pane
    const newSize1 = newSizes[0] + delta;
    const newSize2 = newSizes[1] - delta;

    if (newSize1 >= MIN_PANE_SIZE && newSize2 >= MIN_PANE_SIZE) {
      newSizes[0] = newSize1;
      newSizes[1] = newSize2;
    }
  } else {
    // Resizing between middle and third pane
    const newSize2 = newSizes[1] + delta;
    const newSize3 = newSizes[2] - delta;

    if (newSize2 >= MIN_PANE_SIZE && newSize3 >= MIN_PANE_SIZE) {
      newSizes[1] = newSize2;
      newSizes[2] = newSize3;
    }
  }

  return {
    ...currentState,
    sizes: newSizes,
  };
};

/**
 * Set visibility for a pane
 */
export const setPaneVisibility = (
  pane: 'first' | 'third',
  visible: boolean,
  currentState: PaneState
): PaneState => {
  const paneIndex = pane === 'first' ? 0 : 2;
  const isCurrentlyVisible =
    pane === 'first' ? currentState.visibility.first : currentState.visibility.third;

  if (isCurrentlyVisible === visible) {
    return currentState; // No change
  }

  if (!visible) {
    // Hide pane: redistribute its size to middle pane
    const previousSizes = { ...currentState.previousSizes };
    previousSizes[pane] = currentState.sizes[paneIndex];

    const newSizes = [...currentState.sizes];
    newSizes[1] = currentState.sizes[1] + currentState.sizes[paneIndex];
    newSizes[paneIndex] = 0;

    return {
      ...currentState,
      sizes: newSizes,
      visibility: {
        ...currentState.visibility,
        [pane]: false,
      },
      previousSizes,
    };
  } else {
    // Show pane: restore from previousSizes or use default
    const sizeToRestore = currentState.previousSizes[pane];
    const restoredSize = sizeToRestore ?? MIN_PANE_SIZE;

    const newMiddleSize = currentState.sizes[1] - restoredSize;
    if (newMiddleSize < MIN_PANE_SIZE) {
      // Can't restore full size
      const availableSize = currentState.sizes[1] - MIN_PANE_SIZE;
      const newSizes = [...currentState.sizes];
      newSizes[paneIndex] = Math.max(MIN_PANE_SIZE, availableSize);
      newSizes[1] = MIN_PANE_SIZE;

      return {
        ...currentState,
        sizes: newSizes,
        visibility: {
          ...currentState.visibility,
          [pane]: true,
        },
        previousSizes: {
          ...currentState.previousSizes,
          [pane]: null,
        },
      };
    }

    const newSizes = [...currentState.sizes];
    newSizes[paneIndex] = restoredSize;
    newSizes[1] = newMiddleSize;

    return {
      ...currentState,
      sizes: newSizes,
      visibility: {
        ...currentState.visibility,
        [pane]: true,
      },
      previousSizes: {
        ...currentState.previousSizes,
        [pane]: null,
      },
    };
  }
};

