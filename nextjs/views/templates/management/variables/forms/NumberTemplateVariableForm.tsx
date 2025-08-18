import React, { useState, useCallback, useMemo } from "react";
import {
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";
import { useTemplateVariableManagement } from "@/contexts/templateVariable/TemplateVariableManagementContext";
import type {
    CreateNumberTemplateVariableInput,
    TemplateNumberVariable,
} from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";
import { isNumberVariableDifferent } from "@/utils/templateVariable/templateVariable";

type NumberTemplateVariableFormProps = {
    editingVariableID?: string;
    onDispose: () => void;
};

const NumberTemplateVariableForm: React.FC<NumberTemplateVariableFormProps> = ({
    onDispose,
    editingVariableID,
}) => {
    const { template } = useTemplateManagement();

    const editingVariable: TemplateNumberVariable | null = useMemo(() => {
        if (!template || !editingVariableID) return null;

        return (
            template.variables.find((v) => v.id === editingVariableID) ?? null
        );
    }, [template, editingVariableID]);

    const { createNumberTemplateVariable, updateNumberTemplateVariable } =
        useTemplateVariableManagement();

    const strings = useAppTranslation("templateVariableTranslations");

    const [state, setState] = useState<CreateNumberTemplateVariableInput>(
        () => {
            if (editingVariable) {
                return {
                    name: editingVariable.name,
                    description: editingVariable.description ?? "",
                    min_value: editingVariable.min_value,
                    max_value: editingVariable.max_value,
                    decimal_places: editingVariable.decimal_places,
                    preview_value: editingVariable.preview_value ?? "",
                    required: editingVariable.required,
                    template_id: template?.id ?? "",
                    order: editingVariable.order,
                };
            }
            return {
                name: "",
                template_id: template?.id ?? "",
                order: 0,
            };
        },
    );

    const handleChange = useCallback(
        (field: keyof CreateNumberTemplateVariableInput) =>
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
        (field: "min_value" | "max_value" | "decimal_places") =>
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
        let success = false;

        if (editingVariableID) {
            success = await updateNumberTemplateVariable({
                input: {
                    id: editingVariableID,
                    ...state,
                },
            });
        } else {
            success = await createNumberTemplateVariable({
                input: state,
            });
        }

        if (success) {
            onDispose();
        }
    }, [
        state,
        editingVariableID,
        createNumberTemplateVariable,
        updateNumberTemplateVariable,
        onDispose,
    ]);

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
                helperText={!state.name ? strings?.required ?? "Required" : ""}
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
                value={state.min_value ?? ""}
                onChange={handleNumericChange("min_value")}
            />
            <TextField
                label={strings?.maximumValue ?? "Maximum Value"}
                type="number"
                value={state.max_value ?? ""}
                onChange={handleNumericChange("max_value")}
            />
            <TextField
                label={strings?.decimalPlaces ?? "Decimal Places"}
                type="number"
                value={state.decimal_places ?? ""}
                onChange={handleNumericChange("decimal_places")}
            />
            <TextField
                label={strings?.previewValue ?? "Preview Value"}
                value={state.preview_value ?? ""}
                onChange={handleChange("preview_value")}
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

export default NumberTemplateVariableForm;
