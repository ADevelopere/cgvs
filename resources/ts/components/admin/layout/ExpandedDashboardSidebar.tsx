import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
    Theme,
    SxProps,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { NavigationItem, NavigationPageItem } from "./adminLayout.types";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";

const NavItem: React.FC<{
    item: NavigationPageItem;
    level: number;
    pathname: string;
}> = ({ item, level, pathname }) => {
    const { theme } = useAppTheme();
    const { isPathActive } = useNavigation();
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
                <ListItemButton
                    component={!hasChildren ? NavLink : "div"}
                    to={!hasChildren ? linkPath : undefined}
                    // @ts-ignore - NavLink specific prop `end` might not be recognized on 'div'
                    end={!hasChildren} // Match exact path for NavLink active state
                    selected={itemIsActive} // Apply selected state based on active status
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
                        pl: theme.spacing(2 + level * 2), // Indentation based on level
                        marginBottom: theme.spacing(0.5), // Space between items
                        "&.Mui-selected": {
                            color: theme.palette.primary.main,
                            backgroundColor: theme.palette.action.selected,
                            fontWeight: "fontWeightBold",
                            "& .MuiListItemIcon-root": {
                                color: theme.palette.primary.main,
                            },
                            "&:hover": {
                                backgroundColor: theme.palette.action.hover, // Keep hover consistent
                            },
                        },
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}
                    onClick={handleClick}
                    style={!hasChildren ? navLinkStyle : {}} // Apply style only for NavLink
                >
                    {item.icon && (
                        <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                            {item.icon}
                        </ListItemIcon>
                    )}
                    <ListItemText
                        primary={item.title}
                        // Use slotProps instead of deprecated primaryTypographyProps
                        slotProps={{
                            primary: {
                                sx: {
                                    fontSize: "0.875rem",
                                    fontWeight: itemIsActive
                                        ? "fontWeightMedium"
                                        : "fontWeightRegular",
                                },
                            },
                        }}
                    />
                    {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
            </ListItem>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {/* Render children recursively */}
                        {item.children?.map((child, index) => (
                            <RenderNavItem
                                key={`${item.segment || item.title}-${index}`} // Ensure unique key
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
                    pl: theme.spacing(2 + level * 2),
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

    return (
        <NavItem
            item={item as NavigationPageItem}
            level={level}
            pathname={pathname}
        />
    );
};

export const ExpandedDashboardSidebar: React.FC = () => {
    const { theme } = useAppTheme();
    const location = useLocation();
    const { navigation } = useDashboardLayout();

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
                        key={index} // Use index as key for top-level items
                        item={item}
                        level={0} // Top-level items are at level 0
                        pathname={location.pathname}
                    />
                ))}
            </List>
        </Box>
    );
};

export default ExpandedDashboardSidebar;
