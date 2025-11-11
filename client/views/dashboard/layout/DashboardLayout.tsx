"use client";

import { Box, useMediaQuery } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { ToggleSideBarButton } from "./ToggleSideBarButton";
import { useDashboardLayout } from "@/client/views/dashboard/layout/DashboardLayoutContext";
import { CollapsedDashboardSidebar } from "./CollapsedDashboardSidebar";
import { ExpandedDashboardSidebar } from "./ExpandedDashboardSidebar";
import { FloatingDashboardSidebar } from "./FloatingDashboardSidebar";
import { DashboardTitleRenderer } from "./DashboardDefaultTitle";
import { useAppTheme } from "@/client/contexts";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // header refs
  const headerRef = React.useRef<HTMLDivElement>(null);
  const sideBarToggleRef = React.useRef<HTMLButtonElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const middleActionsRef = React.useRef<HTMLDivElement>(null);
  const endActionsRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  // Get theme and media query for responsive design
  const { theme } = useAppTheme();
  const {
    sidebarState,
    setSidebarState,
    slots,
    setHeaderHeight,
    headerHeight,
    setSideBarToggleWidth,
    setSideBarWidth,
  } = useDashboardLayout();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Track previous sidebar state for desktop view
  const [previousDesktopState, setPreviousDesktopState] = useState(sidebarState);
  // Ref to always have the latest sidebarState value
  // prevent stale closure in useEffect
  const sidebarStateRef = React.useRef(sidebarState);

  useEffect(() => {
    sidebarStateRef.current = sidebarState;
  }, [sidebarState]);

  // Handle sidebar state based on screen size
  useEffect(() => {
    if (isMobile) {
      // Store current state before switching to mobile
      if (!isMobile) {
        setPreviousDesktopState(sidebarStateRef.current);
      }
      setSidebarState("collapsed");
    } else {
      // Restore previous state when returning to desktop
      setSidebarState(previousDesktopState);
    }
  }, [isMobile, previousDesktopState, setSidebarState]);

  // Handle sidebar visibility based on state
  const isCollapsedSidebarVisible = useMemo(() => !isMobile && sidebarState === "collapsed", [isMobile, sidebarState]);
  const isFullSidebarVisible = useMemo(() => !isMobile && sidebarState === "expanded", [isMobile, sidebarState]);
  const isFloatingSidebarVisible = useMemo(() => isMobile && sidebarState === "expanded", [isMobile, sidebarState]);

  useEffect(() => {
    const updateDimentions = () => {
      if (headerRef?.current) {
        const height = headerRef.current.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
      if (sideBarToggleRef?.current) {
        const width = sideBarToggleRef.current.getBoundingClientRect().width;
        setSideBarToggleWidth(width);
      }
      if (sidebarRef?.current) {
        const width = sidebarRef.current.getBoundingClientRect().width;
        setSideBarWidth(width);
      }
    };

    updateDimentions();

    window.addEventListener("resize", updateDimentions);

    return () => {
      window.removeEventListener("resize", updateDimentions);
    };
  }, [headerRef, setHeaderHeight, setSideBarToggleWidth, setSideBarWidth, sideBarToggleRef]);

  // Handle floating sidebar close
  const handleFloatingSidebarClose = () => {
    setSidebarState("collapsed");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* header */}
      <Box
        ref={headerRef}
        sx={{
          display: "flex",
          alignItems: "center",
          py: 0,
          borderBottom: 1,
          borderColor: "divider",
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* sidebar toggle */}
        <ToggleSideBarButton ref={sideBarToggleRef} />

        {/* title */}
        <DashboardTitleRenderer ref={titleRef} />

        {/* middle actions */}
        <Box ref={middleActionsRef} sx={{ ml: { xs: 1, sm: 2 }, flex: 1, minWidth: 0, overflow: "hidden" }}>
          {slots.middleActions}
        </Box>

        {/* end actions */}
        <Box ref={endActionsRef} sx={{ flexShrink: 0 }}>
          {slots.endActions}
        </Box>
      </Box>
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* collapsed sidebar */}
        {isCollapsedSidebarVisible && (
          <Box
            ref={sidebarRef}
            sx={{
              width: 72,
              flexShrink: 0,
              display: { xs: "none", sm: "block" },
              boxSizing: "border-box",
            }}
          >
            <CollapsedDashboardSidebar />
          </Box>
        )}

        {/* desktop full sidebar */}
        {isFullSidebarVisible && (
          <Box
            ref={sidebarRef}
            sx={{
              width: 280,
              flexShrink: 0,
              display: { xs: "none", sm: "block" },
            }}
          >
            <ExpandedDashboardSidebar />
          </Box>
        )}

        {/* main content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: `flexGrow-${sidebarState} 200ms cubic-bezier(0.4, 0, 0.2, 1)`,
            [`@keyframes flexGrow-${sidebarState}`]: {
              "0%": {
                opacity: 0,
                flexBasis: "80%", // Starts at 80% width
              },
              "100%": {
                opacity: 1,
                flexBasis: "100%", // Grows to 100%
              },
            },
          }}
        >
          {children}
        </Box>
      </Box>

      {/* floating sidebar for mobile */}
      {/* Only render when both mobile AND visible to prevent invisible backdrop from blocking touch events */}
      {isMobile && isFloatingSidebarVisible && (
        <FloatingDashboardSidebar open={true} onClose={handleFloatingSidebarClose} headerHeight={headerHeight} />
      )}
    </Box>
  );
};

export default DashboardLayout;
