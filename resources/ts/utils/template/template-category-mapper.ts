import type {
    CreateTemplateCategoryMutation,
    DeleteTemplateCategoryMutation,
    ReorderTemplateCategoriesMutation,
    UpdateTemplateCategoryMutation,
    DeletedCategoryQuery,
    MainCategoryQuery,
    TemplateCategoryQuery,
    TemplateCategoriesQuery,
    TemplateCategory,
    Template
} from '../../graphql/generated/types';

export type TemplateCategorySource = 
    | CreateTemplateCategoryMutation
    | DeleteTemplateCategoryMutation
    | ReorderTemplateCategoriesMutation
    | UpdateTemplateCategoryMutation
    | DeletedCategoryQuery
    | MainCategoryQuery
    | TemplateCategoryQuery
    | TemplateCategoriesQuery;

const mapTemplateToType = (template: any): Template => ({
    ...template,
    category: template.category || null,
});

const mapCategory = (category: any): TemplateCategory => ({
    ...category,
    templates: Array.isArray(category.templates) 
        ? category.templates.map(mapTemplateToType)
        : [],
    childCategories: Array.isArray(category.childCategories)
        ? category.childCategories.map(mapCategory)
        : [],
    parentCategory: category.parentCategory
        ? mapCategory(category.parentCategory)
        : null,
});

export const mapTemplateCategory = (source: TemplateCategorySource | undefined | null): TemplateCategory | null => {
    if (!source) {
        return null;
    }

    // Handle template categories query
    if ('templateCategories' in source && source.templateCategories?.data) {
        return mapCategory(source.templateCategories.data[0]);
    }

    // Handle single category mutations/queries
    if ('createTemplateCategory' in source) {
        return mapCategory(source.createTemplateCategory);
    }
    if ('updateTemplateCategory' in source) {
        return mapCategory(source.updateTemplateCategory);
    }
    if ('deleteTemplateCategory' in source) {
        return mapCategory(source.deleteTemplateCategory);
    }
    if ('templateCategory' in source) {
        return source.templateCategory ? mapCategory(source.templateCategory) : null;
    }
    if ('deletedCategory' in source) {
        return mapCategory(source.deletedCategory);
    }
    if ('mainCategory' in source) {
        return mapCategory(source.mainCategory);
    }

    // Handle array results (reorderTemplateCategories mutation)
    if ('reorderTemplateCategories' in source) {
        return source.reorderTemplateCategories.map(mapCategory)[0] || null;
    }

    return null;
};

export const mapTemplateCategories = (source: TemplateCategorySource | undefined | null): TemplateCategory[] => {
    if (!source) {
        return [];
    }

    // Handle template categories query
    if ('templateCategories' in source && source.templateCategories?.data) {
        return source.templateCategories.data.map(mapCategory);
    }

    // Handle array results
    if ('reorderTemplateCategories' in source) {
        return source.reorderTemplateCategories.map(mapCategory);
    }

    // For single category results, wrap in array if not null
    const category = mapTemplateCategory(source);
    return category ? [category] : [];
};
