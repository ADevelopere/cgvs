"use client";

import { Box } from "@mui/material";
import TemplateVariablesList from "./TemplateVariablesList";

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
            <TemplateVariablesList />
        </Box>
    );
};

export default TemplateVariableManagement;
