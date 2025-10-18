"use client";

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import { useAppTranslation } from "@/client/locale";

// Internal components
type TemplateManagementHeaderProps = {
  templateName?: string;
  isLoading: boolean;
  isError: boolean;
  onBackAction: () => void;
};

export const TemplateManagementHeader: React.FC<
  TemplateManagementHeaderProps
> = ({ templateName, isLoading, isError, onBackAction: onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const strings = useAppTranslation("templateCategoryTranslations");

  const getTitleText = () => {
    if (isError) return strings.templateNotFoundTitle;
    if (isLoading) return strings.loadingTemplate;
    return "إدارة القالب:";
  };

  const getSubtitleText = () => {
    if (isError || isLoading) return "";
    return templateName || "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { sm: "column", md: "row" },
        gap: 1,
        alignItems: "center",
        justifyContent: { sm: "center", md: "flex-start" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: { sm: "center", md: "flex-start" },
          flexGrow: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={onBack}
          sx={{
            color: "primary.main",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            marginInlineStart: 2,
            marginBlock: 1,
          }}
        >
          <ArrowBackIcon
            sx={{
              transform: theme.direction === "rtl" ? "scaleX(-1)" : "none",
            }}
          />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            color: "secondary.main",
            "&:hover": {
              backgroundColor: "action.hover",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
            padding: 0,
            margin: 0,
          }}
        >
          <PrecisionManufacturingIcon />
        </IconButton>

        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h1"
          sx={{
            fontSize: {
              xs: "0.6rem",
              sm: "0.8rem",
              md: "1rem",
            },
            fontWeight: 600,
            color: "secondary.main",
          }}
        >
          {getTitleText()}
        </Typography>
        {getSubtitleText() && (
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="h1"
            sx={{
              fontSize: {
                xs: "0.6rem",
                sm: "0.8rem",
                md: "1rem",
              },
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            {getSubtitleText()}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
