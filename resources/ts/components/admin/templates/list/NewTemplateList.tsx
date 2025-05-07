import {
    Box,
    Drawer,
    IconButton,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import { TemplateCategory } from "@/graphql/generated/types";
import { Folder, X } from "lucide-react";
import { TreeView } from "@/components/common/TreeView";
import useAppTranslation from "@/locale/useAppTranslation";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { T } from "vitest/dist/chunks/reporters.d.DG9VKi4m.js";
import TemplateList from "./TemplateList";

const drawerWidth = 240;

const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "open" && prop !== "sideBarWidth",
})<{
    open?: boolean;
    sideBarWidth: number;
}>(({ theme, open, sideBarWidth }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(
        theme.direction === "rtl" ? "margin-right" : "margin-left",
        {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
        },
    ),
    ...(theme.direction === "rtl"
        ? {
              marginRight: open
                  ? `${sideBarWidth + drawerWidth}px`
                  : `${sideBarWidth}px`,
          }
        : {
              marginLeft: open
                  ? `${sideBarWidth + drawerWidth}px`
                  : `${sideBarWidth}px`,
          }),
}));

const RenderCategoryItem: React.FC<{
    category: TemplateCategory;
}> = ({ category }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
            }}
        >
            {category.childCategories.length > 0 && <Folder />}
            <Typography>{category.name}</Typography>
        </Box>
    );
};

const NewTemplateList: React.FC = () => {
    const {
        headerHeight,
        sideBarWidth,
        sidebarState: dashboardsidebarState,
    } = useDashboardLayout();
    const strings = useAppTranslation("templateCategoryTranslations");
    const { regularCategories, allTemplates, currentCategory } =
        useTemplateCategoryManagement();
    const [open, setOpen] = useState(true);
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleSidebar = () => {
        setOpen((prev) => !prev);
    };

    const ToggleSideBarButton: React.FC = () => {
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
                    zIndex: theme.zIndex.drawer + 1,
                    minHeight: 48,
                    alignItems: "center",
                }}
            >
                <IconButton
                    onClick={toggleSidebar}
                    edge="start"
                    color="inherit"
                    aria-label="toggle sidebar"
                >
                    {open ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>
        );
    };

    return (
        <Box sx={{display: "flex", flexDirection: "row", height: "100%"}}>
            <ToggleSideBarButton />
            <Main open={open} sideBarWidth={sideBarWidth}>
                <TemplateList
                    templates={currentCategory?.templates || allTemplates}
                />
            </Main>

            {open && (
                <Drawer
                    sx={{
                        position: "fixed",
                        top: `${headerHeight}px`,
                        height: `calc(100% - ${headerHeight}px)`,
                        width: drawerWidth, // The container for the paper
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
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: theme.spacing(0, 1),
                            height: `${headerHeight}px`,
                            paddingInlineStart: 6,
                        }}
                    >
                        <Typography variant="h6" noWrap component="div">
                            {strings.categories}
                        </Typography>
                    </Box>
                    <TreeView
                        items={regularCategories}
                        itemRenderer={(item: TemplateCategory) => (
                            <RenderCategoryItem category={item} />
                        )}
                        childrenKey="childCategories"
                        labelKey="name"
                        noItemsMessage={strings.noCategories}
                        searchText={strings.filter}
                    />
                </Drawer>
            )}
        </Box>
    );
};

export default NewTemplateList;
