import { FC, useCallback, useMemo } from "react";
import { Box, TextField, FormControlLabel, Checkbox, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useTemplateVariableManagement } from "@/contexts/templateVariable/TemplateVariableManagementContext";
import type {
    CreateDateTemplateVariableInput,
    UpdateDateTemplateVariableInput,
} from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";

const isDateValid = (dateStr: string | null) => {
    if (!dateStr) return true;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

const DateTemplateVariableForm: FC = () => {
    const {
        formPaneState,
        createFormData,
        getTemporaryValue,
        setCreateFormData,
        setTemporaryValue,
        createDateTemplateVariable,
        updateDateTemplateVariable,
    } = useTemplateVariableManagement();
    const { template } = useTemplateManagement();

    const { mode, editingVariable } = formPaneState;
    const isEditMode = mode === "edit";

    // Get the current form values based on mode
    const currentValues = useMemo(() => {
        return isEditMode && editingVariable
            ? (getTemporaryValue(
                  editingVariable.id,
              ) as Partial<UpdateDateTemplateVariableInput>)
            : (createFormData.values as Partial<CreateDateTemplateVariableInput>);
    }, [isEditMode, editingVariable, createFormData, getTemporaryValue]);

    const value: Partial<CreateDateTemplateVariableInput> = useMemo(() => {
        return currentValues ?? {};
    }, [currentValues]);

    const handleChange = useCallback(
        (field: keyof CreateDateTemplateVariableInput) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue =
                    event.target.type === "checkbox"
                        ? event.target.checked
                        : event.target.value;

                const updatedValues = {
                    ...value,
                    [field]: newValue,
                };

                if (isEditMode && editingVariable) {
                    setTemporaryValue(
                        editingVariable.id,
                        updatedValues as UpdateDateTemplateVariableInput,
                    );
                } else {
                    setCreateFormData({
                        type: "date",
                        values: updatedValues as CreateDateTemplateVariableInput,
                    });
                }
            },
        [
            isEditMode,
            editingVariable,
            value,
            setCreateFormData,
            setTemporaryValue,
        ],
    );

    const handleDateChange = useCallback(
        (field: "preview_value" | "min_date" | "max_date") =>
            (date: Date | null) => {
                const updatedValues = {
                    ...value,
                    [field]: date ? date.toISOString() : null,
                };

                if (isEditMode && editingVariable) {
                    setTemporaryValue(
                        editingVariable.id,
                        updatedValues as UpdateDateTemplateVariableInput,
                    );
                } else {
                    setCreateFormData({
                        type: "date",
                        values: updatedValues as CreateDateTemplateVariableInput,
                    });
                }
            },
        [
            isEditMode,
            editingVariable,
            value,
            setCreateFormData,
            setTemporaryValue,
        ],
    );

    const minDateError = useMemo(() => {
        return value.min_date && !isDateValid(value.min_date);
    }, [value.min_date]);

    const maxDateError = useMemo(() => {
        return value.max_date && !isDateValid(value.max_date);
    }, [value.max_date]);

    const previewValueError = useMemo(() => {
        return (
            value.preview_value &&
            (!isDateValid(value.preview_value) ||
                (value.min_date &&
                    new Date(value.preview_value) < new Date(value.min_date)) ||
                (value.max_date &&
                    new Date(value.preview_value) > new Date(value.max_date)))
        );
    }, [value.preview_value, value.min_date, value.max_date]);

    const handleSave = useCallback(async () => {
        if (!template) {
            console.error("Template is not defined");
            return;
        }
        const formValue = value as CreateDateTemplateVariableInput;
        let success = false;

        if (isEditMode && editingVariable) {
            success = await updateDateTemplateVariable({
                input: {
                    ...formValue,
                    id: editingVariable.id,
                    template_id: template.id,
                },
            });
            if (success) {
                // Clear temporary value after successful update
                setTemporaryValue(editingVariable.id, null);
            }
        } else {
            success = await createDateTemplateVariable({
                input: {
                    ...formValue,
                    template_id: template.id,
                },
            });
            if (success) {
                // Clear create form data after successful creation
                setCreateFormData({ type: null, values: null });
            }
        }
    }, [
        value,
        isEditMode,
        editingVariable,
        createDateTemplateVariable,
        updateDateTemplateVariable,
        setTemporaryValue,
        setCreateFormData,
        template
    ]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
                label="Name"
                value={value.name ?? ""}
                onChange={handleChange("name")}
                fullWidth
                required
            />

            <TextField
                label="Description"
                value={value.description ?? ""}
                onChange={handleChange("description")}
                fullWidth
                multiline
                rows={3}
            />

            <TextField
                label="Date Format"
                value={value.format ?? ""}
                onChange={handleChange("format")}
                fullWidth
                placeholder="e.g., YYYY-MM-DD"
                helperText="Format string for date display (e.g., YYYY-MM-DD, DD/MM/YYYY)"
            />

            <DatePicker
                label="Preview Value"
                value={
                    value.preview_value ? new Date(value.preview_value) : null
                }
                onChange={handleDateChange("preview_value")}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: previewValueError,
                        helperText: previewValueError
                            ? "Invalid date or outside min/max range"
                            : undefined,
                    },
                }}
            />

            <DatePicker
                label="Minimum Date"
                value={value.min_date ? new Date(value.min_date) : null}
                onChange={handleDateChange("min_date")}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: minDateError,
                        helperText: minDateError ? "Invalid date" : undefined,
                    },
                }}
            />

            <DatePicker
                label="Maximum Date"
                value={value.max_date ? new Date(value.max_date) : null}
                onChange={handleDateChange("max_date")}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: maxDateError,
                        helperText: maxDateError ? "Invalid date" : undefined,
                    },
                }}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={value.required ?? false}
                        onChange={handleChange("required")}
                    />
                }
                label="Required"
            />

            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!value.name} // Disable if name is not provided since it's required
            >
                {isEditMode ? "Update" : "Create"} Variable
            </Button>
        </Box>
    );
};

export default DateTemplateVariableForm;
