"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Collapse,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import {
  NavigationItem,
  NavigationPageItem,
} from "../../../contexts/adminLayout.types";
import { useDashboardLayout } from "@/client/contexts/DashboardLayoutContext";

const NavItem: React.FC<{
  item: NavigationPageItem;
  level: number;
  pathname: string;
}> = ({ item, level, pathname }) => {
  const { theme } = useAppTheme();
  const currentPathname = usePathname();

  // Simple isPathActive function
  const isPathActive = (navItem: NavigationPageItem): boolean => {
    const normalizedPathname = currentPathname.replace(/\/$/, "");
    const itemPath =
      navItem.pattern || (navItem.segment ? `/${navItem.segment}` : "");

    if (itemPath) {
      // Direct match
      if (normalizedPathname === itemPath) {
        return true;
      }
      // Check if current path starts with the item path (for nested routes)
      if (normalizedPathname.startsWith(itemPath + "/")) {
        return true;
      }
    }

    // Check children recursively
    if (navItem.children) {
      return navItem.children.some(
        (child) => child.kind === "page" && isPathActive(child),
      );
    }

    return false;
  };

  const hasChildren = item.children && item.children.length > 0;
  // Ensure initiallyOpen is always boolean
  const initiallyOpen = hasChildren ? isPathActive(item) : false;
  const [open, setOpen] = useState<boolean>(initiallyOpen);

  const linkPath = item.pattern || (item.segment ? `/${item.segment}` : "#"); // Fallback to '#' if no path

  const itemIsActive = !hasChildren && isPathActive(item); // Only leaf nodes show direct active state visually

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    }
    // Navigation happens via NavLink for leaf nodes
  };

  const navLinkStyle: React.CSSProperties = {};

  return (
    <>
      <ListItem disablePadding sx={{ width: "100%" }}>
        {!hasChildren ? (
          <ListItemButton
            component={Link}
            href={linkPath}
            selected={itemIsActive}
            sx={{
              p: 0,
              py: 1,
              margin: "0 !important",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: 0.5,
              width: "100%",
              color: theme.palette.text.secondary,
              paddingInlineStart: theme.spacing(2 + level * 2),
              marginBottom: theme.spacing(0.5),
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
            onClick={handleClick}
            style={navLinkStyle}
          >
            {item.icon && (
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.title}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: "0.875rem",
                    fontWeight: itemIsActive
                      ? "fontWeightMedium"
                      : "fontWeightRegular",
                    textAlign: "start",
                  },
                },
              }}
            />
          </ListItemButton>
        ) : (
          <ListItemButton
            component="div"
            selected={false}
            sx={{
              p: 0,
              py: 1,
              margin: "0 !important",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: 0.5,
              width: "100%",
              color: theme.palette.text.secondary,
              paddingInlineStart: theme.spacing(2 + level * 2),
              marginBottom: theme.spacing(0.5),
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
            onClick={handleClick}
          >
            {item.icon && (
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.title}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: "0.875rem",
                    fontWeight: "fontWeightRegular",
                    textAlign: "start",
                  },
                },
              }}
            />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        )}
      </ListItem>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children?.map((child, index) => (
              <RenderNavItem
                key={`${item.segment || item.title}-${index}`}
                item={child}
                level={level + 1}
                pathname={pathname}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

// Helper component to render different navigation item types
const RenderNavItem: React.FC<{
  item: NavigationItem;
  level: number;
  pathname: string;
}> = ({ item, level, pathname }) => {
  const { theme } = useAppTheme();

  if (item.kind === "header") {
    return (
      <ListSubheader
        disableSticky
        disableGutters
        sx={{
          color: theme.palette.text.secondary,
          fontSize: "0.64rem",
          lineHeight: "normal",
          paddingInlineStart: theme.spacing(2 + level * 2),
          py: 1.5,
          textTransform: "uppercase",
        }}
      >
        {item.title}
      </ListSubheader>
    );
  }

  if (item.kind === "divider") {
    return <Divider sx={{ my: 0.5 }} />;
  }

  return <NavItem item={item} level={level} pathname={pathname} />;
};

export const ExpandedDashboardSidebar: React.FC = () => {
  const { theme } = useAppTheme();
  const pathname = usePathname();
  const { navigation, slots } = useDashboardLayout();

  if (slots?.expandedSidebar) {
    return <>{slots.expandedSidebar}</>;
  }

  if (!navigation) {
    return <Box sx={{ width: "100%", height: "100%" }} />;
  }

  return (
    <Box
      sx={{
        width: "100%", // Take full width of its container
        height: "100%", // Take full height
        bgcolor: theme.palette.background.paper,
        overflowY: "auto", // Enable scrolling if content overflows
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <List component="nav" sx={{ p: 0 }}>
        {navigation.map((item, index) => (
          <RenderNavItem
            key={index}
            item={item}
            level={0}
            pathname={pathname}
          />
        ))}
      </List>
    </Box>
  );
};

export default ExpandedDashboardSidebar;
