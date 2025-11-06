import React, { type FC } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import type { TextElementFormErrors, TextElementFormState } from "./types";
import { TextDataSourceForm } from "./TextDataSourceForm";
import { TextPropsForm } from "../textProps/TextPropsForm";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { ActionButtons } from "../component/ActionButtons";
import {
  Font,
  TemplateSelectVariable,
  TemplateTextVariable,
  TextDataSourceInput,
} from "@/client/graphql/generated/gql/graphql";
import { UpdateBaseElementFn } from "../base";
import { UpdateTextPropsFn } from "../textProps";

interface TextElementFormProps {
  state: TextElementFormState;
  errors: TextElementFormErrors;
  updateBaseElement: UpdateBaseElementFn;
  updateTextProps: UpdateTextPropsFn;
  updateDataSource: (dataSource: TextDataSourceInput) => void;
  language: string;
  textVariables: TemplateTextVariable[];
  selectVariables: TemplateSelectVariable[];
  selfHostedFonts: Font[];
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  generalFormError?: string | null;
}

export const TextElementForm: FC<TextElementFormProps> = ({
  state,
  errors,
  updateBaseElement,
  updateTextProps,
  updateDataSource,
  language,
  textVariables,
  selectVariables,
  selfHostedFonts,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  generalFormError,
}) => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Scrollable Content */}
      <Box sx={{ flexGrow: 1, overflow: "auto", pb: 2 }}>
        {/* Row 1: Data Source */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <TextDataSourceForm
            dataSource={state.dataSource}
            textVariables={textVariables}
            selectVariables={selectVariables}
            updateDataSource={updateDataSource}
            errors={errors}
            disabled={isSubmitting}
            showSelector={true}
          />
        </Paper>

        {/* Row 2: Text Props and Base Element */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <TextPropsForm
                textProps={state.textProps}
                language={language}
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

      {/* generalFormError */}
      {generalFormError && (
        <Typography color="error" sx={{ mt: 1 }}>
          {generalFormError}
        </Typography>
      )}

      {/* Row 3: Action Buttons (Fixed) */}
      <ActionButtons onSubmit={onSubmit} onCancel={onCancel} isSubmitting={isSubmitting} submitLabel={submitLabel} />
    </Box>
  );
};
