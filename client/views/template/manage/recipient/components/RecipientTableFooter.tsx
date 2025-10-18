"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { useRecipientStore } from "../stores/useRecipientStore";
import { useRecipientOperations } from "../hooks/useRecipientOperations";
import { studentsNotInRecipientGroupQueryDocument } from "../hooks/recipient.documents";
import { useAppTranslation } from "@/client/locale";
import { useTableRowsContext } from "@/client/components/Table/Table/TableRowsContext";

interface RecipientTableFooterEndProps {
  templateId?: number;
  mode: "add" | "remove";
  onAction: (selectedRowIds: number[]) => Promise<boolean>;
  actionButtonLabel: string;
  confirmDialogTitle: string;
  confirmDialogMessage: string;
  queryDocument: any; // The GraphQL query document to use for loading state
  queryVariables: any; // The variables for the query
}

// Footer start content component - shows selection count and clear button
export const RecipientTableFooterStart: React.FC<{ tabType?: "add" | "manage" }> = ({ tabType }) => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const { selectedRowIds, clearAllSelections } = useTableRowsContext();
  const store = useRecipientStore();
  const [openClearDialog, setOpenClearDialog] = useState(false);

  const handleClearClick = () => {
    setOpenClearDialog(true);
  };

  const handleClearConfirm = () => {
    clearAllSelections();
    // Also clear the store selection
    if (tabType === "add") {
      store.clearSelectedStudentIdsNotInGroup();
    } else if (tabType === "manage") {
      store.clearSelectedStudentIdsInGroup();
    }
    setOpenClearDialog(false);
  };

  const handleClearCancel = () => {
    setOpenClearDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" color="primary" fontWeight={600}>
          {strings.selectedStudents} {selectedRowIds.length}
        </Typography>
        {selectedRowIds.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleClearClick}
            sx={{ minWidth: "auto" }}
          >
            {strings.clearAllSelection}
          </Button>
        )}
      </Box>

      <Dialog open={openClearDialog} onClose={handleClearCancel}>
        <DialogTitle>{strings.confirmClearSelection}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {strings.confirmClearSelectionMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCancel} color="primary">
            {strings.cancel}
          </Button>
          <Button
            onClick={handleClearConfirm}
            color="error"
            variant="contained"
          >
            {strings.clearAllSelection}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Footer end content component - shows action buttons
export const RecipientTableFooterEnd: React.FC<RecipientTableFooterEndProps> = ({
  templateId,
  mode,
  onAction,
  actionButtonLabel,
  confirmDialogTitle,
  confirmDialogMessage,
  queryDocument,
  queryVariables,
}) => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const { selectedRowIds } = useTableRowsContext();
  const store = useRecipientStore();
  const [openActionDialog, setOpenActionDialog] = useState(false);

  // Get loading state from the query
  const { loading } = useQuery(queryDocument, {
    variables: queryVariables,
    skip: !queryVariables.recipientGroupId,
    fetchPolicy: "cache-first",
  });

  const handleActionClick = () => {
    setOpenActionDialog(true);
  };

  const handleActionConfirm = async () => {
    const success = await onAction(selectedRowIds.map(Number));
    if (success) {
      setOpenActionDialog(false);
      // Clear the appropriate selection in store
      if (mode === "add") {
        store.clearSelectedStudentIdsNotInGroup();
      } else {
        store.clearSelectedStudentIdsInGroup();
      }
    }
  };

  const handleActionCancel = () => {
    setOpenActionDialog(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Button
          component={Link}
          href="/admin/students"
          size="small"
          endIcon={<OpenInNew fontSize="small" />}
          sx={{
            textTransform: "none",
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 400,
            padding: "4px 8px",
            minWidth: "auto",
            "&:hover": {
              textDecoration: "underline",
              backgroundColor: "transparent",
            },
          }}
        >
          {strings.goToStudentsPage}
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={selectedRowIds.length === 0 || loading}
          onClick={handleActionClick}
        >
          {actionButtonLabel}
        </Button>
      </Box>

      <Dialog open={openActionDialog} onClose={handleActionCancel}>
        <DialogTitle>{confirmDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActionCancel} color="primary">
            {strings.cancel}
          </Button>
          <Button
            onClick={handleActionConfirm}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {actionButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
