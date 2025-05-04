import React from "react";
import {
    Tab,
    Paper,
    useMediaQuery,
    useTheme,
    IconButton,
    Typography,
    Box,
} from "@mui/material";
import { TabList as MuiTabList, TabContext } from "@mui/lab";
import { TabType } from "@/contexts/template/TemplateManagementContext";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface TabListProps {
    onChange: (event: React.SyntheticEvent, newValue: TabType) => void;
}

const ManagementTabList: React.FC<TabListProps> = ({ onChange }) => {
    return (
        <MuiTabList
            onChange={onChange}
            aria-label="template management tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
                width: "100%",
                borderRadius: { xs: 0, sm: 1 },
                "& .MuiTab-root": {
                    minHeight: { xs: 48, sm: 56 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    px: { xs: 2, sm: 3 },
                    transition: "all 0.2s ease-in-out",
                    "&.Mui-selected": {
                        backgroundColor: "action.hover",
                        color: "primary.main",
                        fontWeight: 600,
                    },
                    "&:hover": {
                        backgroundColor: "action.hover",
                    },
                },
                "& .MuiTabs-scrollButtons": {
                    color: "text.secondary",
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
            }}
        >
            <Tab label="Basic Info" value="basic" />
            <Tab label="Variables" value="variables" />
            <Tab label="Recipients" value="recipients" />
            <Tab label="Editor" value="editor" />
            <Tab label="Preview" value="preview" />
        </MuiTabList>
    );
};

interface ManagementHeaderProps {
    onChange: (event: React.SyntheticEvent, newValue: TabType) => void;
    activeTab: TabType;
    templateName: string;
}

const ManagementHeader: React.FC<ManagementHeaderProps> = ({
    onChange,
    activeTab,
    templateName,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <TabContext value={activeTab}>
            <Paper
                elevation={2}
                sx={{
                    backgroundColor: "background.paper",
                    overflowX: "auto",
                    borderRadius: { xs: 0, sm: 1 },
                    borderBottom: 2,
                    borderColor: "divider",
                    width: "100%",
                    position: "sticky",
                    top: 0,
                    p: { xs: 1.5, sm: 2 },
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1.5, sm: 2 },
                    transition: "all 0.2s ease-in-out",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: { xs: "center", sm: "flex-start" },
                        position: "relative",
                        minHeight: { xs: 48, sm: 56 },
                    }}
                >
                    <IconButton
                        component={Link}
                        to="/admin/templates"
                        size="small"
                        sx={{
                            color: "text.primary",
                            "&:hover": {
                                backgroundColor: "action.hover",
                                transform: "scale(1.05)",
                            },
                            position: { xs: "absolute", sm: "static" },
                            left: 0,
                            transition: "all 0.2s ease-in-out",
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        component="h1"
                        sx={{
                            fontSize: {
                                xs: "1.1rem",
                                sm: "1.3rem",
                                md: "1.5rem",
                            },
                            fontWeight: 600,
                            color: "text.primary",
                        }}
                    >
                        {templateName}
                    </Typography>
                </Box>

                <ManagementTabList onChange={onChange} />
            </Paper>
        </TabContext>
    );
};

export default ManagementHeader;
