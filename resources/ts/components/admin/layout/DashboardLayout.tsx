import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { ToggleSideBarButton } from "./ToggleSideBarButton";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import { CollapsedDashboardSidebar } from "./CollapsedDashboardSidebar";
import { ExpandedDashboardSidebar } from "./ExpandedDashboardSidebar";
import { FloatingDashboardSidebar } from "./FloatingDashboardSidebar";
import { DashboardTitleRenderer } from "./DashboardDefaultTitle";

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

    // Get theme and media query for responsive design
    const theme = useTheme();
    const {
        sidebarState,
        setSidebarState,
        slots,
        setHeaderHeight,
        headerHeight,
        setSideBarToggleWidth,
    } = useDashboardLayout();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Track previous sidebar state for desktop view
    const [previousDesktopState, setPreviousDesktopState] =
        useState(sidebarState);

    // Handle sidebar state based on screen size
    useEffect(() => {
        if (isMobile) {
            // Store current state before switching to mobile
            if (!isMobile) {
                setPreviousDesktopState(sidebarState);
            }
            setSidebarState("collapsed");
        } else {
            // Restore previous state when returning to desktop
            setSidebarState(previousDesktopState);
        }
    }, [isMobile]); // Remove sidebarState from dependencies to prevent loops

    // Handle sidebar visibility based on state
    const isCollapsedSidebarVisible = useMemo(
        () => !isMobile && sidebarState === "collapsed",
        [isMobile, sidebarState],
    );
    const isFullSidebarVisible = useMemo(
        () => !isMobile && sidebarState === "expanded",
        [isMobile, sidebarState],
    );
    const isFloatingSidebarVisible = useMemo(
        () => isMobile && sidebarState === "expanded",
        [isMobile, sidebarState],
    );

    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef && headerRef.current) {
                const height = headerRef.current.getBoundingClientRect().height;
                setHeaderHeight(height);
            }
        };

        const updateSideBarToggleWidth = () => {
            if (sideBarToggleRef && sideBarToggleRef.current) {
                const width =
                    sideBarToggleRef.current.getBoundingClientRect().width;
                setSideBarToggleWidth(width);
            }
        };

        // Update header height initially and on window resize
        updateHeaderHeight();
        updateSideBarToggleWidth();
        window.addEventListener("resize", updateHeaderHeight);
        window.addEventListener("resize", updateSideBarToggleWidth);

        return () => {
            window.removeEventListener("resize", updateHeaderHeight);
            window.removeEventListener("resize", updateSideBarToggleWidth);
        };
    }, [headerRef, sideBarToggleRef]);

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
                }}
            >
                {/* sidebar toggle */}
                <ToggleSideBarButton ref={sideBarToggleRef} />

                {/* title */}
                <DashboardTitleRenderer ref={titleRef} />

                {/* middle actions */}
                <Box ref={middleActionsRef} sx={{ ml: 2, flex: 1 }}>
                    {slots.middleActions}
                </Box>

                {/* end actions */}
                <Box ref={endActionsRef}></Box>
            </Box>
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                {/* collapsed sidebar */}
                {isCollapsedSidebarVisible && (
                    <Box
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
                    }}
                >
                    {children}
                </Box>
            </Box>

            {/* floating sidebar for mobile */}
            <FloatingDashboardSidebar
                open={isFloatingSidebarVisible}
                onClose={handleFloatingSidebarClose}
                headerHeight={headerHeight}
            />
        </Box>
    );
};

export default DashboardLayout;
