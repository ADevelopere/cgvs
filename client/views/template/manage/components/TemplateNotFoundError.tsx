"use client";

import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppTranslation } from "@/client/locale";

interface TemplateNotFoundErrorProps {
  onBack: () => void;
}

export const TemplateNotFoundError: React.FC<TemplateNotFoundErrorProps> = ({ onBack }) => {
  const { templateCategoryTranslations: strings } = useAppTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          {strings.templateNotFoundTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {strings.templateNotFoundMessage}
        </Typography>
        <Button variant="contained" onClick={onBack} startIcon={<ArrowBackIcon />}>
          {strings.backToTemplates}
        </Button>
      </Paper>
    </Box>
  );
};
