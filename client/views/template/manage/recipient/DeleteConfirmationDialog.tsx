"use client";

import React, { useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useRecipientGroupManagement } from "@/client/contexts/recipientGroup";
import { useAppTranslation } from "@/client/locale";
import { TemplateRecipientGroup } from "@/client/graphql/generated/gql/graphql";

const DeleteConfirmationDialog: React.FC<{
  templateId: number;
}> = ({ templateId }) => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const {
    deleteDialogOpen,
    closeDeleteDialog,
    deleteGroup,
    loading,
    selectedGroupId,
  } = useRecipientGroupManagement();

  // todo, fix this
  const selectedGroup: TemplateRecipientGroup | null = useMemo(() => {
    // if (!selectedGroupId || !template?.recipientGroups) return null;
    // return template.recipientGroups.find((g) => g.id === selectedGroupId);
    return {
      id: selectedGroupId,
      name: "Test Group",
      studentCount: 0,
    } as TemplateRecipientGroup;
  }, [selectedGroupId]);

  const handleDelete = useCallback(async () => {
    if (!selectedGroupId) return;

    // Additional check: prevent deletion if group has students
    if (
      selectedGroup &&
      selectedGroup.studentCount &&
      selectedGroup.studentCount > 0
    ) {
      return;
    }

    await deleteGroup(selectedGroupId);
  }, [selectedGroupId, selectedGroup, deleteGroup]);

  return (
    <Dialog
      open={deleteDialogOpen}
      onClose={closeDeleteDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{strings.deleteGroupTitle}</DialogTitle>
      <DialogContent>
        {selectedGroup &&
        selectedGroup.studentCount &&
        selectedGroup.studentCount > 0 ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {strings.cannotDeleteGroupWithStudents}
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {strings.confirmDelete}
          </Alert>
        )}
        {selectedGroup && (
          <Typography variant="body2" color="text.secondary">
            {strings.name}: <strong>{selectedGroup.name}</strong>
            {selectedGroup.studentCount !== null &&
              selectedGroup.studentCount !== undefined && (
                <>
                  <br />
                  {strings.studentCount}:{" "}
                  <strong>{selectedGroup.studentCount}</strong>
                </>
              )}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog} disabled={loading}>
          {selectedGroup &&
          selectedGroup.studentCount &&
          selectedGroup.studentCount > 0
            ? strings.close
            : strings.cancel}
        </Button>
        {(!selectedGroup ||
          !selectedGroup.studentCount ||
          selectedGroup.studentCount === 0) && (
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {strings.delete}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
