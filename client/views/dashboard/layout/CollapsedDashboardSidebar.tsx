"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  Divider,
  Box,
  Tooltip,
} from "@mui/material";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import { useDashboardLayout } from "./DashboardLayoutContext";
import { NavigationItem, NavigationPageItem } from "./types";
import { isPathActive } from "./utilts";

const NavItem: React.FC<{
  item: NavigationPageItem;
}> = ({ item }) => {
  const { theme } = useAppTheme();
  const currentPathname = usePathname();

  // Use segment directly from navigation (already computed in context)
  const linkPath = React.useMemo(
    () =>
      item.pattern ||
      item.pattern ||
      (item.segment
        ? item.segment.startsWith("/")
          ? item.segment
          : `/${item.segment}`
        : "#"),
    [item]
  );

  const itemIsActive = React.useMemo(
    () => isPathActive(item, currentPathname),
    [item, currentPathname]
  );

  return (
    <ListItem disablePadding sx={{ width: "100%" }}>
      <Tooltip title={item.title || ""} placement="right">
        <ListItemButton
          component={Link}
          href={linkPath}
          selected={itemIsActive}
          sx={{
            p: 0,
            py: 1,
            m: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            width: "100%",
            color: theme.palette.text.secondary,
            "&.Mui-selected": {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.action.selected,
              fontWeight: "fontWeightBold",
              "& .MuiListItemIcon-root": {
                color: theme.palette.primary.main,
              },
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            },
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          {item.icon && (
            <ListItemIcon
              sx={{
                minWidth: "auto",
                color: "inherit",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
          )}
          <Typography
            variant="caption"
            sx={{
              px: 0.5,
              maxWidth: "100%",
              fontSize: "0.625rem",
              lineHeight: 1.2,
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </Typography>
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

// Helper component to render different navigation item types
const RenderNavItem: React.FC<{
  item: NavigationItem;
}> = ({ item }) => {
  // Only render page items and dividers in collapsed mode
  switch (item.kind) {
    case "divider":
      return <Divider sx={{ my: 1 }} />;
    case "page":
    default:
      // Skip rendering if it's not a page item
      if (item.kind === "header") return null;
      return <NavItem item={item} />;
  }
};

export const CollapsedDashboardSidebar: React.FC = () => {
  const { theme } = useAppTheme();
  const pathname = usePathname();
  const { navigation, slots } = useDashboardLayout();

  if (slots?.collapsedSidebar) {
    return <>{slots.collapsedSidebar}</>;
  }

  if (!navigation) {
    return <Box sx={{ width: "100%", height: "100%" }} />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.paper,
        overflowY: "auto",
        borderRight: `1px solid ${theme.palette.divider}`,
        opacity: 1,
        transition: theme.transitions.create("opacity", {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.short,
          delay: 50,
        }),
        animation: "fadeIn 0.25s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <List component="nav" sx={{ width: "100%", p: 0 }}>
        {navigation.map((item, index) => (
          <RenderNavItem key={`index-${index}-path-${pathname}`} item={item} />
        ))}
      </List>
    </Box>
  );
};

export default CollapsedDashboardSidebar;
