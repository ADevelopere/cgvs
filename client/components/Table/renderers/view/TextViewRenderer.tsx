import React from "react";
import { Box, Tooltip } from "@mui/material";

export interface TextViewRendererProps {
  value: string | number | null | undefined;
  tooltip?: boolean;
}

/**
 * TextViewRenderer Component
 *
 * Simple text display with ellipsis and optional tooltip.
 * Used for rendering text/string values in table cells.
 */
export const TextViewRenderer: React.FC<TextViewRendererProps> = ({
  value,
  tooltip = true,
}) => {
  const displayValue =
    value !== null && value !== undefined ? String(value) : "";

  const content = (
    <Box
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {displayValue}
    </Box>
  );

  if (tooltip && displayValue) {
    return (
      <Tooltip title={displayValue} enterDelay={500}>
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default TextViewRenderer;
