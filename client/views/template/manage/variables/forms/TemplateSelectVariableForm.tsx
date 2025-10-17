"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    SelectChangeEvent,
    Button,
} from "@mui/material";
import { useTemplateVariableManagement } from "@/client/contexts/templateVariable/TemplateVariableManagementContext";
import TagInput from "@/client/components/input/TagInput";
import { mapToTemplateSelectVariableCreateInput } from "@/client/utils/templateVariable";
import { isSelectVariableDifferent } from "@/client/utils/templateVariable/templateVariable";
import { useAppTranslation } from "@/client/locale";
import {
    TemplateSelectVariable,
    TemplateSelectVariableCreateInput,
} from "@/client/graphql/generated/gql/graphql";

type TemplateSelectVariableFormProps = {
    editingVariableID?: number;
    onDispose: () => void;
};

const TemplateSelectVariableForm: React.FC<TemplateSelectVariableFormProps> = ({
    onDispose,
    editingVariableID,
}) => {
    // const editingVariable: TemplateSelectVariable | null = useMemo(() => {
    //     if (!template?.variables || !editingVariableID) return null;

    //     return (
    //         template.variables.find((v) => v.id === editingVariableID) ?? null
    //     );
    // }, [template, editingVariableID]);

    const editingVariable: TemplateSelectVariable | null = useMemo(() => {
        if (!editingVariableID) return null;
        return {
            id: editingVariableID,
            name: "Test Variable",
            description: "Test Description",
            options: [],
        } as TemplateSelectVariable;
    }, [editingVariableID]);

    const { createTemplateSelectVariable, updateTemplateSelectVariable } =
        useTemplateVariableManagement();

    const strings = useAppTranslation("templateVariableTranslations");

    const [state, setState] = useState<TemplateSelectVariableCreateInput>(
        () => {
            if (editingVariable) {
                return mapToTemplateSelectVariableCreateInput(editingVariable);
            }
            return {
                name: "",
                required: false,
                options: [],
                multiple: false,
                // todo, fix this
                templateId: 1,
            };
        },
    );

    const handleChange = useCallback(
        (field: keyof TemplateSelectVariableCreateInput) =>
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

    const handleOptionsChange = useCallback((options: string[]) => {
        setState((prevState) => ({
            ...prevState,
            options,
        }));
    }, []);

    const handlePreviewValueChange = useCallback(
        (event: SelectChangeEvent<string>) => {
            setState((prevState) => ({
                ...prevState,
                previewValue: event.target.value,
            }));
        },
        [],
    );

    const handleSave = useCallback(async () => {
        let success = false;

        if (editingVariableID) {
            success = await updateTemplateSelectVariable({
                input: {
                    ...state,
                    id: editingVariableID,
                },
            });

            if (success) {
                onDispose();
            }
        } else {
            success = await createTemplateSelectVariable({
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
        createTemplateSelectVariable,
        updateTemplateSelectVariable,
        onDispose,
    ]);

    const isDifferentFromOriginal = useCallback((): boolean => {
        if (!editingVariableID) {
            return true; // New variable is always different
        }

        if (!editingVariable) {
            return true;
        }

        return isSelectVariableDifferent(editingVariable, state);
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
                value={state.description}
                onChange={handleChange("description")}
                fullWidth
                multiline
                rows={3}
            />

            <TagInput
                label={strings?.options ?? "Options"}
                placeholder={
                    strings?.addOptionPlaceholder ??
                    "Add option and press Enter"
                }
                initialTags={state.options}
                onChange={handleOptionsChange}
            />

            {state.options.length > 0 && (
                <Select
                    value={state.previewValue ?? ""}
                    onChange={handlePreviewValueChange}
                    fullWidth
                    displayEmpty
                    label={strings?.previewValue ?? "Preview Value"}
                >
                    {state.options.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            )}

            <FormControlLabel
                control={
                    <Checkbox
                        checked={state.multiple ?? false}
                        onChange={handleChange("multiple")}
                    />
                }
                label={
                    strings?.allowMultipleSelection ??
                    "Allow Multiple Selection"
                }
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
                disabled={!state.name || !isDifferentFromOriginal()}
            >
                {editingVariableID
                    ? (strings?.updateVariable ?? "Update Variable")
                    : (strings?.createVariable ?? "Create Variable")}
            </Button>
        </Box>
    );
};

export default TemplateSelectVariableForm;
