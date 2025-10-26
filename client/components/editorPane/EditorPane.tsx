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
  useState,
} from "react";
import EditorPaneResizer from "./EditorPaneResizer";
import { Box } from "@mui/material";
import { loadFromLocalStorage } from "@/client/utils/localStorage";
import { useAppTheme } from "@/client/contexts";

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
  storageKey?: string;
};

// Type for the stored pane state
type PaneState = {
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

// Constants for local storage keys and pane state
const STORAGE_KEY_PREFIX = "editorPane";
const STORAGE_DEBOUNCE_MS = 300;
const MIN_PANE_SIZE = 50; // Minimum width to keep panes visible
// todo: receive from props
const COLLAPSED_PANE_WIDTH = 40; // Width when pane is collapsed (header + button)

// Helper functions for local storage operations
const getStorageKey = (key?: string) =>
  key ? `${STORAGE_KEY_PREFIX}_${key}` : null;

// Function to save pane state to local storage
const savePaneState = (key: string | undefined, state: PaneState) => {
  if (!key) return;
  try {
    localStorage.setItem(getStorageKey(key)!, JSON.stringify(state));
  } catch {}
};

// Helper to create a debounced function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Create a stable debounced version of savePaneState
const debouncedSavePaneState = debounce(savePaneState, STORAGE_DEBOUNCE_MS);

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

  // States for resizing
  const [active, setActive] = useState(false);
  const [activeResizer, setActiveResizer] = useState<1 | 2 | null>(null);
  const [position, setPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [_containerHeight, setContainerHeight] = useState<number>(0);
  const previousContainerWidthRef = useRef<number>(0);

  // Initialize state from local storage if available
  const initialState = useMemo<PaneState>(() => {
    if (!storageKey) {
      return {
        sizes: [0, 0, 0],
        visibility: {
          first: firstPane.visible,
          third: thirdPane.visible,
        },
        collapsed: {
          first: firstPane.collapsed ?? false,
          third: thirdPane.collapsed ?? false,
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
    }
    const state = loadFromLocalStorage<PaneState>(storageKey);
    if (state) {
      // Only use stored sizes if visibility matches current state
      return {
        sizes: state.sizes.map((size, index) => {
          if (index === 0 && firstPane.visible !== state.visibility.first)
            return 0;
          if (index === 2 && thirdPane.visible !== state.visibility.third)
            return 0;
          return size;
        }),
        visibility: {
          first: state.visibility.first,
          third: state.visibility.third,
        },
        collapsed: state.collapsed ?? {
          first: firstPane.collapsed ?? false,
          third: thirdPane.collapsed ?? false,
        },
        previousSizes: state.previousSizes,
        preCollapseSizes: state.preCollapseSizes ?? {
          first: null,
          third: null,
        },
      };
    }
    return {
      sizes: [0, 0, 0],
      visibility: {
        first: firstPane.visible,
        third: thirdPane.visible,
      },
      collapsed: {
        first: firstPane.collapsed ?? false,
        third: thirdPane.collapsed ?? false,
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
  }, [storageKey, firstPane.visible, thirdPane.visible, firstPane.collapsed, thirdPane.collapsed]);

  // Central pane state
  const [paneState, setPaneState] = useState<PaneState>(initialState);

  // Helper function to save current state
  const saveCurrentState = useCallback(() => {
    if (!storageKey || !containerWidth) return;

    // Only save if sizes add up to containerWidth (valid state)
    const totalSize = paneState.sizes.reduce((sum, size) => sum + size, 0);
    if (Math.abs(totalSize - containerWidth) > 1) return; // Allow 1px difference for rounding

    debouncedSavePaneState(storageKey, paneState);
  }, [storageKey, containerWidth, paneState]);

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

    const firstPaneHidden = prevVisibility.first && !currentVisibility.first;
    const thirdPaneHidden = prevVisibility.third && !currentVisibility.third;
    const firstPaneShown = !prevVisibility.first && currentVisibility.first;
    const thirdPaneShown = !prevVisibility.third && currentVisibility.third;
    const firstPaneCollapsed = !prevCollapsed.first && currentCollapsed.first && currentVisibility.first;
    const thirdPaneCollapsed = !prevCollapsed.third && currentCollapsed.third && currentVisibility.third;
    const firstPaneUncollapsed = prevCollapsed.first && !currentCollapsed.first && currentVisibility.first;
    const thirdPaneUncollapsed = prevCollapsed.third && !currentCollapsed.third && currentVisibility.third;
    const visibilityChanged =
      firstPaneHidden || thirdPaneHidden || firstPaneShown || thirdPaneShown;
    const collapseChanged =
      firstPaneCollapsed || thirdPaneCollapsed || firstPaneUncollapsed || thirdPaneUncollapsed;
    const widthChanged = totalWidth !== previousContainerWidthRef.current;

    let nextSizes = [...paneState.sizes];
    const nextPreviousSizes = { ...paneState.previousSizes };
    const nextPreCollapseSizes = { ...paneState.preCollapseSizes };

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
          Math.max(MIN_PANE_SIZE, totalWidth * firstInitialRatio);
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
          Math.max(MIN_PANE_SIZE, totalWidth * thirdInitialRatio);
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
        const visiblePanesCount = [
          currentVisibility.first,
          true,
          currentVisibility.third,
        ].filter(Boolean).length;
        if (visiblePanesCount === 1) {
          nextSizes = [0, totalWidth, 0];
        } else {
          const sizePerPane = totalWidth / visiblePanesCount;
          nextSizes = [
            currentVisibility.first ? Math.max(MIN_PANE_SIZE, sizePerPane) : 0,
            Math.max(MIN_PANE_SIZE, sizePerPane),
            currentVisibility.third ? Math.max(MIN_PANE_SIZE, sizePerPane) : 0,
          ];
        }
      } else if (currentTotalSize > 0) {
        const scale = totalWidth / currentTotalSize;
        nextSizes = nextSizes.map((size, index) => {
          const isVisible =
            (index === 0 && currentVisibility.first) ||
            index === 1 ||
            (index === 2 && currentVisibility.third);
          return isVisible ? Math.max(MIN_PANE_SIZE, size * scale) : 0;
        });
      }
    }

    // Final adjustments to ensure sizes add up to totalWidth
    let currentTotal = nextSizes.reduce((a, b) => a + b, 0);
    let diff = totalWidth - currentTotal;

    const visibleIndices = [
      currentVisibility.first ? 0 : -1,
      1,
      currentVisibility.third ? 2 : -1,
    ].filter(index => index !== -1);

    if (diff !== 0 && visibleIndices.length > 0) {
      const middleIndex = 1;
      if (visibleIndices.includes(middleIndex)) {
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
        const otherVisibleIndices = visibleIndices.filter(
          i => i !== middleIndex
        );
        if (otherVisibleIndices.length > 0) {
          const diffPerPane = diff / otherVisibleIndices.length;
          otherVisibleIndices.forEach(i => {
            nextSizes[i] = Math.max(MIN_PANE_SIZE, nextSizes[i] + diffPerPane);
          });
        }
      }

      currentTotal = nextSizes.reduce((a, b) => a + b, 0);
      diff = totalWidth - currentTotal;
      if (diff !== 0 && visibleIndices.length > 0) {
        const finalAdjustIndex = visibleIndices.includes(middleIndex)
          ? middleIndex
          : visibleIndices[visibleIndices.length - 1];
        nextSizes[finalAdjustIndex] = Math.max(
          MIN_PANE_SIZE,
          nextSizes[finalAdjustIndex] + diff
        );
      }
    } else if (visibleIndices.length === 1) {
      nextSizes[visibleIndices[0]] = totalWidth;
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
      saveCurrentState();
    }

    previousContainerWidthRef.current = totalWidth;
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
    saveCurrentState,
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
        saveCurrentState();
      }
    },
    [
      active,
      activeResizer,
      position,
      isRtl,
      paneState,
      onChange,
      saveCurrentState,
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
