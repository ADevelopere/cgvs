import React, { type FC } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useAppTranslation } from "@/client/locale";

interface ActionButtonsProps {
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  disabled?: boolean;
}

export const ActionButtons: FC<ActionButtonsProps> = ({ onSubmit, onCancel, isSubmitting, submitLabel, disabled }) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        position: "sticky",
        bottom: 0,
        backgroundColor: "background.paper",
        py: 2,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Button variant="outlined" onClick={onCancel} disabled={isSubmitting || disabled}>
        {strings.common.cancel}
      </Button>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={isSubmitting || disabled}
        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
      >
        {isSubmitting
          ? submitLabel === strings.common.create
            ? strings.common.creating
            : strings.common.updating
          : submitLabel}
      </Button>
    </Box>
  );
};
