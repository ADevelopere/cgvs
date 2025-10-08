"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";
import { useTemplateVariableManagement } from "@/client/contexts/templateVariable/TemplateVariableManagementContext";

import { useTemplateManagement } from "@/client/contexts/template/TemplateManagementContext";
import { mapToTemplateTextVariableCreateInput } from "@/client/utils/templateVariable";
import { isTextVariableDifferent } from "@/client/utils/templateVariable/templateVariable";
import { useAppTranslation } from "@/client/locale";
import { TemplateTextVariable, TemplateTextVariableCreateInput } from "@/client/graphql/generated/gql/graphql";

type TemplateTextVariableFormProps = {
    editingVariableID?: number;
    onDispose: () => void;
};

const TemplateTextVariableForm: React.FC<TemplateTextVariableFormProps> = ({
    onDispose,
    editingVariableID,
}) => {
    const { template } = useTemplateManagement();

    const editingVariable: TemplateTextVariable | null = useMemo(() => {
        if (!template?.variables || !editingVariableID) return null;

        return (
            template.variables.find((v) => v.id === editingVariableID) ?? null
        );
    }, [template, editingVariableID]);

    const { createTemplateTextVariable, updateTemplateTextVariable } =
        useTemplateVariableManagement();

    const strings = useAppTranslation("templateVariableTranslations");

    const [state, setState] = useState<TemplateTextVariableCreateInput>(() => {
        if (editingVariable) {
            return mapToTemplateTextVariableCreateInput(editingVariable);
        }
        return {
            name: "",
            required: false,
            templateId: template?.id ?? 0,
        };
    });

    const handleChange = useCallback(
        (field: keyof TemplateTextVariableCreateInput) =>
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
            success = await updateTemplateTextVariable({
                input: {
                    ...state,
                    id: editingVariableID,
                },
            });

            if (success) {
                onDispose();
            }
        } else {
            success = await createTemplateTextVariable({
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
        createTemplateTextVariable,
        updateTemplateTextVariable,
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

export default TemplateTextVariableForm;
