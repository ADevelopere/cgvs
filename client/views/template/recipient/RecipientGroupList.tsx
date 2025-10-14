"use client";

import React from "react";
import { Box } from "@mui/material";
import RecipientGroupItem from "./RecipientGroupItem";
import { useTemplateManagement } from "@/client/views/template/TemplateManagementContext";

const RecipientGroupList: React.FC = () => {
    const { template } = useTemplateManagement();

    if (!template?.recipientGroups || template.recipientGroups.length === 0) {
        return null;
    }

    return (
        <Box sx={{ width: "100%" }}>
            {template.recipientGroups.map((group) => (
                <RecipientGroupItem key={group.id} group={group} />
            ))}
        </Box>
    );
};

export default RecipientGroupList;
