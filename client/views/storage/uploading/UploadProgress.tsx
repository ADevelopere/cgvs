"use client";

import React from "react";
import { Card, useTheme, Portal, Box } from "@mui/material";
import { useUploadProgressUIOperations } from "../hooks/useUploadProgressUIOperations";
import UploadProgressHeader from "./UploadProgressHeader";
import UploadProgressSummary from "./UploadProgressSummary";
import UploadProgressFileList from "./UploadProgressFileList";
import CancelUploadDialog from "./CancelUploadDialog";

const UploadProgress: React.FC = () => {
  const theme = useTheme();
  const {
    totalCount,
    timeRemaining,
    files,
    isCollapsed,
    showCancelDialog,
    cancelTarget,
    onToggleCollapse,
    onClose,
    onCancelAll,
    onCancelFile,
    onConfirmCancel,
    onDismissDialog,
  } = useUploadProgressUIOperations();

  // Don't render if there are no files
  if (totalCount === 0) {
    return null;
  }

  return (
    <Portal>
      <Box
        sx={{
          position: "fixed",
          bottom: theme.spacing(3),
          right: theme.spacing(3),
          zIndex: theme.zIndex.snackbar,
          maxWidth: "400px",
          minWidth: "320px",
        }}
      >
        <Card
          elevation={8}
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.spacing(1),
            overflow: "hidden",
            boxShadow: theme.shadows[8],
          }}
        >
          <UploadProgressHeader
            totalCount={totalCount}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
            onClose={onClose}
          />

          <UploadProgressSummary timeRemaining={timeRemaining} isCollapsed={isCollapsed} onCancelAll={onCancelAll} />

          <UploadProgressFileList files={files} isCollapsed={isCollapsed} onCancelFile={onCancelFile} />
        </Card>
      </Box>

      <CancelUploadDialog
        open={showCancelDialog}
        cancelTarget={cancelTarget}
        onConfirm={onConfirmCancel}
        onCancel={onDismissDialog}
      />
    </Portal>
  );
};

export default React.memo(UploadProgress);
