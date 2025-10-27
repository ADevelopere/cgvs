import { Box, Drawer, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PanelRight, PanelLeft } from "lucide-react";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import { SplitPaneViewController } from "./SplitPaneViewController";
import { SplitPane } from "./SplitPane";
import DrawerToggleButton from "./DrawerToggleButton";

/**
 * Props passed to pane render functions when using callback pattern.
 * Allows child components to access parent state and control visibility.
 *
 * @example
 * ```tsx
 * <ResponsiveSplitPaneViewController
 *   secondPane={({ togglePane, isDrawerMode, isPaneVisible }) => (
 *     <MyComponent
 *       onToggle={togglePane}
 *       showToggleButton={!isDrawerMode}
 *       isPaneOpen={isPaneVisible}
 *     />
 *   )}
 * />
 * ```
 */
export type PaneRenderProps = {
  /** Function to toggle the hidable pane visibility */
  togglePane: () => void;
  /** Whether the component is in drawer mode (width < breakpoint) */
  isDrawerMode: boolean;
  /** Whether the hidable pane is currently visible */
  isPaneVisible: boolean;
};

/**
 * Props for ResponsiveSplitPaneViewController component
 */
type ResponsiveSplitPaneViewControllerProps = {
  /**
   * Optional title/header content. When provided, renders a header with toggle buttons.
   * When undefined, no header is shown and uses floating toggle button (if configured).
   */
  title?: React.ReactNode;

  /**
   * First pane content. Can be static ReactNode or callback function.
   * Callback receives PaneRenderProps for dynamic rendering based on state.
   */
  firstPane: React.ReactNode | ((props: PaneRenderProps) => React.ReactNode);

  /**
   * Second pane content. Can be static ReactNode or callback function.
   * Callback receives PaneRenderProps for dynamic rendering based on state.
   */
  secondPane: React.ReactNode | ((props: PaneRenderProps) => React.ReactNode);

  /** Custom styles for the container */
  style?: React.CSSProperties;

  /** Storage key for persisting split ratios to localStorage */
  storageKey?: string;

  /**
   * Width threshold (in pixels) for switching between split and drawer modes.
   * When container width < breakpointWidth, drawer mode is activated.
   * @example 600 // Switch to drawer mode below 600px
   */
  breakpointWidth: number;

  /**
   * Width of the drawer in drawer mode
   * @default 300
   */
  drawerWidth?: number;

  /**
   * MUI Drawer variant
   * - "temporary": Closes on outside click
   * - "persistent": Stays open until explicitly closed
   * @default "temporary"
   */
  drawerVariant?: "temporary" | "persistent";

  /**
   * Custom z-index for the drawer
   * @default theme.zIndex.drawer
   */
  drawerZIndex?: number;

  /**
   * Custom z-index for the floating toggle button
   * @default theme.zIndex.drawer + 1
   */
  toggleButtonZIndex?: number;

  /**
   * Controls where the header appears when title is defined
   * - "above-content": Header above main content area
   * - "in-drawer": Header inside the drawer
   * - "hidden": No header shown
   * @default "above-content"
   */
  headerBehavior?: "above-content" | "in-drawer" | "hidden";

  /**
   * Side of the screen where drawer opens
   * Auto-detects based on RTL when not specified
   * @default isRtl ? "right" : "left"
   */
  drawerAnchor?: "left" | "right";

  /**
   * Which pane can be hidden/toggled
   * Only one pane can be hidable at a time
   */
  hidablePane: "first" | "second";

  /** Tooltip text for the hidable pane toggle button */
  hidablePaneTooltip: string;

  /**
   * Toggle button visibility in split mode (width >= breakpoint)
   * - "hidden": No floating button (use header buttons if title is defined)
   * - "floating": Show floating toggle button
   * @default "hidden"
   */
  toggleButtonInSplitMode?: "hidden" | "floating";

  /**
   * Toggle button visibility in drawer mode (width < breakpoint)
   * - "hidden": No floating button
   * - "floating": Show floating toggle button
   * @default "floating"
   */
  toggleButtonInDrawerMode?: "hidden" | "floating";

  /**
   * Callback that receives the toggle function on mount.
   * Allows external components to programmatically control pane visibility.
   * @example
   * ```tsx
   * const [toggleFn, setToggleFn] = useState<(() => void) | null>(null);
   * <ResponsiveSplitPaneViewController
   *   onTogglePaneRef={(fn) => setToggleFn(() => fn)}
   * />
   * // Later: toggleFn?.();
   * ```
   */
  onTogglePaneRef?: (toggleFn: () => void) => void;
};

