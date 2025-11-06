"use client";

import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useAppTranslation } from "@/client/locale";
import { TabContext } from "@mui/lab";
import { TabList as MuiTabList } from "@mui/lab";
import { Tab } from "@mui/material";

interface RecipientSubTabListProps {
  onChange: (event: React.SyntheticEvent, newValue: "manage" | "add") => void;
  activeTab: "manage" | "add";
}

export const RecipientSubTabList: React.FC<RecipientSubTabListProps> = ({ onChange, activeTab }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { recipientTranslations: strings } = useAppTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (tab: "manage" | "add") => {
    onChange({} as React.SyntheticEvent, tab);
    handleMenuClose();
  };

  if (isMobile) {
    return (
      <Box>
        <Button
          onClick={handleMenuClick}
          endIcon={<KeyboardArrowDown />}
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "text.primary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          {activeTab === "manage" ? strings.tabManageAdded : strings.tabAddNew}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick("manage")} selected={activeTab === "manage"}>
            {strings.tabManageAdded}
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("add")} selected={activeTab === "add"}>
            {strings.tabAddNew}
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <TabContext value={activeTab}>
      <MuiTabList
        onChange={onChange}
        aria-label="recipient sub-tabs"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTabs-scrollButtons": {
            color: "text.secondary",
          },
          "& .MuiTab-root": {
            minHeight: 40,
            fontSize: "0.875rem",
            px: 2,
            "&.Mui-selected": {
              backgroundColor: "action.hover",
              color: "primary.main",
              fontWeight: 600,
            },
            "&:hover": {
              backgroundColor: "action.hover",
            },
            transition: "all 0.2s ease-in-out",
          },
        }}
        id="recipient-sub-tabs"
        slotProps={{
          indicator: {
            sx: {
              backgroundColor: "primary.main",
              height: 2,
              borderRadius: "2px 2px 0 0",
            },
          },
        }}
      >
        <Tab label={strings.tabManageAdded} value="manage" />
        <Tab label={strings.tabAddNew} value="add" />
      </MuiTabList>
    </TabContext>
  );
};
