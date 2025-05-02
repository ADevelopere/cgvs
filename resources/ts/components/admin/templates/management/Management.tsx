import { useSearchParams } from "react-router-dom";
import {
    Box,
    Tab,
    Paper,
    Typography,
    Stack,
    CircularProgress,
    Container,
    useTheme,
    useMediaQuery,
    Fade,
    IconButton,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import SwipeableViews from "react-swipeable-views";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
    useTemplateManagement,
    TabType,
} from "@/contexts/template/TemplateManagementContext";
import BasicInfoTab from "./BasicInfoTab";
import VariablesTab from "./variables/VariablesTab";
import EditorTab from "./tabs/EditorTab";
import RecipientsTab from "./recipients/RecipientsTab";
import PreviewTab from "./tabs/PreviewTab";
import { Template } from "@/contexts/template/template.types";
import { TemplateVariablesProvider } from "@/contexts/template/TemplateVariablesContext";
import { TemplateRecipientsProvider } from "@/contexts/template/TemplateRecipientsContext";
import { useState, useEffect } from "react";

const template: Template = {
    id: 1,
    name: "",
    is_active: false,
    created_at: "",
    updated_at: "",
};

const handleTabError = (
    error: any,
    tab: TabType,
    setTabError: (tab: TabType, error: { message: string }) => void
) => {
    if (error.response?.status === 403) {
        setTabError(tab, { message: "Access denied to this tab" });
        return;
    }

    setTabError(tab, {
        message:
            error.response?.data?.message ||
            "An error occurred loading this tab",
    });
};

// Helper function to convert tab value to index
const tabToIndex = (tab: TabType): number => {
    const tabs: TabType[] = [
        "basic",
        "variables",
        "recipients",
        "editor",
        "preview",
    ];
    return tabs.indexOf(tab);
};

// Helper function to convert index to tab value
const indexToTab = (index: number): TabType => {
    const tabs: TabType[] = [
        "basic",
        "variables",
        "recipients",
        "editor",
        "preview",
    ];
    return tabs[index] as TabType;
};

const Management: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [_, setSearchParams] = useSearchParams();
    const { activeTab, setTabError } = useTemplateManagement();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const checkTouchSupport = () => {
            // More comprehensive check for dev tools emulation
            const isEmulated = (
                /Mozilla\/5.0.*Mobile/.test(navigator.userAgent) || // Chrome/Edge dev tools
                /iPhone|iPad|iPod|Android/.test(navigator.userAgent) || // Device check
                (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) // Touch points in dev tools
            );

            // Check actual touch support only if not emulated
            const hasTouchSupport = !isEmulated && Boolean(
                'ontouchstart' in window ||
                // @ts-ignore - MediaQueryList exists in modern browsers
                window.matchMedia('(any-pointer: coarse)').matches
            );

            setIsTouchDevice(Boolean(hasTouchSupport || isEmulated));
        };

        checkTouchSupport();

        // Recheck when device orientation changes (useful for dev tools toggling)
        window.addEventListener("orientationchange", checkTouchSupport);
        return () =>
            window.removeEventListener("orientationchange", checkTouchSupport);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(Boolean(window.scrollY > 300));
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleTabChange = async (
        _: React.SyntheticEvent,
        newValue: TabType
    ) => {
        try {
            setSearchParams({ tab: newValue });
        } catch (error) {
            handleTabError(error, newValue, setTabError);
        }
    };

    const handleChangeIndex = (index: number) => {
        const newTab = indexToTab(index);
        setSearchParams({ tab: newTab });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Container
            maxWidth={"xl"}
            sx={{
                mt: { xs: 2, sm: 3, md: 4 },
                mb: { xs: 2, sm: 3, md: 4 },
                maxWidth: { sm: "sm", md: "1200px" },
                mx: "auto",
                position: "relative",
                px: 0,
            }}
            id="template-management"
        >
            <Box sx={{ width: "100%" }}>
                {/* Header */}
                <Box
                    sx={{
                        mb: { xs: 1, sm: 1.5, md: 2 },
                        position: "sticky",
                        top: 0,
                        backgroundColor: "background.default",
                        zIndex: theme.zIndex.appBar,
                        py: 1,
                    }}
                >
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: "1.1rem",
                                sm: "1.3rem",
                                md: "1.5rem",
                            },
                        }}
                    >
                        Template Management
                    </Typography>
                </Box>
                {/* Tabs */}
                <TabContext value={activeTab}>
                    <Paper
                        elevation={2}
                        sx={{
                            backgroundColor: "background.paper",
                            overflowX: "auto",
                            borderRadius: { xs: 0, sm: 1 },
                        }}
                    >
                        <TabList
                            onChange={handleTabChange}
                            aria-label="template management tabs"
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{
                                minHeight: { xs: 48, sm: 56 },
                                "& .MuiTab-root": {
                                    minHeight: { xs: 48, sm: 56 },
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    px: { xs: 2, sm: 3 },
                                    minWidth: { xs: "auto", sm: 160 },
                                    "&.Mui-selected": {
                                        fontWeight: "bold",
                                    },
                                },
                            }}
                        >
                            <Tab label="Basic Info" value="basic" />
                            <Tab label="Variables" value="variables" />
                            <Tab label="Recipients" value="recipients" />
                            <Tab label="Editor" value="editor" />
                            <Tab label="Preview" value="preview" />
                        </TabList>
                    </Paper>

                    <Box
                        sx={{
                            mt: { xs: 2, sm: 3 },
                            "& .MuiTabPanel-root": {
                                p: { xs: 1, sm: 2, md: 3 },
                            },
                        }}
                    >
                        <TemplateVariablesProvider>
                            <TemplateRecipientsProvider>
                                <SwipeableViews
                                    axis={
                                        theme.direction === "rtl"
                                            ? "x-reverse"
                                            : "x"
                                    }
                                    index={tabToIndex(activeTab)}
                                    onChangeIndex={handleChangeIndex}
                                    enableMouseEvents={isTouchDevice}
                                    disabled={!isTouchDevice}
                                    style={{ overflow: "hidden" }}
                                >
                                    <TabPanel value="basic">
                                        <BasicInfoTab />
                                    </TabPanel>
                                    <TabPanel value="variables">
                                        <VariablesTab template={template} />
                                    </TabPanel>
                                    <TabPanel value="recipients">
                                        <RecipientsTab />
                                    </TabPanel>
                                    <TabPanel value="editor">
                                        <EditorTab />
                                    </TabPanel>
                                    <TabPanel value="preview">
                                        <PreviewTab />
                                    </TabPanel>
                                </SwipeableViews>
                            </TemplateRecipientsProvider>
                        </TemplateVariablesProvider>
                    </Box>
                </TabContext>
            </Box>

            {/* Scroll to top button */}
            <Fade in={showScrollTop}>
                <IconButton
                    onClick={scrollToTop}
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": {
                            bgcolor: "primary.dark",
                        },
                        zIndex: theme.zIndex.speedDial,
                    }}
                >
                    <KeyboardArrowUpIcon />
                </IconButton>
            </Fade>
        </Container>
    );
};

export default Management;
