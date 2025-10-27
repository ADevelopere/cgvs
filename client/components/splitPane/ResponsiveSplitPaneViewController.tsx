import { Box, Drawer, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PanelRight, PanelLeft } from "lucide-react";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import { SplitPaneViewController } from "./SplitPaneViewController";
import DrawerToggleButton from "./DrawerToggleButton";

interface SplitPaneViewControllerProps {
  title: React.ReactNode;
  firstPaneButtonDisabled: boolean;
  secondPaneButtonDisabled: boolean;
  firstPaneButtonTooltip: string;
  secondPaneButtonTooltip: string;
  firstPane: React.ReactNode;
  secondPane: React.ReactNode;
  style?: React.CSSProperties;
  storageKey?: string;
}

interface ResponsiveSplitPaneViewControllerProps
  extends SplitPaneViewControllerProps {
  breakpointWidth: number;
  drawerWidth?: number;
  drawerVariant?: "temporary" | "persistent";
  drawerZIndex?: number;
  toggleButtonZIndex?: number;
  headerBehavior?: "above-content" | "in-drawer" | "hidden";
  drawerAnchor?: "left" | "right";
}

export const ResponsiveSplitPaneViewController: React.FC<
  ResponsiveSplitPaneViewControllerProps
> = ({
  title,
  firstPaneButtonDisabled,
  secondPaneButtonDisabled,
  firstPaneButtonTooltip,
  secondPaneButtonTooltip,
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
}) => {
  const { theme, isRtl } = useAppTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(Infinity);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Determine drawer anchor based on RTL or explicit prop
  const effectiveDrawerAnchor = drawerAnchor ?? (isRtl ? "right" : "left");

  // Determine effective z-index values
  const effectiveDrawerZIndex = drawerZIndex ?? theme.zIndex.drawer;
  const effectiveToggleButtonZIndex =
    toggleButtonZIndex ?? theme.zIndex.drawer + 1;

  // Calculate if we're in drawer mode
  const isDrawerMode = containerWidth < breakpointWidth;

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

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen(prev => !prev);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // Render normal split pane when width is sufficient
  if (!isDrawerMode) {
    return (
      <Box ref={containerRef} sx={{ height: "100%", width: "100%", ...style }}>
        <SplitPaneViewController
          title={title}
          firstPaneButtonDisabled={firstPaneButtonDisabled}
          secondPaneButtonDisabled={secondPaneButtonDisabled}
          firstPaneButtonTooltip={firstPaneButtonTooltip}
          secondPaneButtonTooltip={secondPaneButtonTooltip}
          firstPane={firstPane}
          secondPane={secondPane}
          style={style}
          storageKey={storageKey}
        />
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
      {/* Floating toggle button */}
      <DrawerToggleButton
        open={drawerOpen}
        onClick={handleDrawerToggle}
        title={drawerOpen ? firstPaneButtonTooltip : firstPaneButtonTooltip}
        zIndex={effectiveToggleButtonZIndex}
        isRtl={isRtl}
      />

      {/* Header above content (if headerBehavior is 'above-content') */}
      {headerBehavior === "above-content" && (
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
            {/* First pane visibility button - opens drawer */}
            <Tooltip title={firstPaneButtonTooltip}>
              <span>
                <IconButton
                  onClick={handleDrawerToggle}
                  disabled={firstPaneButtonDisabled}
                >
                  <PanelRight />
                </IconButton>
              </span>
            </Tooltip>
            {/* Second pane visibility button - disabled in drawer mode */}
            <Tooltip title={secondPaneButtonTooltip}>
              <span>
                <IconButton disabled={true}>
                  <PanelLeft />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* MUI Drawer */}
      <Drawer
        anchor={effectiveDrawerAnchor}
        open={drawerOpen}
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
        {/* Header in drawer (if headerBehavior is 'in-drawer') */}
        {headerBehavior === "in-drawer" && (
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
        {/* First pane content */}
        <Box sx={{ height: "100%", overflow: "auto" }}>{firstPane}</Box>
      </Drawer>

      {/* Main content area with second pane */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          width: "100%",
        }}
      >
        {secondPane}
      </Box>
    </Box>
  );
};

