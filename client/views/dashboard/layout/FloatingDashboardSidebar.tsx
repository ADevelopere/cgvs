import React from "react";
import { Box, Drawer, useTheme } from "@mui/material";
import { ExpandedDashboardSidebar } from "./ExpandedDashboardSidebar";

interface FloatingDashboardSidebarProps {
  open: boolean;
  onClose: () => void;
  headerHeight: number;
}

export const FloatingDashboardSidebar: React.FC<FloatingDashboardSidebarProps> = ({ open, onClose, headerHeight }) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="temporary"
      anchor={"left"}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: false,
      }}
      slotProps={{
        transition: {},
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
