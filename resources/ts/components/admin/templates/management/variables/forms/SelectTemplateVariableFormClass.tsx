import { Component } from "react";
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
    UpdateSelectTemplateVariableInput,
} from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import TagInput from "@/components/input/TagInput";
import TemplateVariableTranslation from "@/locale/components/TemplateVariable";
import useAppTranslation from "@/locale/useAppTranslation";

interface SelectTemplateVariableFormBaseProps {
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
    createSelectTemplateVariable: ReturnType<
        typeof useTemplateVariableManagement
    >["createSelectTemplateVariable"];
    updateSelectTemplateVariable: ReturnType<
        typeof useTemplateVariableManagement
    >["updateSelectTemplateVariable"];
    // From useTemplateManagement
    template: ReturnType<typeof useTemplateManagement>["template"];
    strings: TemplateVariableTranslation | undefined;
}

interface SelectTemplateVariableFormBaseState {
    name: string;
    description: string;
    options: string[];
    preview_value: string;
    multiple: boolean;
    required: boolean;
    hasSavedOrCleared: boolean;
}

class SelectTemplateVariableFormBase extends Component<
    SelectTemplateVariableFormBaseProps,
    SelectTemplateVariableFormBaseState
> {
    constructor(props: SelectTemplateVariableFormBaseProps) {
        super(props);
        this.state = {
            name: "",
            description: "",
            options: [],
            preview_value: "",
            multiple: false,
            required: false,
            hasSavedOrCleared: false,
        };
    }

    componentDidMount() {
        this.initializeStateFromProps();
    }

    componentDidUpdate(
        prevProps: Readonly<SelectTemplateVariableFormBaseProps>,
    ) {
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
            this.initializeStateFromProps();
        } else if (
            mode === "create" &&
            prevProps.createFormData.values !== createFormData.values &&
            !this.state.hasSavedOrCleared
        ) {
            this.initializeStateFromProps();
        }
    }

    componentWillUnmount() {
        if (!this.state.hasSavedOrCleared) {
            const { formPaneState, setTemporaryValue, setCreateFormData } =
                this.props;
            const { mode, editingVariable } = formPaneState;

            if (mode === "edit" && editingVariable) {
                setTemporaryValue(editingVariable.id, null);
            } else {
                setCreateFormData({ type: null, values: null });
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

        let baseValues: Partial<CreateSelectTemplateVariableInput> = {};

        if (isEditMode && editingVariable) {
            baseValues = getTemporaryValue(
                editingVariable.id,
            ) as Partial<UpdateSelectTemplateVariableInput>;
        } else if (mode === "create" && createFormData.values) {
            baseValues =
                createFormData.values as Partial<CreateSelectTemplateVariableInput>;
        }

        const newState = {
            name: baseValues.name ?? "",
            description: baseValues.description ?? "",
            options: baseValues.options ?? [],
            preview_value: baseValues.preview_value ?? "",
            multiple: baseValues.multiple ?? false,
            required: baseValues.required ?? false,
            hasSavedOrCleared: false,
        };

        console.log("Setting new state:", newState);
        this.setState(newState);
    };

    handleChange =
        (field: keyof CreateSelectTemplateVariableInput) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value =
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value;

            this.setState(
                (prevState) => ({
                    ...prevState,
                    [field]: value,
                }),
                () => this.handleFormBlur(),
            );
        };

    handleOptionsChange = (options: string[]) => {
        this.setState({ options }, () => this.handleFormBlur());
    };

    handlePreviewValueChange = (event: SelectChangeEvent<string>) => {
        this.setState({ preview_value: event.target.value }, () =>
            this.handleFormBlur(),
        );
    };

    handleSave = async () => {
        const {
            template,
            formPaneState,
            createSelectTemplateVariable,
            updateSelectTemplateVariable,
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

        // Find the current variable to get its order
        let order = 0;
        if (isEditMode && editingVariable && template.variables) {
            const currentVariable = template.variables.find(
                (v) => v.id === editingVariable.id,
            );
            order = currentVariable?.order ?? 0;
        } else if (template.variables) {
            // For new variables, use the next available order number
            order =
                Math.max(0, ...template.variables.map((v) => v.order ?? 0)) + 1;
        }

        const baseValues = {
            name: this.state.name,
            description: this.state.description,
            options: this.state.options,
            preview_value: this.state.preview_value,
            multiple: this.state.multiple,
            required: this.state.required,
            template_id: template.id,
            order,
        };

        let success = false;

        if (isEditMode && editingVariable) {
            success = await updateSelectTemplateVariable({
                input: {
                    id: editingVariable.id,
                    ...baseValues,
                },
            });
            if (success) {
                setTemporaryValue(editingVariable.id, null);
                this.setState({ hasSavedOrCleared: true });
            }
        } else {
            success = await createSelectTemplateVariable({
                input: baseValues,
            });
            if (success) {
                setCreateFormData({ type: null, values: null });
                this.setState({ hasSavedOrCleared: true });
            }
        }
    };

    handleFormBlur = () => {
        const {
            formPaneState,
            setTemporaryValue,
            setCreateFormData,
            template,
        } = this.props;
        const { mode, editingVariable } = formPaneState;
        const isEditMode = mode === "edit";

        // Find the current variable to get its order
        let order = 0;
        if (isEditMode && editingVariable && template?.variables) {
            const currentVariable = template.variables.find(
                (v) => v.id === editingVariable.id,
            );
            order = currentVariable?.order ?? 0;
        } else if (template?.variables) {
            // For new variables, use the next available order number
            order =
                Math.max(0, ...template.variables.map((v) => v.order ?? 0)) + 1;
        }

        const currentValues = {
            name: this.state.name,
            description: this.state.description,
            options: this.state.options,
            preview_value: this.state.preview_value,
            multiple: this.state.multiple,
            required: this.state.required,
            order,
        };

        if (isEditMode && editingVariable) {
            setTemporaryValue(
                editingVariable.id,
                currentValues as UpdateSelectTemplateVariableInput,
            );
        } else {
            setCreateFormData({
                type: "select",
                values: currentValues as CreateSelectTemplateVariableInput,
            });
        }
    };

    isDifferentFromOriginal = (): boolean => {
        const { formPaneState, getTemporaryValue, createFormData } = this.props;
        const { mode, editingVariable } = formPaneState;
        const isEditMode = mode === "edit";

        let originalValues: Partial<CreateSelectTemplateVariableInput> = {};

        if (isEditMode && editingVariable) {
            originalValues = getTemporaryValue(
                editingVariable.id,
            ) as Partial<UpdateSelectTemplateVariableInput>;
        } else {
            originalValues =
                createFormData.values as Partial<CreateSelectTemplateVariableInput>;
        }

        return (
            JSON.stringify(originalValues) !==
            JSON.stringify({
                name: this.state.name,
                description: this.state.description,
                options: this.state.options,
                preview_value: this.state.preview_value,
                multiple: this.state.multiple,
                required: this.state.required,
            })
        );
    };

    render() {
        const { formPaneState } = this.props;
        const { mode } = formPaneState;
        const isEditMode = mode === "edit";
        const hasValidationError = !this.state.name;
        const hasChanges = isEditMode ? this.isDifferentFromOriginal() : true;

        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label={this.props.strings?.name ?? "Name"}
                    value={this.state.name}
                    onChange={this.handleChange("name")}
                    fullWidth
                    required
                />

                <TextField
                    label={this.props.strings?.description ?? "Description"}
                    value={this.state.description}
                    onChange={this.handleChange("description")}
                    fullWidth
                    multiline
                    rows={3}
                />

                <TagInput
                    label={this.props.strings?.options ?? "Options"}
                    placeholder={this.props.strings?.addOptionPlaceholder ?? "Add option and press Enter"}
                    initialTags={this.state.options}
                    onChange={this.handleOptionsChange}
                />

                {this.state.options.length > 0 && (
                    <Select
                        value={this.state.preview_value}
                        onChange={this.handlePreviewValueChange}
                        fullWidth
                        displayEmpty
                        label={this.props.strings?.previewValue ?? "Preview Value"}
                    >
                        {this.state.options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                )}

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.multiple}
                            onChange={this.handleChange("multiple")}
                        />
                    }
                    label={this.props.strings?.allowMultipleSelection ?? "Allow Multiple Selection"}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.required}
                            onChange={this.handleChange("required")}
                        />
                    }
                    label={this.props.strings?.required ?? "Required"}
                />

                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSave}
                        disabled={hasValidationError || !hasChanges}
                    >
                        {isEditMode ? 
                            (this.props.strings?.updateVariable ?? "Update Variable") : 
                            (this.props.strings?.createVariable ?? "Create Variable")}
                    </Button>
                </Box>
            </Box>
        );
    }
}

// Wrapper component to provide context props to the class component
const SelectTemplateVariableFormClass: React.FC = () => {
    const templateVariableManagementProps = useTemplateVariableManagement();
    const { template } = useTemplateManagement();
    const strings = useAppTranslation("templateVariableTranslations");

    return (
        <SelectTemplateVariableFormBase
            {...templateVariableManagementProps}
            template={template}
            strings={strings}
        />
    );
};

export default SelectTemplateVariableFormClass;
