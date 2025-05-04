import React, { useEffect, useState } from "react";
import { Box, Drawer, useTheme } from "@mui/material";
import { ExpandedDashboardSidebar } from "./ExpandedDashboardSidebar";

interface FloatingDashboardSidebarProps {
    open: boolean;
    onClose: () => void;
    headerRef: React.RefObject<HTMLDivElement | null>;
}

export const FloatingDashboardSidebar: React.FC<FloatingDashboardSidebarProps> = ({
    open,
    onClose,
    headerRef
}) => {
    const theme = useTheme();
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef && headerRef.current) {
                const height = headerRef.current.getBoundingClientRect().height;
                setHeaderHeight(height);
            }
        };

        // Update header height initially and on window resize
        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);

        return () => {
            window.removeEventListener('resize', updateHeaderHeight);
        };
    }, [headerRef]);

    return (
        <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true, // Better mobile performance
            }}
            sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: 280,
                    backgroundColor: theme.palette.background.paper,
                    top: `${headerHeight}px`,
                    height: `calc(100% - ${headerHeight}px)`,
                },
            }}
        >
            <Box sx={{ height: "100%" }}>
                <ExpandedDashboardSidebar />
            </Box>
        </Drawer>
    );
};

export default FloatingDashboardSidebar;
