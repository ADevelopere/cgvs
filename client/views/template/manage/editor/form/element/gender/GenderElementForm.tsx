import React, { type FC } from "react";
import { Box, Grid } from "@mui/material";
import { BaseCertificateElementForm, UpdateBaseElementFn } from "../base";
import { TextPropsForm, UpdateTextPropsFn } from "../textProps";
import { ActionButtons } from "../component/ActionButtons";
import type { GenderElementFormState, GenderElementFormErrors } from "./types";
import type { FontFamily } from "@/client/graphql/generated/gql/graphql";

export interface GenderElementFormProps {
  // State
  state: GenderElementFormState;
  errors: GenderElementFormErrors;

  // Available fonts
  fontFamilies: FontFamily[];

  // Locale
  locale: string;

  // Update functions
  updateBase: UpdateBaseElementFn;
  updateTextProps: UpdateTextPropsFn;

  // Actions
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
  submitLabel: string;
}

export const GenderElementForm: FC<GenderElementFormProps> = ({
  state,
  errors,
  fontFamilies,
  locale,
  updateBase,
  updateTextProps,
  onSubmit,
  onCancel,
  isSubmitting,
  disabled,
  submitLabel,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Row 2: Scrollable Properties */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Grid container spacing={3}>
          {/* Left Column: Text Props */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextPropsForm
              textProps={state.textProps}
              language={locale}
              fontFamilies={fontFamilies}
              onTextPropsChange={updateTextProps}
              errors={errors.textProps}
              disabled={disabled}
            />
          </Grid>

          {/* Right Column: Base Element */}
          <Grid size={{ xs: 12, md: 6 }}>
            <BaseCertificateElementForm
              baseProps={state.base}
              onFieldChange={updateBase}
              errors={errors.base}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Row 3: Action Buttons (Fixed) */}
      <ActionButtons
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        disabled={disabled}
      />
    </Box>
  );
};
