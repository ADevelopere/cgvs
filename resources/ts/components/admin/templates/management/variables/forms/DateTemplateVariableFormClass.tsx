import { Component } from "react";
import {
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useTemplateVariableManagement } from "@/contexts/templateVariable/TemplateVariableManagementContext";
import type {
    CreateDateTemplateVariableInput,
    UpdateDateTemplateVariableInput,
    Template,
} from "@/graphql/generated/types";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import TemplateVariableTranslation from "@/locale/components/TemplateVariable";
import useAppTranslation from "@/locale/useAppTranslation";

type FormPaneStateType = {
    mode: "edit" | "create";
    editingVariable: {
        id: string;
        type: string;
    } | null;
    createType: "date" | "text" | "number" | "select" | null;
};

interface DateTemplateVariableFormBaseProps {
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
    createDateTemplateVariable: ReturnType<
        typeof useTemplateVariableManagement
    >["createDateTemplateVariable"];
    updateDateTemplateVariable: ReturnType<
        typeof useTemplateVariableManagement
    >["updateDateTemplateVariable"];
    // From useTemplateManagement
    template: Template | undefined;
    strings: TemplateVariableTranslation | undefined;
}

interface DateTemplateVariableFormBaseState {
    name: string;
    description: string;
    format: string;
    min_date?: string;
    max_date?: string;
    preview_value: string;
    required: boolean;
    hasSavedOrCleared: boolean;
}

// Helper function for date validation
const isDateValid = (dateStr: string | null): boolean => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

class DateTemplateVariableFormBase extends Component<
    DateTemplateVariableFormBaseProps,
    DateTemplateVariableFormBaseState
