"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import {
  isNumberVariableDifferent,
  mapToTemplateNumberVariableCreateInput,
} from "@/client/utils/templateVariable";
import {
  TemplateNumberVariable,
  TemplateNumberVariableCreateInput,
  TemplateVariable,
} from "@/client/graphql/generated/gql/graphql";

type TemplateNumberVariableFormProps = {
  editingVariableID?: number;
  templateId: number;
  variables: TemplateVariable[];
  onCreate: (data: TemplateNumberVariableCreateInput) => Promise<void>;
  onUpdate: (
    data: TemplateNumberVariableCreateInput & { id: number },
  ) => Promise<void>;
};

const TemplateNumberVariableForm: React.FC<TemplateNumberVariableFormProps> = ({
  editingVariableID,
  templateId,
  variables,
  onCreate,
  onUpdate,
}) => {
  const editingVariable: TemplateNumberVariable | null = useMemo(() => {
    if (!editingVariableID) return null;
    return (
      (variables.find(
        (v) => v.id === editingVariableID,
      ) as TemplateNumberVariable) || null
    );
  }, [editingVariableID, variables]);

  const strings = useAppTranslation("templateVariableTranslations");

  const [state, setState] = useState<TemplateNumberVariableCreateInput>(() => {
    if (editingVariable) {
      return mapToTemplateNumberVariableCreateInput(editingVariable);
    }
    return {
      name: "",
      templateId: templateId,
      required: false,
    };
  });

  const handleChange = useCallback(
    (field: keyof TemplateNumberVariableCreateInput) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value;

        setState((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      },
    [],
  );

  const handleNumericChange = useCallback(
    (field: "minValue" | "maxValue" | "decimalPlaces") =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const numericValue = value === "" ? null : Number(value);

        setState((prevState) => ({
          ...prevState,
          [field]: numericValue,
        }));
      },
    [],
  );

  const handleSave = useCallback(async () => {
    try {
      if (editingVariableID) {
        await onUpdate({ id: editingVariableID, ...state });
      } else {
        await onCreate(state);
      }
    } catch {
      // Error handling is done in the operations hook
    }
  }, [state, editingVariableID, onCreate, onUpdate]);

  const isDifferentFromOriginal = useCallback((): boolean => {
    if (!editingVariableID) return true;

    if (!editingVariable) return false;

    return isNumberVariableDifferent(editingVariable, state);
  }, [editingVariableID, editingVariable, state]);

  const hasValidationError = !state.name;
  const hasChanges = editingVariableID ? isDifferentFromOriginal() : true;

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label={strings?.minimumValue ?? "Minimum Value"}
        value={state.name}
        onChange={handleChange("name")}
        error={!state.name}
        helperText={!state.name ? (strings?.required ?? "Required") : ""}
        required
        fullWidth
      />
      <TextField
        label={strings?.description ?? "Description"}
        value={state.description ?? ""}
        onChange={handleChange("description")}
        fullWidth
        multiline
        rows={3}
      />
      <TextField
        label={strings?.minimumValue ?? "Minimum Value"}
        type="number"
        value={state.minValue ?? ""}
        onChange={handleNumericChange("minValue")}
      />
      <TextField
        label={strings?.maximumValue ?? "Maximum Value"}
        type="number"
        value={state.maxValue ?? ""}
        onChange={handleNumericChange("maxValue")}
      />
      <TextField
        label={strings?.decimalPlaces ?? "Decimal Places"}
        type="number"
        value={state.decimalPlaces ?? ""}
        onChange={handleNumericChange("decimalPlaces")}
      />
      <TextField
        label={strings?.previewValue ?? "Preview Value"}
        value={state.previewValue ?? ""}
        onChange={handleChange("previewValue")}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.required ?? false}
            onChange={handleChange("required")}
          />
        }
        label={strings?.required ?? "Required"}
      />
      {/* <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button onClick={onDispose}>{strings?.cancel ?? "Cancel"}</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={hasValidationError || !hasChanges}
                >
                    {strings.save}
                </Button>
            </Box> */}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={hasValidationError || !hasChanges}
      >
        {editingVariableID
          ? (strings?.updateVariable ?? "Update Variable")
          : (strings?.createVariable ?? "Create Variable")}
      </Button>
    </Box>
  );
};

export default TemplateNumberVariableForm;
