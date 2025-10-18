"use client";

import React from "react";
import { Box, CircularProgress, Fab, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@apollo/client/react";
import { Template } from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";
import { useRecipientGroupDialogs } from "./hooks/useRecipientGroupDialogs";
import * as Document from "./hooks/recipientGroup.documents";
import EmptyGroupsState from "../recipient/EmptyGroupsState";
import RecipientGroupList from "./RecipientGroupList";
import CreateGroupDialog from "./CreateGroupDialog";
import GroupInfoDialog from "./GroupInfoDialog";
import GroupSettingsDialog from "./GroupSettingsDialog";
import DeleteConfirmationDialog from "../recipient/DeleteConfirmationDialog";

interface RecipientGroupTabContentProps {
  template: Template;
}

const RecipientGroupTabContent: React.FC<RecipientGroupTabContentProps> = ({
  template,
}) => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const dialogs = useRecipientGroupDialogs();

  // Use useQuery directly to fetch recipient groups
  const { data, loading, error } = useQuery(
    Document.templateRecipientGroupsByTemplateIdQueryDocument,
    {
      variables: { templateId: template.id },
      skip: !template.id,
    },
  );

  const groups = data?.templateRecipientGroupsByTemplateId || [];
  const hasGroups = groups && groups.length > 0;

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
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body1" color="error">
          {error.message}
        </Typography>
      ) : hasGroups ? (
        <RecipientGroupList groups={groups} loading={loading} />
      ) : (
        <EmptyGroupsState />
      )}

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
      <CreateGroupDialog templateId={template.id} />
      <GroupInfoDialog groups={groups} />
      <GroupSettingsDialog groups={groups} />
      <DeleteConfirmationDialog groups={groups} />
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
