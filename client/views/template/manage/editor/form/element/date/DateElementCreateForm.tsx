import React, { type FC } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import type {
  DateElementFormErrors,
  UpdateDateDataSourceFn,
  DateElementFormCreateState,
  UpdateDatePropsFn,
} from "./types";
import { DateDataSourceForm } from "./DateDataSourceForm";
import { DatePropsForm } from "./DatePropsForm";
import { TextPropsForm } from "../textProps/TextPropsForm";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { ActionButtons } from "../component/ActionButtons";
import { UpdateBaseElementCreateFn } from "../base";
import { UpdateTextPropsCreateFn } from "../textProps";
import {
  Font,
  TemplateDateVariable,
} from "@/client/graphql/generated/gql/graphql";

interface DateElementCreateFormProps {
  state: DateElementFormCreateState;
  errors: DateElementFormErrors;
  updateBaseElement: UpdateBaseElementCreateFn;
  updateTextProps: UpdateTextPropsCreateFn;
  updateDateProps: UpdateDatePropsFn;
  updateDataSource: UpdateDateDataSourceFn;
  templateId: number;
  locale: string;
  dateVariables: TemplateDateVariable[];
  selfHostedFonts: Font[];
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const DateElementCreateForm: FC<DateElementCreateFormProps> = ({
  state,
  errors,
  updateBaseElement,
  updateTextProps,
  updateDateProps,
  updateDataSource,
  locale,
  dateVariables,
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
          <DateDataSourceForm
            dataSource={state.dataSource}
            dateVariables={dateVariables}
            onDataSourceChange={updateDataSource}
            errors={errors.dataSource}
            disabled={isSubmitting}
            showSelector={true}
          />
        </Paper>

        {/* Row 2: Date Props, Text Props, and Base Element */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <DatePropsForm
                dateProps={state.dateProps}
                onUpdate={updateDateProps}
                errors={errors.dateProps}
                disabled={isSubmitting}
              />
            </Paper>

            <Paper sx={{ p: 3 }}>
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

