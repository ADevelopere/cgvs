import React from "react";
import { Tab, Paper } from "@mui/material";
import { TabList as MuiTabList, TabContext } from "@mui/lab";
import { TabType } from "@/contexts/template/TemplateManagementContext";

interface TabListProps {
    onChange: (event: React.SyntheticEvent, newValue: TabType) => void;
    activeTab: TabType;
}

const ManagementTabList: React.FC<TabListProps> = ({ onChange, activeTab }) => {
    console.log("ManagementTabList rendered");
    console.log("Active Tab:", activeTab);
    return (
        <TabContext value={activeTab}>
            <Paper
                sx={{
                    backgroundColor: "background.default",
                    overflowX: "auto",
                    display: "flex",
                    justifyContent: "center",
                }}
                id="template-management-tabs-paper"
            >
                <MuiTabList
                    onChange={onChange}
                    aria-label="template management tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        "& .MuiTab-root": {
                            minHeight: { xs: 48, sm: 56 },
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            px: { xs: 2, sm: 3 },
                            "&.Mui-selected": {
                                backgroundColor: "background.paper",
                                color: "primary.main",
                            },
                        },
                    }}
                    id="template-management-tabs"
                    slotProps={{
                        indicator: {
                            sx: {
                                backgroundColor: "primary.main",
                                height: 4,
                                borderRadius: 0,
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
            </Paper>
        </TabContext>
    );
};

export default ManagementTabList;
