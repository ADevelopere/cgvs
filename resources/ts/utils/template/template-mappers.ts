import type {
    CreateTemplateMutation,
    DeleteTemplateMutation,
    MoveTemplateToDeletionCategoryMutation,
    RestoreTemplateMutation,
    ReorderTemplatesMutation,
    UpdateTemplateMutation,
    Template,
    TemplateCategory,
    TemplateConfig,
    TemplateConfigQuery,
    UpdateTemplateInput,
    UpdateTemplateWithImageMutation,
    TemplateQuery,
} from "@/graphql/generated/types";

export type TemplateSource =
    | CreateTemplateMutation
    | DeleteTemplateMutation
    | MoveTemplateToDeletionCategoryMutation
    | RestoreTemplateMutation
    | ReorderTemplatesMutation
    | UpdateTemplateMutation
    | UpdateTemplateWithImageMutation
    | TemplateQuery // not implemented yet
    ;

type PartialTemplate = Partial<Template> & { id: string; name: string };
type PartialTemplateCategory = Partial<TemplateCategory> & { id: string };

/**
 * Maps a template category from any source to a consistent TemplateCategory type
 */
const mapCategoryForTemplate = (
    category: PartialTemplateCategory | null | undefined,
): TemplateCategory => {
    if (!category) {
        return {} as TemplateCategory;
    }

    return {
        id: category.id,
        name: category.name ?? "",
        description: category.description ?? null,
        special_type: category.special_type ?? null,
        order: category.order ?? null,
        created_at: category.created_at ?? new Date(),
        updated_at: category.updated_at ?? new Date(),
        templates: category.templates ?? [],
        childCategories: Array.isArray(category.childCategories)
            ? category.childCategories.map((child) =>
                  mapCategoryForTemplate(child as PartialTemplateCategory),
              )
            : [],
        parentCategory: category.parentCategory
            ? mapCategoryForTemplate(
                  category.parentCategory as PartialTemplateCategory,
              )
            : null,
    } as TemplateCategory;
};

/**
 * Maps a template from any source to a consistent Template type
 */
const mapTemplate = (
    template: PartialTemplate | null | undefined,
    previousTemplate?: Template | null,
): Template => {
    if (!template) {
        return {} as Template;
    }

    return {
        id: template.id,
        name: template.name,
        description:
            template.description ?? previousTemplate?.description ?? null,
        image_url:
            template.image_url ?? previousTemplate?.image_url ?? null,
        order: template.order ?? previousTemplate?.order ?? null,
        created_at:
            template.created_at ?? previousTemplate?.created_at ?? new Date(),
        updated_at:
            template.updated_at ?? previousTemplate?.updated_at ?? new Date(),
        trashed_at: template.trashed_at ?? previousTemplate?.trashed_at ?? null,
        category: template.category
            ? mapCategoryForTemplate(
                  template.category as PartialTemplateCategory,
              )
            : (previousTemplate?.category ?? ({} as TemplateCategory)),
    } as Template;
};

/**
 * Maps a creation template mutation result to a Template
 */
const mapCreateTemplate = (source: CreateTemplateMutation): Template => {
    return mapTemplate(source.createTemplate as PartialTemplate);
};

/**
 * Maps a delete template mutation result to a Template
 */
const mapDeleteTemplate = (
    source: DeleteTemplateMutation,
    previousTemplate?: Template,
): Template => {
    return mapTemplate(
        source.deleteTemplate as PartialTemplate,
        previousTemplate,
    );
};

/**
 * Maps a move template to a deletion category mutation result to a Template
 */
const mapMoveTemplateToDeletion = (
    source: MoveTemplateToDeletionCategoryMutation,
    previousTemplate?: Template,
): Template => {
    return mapTemplate(
        source.moveTemplateToDeletionCategory as PartialTemplate,
        previousTemplate,
    );
};

/**
 * Maps a restore template mutation result to a Template
 */
const mapRestoreTemplate = (
    source: RestoreTemplateMutation,
    previousTemplate?: Template,
): Template => {
    return mapTemplate(
        source.restoreTemplate as PartialTemplate,
        previousTemplate,
    );
};

/**
 * Maps a reorder templates mutation result to Template[]
 */
const mapReorderTemplates = (
    source: ReorderTemplatesMutation,
    previousTemplates?: Template[],
): Template[] => {
    return source.reorderTemplates.map((template) => {
        const previousTemplate = previousTemplates?.find(
            (prev) => prev.id === template.id,
        );
        return mapTemplate(template as PartialTemplate, previousTemplate);
    });
};

/**
 * Maps an update template mutation result to a Template
 */
const mapUpdateTemplate = (
    source: UpdateTemplateMutation,
    previousTemplate?: Template,
): Template => {
    return mapTemplate(
        source.updateTemplate as PartialTemplate,
        previousTemplate,
    );
};

