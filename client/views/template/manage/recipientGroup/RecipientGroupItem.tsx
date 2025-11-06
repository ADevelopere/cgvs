"use client";

import React, { useCallback } from "react";
import { Paper, Box, IconButton, Button, Chip, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import { EditableTypography } from "@/client/components";
import { useRecipientGroupDialogs } from "./hooks/useRecipientGroupDialogs";
import { useRecipientGroupOperations } from "./hooks/useRecipientGroupOperations";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";

interface RecipientGroupItemProps {
  group: Graphql.TemplateRecipientGroup;
}

const RecipientGroupItem: React.FC<RecipientGroupItemProps> = ({ group }) => {
  const { recipientGroupTranslations: strings } = useAppTranslation();
  const { openInfoDialog, openSettingsDialog, openDeleteDialog } = useRecipientGroupDialogs();
  const { updateGroup } = useRecipientGroupOperations();

  const handleNameSave = useCallback(
    async (value: string) => {
      if (!value.trim()) {
        return strings.nameRequired;
      }
      if (!group.id) {
        return strings.errorUpdating;
      }
      // Don't update if the name hasn't changed
      if (value.trim() === group.name) {
        return; // Successfully "updated" without making a request
      }
      await updateGroup({
        id: group.id,
        name: value.trim(),
      });
    },
    [group.id, group.name, updateGroup, strings]
  );

  const handleManageClick = useCallback(() => {
    if (!group.id) return;
    // TODO: Navigate to recipient management page with group ID
    logger.log({ caller: "RecipientGroupItem" }, "Manage group:", group.id);
  }, [group.id]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "all 0.2s",
        "&:hover": {
          elevation: 4,
          boxShadow: 3,
        },
      }}
    >
      {/* Group Icon */}
      <GroupIcon sx={{ fontSize: 40, color: "primary.main" }} />

      {/* Group Name - Editable */}
      <Box sx={{ flex: 1 }}>
        <EditableTypography
          value={group.name || ""}
          onSaveAction={handleNameSave}
          typography={{
            variant: "h6",
            sx: { fontWeight: 500 },
          }}
          textField={{
            variant: "outlined",
            size: "small",
          }}
          doubleClickToEdit={true}
        />
      </Box>

      {/* Student Count Badge */}
      <Tooltip title={strings.studentCount}>
        <Chip label={group.studentCount || 0} color="primary" size="medium" sx={{ minWidth: 60 }} />
      </Tooltip>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip title={strings.info}>
          <IconButton
            size="small"
            onClick={() => group.id && openInfoDialog(group.id)}
            color="info"
            disabled={!group.id}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={strings.settings}>
          <IconButton
            size="small"
            onClick={() => group.id && openSettingsDialog(group.id)}
            color="default"
            disabled={!group.id}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>

        <Button variant="outlined" size="small" onClick={handleManageClick} sx={{ minWidth: 100 }} disabled={!group.id}>
          {strings.manage}
        </Button>

        <Tooltip
          title={group.studentCount && group.studentCount > 0 ? strings.cannotDeleteGroupWithStudents : strings.delete}
        >
          <span>
            <IconButton
              size="small"
              onClick={() => group.id && openDeleteDialog(group.id)}
              color="error"
              disabled={
                !group.id || (group.studentCount !== null && group.studentCount !== undefined && group.studentCount > 0)
              }
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default RecipientGroupItem;
