export enum TemplateSpecialCategoryType {
    Main = "Main",
    Suspension = "Suspension",
}

export type TemplateCategory = {
    id: number;
    name: string;
    description: string | null;
    order: number | null;
    specialType: TemplateSpecialCategoryType | null; // Ensure enum type
    createdAt: Date;
    updatedAt: Date;
    // relations
    // templates: Template[];
    // parentCategory: TemplateCategory | null;
    // subCategories: TemplateCategory[];
};

export type TemplateCategoryCreateInput = {
    name: string;
    description?: string | null;
    parentCategoryId?: number | null;
};

export type TemplateCategoryUpdateInput = {
    id: number;
    name?: string;
    description?: string | null;
    parentCategoryId?: number | null;
};
