import React, { type FC } from "react";
import { Box, Grid } from "@mui/material";
import { BaseCertificateElementForm } from "../base";
import { TextPropsForm } from "../textProps";
import { ActionButtons } from "../component/ActionButtons";
import { useAppTranslation } from "@/client/locale";
import type {
  GenderElementFormUpdateState,
  GenderElementFormErrors,
} from "./types";
import type { Font } from "@/client/graphql/generated/gql/graphql";
import type { UpdateStateFn } from "../types";
import type { BaseCertificateElementFormState } from "../base/types";
import type { TextPropsState } from "../textProps/types";

export interface GenderElementUpdateFormProps {
  // State
  state: GenderElementFormUpdateState;
  errors: GenderElementFormErrors;

  // Available fonts
  selfHostedFonts: Font[];

  // Locale
  locale: string;

  // Update functions
  updateBase: UpdateStateFn<GenderElementFormUpdateState["base"]>;
  updateTextProps: UpdateStateFn<GenderElementFormUpdateState["textProps"]>;

  // Actions
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export const GenderElementUpdateForm: FC<GenderElementUpdateFormProps> = ({
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

  // Ensure we have complete state objects for the child components
  const baseProps: BaseCertificateElementFormState = {
    id: state.id,
    name: state.base.name ?? "",
    description: state.base.description ?? "",
    positionX: state.base.positionX ?? 0,
    positionY: state.base.positionY ?? 0,
    width: state.base.width ?? 100,
    height: state.base.height ?? 50,
    alignment: state.base.alignment ?? "START",
    renderOrder: state.base.renderOrder ?? 0,
  };

  const textProps: TextPropsState = {
    fontRef: state.textProps.fontRef ?? { google: { identifier: "" } },
    color: state.textProps.color ?? "#000000",
    fontSize: state.textProps.fontSize ?? 12,
    overflow: state.textProps.overflow ?? "TRUNCATE",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Row 2: Scrollable Properties */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Grid container spacing={3}>
          {/* Left Column: Text Props */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextPropsForm
              textProps={textProps}
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
              baseProps={baseProps}
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
        submitLabel={strings.common.update}
        disabled={disabled}
      />
    </Box>
  );
};

