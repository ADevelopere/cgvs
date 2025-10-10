"use client";

import React from "react";
import { Box } from "@mui/material";
import {
    RecipientManagementProvider,
    useRecipientManagement,
} from "@/client/contexts/recipient";
import { useTemplateManagement } from "@/client/contexts/template/TemplateManagementContext";
import RecipientGroupSelector from "./RecipientGroupSelector";
import SelectGroupPrompt from "./SelectGroupPrompt";
import StudentsNotInGroupTable from "./StudentsNotInGroupTable";

const AddStudentsContent: React.FC = () => {
    const { selectedGroupId } = useRecipientManagement();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
            }}
        >
            {/* Group Selector */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <RecipientGroupSelector />
            </Box>

            {/* Content Area */}
            {selectedGroupId ? (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        p: 2,
                    }}
                >
                    <StudentsNotInGroupTable />
                </Box>
            ) : (
                <SelectGroupPrompt />
            )}
        </Box>
    );
};

const AddStudentsToGroupTab: React.FC = () => {
    const { template } = useTemplateManagement();

    if (!template?.id) {
        return null;
    }

    // Use a default recipientGroupId (0 or first group) since provider requires it
    // The actual groupId will be managed via URL params
    const defaultGroupId = template.recipientGroups?.[0]?.id || 0;

    return (
        <RecipientManagementProvider
            recipientGroupId={defaultGroupId}
            templateId={template.id}
        >
            <AddStudentsContent />
        </RecipientManagementProvider>
    );
};

export default AddStudentsToGroupTab;