/**
 * A responsive split pane component that automatically switches between split view and drawer mode
 * based on container width. Manages pane visibility state internally and provides flexible
 * configuration options.
 *
 * ## Features
 * - **Automatic Mode Switching**: Renders SplitPane when width >= breakpoint, Drawer when width < breakpoint
 * - **ResizeObserver**: Tracks container width automatically (no manual width passing needed)
 * - **Configurable Hidable Pane**: Either first or second pane can be hidden, not both
 * - **Optional Header**: Title can be undefined for headerless mode with floating toggle button
 * - **Internal State Management**: Manages pane visibility state internally
 * - **Callback Pattern**: Panes can be render functions to access parent state
 * - **RTL Support**: Auto-detects and respects right-to-left layout
 * - **LocalStorage**: Persists split ratios using storageKey
 *
 * ## Usage Examples
 *
 * ### Basic Usage (Static Content)
 * ```tsx
 * <ResponsiveSplitPaneViewController
 *   hidablePane="first"
 *   hidablePaneTooltip="Toggle Categories"
 *   firstPane={<CategoryPane />}
 *   secondPane={<ContentPane />}
 *   breakpointWidth={600}
 *   storageKey="myApp-splitPane"
 * />
 * ```
 *
 * ### Advanced Usage (Callback Pattern)
 * ```tsx
 * <ResponsiveSplitPaneViewController
 *   hidablePane="first"
 *   hidablePaneTooltip="Toggle Sidebar"
 *   firstPane={<Sidebar />}
 *   secondPane={({ togglePane, isDrawerMode, isPaneVisible }) => (
 *     <Content
 *       onToggleSidebar={togglePane}
 *       showToggleButton={!isDrawerMode}
 *       isSidebarVisible={isPaneVisible}
 *     />
 *   )}
 *   breakpointWidth={768}
 *   drawerWidth={320}
 *   toggleButtonInDrawerMode="floating"
 *   toggleButtonInSplitMode="hidden"
 *   storageKey="app-mainLayout"
 * />
 * ```
 *
 * ### With Header
 * ```tsx
 * <ResponsiveSplitPaneViewController
 *   title={<Typography variant="h6">My App</Typography>}
 *   hidablePane="first"
 *   hidablePaneTooltip="Toggle Navigation"
 *   firstPane={<Navigation />}
 *   secondPane={<MainContent />}
 *   breakpointWidth={900}
 *   headerBehavior="above-content"
 *   storageKey="app-withHeader"
 * />
 * ```
 *
 * ## Behavior
 *
 * ### Split Mode (width >= breakpoint)
 * - Renders SplitPane component with resizable divider
 * - Users can drag to adjust pane sizes
 * - Split ratios saved to localStorage
 * - Header buttons control visibility (if title provided)
 * - Floating button optional (configurable)
 *
 * ### Drawer Mode (width < breakpoint)
 * - Hidable pane moves to MUI Drawer
 * - Non-hidable pane takes full width
 * - Drawer can be temporary or persistent
 * - Floating toggle button (configurable)
 * - Header can be above content or in drawer
 *
 * @param props - Component configuration options
 * @returns Responsive split pane component
 */
export const ResponsiveSplitPaneViewController: React.FC<
  ResponsiveSplitPaneViewControllerProps
