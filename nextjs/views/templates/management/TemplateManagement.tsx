"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Box, useTheme,  Fade, IconButton } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
    useTemplateManagement,
    TemplateManagementTabType,
} from "@/contexts/template/TemplateManagementContext";
import BasicInfoTab from "./BasicInfoTab";
import RecipientsTab from "./recipients/RecipientsTab";
import PreviewTab from "./tabs/PreviewTab";
import { TemplateRecipientsProvider } from "@/contexts/template/TemplateRecipientsContext";
import { useState, useEffect } from "react";
import EditorTab from "./editor/EditorTab";
import ManagementHeader from "./ManagementHeader";
import TemplateVariableManagement from "./variables/TemplateVariableManagement";
import { TemplateVariableManagementProvider } from "@/contexts/templateVariable/TemplateVariableManagementContext";

const handleTabError = (
    error: any,
    tab: TemplateManagementTabType,
    setTabError: (
        tab: TemplateManagementTabType,
        error: { message: string },
    ) => void,
) => {
    if (error.response?.status === 403) {
        setTabError(tab, { message: "Access denied to this tab" });
        return;
    }

    setTabError(tab, {
        message:
            error.response?.data?.message ??
            "An error occurred loading this tab",
    });
};

// Helper function to convert index to tab value
const indexToTab = (index: number): TemplateManagementTabType => {
    const tabs: TemplateManagementTabType[] = [
        "basic",
        "variables",
        "recipients",
        "editor",
        "preview",
    ];
    return tabs[index];
};

const TemplateManagement: React.FC = () => {
    const theme = useTheme();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { template, activeTab, setActiveTab, setTabError } =
        useTemplateManagement();
    const [showScrollTop, setShowScrollTop] = useState(false);

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
            setActiveTab(newValue);
            const params = new URLSearchParams(searchParams.toString());
            params.set('tab', newValue);
            router.push(`?${params.toString()}`);
        } catch (error) {
            handleTabError(error, newValue, setTabError);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!template) {
        console.error("Template not found");
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
                            <Box
                                sx={{
                                    p: 2,
                                    width: "100%",
                                    height: "100%",

                                    borderColor: "red",
                                }}
                                id="RecipientsTab-management"
                            >
                                {/* Variables List will go here */}
                                <h1>RecipientsTab</h1>
                            </Box>
                            {/* <RecipientsTab /> */}
                        </TabPanel>
                        <TabPanel value="editor">
                            <EditorTab />
                        </TabPanel>
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
