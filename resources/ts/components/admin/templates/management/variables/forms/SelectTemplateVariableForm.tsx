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
import { useTemplateVariableManagement } from "@/contexts/templateVariable/TemplateVariableManagementContext";
import type {
    CreateSelectTemplateVariableInput,
    TemplateSelectVariable,
} from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import TagInput from "@/components/input/TagInput";
import { mapToCreateSelectTemplateVariableInput } from "@/utils/templateVariable/select-template-variable-mappers";
import { isSelectVariableDifferent } from "@/utils/templateVariable/templateVariable";
import useAppTranslation from "@/locale/useAppTranslation";

type SelectTemplateVariableFormProps = {
    editingVariableID?: string;
    onDispose: () => void;
};

const SelectTemplateVariableForm: React.FC<SelectTemplateVariableFormProps> = ({
    onDispose,
    editingVariableID,
}) => {
    const { template } = useTemplateManagement();
    // @ts-ignore
    const editingVariable: TemplateSelectVariable | null = useMemo(() => {
        if (!template || !editingVariableID) return null;

        return (
            template.variables.find((v) => v.id === editingVariableID) ?? null
        );
    }, [template, editingVariableID]);

    const { createSelectTemplateVariable, updateSelectTemplateVariable } =
        useTemplateVariableManagement();

    const strings = useAppTranslation("templateVariableTranslations");

    const [state, setState] = useState<CreateSelectTemplateVariableInput>(
        () => {
            if (editingVariable) {
                return mapToCreateSelectTemplateVariableInput(editingVariable);
            }
            return {
                name: "",
                options: [],
                multiple: false,
                template_id: template?.id ?? "",
                order: 0,
            };
        },
    );

    const handleChange = useCallback(
        (field: keyof CreateSelectTemplateVariableInput) =>
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
                preview_value: event.target.value,
            }));
        },
        [],
    );

    const handleSave = useCallback(async () => {
        let success = false;

        if (editingVariableID) {
            success = await updateSelectTemplateVariable({
                input: {
                    ...state,
                    id: editingVariableID,
                },
            });

            if (success) {
                onDispose();
            }
        } else {
            success = await createSelectTemplateVariable({
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
        createSelectTemplateVariable,
        updateSelectTemplateVariable,
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
                    value={state.preview_value ?? ""}
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
                        checked={state.multiple}
                        onChange={handleChange("multiple")}
                    />
                }
                label={strings?.allowMultipleSelection ?? "Allow Multiple Selection"}
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

export default SelectTemplateVariableForm;
