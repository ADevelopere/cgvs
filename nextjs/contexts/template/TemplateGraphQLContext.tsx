"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import * as Graphql from "@/graphql/generated/types";
import { FetchResult } from "@apollo/client";

type TemplateGraphQLContextType = {
    /**
     * Query to get a single template by ID
     * @param variables - The template query variables
     */
    templateQuery: (
        variables: Graphql.QueryTemplateArgs,
    ) => Promise<Graphql.TemplateQuery>;

    /**
     * Query to get paginated templates
     * @param variables - The templates query variables
     */
    templatesQuery: (
        variables: Graphql.QueryTemplatesArgs,
    ) => Promise<Graphql.TemplatesQuery>;

    templateConfigQuery: () => Promise<Graphql.TemplateConfigQuery>;

    /**
     * Mutation to create a new template
     * @param variables - The creation template variables
     */
    createTemplateMutation: (
        variables: Graphql.CreateTemplateMutationVariables,
    ) => Promise<FetchResult<Graphql.CreateTemplateMutation>>;

    /**
     * Mutation to update an existing template
     * @param variables - The update template variables
     */
    updateTemplateMutation: (
        variables: Graphql.UpdateTemplateMutationVariables,
    ) => Promise<FetchResult<Graphql.UpdateTemplateMutation>>;

    /**
     * Mutation to delete a template
     * @param variables - The delete template variables
     */
    deleteTemplateMutation: (
        variables: Graphql.DeleteTemplateMutationVariables,
    ) => Promise<FetchResult<Graphql.DeleteTemplateMutation>>;

    /**
     * Mutation to move a template to the deletion category
     * @param variables - The template ID to move
     */
    suspendTemplateMutation: (
        variables: Graphql.SuspendTemplateMutationVariables,
    ) => Promise<FetchResult<Graphql.SuspendTemplateMutation>>;

    /**
     * Mutation to restore a template from the deletion category
     * @param variables - The template ID to restore
     */
    unsuspendTemplateMutation: (
        variables: Graphql.UnsuspendTemplateMutationVariables,
    ) => Promise<FetchResult<Graphql.UnsuspendTemplateMutation>>;
};

const TemplateGraphQLContext = createContext<
    TemplateGraphQLContextType | undefined
>(undefined);

export const useTemplateGraphQL = () => {
    const context = useContext(TemplateGraphQLContext);
    if (!context) {
        throw new Error(
            "useTemplateGraphQL must be used within a TemplateGraphQLProvider",
        );
    }
    return context;
};

