import { FC, useCallback, useMemo } from "react";
import { Box, TextField, FormControlLabel, Checkbox, Button } from "@mui/material";
import { useTemplateVariableManagement } from "@/contexts/templateVariable/TemplateVariableManagementContext";
import type { CreateNumberTemplateVariableInput, UpdateNumberTemplateVariableInput } from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";

const NumberTemplateVariableForm: FC = () => {
    const {
        formPaneState,
        createFormData,
        getTemporaryValue,
        setCreateFormData,
        setTemporaryValue,
        createNumberTemplateVariable,
        updateNumberTemplateVariable,
    } = useTemplateVariableManagement();
    const { template } = useTemplateManagement();

    const { mode, editingVariable } = formPaneState;
    const isEditMode = mode === "edit";

    // Get the current form values based on mode
    const currentValues = useMemo(() => {
        return isEditMode && editingVariable
            ? (getTemporaryValue(
                  editingVariable.id,
              ) as Partial<UpdateNumberTemplateVariableInput>)
            : (createFormData.values as Partial<CreateNumberTemplateVariableInput>);
    }, [isEditMode, editingVariable, createFormData, getTemporaryValue]);

    const value: Partial<CreateNumberTemplateVariableInput> = useMemo(() => {
        return currentValues ?? {};
    }, [currentValues]);

    const handleChange = useCallback(
        (field: keyof CreateNumberTemplateVariableInput) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                let newValue: string | number | boolean;

                // Convert numeric inputs to numbers or empty string
                if (
                    field === "min_value" ||
                    field === "max_value" ||
                    field === "decimal_places"
                ) {
                    newValue =
                        event.target.value === ""
                            ? ""
                            : Number(event.target.value);
                } else if (field === "required") {
                    newValue = event.target.checked;
                } else {
                    newValue = event.target.value;
                }

                const updatedValues = {
                    ...value,
                    [field]: newValue,
                };

                if (isEditMode && editingVariable) {
                    // In edit mode, update the temporary value
                    setTemporaryValue(
                        editingVariable.id,
                        updatedValues as UpdateNumberTemplateVariableInput,
                    );
                } else {
                    // In create mode, update the create form data
                    setCreateFormData({
                        type: "number",
                        values: updatedValues as CreateNumberTemplateVariableInput,
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
        const formValue = value as CreateNumberTemplateVariableInput;
        let success = false;

        if (isEditMode && editingVariable) {
            success = await updateNumberTemplateVariable({
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
            success = await createNumberTemplateVariable({
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
        createNumberTemplateVariable,
        updateNumberTemplateVariable,
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

            <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                    label="Minimum Value"
                    type="number"
                    value={value.min_value ?? ""}
                    onChange={handleChange("min_value")}
                    fullWidth
                />

                <TextField
                    label="Maximum Value"
                    type="number"
                    value={value.max_value ?? ""}
                    onChange={handleChange("max_value")}
                    fullWidth
                />
            </Box>

            <TextField
                label="Decimal Places"
                type="number"
                value={value.decimal_places ?? ""}
                onChange={handleChange("decimal_places")}
                fullWidth
                slotProps={{
                    htmlInput: {
                        min: 0,
                        max: 10,
                    },
                }}
                helperText="Number of decimal places (0-10)"
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

export default NumberTemplateVariableForm;
