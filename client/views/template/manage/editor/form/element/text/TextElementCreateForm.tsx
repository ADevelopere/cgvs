import React, { type FC } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import type {
  TextElementFormErrors,
  UpdateDataSourceFn,
  TextElementFormCreateState,
} from "./types";
import { DataSourceForm } from "./TextDataSourceForm";
import { TextPropsForm } from "../textProps/TextPropsForm";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { ActionButtons } from "../../ActionButtons";
import { UpdateBaseElementCreateFn } from "../base";
import { UpdateTextPropsCreateFn } from "../textProps";
import {
  Font,
  TemplateSelectVariable,
  TemplateTextVariable,
} from "@/client/graphql/generated/gql/graphql";

interface TextElementCreateFormProps {
  state: TextElementFormCreateState;
  errors: TextElementFormErrors;
  updateBaseElement: UpdateBaseElementCreateFn;
  updateTextProps: UpdateTextPropsCreateFn;
  updateDataSource: UpdateDataSourceFn;
  templateId: number;
  locale: string;
  textVariables: TemplateTextVariable[];
  selectVariables: TemplateSelectVariable[];
  selfHostedFonts: Font[];
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const TextElementCreateForm: FC<TextElementCreateFormProps> = ({
  state,
  errors,
  updateBaseElement,
  updateTextProps,
  updateDataSource,
  locale,
  textVariables,
  selectVariables,
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
          <DataSourceForm
            dataSource={state.dataSource}
            textVariables={textVariables}
            selectVariables={selectVariables}
            onDataSourceChange={updateDataSource}
            errors={errors.dataSource}
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
        submitLabel={strings.common.create}
      />
    </Box>
  );
};
