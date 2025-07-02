import React, { useState, useEffect, useCallback, useRef } from "react";
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
} from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { mapToCreateTextTemplateVariableInput } from "@/utils/templateVariable/text-template-variable-mappers";
import { isTextVariableDifferent } from "@/utils/templateVariable/templateVariable";
import useAppTranslation from "@/locale/useAppTranslation";
import TemplateVariableTranslation from "@/locale/components/TemplateVariable";

interface TextTemplateVariableFormState {
    name: string;
    description: string;
    min_length?: number;
    max_length?: number;
    pattern: string;
    preview_value: string;
    required: boolean;
    hasSavedOrCleared: boolean;
}

const TextTemplateVariableFormFC: React.FC = () => {
    const templateVariableManagementProps = useTemplateVariableManagement();
    const { template } = useTemplateManagement();
    const strings = useAppTranslation("templateVariableTranslations");

    const {
        formPaneState,
        createFormData,
        setCreateFormData,
        createTextTemplateVariable,
        updateTextTemplateVariable,
    } = templateVariableManagementProps;

    const [state, setState] = useState<TextTemplateVariableFormState>({
        name: "",
        description: "",
        min_length: undefined,
        max_length: undefined,
        pattern: "",
        preview_value: "",
        required: false,
        hasSavedOrCleared: false,
    });

    // Use refs to track previous values for comparison
    const prevPropsRef = useRef({
        mode: formPaneState.mode,
        editingVariableId: formPaneState.editingVariable?.id,
        templateId: template?.id,
        createFormDataValues: createFormData.values,
    });

    const parseNumeric = useCallback((
        value: string | number | null | undefined,
    ): number | undefined => {
        if (value === null || value === undefined || value === "") return undefined;
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    }, []);

    const initializeStateFromProps = useCallback(() => {
        const { mode, editingVariable } = formPaneState;
        const isEditMode = mode === "edit";

        console.log("initializeStateFromProps called:", {
            mode,
            editingVariableId: editingVariable?.id,
            createFormData,
            currentState: state,
        });

        let baseValues: Partial<CreateTextTemplateVariableInput> = {};

        if (isEditMode && editingVariable) {
            if (template?.variables) {
                // Use the editingVariable's actual data from template
                const templateTextVariable = template.variables.find(
                    (variable) => variable.id === editingVariable.id,
                );

                if (templateTextVariable) {
                    const currentVar = mapToCreateTextTemplateVariableInput(templateTextVariable);
                    baseValues = {
                        name: currentVar.name || "",
                        description: currentVar.description ?? null,
                        min_length: currentVar.min_length ?? null,
                        max_length: currentVar.max_length ?? null,
                        pattern: currentVar.pattern ?? null,
                        preview_value: currentVar.preview_value ?? null,
                        required: currentVar.required ?? false,
                    };
                    console.log("Edit mode - using template variable data:", baseValues);
                } else {
                    console.warn("Template variable not found, using empty values");
                }
            }
        } else if (mode === "create" && createFormData.values) {
            baseValues = createFormData.values;
            console.log("Create mode - using createFormData values:", baseValues);
        }

        const newState = {
            name: baseValues.name ?? "",
            description: baseValues.description ?? "",
            min_length: parseNumeric(baseValues.min_length),
            max_length: parseNumeric(baseValues.max_length),
            pattern: baseValues.pattern ?? "",
            preview_value: baseValues.preview_value ?? "",
            required: baseValues.required ?? false,
            hasSavedOrCleared: false, // Reset flag on re-initialization
        };

        console.log("Setting new state:", newState);
        setState(newState);
    }, [formPaneState, createFormData, template, parseNumeric]);

    // Effect to handle componentDidMount equivalent
    useEffect(() => {
        initializeStateFromProps();
    }, []); // Empty dependency array for componentDidMount equivalent

    // Effect to handle componentDidUpdate equivalent
    useEffect(() => {
        const { mode, editingVariable } = formPaneState;
        const prevProps = prevPropsRef.current;

        const currentMode = mode;
        const currentEditingVariableId = editingVariable?.id;
        const currentTemplateId = template?.id;

        console.log("componentDidUpdate equivalent:", {
            prevMode: prevProps.mode,
            currentMode,
            prevEditingVariableId: prevProps.editingVariableId,
            currentEditingVariableId,
            prevTemplateId: prevProps.templateId,
            currentTemplateId,
            prevCreateFormData: prevProps.createFormDataValues,
            currentCreateFormData: createFormData.values,
            hasSavedOrCleared: state.hasSavedOrCleared,
            currentState: state,
        });

        // Reset hasSavedOrCleared when mode changes
        if (prevProps.mode !== currentMode) {
            setState(prev => ({ ...prev, hasSavedOrCleared: false }));
        }

        // Re-initialize if mode, edited item, or template changes
        if (
            prevProps.mode !== currentMode ||
            currentEditingVariableId !== prevProps.editingVariableId ||
            prevProps.templateId !== currentTemplateId
        ) {
            console.log("Reinitializing due to mode/template/variable change");
            initializeStateFromProps();
        } else if (
            currentMode === "create" &&
            prevProps.createFormDataValues !== createFormData.values &&
            !state.hasSavedOrCleared // Avoid re-init if we just cleared it via save
        ) {
            // If createFormData.values is updated externally, reflect it in local state
            console.log("Reinitializing due to createFormData change", {
                prevValues: prevProps.createFormDataValues,
                newValues: createFormData.values,
            });
            initializeStateFromProps();
        }

        // Update refs for next comparison
        prevPropsRef.current = {
            mode: currentMode,
            editingVariableId: currentEditingVariableId,
            templateId: currentTemplateId,
            createFormDataValues: createFormData.values,
        };
    }, [formPaneState, template, createFormData, state.hasSavedOrCleared, initializeStateFromProps]);

    // Effect to handle componentWillUnmount equivalent
    useEffect(() => {
        return () => {
            if (!state.hasSavedOrCleared && formPaneState.mode === "create") {
                const { mode } = formPaneState;

                const dataToPersist = {
                    name: state.name,
                    description: state.description,
                    min_length: state.min_length === undefined ? null : Number(state.min_length),
                    max_length: state.max_length === undefined ? null : Number(state.max_length),
                    pattern: state.pattern,
                    preview_value: state.preview_value,
                    required: state.required,
                };

                if (mode === "create") {
                    if (
                        state.name ||
                        state.description ||
                        state.pattern ||
                        state.preview_value
                    ) {
                        setCreateFormData({
                            type: "text",
                            values: dataToPersist as CreateTextTemplateVariableInput,
                        });
                    }
                }
            }
        };
    }, [state, formPaneState, setCreateFormData]);

    const isDifferentFromOriginal = useCallback((): boolean => {
        const { editingVariable } = formPaneState;

        if (!template?.variables || !editingVariable) {
            return false;
        }

        const originalVariable = template.variables.find(
            (v) => v.id === editingVariable.id,
        );

        if (!originalVariable) {
            return false;
        }

        const currentStateAsVariable = {
            name: state.name,
            description: state.description,
            min_length: state.min_length ?? null,
            max_length: state.max_length ?? null,
            pattern: state.pattern,
            preview_value: state.preview_value,
            required: state.required,
        };

        return isTextVariableDifferent(originalVariable, currentStateAsVariable);
    }, [formPaneState, template, state]);

    const handleFormBlur = useCallback(() => {
        const { mode } = formPaneState;

        console.log("handleFormBlur called:", {
            mode,
            currentState: state,
        });

        // Only persist for create mode
        if (mode === "create") {
            if (
                state.name ||
                state.description ||
                state.pattern ||
                state.preview_value
            ) {
                const formValues = {
                    name: state.name,
                    description: state.description,
                    min_length: state.min_length === undefined ? null : Number(state.min_length),
                    max_length: state.max_length === undefined ? null : Number(state.max_length),
                    pattern: state.pattern,
                    preview_value: state.preview_value,
                    required: Boolean(state.required),
                };

                console.log("Setting create form data:", {
                    type: "text" as const,
                    values: formValues,
                });
                setCreateFormData({
                    type: "text" as const,
                    values: {
                        ...formValues,
                        template_id: "", // This will be set during actual creation
                        order: 0, // This will be set during actual creation
                    },
                });
            }
        }
    }, [formPaneState, state, setCreateFormData]);

    const handleChange = useCallback(
        (field: keyof CreateTextTemplateVariableInput) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value =
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value;

            setState(prevState => {
                if (field === "min_length" || field === "max_length") {
                    return {
                        ...prevState,
                        [field]: value === "" ? undefined : Number(value),
                        hasSavedOrCleared: false,
                    };
                }

                if (field === "required") {
                    return {
                        ...prevState,
                        required: value as boolean,
                        hasSavedOrCleared: false,
                    };
                }

                // Handle string fields
                return {
                    ...prevState,
                    [field]: value as string,
                    hasSavedOrCleared: false,
                };
            });
        },
        []
    );

    const handleSave = useCallback(async () => {
        console.log("handleSave debug:", {
            template,
            mode: formPaneState?.mode,
            editingVariable: formPaneState?.editingVariable,
            state: state,
        });

        if (!template) {
            console.error("Template is not defined");
            return;
        }

        const { mode, editingVariable } = formPaneState;
        const isEditMode = mode === "edit";

        const baseValues = {
            name: state.name,
            description: state.description,
            min_length: state.min_length === undefined ? null : Number(state.min_length),
            max_length: state.max_length === undefined ? null : Number(state.max_length),
            pattern: state.pattern,
            preview_value: state.preview_value,
            required: Boolean(state.required),
        };

        let success = false;

        if (isEditMode && editingVariable) {
            // Find the current variable to get its order
            const currentVariable = template.variables?.find(
                (v) => v.id === editingVariable.id,
            );
            const order = currentVariable?.order ?? 0;

            success = await updateTextTemplateVariable({
                input: {
                    ...baseValues,
                    id: editingVariable.id,
                    template_id: template.id,
                    order,
                },
            });

            if (success) {
                // Just keep the form state for edit mode
                setState(prev => ({ ...prev, hasSavedOrCleared: true }));
            }
        } else {
            success = await createTextTemplateVariable({
                input: {
                    ...baseValues,
                    template_id: template.id,
                    order: 0,
                },
            });

            if (success) {
                setCreateFormData({
                    type: "text",
                    values: null,
                });
                setState({
                    name: "",
                    description: "",
                    min_length: undefined,
                    max_length: undefined,
                    pattern: "",
                    preview_value: "",
                    required: false,
                    hasSavedOrCleared: true,
                });
            }
        }
    }, [
        template,
        formPaneState,
        state,
        createTextTemplateVariable,
        updateTextTemplateVariable,
        setCreateFormData
    ]);

    const { mode } = formPaneState;
    const isEditMode = mode === "edit";
    const hasValidationError = !state.name;
    const hasChanges = isEditMode ? isDifferentFromOriginal() : true;

    return (
        <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onBlur={handleFormBlur}
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

            <TextField
                label={strings?.minimumLength ?? "Minimum Length"}
                value={state.min_length ?? ""}
                onChange={handleChange("min_length")}
                fullWidth
                type="number"
            />

            <TextField
                label={strings?.maximumLength ?? "Maximum Length"}
                value={state.max_length ?? ""}
                onChange={handleChange("max_length")}
                fullWidth
                type="number"
            />

            <TextField
                label={strings?.pattern ?? "Pattern"}
                value={state.pattern}
                onChange={handleChange("pattern")}
                fullWidth
                helperText={strings?.patternHelperText ?? "Regular expression pattern for validation"}
            />

            <TextField
                label={strings?.previewValue ?? "Preview Value"}
                value={state.preview_value}
                onChange={handleChange("preview_value")}
                fullWidth
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={state.required}
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
                {isEditMode ? 
                    (strings?.updateVariable ?? "Update Variable") : 
                    (strings?.createVariable ?? "Create Variable")}
            </Button>
        </Box>
    );
};

export default TextTemplateVariableFormFC;
