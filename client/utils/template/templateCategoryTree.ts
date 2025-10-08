import * as Graphql from "@/client/graphql/generated/gql/graphql";

// Function to recursively update a category in a tree
export const updateCategoryInTree = (
    categories:Graphql. TemplateCategory[],
    categoryToUpdate: Graphql.TemplateCategory,
    parentCategoryId?: number,
): Graphql.TemplateCategory[] => {
    return categories.map((cat) => {
        // If this is the category we're updating
        if (cat.id === categoryToUpdate.id) {
            return categoryToUpdate;
        }

        // If this category used to be the parent of our updated category
        if (
            cat.subCategories?.some(
                (child) => child.id === categoryToUpdate.id,
            )
        ) {
            return {
                ...cat,
                subCategories: cat.subCategories.filter(
                    (child) => child.id !== categoryToUpdate.id,
                ),
            };
        }

        // If this is the new parent category
        if (cat.id === parentCategoryId) {
            return {
                ...cat,
                subCategories: [
                    ...(cat.subCategories || []),
                    categoryToUpdate,
                ],
            };
        }

        // If this category has children, recursively update them
        if (cat.subCategories?.length) {
            return {
                ...cat,
                subCategories: updateCategoryInTree(
                    cat.subCategories,
                    categoryToUpdate,
                    parentCategoryId,
                ),
            };
        }

        return cat;
    });
};

// Function to recursively update a template in the category tree
export const updateTemplateInCategoryTree = (
    categories: Graphql.TemplateCategory[],
    templateToUpdate: Graphql.Template,
    targetCategoryId?: number,
): Graphql.TemplateCategory[] => {
    return categories.map((cat) => {
        // If this is the target category for the template
        if (cat.id === targetCategoryId || (!targetCategoryId && cat.id === templateToUpdate.category?.id)) {
            // If the category already has templates array, update/add the template
            if (cat.templates) {
                const templateIndex = cat.templates.findIndex(t => t.id === templateToUpdate.id);
                if (templateIndex >= 0) {
                    // Update existing template
                    const updatedTemplates = [...cat.templates];
                    updatedTemplates[templateIndex] = templateToUpdate;
                    return {
                        ...cat,
                        templates: updatedTemplates,
                    };
                } else if (cat.id === targetCategoryId) {
                    // Add template to new category
                    return {
                        ...cat,
                        templates: [...cat.templates, templateToUpdate],
                    };
                }
            } else if (cat.id === targetCategoryId) {
                // Create templates array with the new template
                return {
                    ...cat,
                    templates: [templateToUpdate],
                };
            }
        }

        // If this is the source category and template is being moved to a different category
        if (cat.id === templateToUpdate.category?.id && targetCategoryId && targetCategoryId !== cat.id) {
            return {
                ...cat,
                templates: cat.templates?.filter(t => t.id !== templateToUpdate.id) || [],
            };
        }

        // If this category has children, recursively update them
        if (cat.subCategories?.length) {
            return {
                ...cat,
                subCategories: updateTemplateInCategoryTree(
                    cat.subCategories,
                    templateToUpdate,
                    targetCategoryId,
                ),
            };
        }

        return cat;
    });
};
