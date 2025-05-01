import * as XLSX from 'xlsx';
import { ValidationResult } from './types';
import { TemplateVariable } from '@/contexts/template/template.types';

export const generateExcelTemplate = async (
    variables: TemplateVariable[]
): Promise<Blob> => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Generate headers based on template variables
    const headers = variables.map(v => v.name);
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    
    // Add sample data row
    const sampleData = variables.map(v => {
        switch(v.type) {
            case 'number': return '0';
            case 'date': return new Date().toISOString().split('T')[0];
            default: return 'Sample';
        }
    });
    XLSX.utils.sheet_add_aoa(ws, [sampleData], { origin: 1 });
    
    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Recipients');
    
    // Generate blob
    const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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
    
    // Validate each row
    rows.forEach((row: any, index: number) => {
        const rowErrors: string[] = [];
        
        // Check each variable
        variables.forEach(variable => {
            const value = row[variable.name];
            
            // Required field validation
            if (variable.required && !value) {
                rowErrors.push(`${variable.name} is required`);
            }
            
            // Type validation
            if (value) {
                switch (variable.type) {
                    case 'number':
                        if (isNaN(Number(value))) {
                            rowErrors.push(`${variable.name} must be a number`);
                        }
                        break;
                    case 'date':
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
