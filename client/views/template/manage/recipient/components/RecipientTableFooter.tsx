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
  Tooltip,
} from "@mui/material";
import { OpenInNew, Add, Remove } from "@mui/icons-material";
import Link from "next/link";
import { useRecipientStore } from "../stores/useRecipientStore";
import { useAppTranslation } from "@/client/locale";

interface RecipientTableFooterEndProps {
  mode: "add" | "remove";
  onAction: (selectedRowIds: number[]) => Promise<boolean>;
  actionButtonLabel: string;
  confirmDialogTitle: string;
  confirmDialogMessage: string;
  isLoading: boolean; // Use parent table loading state for consistent UX
  isMobile: boolean; // Required: parent determines layout
}

// Footer start content component - shows selection count and clear button
export const RecipientTableFooterStart: React.FC<{
  tabType: "add" | "manage";
  isMobile: boolean;
  isLoading: boolean;
}> = ({ tabType, isMobile, isLoading }) => {
  const { recipientGroupTranslations: strings } = useAppTranslation();
  const store = useRecipientStore();
  const [openClearDialog, setOpenClearDialog] = useState(false);

  // Get the appropriate selected IDs based on tab type
  const selectedRowIds = useMemo(
    () =>
      tabType === "add"
        ? store.selectedStudentIdsNotInGroup
        : store.selectedRecipientIdsInGroup,
    [
      tabType,
      store.selectedStudentIdsNotInGroup,
      store.selectedRecipientIdsInGroup,
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
      store.clearSelectedRecipientIdsInGroup();
    }
    setOpenClearDialog(false);
  }, [tabType, store]);

  const handleClearCancel = useCallback(() => {
    setOpenClearDialog(false);
  }, []);

  // Mobile layout: just show count with tooltip
  if (isMobile) {
    return (
      <>
        <Tooltip title={`${strings.selectedStudents} ${selectedRowIds.length}`}>
          <Typography variant="body2" color="primary" fontWeight={600}>
            {selectedRowIds.length}
          </Typography>
        </Tooltip>

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
              disabled={Boolean(isLoading)}
            >
              {strings.clearAllSelection}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Desktop layout: show full text and clear button
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
            disabled={Boolean(isLoading)}
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
            disabled={Boolean(isLoading)}
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
  isLoading,
  isMobile,
}) => {
  const { recipientGroupTranslations: strings } = useAppTranslation();
  const store = useRecipientStore();
  const [openActionDialog, setOpenActionDialog] = useState(false);

  // Get the appropriate selected IDs based on mode
  const selectedRowIds = useMemo(
    () =>
      mode === "add"
        ? store.selectedStudentIdsNotInGroup
        : store.selectedRecipientIdsInGroup,
    [
      mode,
      store.selectedStudentIdsNotInGroup,
      store.selectedRecipientIdsInGroup,
    ]
  );

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
        store.clearSelectedRecipientIdsInGroup();
      }
    }
  }, [onAction, convertedSelectedRowIds, mode, store]);

  const handleActionCancel = useCallback(() => {
    setOpenActionDialog(false);
  }, []);

  // Memoize the disabled state for the action button
  const isActionButtonDisabled = useMemo(
    () => selectedRowIds.length === 0 || Boolean(isLoading),
    [selectedRowIds.length, isLoading]
  );

  // Mobile layout: icon-only action button with tooltip
  if (isMobile) {
    return (
      <>
        <Tooltip title={actionButtonLabel}>
          <span>
            <Button
              variant="contained"
              size="small"
              disabled={isActionButtonDisabled}
              onClick={handleActionClick}
              color={mode === "remove" ? "error" : "primary"}
              sx={{ minWidth: 36, p: 0.5 }}
            >
              {mode === "add" ? (
                <Add fontSize="small" />
              ) : (
                <Remove fontSize="small" />
              )}
            </Button>
          </span>
        </Tooltip>

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
              color={mode === "remove" ? "error" : "primary"}
              variant="contained"
              disabled={Boolean(isLoading)}
            >
              {actionButtonLabel}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Desktop layout: show full buttons
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
          color={mode === "remove" ? "error" : "primary"}
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
            color={mode === "remove" ? "error" : "primary"}
            variant="contained"
            disabled={Boolean(isLoading)}
          >
            {actionButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
