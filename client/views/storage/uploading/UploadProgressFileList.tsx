"use client";

import React from "react";
import { Box, Collapse, useTheme } from "@mui/material";
import UploadProgressFileItem from "./UploadProgressFileItem";
import { UploadFileDisplayInfo } from "../core/storage-upload.types";

export interface UploadProgressFileListProps {
  files: UploadFileDisplayInfo[];
  isCollapsed: boolean;
  onCancelFile: (fileKey: string) => void;
}

const UploadProgressFileList: React.FC<UploadProgressFileListProps> = ({
  files,
  isCollapsed,
  onCancelFile,
}) => {
  const theme = useTheme();

  if (files.length === 0) {
    return null;
  }

  return (
    <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
      <Box
        sx={{
          maxHeight: "300px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: theme.palette.action.hover,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.action.disabled,
            borderRadius: "3px",
            "&:hover": {
              backgroundColor: theme.palette.action.selected,
            },
          },
        }}
      >
        {files.map(file => (
          <UploadProgressFileItem
            key={file.fileKey}
            fileKey={file.fileKey}
            fileName={file.fileName}
            fileType={file.fileType}
            progress={file.progress}
            status={file.status}
            error={file.error}
            onCancel={onCancelFile}
          />
        ))}
      </Box>
    </Collapse>
  );
};

export default React.memo(UploadProgressFileList);
