import { useMemo, type FC } from "react";
import { Box, Stack } from "@mui/material";
import type { DateDataSourceFieldErrors } from "./types";
import { DateDataSourceSelector } from "./DateDataSourceSelector";
import { DateStaticSourceInput } from "./DateStaticSourceInput";
import { StudentDateFieldSelector } from "./StudentDateFieldSelector";
import { CertificateDateFieldSelector } from "./CertificateDateFieldSelector";
import { TemplateDateVariableSelector } from "../variableSelector";
import * as GQL from "@/client/graphql/generated/gql/graphql";

interface DateDataSourceFormProps {
  dataSource: GQL.DateDataSourceInput;
  dateVariables: GQL.TemplateDateVariable[];
  onDataSourceChange: (dataSource: GQL.DateDataSourceInput) => void;
  errors: DateDataSourceFieldErrors;
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
  const selectedType: GQL.DateDataSourceType = useMemo(() => {
    if (dataSource.certificateField?.field)
      return GQL.DateDataSourceType.CertificateDateField;
    if (dataSource.static?.value !== undefined)
      return GQL.DateDataSourceType.Static;
    if (dataSource.studentField?.field)
      return GQL.DateDataSourceType.StudentDateField;
    if (dataSource.templateVariable?.variableId)
      return GQL.DateDataSourceType.TemplateDateVariable;
    return GQL.DateDataSourceType.Static;
  }, [dataSource]);

  const handleTypeChange = (type: GQL.DateDataSourceType) => {
    // Create new data source with default values based on type
    switch (type) {
      case GQL.DateDataSourceType.Static:
        onDataSourceChange({ static: { value: "" } });
        break;
      case GQL.DateDataSourceType.StudentDateField:
        onDataSourceChange({
          studentField: { field: GQL.StudentDateField.DateOfBirth },
        });
        break;
      case GQL.DateDataSourceType.CertificateDateField:
        onDataSourceChange({
          certificateField: { field: GQL.CertificateDateField.ReleaseDate },
        });
        break;
      case GQL.DateDataSourceType.TemplateDateVariable:
        onDataSourceChange({
          templateVariable: { variableId: dateVariables[0]?.id || 0 },
        });
        break;
    }
  };

  const renderDataSourceInput = () => {
    switch (selectedType) {
      case GQL.DateDataSourceType.Static:
        return (
          <DateStaticSourceInput
            value={dataSource.static?.value || ""}
            onChange={value => onDataSourceChange({ static: { value } })}
            error={errors.static}
            disabled={disabled}
          />
        );

      case GQL.DateDataSourceType.StudentDateField:
        return (
          <StudentDateFieldSelector
            value={
              dataSource.studentField?.field || GQL.StudentDateField.DateOfBirth
            }
            onChange={field => onDataSourceChange({ studentField: { field } })}
            error={errors.studentField}
            disabled={disabled}
          />
        );

      case GQL.DateDataSourceType.CertificateDateField:
        return (
          <CertificateDateFieldSelector
            value={
              dataSource.certificateField?.field ||
              GQL.CertificateDateField.ReleaseDate
            }
            onChange={field =>
              onDataSourceChange({ certificateField: { field } })
            }
            error={errors.certificateField}
            disabled={disabled}
          />
        );

      case GQL.DateDataSourceType.TemplateDateVariable:
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
          dateVariablesDisabled={dateVariables.length === 0}
        />
      )}
      <Box>{renderDataSourceInput()}</Box>
    </Stack>
  );
};
