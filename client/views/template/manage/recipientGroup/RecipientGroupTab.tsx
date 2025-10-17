"use client";

import React from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Template } from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";
import { useRecipientGroupOperations } from "./hooks/useRecipientGroupOperations";
import { useRecipientGroupDialogs } from "./hooks/useRecipientGroupDialogs";
import EmptyGroupsState from "../recipient/EmptyGroupsState";
import RecipientGroupList from "./RecipientGroupList";
import CreateGroupDialog from "./CreateGroupDialog";
import GroupInfoDialog from "./GroupInfoDialog";
import GroupSettingsDialog from "./GroupSettingsDialog";
import DeleteConfirmationDialog from "../recipient/DeleteConfirmationDialog";

interface RecipientGroupTabContentProps {
    template: Template;
}

const RecipientGroupTabContent: React.FC<RecipientGroupTabContentProps> = ({ template }) => {
    const strings = useAppTranslation("recipientGroupTranslations");
    const operations = useRecipientGroupOperations(template.id);
    const dialogs = useRecipientGroupDialogs();

    const hasGroups = operations.groups && operations.groups.length > 0;

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
                        onClick={dialogs.openCreateDialog}
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

interface RecipientGroupTabProps {
    template: Template;
}

const RecipientGroupTab: React.FC<RecipientGroupTabProps> = ({ template }) => {
    if (!template?.id) {
        return null;
    }

    // No provider needed, hooks access stores directly
    return <RecipientGroupTabContent template={template} />;
};

export default RecipientGroupTab;
