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
      margin: 0,
      padding: 0,
      width: "100%",
      height: "100%",
      fontSize: "inherit",
      fontFamily: "inherit",
      color: "inherit",
      "& .MuiInput-underline:before": {
        borderBottom: "none",
      backgroundColor: "green",
      },
      "& .MuiInput-underline:after": {
        borderBottom: "none",
      backgroundColor: "green",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      backgroundColor: "green",
      },
      "& .MuiInputBase-input": {
        padding: 0,
      backgroundColor: "green",
      },
    };
  }, []);

  const resizeHandleStyle: CSSProperties = useMemo(() => {
    return {
      
    };
  }, []);

  return {
    thStyle,
    inputStyle,
    resizeHandleStyle,
  } as const;
};
