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
import { useRecipientGroupDialogs } from "../recipientGroup/hooks/useRecipientGroupDialogs";
import { useRecipientGroupOperations } from "../recipientGroup/hooks/useRecipientGroupOperations";
import { useRecipientGroupDataStore } from "../recipientGroup/stores/useRecipientGroupDataStore";
import { useAppTranslation } from "@/client/locale";
import { TemplateRecipientGroup } from "@/client/graphql/generated/gql/graphql";

const DeleteConfirmationDialog: React.FC = () => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const { deleteDialogOpen, closeDeleteDialog, selectedGroupId } = useRecipientGroupDialogs();
  const { groups } = useRecipientGroupDataStore();
  const { deleteGroup, loading } = useRecipientGroupOperations(0); // templateId not needed for delete

  const selectedGroup: TemplateRecipientGroup | null = useMemo(() => {
    if (!selectedGroupId) return null;
    return groups.find((g) => g.id === selectedGroupId) || null;
  }, [selectedGroupId, groups]);

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