export const TemplateGraphQLProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    // Template queries
    const templateQueryRef = Graphql.useTemplateQuery({
        skip: true,
    });

    const templatesQueryRef = Graphql.useTemplatesQuery({
        skip: true,
    });

    const templateConfigQueryRef = Graphql.useTemplateConfigQuery({
        skip: true,
    });

    // Template query wrapper functions
    const templateQuery = useCallback(
        async (variables: Graphql.QueryTemplateArgs) => {
            const result = await templateQueryRef.refetch({ id: variables.id });
            if (!result.data) {
                throw new Error("No data returned from template query");
            }
            return result.data;
        },
        [templateQueryRef],
    );

    const templatesQuery = useCallback(
        async (variables: Graphql.QueryTemplatesArgs) => {
            const result = await templatesQueryRef.refetch(variables);
            if (!result.data) {
                throw new Error("No data returned from templates query");
            }
            return result.data;
        },
        [templatesQueryRef],
    );

    const templateConfigQuery = useCallback(async () => {
        const result = await templateConfigQueryRef.refetch();
        if (!result.data) {
            throw new Error("No data returned from template config query");
        }
        return result.data;
    }, [templateConfigQueryRef]);

    // Create template mutation
    const [mutateCreate] = Graphql.useCreateTemplateMutation({
        update(cache, { data }) {
            if (!data?.createTemplate) return;

            const existingData =
                cache.readQuery<Graphql.FlatTemplateCategoriesQuery>({
                    query: Graphql.FlatTemplateCategoriesDocument,
                });

            if (!existingData?.flatTemplateCategories) return;

            const categoryToUpdate = existingData.flatTemplateCategories.find(
                (category) => category.id === data.createTemplate.category.id,
            );

            if (!categoryToUpdate) return;

            const updatedCategories = existingData.flatTemplateCategories.map(
                (category) => {
                    if (category.id === categoryToUpdate.id) {
                        return {
                            ...category,
                            templates: [
                                ...(category.templates || []),
                                data.createTemplate,
                            ],
                        };
                    }
                    return category;
                },
            );

            cache.writeQuery({
                query: Graphql.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedCategories,
                },
            });
        },
    });

    // Update template mutation
    const [mutateUpdate] = Graphql.useUpdateTemplateMutation({
        update(cache, { data }) {
            if (!data?.updateTemplate) return;

            const existingData =
                cache.readQuery<Graphql.FlatTemplateCategoriesQuery>({
                    query: Graphql.FlatTemplateCategoriesDocument,
                });

            if (!existingData?.flatTemplateCategories) return;

            // Find the template in its original category to preserve all fields
            let existingTemplate: any = null;
            let oldCategoryId: string | null = null;
            existingData.flatTemplateCategories.forEach((category) => {
                if (!category.templates) return;
                const found = category.templates.find(
                    (t) => t.id === data.updateTemplate.id,
                );
                if (found) {
                    existingTemplate = found;
                    oldCategoryId = category.id;
                }
            });

            const updatedCategories = existingData.flatTemplateCategories.map(
                (category) => {
                    const templates = category.templates || [];

                    // If this is the new category, and it's different from the old one
                    if (
                        category.id === data.updateTemplate.category.id &&
                        oldCategoryId !== category.id
                    ) {
                        return {
                            ...category,
                            templates: [
                                ...templates,
                                {
                                    ...existingTemplate,
                                    ...data.updateTemplate,
                                },
                            ],
                        };
                    }

                    // If this is the old category and template is moving to a new one
                    if (
                        oldCategoryId === category.id &&
                        data.updateTemplate.category.id !== category.id
                    ) {
                        return {
                            ...category,
                            templates: templates.filter(
                                (t) => t.id !== data.updateTemplate.id,
                            ),
                        };
                    }

                    // If the template is staying in the same category, just update it
                    if (category.id === data.updateTemplate.category.id) {
                        return {
                            ...category,
                            templates: templates.map((template) => {
                                if (template.id === data.updateTemplate.id) {
                                    return {
                                        ...template,
                                        ...data.updateTemplate,
                                    };
                                }
                                return template;
                            }),
                        };
                    }

                    return category;
                },
            );

            cache.writeQuery({
                query: Graphql.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedCategories,
                },
            });
        },
    });


    // Delete template mutation
    const [mutateDelete] = Graphql.useDeleteTemplateMutation({
        update(cache, { data }) {
            if (!data?.deleteTemplate) return;

            const existingData =
                cache.readQuery<Graphql.FlatTemplateCategoriesQuery>({
                    query: Graphql.FlatTemplateCategoriesDocument,
                });

            if (!existingData?.flatTemplateCategories) return;

            const updatedCategories = existingData.flatTemplateCategories.map(
                (category) => {
                    if (!category.templates) return category;

                    return {
                        ...category,
                        templates: category.templates.filter(
                            (template: { id: string }) =>
                                template.id !== data.deleteTemplate.id,
                        ),
                    };
                },
            );

            cache.writeQuery({
                query: Graphql.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedCategories,
                },
            });
        },
    });

    // Move to deletion category mutation
    const [mutateMoveToDelete] =
        Graphql.useSuspendTemplateMutation({
            update(cache, { data }) {
                if (!data?.suspendTemplate) return;

                const existingData =
                    cache.readQuery<Graphql.FlatTemplateCategoriesQuery>({
                        query: Graphql.FlatTemplateCategoriesDocument,
                    });

                if (!existingData?.flatTemplateCategories) return;

                // Find the template in its original category to preserve all fields
                let existingTemplate: any = null;
                existingData.flatTemplateCategories.forEach((category) => {
                    if (!category.templates) return;
                    const found = category.templates.find(
                        (t) => t.id === data.moveTemplateToDeletionCategory.id,
                    );
                    if (found) existingTemplate = found;
                });

                const updatedCategories =
                    existingData.flatTemplateCategories.map((category) => {
                        if (!category.templates) return category;

                        if (category.special_type === "deletion") {
                            return {
                                ...category,
                                templates: [
                                    ...category.templates,
                                    // Merge existing template data with update data
                                    {
                                        ...existingTemplate,
                                        ...data.moveTemplateToDeletionCategory,
                                    },
                                ],
                            };
                        }
                        return {
                            ...category,
                            templates: category.templates.filter(
                                (template: { id: string }) =>
                                    template.id !==
                                    data.moveTemplateToDeletionCategory.id,
                            ),
                        };
                    });

                cache.writeQuery({
                    query: Graphql.FlatTemplateCategoriesDocument,
                    data: {
                        flatTemplateCategories: updatedCategories,
                    },
                });
            },
        });

    // Restore template mutation
    const [mutateUnsuspendTemplate] = Graphql.useUnsuspendTemplateMutation({
        update(cache, { data }) {
            if (!data?.unsuspendTemplate) return;

            console.log("Restoring template", data.unsuspendTemplate);
            const existingData =
                cache.readQuery<Graphql.FlatTemplateCategoriesQuery>({
                    query: Graphql.FlatTemplateCategoriesDocument,
                });

            if (!existingData?.flatTemplateCategories) return;

            // Find the template in deletion category to preserve all fields
            let existingTemplate: any = null;
            const deletionCategory = existingData.flatTemplateCategories.find(
                (cat) => cat.special_type === "deletion",
            );
            if (deletionCategory?.templates) {
                existingTemplate = deletionCategory.templates.find(
                    (t) => t.id === data.restoreTemplate.id,
                );
            }

            const updatedCategories = existingData.flatTemplateCategories.map(
                (category) => {
                    if (!category.templates) return category;

                    if (category.id === data.restoreTemplate.category.id) {
                        return {
                            ...category,
                            templates: [
                                ...category.templates,
                                // Merge existing template data with update data
                                {
                                    ...existingTemplate,
                                    ...data.restoreTemplate,
                                },
                            ],
                        };
                    }
                    if (category.special_type === "deletion") {
                        return {
                            ...category,
                            templates: category.templates.filter(
                                (template: { id: string }) =>
                                    template.id !== data.restoreTemplate.id,
                            ),
                        };
                    }
                    return category;
                },
            );

            cache.writeQuery({
                query: Graphql.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedCategories,
                },
            });
        },
    });

    // Wrapper functions for mutations
    const createTemplateMutation = useCallback(
        async (variables: Graphql.CreateTemplateMutationVariables) => {
            return mutateCreate({
                variables,
            });
        },
        [mutateCreate],
    );

    const updateTemplateMutation = useCallback(
        async (variables: Graphql.UpdateTemplateMutationVariables) => {
            return mutateUpdate({
                variables,
            });
        },
        [mutateUpdate],
    );

    const deleteTemplateMutation = useCallback(
        async (variables: Graphql.DeleteTemplateMutationVariables) => {
            return mutateDelete({
                variables,
            });
        },
        [mutateDelete],
    );

    const suspendTemplateMutation = useCallback(
        async (
            variables: Graphql.SuspendTemplateMutationVariables,
        ) => {
            return mutateMoveToDelete({
                variables,
            });
        },
        [mutateMoveToDelete],
    );

    const unsuspendTemplateMutation = useCallback(
        async (variables: Graphql.UnsuspendTemplateMutationVariables) => {
            return mutateUnsuspendTemplate({
                variables,
            });
        },
        [mutateUnsuspendTemplate],
    );


    const contextValue: TemplateGraphQLContextType = useMemo(
        () => ({
            templateQuery,
            templatesQuery,
            templateConfigQuery,
            createTemplateMutation,
            updateTemplateMutation,
            deleteTemplateMutation,
            suspendTemplateMutation,
            unsuspendTemplateMutation,
        }),
        [
            templateQuery,
            templatesQuery,
            templateConfigQuery,
            createTemplateMutation,
            updateTemplateMutation,
            deleteTemplateMutation,
            suspendTemplateMutation,
            unsuspendTemplateMutation,
        ],
    );

    return (
        <TemplateGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateGraphQLContext.Provider>
    );
};
