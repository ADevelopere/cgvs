"use client";

import React, { useEffect } from "react";
import {
    Tab,
    useMediaQuery,
    useTheme,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import { TabList as MuiTabList, TabContext } from "@mui/lab";
import { TemplateManagementTabType } from "@/contexts/template/TemplateManagementContext";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import useAppTranslation from "@/locale/useAppTranslation";
interface TabListProps {
    onChange: (
        event: React.SyntheticEvent,
        newValue: TemplateManagementTabType,
    ) => void;
    activeTab: TemplateManagementTabType;
}

const ManagementTabList: React.FC<TabListProps> = ({ onChange, activeTab }) => {
    const strings = useAppTranslation("templateCategoryTranslations");

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "background.paper",
                borderBottom: 1,
                borderColor: "divider",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 2, sm: 3 },
            }}
        >
            <TabContext value={activeTab}>
                <MuiTabList
                    onChange={onChange}
                    aria-label="template management tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        "& .MuiTabs-scrollButtons": {
                            color: "text.secondary",
                        },
                        "& .MuiTab-root": {
                            minHeight: { xs: 48, sm: 56 },
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            px: { xs: 1, sm: 2 },
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
                    id="template-management-tabs"
                    slotProps={{
                        indicator: {
                            sx: {
                                backgroundColor: "primary.main",
                                height: 3,
                                borderRadius: "3px 3px 0 0",
                            },
                        },
                        list: {
                            sx: {
                                display: "flex",
                                justifyContent: "center",
                                gap: 0,
                            },
                        },
                    }}
                >
                    <Tab label={strings.tabBasicInfo} value="basic" />
                    <Tab label={strings.tabVariables} value="variables" />
                    <Tab label={strings.tabRecipients} value="recipients" />
                    <Tab label={strings.tabEditor} value="editor" />
                    <Tab label={strings.tabPreview} value="preview" />
                </MuiTabList>
            </TabContext>
        </Box>
    );
};

interface ManagementHeaderInernalProps {
    templateName: string;
}

const ManagementHeaderInernal: React.FC<ManagementHeaderInernalProps> = ({
    templateName,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { sm: "column", md: "row" },
                gap: 1,
                alignItems: "center",
                justifyContent: { sm: "center", md: "flex-start" },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: { sm: "center", md: "flex-start" },
                    flexGrow: 1,
                }}
            >
                <IconButton
                    size="small"
                    sx={{
                        color: "secondary.main",
                        "&:hover": {
                            backgroundColor: "action.hover",
                            transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease-in-out",
                    }}
                >
                    <PrecisionManufacturingIcon />
                </IconButton>

                <Typography
                    variant={isMobile ? "h6" : "h5"}
                    component="h1"
                    sx={{
                        fontSize: {
                            xs: "0.6rem",
                            sm: "0.8rem",
                            md: "1rem",
                        },
                        fontWeight: 600,
                        color: "secondary.main",
                    }}
                >
                    Managing template:
                </Typography>
                <Typography
                    variant={isMobile ? "h6" : "h5"}
                    component="h1"
                    sx={{
                        fontSize: {
                            xs: "0.6rem",
                            sm: "0.8rem",
                            md: "1rem",
                        },
                        fontWeight: 600,
                        color: "primary.main",
                    }}
                >
                    {templateName}
                </Typography>
            </Box>
        </Box>
    );
};

type ManagementHeaderProps = ManagementHeaderInernalProps & TabListProps;

const ManagementHeader: React.FC<ManagementHeaderProps> = ({
    onChange,
    activeTab,
    templateName,
}) => {
    const { setDashboardSlot } = useDashboardLayout();

    useEffect(() => {
        // setDashboardSlot(
        //     "middleActions",
        //     <ManagementTabList onChange={onChange} activeTab={activeTab} />,
        // );

        setDashboardSlot(
            "titleRenderer",
            <ManagementHeaderInernal templateName={templateName} />,
        );

        return () => {
            setDashboardSlot("middleActions", null);
            setDashboardSlot("titleRenderer", null);
        };
    }, [setDashboardSlot, templateName]);

    return <ManagementTabList onChange={onChange} activeTab={activeTab} />;
};

export default ManagementHeader;
