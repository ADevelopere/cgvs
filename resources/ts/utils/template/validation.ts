import { TemplateVariable } from '@/contexts/template/template.types';

export const validateVariableValue = (
    variable: TemplateVariable,
    value: any,
    existingValues?: Set<string>
): { isValid: boolean; error?: string } => {
    // Handle empty values
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        if (variable.is_key || variable.required) {
            return { 
                isValid: false, 
                error: variable.is_key 
                    ? `${variable.name} is required as it's a key identifier`
                    : `${variable.name} is required`
            };
        }
        return { isValid: true }; // Empty is ok for non-required fields
    }

    // Key uniqueness check
    if (variable.is_key && existingValues?.has(value.toString())) {
        return {
            isValid: false,
            error: `${variable.name} must be unique. "${value}" is already used`
        };
    }

    // Type validation
    switch (variable.type) {
        case 'number':
            if (isNaN(Number(value))) {
                return {
                    isValid: false,
                    error: `${variable.name} must be a number`
                };
            }
            break;
        case 'date':
            if (isNaN(Date.parse(value))) {
                return {
                    isValid: false,
                    error: `${variable.name} must be a valid date`
                };
            }
            break;
    }

    return { isValid: true };
};
