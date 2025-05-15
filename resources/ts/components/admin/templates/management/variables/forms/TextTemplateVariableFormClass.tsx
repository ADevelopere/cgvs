import React, { Component } from "react";
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
import { mapToCreateTextTemplateVariableInput } from "@/utils/templateVariable/text-template-variable-mappers";
import { isTextVariableDifferent } from "@/utils/templateVariable/templateVariable";

interface TextTemplateVariableFormBaseProps {
    // From useTemplateVariableManagement
    formPaneState: ReturnType<
        typeof useTemplateVariableManagement
    >["formPaneState"];
    createFormData: ReturnType<
        typeof useTemplateVariableManagement
    >["createFormData"];
    getTemporaryValue: ReturnType<
        typeof useTemplateVariableManagement
    >["getTemporaryValue"];
    setCreateFormData: ReturnType<
        typeof useTemplateVariableManagement
    >["setCreateFormData"];
    setTemporaryValue: ReturnType<
        typeof useTemplateVariableManagement
    >["setTemporaryValue"];
    createTextTemplateVariable: ReturnType<
        typeof useTemplateVariableManagement
    >["createTextTemplateVariable"];
    updateTextTemplateVariable: ReturnType<
        typeof useTemplateVariableManagement
    >["updateTextTemplateVariable"];
    // From useTemplateManagement
    template: ReturnType<typeof useTemplateManagement>["template"];
}
interface TextTemplateVariableFormBaseState {
    name: string;
    description: string;
    min_length?: number;
    max_length?: number;
    pattern: string;
    preview_value: string;
    required: boolean;
    hasSavedOrCleared: boolean;
}

class TextTemplateVariableFormBase extends Component<
    TextTemplateVariableFormBaseProps,
    TextTemplateVariableFormBaseState