> {
    constructor(props: DateTemplateVariableFormBaseProps) {
        super(props);
        this.state = {
            name: "",
            description: "",
            format: "",
            min_date: null,
            max_date: null,
            preview_value: null,
            required: false,
            hasSavedOrCleared: false,
        };
    }

    componentDidMount() {
        this.initializeStateFromProps();
    }

    componentDidUpdate(prevProps: Readonly<DateTemplateVariableFormBaseProps>) {
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

        // Re-initialize if mode, edited item, or template changes
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
            // Re-initialize if in create mode and external createFormData.values changes
            this.initializeStateFromProps();
        }
    }

    componentWillUnmount() {
        if (!this.state.hasSavedOrCleared) {
            const { mode, editingVariable } = this.props.formPaneState;
            if (mode === "edit" && editingVariable) {
                this.props.setTemporaryValue(editingVariable.id, null);
            } else {
                this.props.setCreateFormData({ type: null, values: null });
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

        let baseValues: Partial<CreateDateTemplateVariableInput> = {};

        if (isEditMode && editingVariable) {
            baseValues =
                (getTemporaryValue(
                    editingVariable.id,
                ) as Partial<UpdateDateTemplateVariableInput>) || {};
        } else if (mode === "create" && createFormData.values) {
            baseValues =
                createFormData.values as Partial<CreateDateTemplateVariableInput>;
        }

        const newState = {
            name: baseValues.name ?? "",
            description: baseValues.description ?? "",
            format: baseValues.format ?? "",
            min_date: baseValues.min_date ?? null,
            max_date: baseValues.max_date ?? null,
            preview_value: baseValues.preview_value ?? null,
            required: baseValues.required ?? false,
            hasSavedOrCleared: false,
        };

        console.log("Setting new state:", newState);
        this.setState(newState);
    };

    handleChange =
        (field: keyof CreateDateTemplateVariableInput) =>
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

    handleDateChange = (field: string) => (date: Date | null) => {
        const dateString = date ? date.toISOString().split("T")[0] : null;
        this.setState(
            {
                [field]: dateString,
                hasSavedOrCleared: false,
            } as Pick<
                DateTemplateVariableFormBaseState,
                keyof DateTemplateVariableFormBaseState
            >,
            () => {
                const { mode, editingVariable } = this.props.formPaneState;

                if (mode === "create") {
                    this.props.setCreateFormData({
                        type: "date",
                        values: {
                            ...this.props.createFormData.values,
                            [field]: dateString,
                        },
                    });
                } else if (mode === "edit" && editingVariable) {
                    this.props.setTemporaryValue(editingVariable.id, {
                        ...this.state,
                        [field]: dateString,
                    });
                }
            },
        );
    };

    handleSave = async () => {
        const { template, formPaneState } = this.props;
        const { mode, editingVariable } = formPaneState;
        const isEditMode = mode === "edit";

        if (!template) {
            console.error("Template is not defined");
            return;
        }

        const {
            name,
            description,
            format,
            min_date,
            max_date,
            preview_value,
            required,
        } = this.state;

        // Validate dates
        if (min_date && !isDateValid(min_date)) {
            console.error("Invalid minimum date");
            return;
        }
        if (max_date && !isDateValid(max_date)) {
            console.error("Invalid maximum date");
            return;
        }
        if (preview_value && !isDateValid(preview_value)) {
            console.error("Invalid preview date");
            return;
        }

        let success = false;

        const baseValues = {
            name,
            description,
            format,
            min_date,
            max_date,
            preview_value,
            required: Boolean(required),
        };

        if (isEditMode && editingVariable) {
            // Find the current variable to get its order
            const currentVariable = template.variables?.find(
                (v) => v.id === editingVariable.id,
            );
            const order = currentVariable?.order ?? 0;

            success = await this.props.updateDateTemplateVariable({
                input: {
                    ...baseValues,
                    id: editingVariable.id,
                    template_id: template.id,
                    order,
                },
            });

            if (success) {
                // Just clear temporary values but keep the form state
                this.props.setTemporaryValue(editingVariable.id, null);
                this.setState({ hasSavedOrCleared: true });
            }
        } else {
            // For new variables, put them at the end of the list
            const order = (template.variables?.length ?? 0) + 1;
            success = await this.props.createDateTemplateVariable({
                input: {
                    ...baseValues,
                    template_id: template.id,
                    order,
                },
            });

            if (success) {
                this.props.setCreateFormData({ type: null, values: null });
                this.setState({ hasSavedOrCleared: true });
            }
        }
    };

    handleFormBlur = () => {
        const { formPaneState, setTemporaryValue, setCreateFormData } =
            this.props;
        const { mode, editingVariable } = formPaneState;

        if (this.isDifferentFromOriginal()) {
            const baseValues = {
                name: this.state.name,
                description: this.state.description,
                format: this.state.format,
                min_date: this.state.min_date,
                max_date: this.state.max_date,
                preview_value: this.state.preview_value,
                required: this.state.required,
            };

            if (mode === "edit" && editingVariable) {
                setTemporaryValue(
                    editingVariable.id,
                    baseValues as UpdateDateTemplateVariableInput,
                );
            } else {
                setCreateFormData({
                    type: "date",
                    values: baseValues as CreateDateTemplateVariableInput,
                });
            }
        }
    };

    isDifferentFromOriginal = (): boolean => {
        const { formPaneState, getTemporaryValue, createFormData } = this.props;
        const { mode, editingVariable } = formPaneState;

        let originalValues: Partial<CreateDateTemplateVariableInput> = {};

        if (mode === "edit" && editingVariable) {
            originalValues =
                (getTemporaryValue(
                    editingVariable.id,
                ) as UpdateDateTemplateVariableInput) ?? {};
        } else if (mode === "create") {
            originalValues =
                (createFormData.values as CreateDateTemplateVariableInput) ??
                {};
        }

        return (
            this.state.name !== (originalValues.name ?? "") ||
            this.state.description !== (originalValues.description ?? "") ||
            this.state.format !== (originalValues.format ?? "") ||
            this.state.min_date !== (originalValues.min_date ?? null) ||
            this.state.max_date !== (originalValues.max_date ?? null) ||
            this.state.preview_value !==
                (originalValues.preview_value ?? null) ||
            this.state.required !== (originalValues.required ?? false)
        );
    };

    render() {
        const { formPaneState } = this.props;
        const { mode } = formPaneState;
        const isEditMode = mode === "edit";
        const hasValidationError = !this.state.name;
        const hasChanges = isEditMode ? this.isDifferentFromOriginal() : true;

        const minDateError =
            this.state.min_date && !isDateValid(this.state.min_date);
        const maxDateError =
            this.state.max_date && !isDateValid(this.state.max_date);
        const previewValueError =
            this.state.preview_value &&
            (!isDateValid(this.state.preview_value) ||
                (this.state.min_date &&
                    new Date(this.state.preview_value) <
                        new Date(this.state.min_date)) ||
                (this.state.max_date &&
                    new Date(this.state.preview_value) >
                        new Date(this.state.max_date)));

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

                <TextField
                    label={this.props.strings?.format ?? "Date Format"}
                    value={this.state.format}
                    onChange={this.handleChange("format")}
                    fullWidth
                    placeholder="e.g., YYYY-MM-DD"
                    helperText={
                        this.props.strings?.formatHelperText ??
                        "Format string for date display (e.g., YYYY-MM-DD, DD/MM/YYYY)"
                    }
                />

                <DatePicker
                    label={this.props.strings?.previewValue ?? "Preview Value"}
                    value={
                        this.state.preview_value
                            ? new Date(this.state.preview_value)
                            : null
                    }
                    onChange={this.handleDateChange("preview_value")}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            error: Boolean(previewValueError),
                            helperText: previewValueError
                                ? (this.props.strings?.invalidDateRangeError ??
                                  "Invalid date or outside min/max range")
                                : undefined,
                        },
                    }}
                />

                <DatePicker
                    label={this.props.strings?.minimumDate ?? "Minimum Date"}
                    value={
                        this.state.min_date
                            ? new Date(this.state.min_date)
                            : null
                    }
                    onChange={this.handleDateChange("min_date")}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            error: Boolean(minDateError),
                            helperText: minDateError
                                ? (this.props.strings?.invalidDateError ??
                                  "Invalid date")
                                : undefined,
                        },
                    }}
                />

                <DatePicker
                    label={this.props.strings?.maximumDate ?? "Maximum Date"}
                    value={
                        this.state.max_date
                            ? new Date(this.state.max_date)
                            : null
                    }
                    onChange={this.handleDateChange("max_date")}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            error: Boolean(maxDateError),
                            helperText: maxDateError
                                ? (this.props.strings?.invalidDateError ??
                                  "Invalid date")
                                : undefined,
                        },
                    }}
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


const DateTemplateVariableForm: React.FC = () => {
    const templateVariableManagementProps = useTemplateVariableManagement();
    const { template } = useTemplateManagement();
    const strings = useAppTranslation("templateVariableTranslations");

    return (
        <DateTemplateVariableFormBase
            {...templateVariableManagementProps}
            template={template}
            strings={strings}
        />
    );
};


export default DateTemplateVariableForm;
