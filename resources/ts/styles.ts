"use client";

import { useTheme } from "@mui/material/styles";
import { CSSProperties, useMemo } from "react";

type Props = {
  thWidth?: number;
};

// This function can be used to get theme-aware styles
export const useTableStyles = (props?: Props) => {
  const { thWidth } = props || {};
  const theme = useTheme();

  const thStyle: CSSProperties = useMemo(() => {
    return {
      padding: theme.spacing(2),
      textAlign: "start" as const,
      color: theme.palette.text.primary,
      fontWeight: "bold",
      position: "relative" as const,
      overflow: "hidden" as const,

      width: thWidth ? `${thWidth}px` : "auto",

      backgroundColor: theme.palette.background.paper,

      display: "flex" as const,
    };
  }, [theme, thWidth]);

  const inputStyle: CSSProperties = useMemo(() => {
    return {
      // Styles for MuiTextField-root (the outermost TextField component)
      margin: 0,
      padding: 0, // Remove padding from TextField root
      width: "100%",
      height: "100%", // TextField root fills the height of its container
      fontSize: "inherit",
      fontFamily: "inherit",
      color: "inherit",
      display: "flex", // Use flex to control alignment of its direct child (MuiInputBase-root)
      alignItems: "flex-start", // Align the child (MuiInputBase-root) to the top

      // Hide underline for standard variant
      "& .MuiInput-underline:before": {
        borderBottom: "none",
      },
      "& .MuiInput-underline:after": {
        borderBottom: "none",
      },
      // Hide border for outlined variant (if ever used)
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },

      // Styles for MuiInputBase-root (e.g., MuiInput-root for standard variant, wraps the <input>)
      "& .MuiInputBase-root": {
        padding: 0, // Remove padding from the input's direct wrapper
        margin: 0,
        width: "100%",
        display: "flex",
        alignItems: "flex-start", // Align the actual <input> element to the top
        flexGrow: 1, // Allow it to take available space within MuiTextField-root

        "&.error": {
          backgroundColor: "rgba(211, 47, 47, 0.1)", // Light red background for error state
        },
      },

      // Styles for the actual <input> HTML element
      "& .MuiInputBase-input": {
        padding: 0, // Most critical: remove browser default padding for the input field itself
        width: "100%", // Input field takes full width
      },
    };
  }, []);

  const resizeHandleStyle: CSSProperties = useMemo(() => {
    return {};
  }, []);

  return {
    thStyle,
    inputStyle,
    resizeHandleStyle,
  } as const;
};
