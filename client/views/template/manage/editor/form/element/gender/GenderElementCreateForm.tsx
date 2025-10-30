import React, { type FC } from "react";
import { Box, Grid } from "@mui/material";
import { BaseCertificateElementForm } from "../base";
import { TextPropsForm } from "../textProps";
import { ActionButtons } from "../component/ActionButtons";
import { useAppTranslation } from "@/client/locale";
import type {
  GenderElementFormCreateState,
  GenderElementFormErrors,
} from "./types";
import type { Font } from "@/client/graphql/generated/gql/graphql";
import type { UpdateStateFn } from "../types";

export interface GenderElementCreateFormProps {
  // State
  state: GenderElementFormCreateState;
  errors: GenderElementFormErrors;

  // Available fonts
  selfHostedFonts: Font[];

  // Locale
  locale: string;

  // Update functions
  updateBase: UpdateStateFn<GenderElementFormCreateState["base"]>;
  updateTextProps: UpdateStateFn<GenderElementFormCreateState["textProps"]>;

  // Actions
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export const GenderElementCreateForm: FC<GenderElementCreateFormProps> = ({
  state,
  errors,
  selfHostedFonts,
  locale,
  updateBase,
  updateTextProps,
  onSubmit,
  onCancel,
  isSubmitting,
  disabled,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Row 2: Scrollable Properties */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Grid container spacing={3}>
          {/* Left Column: Text Props */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextPropsForm
              textProps={state.textProps}
              locale={locale}
              selfHostedFonts={selfHostedFonts}
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
        submitLabel={strings.common.create}
        disabled={disabled}
      />
    </Box>
  );
};

