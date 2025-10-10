"use client";

import React from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { RecipientGroupManagementProvider, useRecipientGroupManagement } from "@/client/contexts/recipientGroup";
import { useTemplateManagement } from "@/client/contexts/template/TemplateManagementContext";
import { useAppTranslation } from "@/client/locale";
import EmptyGroupsState from "./EmptyGroupsState";
import RecipientGroupList from "./RecipientGroupList";
import CreateGroupDialog from "./CreateGroupDialog";
import GroupInfoDialog from "./GroupInfoDialog";
import GroupSettingsDialog from "./GroupSettingsDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const RecipientTabContent: React.FC = () => {
    const strings = useAppTranslation("recipientGroupTranslations");
    const { template } = useTemplateManagement();
    const { openCreateDialog } = useRecipientGroupManagement();

    const hasGroups = template?.recipientGroups && template.recipientGroups.length > 0;

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                minHeight: "500px",
                p: 2,
            }}
        >
            {/* Content Area */}
            {hasGroups ? <RecipientGroupList /> : <EmptyGroupsState />}

            {/* Floating Action Button (only show when there are groups) */}
            {hasGroups && (
                <Tooltip title={strings.createGroup}>
                    <Fab
                        color="primary"
                        aria-label="add"
                        onClick={openCreateDialog}
                        sx={{
                            position: "fixed",
                            bottom: 32,
                            right: 32,
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
            )}

            {/* Dialogs */}
            <CreateGroupDialog />
            <GroupInfoDialog />
            <GroupSettingsDialog />
            <DeleteConfirmationDialog />
        </Box>
    );
};

const RecipientTab: React.FC = () => {
    const { template } = useTemplateManagement();

    if (!template?.id) {
        return null;
    }

    return (
        <RecipientGroupManagementProvider templateId={template.id}>
            <RecipientTabContent />
        </RecipientGroupManagementProvider>
    );
};

export default RecipientTab;
