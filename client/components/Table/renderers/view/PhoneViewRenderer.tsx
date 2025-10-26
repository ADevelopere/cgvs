import React from "react";
import { Box } from "@mui/material";
import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";

export interface PhoneViewRendererProps {
  value: string | null | undefined;
}

/**
 * Format phone number with proper grouping using google-libphonenumber
 */
const formatPhoneNumber = (phoneNumber: string): string => {
  try {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const parsedNumber = phoneUtil.parse(phoneNumber);
    // Use INTERNATIONAL format for better readability with spacing
    return phoneUtil.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL);
  } catch (_error) {
    // If parsing fails, return the original value
    return phoneNumber;
  }
};

/**
 * PhoneViewRenderer Component
 *
 * Displays phone number with proper international formatting and grouping.
 * Uses LTR direction and Unicode bidirectional controls for proper display in RTL contexts.
 * Used for rendering phone number values in table cells.
 */
export const PhoneViewRenderer: React.FC<PhoneViewRendererProps> = ({
  value,
}) => {
  const displayValue =
    value !== null && value !== undefined
      ? formatPhoneNumber(String(value))
      : "";

  // Add Unicode LTR mark (U+200E) to force left-to-right display in RTL contexts
  const ltrDisplayValue = displayValue ? `\u200E${displayValue}\u200E` : "";

  return (
    <Box
      sx={{
        direction: "ltr",
        unicodeBidi: "embed",
        textAlign: "left",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {ltrDisplayValue}
    </Box>
  );
};

export default PhoneViewRenderer;
