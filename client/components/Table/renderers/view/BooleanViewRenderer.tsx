import React from "react";
import { Checkbox } from "@mui/material";

export interface BooleanViewRendererProps {
  value: boolean | null | undefined;
}

/**
 * BooleanViewRenderer Component
 *
 * Displays a read-only checkbox for boolean values.
 */
export const BooleanViewRenderer: React.FC<BooleanViewRendererProps> = ({ value }) => {
  return (
    <Checkbox
      checked={!!value}
      disabled
      size="small"
      sx={{
        padding: 0,
        "&.Mui-disabled": {
          cursor: "default",
        },
      }}
    />
  );
};

export default BooleanViewRenderer;
