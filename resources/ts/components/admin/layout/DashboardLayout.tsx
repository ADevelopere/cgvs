import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { ToggleSideBarButton } from "./ToggleSideBarButton";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import { CollapsedDashboardSidebar } from "./CollapsedDashboardSidebar";
import { ExpandedDashboardSidebar } from "./ExpandedDashboardSidebar";
import { FloatingDashboardSidebar } from "./FloatingDashboardSidebar";

const DashboardLayout: React.FC = () => {
    // header refs
    const headerRef = React.useRef<HTMLDivElement>(null);
    const [sideBarToggleRef, setSideBarToggleRef] =
        useState<React.RefObject<HTMLButtonElement> | null>(null);
    const [brandingRef, setBrandingRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);
    const [middleActionsRef, setMiddleActionsRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);
    const [endActionsRef, setEndActionsRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { sidebarState, setSidebarState } = useDashboardLayout();

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
                    px: 2,
                    py: 1,
                    borderBottom: 1,
                    borderColor: "divider",
                    gap: 2,
                }}
            >
                {/* sidebar toggle */}
                <ToggleSideBarButton ref={sideBarToggleRef} />

                {/* branding */}
                <Box ref={brandingRef} sx={{ ml: 2 }}></Box>

                {/* middle actions */}
                <Box ref={middleActionsRef} sx={{ ml: 2, flex: 1 }}></Box>

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
                        overflow: "auto",
                        minHeight: 0,
                        p: 3,
                    }}
                ></Box>
            </Box>

            {/* floating sidebar for mobile */}
            <FloatingDashboardSidebar
                open={isFloatingSidebarVisible}
                onClose={handleFloatingSidebarClose}
                headerRef={headerRef}
            />
        </Box>
    );
};

export default DashboardLayout;
