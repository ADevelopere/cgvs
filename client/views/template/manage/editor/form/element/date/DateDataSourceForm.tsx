import React, { useMemo, type FC } from "react";
import { Box, Stack } from "@mui/material";
import type { DateDataSourceFormErrors, UpdateDateDataSourceFn } from "./types";
import { DateDataSourceSelector } from "./DateDataSourceSelector";
import { DateStaticSourceInput } from "./DateStaticSourceInput";
import { StudentDateFieldSelector } from "./StudentDateFieldSelector";
import { CertificateDateFieldSelector } from "./CertificateDateFieldSelector";
import { TemplateDateVariableSelector } from "../variableSelector";
import {
  TemplateDateVariable,
  DateDataSourceInput,
  DateDataSourceType,
} from "@/client/graphql/generated/gql/graphql";

interface DateDataSourceFormProps {
  dataSource: DateDataSourceInput;
  dateVariables: TemplateDateVariable[];
  onDataSourceChange: UpdateDateDataSourceFn;
  errors: DateDataSourceFormErrors;
  disabled?: boolean;
  showSelector: boolean;
}

export const DateDataSourceForm: FC<DateDataSourceFormProps> = ({
  dataSource,
  dateVariables,
  onDataSourceChange,
  errors,
  disabled,
  showSelector,
}) => {
  const selectedType: DateDataSourceType = useMemo(() => {
    if (dataSource.certificateField?.field) return "CERTIFICATE_DATE_FIELD";
    if (dataSource.static?.value !== undefined) return "STATIC";
    if (dataSource.studentField?.field) return "STUDENT_DATE_FIELD";
    if (dataSource.templateVariable?.variableId)
      return "TEMPLATE_DATE_VARIABLE";
    return "STATIC";
  }, [dataSource]);

  const handleTypeChange = (type: DateDataSourceType) => {
    // Create new data source with default values based on type
    switch (type) {
      case "STATIC":
        onDataSourceChange({ static: { value: "" } });
        break;
      case "STUDENT_DATE_FIELD":
        onDataSourceChange({
          studentField: { field: "DATE_OF_BIRTH" },
        });
        break;
      case "CERTIFICATE_DATE_FIELD":
        onDataSourceChange({
          certificateField: { field: "RELEASE_DATE" },
        });
        break;
      case "TEMPLATE_DATE_VARIABLE":
        onDataSourceChange({
          templateVariable: { variableId: dateVariables[0]?.id || 0 },
        });
        break;
    }
  };

  const renderDataSourceInput = () => {
    switch (selectedType) {
      case "STATIC":
        return (
          <DateStaticSourceInput
            value={dataSource.static?.value || ""}
            onChange={value => onDataSourceChange({ static: { value } })}
            error={errors.static}
            disabled={disabled}
          />
        );

      case "STUDENT_DATE_FIELD":
        return (
          <StudentDateFieldSelector
            value={dataSource.studentField?.field || "DATE_OF_BIRTH"}
            onChange={field => onDataSourceChange({ studentField: { field } })}
            error={errors.studentField}
            disabled={disabled}
          />
        );

      case "CERTIFICATE_DATE_FIELD":
        return (
          <CertificateDateFieldSelector
            value={dataSource.certificateField?.field || "RELEASE_DATE"}
            onChange={field =>
              onDataSourceChange({ certificateField: { field } })
            }
            error={errors.certificateField}
            disabled={disabled}
          />
        );

      case "TEMPLATE_DATE_VARIABLE":
        return (
          <TemplateDateVariableSelector
            value={dataSource.templateVariable?.variableId}
            variables={dateVariables}
            onChange={variableId =>
              onDataSourceChange({ templateVariable: { variableId } })
            }
            error={errors.templateVariable}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Stack spacing={2}>
      {showSelector && (
        <DateDataSourceSelector
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          disabled={disabled}
        />
      )}
      <Box>{renderDataSourceInput()}</Box>
    </Stack>
  );
};
