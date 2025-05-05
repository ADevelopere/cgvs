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
import { useAppTheme } from "@/contexts/ThemeContext";
import { Box } from "@mui/material";


// Logger utility
const logger = {
    enabled: process.env.NODE_ENV === "development" && true,
    log: (...args: any[]) => {
        if (logger.enabled) {
            console.log(...args);
        }
    },
    error: (...args: any[]) => {
        if (logger.enabled) {
            console.error(...args);
        }
    },
};

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
    style?: CSSProperties;
    paneClassName?: string;
    paneStyle?: CSSProperties;
    firstPane?: PaneProps;
    middlePane?: PaneProps;
    thirdPane?: PaneProps;
    resizerProps?: ResizerProps;
    step?: number;
    direction?: "rtl" | "ltr";
    containerRef?: React.RefObject<HTMLElement>;
    width?: number;
    storageKey?: string;
};

// Type for the stored pane state
type StoredPaneState = {
    sizes: number[];
    visibility: {
        first: boolean;
        third: boolean;
    };
    previousSizes: {
        first: number | null;
        third: number | null;
    };
};

// Constants for local storage keys and pane state
const STORAGE_KEY_PREFIX = "editorPane";
const STORAGE_DEBOUNCE_MS = 300;
const MIN_PANE_SIZE = 50; // Minimum width to keep panes visible

// Helper functions for local storage operations
const getStorageKey = (key?: string) =>
    key ? `${STORAGE_KEY_PREFIX}_${key}` : null;

// Function to save pane state to local storage
const savePaneState = (key: string | undefined, state: StoredPaneState) => {
    if (!key) return;
    try {
        logger.log(
            "Saving editor pane state to local storage:",
            JSON.stringify(state),
        );
        localStorage.setItem(getStorageKey(key)!, JSON.stringify(state));
    } catch (error) {
        console.warn(
            "Failed to save editor pane state to local storage:",
            error,
        );
    }
};

// Helper to create a debounced function
const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number,
) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};


// Create a stable debounced version of savePaneState
const debouncedSavePaneState = debounce(savePaneState, STORAGE_DEBOUNCE_MS);

const loadFromLocalStorage = (key: string): StoredPaneState | null => {
    try {
        const stored = localStorage.getItem(getStorageKey(key)!);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.warn(
            "Failed to load editor pane state from local storage:",
            error,
        );
        return null;
    }
};



