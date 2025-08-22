import * as XLSX from 'xlsx';
import { ValidationResult } from './types';
import { TemplateVariable } from '@/contexts/template/template.types';

export const generateExcelTemplate = async (
    variables: TemplateVariable[]
): Promise<Blob> => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Generate headers based on template variables
    const headers = variables.map(v => (v.required || v.is_key) ? `${v.name}*` : v.name);
    const descriptions = variables.map(v => {
        let desc = v.description || `Enter ${v.type} value`;
        if (v.is_key) {
            desc = `${desc} (Required - Must be unique)`;
        }
        return desc;
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, descriptions]);
    
    // Add sample data row
    const sampleData = variables.map(v => {
        if (v.is_key) return 'Unique Identifier';
        switch(v.type) {
            case 'NUMBER': return '0';
            case 'DATE': return new Date().toISOString().split('T')[0];
            default: return 'Sample';
        }
    });
    XLSX.utils.sheet_add_aoa(ws, [sampleData], { origin: 2 });
    
    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Recipients');
    
    // Generate blob with client suffix in filename
    const wbout = XLSX.write(wb, { 
        type: 'array', 
        bookType: 'xlsx',
        Props: {
            Title: 'Template Recipients (Client Generated)'
        }
    });
    return new Blob([wbout], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
};

export const validateExcelInBrowser = async (
    file: File,
    variables: TemplateVariable[]
): Promise<ValidationResult> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet);
    
    let validRows = 0;
    const errors: Array<{ row: number; errors: string[] }> = [];

    // Track key values to ensure uniqueness
    const keyValues = new Set<string>();
    
    // Validate each row
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows.forEach((row: any, index: number) => {
        const rowErrors: string[] = [];
        
        // Check each variable
        variables.forEach(variable => {
            const value = row[variable.name];
            
            // Key variable validation
            if (variable.is_key) {
                if (!value || value.toString().trim() === '') {
                    rowErrors.push(`${variable.name} is required as it's a key identifier`);
                } else if (keyValues.has(value.toString())) {
                    rowErrors.push(`${variable.name} must be unique. "${value}" is already used`);
                } else {
                    keyValues.add(value.toString());
                }
            }
            // Required field validation
            else if (variable.required && !value) {
                rowErrors.push(`${variable.name} is required`);
            }
            
            // Type validation
            if (value) {
                switch (variable.type) {
                    case 'NUMBER':
                        if (isNaN(Number(value))) {
                            rowErrors.push(`${variable.name} must be a number`);
                        }
                        break;
                    case 'DATE':
                        if (isNaN(Date.parse(value))) {
                            rowErrors.push(`${variable.name} must be a valid date`);
                        }
                        break;
                }
            }
        });
        
        if (rowErrors.length === 0) {
            validRows++;
        } else {
            errors.push({ row: index + 2, errors: rowErrors });
        }
    });
    
    return {
        valid_rows: validRows,
        total_rows: rows.length,
        errors
    };
};

