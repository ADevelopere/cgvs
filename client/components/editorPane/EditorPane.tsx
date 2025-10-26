// Helper to remove focus so text isn't selected while dragging
function unFocus(doc: Document, win: Window) {
  const selection = doc.getSelection();
  if (selection) {
    selection.removeAllRanges();
    return;
  }
  try {
    win.getSelection()?.removeAllRanges();
  } catch {
    // no-op
  }
}

import React, {
  CSSProperties,
  FC,
  ReactNode,
  TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import EditorPaneResizer from "./EditorPaneResizer";
import { Box } from "@mui/material";
import { useAppTheme } from "@/client/contexts";
import { getEditorPaneStore } from "@/client/components/editorPane/editorPaneStoreManager";
import type {
  PaneState,
  PaneInitialConfig,
} from "@/client/components/editorPane/editorPaneStoreFactory";

// Filter out null or undefined children
function removeNullChildren(children: ReactNode[]) {
  return React.Children.toArray(children).filter(Boolean);
}

type PaneProps = {
  minRatio?: number;
  maxRatio?: number;
  preferredRatio?: number;
  className?: string;
  style?: CSSProperties;
  visible: boolean;
  collapsed?: boolean;
};

const defaultPaneProps: PaneProps = {
  preferredRatio: 0.33, // Default to roughly 1/3 for each pane
  visible: true,
};

type ResizerProps = {
  className?: string;
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
};

type EditorPaneProps = {
  allowResize?: boolean;
  children: ReactNode[];
  className?: string;
  orientation?: "vertical" | "horizontal";
  onDragStarted?: () => void;
  onDragFinished?: (sizes: number[]) => void;
  onChange?: (sizes: number[]) => void;
  onFirstPaneUncollapse?: () => void;
  onThirdPaneUncollapse?: () => void;
  style?: CSSProperties;
  paneClassName?: string;
  paneStyle?: CSSProperties;
  firstPane?: PaneProps;
  middlePane?: PaneProps;
  thirdPane?: PaneProps;
  resizerProps?: ResizerProps;
  containerRef?: React.RefObject<HTMLElement>;
  width?: number;
  storageKey: string;
};

// Constants for pane state
const MIN_PANE_SIZE = 50; // Minimum width to keep panes visible
// todo: receive from props
const COLLAPSED_PANE_WIDTH = 40; // Width when pane is collapsed (header + button)
const RESIZER_WIDTH = 4; // Width of resizer component (must match EditorPaneResizer minWidth)

// Helper to calculate number of visible resizers
const getVisibleResizerCount = (
  firstVisible: boolean,
  thirdVisible: boolean
) => {
  return (firstVisible ? 1 : 0) + (thirdVisible ? 1 : 0);
};

const EditorPane: FC<EditorPaneProps> = ({
  allowResize = true,
  children,
  className,
  orientation = "vertical",
  onDragStarted,
  onDragFinished,
  onChange,
  onFirstPaneUncollapse,
  onThirdPaneUncollapse,
  style: styleProps,
  paneClassName = "",
  paneStyle,
  firstPane = defaultPaneProps,
  middlePane = { ...defaultPaneProps, visible: true }, // Middle pane is always visible
  thirdPane = defaultPaneProps,
  resizerProps,
  containerRef,
  width,
  storageKey,
}) => {
  const notNullChildren = removeNullChildren(children);
  const { isRtl } = useAppTheme();
  const editorPaneRef = useRef<HTMLDivElement | null>(null);
  const pane1Ref = useRef<HTMLDivElement | null>(null);
  const pane2Ref = useRef<HTMLDivElement | null>(null);
  const pane3Ref = useRef<HTMLDivElement | null>(null);

  // Create initial config for the store
  const initialConfig = useMemo<PaneInitialConfig>(
    () => ({
      firstVisible: firstPane.visible,
      thirdVisible: thirdPane.visible,
      firstCollapsed: firstPane.collapsed ?? false,
      thirdCollapsed: thirdPane.collapsed ?? false,
    }),
    [
      firstPane.visible,
      thirdPane.visible,
      firstPane.collapsed,
      thirdPane.collapsed,
    ]
  );

  // Get or create store for this storageKey
  const store = useMemo(
    () => getEditorPaneStore(storageKey, initialConfig),
    [storageKey, initialConfig]
  );

  // Create a stable ref to the store for use in callbacks
  const storeRef = useRef(store);
  storeRef.current = store;

  // State for triggering re-renders when store changes
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

  // Subscribe to store changes to trigger re-renders
  useEffect(() => {
    if (!store) return;

    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });

    return unsubscribe;
  }, [store]);

  // Get current pane state from store or create default state
  const paneState: PaneState = storeRef.current?.getState();

  // Create setPaneState function that works with the store
  const setPaneState = useCallback((state: PaneState) => {
    if (storeRef.current) {
      storeRef.current.getState().setPaneState(state);
    }
    // Note: If no store, this is a no-op since we don't support non-persisted panes
  }, []);

  // States for resizing
  const [active, setActive] = React.useState(false);
  const [activeResizer, setActiveResizer] = React.useState<1 | 2 | null>(null);
  const [position, setPosition] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [_containerHeight, setContainerHeight] = React.useState<number>(0);
  const previousContainerWidthRef = useRef<number>(0);
  const hasInitializedFromHydratedState = useRef<boolean>(false);
  const initialPropsCollapsed = useRef({
    first: firstPane.collapsed ?? false,
    third: thirdPane.collapsed ?? false,
  });

  const updateContainerDimensions = useCallback(() => {
    const element = containerRef?.current || editorPaneRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const newWidth = width ?? rect.width;
      if (newWidth !== previousContainerWidthRef.current) {
        setContainerWidth(newWidth);
        previousContainerWidthRef.current = newWidth;
      }
      setContainerHeight(rect.height);
    }
  }, [containerRef, width]);

  // Effect to handle initialization, visibility changes, collapse changes, and width changes
  useEffect(() => {
    if (!containerWidth) return;

    // Check if we have valid hydrated state on first render
    const storeState = storeRef.current?.getState();
    const hasValidHydratedState =
      storeState?._hasHydrated && paneState.sizes.some(size => size > 0);

    // If we have valid hydrated state and haven't initialized yet,
    // skip this effect entirely to preserve the hydrated state
    // This prevents the component from treating persisted collapsed states as changes
    if (hasValidHydratedState && !hasInitializedFromHydratedState.current) {
      hasInitializedFromHydratedState.current = true;
      previousContainerWidthRef.current = containerWidth;
      return;
    }

    const currentVisibility = {
      first: firstPane.visible,
      third: thirdPane.visible,
    };
    const currentCollapsed = {
      first: firstPane.collapsed ?? false,
      third: thirdPane.collapsed ?? false,
    };
    const prevVisibility = paneState.visibility;
    const prevCollapsed = paneState.collapsed;
    const totalWidth = containerWidth;

    // If we initialized from hydrated state and props haven't changed from initial values,
    // use the hydrated state to prevent false change detection
    const propsUnchangedFromInitial =
      currentCollapsed.first === initialPropsCollapsed.current.first &&
      currentCollapsed.third === initialPropsCollapsed.current.third;

    const effectiveCurrentCollapsed =
      hasInitializedFromHydratedState.current && propsUnchangedFromInitial
        ? prevCollapsed // Use the hydrated state as "current" to avoid false change detection
        : currentCollapsed;

    const firstPaneHidden = prevVisibility.first && !currentVisibility.first;
    const thirdPaneHidden = prevVisibility.third && !currentVisibility.third;
    const firstPaneShown = !prevVisibility.first && currentVisibility.first;
    const thirdPaneShown = !prevVisibility.third && currentVisibility.third;
    const firstPaneCollapsed =
      !prevCollapsed.first &&
      effectiveCurrentCollapsed.first &&
      currentVisibility.first;
    const thirdPaneCollapsed =
      !prevCollapsed.third &&
      effectiveCurrentCollapsed.third &&
      currentVisibility.third;
    const firstPaneUncollapsed =
      prevCollapsed.first &&
      !effectiveCurrentCollapsed.first &&
      currentVisibility.first;
    const thirdPaneUncollapsed =
      prevCollapsed.third &&
      !effectiveCurrentCollapsed.third &&
      currentVisibility.third;
    const visibilityChanged =
      firstPaneHidden || thirdPaneHidden || firstPaneShown || thirdPaneShown;
    const collapseChanged =
      firstPaneCollapsed ||
      thirdPaneCollapsed ||
      firstPaneUncollapsed ||
      thirdPaneUncollapsed;
    const widthChanged = totalWidth !== previousContainerWidthRef.current;

    let nextSizes = [...paneState.sizes];
    const nextPreviousSizes = { ...paneState.previousSizes };
    const nextPreCollapseSizes = { ...paneState.preCollapseSizes };

    // Calculate available width for panes (excluding resizer widths)
    const resizerCount = getVisibleResizerCount(
      currentVisibility.first,
      currentVisibility.third
    );
    const resizerTotalWidth = resizerCount * RESIZER_WIDTH;
    const availableWidthForPanes = totalWidth - resizerTotalWidth;

    if (visibilityChanged) {
      if (firstPaneHidden) {
        nextPreviousSizes.first = nextSizes[0];
        nextSizes = [
          0,
          Math.max(MIN_PANE_SIZE, nextSizes[1] + nextSizes[0]),
          nextSizes[2],
        ];
      } else if (thirdPaneHidden) {
        nextPreviousSizes.third = nextSizes[2];
        nextSizes = [
          nextSizes[0],
          Math.max(MIN_PANE_SIZE, nextSizes[1] + nextSizes[2]),
          0,
        ];
      } else if (firstPaneShown) {
        const sizeToRestore = nextPreviousSizes.first;
        const firstInitialRatio = firstPane.preferredRatio ?? 0.33;
        let restoredFirstSize =
          sizeToRestore ??
          Math.max(MIN_PANE_SIZE, availableWidthForPanes * firstInitialRatio);
        restoredFirstSize = Math.max(MIN_PANE_SIZE, restoredFirstSize);

        let newMiddleSize = nextSizes[1] - restoredFirstSize;
        if (newMiddleSize < MIN_PANE_SIZE) {
          restoredFirstSize = Math.max(0, nextSizes[1] - MIN_PANE_SIZE);
          newMiddleSize = MIN_PANE_SIZE;
        }
        restoredFirstSize = Math.max(MIN_PANE_SIZE, restoredFirstSize);

        nextSizes = [restoredFirstSize, newMiddleSize, nextSizes[2]];
        nextPreviousSizes.first = null;
      } else if (thirdPaneShown) {
        const sizeToRestore = nextPreviousSizes.third;
        const thirdInitialRatio = thirdPane.preferredRatio ?? 0.33;
        let restoredThirdSize =
          sizeToRestore ??
          Math.max(MIN_PANE_SIZE, availableWidthForPanes * thirdInitialRatio);
        restoredThirdSize = Math.max(MIN_PANE_SIZE, restoredThirdSize);

        let newMiddleSize = nextSizes[1] - restoredThirdSize;
        if (newMiddleSize < MIN_PANE_SIZE) {
          restoredThirdSize = Math.max(0, nextSizes[1] - MIN_PANE_SIZE);
          newMiddleSize = MIN_PANE_SIZE;
        }
        restoredThirdSize = Math.max(MIN_PANE_SIZE, restoredThirdSize);

        nextSizes = [nextSizes[0], newMiddleSize, restoredThirdSize];
        nextPreviousSizes.third = null;
      }
    } else if (collapseChanged) {
      // Handle collapse/uncollapse transitions
      if (firstPaneCollapsed) {
        // Save current width before collapsing
        nextPreCollapseSizes.first = nextSizes[0];
        const sizeToRedistribute = nextSizes[0] - COLLAPSED_PANE_WIDTH;
        nextSizes = [
          COLLAPSED_PANE_WIDTH,
          nextSizes[1] + sizeToRedistribute,
          nextSizes[2],
        ];
      } else if (firstPaneUncollapsed) {
        // Restore width from before collapse
        const sizeToRestore = nextPreCollapseSizes.first;
        if (sizeToRestore && sizeToRestore > COLLAPSED_PANE_WIDTH) {
          const sizeToTake = sizeToRestore - COLLAPSED_PANE_WIDTH;
          const newMiddleSize = nextSizes[1] - sizeToTake;
          if (newMiddleSize < MIN_PANE_SIZE) {
            // Can't restore full size, restore what we can
            const availableSize = nextSizes[1] - MIN_PANE_SIZE;
            nextSizes = [
              COLLAPSED_PANE_WIDTH + availableSize,
              MIN_PANE_SIZE,
              nextSizes[2],
            ];
          } else {
            nextSizes = [sizeToRestore, newMiddleSize, nextSizes[2]];
          }
          nextPreCollapseSizes.first = null;
        }
      } else if (thirdPaneCollapsed) {
        // Save current width before collapsing
        nextPreCollapseSizes.third = nextSizes[2];
        const sizeToRedistribute = nextSizes[2] - COLLAPSED_PANE_WIDTH;
        nextSizes = [
          nextSizes[0],
          nextSizes[1] + sizeToRedistribute,
          COLLAPSED_PANE_WIDTH,
        ];
      } else if (thirdPaneUncollapsed) {
        // Restore width from before collapse
        const sizeToRestore = nextPreCollapseSizes.third;
        if (sizeToRestore && sizeToRestore > COLLAPSED_PANE_WIDTH) {
          const sizeToTake = sizeToRestore - COLLAPSED_PANE_WIDTH;
          const newMiddleSize = nextSizes[1] - sizeToTake;
          if (newMiddleSize < MIN_PANE_SIZE) {
            // Can't restore full size, restore what we can
            const availableSize = nextSizes[1] - MIN_PANE_SIZE;
            nextSizes = [
              nextSizes[0],
              MIN_PANE_SIZE,
              COLLAPSED_PANE_WIDTH + availableSize,
            ];
          } else {
            nextSizes = [nextSizes[0], newMiddleSize, sizeToRestore];
          }
          nextPreCollapseSizes.third = null;
        }
      }
    } else if (widthChanged || nextSizes.reduce((a, b) => a + b, 0) === 0) {
      const currentTotalSize = nextSizes.reduce((a, b) => a + b, 0);

      if (
        currentTotalSize === 0 ||
        (!currentVisibility.first && !currentVisibility.third)
      ) {
        // Calculate width reserved for collapsed panes and resizers
        const collapsedWidth =
          (currentVisibility.first && currentCollapsed.first
            ? COLLAPSED_PANE_WIDTH
            : 0) +
          (currentVisibility.third && currentCollapsed.third
            ? COLLAPSED_PANE_WIDTH
            : 0);

        const availableWidth = availableWidthForPanes - collapsedWidth;

        const visiblePanesCount = [
          currentVisibility.first && !currentCollapsed.first,
          true, // Middle pane is always adjustable
          currentVisibility.third && !currentCollapsed.third,
        ].filter(Boolean).length;

        if (visiblePanesCount === 1) {
          nextSizes = [
            currentVisibility.first && currentCollapsed.first
              ? COLLAPSED_PANE_WIDTH
              : 0,
            availableWidth,
            currentVisibility.third && currentCollapsed.third
              ? COLLAPSED_PANE_WIDTH
              : 0,
          ];
        } else {
          const sizePerPane = availableWidth / visiblePanesCount;
          nextSizes = [
            currentVisibility.first
              ? currentCollapsed.first
                ? COLLAPSED_PANE_WIDTH
                : Math.max(MIN_PANE_SIZE, sizePerPane)
              : 0,
            Math.max(MIN_PANE_SIZE, sizePerPane),
            currentVisibility.third
              ? currentCollapsed.third
                ? COLLAPSED_PANE_WIDTH
                : Math.max(MIN_PANE_SIZE, sizePerPane)
              : 0,
          ];
        }
      } else if (currentTotalSize > 0) {
        // Calculate width reserved for collapsed panes and resizers
        const collapsedWidth =
          (currentVisibility.first && currentCollapsed.first
            ? COLLAPSED_PANE_WIDTH
            : 0) +
          (currentVisibility.third && currentCollapsed.third
            ? COLLAPSED_PANE_WIDTH
            : 0);

        // Calculate current size of non-collapsed panes
        const currentNonCollapsedSize =
          (currentVisibility.first && !currentCollapsed.first
            ? nextSizes[0]
            : 0) +
          nextSizes[1] +
          (currentVisibility.third && !currentCollapsed.third
            ? nextSizes[2]
            : 0);

        const availableWidth = availableWidthForPanes - collapsedWidth;

        if (currentNonCollapsedSize > 0) {
          const scale = availableWidth / currentNonCollapsedSize;

          nextSizes = nextSizes.map((size, index) => {
            const isVisible =
              (index === 0 && currentVisibility.first) ||
              index === 1 ||
              (index === 2 && currentVisibility.third);

            // Don't scale collapsed panes
            if (index === 0 && currentCollapsed.first) {
              return COLLAPSED_PANE_WIDTH;
            }
            if (index === 2 && currentCollapsed.third) {
              return COLLAPSED_PANE_WIDTH;
            }

            return isVisible ? Math.max(MIN_PANE_SIZE, size * scale) : 0;
          });
        }
      }
    }

    // Final adjustments to ensure sizes add up to availableWidthForPanes
    // Collapsed panes have the highest priority and must remain at COLLAPSED_PANE_WIDTH
    let currentTotal = nextSizes.reduce((a, b) => a + b, 0);
    let diff = availableWidthForPanes - currentTotal;

    // Identify all visible panes (excluding hidden ones)
    const allVisibleIndices = [
      currentVisibility.first ? 0 : -1,
      1,
      currentVisibility.third ? 2 : -1,
    ].filter(index => index !== -1);

    // Identify non-collapsed panes that can be adjusted
    const adjustableIndices = allVisibleIndices.filter(index => {
      if (index === 0) return !currentCollapsed.first;
      if (index === 2) return !currentCollapsed.third;
      return true; // Middle pane is always adjustable
    });

    if (diff !== 0 && adjustableIndices.length > 0) {
      const middleIndex = 1;
      if (adjustableIndices.includes(middleIndex)) {
        const middleAdjusted = nextSizes[middleIndex] + diff;
        if (middleAdjusted >= MIN_PANE_SIZE) {
          nextSizes[middleIndex] = middleAdjusted;
          diff = 0;
        } else {
          const partialDiff = MIN_PANE_SIZE - nextSizes[middleIndex];
          nextSizes[middleIndex] = MIN_PANE_SIZE;
          diff -= partialDiff;
        }
      }

      if (diff !== 0) {
        const otherAdjustableIndices = adjustableIndices.filter(
          i => i !== middleIndex
        );
        if (otherAdjustableIndices.length > 0) {
          const diffPerPane = diff / otherAdjustableIndices.length;
          otherAdjustableIndices.forEach(i => {
            nextSizes[i] = Math.max(MIN_PANE_SIZE, nextSizes[i] + diffPerPane);
          });
        }
      }

      currentTotal = nextSizes.reduce((a, b) => a + b, 0);
      diff = totalWidth - currentTotal;
      if (diff !== 0 && adjustableIndices.length > 0) {
        const finalAdjustIndex = adjustableIndices.includes(middleIndex)
          ? middleIndex
          : adjustableIndices[adjustableIndices.length - 1];
        nextSizes[finalAdjustIndex] = Math.max(
          MIN_PANE_SIZE,
          nextSizes[finalAdjustIndex] + diff
        );
      }
    } else if (adjustableIndices.length === 1) {
      nextSizes[adjustableIndices[0]] =
        availableWidthForPanes -
        (currentCollapsed.first && currentVisibility.first
          ? COLLAPSED_PANE_WIDTH
          : 0) -
        (currentCollapsed.third && currentVisibility.third
          ? COLLAPSED_PANE_WIDTH
          : 0);
    }

    // Enforce collapsed pane widths - highest priority
    if (currentVisibility.first && currentCollapsed.first) {
      const correction = COLLAPSED_PANE_WIDTH - nextSizes[0];
      if (correction !== 0) {
      }
      nextSizes[0] = COLLAPSED_PANE_WIDTH;
      // Adjust the middle pane to compensate
      if (correction !== 0) {
        nextSizes[1] = Math.max(MIN_PANE_SIZE, nextSizes[1] - correction);
      }
    }
    if (currentVisibility.third && currentCollapsed.third) {
      const correction = COLLAPSED_PANE_WIDTH - nextSizes[2];
      if (correction !== 0) {
      }
      nextSizes[2] = COLLAPSED_PANE_WIDTH;
      // Adjust the middle pane to compensate
      if (correction !== 0) {
        nextSizes[1] = Math.max(MIN_PANE_SIZE, nextSizes[1] - correction);
      }
    }

    if (!currentVisibility.first) nextSizes[0] = 0;
    if (!currentVisibility.third) nextSizes[2] = 0;

    const sizesChanged = nextSizes.some(
      (size, i) => Math.abs(size - paneState.sizes[i]) > 0.1
    );

    if (sizesChanged || visibilityChanged || collapseChanged) {
      const nextState: PaneState = {
        sizes: nextSizes,
        visibility: currentVisibility,
        collapsed: currentCollapsed,
        previousSizes: nextPreviousSizes,
        preCollapseSizes: nextPreCollapseSizes,
      };
      setPaneState(nextState);

      if (onChange) onChange(nextSizes);
    }

    previousContainerWidthRef.current = totalWidth;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    containerWidth,
    firstPane.visible,
    thirdPane.visible,
    firstPane.collapsed,
    thirdPane.collapsed,
    firstPane.preferredRatio,
    thirdPane.preferredRatio,
    paneState,
    onChange,
    setPaneState,
    // storageKey is intentionally not in deps - it's used only for logging
  ]);

  // Effect for attaching resize observer
  useEffect(() => {
    updateContainerDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateContainerDimensions();
    });

    const element = containerRef?.current || editorPaneRef.current;
    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateContainerDimensions, containerRef]);

  const onResizeStart = (resizerIndex: 1 | 2, clientX: number) => {
    setActiveResizer(resizerIndex);
    setPosition(clientX);
    setActive(true);
    if (onDragStarted) onDragStarted();
  };

  const onResizeEnd = useCallback(() => {
    if (!active) return;
    setActive(false);
    setActiveResizer(null);
    if (onDragFinished) onDragFinished(paneState.sizes);
  }, [active, onDragFinished, paneState.sizes]);

  const onResize = useCallback(
    (clientX: number) => {
      if (!active || !activeResizer) return;

      // Check if we're resizing a collapsed pane and trigger uncollapse
      if (activeResizer === 1 && paneState.collapsed.first) {
        // First pane is collapsed, uncollapse it
        if (onFirstPaneUncollapse) onFirstPaneUncollapse();
        // Clear preCollapseSize
        const nextState: PaneState = {
          ...paneState,
          collapsed: { ...paneState.collapsed, first: false },
          preCollapseSizes: { ...paneState.preCollapseSizes, first: null },
        };
        setPaneState(nextState);
        return; // Exit and let next render handle the resize
      }

      if (activeResizer === 2 && paneState.collapsed.third) {
        // Third pane is collapsed, uncollapse it
        if (onThirdPaneUncollapse) onThirdPaneUncollapse();
        // Clear preCollapseSize
        const nextState: PaneState = {
          ...paneState,
          collapsed: { ...paneState.collapsed, third: false },
          preCollapseSizes: { ...paneState.preCollapseSizes, third: null },
        };
        setPaneState(nextState);
        return; // Exit and let next render handle the resize
      }

      const containerRect = editorPaneRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const containerLeft = containerRect.left;
      const containerRight = containerRect.right;

      const boundedClientX = Math.min(
        Math.max(clientX, containerLeft),
        containerRight
      );

      const rawDelta = boundedClientX - position;
      const deltaX = isRtl ? -rawDelta : rawDelta;

      if (deltaX === 0) return;

      const newSizes = [...paneState.sizes];

      if (activeResizer === 1) {
        const newSize1 = newSizes[0] + deltaX;
        const newSize2 = newSizes[1] - deltaX;

        if (newSize1 >= MIN_PANE_SIZE && newSize2 >= MIN_PANE_SIZE) {
          newSizes[0] = newSize1;
          newSizes[1] = newSize2;
          setPosition(boundedClientX);
        }
      } else {
        const newSize2 = newSizes[1] + deltaX;
        const newSize3 = newSizes[2] - deltaX;

        if (newSize2 >= MIN_PANE_SIZE && newSize3 >= MIN_PANE_SIZE) {
          newSizes[1] = newSize2;
          newSizes[2] = newSize3;
          setPosition(boundedClientX);
        }
      }

      if (JSON.stringify(newSizes) !== JSON.stringify(paneState.sizes)) {
        const nextState: PaneState = {
          ...paneState,
          sizes: newSizes,
        };
        setPaneState(nextState);
        if (onChange) onChange(newSizes);
      }
    },
    [
      active,
      activeResizer,
      position,
      isRtl,
      paneState,
      onChange,
      setPaneState,
      onFirstPaneUncollapse,
      onThirdPaneUncollapse,
    ]
  );

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!active) return;
      unFocus(document, window);
      onResize(e.clientX);
    },
    [active, onResize]
  );

  // Memoized base pane styles
  const basePaneStyle = useMemo<CSSProperties>(
    () => ({
      ...paneStyle,
      overflow: "auto",
      ...(orientation === "vertical"
        ? {
            overflowX: "auto",
            overflowY: "auto",
            height: "100%",
          }
        : {
            overflowX: "auto",
            overflowY: "auto",
            width: "100%",
          }),
    }),
    [paneStyle, orientation]
  );

  // Memoized wrapper styles
  const wrapperStyle = useMemo<CSSProperties>(
    () => ({
      display: "flex",
      flex: 1,
      height: "100%",
      position: "absolute",
      outline: "none",
      overflow: "hidden",
      flexDirection: orientation === "vertical" ? "row" : "column",
      left: 0,
      right: 0,
      direction: isRtl ? "rtl" : "ltr",
      ...styleProps,
    }),
    [orientation, styleProps, isRtl]
  );

  // Memoized pane styles
  const getPaneStyle = useCallback(
    (index: number, paneProps?: PaneProps): CSSProperties => ({
      flexBasis:
        paneState.sizes[index] > 0 ? `${paneState.sizes[index]}px` : "0px",
      flexGrow: 0,
      flexShrink: 0,
      display: paneState.sizes[index] > 0 ? "block" : "none",
      transition: active
        ? "none"
        : "flex-basis 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      ...basePaneStyle,
      ...(paneProps?.style ?? {}),
    }),
    [paneState.sizes, basePaneStyle, active]
  );

  // Effect for global mouse listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", onResizeEnd, { capture: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", onResizeEnd, {
        capture: true,
      });
    };
  }, [handleMouseMove, onResizeEnd]);

  return (
    <Box
      ref={editorPaneRef}
      className={className}
      style={wrapperStyle}
      id="editor-pane"
    >
      {/* First pane */}
      {firstPane.visible && paneState.sizes[0] > 0 && (
        <Box
          ref={pane1Ref}
          className={`${paneClassName} first-pane`}
          style={getPaneStyle(0, firstPane)}
        >
          {notNullChildren[0]}
        </Box>
      )}

      {/* First pane resizer */}
      {firstPane.visible && paneState.sizes[0] > 0 && (
        <EditorPaneResizer
          allowResize={allowResize}
          orientation={orientation}
          className={resizerProps?.className ?? "resizer"}
          onClick={resizerProps?.onClick}
          onDoubleClick={resizerProps?.onDoubleClick}
          onMouseDown={e => {
            onResizeStart(1, e.clientX);
          }}
          onTouchStart={(e: TouchEvent<HTMLSpanElement>) => {
            if (e.touches[0]) onResizeStart(1, e.touches[0].clientX);
          }}
          onTouchEnd={onResizeEnd}
          style={resizerProps?.style}
        />
      )}

      {/* Middle pane */}
      {paneState.sizes[1] > 0 && (
        <Box
          ref={pane2Ref}
          className={`${paneClassName} middle-pane`}
          style={getPaneStyle(1, middlePane)}
        >
          {notNullChildren[1]}
        </Box>
      )}

      {/* Third pane resizer */}
      {thirdPane.visible && paneState.sizes[2] > 0 && (
        <EditorPaneResizer
          allowResize={allowResize}
          orientation={orientation}
          className={resizerProps?.className ?? "resizer"}
          onClick={resizerProps?.onClick}
          onDoubleClick={resizerProps?.onDoubleClick}
          onMouseDown={e => {
            onResizeStart(2, e.clientX);
          }}
          onTouchStart={(e: TouchEvent<HTMLSpanElement>) => {
            if (e.touches[0]) onResizeStart(2, e.touches[0].clientX);
          }}
          onTouchEnd={onResizeEnd}
          style={resizerProps?.style}
        />
      )}

      {/* Third pane */}
      {thirdPane.visible && paneState.sizes[2] > 0 && (
        <Box
          ref={pane3Ref}
          className={`${paneClassName} third-pane`}
          style={getPaneStyle(2, thirdPane)}
        >
          {notNullChildren[2]}
        </Box>
      )}

      {/* Overlay to prevent pointer events during resize */}
      {active && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            cursor: orientation === "vertical" ? "col-resize" : "row-resize",
            userSelect: "none",
          }}
        />
      )}
    </Box>
  );
};

export default EditorPane;
