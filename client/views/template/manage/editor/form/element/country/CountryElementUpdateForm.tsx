import React, { type FC } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import type { CountryElementFormUpdateState, CountryElementFormErrors } from "./types";
import { CountryRepresentationSelector } from "./CountryRepresentationSelector";
import { TextPropsForm } from "../textProps/TextPropsForm";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { ActionButtons } from "../component/ActionButtons";
import { UpdateBaseElementUpdateFn } from "../base";
import { UpdateTextPropsUpdateFn } from "../textProps";
import { Font, CountryRepresentation } from "@/client/graphql/generated/gql/graphql";

interface CountryElementUpdateFormProps {
  state: CountryElementFormUpdateState;
  errors: CountryElementFormErrors;
  updateBaseElement: UpdateBaseElementUpdateFn;
  updateTextProps: UpdateTextPropsUpdateFn;
  updateRepresentation: (value?: CountryRepresentation) => void;
  locale: string;
  selfHostedFonts: Font[];
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const CountryElementUpdateForm: FC<CountryElementUpdateFormProps> = ({
  state,
  errors,
  updateBaseElement,
  updateTextProps,
  updateRepresentation,
  locale,
  selfHostedFonts,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Scrollable Content */}
      <Box sx={{ flexGrow: 1, overflow: "auto", pb: 2 }}>
        {/* Row 1: Representation Selector */}
        {state.representation && (
          <Paper sx={{ p: 3, mb: 2 }}>
            <CountryRepresentationSelector
              value={state.representation}
              onChange={updateRepresentation}
              error={errors.representation}
              disabled={isSubmitting}
            />
          </Paper>
        )}

        {/* Row 2: Text Props and Base Element */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            {state.textProps && (
              <Paper sx={{ p: 3, height: "100%" }}>
                <TextPropsForm
                  textProps={state.textProps}
                  locale={locale}
                  selfHostedFonts={selfHostedFonts}
                  onTextPropsChange={updateTextProps}
                  errors={errors.textProps}
                  disabled={isSubmitting}
                />
              </Paper>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <BaseCertificateElementForm
                baseProps={state.base}
                onFieldChange={updateBaseElement}
                errors={errors.base}
                disabled={isSubmitting}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Row 3: Action Buttons (Fixed) */}
      <ActionButtons
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitLabel={strings.common.update}
      />
    </Box>
  );
};

