import { Component } from "react";
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
    UpdateNumberTemplateVariableInput,
} from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import TemplateVariableTranslation from "@/locale/components/TemplateVariable";
import useAppTranslation from "@/locale/useAppTranslation";

interface NumberTemplateVariableFormBaseProps {
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
    createNumberTemplateVariable: ReturnType<
        typeof useTemplateVariableManagement
    >["createNumberTemplateVariable"];
    updateNumberTemplateVariable: ReturnType<
        typeof useTemplateVariableManagement
    >["updateNumberTemplateVariable"];
    // From useTemplateManagement
    template: ReturnType<typeof useTemplateManagement>["template"];
    strings: TemplateVariableTranslation | undefined;
}

interface NumberTemplateVariableFormBaseState {
    name: string;
    description: string;
    min_value?: number;
    max_value?: number;
    decimal_places?: number;
    preview_value: string;
    required: boolean;
    hasSavedOrCleared: boolean;
}

class NumberTemplateVariableFormBase extends Component<
    NumberTemplateVariableFormBaseProps,
    NumberTemplateVariableFormBaseState
> {
    constructor(props: NumberTemplateVariableFormBaseProps) {
        super(props);
        this.state = {
            name: "",
            description: "",
            min_value: undefined,
            max_value: undefined,
            decimal_places: undefined,
            preview_value: "",
            required: false,
            hasSavedOrCleared: false,
        };
    }

    componentDidMount() {
        this.initializeStateFromProps();
    }

    componentDidUpdate(
        prevProps: Readonly<NumberTemplateVariableFormBaseProps>,
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

            const dataToPersist = {
                name: this.state.name,
                description: this.state.description,
                min_value:
                    this.state.min_value === undefined
                        ? null
                        : Number(this.state.min_value),
                max_value:
                    this.state.max_value === undefined
                        ? null
                        : Number(this.state.max_value),
                decimal_places:
                    this.state.decimal_places === undefined
                        ? null
                        : Number(this.state.decimal_places),
                preview_value: this.state.preview_value,
                required: this.state.required,
            };

            if (mode === "edit" && editingVariable) {
                setTemporaryValue(editingVariable.id, dataToPersist);
            } else if (mode === "create") {
                setCreateFormData({
                    type: "number",
                    values: dataToPersist as CreateNumberTemplateVariableInput,
                });
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

        let baseValues: Partial<CreateNumberTemplateVariableInput> = {};

        if (isEditMode && editingVariable) {
            const temporaryValues = getTemporaryValue(editingVariable.id);
            console.log("Edit mode - temporary values:", temporaryValues);

            if (temporaryValues) {
                baseValues =
                    temporaryValues as CreateNumberTemplateVariableInput;
            } else {
                baseValues =
                    editingVariable as unknown as CreateNumberTemplateVariableInput;
            }
        } else if (mode === "create" && createFormData.values) {
            baseValues =
                createFormData.values as CreateNumberTemplateVariableInput;
            console.log(
                "Create mode - using createFormData values:",
                baseValues,
            );
        }

        const parseNumeric = (
            value: string | number | null | undefined,
        ): number | undefined => {
            if (value === null || value === undefined || value === "") {
                return undefined;
            }
            const parsed = Number(value);
            return isNaN(parsed) ? undefined : parsed;
        };

        const newState = {
            name: baseValues.name ?? "",
            description: baseValues.description ?? "",
            min_value: parseNumeric(baseValues.min_value),
            max_value: parseNumeric(baseValues.max_value),
            decimal_places: parseNumeric(baseValues.decimal_places),
            preview_value: baseValues.preview_value ?? "",
            required: baseValues.required ?? false,
            hasSavedOrCleared: false,
        };

        console.log("Setting new state:", newState);
        this.setState(newState);
    };

    handleChange =
        (field: keyof CreateNumberTemplateVariableInput) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { formPaneState, setTemporaryValue, setCreateFormData } =
                this.props;
            const { mode, editingVariable } = formPaneState;
            const isEditMode = mode === "edit";

            let value: string | number | boolean;

            if (
                field === "min_value" ||
                field === "max_value" ||
                field === "decimal_places"
            ) {
                value =
                    event.target.value === "" ? "" : Number(event.target.value);
            } else if (field === "required") {
                value = event.target.checked;
            } else {
                value = event.target.value;
            }

            this.setState(
                (prevState) => {
                    // For numeric fields
                    if (
                        field === "min_value" ||
                        field === "max_value" ||
                        field === "decimal_places"
                    ) {
                        return {
                            ...prevState,
                            [field]: value === "" ? undefined : Number(value),
                            hasSavedOrCleared: false,
                        };
                    }

                    // For required field
                    if (field === "required") {
                        return {
                            ...prevState,
                            [field]: value as boolean,
                            hasSavedOrCleared: false,
                        };
                    }

                    // Handle string fields
                    return {
                        ...prevState,
                        [field]: value as string,
                        hasSavedOrCleared: false,
                    };
                },
                () => {
                    const updatedValues = {
                        name: this.state.name,
                        description: this.state.description,
                        min_value:
                            this.state.min_value === undefined
                                ? null
                                : Number(this.state.min_value),
                        max_value:
                            this.state.max_value === undefined
                                ? null
                                : Number(this.state.max_value),
                        decimal_places:
                            this.state.decimal_places === undefined
                                ? null
                                : Number(this.state.decimal_places),
                        preview_value: this.state.preview_value,
                        required: this.state.required,
                    };

                    if (isEditMode && editingVariable) {
                        setTemporaryValue(
                            editingVariable.id,
                            updatedValues as UpdateNumberTemplateVariableInput,
                        );
                    } else {
                        setCreateFormData({
                            type: "number",
                            values: updatedValues as CreateNumberTemplateVariableInput,
                        });
                    }
                },
            );
        };

    handleSave = async () => {
        const {
            template,
            formPaneState,
            createNumberTemplateVariable,
            updateNumberTemplateVariable,
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
            min_value:
                this.state.min_value === undefined
                    ? null
                    : Number(this.state.min_value),
            max_value:
                this.state.max_value === undefined
                    ? null
                    : Number(this.state.max_value),
            decimal_places:
                this.state.decimal_places === undefined
                    ? null
                    : Number(this.state.decimal_places),
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

            success = await updateNumberTemplateVariable({
                input: {
                    ...baseValues,
                    id: editingVariable.id,
                    template_id: template.id,
                    order,
                },
            });
            if (success) {
                setTemporaryValue(editingVariable.id, null);
                this.setState({ hasSavedOrCleared: true });
            }
        } else {
            // For new variables, put them at the end of the list
            const order = (template.variables?.length ?? 0) + 1;
            success = await createNumberTemplateVariable({
                input: {
                    ...baseValues,
                    template_id: template.id,
                    order,
                },
            });
            if (success) {
                setCreateFormData({ type: null, values: null });
                this.setState({ hasSavedOrCleared: true });
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
            min_value:
                this.state.min_value === undefined
                    ? null
                    : Number(this.state.min_value),
            max_value:
                this.state.max_value === undefined
                    ? null
                    : Number(this.state.max_value),
            decimal_places:
                this.state.decimal_places === undefined
                    ? null
                    : Number(this.state.decimal_places),
            preview_value: this.state.preview_value,
            required: Boolean(this.state.required),
        };

        if (mode === "edit" && editingVariable) {
            setTemporaryValue(editingVariable.id, formValues);
        } else if (mode === "create") {
            setCreateFormData({
                type: "number",
                values: formValues as CreateNumberTemplateVariableInput,
            });
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

        const originalNumberVariable =
            originalVariable as unknown as CreateNumberTemplateVariableInput;
        const currentStateAsVariable = {
            name: this.state.name,
            description: this.state.description,
            min_value: this.state.min_value ?? null,
            max_value: this.state.max_value ?? null,
            decimal_places: this.state.decimal_places ?? null,
            preview_value: this.state.preview_value,
            required: this.state.required,
        };

        // Compare relevant fields
        return (
            originalNumberVariable.name !== currentStateAsVariable.name ||
            originalNumberVariable.description !==
                currentStateAsVariable.description ||
            originalNumberVariable.min_value !==
                currentStateAsVariable.min_value ||
            originalNumberVariable.max_value !==
                currentStateAsVariable.max_value ||
            originalNumberVariable.decimal_places !==
                currentStateAsVariable.decimal_places ||
            originalNumberVariable.preview_value !==
                currentStateAsVariable.preview_value ||
            originalNumberVariable.required !== currentStateAsVariable.required
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
                    onBlur={this.handleFormBlur}
                    fullWidth
                    required
                />

                <TextField
                    label={this.props.strings?.description ?? "Description"}
                    value={this.state.description}
                    onChange={this.handleChange("description")}
                    onBlur={this.handleFormBlur}
                    fullWidth
                    multiline
                    rows={3}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                        label={
                            this.props.strings?.minimumValue ?? "Minimum Value"
                        }
                        type="number"
                        value={this.state.min_value ?? ""}
                        onChange={this.handleChange("min_value")}
                        onBlur={this.handleFormBlur}
                        fullWidth
                    />

                    <TextField
                        label={
                            this.props.strings?.maximumValue ?? "Maximum Value"
                        }
                        type="number"
                        value={this.state.max_value ?? ""}
                        onChange={this.handleChange("max_value")}
                        onBlur={this.handleFormBlur}
                        fullWidth
                    />
                </Box>

                <TextField
                    label={
                        this.props.strings?.decimalPlaces ?? "Decimal Places"
                    }
                    type="number"
                    value={this.state.decimal_places ?? ""}
                    onChange={this.handleChange("decimal_places")}
                    onBlur={this.handleFormBlur}
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
                    label={this.props.strings?.previewValue ?? "Preview Value"}
                    value={this.state.preview_value}
                    onChange={this.handleChange("preview_value")}
                    onBlur={this.handleFormBlur}
                    fullWidth
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

                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSave}
                    disabled={hasValidationError || !hasChanges}
                >
                    {isEditMode
                        ? (this.props.strings?.updateVariable ??
                          "Update Variable")
                        : (this.props.strings?.createVariable ??
                          "Create Variable")}
                </Button>
            </Box>
        );
    }
}

// Wrapper component to provide context props to the class component
const NumberTemplateVariableFormClass: React.FC = () => {
    const templateVariableManagementProps = useTemplateVariableManagement();
    const { template } = useTemplateManagement();
    const strings = useAppTranslation("templateVariableTranslations");

    return (
        <NumberTemplateVariableFormBase
            {...templateVariableManagementProps}
            template={template}
            strings={strings}
        />
    );
};

export default NumberTemplateVariableFormClass;