> {
    constructor(props: TextTemplateVariableFormBaseProps) {
        super(props);
        this.state = {
            name: "",
            description: "",
            min_length: undefined,
            max_length: undefined,
            pattern: "",
            preview_value: "",
            required: false,
            hasSavedOrCleared: false,
        };
    }

    componentDidMount() {
        this.initializeStateFromProps();
    }

    componentDidUpdate(prevProps: Readonly<TextTemplateVariableFormBaseProps>) {
        const { formPaneState, createFormData, template } = this.props;
        const { mode, editingVariable } = formPaneState;

        const prevMode = prevProps.formPaneState.mode;
        const prevEditingVariableId =
            prevProps.formPaneState.editingVariable?.id;
        const currentEditingVariableId = editingVariable?.id;
        const prevTemplateId = prevProps.template?.id;
        const currentTemplateId = template?.id;

        console.log("componentDidUpdate:", {
            prevMode,
            currentMode: mode,
            prevEditingVariableId,
            currentEditingVariableId,
            prevTemplateId,
            currentTemplateId,
            prevCreateFormData: prevProps.createFormData,
            currentCreateFormData: createFormData,
            hasSavedOrCleared: this.state.hasSavedOrCleared,
            currentState: this.state,
        });

        // Reset hasSavedOrCleared when mode changes
        if (prevMode !== mode) {
            this.setState({ hasSavedOrCleared: false });
        }

        // Re-initialize if mode, edited item, or template changes.
        // Also, if in create mode and external createFormData.values changes.
        if (
            prevMode !== mode ||
            currentEditingVariableId !== prevEditingVariableId ||
            prevTemplateId !== currentTemplateId
        ) {
            console.log("Reinitializing due to mode/template/variable change");
            this.initializeStateFromProps();
        } else if (
            mode === "create" &&
            prevProps.createFormData.values !== createFormData.values &&
            !this.state.hasSavedOrCleared // Avoid re-init if we just cleared it via save
        ) {
            // If createFormData.values is updated externally, reflect it in local state
            console.log("Reinitializing due to createFormData change", {
                prevValues: prevProps.createFormData.values,
                newValues: createFormData.values,
            });
            this.initializeStateFromProps();
        }
    }

    componentWillUnmount() {
        if (!this.state.hasSavedOrCleared) {
            const { formPaneState, setTemporaryValue, setCreateFormData } =
                this.props;
            const { mode, editingVariable } = formPaneState;

            const dataToPersist = {
                name: this.state.name,
                description: this.state.description,
                min_length:
                    this.state.min_length === undefined
                        ? null
                        : Number(this.state.min_length),
                max_length:
                    this.state.max_length === undefined
                        ? null
                        : Number(this.state.max_length),
                pattern: this.state.pattern,
                preview_value: this.state.preview_value,
                required: this.state.required,
            };

            if (mode === "edit" && editingVariable) {
                setTemporaryValue(
                    editingVariable.id,
                    dataToPersist as UpdateTextTemplateVariableInput,
                );
            } else if (mode === "create") {
                if (
                    this.state.name ||
                    this.state.description ||
                    this.state.pattern ||
                    this.state.preview_value
                ) {
                    setCreateFormData({
                        type: "text",
                        values: dataToPersist as CreateTextTemplateVariableInput,
                    });
                }
            }
        }
    }

    initializeStateFromProps = () => {
        const { formPaneState, getTemporaryValue, createFormData } = this.props;
        const { mode, editingVariable } = formPaneState;
        const isEditMode = mode === "edit";

        console.log("initializeStateFromProps called:", {
            mode,
            editingVariableId: editingVariable?.id,
            createFormData,
            currentState: this.state,
        });

        let baseValues: Partial<CreateTextTemplateVariableInput> = {};

        if (isEditMode && editingVariable) {
            const temporaryValues = getTemporaryValue(editingVariable.id);
            console.log("Edit mode - temporary values:", temporaryValues);

            if (temporaryValues) {
                baseValues = temporaryValues;
                console.log("Edit mode - using temporary values:", baseValues);
            } else if (this.props.template?.variables) {
                // Fallback to the editingVariable's actual data
                const templateTextVariable = this.props.template.variables.find(
                    (variable) => variable.id === editingVariable.id,
                );

                if (templateTextVariable) {
                    const currentVar =
                        mapToCreateTextTemplateVariableInput(
                            templateTextVariable,
                        );
                    baseValues = {
                        name: currentVar.name || "",
                        description: currentVar.description ?? null,
                        min_length: currentVar.min_length ?? null,
                        max_length: currentVar.max_length ?? null,
                        pattern: currentVar.pattern ?? null,
                        preview_value: currentVar.preview_value ?? null,
                        required: currentVar.required ?? false,
                    };
                    console.log(
                        "Edit mode - using template variable data:",
                        baseValues,
                    );
                } else {
                    console.warn(
                        "Template variable not found, using empty values",
                    );
                }
            }
        } else if (mode === "create" && createFormData.values) {
            baseValues = createFormData.values;
            console.log(
                "Create mode - using createFormData values:",
                baseValues,
            );
        }

        const parseNumeric = (
            value: string | number | null | undefined,
        ): number | undefined => {
            if (value === null || value === undefined || value === "")
                return undefined;
            const num = Number(value);
            return isNaN(num) ? undefined : num;
        };

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
        this.setState(newState);
    };

    handleChange =
        (field: keyof CreateTextTemplateVariableInput) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value =
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value;

            this.setState((prevState) => {
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
        };

    handleSave = async () => {
        const {
            template,
            formPaneState,
            createTextTemplateVariable,
            updateTextTemplateVariable,
            setTemporaryValue,
            setCreateFormData,
        } = this.props;

        console.log("handleSave debug:", {
            template,
            mode: formPaneState?.mode,
            editingVariable: formPaneState?.editingVariable,
            state: this.state,
        });

        if (!template) {
            console.error("Template is not defined");
            return;
        }

        const { mode, editingVariable } = formPaneState;
        const isEditMode = mode === "edit";

        const baseValues = {
            name: this.state.name,
            description: this.state.description,
            min_length:
                this.state.min_length === undefined
                    ? null
                    : Number(this.state.min_length),
            max_length:
                this.state.max_length === undefined
                    ? null
                    : Number(this.state.max_length),
            pattern: this.state.pattern,
            preview_value: this.state.preview_value,
            required: Boolean(this.state.required),
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
                // Just clear temporary values but keep the form state
                setTemporaryValue(editingVariable.id, null);
                this.setState({ hasSavedOrCleared: true });
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
                this.setState({
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
    };

    handleFormBlur = () => {
        const { formPaneState, setTemporaryValue, setCreateFormData } =
            this.props;
        const { mode, editingVariable } = formPaneState;

        console.log("handleFormBlur called:", {
            mode,
            editingVariableId: editingVariable?.id,
            currentState: this.state,
        });

        // Basic form values without template_id and order
        const formValues = {
            name: this.state.name,
            description: this.state.description,
            min_length:
                this.state.min_length === undefined
                    ? null
                    : Number(this.state.min_length),
            max_length:
                this.state.max_length === undefined
                    ? null
                    : Number(this.state.max_length),
            pattern: this.state.pattern,
            preview_value: this.state.preview_value,
            required: Boolean(this.state.required),
        };

        if (mode === "edit" && editingVariable) {
            console.log("Setting temporary value in edit mode:", {
                id: editingVariable.id,
                values: formValues,
            });
            setTemporaryValue(editingVariable.id, formValues);
        } else if (mode === "create") {
            if (
                this.state.name ||
                this.state.description ||
                this.state.pattern ||
                this.state.preview_value
            ) {
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
    };

    isDifferentFromOriginal = (): boolean => {
        const { template, formPaneState } = this.props;
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
            name: this.state.name,
            description: this.state.description,
            min_length: this.state.min_length ?? null,
            max_length: this.state.max_length ?? null,
            pattern: this.state.pattern,
            preview_value: this.state.preview_value,
            required: this.state.required,
        };

        return isTextVariableDifferent(originalVariable, currentStateAsVariable);
    };

    render() {
        const { formPaneState } = this.props;
        const { mode } = formPaneState;
        const isEditMode = mode === "edit";
        const hasValidationError = !this.state.name;
        const hasChanges = isEditMode ? this.isDifferentFromOriginal() : true;

        return (
            <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                onBlur={this.handleFormBlur}
                tabIndex={-1} // Makes the Box focusable but not in tab order
            >
                <TextField
                    label="Name"
                    value={this.state.name}
                    onChange={this.handleChange("name")}
                    fullWidth
                    required
                />

                <TextField
                    label="Description"
                    value={this.state.description}
                    onChange={this.handleChange("description")}
                    fullWidth
                    multiline
                    rows={3}
                />

                <TextField
                    label="Minimum Length"
                    value={this.state.min_length ?? ""}
                    onChange={this.handleChange("min_length")}
                    fullWidth
                    type="number"
                />

                <TextField
                    label="Maximum Length"
                    value={this.state.max_length ?? ""}
                    onChange={this.handleChange("max_length")}
                    fullWidth
                    type="number"
                />

                <TextField
                    label="Pattern"
                    value={this.state.pattern}
                    onChange={this.handleChange("pattern")}
                    fullWidth
                    helperText="Regular expression pattern for validation"
                />

                <TextField
                    label="Preview Value"
                    value={this.state.preview_value}
                    onChange={this.handleChange("preview_value")}
                    fullWidth
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.required}
                            onChange={this.handleChange("required")}
                        />
                    }
                    label="Required"
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSave}
                    disabled={hasValidationError || !hasChanges}
                >
                    {isEditMode ? "Update" : "Create"} Variable
                </Button>
            </Box>
        );
    }
}

// Wrapper component to provide context props to the class component
const TextTemplateVariableForm: React.FC = () => {
    const templateVariableManagementProps = useTemplateVariableManagement();
    const { template } = useTemplateManagement();

    return (
        <TextTemplateVariableFormBase
            {...templateVariableManagementProps}
            template={template}
        />
    );
};

export default TextTemplateVariableForm;
