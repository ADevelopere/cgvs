import React, { useMemo, type FC } from "react";
import { Box, Stack } from "@mui/material";
import type { TextDataSourceFormErrors, UpdateTextDataSourceFn } from "./types";
import { DataSourceSelector } from "./TextDataSourceSelector";
import { TextStaticSourceInput } from "./TextStaticSourceInput";
import { StudentFieldSelector } from "./StudentTextFieldSelector";
import { CertificateFieldSelector } from "./CertificateTextFieldSelector";
import {
  TemplateTextVariableSelector,
  TemplateSelectVariableSelector,
} from "../variableSelector";
import {
  TemplateSelectVariable,
  TemplateTextVariable,
  TextDataSourceInput,
  TextDataSourceType,
} from "@/client/graphql/generated/gql/graphql";

interface DataSourceFormProps {
  dataSource: TextDataSourceInput;
  textVariables: TemplateTextVariable[];
  selectVariables: TemplateSelectVariable[];
  onDataSourceChange: UpdateTextDataSourceFn;
  errors: TextDataSourceFormErrors;
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
  const selectedType: TextDataSourceType = useMemo(() => {
    if (dataSource.certificateField?.field) return "CERTIFICATE_TEXT_FIELD";
    if (dataSource.static?.value) return "STATIC";
    if (dataSource.studentField?.field) return "STUDENT_TEXT_FIELD";
    if (dataSource.templateTextVariable?.variableId)
      return "TEMPLATE_TEXT_VARIABLE";
    if (dataSource.templateSelectVariable?.variableId)
      return "TEMPLATE_SELECT_VARIABLE";
    throw new Error("Invalid data source type");
  }, [dataSource]);

  const handleTypeChange = (type: TextDataSourceType) => {
    // Create new data source with default values based on type
    switch (type) {
      case "STATIC":
        onDataSourceChange({ static: { value: "" } });
        break;
      case "STUDENT_TEXT_FIELD":
        onDataSourceChange({
          studentField: { field: "STUDENT_NAME" },
        });
        break;
      case "CERTIFICATE_TEXT_FIELD":
        onDataSourceChange({
          certificateField: { field: "VERIFICATION_CODE" },
        });
        break;
      case "TEMPLATE_TEXT_VARIABLE":
        onDataSourceChange({
          templateTextVariable: { variableId: textVariables[0]?.id || 0 },
        });
        break;
      case "TEMPLATE_SELECT_VARIABLE":
        onDataSourceChange({
          templateSelectVariable: { variableId: selectVariables[0]?.id || 0 },
        });
        break;
    }
  };

  const renderDataSourceInput = () => {
    switch (selectedType) {
      case "STATIC":
        return (
          <TextStaticSourceInput
            value={dataSource.static?.value || ""}
            onChange={value => onDataSourceChange({ static: { value } })}
            error={errors.static}
            disabled={disabled}
          />
        );

      case "STUDENT_TEXT_FIELD":
        return (
          <StudentFieldSelector
            value={dataSource.studentField?.field || "STUDENT_NAME"}
            onChange={field => onDataSourceChange({ studentField: { field } })}
            error={errors.studentField}
            disabled={disabled}
          />
        );

      case "CERTIFICATE_TEXT_FIELD":
        return (
          <CertificateFieldSelector
            value={dataSource.certificateField?.field || "VERIFICATION_CODE"}
            onChange={field =>
              onDataSourceChange({ certificateField: { field } })
            }
            error={errors.certificateField}
            disabled={disabled}
          />
        );

      case "TEMPLATE_TEXT_VARIABLE":
        return (
          <TemplateTextVariableSelector
            value={dataSource.templateTextVariable?.variableId}
            variables={textVariables}
            onChange={variableId =>
              onDataSourceChange({ templateTextVariable: { variableId } })
            }
            error={errors.templateTextVariable}
            disabled={disabled}
          />
        );

      case "TEMPLATE_SELECT_VARIABLE":
        return (
          <TemplateSelectVariableSelector
            value={dataSource.templateSelectVariable?.variableId}
            variables={selectVariables}
            onChange={variableId =>
              onDataSourceChange({
                templateSelectVariable: { variableId },
              })
            }
            error={errors.templateSelectVariable}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Stack spacing={2}>
      {showSelector && (
        <DataSourceSelector
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          disabled={disabled}
        />
      )}
      <Box>{renderDataSourceInput()}</Box>
    </Stack>
  );
};
