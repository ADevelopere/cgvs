import type {
    CreateTemplateCategoryMutation,
    DeleteTemplateCategoryMutation,
    UpdateTemplateCategoryMutation,
    SuspensionTemplateCategoryQuery,
    MainTemplateCategoryQuery,
    TemplateCategoryQuery,
    TemplateCategoriesQuery,
    TemplateCategory,
    Template
} from '@/graphql/generated/types';

export type TemplateCategorySource = 
    | CreateTemplateCategoryMutation
    | DeleteTemplateCategoryMutation
    | UpdateTemplateCategoryMutation
    | SuspensionTemplateCategoryQuery
    | MainTemplateCategoryQuery
    | TemplateCategoryQuery
    | TemplateCategoriesQuery

// Base mapper for Template type
const mapTemplate = (template: any): Template => ({
    ...template,
    category: template.category || null,
});

// Base mapper for TemplateCategory type
const mapBaseTemplateCategory = (category: any): TemplateCategory => ({
    ...category,
    templates: Array.isArray(category.templates) 
        ? category.templates.map(mapTemplate)
        : [],
    childCategories: Array.isArray(category.childCategories)
        ? category.childCategories.map(mapBaseTemplateCategory)
        : [],
    parentCategory: category.parentCategory
        ? mapBaseTemplateCategory(category.parentCategory)
        : null,
});

// Specific mappers for each source type
const mapCreateTemplateCategoryMutation = (source: CreateTemplateCategoryMutation): TemplateCategory => 
    mapBaseTemplateCategory(source.createTemplateCategory);

const mapDeleteTemplateCategoryMutation = (source: DeleteTemplateCategoryMutation): TemplateCategory =>
    mapBaseTemplateCategory(source.deleteTemplateCategory);

const mapUpdateTemplateCategoryMutation = (source: UpdateTemplateCategoryMutation): TemplateCategory =>
    mapBaseTemplateCategory(source.updateTemplateCategory);

const mapSuspensionTemplateCategoryQuery = (source: SuspensionTemplateCategoryQuery): TemplateCategory =>
    mapBaseTemplateCategory(source.suspensionTemplateCategory);

const mapMainTemplateCategoryQuery = (source: MainTemplateCategoryQuery): TemplateCategory =>
    mapBaseTemplateCategory(source.mainTemplateCategory);

const mapTemplateCategoryQuery = (source: TemplateCategoryQuery): TemplateCategory | null =>
    source.templateCategory ? mapBaseTemplateCategory(source.templateCategory) : null;

const mapTemplateCategoriesQuery = (source: TemplateCategoriesQuery): TemplateCategory[] =>
    source.templateCategories.map(mapBaseTemplateCategory);

const mapFlatTemplateCategoriesQuery = (source: TemplateCategoriesQuery): TemplateCategory[] =>
    source.templateCategories.map(mapBaseTemplateCategory);

// Helper function to build category hierarchy from flat structure
export const buildCategoryHierarchy = (flatCategories: TemplateCategory[]): TemplateCategory[] => {
    const categoryMap = new Map<number, TemplateCategory>();
    const rootCategories: TemplateCategory[] = [];

    // First pass: create map of all categories
    flatCategories.forEach(category => {
        categoryMap.set(category.id, {
            ...category,
            childCategories: [], // Reset childCategories as we'll build them in second pass
            templates: category.templates || [],
            parentCategory: null // Reset parentCategory as we'll set it in second pass
        });
    });

    // Second pass: build relationships
    flatCategories.forEach(category => {
        const currentCategory = categoryMap.get(category.id);
        if (!currentCategory) return;

        if (category.parentCategory) {
            const parentCategory = categoryMap.get(category.parentCategory.id);
            if (parentCategory) {
                // Set parent reference
                currentCategory.parentCategory = parentCategory;
                // Add to parent's children
                parentCategory.childCategories.push(currentCategory);
            } else {
                rootCategories.push(currentCategory);
            }
        } else {
            rootCategories.push(currentCategory);
        }
    });

    return rootCategories;
};

export const getSerializableTemplateCategory = (category: TemplateCategory): any => {
    return {
        id: category.id,
        name: category.name,
        special_type: category.categorySpecialType,
        templates: category.templates?.map(template => ({
            id: template.id,
            name: template.name,
        })),
        // map childCategories recursively
        childCategories: category.childCategories ?
            getSerializableCategories(category.childCategories) : 
            [],
        // parentCategory: category.parentCategory ? {
        //     id: category.parentCategory.id,
        //     name: category.parentCategory.name,
        // } : null,
    };
};

export const getSerializableCategories = (categories: TemplateCategory[]): any[] => {
    return categories.map(category => ({
        id: category.id,
        name: category.name,
        special_type: category.categorySpecialType,
                templates: category.templates?.map(template => ({
            id: template.id,
            name: template.name,
        })),
        childCategories: category.childCategories ? 
            getSerializableCategories(category.childCategories) : 
            [],
        // Exclude parentCategory to avoid circular reference
    }));
};

// Main mapper function
export const mapTemplateCategory = (source: TemplateCategorySource | undefined | null): TemplateCategory | null => {
    if (!source) {
        return null;
    }

    try {
        if ('createTemplateCategory' in source) {
            return mapCreateTemplateCategoryMutation(source);
        }
        if ('deleteTemplateCategory' in source) {
            return mapDeleteTemplateCategoryMutation(source);
        }
        if ('updateTemplateCategory' in source) {
            return mapUpdateTemplateCategoryMutation(source);
        }
        if ('templateCategory' in source) {
            return mapTemplateCategoryQuery(source);
        }
        if ('deletionTemplateCategory' in source) {
            return mapSuspensionTemplateCategoryQuery(source);
        }
        if ('mainTemplateCategory' in source) {
            return mapMainTemplateCategoryQuery(source);
        }
        if ('templateCategories' in source) {
            return mapTemplateCategoriesQuery(source)[0] || null;
        }
    } catch (error) {
        console.error('Error mapping template category:', error);
        return null;
    }

    return null;
};

// Helper function to map multiple categories
export const mapTemplateCategories = (source: TemplateCategorySource | undefined | null): TemplateCategory[] => {
    if (!source) {
        return [];
    }

    try {
        if ('templateCategories' in source) {
            return mapTemplateCategoriesQuery(source);
        }

        // if ('flatTemplateCategories' in source) {
        //     return mapFlatTemplateCategoriesQuery(source);
        // }

        const category = mapTemplateCategory(source);
        return category ? [category] : [];
    } catch (error) {
        console.error('Error mapping template categories:', error);
        return [];
    }
};