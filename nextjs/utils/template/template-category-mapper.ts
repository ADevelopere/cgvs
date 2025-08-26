// Utility type for deep partials (recursive partial)
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends object | undefined | null
          ? DeepPartial<T[P]>
          : T[P];
};
import type {
    CreateTemplateCategoryMutation,
    DeleteTemplateCategoryMutation,
    UpdateTemplateCategoryMutation,
    SuspensionTemplateCategoryQuery,
    MainTemplateCategoryQuery,
    TemplateCategoryQuery,
    TemplateCategoriesQuery,
    TemplateCategory,
    Template,
} from "@/graphql/generated/types";

export type TemplateCategorySource =
    | CreateTemplateCategoryMutation
    | DeleteTemplateCategoryMutation
    | UpdateTemplateCategoryMutation
    | SuspensionTemplateCategoryQuery
    | MainTemplateCategoryQuery
    | TemplateCategoryQuery
    | TemplateCategoriesQuery;

// Base mapper for Template type
const mapTemplate = (template: DeepPartial<Template>): Template => ({
    ...(template as Template),
    // Always return a TemplateCategory, never null, fallback to empty object if missing
    category: template.category
        ? mapBaseTemplateCategory(template.category)
        : ({} as TemplateCategory),
});

// Base mapper for TemplateCategory type
const mapBaseTemplateCategory = (
    category: DeepPartial<TemplateCategory>,
): TemplateCategory => ({
    ...(category as TemplateCategory),
    templates: Array.isArray(category.templates)
        ? category.templates
              .filter((t): t is DeepPartial<Template> => t !== undefined)
              .map(mapTemplate)
        : [],
    childCategories: Array.isArray(category.childCategories)
        ? category.childCategories
              .filter(
                  (c): c is DeepPartial<TemplateCategory> => c !== undefined,
              )
              .map(mapBaseTemplateCategory)
        : [],
    parentCategory: category.parentCategory
        ? mapBaseTemplateCategory(category.parentCategory)
        : null,
});

// Specific mappers for each source type
const mapCreateTemplateCategoryMutation = (
    source: CreateTemplateCategoryMutation,
): TemplateCategory => mapBaseTemplateCategory(source.createTemplateCategory);

const mapDeleteTemplateCategoryMutation = (
    source: DeleteTemplateCategoryMutation,
): TemplateCategory => mapBaseTemplateCategory(source.deleteTemplateCategory);

const mapUpdateTemplateCategoryMutation = (
    source: UpdateTemplateCategoryMutation,
): TemplateCategory => mapBaseTemplateCategory(source.updateTemplateCategory);

const mapSuspensionTemplateCategoryQuery = (
    source: SuspensionTemplateCategoryQuery,
): TemplateCategory =>
    source.suspensionTemplateCategory
        ? mapBaseTemplateCategory(source.suspensionTemplateCategory)
        : ({} as TemplateCategory);

const mapMainTemplateCategoryQuery = (
    source: MainTemplateCategoryQuery,
): TemplateCategory =>
    source.mainTemplateCategory
        ? mapBaseTemplateCategory(source.mainTemplateCategory)
        : ({} as TemplateCategory);

const mapTemplateCategoryQuery = (
    source: TemplateCategoryQuery,
): TemplateCategory | null =>
    source.templateCategory
        ? mapBaseTemplateCategory(source.templateCategory)
        : null;

const mapTemplateCategoriesQuery = (
    source: TemplateCategoriesQuery,
): TemplateCategory[] =>
    source.templateCategories.filter(Boolean).map(mapBaseTemplateCategory);

// Helper function to build category hierarchy from flat structure
export const buildCategoryHierarchy = (
    flatCategories: TemplateCategory[],
): TemplateCategory[] => {
    const categoryMap = new Map<number, TemplateCategory>();
    const rootCategories: TemplateCategory[] = [];

    // First pass: create map of all categories
    flatCategories.forEach((category) => {
        categoryMap.set(category.id, {
            ...category,
            childCategories: [], // Reset childCategories as we'll build them in second pass
            templates: category.templates || [],
            parentCategory: null, // Reset parentCategory as we'll set it in second pass
        });
    });

    // Second pass: build relationships
    flatCategories.forEach((category) => {
        const currentCategory = categoryMap.get(category.id);
        if (!currentCategory) return;

        if (category.parentCategory) {
            const parentCategory = categoryMap.get(category.parentCategory.id);
            if (parentCategory) {
                // Set parent reference
                currentCategory.parentCategory = parentCategory;
                // Add to parent's children
                parentCategory?.childCategories?.push(currentCategory);
            } else {
                rootCategories.push(currentCategory);
            }
        } else {
            rootCategories.push(currentCategory);
        }
    });

    return rootCategories;
};

export type SerializableTemplate = { id: number; name: string };
export type SerializableTemplateCategory = {
    id: number;
    name: string;
    special_type?: string | null;
    templates?: SerializableTemplate[];
    childCategories: SerializableTemplateCategory[];
};

export const getSerializableTemplateCategory = (
    category: TemplateCategory,
): SerializableTemplateCategory => {
    return {
        id: category.id,
        name: category.name,
        special_type: category.categorySpecialType ?? null,
        templates: category.templates?.map((template) => ({
            id: template.id,
            name: template.name,
        })),
        childCategories: category.childCategories
            ? getSerializableCategories(category.childCategories)
            : [],
    };
};

export const getSerializableCategories = (
    categories: TemplateCategory[],
): SerializableTemplateCategory[] => {
    return categories.map((category) =>
        getSerializableTemplateCategory(category),
    );
};

// Main mapper function
export const mapTemplateCategory = (
    source: TemplateCategorySource | undefined | null,
): TemplateCategory | null => {
    if (!source) {
        return null;
    }

    try {
        if ("createTemplateCategory" in source) {
            return mapCreateTemplateCategoryMutation(source);
        }
        if ("deleteTemplateCategory" in source) {
            return mapDeleteTemplateCategoryMutation(source);
        }
        if ("updateTemplateCategory" in source) {
            return mapUpdateTemplateCategoryMutation(source);
        }
        if ("templateCategory" in source) {
            return mapTemplateCategoryQuery(source);
        }
        if ("deletionTemplateCategory" in source) {
            return mapSuspensionTemplateCategoryQuery(source);
        }
        if ("mainTemplateCategory" in source) {
            return mapMainTemplateCategoryQuery(source);
        }
        if ("templateCategories" in source) {
            return mapTemplateCategoriesQuery(source)[0] || null;
        }
    } catch {
        return null;
    }

    return null;
};

// Helper function to map multiple categories
export const mapTemplateCategories = (
    source: TemplateCategorySource | undefined | null,
): TemplateCategory[] => {
    if (!source) {
        return [];
    }

    try {
        if ("templateCategories" in source) {
            return mapTemplateCategoriesQuery(source);
        }

        const category = mapTemplateCategory(source);
        return category ? [category] : [];
    } catch {
        return [];
    }
};
