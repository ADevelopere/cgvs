import React, {
  FC,
  useEffect,
  useState,
  useRef,
  ReactNode,
  CSSProperties,
  MouseEvent,
  TouchEvent,
  useCallback,
  useMemo,
} from "react";
import { Resizer } from "./Resizer";
import {
  getStorageKey,
  debouncedSaveToLocalStorage,
  loadFromLocalStorage,
} from "@/client/utils/localStorage";

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
};

const defaultPaneProps: PaneProps = {
  preferredRatio: 0.5,
  visible: true,
};

type ResizerProps = {
  className?: string;
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
};

// Constants
const SPLIT_PANE_STORAGE_PREFIX = "splitPane";

type StoredPaneState = {
  ratios: {
    first: number;
    second: number;
  };
  visibility: {
    first: boolean;
    second: boolean;
  };
};

// SplitPaneProps defines a type for all props
type SplitPaneProps = {
  allowResize?: boolean;
  // dont provide null children, provide two children
  children: ReactNode[];
  className?: string;
  primary?: "first" | "second";
  orientation?: "vertical" | "horizontal";
  onDragStarted?: () => void;
  onDragFinished?: (size: number) => void;
  onChange?: (size: number) => void;
  style?: CSSProperties;
  paneClassName?: string;
  paneStyle?: CSSProperties;
  firstPane?: PaneProps;
  secondPane?: PaneProps;
  resizerProps?: ResizerProps;
  step?: number;
  direction?: "rtl" | "ltr";
  containerRef?: React.RefObject<HTMLElement>;
  width?: number;
  storageKey?: string;
};

