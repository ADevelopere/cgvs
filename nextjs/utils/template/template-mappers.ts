import type {
    CreateTemplateMutation,
    DeleteTemplateMutation,
    SuspendTemplateMutation,
    UnsuspendTemplateMutation,
    UpdateTemplateMutation,
    Template,
    TemplateCategory,
    TemplateConfig,
    TemplateConfigQuery,
    UpdateTemplateInput,
    TemplateQuery,
} from "@/graphql/generated/types";
import { mapSingleTextTemplateVariable } from "../templateVariable/text-template-variable-mappers";
import { mapSingleNumberTemplateVariable } from "../templateVariable/number-template-variable-mappers";
import { mapSingleSelectTemplateVariable } from "../templateVariable/select-template-variable-mappers";
import { mapSingleDateTemplateVariable } from "../templateVariable/date-template-variable-mappers";

export type TemplateSource =
    | CreateTemplateMutation
    | DeleteTemplateMutation
    | SuspendTemplateMutation
    | UnsuspendTemplateMutation
    | UpdateTemplateMutation
    | UpdateTemplateMutation
    | TemplateQuery; // not implemented yet

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
        special_type: category.categorySpecialType ?? null,
        order: category.order ?? null,
        createdAt: category.createdAt ?? new Date(),
        updatedAt: category.updatedAt ?? new Date(),
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
        imageUrl: template.imageUrl ?? previousTemplate?.imageUrl ?? null,
        order: template.order ?? previousTemplate?.order ?? null,
        createdAt:
            template.createdAt ?? previousTemplate?.createdAt ?? new Date(),
        updatedAt:
            template.updatedAt ?? previousTemplate?.updatedAt ?? new Date(),
        category: template.category
            ? mapCategoryForTemplate(
                  template.category as PartialTemplateCategory,
              )
            : (previousTemplate?.category ?? ({} as TemplateCategory)),
        variables: template.variables?.map((variable: any) => {
            switch (variable.__typename) {
                case "TemplateTextVariable":
                    return mapSingleTextTemplateVariable(variable);
                case "TemplateNumberVariable":
                    return mapSingleNumberTemplateVariable(variable);
                case "TemplateSelectVariable":
                    return mapSingleSelectTemplateVariable(variable);
                case "TemplateDateVariable":
                    return mapSingleDateTemplateVariable(variable);
                default:
                    return null;
            }
        }) ?? [],
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
 * Maps a suspend template mutation result to a Template
 */
const mapSuspendTemplate = (
    source: SuspendTemplateMutation,
    previousTemplate?: Template,
): Template => {
    return mapTemplate(
        source.suspendTemplate as PartialTemplate,
        previousTemplate,
    );
};

/**
 * Maps an unsuspend template mutation result to a Template
 */
const mapUnsuspendTemplate = (
    source: UnsuspendTemplateMutation,
    previousTemplate?: Template,
): Template => {
    return mapTemplate(
        source.unsuspendTemplate as PartialTemplate,
        previousTemplate,
    );
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
        required: variable.required ?? false,
        order: variable.order ?? 0,
        type: variable.type,
    };

    switch (variable.__typename) {
        case "TemplateTextVariable":
            return {
                ...baseVariable,
                min_length: variable.min_length ?? null,
                max_length: variable.max_length ?? null,
                pattern: variable.pattern ?? null,
            };
        case "TemplateNumberVariable":
            return {
                ...baseVariable,
                min_value: variable.min_value ?? null,
                max_value: variable.max_value ?? null,
                decimal_places: variable.decimal_places ?? null,
            };
        case "TemplateDateVariable":
            return {
                ...baseVariable,
                min_date: variable.min_date ?? null,
                max_date: variable.max_date ?? null,
                format: variable.format ?? null,
            };
        case "TemplateSelectVariable":
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
const mapTemplateFromQuery = (source: TemplateQuery): Template | null => {
    if (!source.template) {
        return null;
    }

    const template = source.template;
    return {
        id: template.id,
        name: template.name,
        description: template.description ?? null,
        imageUrl: template.imageUrl ?? null,
        createdAt: template.createdAt ?? new Date(),
        updatedAt: template.updatedAt ?? new Date(),
        category: template.category
            ? mapCategoryForTemplate(
                  template.category as PartialTemplateCategory,
              )
            : ({} as TemplateCategory),
        variables: template.variables?.map(mapSingleTemplateVariable) ?? [],
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
    if ("deleteTemplate" in source) {
        return mapDeleteTemplate(source, previousTemplate);
    }
    if ("suspendTemplate" in source) {
        return mapSuspendTemplate(source, previousTemplate);
    }
    if ("unsuspendTemplate" in source) {
        return mapUnsuspendTemplate(source, previousTemplate);
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

    // For single template results, wrap in an array if not null
    const previousTemplate =
        previousTemplates?.length === 1 ? previousTemplates[0] : undefined;
    const template = mapSingleTemplate(source, previousTemplate);
    return template ? [template] : [];
};

export const mapTemplateConfig = (
    source: TemplateConfigQuery,
): TemplateConfig => {
    if (!source || !source.templateConfig) {
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
        id: template.id,
        name: template.name,
        description: template.description,
        categoryId: template.category.id,
    };
};
