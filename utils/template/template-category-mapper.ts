import * as Graphql from "@/client/graphql/generated/gql/graphql";

// Helper function to build category hierarchy from flat structure
export const buildCategoryHierarchy = (
    flatCategories: Graphql.TemplateCategory[],
): Graphql.TemplateCategory[] => {
    const categoryMap = new Map<number, Graphql.TemplateCategory>();
    const rootCategories: Graphql.TemplateCategory[] = [];

    // First pass: create map of all categories
    flatCategories.forEach((category) => {
        categoryMap.set(category.id, {
            ...category,
            subCategories: [], // Reset subCategories as we'll build them in second pass
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
                parentCategory?.subCategories?.push(currentCategory);
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
    name?: string | null;
    special_type?: string | null;
    templates?: SerializableTemplate[];
    subCategories: SerializableTemplateCategory[];
};

export const getSerializableTemplateCategory = (
    category: Graphql.TemplateCategory,
): SerializableTemplateCategory => {
    return {
        id: category.id,
        name: category.name,
        special_type: category.specialType ?? null,
        templates: category.templates?.map((template) => ({
            id: template.id,
            name: template.name,
        })),
        subCategories: category.subCategories
            ? getSerializableCategories(category.subCategories)
            : [],
    };
};

export const getSerializableCategories = (
    categories: Graphql.TemplateCategory[],
): SerializableTemplateCategory[] => {
    return categories.map((category) =>
        getSerializableTemplateCategory(category),
    );
};
