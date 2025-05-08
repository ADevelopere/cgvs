export type TemplateCategorySpecialType = 'deleted' | 'uncategorized';

export type TemplateCategory = {
    id: number;
    name: string;
    description?: string;
    parent_category_id?: number | null;
    order: number | null;
    special_type?: TemplateCategorySpecialType;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    parentCategory?: TemplateCategory;
    childCategories?: TemplateCategory[];
    templates?: Template[];
};

export type Template = {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
    category_id: number;
    order: number | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    category?: TemplateCategory;
};

export type TemplateConfig = {
    maxFileSize: number; // in KB
};

export type TemplateVariableType = "text" | "date" | "number" | "gender" ;

export type TemplateVariable = {
    id: number;
    template_id: number;
    name: string;
    type: TemplateVariableType;
    description?: string;
    validation_rules?: Record<string, any>;
    preview_value?: string;
    required?: boolean;
    is_key?: boolean;
    order: number;
    created_at: string;
    updated_at: string;
};

export type Recipient = {
    id: number;
    data: Record<string, any>;
    is_valid: boolean;
    validation_errors: string[] | null;
    created_at: string;
};
