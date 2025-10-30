import React, { type FC } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import type {
  NumberElementFormErrors,
  UpdateDataSourceFn,
  UpdateMappingFn,
  NumberElementFormUpdateState,
} from "./types";
import { TextPropsForm } from "../textProps/TextPropsForm";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { ActionButtons } from "../component/ActionButtons";
import { UpdateBaseElementUpdateFn } from "../base";
import { UpdateTextPropsUpdateFn } from "../textProps";
import {
  Font,
  TemplateNumberVariable,
} from "@/client/graphql/generated/gql/graphql";
import { TemplateNumberVariableSelector } from "../variableSelector";
import { NumberMappingInput } from "./NumberMappingInput";

interface NumberElementUpdateFormProps {
  state: NumberElementFormUpdateState;
  errors: NumberElementFormErrors;
  updateBaseElement: UpdateBaseElementUpdateFn;
  updateTextProps: UpdateTextPropsUpdateFn;
  updateDataSource: UpdateDataSourceFn;
  updateMapping: UpdateMappingFn;
  templateId: number;
  locale: string;
  numberVariables: TemplateNumberVariable[];
  selfHostedFonts: Font[];
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const NumberElementUpdateForm: FC<NumberElementUpdateFormProps> = ({
  state,
  errors,
  updateBaseElement,
  updateTextProps,
  updateDataSource,
  updateMapping,
  locale,
  numberVariables,
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
        {/* Row 1: Data Source */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {strings.numberElement.dataSourceLabel}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TemplateNumberVariableSelector
                value={state.dataSource.variableId}
                onChange={(variableId) =>
                  updateDataSource({ variableId: variableId ?? 0 })
                }
                numberVariables={numberVariables}
                error={errors.dataSource.variableId}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <NumberMappingInput
                value={state.mapping}
                onChange={updateMapping}
                errors={errors.mapping}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Row 2: Text Props and Base Element */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
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

