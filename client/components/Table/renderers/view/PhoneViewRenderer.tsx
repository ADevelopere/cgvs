import React from "react";
import { Box } from "@mui/material";

export interface PhoneViewRendererProps {
  value: string | null | undefined;
}

/**
 * PhoneViewRenderer Component
 *
 * Displays phone number with LTR direction for proper display in RTL contexts.
 * Used for rendering phone number values in table cells.
 */
export const PhoneViewRenderer: React.FC<PhoneViewRendererProps> = ({
  value,
}) => {
  const displayValue =
    value !== null && value !== undefined ? String(value) : "";

  return (
    <Box
      sx={{
        direction: "ltr",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {displayValue}
    </Box>
  );
};

export default PhoneViewRenderer;

