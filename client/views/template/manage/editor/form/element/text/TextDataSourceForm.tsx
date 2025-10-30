import React, { type FC } from "react";
import { Box, Stack } from "@mui/material";
import type {
  TextDataSourceState,
  TextDataSourceType,
  TemplateTextVariable,
  TemplateSelectVariable,
  DataSourceFormErrors,
  UpdateDataSourceFn,
} from "./types";
import { DataSourceSelector } from "./TextDataSourceSelector";
import { StaticSourceInput } from "./TextStaticSourceInput";
import { StudentFieldSelector } from "./StudentTextFieldSelector";
import { CertificateFieldSelector } from "./CertificateTextFieldSelector";
import { TemplateTextVariableSelector } from "../TemplateTextVariableSelector";
import { TemplateSelectVariableSelector } from "../TemplateSelectVariableSelector";

interface DataSourceFormProps {
  dataSource: TextDataSourceState;
  textVariables: TemplateTextVariable[];
  selectVariables: TemplateSelectVariable[];
  onDataSourceChange: UpdateDataSourceFn;
  errors: DataSourceFormErrors;
  disabled?: boolean;
  showSelector: boolean;
}

export const DataSourceForm: FC<DataSourceFormProps> = ({
  dataSource,
  textVariables,
  selectVariables,
  onDataSourceChange,
  errors,
  disabled,
  showSelector,
}) => {
  const handleTypeChange = (type: TextDataSourceType) => {
    // Create new data source with default values based on type
    switch (type) {
      case "STATIC":
        onDataSourceChange({ type: "STATIC", value: "" });
        break;
      case "STUDENT_TEXT_FIELD":
        onDataSourceChange({
          type: "STUDENT_TEXT_FIELD",
          field: "STUDENT_NAME",
        });
        break;
      case "CERTIFICATE_TEXT_FIELD":
        onDataSourceChange({
          type: "CERTIFICATE_TEXT_FIELD",
          field: "VERIFICATION_CODE",
        });
        break;
      case "TEMPLATE_TEXT_VARIABLE":
        onDataSourceChange({
          type: "TEMPLATE_TEXT_VARIABLE",
          variableId: textVariables[0]?.id || 0,
        });
        break;
      case "TEMPLATE_SELECT_VARIABLE":
        onDataSourceChange({
          type: "TEMPLATE_SELECT_VARIABLE",
          variableId: selectVariables[0]?.id || 0,
        });
        break;
    }
  };

  const renderDataSourceInput = () => {
    switch (dataSource.type) {
      case "STATIC":
        return (
          <StaticSourceInput
            value={dataSource.value}
            onChange={(value) =>
              onDataSourceChange({ type: "STATIC", value })
            }
            error={errors.value}
            disabled={disabled}
          />
        );

      case "STUDENT_TEXT_FIELD":
        return (
          <StudentFieldSelector
            value={dataSource.field}
            onChange={(field) =>
              onDataSourceChange({ type: "STUDENT_TEXT_FIELD", field })
            }
            error={errors.field}
            disabled={disabled}
          />
        );

      case "CERTIFICATE_TEXT_FIELD":
        return (
          <CertificateFieldSelector
            value={dataSource.field}
            onChange={(field) =>
              onDataSourceChange({ type: "CERTIFICATE_TEXT_FIELD", field })
            }
            error={errors.field}
            disabled={disabled}
          />
        );

      case "TEMPLATE_TEXT_VARIABLE":
        return (
          <TemplateTextVariableSelector
            value={dataSource.variableId}
            variables={textVariables}
            onChange={(variableId) =>
              onDataSourceChange({ type: "TEMPLATE_TEXT_VARIABLE", variableId })
            }
            error={errors.variableId}
            disabled={disabled}
          />
        );

      case "TEMPLATE_SELECT_VARIABLE":
        return (
          <TemplateSelectVariableSelector
            value={dataSource.variableId}
            variables={selectVariables}
            onChange={(variableId) =>
              onDataSourceChange({
                type: "TEMPLATE_SELECT_VARIABLE",
                variableId,
              })
            }
            error={errors.variableId}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Stack spacing={2}>
      {showSelector && (
        <DataSourceSelector
          selectedType={dataSource.type}
          onTypeChange={handleTypeChange}
          disabled={disabled}
        />
      )}
      <Box>{renderDataSourceInput()}</Box>
    </Stack>
  );
};

