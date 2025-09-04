"use client";

import {
    Box,
    Drawer,
    IconButton,
    Paper,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import { TemplateCategory } from "@/graphql/generated/types";
import { Folder } from "lucide-react";
import { TreeView } from "@/components/treeView/TreeView";
import useAppTranslation from "@/locale/useAppTranslation";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import TemplateListContent from "./TemplateListContent";
import SplitPane from "@/components/splitPane/SplitPane";

const drawerWidth = 240;

const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "open" && prop !== "sideBarWidth",
})(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
}));

const ToggleSideBarButton: React.FC<{
    open?: boolean;
    toggleSidebar: () => void;
    dashboardsidebarState: string;
    zIndex: number;
    isMobile: boolean;
}> = ({ open, toggleSidebar, dashboardsidebarState, isMobile, zIndex }) => {
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
        </Box>
    );
};

const RenderCategoryItem: React.FC<{
    category: TemplateCategory;
    onClick: (category: TemplateCategory) => void;
    selected: boolean;
    selectedColor?: string;
}> = ({ category, onClick, selected, selectedColor }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
                backgroundColor: selected ? selectedColor : "inherit",
                px: 0,
                paddingInline: 1,
                borderRadius: 2,
            }}
            onClick={() => {
                onClick(category);
            }}
        >
            {category.childCategories &&
                category.childCategories.length > 0 && <Folder />}
            <Typography
                sx={{
                    minWidth: "max-content",
                }}
            >
                {category.name}
            </Typography>
        </Box>
    );
};

const CategoryTree: React.FC = () => {
    const strings = useAppTranslation("templateCategoryTranslations");
    const theme = useTheme();
    const { regularCategories, currentCategory, trySelectCategory } =
        useTemplateCategoryManagement();
    return (
        <TreeView
            style={{
                display: "flex",
                padding: theme.spacing(0, 1),
                // height: `${headerHeight}px`,
                paddingInlineStart: 6,
                justifyContent: "start",
            }}
            items={regularCategories}
            itemRenderer={({ item, isSelected }) => (
                <RenderCategoryItem
                    category={item}
                    onClick={trySelectCategory}
                    selected={isSelected || currentCategory?.id === item.id}
                    selectedColor={theme.palette.action.focus}
                />
            )}
            childrenKey="childCategories"
            labelKey="name"
            noItemsMessage={strings.noCategories}
            searchText={strings.filter}
            header={strings.categories}
        />
    );
};

const TemplateList: React.FC = () => {
    const { headerHeight, sidebarState: dashboardsidebarState } =
        useDashboardLayout();
    const { allTemplates, currentCategory } = useTemplateCategoryManagement();

    const [open, setOpen] = useState(true);
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleSidebar = () => {
        setOpen((prev) => !prev);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
            <ToggleSideBarButton
                open={open}
                toggleSidebar={toggleSidebar}
                dashboardsidebarState={dashboardsidebarState}
                zIndex={theme.zIndex.drawer + 1}
                isMobile={isMobile}
            />

            {!isMobile && (
                <SplitPane
                    orientation="vertical"
                    firstPane={{
                        visible: open,
                        minRatio: 0.1,
                    }}
                    secondPane={{
                        visible: true,
                        minRatio: 0.5,
                    }}
                    resizerProps={{
                        style: {
                            cursor: "col-resize",
                        },
                    }}
                    storageKey="templateListSplitPane"
                >
                    <Paper
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            padding: 2,
                            justifyContent: "start",
                            alignItems: "start",
                            overflow: "hidden",
                        }}
                    >
                        <CategoryTree />
                    </Paper>
                    <TemplateListContent
                        templates={currentCategory?.templates || allTemplates}
                        style={{
                            paddingInlineStart: open ? 2 : 8,
                            paddingInlineEnd: 2,
                            paddingTop: 2,
                            paddingBottom: 4,
                        }}
                    />
                </SplitPane>
            )}

            {isMobile && (
                <Main>
                    <TemplateListContent
                        templates={currentCategory?.templates || allTemplates}
                        style={{
                            paddingInlineStart: 2,
                        }}
                    />
                </Main>
            )}

            {open && isMobile && (
                <Drawer
                    sx={{
                        position: "fixed",
                        top: `${headerHeight}px`,
                        height: `calc(100% - ${headerHeight}px)`,
                        width: drawerWidth, // The container for the paperTemplateListContainer
                        overflow: "hidden", // This will clip the paper during transition
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            position: "absolute", // Relative to the Drawer root due to variant="persistent"
                            height: "100%", // Fill the Drawer root
                            // variant="persistent" handles transform and transition for open/close
                        },
                    }}
                    variant="persistent"
                    anchor={"left"}
                    open={open}
                >
                    <CategoryTree />
                </Drawer>
            )}
        </Box>
    );
};

export default TemplateList;
