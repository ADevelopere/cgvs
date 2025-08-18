"use client";

import { useState, useMemo } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Tooltip,
    InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTemplateVariables } from '@/contexts/template/TemplateVariablesContext';
import { useTemplateRecipients } from '@/contexts/template/TemplateRecipientsContext';
import { validateVariableValue } from '@/utils/template/validation';
import { TemplateVariable } from '@/contexts/template/template.types';

export default function NewRecipientForm() {
    const { variables } = useTemplateVariables();
    const { recipients, createRecipient } = useTemplateRecipients();

    // Create existingValues map for key variables
    const existingValuesMap = useMemo(() => {
        const map = new Map<string, Set<string>>();
        variables.forEach(variable => {
            if (variable.is_key) {
                const values = new Set<string>();
                recipients.forEach(recipient => {
                    values.add(recipient.data[variable.name]?.toString() || '');
                });
                map.set(variable.name, values);
            }
        });
        return map;
    }, [variables, recipients]);

    // Form state
    const [formData, setFormData] = useState<Record<string, string | number>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validate a single field
    const validateField = (variable: TemplateVariable, value: any) => {
        const existingValues = variable.is_key ? existingValuesMap.get(variable.name) : undefined;
        return validateVariableValue(variable, value, existingValues);
    };

    // Check if form is valid
    const isFormValid = useMemo(() => {
        return variables.every(variable => {
            const value = formData[variable.name];
            const validationResult = validateField(variable, value);
            return validationResult.isValid;
        });
    }, [formData, variables]);

    // Handle field change
    const handleChange = (variable: TemplateVariable, value: any) => {
        const validationResult = validateField(variable, value);
        
        // Convert the value to the correct type based on the variable type
        let processedValue: string | number;
        switch (variable.type) {
            case 'number':
                processedValue = value === '' ? '' : Number(value);
                break;
            case 'date':
                processedValue = value ? new Date(value).toISOString() : '';
                break;
            case 'gender':
                processedValue = value || '';
                break;
            default: // text
                processedValue = String(value);
        }
        
        setFormData(prev => ({
            ...prev,
            [variable.name]: processedValue
        }));
        
        setErrors(prev => ({
            ...prev,
            [variable.name]: validationResult.error || ''
        }));
    };

    // Handle form submit
    const handleSubmit = async () => {
        try {
            // Final validation
            const validationErrors: Record<string, string> = {};
            let isValid = true;

            variables.forEach(variable => {
                const value = formData[variable.name];
                const validationResult = validateField(variable, value);
                if (!validationResult.isValid) {
                    validationErrors[variable.name] = validationResult.error || '';
                    isValid = false;
                }
            });

            if (!isValid) {
                setErrors(validationErrors);
                return;
            }

            await createRecipient(formData);
            
            // Reset form after successful submission
            setFormData({});
            setErrors({});
        } catch (error) {
            // Error handling is done by the context
            console.error('Error saving recipient:', error);
        }
    };

    // Render input field based on variable type
    const renderInput = (variable: TemplateVariable) => {
        const value = formData[variable.name] || '';
        const error = errors[variable.name];
        const hasError = !!error;

        switch (variable.type) {
            case 'date':
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={value ? new Date(value) : null}
                            onChange={(newValue) => {
                                handleChange(variable, newValue?.toISOString() || '');
                            }}
                            slotProps={{
                                textField: {
                                    error: hasError,
                                    helperText: error,
                                    fullWidth: true,
                                    size: "small"
                                }
                            }}
                        />
                    </LocalizationProvider>
                );
            case 'number':
                return (
                    <TextField
                        type="number"
                        value={value}
                        onChange={(e) => handleChange(variable, e.target.value)}
                        error={hasError}
                        helperText={error}
                        fullWidth
                        size="small"
                    />
                );
            case 'gender':
                return (
                    <TextField
                        select
                        value={value}
                        onChange={(e) => handleChange(variable, e.target.value)}
                        error={hasError}
                        helperText={error}
                        fullWidth
                        size="small"
                        SelectProps={{
                            native: true
                        }}
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </TextField>
                );
            default: // text
                return (
                    <TextField
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(variable, e.target.value)}
                        error={hasError}
                        helperText={error}
                        fullWidth
                        size="small"
                        InputProps={variable.is_key ? {
                            startAdornment: (
                                <InputAdornment position="start">🔑</InputAdornment>
                            ),
                        } : undefined}
                    />
                );
        }
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <TableContainer 
                component={Paper} 
                variant="outlined" 
                sx={{ 
                    maxWidth: '100%',
                    overflowX: 'auto'
                }}
            >
                <Table size="small" sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            {variables.map((variable) => (
                                <TableCell 
                                    key={variable.name}
                                    sx={{ 
                                        minWidth: 200,
                                        fontWeight: 'bold',
                                        color: (variable.required || variable.is_key) && !formData[variable.name] ? 'error.main' : 'inherit',
                                    }}
                                >
                                    {variable.name}
                                    {(variable.required || variable.is_key) && '*'}
                                    {variable.is_key && (
                                        <InputAdornment position="start" sx={{ display: 'inline', ml: 1 }}>
                                            🔑
                                        </InputAdornment>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {variables.map((variable) => (
                                <TableCell key={variable.name}>
                                    {renderInput(variable)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title={!isFormValid ? 'Please enter all required data' : ''}>
                    <span>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                        >
                            Add Recipient
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </Paper>
    );
}
