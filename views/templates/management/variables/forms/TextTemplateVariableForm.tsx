"use client";

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
    CreateTextTemplateVariableInput,
    TextTemplateVariable,
} from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { mapToCreateTextTemplateVariableInput } from "@/utils/templateVariable/text-template-variable-mappers";
import { isTextVariableDifferent } from "@/utils/templateVariable/templateVariable";
import useAppTranslation from "@/locale/useAppTranslation";

type TextTemplateVariableFormProps = {
    editingVariableID?: number;
    onDispose: () => void;
};

const TextTemplateVariableForm: React.FC<TextTemplateVariableFormProps> = ({
    onDispose,
    editingVariableID,
}) => {
    const { template } = useTemplateManagement();

    const editingVariable: TextTemplateVariable | null = useMemo(() => {
        if (!template?.variables || !editingVariableID) return null;

        return (
            template.variables.find((v) => v.id === editingVariableID) ?? null
        );
    }, [template, editingVariableID]);

    const { createTextTemplateVariable, updateTextTemplateVariable } =
        useTemplateVariableManagement();

    const strings = useAppTranslation("templateVariableTranslations");

    const [state, setState] = useState<CreateTextTemplateVariableInput>(() => {
        if (editingVariable) {
            return mapToCreateTextTemplateVariableInput(editingVariable);
        }
        return {
            name: "",
            required: false,
            templateId: template?.id ?? 0,
        };
    });

    const handleChange = useCallback(
        (field: keyof CreateTextTemplateVariableInput) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const value =
                    event.target.type === "checkbox"
                        ? event.target.checked
                        : event.target.value;

                setState((prevState) => {
                    if (field === "minLength" || field === "maxLength") {
                        return {
                            ...prevState,
                            [field]: value === "" ? undefined : Number(value),
                        };
                    }

                    if (field === "required") {
                        return {
                            ...prevState,
                            required: value as boolean,
                        };
                    }

                    // Handle string fields
                    return {
                        ...prevState,
                        [field]: value as string,
                    };
                });
            },
        [],
    );

    const handleSave = useCallback(async () => {
        let success = false;

        if (editingVariableID) {
            success = await updateTextTemplateVariable({
                input: {
                    ...state,
                    id: editingVariableID,
                },
            });

            if (success) {
                onDispose();
            }
        } else {
            success = await createTextTemplateVariable({
                input: {
                    ...state,
                },
            });

            if (success) {
                onDispose();
            }
        }
    }, [
        state,
        editingVariableID,
        createTextTemplateVariable,
        updateTextTemplateVariable,
        onDispose,
    ]);

    const isDifferentFromOriginal = useCallback((): boolean => {
        if (!editingVariableID) {
            return false;
        }

        if (!editingVariable) {
            return true;
        }

        return isTextVariableDifferent(editingVariable, state);
    }, [editingVariableID, editingVariable, state]);

    return (
        <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            tabIndex={-1} // Makes the Box focusable but not in tab order
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
                value={state.description ?? ""}
                onChange={handleChange("description")}
                fullWidth
                multiline
                rows={3}
            />

            <TextField
                label={strings?.minimumLength ?? "Minimum Length"}
                value={state.minLength ?? ""}
                onChange={handleChange("minLength")}
                fullWidth
                type="number"
            />

            <TextField
                label={strings?.maximumLength ?? "Maximum Length"}
                value={state.maxLength ?? ""}
                onChange={handleChange("maxLength")}
                fullWidth
                type="number"
            />

            <TextField
                label={strings?.pattern ?? "Pattern"}
                value={state.pattern ?? ""}
                onChange={handleChange("pattern")}
                fullWidth
                helperText={
                    strings?.patternHelperText ??
                    "Regular expression pattern for validation"
                }
            />

            <TextField
                label={strings?.previewValue ?? "Preview Value"}
                value={state.previewValue ?? ""}
                onChange={handleChange("previewValue")}
                fullWidth
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
                disabled={!state.name || isDifferentFromOriginal()}
            >
                {editingVariableID
                    ? (strings?.updateVariable ?? "Update Variable")
                    : (strings?.createVariable ?? "Create Variable")}
            </Button>
        </Box>
    );
};

export default TextTemplateVariableForm;
