"use client";

import { Box, Paper, Alert, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const _StyledPaper = styled(Paper, {
  shouldForwardProp: prop => prop !== "isMobile",
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  alignItems: isMobile ? "stretch" : "center",
  paddingBlock: theme.spacing(0.5),
  paddingInline: theme.spacing(isMobile ? 2 : 3),
  gap: theme.spacing(isMobile ? 1 : 2),
  margin: theme.spacing(0.5),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-1px)",
  },
  "&:focus-within": {
    borderColor: theme.palette.primary.main,
    boxShadow: `${theme.shadows[4]}, 0 0 0 2px ${theme.palette.primary.main}25`,
  },
}));

export const _FieldsContainer = styled(Box, {
  shouldForwardProp: prop => prop !== "isMobile",
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  alignItems: "flex-start",
  gap: theme.spacing(isMobile ? 2 : 3),
  overflowX: isMobile ? "visible" : "auto",
  flexGrow: 1,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  position: "relative",
  scrollBehavior: "smooth",
  "&::-webkit-scrollbar": {
    height: "10px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.action.selected,
    borderRadius: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  ...(!isMobile && {
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "20px",
      pointerEvents: "none",
      zIndex: 1,
    },
    "&::before": {
      left: 0,
      background: `linear-gradient(to right, ${theme.palette.background.paper}, transparent)`,
    },
    "&::after": {
      right: 0,
      background: `linear-gradient(to left, ${theme.palette.background.paper}, transparent)`,
    },
  }),
}));

export const _FieldWrapper = styled(Box, {
  shouldForwardProp: prop => prop !== "isMobile" && prop !== "fieldWidth",
})<{ isMobile: boolean; fieldWidth: string | number }>(({ isMobile, fieldWidth }) => ({
  width: fieldWidth,
  flexShrink: isMobile ? 1 : 0,
  position: "relative",
  transition: "all 0.3s ease",
}));

export const _ActionsContainer = styled(Box, {
  shouldForwardProp: prop => prop !== "isMobile",
})<{ isMobile: boolean }>(({ theme, isMobile }) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: theme.spacing(2),
  alignItems: "center",
  marginTop: isMobile ? theme.spacing(2) : 0,
  marginInlineStart: isMobile ? 0 : theme.spacing(2),
  flexShrink: 0,
}));

export const _StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  "& .MuiAlert-icon": {
    fontSize: "1.5rem",
  },
}));

export const _CreateButton = styled(Button, {
  shouldForwardProp: prop => prop !== "isMobile" && prop !== "isFormValid",
})<{ isMobile: boolean; isFormValid: boolean }>(({ theme, isMobile, isFormValid }) => ({
  minWidth: isMobile ? "100%" : 120,
  height: 40,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  fontWeight: 600,
  fontSize: "0.95rem",
  textTransform: "none",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  ...(isFormValid
    ? {
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
        border: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
          transform: "translateY(-2px) scale(1.05)",
          boxShadow: theme.shadows[8],
        },
        "&:active": {
          transform: "translateY(0) scale(1.02)",
        },
      }
    : {
        color: theme.palette.text.disabled,
        background: theme.palette.action.disabledBackground,
        border: `2px solid ${theme.palette.action.disabled}`,
        "&.Mui-disabled": {
          color: theme.palette.text.disabled,
          background: theme.palette.action.disabledBackground,
          border: `2px solid ${theme.palette.action.disabled}`,
        },
      }),
}));
