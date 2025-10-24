import React from "react";
import { Box, Tooltip } from "@mui/material";

export interface SelectViewRendererProps<TValue> {
  value: TValue;
  options: Array<{ label: string; value: TValue }>;
  tooltip?: boolean;
}

/**
 * SelectViewRenderer Component
 *
 * Displays the label for a selected value from a list of options.
 */
export const SelectViewRenderer = <TValue,>({
  value,
  options,
  tooltip = true,
}: SelectViewRendererProps<TValue>): React.JSX.Element => {
  const displayValue = React.useMemo(() => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : "";
  }, [value, options]);

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

export default SelectViewRenderer;