/**
 * Maps an update template with image mutation result to a Template
 */
const mapUpdateTemplateWithImage = (
    source: UpdateTemplateWithImageMutation,
    previousTemplate?: Template,
): Template => {
    return mapTemplate(
        source.updateTemplateWithImage as PartialTemplate,
        previousTemplate,
    );
};

/**
 * Maps a template variable from any source to a consistent TemplateVariable type
 */
const mapSingleTemplateVariable = (variable: any): any => {
    if (!variable) {
        return null;
    }

    const baseVariable = {
        id: variable.id,
        name: variable.name,
        description: variable.description ?? null,
        preview_value: variable.preview_value ?? null,
        required: variable.required ?? false,
        order: variable.order ?? 0,
    };

    switch (variable.__typename) {
        case 'TemplateTextVariable':
            return {
                ...baseVariable,
                min_length: variable.min_length ?? null,
                max_length: variable.max_length ?? null,
                pattern: variable.pattern ?? null,
            };
        case 'TemplateNumberVariable':
            return {
                ...baseVariable,
                min_value: variable.min_value ?? null,
                max_value: variable.max_value ?? null,
                decimal_places: variable.decimal_places ?? null,
            };
        case 'TemplateDateVariable':
            return {
                ...baseVariable,
                min_date: variable.min_date ?? null,
                max_date: variable.max_date ?? null,
                format: variable.format ?? null,
            };
        case 'TemplateSelectVariable':
            return {
                ...baseVariable,
                options: variable.options ?? [],
                multiple: variable.multiple ?? false,
            };
        default:
            return baseVariable;
    }
};

/**
 * Maps a template from template query to a Template type
 */
const mapTemplateFromQuery = (
    source: TemplateQuery,
): Template | null => {
    if (!source.template) {
        return null;
    }

    const template = source.template;
    return {
        id: template.id,
        name: template.name,
        description: template.description ?? null,
        image_url: template.image_url ?? null,
        order: template.order ?? null,
        created_at: template.created_at ?? new Date(),
        updated_at: template.updated_at ?? new Date(),
        trashed_at: template.trashed_at ?? null,
        category: template.category
            ? mapCategoryForTemplate(template.category as PartialTemplateCategory)
            : ({} as TemplateCategory),
        variables: template.variables?.map(mapSingleTemplateVariable) ?? []
    } as Template;
};

/**
 * Maps any template source to a single Template or null
 */
export const mapSingleTemplate = (
    source: TemplateSource | undefined | null,
    previousTemplate?: Template,
): Template | null => {
    if (!source) {
        return null;
    }

    // Handle template mutations
    if ("createTemplate" in source) {
        return mapCreateTemplate(source);
    }
    if ("updateTemplate" in source) {
        return mapUpdateTemplate(source, previousTemplate);
    }
    if ("updateTemplateWithImage" in source) {
        return mapUpdateTemplateWithImage(source, previousTemplate);
    }
    if ("deleteTemplate" in source) {
        return mapDeleteTemplate(source, previousTemplate);
    }
    if ("moveTemplateToDeletionCategory" in source) {
        return mapMoveTemplateToDeletion(source, previousTemplate);
    }
    if ("restoreTemplate" in source) {
        return mapRestoreTemplate(source, previousTemplate);
    }
    if ("reorderTemplates" in source) {
        // For reorder, return the first template if any exist
        const templates = mapReorderTemplates(
            source,
            previousTemplate ? [previousTemplate] : undefined,
        );
        return templates.length > 0 ? templates[0] : null;
    }

    // Handle template query
    if ("template" in source) {
        return mapTemplateFromQuery(source);
    }

    return null;
};

/**
 * Maps any template source to an array of Templates
 */
export const mapTemplates = (
    source: TemplateSource | undefined | null,
    previousTemplates?: Template[],
): Template[] => {
    if (!source) {
        return [];
    }

    // Handle reorderTemplates specially as it returns an array
    if ("reorderTemplates" in source) {
        return mapReorderTemplates(source, previousTemplates);
    }

    // For single template results, wrap in an array if not null
    const previousTemplate =
        previousTemplates?.length === 1 ? previousTemplates[0] : undefined;
    const template = mapSingleTemplate(source, previousTemplate);
    return template ? [template] : [];
};

export const mapTemplateConfig = (
    source: TemplateConfigQuery,
): TemplateConfig => {
    if (!source) {
        return {} as TemplateConfig;
    }

    return {
        allowedFileTypes: source.templateConfig.allowedFileTypes,
        maxBackgroundSize: source.templateConfig.maxBackgroundSize,
    };
};

export const mapTemplateToUpdateInput = (
    template: Template,
): UpdateTemplateInput => {
    return {
        name: template.name,
        description: template.description,
        categoryId: template.category.id,
        order: template.order,
    };
};
