import React, { useState, useCallback, useMemo } from "react";
import {
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useTemplateVariableManagement } from "@/contexts/templateVariable/TemplateVariableManagementContext";
import type { CreateDateTemplateVariableInput, TemplateDateVariable } from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";
import { mapToCreateDateTemplateVariableInput } from "@/utils/templateVariable/date-template-variable-mappers";
import { isDateVariableDifferent } from "@/utils/templateVariable/templateVariable";

// Helper function for date validation
const isDateValid = (dateStr: string | null): boolean => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

type DateTemplateVariableFormProps = {
    editingVariableID?: string;
    onDispose: () => void;
};

const DateTemplateVariableForm: React.FC<DateTemplateVariableFormProps> = ({
    onDispose,
    editingVariableID,
}) => {
    const { template } = useTemplateManagement();

    const editingVariable: TemplateDateVariable | null = useMemo(() => {
        if (!template || !editingVariableID) return null;

        return (
            template.variables.find((v) => v.id === editingVariableID) ?? null
        );
    }, [template, editingVariableID]);

    const { createDateTemplateVariable, updateDateTemplateVariable } =
        useTemplateVariableManagement();

    const strings = useAppTranslation("templateVariableTranslations");

    const [state, setState] = useState<CreateDateTemplateVariableInput>(() => {
        if (editingVariable) {
            return mapToCreateDateTemplateVariableInput(editingVariable);
        }
        return {
            name: "",
            template_id: template?.id ?? "",
            order: 0,
        };
    });

    const handleChange = useCallback(
        (field: keyof CreateDateTemplateVariableInput) =>
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

    const handleDateChange = useCallback(
        (field: "min_date" | "max_date" | "preview_value") =>
            (date: Date | null) => {
                setState((prevState) => ({
                    ...prevState,
                    [field]: date ? date.toISOString().split("T")[0] : null,
                }));
            },
        [],
    );

    const handleSave = useCallback(async () => {
        let success = false;

        if (editingVariableID) {
            success = await updateDateTemplateVariable({
                input: {
                    ...state,
                    id: editingVariableID,
                },
            });
        } else {
            success = await createDateTemplateVariable({
                input: {
                    ...state,
                },
            });
        }

        if (success) {
            onDispose();
        }
    }, [
        state,
        editingVariableID,
        createDateTemplateVariable,
        updateDateTemplateVariable,
        onDispose,
    ]);

    const isDifferentFromOriginal = useCallback((): boolean => {
        if (!editingVariableID) {
            return false;
        }

        if (!editingVariable) {
            return true;
        }


        return isDateVariableDifferent(editingVariable, state);
    }, [editingVariableID, editingVariable, state]);

    const minDateError = state.min_date && !isDateValid(state.min_date);
    const maxDateError = state.max_date && !isDateValid(state.max_date);
    const previewValueError =
        state.preview_value &&
        (!isDateValid(state.preview_value) ||
            (state.min_date &&
                new Date(state.preview_value) < new Date(state.min_date)) ||
            (state.max_date &&
                new Date(state.preview_value) > new Date(state.max_date)));

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
                value={state.min_date ? new Date(state.min_date) : null}
                onChange={(date) => handleDateChange("min_date")(date)}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: minDateError,
                        helperText: minDateError
                            ? strings?.invalidDateError ?? "Invalid date format"
                            : undefined,
                    },
                }}
            />

            <DatePicker
                label={strings?.maximumDate ?? "Maximum Date"}
                value={state.max_date ? new Date(state.max_date) : null}
                onChange={(date) => handleDateChange("max_date")(date)}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: maxDateError,
                        helperText: maxDateError
                            ? strings?.invalidDateError ?? "Invalid date format"
                            : undefined,
                    },
                }}
            />

            <DatePicker
                label={strings?.previewValue ?? "Preview Value"}
                value={state.preview_value ? new Date(state.preview_value) : null}
                onChange={(date) => handleDateChange("preview_value")(date)}
                minDate={state.min_date ? new Date(state.min_date) : undefined}
                maxDate={state.max_date ? new Date(state.max_date) : undefined}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: previewValueError,
                        helperText: previewValueError
                            ? strings?.invalidDateError ??
                              "Preview date must be within min and max dates"
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
                    ? strings?.updateVariable ?? "Update Variable"
                    : strings?.createVariable ?? "Create Variable"}
            </Button>
        </Box>
    );
};

export default DateTemplateVariableForm;
