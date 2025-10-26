import React from "react";
import { Box, Tooltip } from "@mui/material";
import { format as formatDate } from "date-fns";
import { arEG, enUS } from "date-fns/locale";
import { useAppTheme } from "@/client/contexts";

export interface DateViewRendererProps {
  value: Date | string | null | undefined;
  format?: string;
  tooltip?: boolean;
}

/**
 * DateViewRenderer Component
 *
 * Formats and displays date values with locale support.
 */
export const DateViewRenderer: React.FC<DateViewRendererProps> = ({
  value,
  format = "PP", // Default: localized date format
  tooltip = true,
}) => {
  const { language } = useAppTheme();

  const locale = React.useMemo(() => {
    if (language === "ar") return arEG;
    return enUS;
  }, [language]);

  const displayValue = React.useMemo(() => {
    if (!value) return "";

    try {
      const date = typeof value === "string" ? new Date(value) : value;
      if (isNaN(date.getTime())) return "";
      return formatDate(date, format, { locale });
    } catch {
      return "";
    }
  }, [value, format, locale]);

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