const EditorPane: FC<EditorPaneProps> = ({
    allowResize = true,
    children,
    className,
    orientation = "vertical",
    onDragStarted,
    onDragFinished,
    onChange,
    style: styleProps,
    paneClassName = "",
    paneStyle,
    firstPane = defaultPaneProps,
    middlePane = { ...defaultPaneProps, visible: true }, // Middle pane is always visible
    thirdPane = defaultPaneProps,
    resizerProps,
    step = 1,
    direction = "rtl",
    containerRef,
    width,
    storageKey,
}) => {
    const notNullChildren = removeNullChildren(children);
    const editorPaneRef = useRef<HTMLDivElement | null>(null);
    const pane1Ref = useRef<HTMLDivElement | null>(null);
    const pane2Ref = useRef<HTMLDivElement | null>(null);
    const pane3Ref = useRef<HTMLDivElement | null>(null);

    // States for resizing
    const [active, setActive] = useState(false);
    const [activeResizer, setActiveResizer] = useState<1 | 2 | null>(null);
    const [position, setPosition] = useState(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(0);

    // Initialize state from local storage if available
    const storedState = useMemo(() => {
        if (!storageKey) return null;
        const state = loadFromLocalStorage(storageKey);
        logger.log("Loading stored state:", JSON.stringify(state));
        return state;
    }, [storageKey]);

    // Initialize based on stored state or defaults, respecting current visibility
    const initialSizes = useMemo(() => {
        if (storedState?.sizes) {
            // Only use stored sizes if visibility matches current state
            return storedState.sizes.map((size, index) => {
                if (index === 0 && (firstPane.visible !== storedState.visibility.first)) return 0;
                if (index === 2 && (thirdPane.visible !== storedState.visibility.third)) return 0;
                return size;
            });
        }
        return [0, 0, 0]; // Default sizes will be calculated in the effect
    }, [storedState, firstPane.visible, thirdPane.visible]);

    // Store sizes for each pane
    const [paneSizes, setPaneSizes] = useState<number[]>(initialSizes);

    // Refs to store previous state for comparison
    // Store individual sizes of hidden panes
    const previousPaneSizesRef = useRef<{
        first: number | null;
        third: number | null;
    }>({
        first: storedState?.previousSizes?.first ?? null,
        third: storedState?.previousSizes?.third ?? null
    });
    const previousVisibilityRef = useRef({
        first: storedState?.visibility?.first ?? firstPane.visible,
        third: storedState?.visibility?.third ?? thirdPane.visible,
    });
    const previousContainerWidthRef = useRef<number>(0);

    // Effect to sync with container width changes
    useEffect(() => {
        if (!containerWidth) return;

        // Only update if we have stored state and container width changed
        if (
            storedState &&
            containerWidth !== previousContainerWidthRef.current
        ) {
            logger.log(
                "Container width changed, adjusting stored sizes:",
                JSON.stringify({
                    containerWidth,
                    previousWidth: previousContainerWidthRef.current,
                    currentSizes: paneSizes,
                    storedSizes: storedState.sizes,
                }),
            );
        }
    }, [containerWidth, storedState, paneSizes]);

    // Helper function to save current state
    const saveCurrentState = useCallback(() => {
        if (!storageKey || !containerWidth) return;

        // Only save if sizes add up to containerWidth (valid state)
        const totalSize = paneSizes.reduce((sum, size) => sum + size, 0);
        if (Math.abs(totalSize - containerWidth) > 1) return; // Allow 1px difference for rounding

        const state: StoredPaneState = {
            sizes: paneSizes,
            visibility: {
                first: firstPane.visible,
                third: thirdPane.visible,
            },
            previousSizes: previousPaneSizesRef.current,
        };

        debouncedSavePaneState(storageKey, state);
    }, [storageKey, containerWidth, paneSizes, firstPane.visible, thirdPane.visible]);

    const updateContainerDimensions = useCallback(() => {
        const element = containerRef?.current || editorPaneRef.current;
        if (element) {
            const rect = element.getBoundingClientRect();
            const newWidth = width ?? rect.width;
            // Only update if width actually changed to avoid unnecessary recalculations
            if (newWidth !== previousContainerWidthRef.current) {
                setContainerWidth(newWidth);
                previousContainerWidthRef.current = newWidth; // Update ref immediately
            }
            setContainerHeight(rect.height); // Height might change independently
        }
    }, [containerRef, width]);

    // Effect to handle initialization, visibility changes, and width changes
    useEffect(() => {
        if (!containerWidth) return; // Wait for container width

        const currentVisibility = {
            first: firstPane.visible,
            third: thirdPane.visible,
        };
        const prevVisibility = previousVisibilityRef.current;
        const totalWidth = containerWidth;

        const firstPaneHidden =
            prevVisibility.first && !currentVisibility.first;
        const thirdPaneHidden =
            prevVisibility.third && !currentVisibility.third;
        const firstPaneShown = !prevVisibility.first && currentVisibility.first;
        const thirdPaneShown = !prevVisibility.third && currentVisibility.third;
        const visibilityChanged =
            firstPaneHidden ||
            thirdPaneHidden ||
            firstPaneShown ||
            thirdPaneShown;
        const widthChanged = totalWidth !== previousContainerWidthRef.current;

        let nextSizes = [...paneSizes]; // Start with current sizes

        if (visibilityChanged) {
            if (firstPaneHidden) {
                // Store hidden pane's size and add it to the middle pane
                previousPaneSizesRef.current.first = paneSizes[0];
                nextSizes = [
                    0,
                    Math.max(MIN_PANE_SIZE, paneSizes[1] + paneSizes[0]),
                    paneSizes[2],
                ];
            } else if (thirdPaneHidden) {
                // Store hidden pane's size and add it to the middle pane
                previousPaneSizesRef.current.third = paneSizes[2];
                nextSizes = [
                    paneSizes[0],
                    Math.max(MIN_PANE_SIZE, paneSizes[1] + paneSizes[2]),
                    0,
                ];
            } else if (firstPaneShown) {
                // Restore first pane size, taking from middle pane
                const sizeToRestore = previousPaneSizesRef.current.first;
                const firstInitialRatio = firstPane.preferredRatio ?? 0.33;
                let restoredFirstSize =
                    sizeToRestore ??
                    Math.max(MIN_PANE_SIZE, totalWidth * firstInitialRatio);
                restoredFirstSize = Math.max(MIN_PANE_SIZE, restoredFirstSize);

                let newMiddleSize = paneSizes[1] - restoredFirstSize;
                // If middle pane becomes too small, take less for the first pane
                if (newMiddleSize < MIN_PANE_SIZE) {
                    restoredFirstSize = Math.max(
                        0,
                        paneSizes[1] - MIN_PANE_SIZE,
                    ); // Don't make first pane negative
                    newMiddleSize = MIN_PANE_SIZE;
                }
                // Ensure first pane didn't become negative or too small
                restoredFirstSize = Math.max(MIN_PANE_SIZE, restoredFirstSize);

                nextSizes = [restoredFirstSize, newMiddleSize, paneSizes[2]];
                previousPaneSizesRef.current.first = null; // Clear stored size
            } else if (thirdPaneShown) {
                // Restore third pane size, taking from middle pane
                const sizeToRestore = previousPaneSizesRef.current.third;
                const thirdInitialRatio = thirdPane.preferredRatio ?? 0.33;
                let restoredThirdSize =
                    sizeToRestore ??
                    Math.max(MIN_PANE_SIZE, totalWidth * thirdInitialRatio);
                restoredThirdSize = Math.max(MIN_PANE_SIZE, restoredThirdSize);

                let newMiddleSize = paneSizes[1] - restoredThirdSize;
                // If middle pane becomes too small, take less for the third pane
                if (newMiddleSize < MIN_PANE_SIZE) {
                    restoredThirdSize = Math.max(
                        0,
                        paneSizes[1] - MIN_PANE_SIZE,
                    ); // Don't make third pane negative
                    newMiddleSize = MIN_PANE_SIZE;
                }
                // Ensure third pane didn't become negative or too small
                restoredThirdSize = Math.max(MIN_PANE_SIZE, restoredThirdSize);

                nextSizes = [paneSizes[0], newMiddleSize, restoredThirdSize];
                previousPaneSizesRef.current.third = null; // Clear stored size
            }
            // Update visibility ref after handling changes
            previousVisibilityRef.current = currentVisibility;
        } else if (widthChanged || paneSizes.reduce((a, b) => a + b, 0) === 0) {
            // Initial calculation or width change without visibility change
            const currentTotalSize = paneSizes.reduce((a, b) => a + b, 0);

            if (
                currentTotalSize === 0 ||
                (!currentVisibility.first && !currentVisibility.third)
            ) {
                // Initial calculation or only middle pane is visible
                const visiblePanesCount = [
                    currentVisibility.first,
                    true,
                    currentVisibility.third,
                ].filter(Boolean).length;
                if (visiblePanesCount === 1) {
                    // Only middle visible
                    nextSizes = [0, totalWidth, 0];
                } else {
                    const sizePerPane = totalWidth / visiblePanesCount;
                    nextSizes = [
                        currentVisibility.first
                            ? Math.max(MIN_PANE_SIZE, sizePerPane)
                            : 0,
                        Math.max(MIN_PANE_SIZE, sizePerPane),
                        currentVisibility.third
                            ? Math.max(MIN_PANE_SIZE, sizePerPane)
                            : 0,
                    ];
                }
            } else if (currentTotalSize > 0) {
                // Width change: Recalculate proportionally for currently visible panes
                const scale = totalWidth / currentTotalSize;
                nextSizes = paneSizes.map((size, index) => {
                    const isVisible =
                        (index === 0 && currentVisibility.first) ||
                        index === 1 ||
                        (index === 2 && currentVisibility.third);
                    return isVisible
                        ? Math.max(MIN_PANE_SIZE, size * scale)
                        : 0;
                });
            }
        }

        // --- Final Adjustment ---
        // Ensure sizes add up to totalWidth and respect MIN_PANE_SIZE for visible panes
        let currentTotal = nextSizes.reduce((a, b) => a + b, 0);
        let diff = totalWidth - currentTotal;

        const visibleIndices = [
            currentVisibility.first ? 0 : -1,
            1, // Middle always visible index
            currentVisibility.third ? 2 : -1,
        ].filter((index) => index !== -1);

        if (diff !== 0 && visibleIndices.length > 0) {
            // Try to adjust the middle pane first if possible
            const middleIndex = 1;
            if (visibleIndices.includes(middleIndex)) {
                const middleAdjusted = nextSizes[middleIndex] + diff;
                if (middleAdjusted >= MIN_PANE_SIZE) {
                    nextSizes[middleIndex] = middleAdjusted;
                    diff = 0; // Difference applied
                } else {
                    // Cannot apply full diff to middle, apply partial and recalculate remaining diff
                    const partialDiff = MIN_PANE_SIZE - nextSizes[middleIndex]; // positive amount needed
                    nextSizes[middleIndex] = MIN_PANE_SIZE;
                    diff -= partialDiff; // The remaining difference to apply elsewhere
                }
            }

            // If difference remains, apply to other visible panes proportionally or equally
            if (diff !== 0) {
                const otherVisibleIndices = visibleIndices.filter(
                    (i) => i !== middleIndex,
                );
                if (otherVisibleIndices.length > 0) {
                    // Simple equal distribution for remaining diff for now
                    const diffPerPane = diff / otherVisibleIndices.length;
                    otherVisibleIndices.forEach((i) => {
                        nextSizes[i] = Math.max(
                            MIN_PANE_SIZE,
                            nextSizes[i] + diffPerPane,
                        );
                    });
                } else if (
                    !visibleIndices.includes(middleIndex) &&
                    visibleIndices.length > 0
                ) {
                    // Only side panes visible (shouldn't happen with middle always visible, but handle defensively)
                    const diffPerPane = diff / visibleIndices.length;
                    visibleIndices.forEach((i) => {
                        nextSizes[i] = Math.max(
                            MIN_PANE_SIZE,
                            nextSizes[i] + diffPerPane,
                        );
                    });
                }
            }

            // Final pass to ensure sum is exactly totalWidth after adjustments and MIN_PANE_SIZE clamping
            currentTotal = nextSizes.reduce((a, b) => a + b, 0);
            diff = totalWidth - currentTotal;
            if (diff !== 0 && visibleIndices.length > 0) {
                // Apply remaining micro-difference to the middle pane if visible, otherwise the last visible one
                const finalAdjustIndex = visibleIndices.includes(middleIndex)
                    ? middleIndex
                    : visibleIndices[visibleIndices.length - 1];
                nextSizes[finalAdjustIndex] = Math.max(
                    MIN_PANE_SIZE,
                    nextSizes[finalAdjustIndex] + diff,
                );
            }
        } else if (visibleIndices.length === 1) {
            // If only one pane is visible, it must take the full width
            nextSizes[visibleIndices[0]] = totalWidth;
        }

        // Ensure non-visible panes have size 0
        if (!currentVisibility.first) nextSizes[0] = 0;
        if (!currentVisibility.third) nextSizes[2] = 0; // Only update state if sizes actually changed significantly (avoiding floating point noise)
        const sizesChanged = nextSizes.some(
            (size, i) => Math.abs(size - paneSizes[i]) > 0.1,
        );
        if (sizesChanged) {
            setPaneSizes(nextSizes);

            if (onChange) onChange(nextSizes); // Notify parent about size changes
            saveCurrentState(); // Save state after size changes
        }
        // Update width ref *after* using it for comparison
        previousContainerWidthRef.current = totalWidth;
    }, [
        containerWidth,
        firstPane.visible,
        thirdPane.visible,
        firstPane.preferredRatio,
        thirdPane.preferredRatio,
        paneSizes,
        onChange,
    ]); // Added preferredRatios as dependencies for fallback

    // Effect for attaching resize observer
    useEffect(() => {
        updateContainerDimensions(); // Initial dimensions

        const resizeObserver = new ResizeObserver(() => {
            updateContainerDimensions(); // Update on resize
        });

        const element = containerRef?.current || editorPaneRef.current;
        if (element) {
            resizeObserver.observe(element);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [updateContainerDimensions, containerRef]); // Dependencies for observer setup

    const onResizeStart = (resizerIndex: 1 | 2, clientX: number) => {
        setActiveResizer(resizerIndex);
        setPosition(clientX); // Set initial position for delta calculation
        setActive(true);
        if (onDragStarted) onDragStarted();
    };

    const onResizeEnd = () => {
        if (!active) return; // Prevent multiple calls
        setActive(false);
        setActiveResizer(null);
        if (onDragFinished) onDragFinished(paneSizes);
    };

    const onResize = useCallback(
        (clientX: number) => {
            if (!active || !activeResizer) return;

            const containerRect =
                editorPaneRef.current?.getBoundingClientRect();
            if (!containerRect) return;

            const containerLeft = containerRect.left;
            const containerRight = containerRect.right;

            // Ensure clientX is within container bounds relative to the container edge
            const boundedClientX = Math.min(
                Math.max(clientX, containerLeft),
                containerRight,
            );

            // Calculate delta based on direction
            const rawDelta = boundedClientX - position;
            const deltaX = direction === 'rtl' && orientation === 'vertical' ? -rawDelta : rawDelta;

            // Prevent resizing if delta is zero
            if (deltaX === 0) return;

            const newSizes = [...paneSizes];

            if (activeResizer === 1) {
                // First resizer logic: affects pane 0 and 1
                const newSize1 = newSizes[0] + deltaX;
                const newSize2 = newSizes[1] - deltaX;

                // Apply changes only if minimum sizes are respected
                if (newSize1 >= MIN_PANE_SIZE && newSize2 >= MIN_PANE_SIZE) {
                    newSizes[0] = newSize1;
                    newSizes[1] = newSize2;
                    setPosition(boundedClientX); // Update position only if resize happened
                }
            } else {
                // activeResizer === 2
                // Second resizer logic: affects pane 1 and 2
                const newSize2 = newSizes[1] + deltaX;
                const newSize3 = newSizes[2] - deltaX;

                // Apply changes only if minimum sizes are respected
                if (newSize2 >= MIN_PANE_SIZE && newSize3 >= MIN_PANE_SIZE) {
                    newSizes[1] = newSize2;
                    newSizes[2] = newSize3;
                    setPosition(boundedClientX); // Update position only if resize happened
                }
            }

            // Only update state if sizes actually changed
            if (JSON.stringify(newSizes) !== JSON.stringify(paneSizes)) {
                setPaneSizes(newSizes);
                if (onChange) onChange(newSizes);
                saveCurrentState(); // Save state after resize
            }
        },
        [active, activeResizer, paneSizes, position, onChange, direction, orientation],
    );

    const handleMouseMove = useCallback(
        (e: globalThis.MouseEvent) => {
            if (!active) return;
            unFocus(document, window);
            onResize(e.clientX);
        },
        [active, onResize], // onResize dependency is important here
    );

    // Global mouse listeners for dragging
    useEffect(() => {
        // Use capturing phase for mouseup to catch it even if over an iframe or other element
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", onResizeEnd, { capture: true });

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", onResizeEnd, {
                capture: true,
            });
        };
    }, [handleMouseMove, onResizeEnd]); // Add onResizeEnd dependency

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
        [paneStyle, orientation],
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
            ...styleProps,
        }),
        [orientation, styleProps],
    );

    // Memoized pane styles
    const getPaneStyle = useCallback(
        (index: number, paneProps?: PaneProps): CSSProperties => ({
            // Use flex-basis for size control in flex layout
            flexBasis: paneSizes[index] > 0 ? `${paneSizes[index]}px` : "0px",
            flexGrow: 0,
            flexShrink: 0,
            // Hide completely if size is 0
            display: paneSizes[index] > 0 ? "block" : "none",
            // Apply other base styles
            ...basePaneStyle,
            ...(paneProps?.style ?? {}),
            // Explicit width/height might conflict with flex-basis, prioritize flex-basis
            // width: orientation === "vertical" ? (paneSizes[index] > 0 ? `${paneSizes[index]}px` : '0px') : "100%",
            // height: orientation === "horizontal" ? (paneSizes[index] > 0 ? `${paneSizes[index]}px` : '0px') : "100%",
        }),
        [orientation, paneSizes, basePaneStyle],
    );

    return (
        <Box ref={editorPaneRef} className={className} style={wrapperStyle} id="editor-pane">
            {/* Pane 1 */}
            {firstPane.visible && paneSizes[0] > 0 && (
                <Box
                    ref={pane1Ref}
                    className={`${paneClassName} first-pane`}
                    style={getPaneStyle(0, firstPane)}
                >
                    {notNullChildren[0]}
                </Box>
            )}

            {/* Resizer 1 */}
            {firstPane.visible && paneSizes[0] > 0 && (
                <EditorPaneResizer
                    allowResize={allowResize}
                    orientation={orientation}
                    className={resizerProps?.className ?? "resizer"}
                    onClick={resizerProps?.onClick}
                    onDoubleClick={resizerProps?.onDoubleClick}
                    onMouseDown={(e) => {
                        onResizeStart(1, e.clientX);
                    }}
                    onTouchStart={(e: TouchEvent<HTMLSpanElement>) => {
                        if (e.touches[0])
                            onResizeStart(1, e.touches[0].clientX);
                    }}
                    onTouchEnd={onResizeEnd}
                    style={resizerProps?.style}
                />
            )}

            {/* Pane 2 (Always present in layout, style controls visibility/size) */}
            {paneSizes[1] > 0 && (
                <Box
                    ref={pane2Ref}
                    className={`${paneClassName} middle-pane`}
                    style={getPaneStyle(1, middlePane)}
                >
                    {notNullChildren[1]}
                </Box>
            )}

            {/* Resizer 2 */}
            {thirdPane.visible && paneSizes[2] > 0 && (
                <EditorPaneResizer
                    allowResize={allowResize}
                    orientation={orientation}
                    className={resizerProps?.className ?? "resizer"}
                    onClick={resizerProps?.onClick}
                    onDoubleClick={resizerProps?.onDoubleClick}
                    onMouseDown={(e) => {
                        onResizeStart(2, e.clientX);
                    }}
                    onTouchStart={(e: TouchEvent<HTMLSpanElement>) => {
                        if (e.touches[0])
                            onResizeStart(2, e.touches[0].clientX);
                    }}
                    onTouchEnd={onResizeEnd}
                    style={resizerProps?.style}
                />
            )}

            {/* Pane 3 */}
            {thirdPane.visible && paneSizes[2] > 0 && (
                <Box
                    ref={pane3Ref}
                    className={`${paneClassName} third-pane`}
                    style={getPaneStyle(2, thirdPane)}
                >
                    {notNullChildren[2]}
                </Box>
            )}
        </Box>
    );
};

export default EditorPane;
