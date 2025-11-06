"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useAppTheme } from "@/client/contexts/ThemeContext";

const ToggleSideBarButton: React.FC<{
  open?: boolean;
  toggleSidebar: () => void;
  dashboardsidebarState: string;
  zIndex: number;
  isMobile: boolean;
  title: string;
}> = ({ open, toggleSidebar, dashboardsidebarState, isMobile, zIndex, title }) => {
  const { isRtl } = useAppTheme();

  if (dashboardsidebarState === "expanded" && isMobile) {
    return null;
  }
  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        ...(isRtl ? { left: 16 } : { right: 16 }),
        zIndex: zIndex,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Tooltip title={title}>
        <IconButton
          onClick={toggleSidebar}
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          sx={{
            backgroundColor: "background.paper",
            boxShadow: 2,
            border: "1px solid",
            borderColor: "divider",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            "&:hover": {
              boxShadow: 4,
              backgroundColor: "background.paper",
            },
          }}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ToggleSideBarButton;
