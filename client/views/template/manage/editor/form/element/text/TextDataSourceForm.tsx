import React, { useMemo, type FC } from "react";
import { Box, Stack } from "@mui/material";
import type {  TextDataSourceFormErrors } from "./types";
import { DataSourceSelector } from "./TextDataSourceSelector";
import { TextStaticSourceInput } from "./TextStaticSourceInput";
import { StudentFieldSelector } from "./StudentTextFieldSelector";
import { CertificateFieldSelector } from "./CertificateTextFieldSelector";
import {
  TemplateTextVariableSelector,
  TemplateSelectVariableSelector,
} from "../variableSelector";
import {
  CertificateTextField,
  StudentTextField,
  TemplateSelectVariable,
  TemplateTextVariable,
  TextDataSourceInput,
  TextDataSourceType,
} from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";

interface DataSourceFormProps {
  dataSource: TextDataSourceInput;
  textVariables: TemplateTextVariable[];
  selectVariables: TemplateSelectVariable[];
  updateDataSource: (dataSource: TextDataSourceInput) => void;
  errors: TextDataSourceFormErrors;
  disabled?: boolean;
  showSelector: boolean;
}

export const DataSourceForm: FC<DataSourceFormProps> = ({
  dataSource,
  textVariables,
  selectVariables,
  updateDataSource,
  errors,
  disabled,
  showSelector,
}) => {
  logger.info("[DataSourceForm], errors:", errors);
  logger.info("[DataSourceForm], dataSource:", dataSource);
  const selectedType: TextDataSourceType = useMemo(() => {
    if (dataSource.certificateField)
      return TextDataSourceType.CertificateTextField;
    if (dataSource.static) return TextDataSourceType.Static;
    if (dataSource.studentField) return TextDataSourceType.StudentTextField;
    if (dataSource.templateTextVariable)
      return TextDataSourceType.TemplateTextVariable;
    if (dataSource.templateSelectVariable)
      return TextDataSourceType.TemplateSelectVariable;
    throw new Error("Invalid data source type");
  }, [dataSource]);

  const handleTypeChange = (type: TextDataSourceType) => {
    // Create new data source with default values based on type
    switch (type) {
      case TextDataSourceType.Static:
        updateDataSource({ static: { value: "" } });
        break;
      case TextDataSourceType.StudentTextField:
        updateDataSource({
          studentField: { field: StudentTextField.StudentName },
        });
        break;
      case TextDataSourceType.CertificateTextField:
        updateDataSource({
          certificateField: { field: CertificateTextField.VerificationCode },
        });
        break;
      case TextDataSourceType.TemplateTextVariable:
        updateDataSource({
          templateTextVariable: { variableId: textVariables[0]?.id || 0 },
        });
        break;
      case TextDataSourceType.TemplateSelectVariable:
        updateDataSource({
          templateSelectVariable: { variableId: selectVariables[0]?.id || 0 },
        });
        break;
    }
  };

  const renderDataSourceInput = () => {
    switch (selectedType) {
      case TextDataSourceType.Static:
        return (
          <TextStaticSourceInput
            value={dataSource.static?.value || ""}
            onChange={value => updateDataSource({ static: { value } })}
            error={errors.dataSource?.static}
            disabled={disabled}
          />
        );

      case TextDataSourceType.StudentTextField:
        return (
          <StudentFieldSelector
            value={
              dataSource.studentField?.field || StudentTextField.StudentName
            }
            onChange={field => updateDataSource({ studentField: { field } })}
            error={errors.dataSource?.studentField}
            disabled={disabled}
          />
        );

      case TextDataSourceType.CertificateTextField:
        return (
          <CertificateFieldSelector
            value={
              dataSource.certificateField?.field ||
              CertificateTextField.VerificationCode
            }
            onChange={field =>
              updateDataSource({ certificateField: { field } })
            }
            error={errors.dataSource?.certificateField}
            disabled={disabled}
          />
        );

      case TextDataSourceType.TemplateTextVariable:
        return (
          <TemplateTextVariableSelector
            value={dataSource.templateTextVariable?.variableId}
            variables={textVariables}
            onChange={variableId =>
              updateDataSource({ templateTextVariable: { variableId } })
            }
            error={errors.dataSource?.templateTextVariable}
            disabled={disabled}
          />
        );

      case TextDataSourceType.TemplateSelectVariable:
        return (
          <TemplateSelectVariableSelector
            value={dataSource.templateSelectVariable?.variableId}
            variables={selectVariables}
            onChange={variableId =>
              updateDataSource({
                templateSelectVariable: { variableId },
              })
            }
            error={errors.dataSource?.templateSelectVariable}
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
          textVariablesDisabled={textVariables.length === 0}
          selectVariablesDisabled={selectVariables.length === 0}
        />
      )}
      <Box>{renderDataSourceInput()}</Box>
    </Stack>
  );
};
