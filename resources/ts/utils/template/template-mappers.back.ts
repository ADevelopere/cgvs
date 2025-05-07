import type {
    CreateTemplateMutation,
    DeleteTemplateMutation,
    MoveTemplateToDeletionCategoryMutation,
    RestoreTemplateMutation,
    ReorderTemplatesMutation,
    UpdateTemplateMutation,
    Template,
    TemplateCategory
} from '@/graphql/generated/types';

export type TemplateSource =
    | CreateTemplateMutation
    | DeleteTemplateMutation
    | MoveTemplateToDeletionCategoryMutation
    | RestoreTemplateMutation
    | UpdateTemplateMutation;

const mapCategoryForTemplate = (category: any): TemplateCategory => ({
    ...category,
    templates: category.templates || [],
    childCategories: Array.isArray(category.childCategories)
        ? category.childCategories.map(mapCategoryForTemplate)
        : [],
    parentCategory: category.parentCategory
        ? mapCategoryForTemplate(category.parentCategory)
        : null,
});

const mapTemplate = (template: any): Template => ({
    ...template,
    category: template.category ? mapCategoryForTemplate(template.category) : null,
});

export const mapSingleTemplate = (source: TemplateSource | undefined | null): Template | null => {
    if (!source) {
        return null;
    }

    // Handle template mutations
    if ('createTemplate' in source) {
        return mapTemplate(source.createTemplate);
    }
    if ('updateTemplate' in source) {
        return mapTemplate(source.updateTemplate);
    }
    if ('deleteTemplate' in source) {
        return mapTemplate(source.deleteTemplate);
    }
    if ('moveToDeletionCategory' in source) {
        return mapTemplate(source.moveToDeletionCategory);
    }

    return null;
};

export const mapTemplates = (source: TemplateSource | undefined | null): Template[] => {
    if (!source) {
        return [];
    }

    // For single template results, wrap in array if not null
    const template = mapSingleTemplate(source);
    return template ? [template] : [];
};
