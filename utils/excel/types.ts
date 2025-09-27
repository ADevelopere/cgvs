import { TemplateVariable } from "@/graphql/generated/types";

export interface ValidationResult {
    valid_rows: number;
    total_rows: number;
    errors: Array<{
        row: number;
        errors: string[];
    }>;
}

export interface ExcelGenerationOptions {
    variables: TemplateVariable[];
}
