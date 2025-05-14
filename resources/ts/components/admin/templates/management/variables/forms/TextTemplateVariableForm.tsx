import { FC, useCallback, useMemo } from "react";
import {
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";
import { useTemplateVariableManagement } from "@/contexts/templateVariable/TemplateVariableManagementContext";
import type {
    CreateTextTemplateVariableInput,
    UpdateTextTemplateVariableInput,
} from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";

const TextTemplateVariableForm: FC = () => {
    const {
        formPaneState,
        createFormData,
        getTemporaryValue,
        setCreateFormData,
        setTemporaryValue,
        createTextTemplateVariable,
        updateTextTemplateVariable,
    } = useTemplateVariableManagement();
    const { template } = useTemplateManagement();

    const { mode, editingVariable } = formPaneState;
    const isEditMode = mode === "edit";

    // Get the current form values based on mode
    const currentValues = useMemo(() => {
        return isEditMode && editingVariable
            ? (getTemporaryValue(
                  editingVariable.id,
              ) as Partial<UpdateTextTemplateVariableInput>)
            : (createFormData.values as Partial<CreateTextTemplateVariableInput>);
    }, [isEditMode, editingVariable, createFormData, getTemporaryValue]);

    const value: Partial<CreateTextTemplateVariableInput> = useMemo(() => {
        return currentValues ?? {};
    }, [currentValues]);

    const handleChange = useCallback(
        (field: keyof CreateTextTemplateVariableInput) =>
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
                    // In edit mode, update the temporary value
                    setTemporaryValue(
                        editingVariable.id,
                        updatedValues as UpdateTextTemplateVariableInput,
                    );
                } else {
                    // In create mode, update the create form data
                    setCreateFormData({
                        type: "text",
                        values: updatedValues as CreateTextTemplateVariableInput,
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

    const handleSave = useCallback(async () => {
        if (!template) {
            console.error("Template is not defined");
            return;
        }
        const formValue = value as CreateTextTemplateVariableInput;
        let success = false;

        if (isEditMode && editingVariable) {
            success = await updateTextTemplateVariable({
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
            success = await createTextTemplateVariable({
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
        createTextTemplateVariable,
        updateTextTemplateVariable,
        setTemporaryValue,
        setCreateFormData,
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
                label="Minimum Length"
                value={value.min_length ?? ""}
                onChange={handleChange("min_length")}
                fullWidth
                type="number"
            />

            <TextField
                label="Maximum Length"
                value={value.max_length ?? ""}
                onChange={handleChange("max_length")}
                fullWidth
                type="number"
            />

            <TextField
                label="Pattern"
                value={value.pattern ?? ""}
                onChange={handleChange("pattern")}
                fullWidth
                helperText="Regular expression pattern for validation"
            />

            <TextField
                label="Preview Value"
                value={value.preview_value ?? ""}
                onChange={handleChange("preview_value")}
                fullWidth
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

export default TextTemplateVariableForm;
