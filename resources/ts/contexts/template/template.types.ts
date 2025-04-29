export type Template = {
    id: number;
    name: string;
    description?: string;
    background_url?: string;
    required_variables?: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};

export type TemplateConfig = {
    maxFileSize: number; // in KB
};

export type TemplateVariableType = "text" | "date" | "number" | "gender";

export type TemplateVariable = {
    id: number;
    template_id: number;
    name: string;
    type: TemplateVariableType;
    description?: string;
    validation_rules?: Record<string, any>;
    preview_value?: string;
    created_at: string;
    updated_at: string;
};
