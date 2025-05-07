import React, { useEffect, useState } from "react";
import { Alert, Box, Button, IconButton, Tab, Tooltip } from "@mui/material";
import { useAppBarHeight } from "@/hooks/useAppBarHeight";
import useAppTranslation from "@/locale/useAppTranslation";
import {
    TemplateCategoryManagementProvider,
    useTemplateCategoryManagement,
} from "@/contexts/template/TemplateCategoryManagementContext";
import TemplateCategoryManagementCategoryPane from "./CategoryPane";
import TemplateCategoryManagementTemplatePane from "./TemplatePane";
import { useAppTheme } from "@/contexts/ThemeContext";
import SplitPane from "@/components/splitPane/SplitPane";
import { PanelLeft, PanelRight } from "lucide-react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DeletionTemplatesCategory from "./DeletionTemplatesCategory";

export type TemplateCategoryManagementTabType = "all" | "deleted";

// Helper function to convert tab value to index
const tabToIndex = (tab: TemplateCategoryManagementTabType): number => {
    const tabs: TemplateCategoryManagementTabType[] = ["all", "deleted"];
    return tabs.indexOf(tab);
};

// Helper function to convert index to tab value
const indexToTab = (index: number): TemplateCategoryManagementTabType => {
    const tabs: TemplateCategoryManagementTabType[] = ["all", "deleted"];
    return tabs[index] as TemplateCategoryManagementTabType;
};

const This: React.FC = () => {
    const strings = useAppTranslation("templateCategoryTranslations");

    const { theme } = useAppTheme();
    const [firstPaneVisible, setFirstPaneVisible] = useState<boolean>(true);
    const [secondPaneVisible, setSecondPaneVisible] = useState<boolean>(true);

    const handleFirstPaneVisibility = () => {
        setFirstPaneVisible(!firstPaneVisible);
    };

    const handleSecondPaneVisibility = () => {
        setSecondPaneVisible(!secondPaneVisible);
    };

    const [activeTab, setActiveTab] =
        useState<TemplateCategoryManagementTabType>("all");

    const { fetchCategories, fetchError, currentCategory } =
        useTemplateCategoryManagement();

    const handleTabChange = async (
        _: React.SyntheticEvent,
        newValue: TemplateCategoryManagementTabType,
    ) => {
        setActiveTab(newValue);
    };

    const fetchErrorView = fetchError && (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
            }}
        >
            <Alert severity="error">
                {strings.errorLoadingCategories}: {fetchError.message}
            </Alert>
            <Button
                onClick={fetchCategories}
                variant="contained"
                color="primary"
                style={{ marginTop: "16px" }}
            >
                {strings.retry}
            </Button>
        </div>
    );

    return (
        <>
            {fetchErrorView ? (
                { fetchErrorView }
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <TabContext value={activeTab}>
                        {/* controllers */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                borderBottom: "1px solid",
                                borderColor: theme.palette.divider,
                                mb: 2,
                            }}
                        >
                            <TabList
                                onChange={handleTabChange}
                                scrollButtons="auto"
                                allowScrollButtonsMobile
                                sx={{
                                    "& .MuiTabs-scrollButtons": {
                                        color: "text.secondary",
                                    },
                                    "& .MuiTab-root": {
                                        minHeight: { xs: 48, sm: 56 },
                                        fontSize: {
                                            xs: "1rem",
                                            sm: "1.25rem",
                                        },
                                        px: { xs: 1, sm: 2 },
                                        "&.Mui-selected": {
                                            color: "primary.main",
                                            fontWeight: 600,
                                        },
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                        },
                                        transition: "all 0.2s ease-in-out",
                                    },
                                }}
                            >
                                <Tab
                                    label={strings.templateCategoriesManagement}
                                    value="all"
                                />
                                <Tab label={"deleted"} value="deleted" />
                            </TabList>

                            <Box sx={{ flex: 1 }} />
                            {activeTab === "all" && (
                                <Box>
                                    {/* first pane visibility button*/}
                                    <Tooltip
                                        title={strings.toggleCategoriesPane}
                                    >
                                        <span>
                                            <IconButton
                                                onClick={
                                                    handleFirstPaneVisibility
                                                }
                                                disabled={
                                                    !currentCategory ||
                                                    !secondPaneVisible
                                                }
                                            >
                                                <PanelRight />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    {/* second pane visibility button */}
                                    <Tooltip
                                        title={strings.toggleTemplatesPane}
                                    >
                                        <span>
                                            <IconButton
                                                onClick={
                                                    handleSecondPaneVisibility
                                                }
                                                disabled={!firstPaneVisible}
                                            >
                                                <PanelLeft />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Box>
                            )}
                        </Box>

                        <TabPanel
                            value="all"
                            sx={{
                                flex: 1,
                                position: "relative",
                                minHeight: `calc(100vh -256px)`,
                            }}
                        >
                            <SplitPane
                                orientation="vertical"
                                firstPane={{
                                    visible: firstPaneVisible,
                                    minRatio: 0.3,
                                }}
                                secondPane={{
                                    visible: secondPaneVisible,
                                    minRatio: 0.3,
                                }}
                                resizerProps={{
                                    style: {
                                        cursor: "col-resize",
                                    },
                                }}
                            >
                                <TemplateCategoryManagementCategoryPane />
                                <TemplateCategoryManagementTemplatePane />
                            </SplitPane>
                        </TabPanel>
                        <TabPanel value="deleted">
                            <DeletionTemplatesCategory />
                        </TabPanel>
                    </TabContext>
                </Box>
            )}
        </>
    );
};

const TemplateCategoryManagement: React.FC = () => {
    const appBarHeight = useAppBarHeight();

    // todo: remove minWidth after fixing the layout
    useEffect(() => {
        const appBar = document.getElementById("admin-header-appbar");
        if (appBar) {
            appBar.style.minWidth = "1024px";
        }
    }, []);

    return (
        <Box
            sx={{
                top: `${appBarHeight}px`,
                height: `calc(100vh - ${appBarHeight}px - 48px)`,
                display: "flex",
                flexDirection: "column",
                p: 3,
            }}
        >
            <This />
        </Box>
    );
};

export default TemplateCategoryManagement;
