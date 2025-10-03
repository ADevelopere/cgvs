"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Box, useTheme, Fade, IconButton } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
    useTemplateManagement,
    TemplateManagementTabType,
} from "@/client/contexts/template/TemplateManagementContext";
import BasicInfoTab from "./BasicInfoTab";
// import RecipientsTab from "./recipients/RecipientsTab";
// import PreviewTab from "./tabs/PreviewTab";
// import { TemplateRecipientsProvider } from "@/contexts/template/TemplateRecipientsContext";
// import EditorTab from "./editor/EditorTab";
import { useState, useEffect } from "react";
import ManagementHeader from "./ManagementHeader";
import TemplateVariableManagement from "./variables/TemplateVariableManagement";
import { TemplateVariableManagementProvider } from "@/client/contexts/templateVariable/TemplateVariableManagementContext";
import { useDashboardLayout } from "@/client/contexts/DashboardLayoutContext";
import { NavigationPageItem } from "@/client/contexts/adminLayout.types";
import RecipientTab from "./recipient/RecipientTab";

const TemplateManagement: React.FC = () => {
    const theme = useTheme();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { template, activeTab, changeTab, setTabError } =
        useTemplateManagement();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const { setNavigation } = useDashboardLayout();

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(Boolean(window.scrollY > 300));
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleTabChange = async (
        _: React.SyntheticEvent,
        newValue: TemplateManagementTabType,
    ) => {
        try {
            changeTab(newValue);
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", newValue);

            setNavigation((prevNav) => {
                if (!prevNav) return prevNav;
                return prevNav.map((item) => {
                    if ("id" in item && item.id === "templates") {
                        return {
                            ...item,
                            segment: `admin/templates/${template?.id}/manage?${params.toString()}`,
                        } as NavigationPageItem;
                    }
                    return item;
                });
            });

            router.push(`?${params.toString()}`);
        } catch {
            setTabError(newValue, {
                message: "An error occurred loading this tab",
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!template) {
        return null;
    }

    return (
        <Box id="template-management" sx={{ width: "100%" }}>
            <TabContext value={activeTab}>
                {/* Header */}
                <ManagementHeader
                    onChange={handleTabChange}
                    activeTab={activeTab}
                    templateName={template?.name ?? ""}
                />

                {/* Tabs */}
                <Box
                    sx={{
                        // mt: { xs: 2, sm: 3 },
                        "& .MuiTabPanel-root": {
                            // p: { xs: 1, sm: 2, md: 3 },
                        },
                    }}
                >
                    <TemplateVariableManagementProvider
                        templateId={template?.id}
                    >
                        {/* <TemplateRecipientsProvider> */}
                        <TabPanel value="basic">
                            <BasicInfoTab />
                        </TabPanel>
                        <TabPanel value="variables">
                            <TemplateVariableManagement />
                        </TabPanel>
                        <TabPanel value="recipients">
                            <RecipientTab />
                            {/* <RecipientsTab /> */}
                        </TabPanel>
                        {/* <TabPanel value="editor">
                            <EditorTab />
                        </TabPanel> */}
                        <TabPanel value="preview">
                            <Box
                                sx={{
                                    p: 2,
                                    width: "100%",
                                    height: "100%",

                                    borderColor: "red",
                                }}
                                id="template-variable-management"
                            >
                                {/* PreviewTab will go here */}
                                <h1>PreviewTab</h1>
                            </Box>
                            {/* <PreviewTab /> */}
                        </TabPanel>
                        {/* </TemplateRecipientsProvider> */}
                    </TemplateVariableManagementProvider>
                </Box>
            </TabContext>

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
        </Box>
    );
};

export default TemplateManagement;