> = ({
  title,
  firstPane,
  secondPane,
  style,
  storageKey,
  breakpointWidth,
  drawerWidth = 300,
  drawerVariant = "temporary",
  drawerZIndex,
  toggleButtonZIndex,
  headerBehavior = "above-content",
  drawerAnchor,
  hidablePane,
  hidablePaneTooltip,
  toggleButtonInSplitMode = "hidden",
  toggleButtonInDrawerMode = "floating",
  onTogglePaneRef,
}) => {
  const { theme, isRtl } = useAppTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(Infinity);
  const [hidablePaneVisible, setHidablePaneVisible] = useState<boolean>(true);

  // Determine drawer anchor based on RTL or explicit prop
  const effectiveDrawerAnchor = drawerAnchor ?? (isRtl ? "right" : "left");

  // Determine effective z-index values
  const effectiveDrawerZIndex = drawerZIndex ?? theme.zIndex.drawer;
  const effectiveToggleButtonZIndex =
    toggleButtonZIndex ?? theme.zIndex.drawer + 1;

  // Calculate if we're in drawer mode
  const isDrawerMode = containerWidth < breakpointWidth;

  // Toggle function for hidable pane
  const toggleHidablePane = useCallback(() => {
    setHidablePaneVisible(prev => !prev);
  }, []);

  // Expose toggle function via callback
  useEffect(() => {
    if (onTogglePaneRef) {
      onTogglePaneRef(toggleHidablePane);
    }
  }, [onTogglePaneRef, toggleHidablePane]);

  // ResizeObserver to track container width
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * Handles drawer close event (for temporary drawer variant).
   * Sets hidable pane to not visible.
   */
  const handleDrawerClose = useCallback(() => {
    setHidablePaneVisible(false);
  }, []);

  /**
   * Renders a pane, supporting both static ReactNode and callback function patterns.
   * When pane is a function, it receives current state (togglePane, isDrawerMode, isPaneVisible).
   *
   * @param pane - ReactNode or callback function
   * @returns Rendered pane content
   */
  const renderPane = useCallback(
    (
      pane: React.ReactNode | ((props: PaneRenderProps) => React.ReactNode)
    ): React.ReactNode => {
      if (typeof pane === "function") {
        return pane({
          togglePane: toggleHidablePane,
          isDrawerMode,
          isPaneVisible: hidablePaneVisible,
        });
      }
      return pane;
    },
    [toggleHidablePane, isDrawerMode, hidablePaneVisible]
  );

  /**
   * Determines whether to show the floating toggle button based on current mode and configuration.
   * Logic:
   * - If title is defined: don't show floating button (use header buttons instead)
   * - If in drawer mode: show based on toggleButtonInDrawerMode setting
   * - If in split mode: show based on toggleButtonInSplitMode setting
   *
   * @returns true if floating button should be visible
   */
  const showFloatingToggleButton = () => {
    // If title exists, don't show floating button (use header buttons instead)
    if (title !== undefined) return false;

    // When in drawer mode
    if (isDrawerMode) {
      return toggleButtonInDrawerMode === "floating";
    }

    // When in split pane mode
    return toggleButtonInSplitMode === "floating";
  };

  /**
   * Render the appropriate pane content based on mode:
   * - In drawer mode: hidable pane goes in drawer, other pane in main area
   * - Panes are rendered through renderPane to support both static and callback patterns
   */
  const drawerPaneContent = renderPane(
    hidablePane === "first" ? firstPane : secondPane
  );
  const mainPaneContent = renderPane(
    hidablePane === "first" ? secondPane : firstPane
  );

  /**
   * SPLIT MODE RENDER (width >= breakpoint)
   * Renders two panes side-by-side with resizable divider.
   * Uses SplitPane component for full drag-to-resize functionality.
   */
  if (!isDrawerMode) {
    return (
      <Box ref={containerRef} sx={{ height: "100%", width: "100%", ...style }}>
        {/* Floating toggle button for split mode (if configured and no title) */}
        {showFloatingToggleButton() && (
          <DrawerToggleButton
            open={hidablePaneVisible}
            onClick={toggleHidablePane}
            title={hidablePaneTooltip}
            zIndex={effectiveToggleButtonZIndex}
            isRtl={isRtl}
          />
        )}

        {/* Two render paths: with header (SplitPaneViewController) or headerless (SplitPane) */}
        {title !== undefined ? (
          <SplitPaneViewController
            title={title}
            firstPaneButtonDisabled={hidablePane === "second"}
            secondPaneButtonDisabled={hidablePane === "first"}
            firstPaneButtonTooltip={
              hidablePane === "first" ? hidablePaneTooltip : ""
            }
            secondPaneButtonTooltip={
              hidablePane === "second" ? hidablePaneTooltip : ""
            }
            firstPane={renderPane(firstPane)}
            secondPane={renderPane(secondPane)}
            style={style}
            storageKey={storageKey}
          />
        ) : (
          <SplitPane
            orientation="vertical"
            firstPane={{
              visible: hidablePane === "first" ? hidablePaneVisible : true,
              minRatio: 0.15,
            }}
            secondPane={{
              visible: hidablePane === "second" ? hidablePaneVisible : true,
              minRatio: 0.3,
            }}
            resizerProps={{
              style: {
                cursor: "col-resize",
              },
            }}
            style={{
              flex: 1,
              minHeight: "100%",
            }}
            storageKey={storageKey}
          >
            {renderPane(firstPane)}
            {renderPane(secondPane)}
          </SplitPane>
        )}
      </Box>
    );
  }

  /**
   * DRAWER MODE RENDER (width < breakpoint)
   * Hidable pane moves to MUI Drawer, non-hidable pane takes full width in main area.
   * Provides mobile-friendly interface with slide-out drawer.
   */
  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        ...style,
      }}
    >
      {/* Floating toggle button for drawer mode */}
      {showFloatingToggleButton() && (
        <DrawerToggleButton
          open={hidablePaneVisible}
          onClick={toggleHidablePane}
          title={hidablePaneTooltip}
          zIndex={effectiveToggleButtonZIndex}
          isRtl={isRtl}
        />
      )}

      {/* Header above content (if title is defined and headerBehavior is 'above-content') */}
      {title !== undefined && headerBehavior === "above-content" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "1px solid",
            borderColor: theme.palette.divider,
            mb: 2,
          }}
        >
          {title}
          <Box sx={{ flex: 1 }} />
          <Box>
            {/* Hidable pane toggle button */}
            <Tooltip title={hidablePaneTooltip}>
                <IconButton onClick={toggleHidablePane}>
                  {hidablePane === "first" ? <PanelRight /> : <PanelLeft />}
                </IconButton>
            </Tooltip>
            {/* Non-hidable pane button (disabled) */}
            <Tooltip title="">
                <IconButton disabled={true}>
                  {hidablePane === "first" ? <PanelLeft /> : <PanelRight />}
                </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* MUI Drawer */}
      <Drawer
        anchor={effectiveDrawerAnchor}
        open={hidablePaneVisible}
        onClose={handleDrawerClose}
        variant={drawerVariant}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: effectiveDrawerZIndex,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {/* Header in drawer (if title is defined and headerBehavior is 'in-drawer') */}
        {title !== undefined && headerBehavior === "in-drawer" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              borderBottom: "1px solid",
              borderColor: theme.palette.divider,
              mb: 2,
              p: 2,
            }}
          >
            {title}
          </Box>
        )}
        {/* Drawer pane content */}
        <Box sx={{ height: "100%", overflow: "auto" }}>
          {drawerPaneContent}
        </Box>
      </Drawer>

      {/* Main content area */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          width: "100%",
        }}
      >
        {mainPaneContent}
      </Box>
    </Box>
  );
};
