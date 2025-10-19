"use client";

import React, { useState, useCallback, useMemo } from "react";
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
import { useAppTranslation } from "@/client/locale";
import { DocumentNode } from "graphql";

interface RecipientTableFooterEndProps {
  mode: "add" | "remove";
  onAction: (selectedRowIds: number[]) => Promise<boolean>;
  actionButtonLabel: string;
  confirmDialogTitle: string;
  confirmDialogMessage: string;
  queryDocument: DocumentNode; // The GraphQL query document to use for loading state
  queryVariables: Record<string, unknown>; // The variables for the query
}

// Footer start content component - shows selection count and clear button
export const RecipientTableFooterStart: React.FC<{
  tabType?: "add" | "manage";
}> = ({ tabType }) => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const store = useRecipientStore();
  const [openClearDialog, setOpenClearDialog] = useState(false);

  // Get the appropriate selected IDs based on tab type
  const selectedRowIds = useMemo(
    () =>
      tabType === "add"
        ? store.selectedStudentIdsNotInGroup
        : store.selectedStudentIdsInGroup,
    [
      tabType,
      store.selectedStudentIdsNotInGroup,
      store.selectedStudentIdsInGroup,
    ]
  );

  const handleClearClick = useCallback(() => {
    setOpenClearDialog(true);
  }, []);

  const handleClearConfirm = useCallback(() => {
    // Clear the store selection
    if (tabType === "add") {
      store.clearSelectedStudentIdsNotInGroup();
    } else if (tabType === "manage") {
      store.clearSelectedStudentIdsInGroup();
    }
    setOpenClearDialog(false);
  }, [tabType, store]);

  const handleClearCancel = useCallback(() => {
    setOpenClearDialog(false);
  }, []);

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
export const RecipientTableFooterEnd: React.FC<
  RecipientTableFooterEndProps
> = ({
  mode,
  onAction,
  actionButtonLabel,
  confirmDialogTitle,
  confirmDialogMessage,
  queryDocument,
  queryVariables,
}) => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const store = useRecipientStore();
  const [openActionDialog, setOpenActionDialog] = useState(false);

  // Get the appropriate selected IDs based on mode
  const selectedRowIds = useMemo(
    () =>
      mode === "add"
        ? store.selectedStudentIdsNotInGroup
        : store.selectedStudentIdsInGroup,
    [mode, store.selectedStudentIdsNotInGroup, store.selectedStudentIdsInGroup]
  );

  // Memoize the query variables to prevent unnecessary re-renders
  const memoizedQueryVariables = useMemo(
    () => queryVariables,
    [queryVariables]
  );

  // Get loading state from the query
  const { loading } = useQuery(queryDocument, {
    variables: memoizedQueryVariables,
    skip: !memoizedQueryVariables.recipientGroupId,
    fetchPolicy: "cache-first",
  });

  // Memoize the converted selected row IDs
  const convertedSelectedRowIds = useMemo(
    () => selectedRowIds.map(Number),
    [selectedRowIds]
  );

  const handleActionClick = useCallback(() => {
    setOpenActionDialog(true);
  }, []);

  const handleActionConfirm = useCallback(async () => {
    const success = await onAction(convertedSelectedRowIds);
    if (success) {
      setOpenActionDialog(false);
      // Clear the appropriate selection in store
      if (mode === "add") {
        store.clearSelectedStudentIdsNotInGroup();
      } else {
        store.clearSelectedStudentIdsInGroup();
      }
    }
  }, [onAction, convertedSelectedRowIds, mode, store]);

  const handleActionCancel = useCallback(() => {
    setOpenActionDialog(false);
  }, []);

  // Memoize the disabled state for the action button
  const isActionButtonDisabled = useMemo(
    () => selectedRowIds.length === 0 || loading,
    [selectedRowIds.length, loading]
  );

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
          disabled={isActionButtonDisabled}
          onClick={handleActionClick}
        >
          {actionButtonLabel}
        </Button>
      </Box>

      <Dialog open={openActionDialog} onClose={handleActionCancel}>
        <DialogTitle>{confirmDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialogMessage}</DialogContentText>
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
