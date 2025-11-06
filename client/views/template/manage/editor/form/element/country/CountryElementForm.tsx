import React, { type FC } from "react";
import { Box, Grid, Paper } from "@mui/material";
import type { CountryElementFormErrors, CountryElementFormState } from "./types";
import { CountryRepresentationSelector } from "./CountryRepresentationSelector";
import { TextPropsForm } from "../textProps/TextPropsForm";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { ActionButtons } from "../component/ActionButtons";
import { UpdateBaseElementFn } from "../base";
import { Font, CountryRepresentation } from "@/client/graphql/generated/gql/graphql";
import { UpdateTextPropsFn } from "../textProps";

interface CountryElementFormProps {
  state: CountryElementFormState;
  errors: CountryElementFormErrors;
  updateBaseElement: UpdateBaseElementFn;
  updateTextProps: UpdateTextPropsFn;
  updateRepresentation: (value: CountryRepresentation) => void;
  locale: string;
  selfHostedFonts: Font[];
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const CountryElementForm: FC<CountryElementFormProps> = ({
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
  submitLabel,
}) => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Scrollable Content */}
      <Box sx={{ flexGrow: 1, overflow: "auto", pb: 2 }}>
        {/* Row 1: Representation Selector */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <CountryRepresentationSelector
            value={state.countryProps.representation}
            onChange={updateRepresentation}
            error={errors.countryProps?.representation}
            disabled={isSubmitting}
          />
        </Paper>

        {/* Row 2: Text Props and Base Element */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <TextPropsForm
                textProps={state.textProps}
                language={locale}
                selfHostedFonts={selfHostedFonts}
                onTextPropsChange={updateTextProps}
                errors={errors.textProps}
                disabled={isSubmitting}
              />
            </Paper>
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
      <ActionButtons onSubmit={onSubmit} onCancel={onCancel} isSubmitting={isSubmitting} submitLabel={submitLabel} />
    </Box>
  );
};
