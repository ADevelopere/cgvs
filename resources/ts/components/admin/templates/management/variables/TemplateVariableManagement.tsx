"use client";

import { Box } from "@mui/material";
import SplitPane from "@/components/splitPane/SplitPane";
import TemplateVariablesList from "./TemplateVariablesList";
import TemplateVariableForm from "./TemplateVariableForm";

const TemplateVariableManagement = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                height: "100%",
            }}
        >
            <SplitPane
                orientation="vertical"
                firstPane={{
                    visible: true,
                    minRatio: 0.3,
                }}
                secondPane={{
                    visible: true,
                    minRatio: 0.6,
                }}
                resizerProps={{
                    style: {
                        cursor: "col-resize",
                    },
                }}
                style={{
                    flex: 1,
                    minHeight: `calc(100vh - 240px)`,
                }}
                storageKey="template-variable-management-split"
            >
                <TemplateVariablesList />
                <Box sx={{ height: "100%", overflow: "auto" }}>
                    <TemplateVariableForm />
                </Box>
            </SplitPane>
        </Box>
    );
};

export default TemplateVariableManagement;
