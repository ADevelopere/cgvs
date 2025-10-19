"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";

const ToggleSideBarButton: React.FC<{
  open?: boolean;
  toggleSidebar: () => void;
  dashboardsidebarState: string;
  zIndex: number;
  isMobile: boolean;
  title: string;
}> = ({
  open,
  toggleSidebar,
  dashboardsidebarState,
  isMobile,
  zIndex,
  title,
}) => {
  if (dashboardsidebarState === "expanded" && isMobile) {
    return null;
  }
  return (
    <Box
      sx={{
        width: { xs: 48, sm: 72 },
        display: "flex",
        justifyContent: "center",
        position: "fixed",
        zIndex: zIndex,
        minHeight: 48,
        alignItems: "center",
      }}
    >
      <Tooltip title={title} placement="right">
        <IconButton
          onClick={toggleSidebar}
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          sx={{
            transition: "transform 0.3s ease-in-out",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ToggleSideBarButton;
