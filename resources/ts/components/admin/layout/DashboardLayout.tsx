import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";

const DashboardLayout: React.FC = () => {
    const [sideBarToggleRef, setSideBarToggleRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);
    const [brandingRef, setBrandingRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);
    const [middleActionsRef, setMiddleActionsRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);
    const [endActionsRef, setEndActionsRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);
    const [collapsedSidebarRef, setCollapsedSidebarRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);
    const [mainContentRef, setMainContentRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);
    const [floatingSidebarRef, setFloatingSidebarRef] =
        useState<React.RefObject<HTMLDivElement> | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [showFullSidebar, setShowFullSidebar] = useState(false);

    return (
        <Box>
            {/* header */}
            <Box>
                {/* sidebar toggle */}
                <Box ref={sideBarToggleRef}></Box>

                {/* branding */}
                <Box ref={brandingRef}></Box>

                {/* middle actions */}
                <Box ref={middleActionsRef}></Box>

                {/* end actions */}
                <Box ref={endActionsRef}></Box>
            </Box>
            <Box>
                {/* collapsed sidebar */}
                {!isMobile && showFullSidebar && (
                    <Box ref={collapsedSidebarRef}></Box>
                )}

                {/* main content */}
                <Box ref={mainContentRef}></Box>
            </Box>

            {/* floatin full sidebar */}
            {isMobile && showFullSidebar && (
                <Box ref={floatingSidebarRef}></Box>
            )}
        </Box>
    );
};

export default DashboardLayout;
