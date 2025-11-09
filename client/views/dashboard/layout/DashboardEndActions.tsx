"use client";

import React, { useState } from "react";
import { Box, IconButton, Popover, Tooltip, useTheme } from "@mui/material";
import { Tune } from "@mui/icons-material";
import { UserMenu, LanguageSwitcher, ThemeSwitcher, ConnectivityStatus } from "@/client/components";

export default function DashboardEndActions() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const menuBgColor = theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100];
  const iconColor = theme.palette.primary.main;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        gap: { xs: 0.5, sm: 1 },
        paddingInlineEnd: { xs: 1, sm: 2 },
        flexShrink: 0,
      }}
    >
      {/* Mobile: Show menu button */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: 0.5 }}>
        <Tooltip title="Settings">
          <IconButton onClick={handleMenuOpen} color="inherit" size="small">
            <Tune />
          </IconButton>
        </Tooltip>
        <UserMenu />
      </Box>

      {/* Desktop: Show all icons */}
      <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
        <ConnectivityStatus />
        <LanguageSwitcher />
        <ThemeSwitcher />
        <UserMenu />
      </Box>

      {/* Mobile menu popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              boxShadow: "none",
              border: "none",
              bgcolor: "transparent",
              backgroundImage: "none",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            p: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: menuBgColor,
              boxShadow: 1,
            }}
          >
            <ConnectivityStatus />
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: menuBgColor,
              boxShadow: 1,
            }}
          >
            <LanguageSwitcher color={iconColor} />
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: menuBgColor,
              boxShadow: 1,
            }}
          >
            <ThemeSwitcher color={iconColor} />
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
