import { FC, useCallback, useMemo } from 'react';
import { Box, TextField, FormControlLabel, Checkbox, Select, MenuItem, SelectChangeEvent, Button } from '@mui/material';
import { useTemplateVariableManagement } from '@/contexts/templateVariable/TemplateVariableManagementContext';
import type { CreateSelectTemplateVariableInput, UpdateSelectTemplateVariableInput } from '@/graphql/generated/types';
import { useTemplateManagement } from '@/contexts/template/TemplateManagementContext';
import TagInput from '@/components/input/TagInput';

const SelectTemplateVariableForm: FC = () => {
    const {
        formPaneState,
        createFormData,
        getTemporaryValue,
        setCreateFormData,
        setTemporaryValue,
        createSelectTemplateVariable,
        updateSelectTemplateVariable,
    } = useTemplateVariableManagement();
    const { template } = useTemplateManagement();

    const { mode, editingVariable } = formPaneState;
    const isEditMode = mode === "edit";

    // Get the current form values based on mode
    const currentValues = useMemo(() => {
        return isEditMode && editingVariable
            ? (getTemporaryValue(
                  editingVariable.id,
              ) as Partial<UpdateSelectTemplateVariableInput>)
            : (createFormData.values as Partial<CreateSelectTemplateVariableInput>);
    }, [isEditMode, editingVariable, createFormData, getTemporaryValue]);

    const value: Partial<CreateSelectTemplateVariableInput> = useMemo(() => {
        return currentValues ?? { options: [] };
    }, [currentValues]);

    const handleChange = useCallback(
        (field: keyof CreateSelectTemplateVariableInput) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.type === 'checkbox' 
                    ? event.target.checked 
                    : event.target.value;

                const updatedValues = {
                    ...value,
                    [field]: newValue,
                };

                if (isEditMode && editingVariable) {
                    setTemporaryValue(
                        editingVariable.id,
                        updatedValues as UpdateSelectTemplateVariableInput,
                    );
                } else {
                    setCreateFormData({
                        type: "select",
                        values: updatedValues as CreateSelectTemplateVariableInput,
                    });
                }
            },
        [isEditMode, editingVariable, value, setCreateFormData, setTemporaryValue],
    );

    const handleOptionsChange = useCallback(
        (options: string[]) => {
            const updatedValues = {
                ...value,
                options,
            };

            if (isEditMode && editingVariable) {
                setTemporaryValue(
                    editingVariable.id,
                    updatedValues as UpdateSelectTemplateVariableInput,
                );
            } else {
                setCreateFormData({
                    type: "select",
                    values: updatedValues as CreateSelectTemplateVariableInput,
                });
            }
        },
        [isEditMode, editingVariable, value, setCreateFormData, setTemporaryValue],
    );

    const handlePreviewValueChange = useCallback(
        (event: SelectChangeEvent<string>) => {
            const updatedValues = {
                ...value,
                preview_value: event.target.value,
            };

            if (isEditMode && editingVariable) {
                setTemporaryValue(
                    editingVariable.id,
                    updatedValues as UpdateSelectTemplateVariableInput,
                );
            } else {
                setCreateFormData({
                    type: "select",
                    values: updatedValues as CreateSelectTemplateVariableInput,
                });
            }
        },
        [isEditMode, editingVariable, value, setCreateFormData, setTemporaryValue],
    );

    const handleSubmit = useCallback(async () => {
        if (isEditMode && editingVariable) {
            await updateSelectTemplateVariable({
                input: {
                    id: editingVariable.id,
                    data: value as UpdateSelectTemplateVariableInput,
                },
            });
        } else {
            await createSelectTemplateVariable({
                variables: {
                    data: value as CreateSelectTemplateVariableInput,
                },
            });
        }
    }, [isEditMode, editingVariable, value, createSelectTemplateVariable, updateSelectTemplateVariable]);

    const handleSave = useCallback(async () => {
        if (!template) {
            console.error("Template is not defined");
            return;
        }
        const formValue = value as CreateSelectTemplateVariableInput;
        let success = false;

        if (isEditMode && editingVariable) {
            success = await updateSelectTemplateVariable({
                input: {
                    ...formValue,
                    id: editingVariable.id,
                    template_id: template.id,
                },
            });
            if (success) {
                // Clear temporary value after successful update
                setTemporaryValue(editingVariable.id, null);
            }
        } else {
            success = await createSelectTemplateVariable({
                input: {
                    ...formValue,
                    template_id: template.id,
                },
            });
            if (success) {
                // Clear create form data after successful creation
                setCreateFormData({ type: null, values: null });
            }
        }
    }, [
        value,
        isEditMode,
        editingVariable,
        createSelectTemplateVariable,
        updateSelectTemplateVariable,
        setTemporaryValue,
        setCreateFormData,
        template
    ]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Name"
                value={value.name ?? ''}
                onChange={handleChange('name')}
                fullWidth
                required
            />

            <TextField
                label="Description"
                value={value.description ?? ''}
                onChange={handleChange('description')}
                fullWidth
                multiline
                rows={3}
            />

            <TagInput
                label="Options"
                placeholder="Add option and press Enter"
                initialTags={value.options ?? []}
                onChange={handleOptionsChange}
            />

            {value.options && value.options.length > 0 && (
                <Select
                    value={value.preview_value ?? ''}
                    onChange={handlePreviewValueChange}
                    fullWidth
                    displayEmpty
                    label="Preview Value"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {value.options.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={value.required ?? false}
                            onChange={handleChange('required')}
                        />
                    }
                    label="Required"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={value.multiple ?? false}
                            onChange={handleChange('multiple')}
                        />
                    }
                    label="Allow Multiple Selection"
                />
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!value.name || !(value.options && value.options.length > 0)} // Disable if name is not provided or no options are added
            >
                {isEditMode ? "Update" : "Create"} Variable
            </Button>
        </Box>
    );
};

export default SelectTemplateVariableForm;
