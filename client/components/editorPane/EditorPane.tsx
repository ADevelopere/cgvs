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
import type { PaneState } from "@/client/components/editorPane/editorPaneStoreFactory";
import { useEditorPaneLayout } from "@/client/components/editorPane/useEditorPaneLayout";

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

  // Get or create store for this storageKey
  const store = useMemo(() => getEditorPaneStore(storageKey), [storageKey]);

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

  // Get current pane state from store
  const paneState: PaneState = storeRef.current?.getState();

  // Get calculator functions
  const calculator = useEditorPaneLayout(storageKey);

  // States for drag UI only
  const [active, setActive] = React.useState(false);
  const [activeResizer, setActiveResizer] = React.useState<1 | 2 | null>(null);
  const [position, setPosition] = React.useState(0);

  // Effect for handling prop changes (visibility and collapse)
  useEffect(() => {
    const currentVisibility = {
      first: firstPane.visible,
      third: thirdPane.visible,
    };
    const currentCollapsed = {
      first: firstPane.collapsed ?? false,
      third: thirdPane.collapsed ?? false,
    };

    // Handle visibility changes
    if (paneState.visibility.first !== currentVisibility.first) {
      calculator.handleVisibilityChange("first", currentVisibility.first);
    }
    if (paneState.visibility.third !== currentVisibility.third) {
      calculator.handleVisibilityChange("third", currentVisibility.third);
    }

    // Handle collapse changes
    if (paneState.collapsed.first !== currentCollapsed.first) {
      calculator.handleCollapseToggle("first");
    }
    if (paneState.collapsed.third !== currentCollapsed.third) {
      calculator.handleCollapseToggle("third");
    }
  }, [
    firstPane.visible,
    thirdPane.visible,
    firstPane.collapsed,
    thirdPane.collapsed,
    paneState.visibility.first,
    paneState.visibility.third,
    paneState.collapsed.first,
    paneState.collapsed.third,
    calculator,
  ]);

  // Effect for ResizeObserver
  useEffect(() => {
    const element = containerRef?.current || editorPaneRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const newWidth = width ?? entry.contentRect.width;
        calculator.handleContainerResize(newWidth, {
          firstVisible: firstPane.visible,
          thirdVisible: thirdPane.visible,
          firstCollapsed: firstPane.collapsed ?? false,
          thirdCollapsed: thirdPane.collapsed ?? false,
          firstPreferredRatio: firstPane.preferredRatio,
          thirdPreferredRatio: thirdPane.preferredRatio,
        });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    containerRef,
    width,
    calculator,
    firstPane.visible,
    thirdPane.visible,
    firstPane.collapsed,
    thirdPane.collapsed,
    firstPane.preferredRatio,
    thirdPane.preferredRatio,
  ]);

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
        calculator.handleCollapseToggle("first");
        return; // Exit and let next render handle the resize
      }

      if (activeResizer === 2 && paneState.collapsed.third) {
        // Third pane is collapsed, uncollapse it
        if (onThirdPaneUncollapse) onThirdPaneUncollapse();
        calculator.handleCollapseToggle("third");
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

      // Use calculator to handle manual resize
      calculator.handleManualResize(activeResizer, deltaX);
      setPosition(boundedClientX);

      if (onChange) onChange(paneState.sizes);
    },
    [
      active,
      activeResizer,
      position,
      isRtl,
      paneState,
      onChange,
      calculator,
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
      width: "100%",
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
      // width: orientation === "vertical" ? `${paneState.sizes[index]}px` : "100%",
      // height:
      //   orientation === "horizontal" ? `${paneState.sizes[index]}px` : "100%",
      width: "100%",
      height: "100%",
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
