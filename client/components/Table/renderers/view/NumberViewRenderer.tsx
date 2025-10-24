import React from "react";
import { Box, Tooltip } from "@mui/material";

export interface NumberViewRendererProps {
  value: number | null | undefined;
  decimals?: number;
  locale?: string;
  tooltip?: boolean;
}

/**
 * NumberViewRenderer Component
 *
 * Formats and displays numeric values with locale-specific formatting.
 */
export const NumberViewRenderer: React.FC<NumberViewRendererProps> = ({
  value,
  decimals,
  locale = "ar-EG",
  tooltip = true,
}) => {
  const displayValue = React.useMemo(() => {
    if (value === null || value === undefined) return "";

    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
    } catch {
      return String(value);
    }
  }, [value, decimals, locale]);

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

export default NumberViewRenderer;
