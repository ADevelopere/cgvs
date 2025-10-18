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
import { useRecipientStore } from "./stores/useRecipientStore";
import { useRecipientOperations } from "./hooks/useRecipientOperations";
import { studentsNotInRecipientGroupQueryDocument } from "./hooks/recipient.documents";
import { useAppTranslation } from "@/client/locale";
import { useTableRowsContext } from "@/client/components/Table/Table/TableRowsContext";

// Footer start content component - shows selection count and clear button
export const FooterStartContent: React.FC = () => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const { selectedRowIds, clearAllSelections } = useTableRowsContext();
  const [openClearDialog, setOpenClearDialog] = useState(false);

  const handleClearClick = () => {
    setOpenClearDialog(true);
  };

  const handleClearConfirm = () => {
    clearAllSelections();
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
export const FooterEndContent: React.FC<{ templateId?: number }> = ({
  templateId,
}) => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const { selectedRowIds } = useTableRowsContext();
  const { addStudentsToGroup } = useRecipientOperations(templateId);
  const { studentsNotInGroupQueryParams } = useRecipientStore();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Get loading state from the query
  const { loading } = useQuery(studentsNotInRecipientGroupQueryDocument, {
    variables: {
      ...studentsNotInGroupQueryParams,
      recipientGroupId: studentsNotInGroupQueryParams.recipientGroupId,
    },
    skip: !studentsNotInGroupQueryParams.recipientGroupId,
    fetchPolicy: "cache-first",
  });

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleAddConfirm = async () => {
    const success = await addStudentsToGroup(selectedRowIds.map(Number));
    if (success) {
      setOpenAddDialog(false);
      // Table selection will be automatically cleared after data refresh
    }
  };

  const handleAddCancel = () => {
    setOpenAddDialog(false);
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
          onClick={handleAddClick}
        >
          {strings.addToGroup}
        </Button>
      </Box>

      <Dialog open={openAddDialog} onClose={handleAddCancel}>
        <DialogTitle>{strings.confirmAddStudents}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {strings.confirmAddStudentsMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCancel} color="primary">
            {strings.cancel}
          </Button>
          <Button
            onClick={handleAddConfirm}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {strings.addToGroup}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
