"use client";

import React from "react";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { AccountTree as ReactFlowIcon, PictureAsPdf as PdfIcon } from "@mui/icons-material";

export type EditorType = "reactflow" | "pdfme";

export interface EditorToggleProps {
  activeEditor: EditorType;
  onToggle: (editor: EditorType) => void;
}

/**
 * Toggle component for switching between ReactFlow and PDFMe editors
 */
export const EditorToggle: React.FC<EditorToggleProps> = ({ activeEditor, onToggle }) => {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newEditor: EditorType | null) => {
    if (newEditor !== null) {
      onToggle(newEditor);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <ToggleButtonGroup value={activeEditor} exclusive onChange={handleChange} aria-label="editor type" size="small">
        <ToggleButton value="reactflow" aria-label="ReactFlow editor">
          <ReactFlowIcon sx={{ mr: 1 }} />
          ReactFlow Editor
        </ToggleButton>
        <ToggleButton value="pdfme" aria-label="PDFMe editor">
          <PdfIcon sx={{ mr: 1 }} />
          PDFMe Editor
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
