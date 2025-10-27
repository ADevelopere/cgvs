import { Box, Drawer, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PanelRight, PanelLeft } from "lucide-react";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import { SplitPaneViewController } from "./SplitPaneViewController";
import { SplitPane } from "./SplitPane";
import DrawerToggleButton from "./DrawerToggleButton";

type ResponsiveSplitPaneViewControllerProps = {
  title?: React.ReactNode;
  firstPane: React.ReactNode;
  secondPane: React.ReactNode;
  style?: React.CSSProperties;
  storageKey?: string;
  breakpointWidth: number;
  drawerWidth?: number;
  drawerVariant?: "temporary" | "persistent";
  drawerZIndex?: number;
  toggleButtonZIndex?: number;
  headerBehavior?: "above-content" | "in-drawer" | "hidden";
  drawerAnchor?: "left" | "right";
  hidablePane: "first" | "second";
  hidablePaneTooltip: string;
  toggleButtonInSplitMode?: "hidden" | "floating";
  toggleButtonInDrawerMode?: "hidden" | "floating";
  onTogglePaneRef?: (toggleFn: () => void) => void;
};

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

  const handleDrawerClose = useCallback(() => {
    setHidablePaneVisible(false);
  }, []);

  // Determine if we should show floating toggle button
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

  // Get the pane that goes in the drawer (for drawer mode)
  const drawerPaneContent = hidablePane === "first" ? firstPane : secondPane;
  const mainPaneContent = hidablePane === "first" ? secondPane : firstPane;

  // Render normal split pane when width is sufficient
  if (!isDrawerMode) {
    return (
      <Box ref={containerRef} sx={{ height: "100%", width: "100%", ...style }}>
        {/* Floating toggle button for split mode */}
        {showFloatingToggleButton() && (
          <DrawerToggleButton
            open={hidablePaneVisible}
            onClick={toggleHidablePane}
            title={hidablePaneTooltip}
            zIndex={effectiveToggleButtonZIndex}
            isRtl={isRtl}
          />
        )}

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
            firstPane={firstPane}
            secondPane={secondPane}
            style={style}
            storageKey={storageKey}
          />
        ) : (
          <SplitPane
            orientation="vertical"
            firstPane={{
              visible: hidablePane === "first" ? hidablePaneVisible : true,
              minRatio: 0.3,
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
            {firstPane}
            {secondPane}
          </SplitPane>
        )}
      </Box>
    );
  }

  // Render drawer mode
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
              <span>
                <IconButton onClick={toggleHidablePane}>
                  {hidablePane === "first" ? <PanelRight /> : <PanelLeft />}
                </IconButton>
              </span>
            </Tooltip>
            {/* Non-hidable pane button (disabled) */}
            <Tooltip title="">
              <span>
                <IconButton disabled={true}>
                  {hidablePane === "first" ? <PanelLeft /> : <PanelRight />}
                </IconButton>
              </span>
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
