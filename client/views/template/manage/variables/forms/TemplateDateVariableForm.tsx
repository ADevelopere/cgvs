"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useAppTranslation } from "@/client/locale";
import {
  TemplateDateVariable,
  TemplateDateVariableCreateInput,
  TemplateVariable,
} from "@/client/graphql/generated/gql/graphql";
import {
  mapToTemplateDateVariableCreateInput,
  isDateVariableDifferent,
} from "@/client/utils/templateVariable";

// Helper function for date validation
const isDateValid = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

type TemplateDateVariableFormProps = {
  editingVariableID?: number;
  templateId: number;
  variables: TemplateVariable[];
  onCreate: (data: TemplateDateVariableCreateInput) => Promise<void>;
  onUpdate: (
    data: TemplateDateVariableCreateInput & { id: number }
  ) => Promise<void>;
};

const TemplateDateVariableForm: React.FC<TemplateDateVariableFormProps> = ({
  editingVariableID,
  templateId,
  variables,
  onCreate,
  onUpdate,
}) => {
  const editingVariable: TemplateDateVariable | null = useMemo(() => {
    if (!editingVariableID) return null;
    return (
      (variables.find(
        v => v.id === editingVariableID
      ) as TemplateDateVariable) || null
    );
  }, [editingVariableID, variables]);

  const strings = useAppTranslation("templateVariableTranslations");

  const [state, setState] = useState<TemplateDateVariableCreateInput>(() => {
    if (editingVariable) {
      return mapToTemplateDateVariableCreateInput(editingVariable);
    }
    return {
      name: "",
      templateId: templateId,
      required: false,
    };
  });

  const handleChange = useCallback(
    (field: keyof TemplateDateVariableCreateInput) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value;

        setState(prevState => ({
          ...prevState,
          [field]: value,
        }));
      },
    []
  );

  const handleDateChange = useCallback(
    (field: "minDate" | "maxDate" | "previewValue") => (date: Date | null) => {
      setState(prevState => ({
        ...prevState,
        [field]: date ? date.toISOString().split("T")[0] : null,
      }));
    },
    []
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
    if (!editingVariableID) {
      return false;
    }

    if (!editingVariable) {
      return true;
    }

    return isDateVariableDifferent(editingVariable, state);
  }, [editingVariableID, editingVariable, state]);

  const minDateError = state.minDate && !isDateValid(state.minDate);
  const maxDateError = state.maxDate && !isDateValid(state.maxDate);
  const previewValueError =
    state.previewValue &&
    (!isDateValid(state.previewValue) ||
      (state.minDate &&
        new Date(state.previewValue) < new Date(state.minDate)) ||
      (state.maxDate &&
        new Date(state.previewValue) > new Date(state.maxDate)));

  const hasValidationError =
    !state.name || minDateError || maxDateError || previewValueError;
  const hasChanges = editingVariableID ? isDifferentFromOriginal() : true;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      tabIndex={-1}
    >
      <TextField
        label={strings?.name ?? "Name"}
        value={state.name}
        onChange={handleChange("name")}
        fullWidth
        required
      />

      <TextField
        label={strings?.description ?? "Description"}
        value={state.description}
        onChange={handleChange("description")}
        fullWidth
        multiline
        rows={3}
      />

      <TextField
        label={strings?.format ?? "Format"}
        value={state.format}
        onChange={handleChange("format")}
        fullWidth
        helperText={
          strings?.formatHelperText ??
          "Date format (e.g., YYYY-MM-DD, DD.MM.YYYY)"
        }
      />

      <DatePicker
        label={strings?.minimumDate ?? "Minimum Date"}
        value={state.minDate ? new Date(state.minDate) : null}
        onChange={date => handleDateChange("minDate")(date)}
        slotProps={{
          textField: {
            fullWidth: true,
            error: minDateError,
            helperText: minDateError
              ? (strings?.invalidDateError ?? "Invalid date format")
              : undefined,
          },
        }}
      />

      <DatePicker
        label={strings?.maximumDate ?? "Maximum Date"}
        value={state.maxDate ? new Date(state.maxDate) : null}
        onChange={date => handleDateChange("maxDate")(date)}
        slotProps={{
          textField: {
            fullWidth: true,
            error: maxDateError,
            helperText: maxDateError
              ? (strings?.invalidDateError ?? "Invalid date format")
              : undefined,
          },
        }}
      />

      <DatePicker
        label={strings?.previewValue ?? "Preview Value"}
        value={state.previewValue ? new Date(state.previewValue) : null}
        onChange={date => handleDateChange("previewValue")(date)}
        minDate={state.minDate ? new Date(state.minDate) : undefined}
        maxDate={state.maxDate ? new Date(state.maxDate) : undefined}
        slotProps={{
          textField: {
            fullWidth: true,
            error: previewValueError,
            helperText: previewValueError
              ? (strings?.invalidDateError ??
                "Preview date must be within min and max dates")
              : undefined,
          },
        }}
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

export default TemplateDateVariableForm;