export const SplitPane: FC<SplitPaneProps> = ({
  allowResize = true,
  children,
  className,
  primary = "first",
  orientation = "vertical",
  onDragStarted,
  onDragFinished,
  onChange,
  style: styleProps,
  paneClassName = "",
  paneStyle,
  firstPane = defaultPaneProps,
  secondPane = defaultPaneProps,
  resizerProps,
  step,
  direction = "rtl",
  containerRef,
  width,
  storageKey,
}) => {
  const notNullChildren = removeNullChildren(children) as ReactNode[];
  const splitPaneRef = useRef<HTMLDivElement | null>(null);
  const pane1Ref = useRef<HTMLDivElement | null>(null);
  const pane2Ref = useRef<HTMLDivElement | null>(null);

  // States
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState(0);
  const [draggedSize, setDraggedSize] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  // Store sizes for each pane
  const [pane1Size, setPane1Size] = useState<number | undefined>(undefined);
  const [pane2Size, setPane2Size] = useState<number | undefined>(undefined);

  // Initialize ratios from storage or defaults
  const initialRatios = useMemo(() => {
    const defaultRatios = {
      first: firstPane.preferredRatio ?? 0.5,
      second: secondPane.preferredRatio ?? 0.5,
    };

    if (!storageKey) {
      return defaultRatios;
    }

    const stored = loadFromLocalStorage<StoredPaneState>(
      getStorageKey(SPLIT_PANE_STORAGE_PREFIX, storageKey)
    );

    return stored?.ratios ?? defaultRatios;
  }, [storageKey, firstPane.preferredRatio, secondPane.preferredRatio]);

  // Store the last active ratios before visibility changes
  const [lastActiveRatios, setLastActiveRatios] = useState(initialRatios);

  // Create internal ratio states for both panes
  const [paneRatios, setPaneRatios] = useState(initialRatios);

  // Save pane state to local storage
  const savePaneState = useCallback(
    (newRatios: typeof lastActiveRatios) => {
      if (!storageKey) return;

      const state: StoredPaneState = {
        ratios: newRatios,
        visibility: {
          first: firstPane.visible,
          second: secondPane.visible,
        },
      };

      debouncedSaveToLocalStorage(
        getStorageKey(SPLIT_PANE_STORAGE_PREFIX, storageKey),
        state
      );
    },
    [storageKey, firstPane.visible, secondPane.visible]
  );

  // Update ratios when visibility changes
  const updateRatios = useCallback(
    (
      firstVisible: boolean,
      secondVisible: boolean,
      currentRatios = lastActiveRatios
    ) => {
      if (!firstVisible && secondVisible) {
        setPaneRatios({ first: 0, second: 1 });
      } else if (firstVisible && !secondVisible) {
        setPaneRatios({ first: 1, second: 0 });
      } else if (firstVisible && secondVisible) {
        // Restore last active ratios when both panes become visible
        setPaneRatios(currentRatios);
      }
    },
    [lastActiveRatios]
  );

  // Handler for visibility changes
  const handleVisibilityChange = useCallback(
    (firstVisible: boolean, secondVisible: boolean) => {
      updateRatios(firstVisible, secondVisible);

      if (firstVisible && secondVisible) {
        // Save current state when both panes are visible
        savePaneState(lastActiveRatios);
      }
    },
    [updateRatios, savePaneState, lastActiveRatios]
  );

  // Initialize visibility based on props
  useMemo(() => {
    handleVisibilityChange(firstPane.visible, secondPane.visible);
  }, [firstPane.visible, secondPane.visible, handleVisibilityChange]);

  const updateContainerDimensions = useCallback(() => {
    const element = containerRef?.current || splitPaneRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      setContainerWidth(width ?? rect.width);
      setContainerHeight(rect.height);
    }
  }, [containerRef, width]);

  const calculatePaneSizes = useCallback(() => {
    if (!containerWidth || !containerHeight) return;

    const totalSize =
      orientation === "vertical" ? containerWidth : containerHeight;

    // Use current local ratios with safe defaults
    const firstRatio = paneRatios?.first ?? firstPane.preferredRatio ?? 0.5;
    const secondRatio = paneRatios?.second ?? secondPane.preferredRatio ?? 0.5;

    // Normalize ratios
    const totalRatio = firstRatio + secondRatio;
    const normalizedFirstRatio =
      totalRatio === 0 ? 0.5 : firstRatio / totalRatio;

    const newPane1Size = totalSize * normalizedFirstRatio;
    const newPane2Size = totalSize - newPane1Size;

    // Apply minRatio and maxRatio constraints
    const firstMinSize = totalSize * (firstPane.minRatio ?? 0.1);
    const firstMaxSize = totalSize * (firstPane.maxRatio ?? 0.9);
    const secondMinSize = totalSize * (secondPane.minRatio ?? 0.1);
    const secondMaxSize = totalSize * (secondPane.maxRatio ?? 0.9);

    setPane1Size(Math.max(firstMinSize, Math.min(firstMaxSize, newPane1Size)));
    setPane2Size(
      Math.max(secondMinSize, Math.min(secondMaxSize, newPane2Size))
    );
  }, [
    containerWidth,
    containerHeight,
    orientation,
    firstPane,
    secondPane,
    paneRatios,
  ]);

  useEffect(() => {
    updateContainerDimensions();
    const resizeObserver = new ResizeObserver(() => {
      updateContainerDimensions();
    });

    const element = containerRef?.current || splitPaneRef.current;
    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateContainerDimensions, containerRef]);

  useEffect(() => {
    calculatePaneSizes();
  }, [calculatePaneSizes, containerWidth, containerHeight]);

  const onTouchMove = useCallback(
    (event: TouchEvent<Document>) => {
      if (!allowResize || !active) return;
      unFocus(document, window);

      const currentPos =
        orientation === "vertical"
          ? event.touches[0].clientX
          : event.touches[0].clientY;

      const sizeNode =
        primary === "first" ? pane1Ref.current : pane2Ref.current;
      const otherNode =
        primary === "first" ? pane2Ref.current : pane1Ref.current;
      if (!sizeNode || !otherNode) return;

      const rect = sizeNode.getBoundingClientRect();
      const sizeValue = orientation === "vertical" ? rect.width : rect.height;

      let deltaPos = currentPos - position;
      if (orientation === "vertical") {
        deltaPos = direction === "rtl" ? -deltaPos : deltaPos;
      }
      if (step) {
        if (Math.abs(deltaPos) < step) return;
        deltaPos = Math.round(deltaPos / step) * step;
      }

      let newSize =
        primary === "first" ? sizeValue + deltaPos : sizeValue - deltaPos;
      const newPosition = currentPos;

      const containerSize =
        orientation === "vertical" ? containerWidth : containerHeight;

      // Apply min/max constraints for the primary pane
      const activePane = primary === "first" ? firstPane : secondPane;
      const minRatio = activePane?.minRatio ?? 0.1;
      const maxRatio = activePane?.maxRatio ?? 0.9;
      const minSize = containerSize * minRatio;
      const maxSize = containerSize * maxRatio;

      newSize = Math.max(minSize, Math.min(maxSize, newSize));

      // Also apply min/max constraints for the other pane
      const otherPane = primary === "first" ? secondPane : firstPane;
      const otherMinSize = containerSize * (otherPane?.minRatio ?? 0.1);
      const otherMaxSize = containerSize * (otherPane?.maxRatio ?? 0.9);

      // newSize for the other pane will be containerSize - newSize
      let otherPaneSize = containerSize - newSize;
      if (otherPaneSize < otherMinSize) {
        otherPaneSize = otherMinSize;
        newSize = containerSize - otherPaneSize;
      } else if (otherPaneSize > otherMaxSize) {
        otherPaneSize = otherMaxSize;
        newSize = containerSize - otherPaneSize;
      }

      setPosition(newPosition);
      setDraggedSize(newSize);
      if (onChange) onChange(newSize);

      if (primary === "first") {
        setPane1Size(newSize);
        setPane2Size(otherPaneSize);
      } else {
        setPane2Size(newSize);
        setPane1Size(otherPaneSize);
      }
    },
    [
      active,
      allowResize,
      onChange,
      position,
      primary,
      orientation,
      step,
      direction,
      containerWidth,
      containerHeight,
      firstPane,
      secondPane,
    ]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent<Document>) => {
      const eventWithTouches = {
        ...event,
        touches: [{ clientX: event.clientX, clientY: event.clientY }],
      };
      onTouchMove(eventWithTouches as unknown as TouchEvent<Document>);
    },
    [onTouchMove]
  );

  const onMouseUp = useCallback(() => {
    if (allowResize && active) {
      setActive(false);
      if (onDragFinished) onDragFinished(draggedSize);

      // Store current ratios as last active and save to localStorage
      const totalSize =
        orientation === "vertical" ? containerWidth : containerHeight;
      if (totalSize && pane1Size && pane2Size) {
        const newRatios = {
          first: pane1Size / totalSize,
          second: pane2Size / totalSize,
        };
        setLastActiveRatios(newRatios);
        savePaneState(newRatios);
      }
    }
  }, [
    allowResize,
    active,
    onDragFinished,
    draggedSize,
    orientation,
    containerWidth,
    containerHeight,
    pane1Size,
    pane2Size,
    savePaneState,
  ]);

  // Attach mouse and touch listeners
  useEffect(() => {
    function onMouseMoveDoc(e: globalThis.MouseEvent) {
      onMouseMove(e as unknown as MouseEvent<Document>);
    }
    function onTouchMoveDoc(e: globalThis.TouchEvent) {
      onTouchMove(e as unknown as TouchEvent<Document>);
    }

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMoveDoc);
    document.addEventListener("touchmove", onTouchMoveDoc);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMoveDoc);
      document.removeEventListener("touchmove", onTouchMoveDoc);
    };
  }, [
    active,
    position,
    draggedSize,
    allowResize,
    onMouseUp,
    onMouseMove,
    onTouchMove,
  ]);

  const onMouseDown = (event: MouseEvent<HTMLSpanElement>) => {
    const eventWithTouches = {
      ...event,
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    };
    onTouchStart(eventWithTouches as unknown as TouchEvent<HTMLSpanElement>);
  };

  const onTouchStart = (event: TouchEvent<HTMLSpanElement>) => {
    if (!allowResize) return;
    unFocus(document, window);
    if (onDragStarted) onDragStarted();
    const currentPos =
      orientation === "vertical"
        ? event.touches[0].clientX
        : event.touches[0].clientY;
    setActive(true);
    setPosition(currentPos);
  };

  const disabledClass = allowResize ? "" : "disabled";
  const classes = [
    "SplitPane",
    className ?? "",
    orientation,
    disabledClass,
  ].join(" ");

  // Build style
  const wrapperStyle: CSSProperties = {
    display: "flex",
    flex: 1,
    height: "100%",
    position: "absolute",
    outline: "none",
    overflow: "hidden",
    MozUserSelect: "text",
    WebkitUserSelect: "text",
    msUserSelect: "text",
    userSelect: "text",
  };

  if (orientation === "vertical") {
    Object.assign(wrapperStyle, {
      flexDirection: "row",
      left: 0,
      right: 0,
    });
  } else {
    Object.assign(wrapperStyle, {
      bottom: 0,
      flexDirection: "column",
      minHeight: "100%",
      top: 0,
      width: "100%",
    });
  }

  const pane1Styles: CSSProperties = {
    ...paneStyle,
    ...(firstPane?.style ?? {}),
    flex: firstPane?.visible && !secondPane?.visible ? 1 : "0 0 auto",
  };

  const pane2Styles: CSSProperties = {
    ...paneStyle,
    ...(secondPane?.style ?? {}),
    flex: secondPane?.visible && !firstPane?.visible ? 1 : "0 0 auto",
  };

  // Convert numeric sizes to style, but only if both panes are visible
  if (pane1Size !== undefined && firstPane?.visible && secondPane?.visible) {
    if (orientation === "vertical") pane1Styles.width = pane1Size;
    else pane1Styles.height = pane1Size;
  }

  if (pane2Size !== undefined && firstPane?.visible && secondPane?.visible) {
    if (orientation === "vertical") pane2Styles.width = pane2Size;
    else pane2Styles.height = pane2Size;
  }

  const pane1Classes = ["Pane1", paneClassName, firstPane?.className].join(" ");
  const pane2Classes = ["Pane2", paneClassName, secondPane?.className].join(
    " "
  );
  const resizerClassNames = resizerProps?.className
    ? `${resizerProps?.className} resizer`
    : "resizer";

  return (
    <div
      style={{
        ...styleProps,
        flex: 1,
        position: "relative",
      }}
      id="split-pane-container"
    >
      <div ref={splitPaneRef} className={classes} style={wrapperStyle}>
        {firstPane?.visible && (
          <div ref={pane1Ref} className={pane1Classes} style={pane1Styles}>
            {notNullChildren[0]}
          </div>
        )}

        {firstPane?.visible && secondPane?.visible && (
          <Resizer
            allowResize={allowResize}
            orientation={orientation}
            className={resizerClassNames}
            onClick={resizerProps?.onClick}
            onDoubleClick={resizerProps?.onDoubleClick}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onMouseUp}
            // style={resizerProps?.style}
          />
        )}

        {secondPane?.visible && (
          <div ref={pane2Ref} className={pane2Classes} style={pane2Styles}>
            {notNullChildren[1]}
          </div>
        )}
      </div>

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
    </div>
  );
};
