import React from "react";
import { Box, Tooltip } from "@mui/material";
import { format as formatDate } from "date-fns";

export interface DateViewRendererProps {
  value: Date | string | null | undefined;
  format?: string;
  tooltip?: boolean;
}

/**
 * DateViewRenderer Component
 *
 * Formats and displays date values.
 */
export const DateViewRenderer: React.FC<DateViewRendererProps> = ({
  value,
  format = "EG", // Default: localized date
  tooltip = true,
}) => {
  const displayValue = React.useMemo(() => {
    if (!value) return "";

    try {
      const date = typeof value === "string" ? new Date(value) : value;
      if (isNaN(date.getTime())) return "";
      return formatDate(date, format);
    } catch {
      return "";
    }
  }, [value, format]);

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

export default DateViewRenderer;
