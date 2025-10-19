import { TemplateVariable } from "@/client/graphql/generated/gql/graphql";

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
