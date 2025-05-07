"use client";

import React, { createContext, useContext, useCallback } from "react";
import * as Types from "@/graphql/generated/types";
import { FetchResult } from "@apollo/client";

type TemplateGraphQLContextType = {
    /**
     * Query to get a single template by ID
     * @param variables - The template query variables
     */
    templateQuery: (
        variables: Types.QueryTemplateArgs,
    ) => Promise<Types.TemplateQuery>;

    /**
     * Query to get paginated templates
     * @param variables - The templates query variables
     */
    templatesQuery: (
        variables: Types.QueryTemplatesArgs,
    ) => Promise<Types.TemplatesQuery>;

    /**
     * Mutation to create a new template
     * @param variables - The create template variables
     */
    createTemplateMutation: (
        variables: Types.CreateTemplateMutationVariables,
    ) => Promise<FetchResult<Types.CreateTemplateMutation>>;

    /**
     * Mutation to update an existing template
     * @param variables - The update template variables
     */
    updateTemplateMutation: (
        variables: Types.UpdateTemplateMutationVariables,
    ) => Promise<FetchResult<Types.UpdateTemplateMutation>>;

    /**
     * Mutation to delete a template
     * @param variables - The delete template variables
     */
    deleteTemplateMutation: (
        variables: Types.DeleteTemplateMutationVariables,
    ) => Promise<FetchResult<Types.DeleteTemplateMutation>>;

    /**
     * Mutation to move a template to the deletion category
     * @param variables - The template ID to move
     */
    moveTemplateToDeletionCategoryMutation: (
        variables: Types.MoveTemplateToDeletionCategoryMutationVariables,
    ) => Promise<FetchResult<Types.MoveTemplateToDeletionCategoryMutation>>;

    /**
     * Mutation to restore a template from the deletion category
     * @param variables - The template ID to restore
     */
    restoreTemplateMutation: (
        variables: Types.RestoreTemplateMutationVariables,
    ) => Promise<FetchResult<Types.RestoreTemplateMutation>>;
};

const TemplateGraphQLContext = createContext<TemplateGraphQLContextType | undefined>(
    undefined,
);

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
    const templateQueryRef = Types.useTemplateQuery({
        skip: true,
    });

    const templatesQueryRef = Types.useTemplatesQuery({
        skip: true,
    });

    // Template query wrapper functions
    const templateQuery = useCallback(
        async (variables: Types.QueryTemplateArgs) => {
            const result = await templateQueryRef.refetch({ id: variables.id });
            if (!result.data) {
                throw new Error('No data returned from template query');
            }
            return result.data;
        },
        [templateQueryRef],
    );

    const templatesQuery = useCallback(
        async (variables: Types.QueryTemplatesArgs) => {
            const result = await templatesQueryRef.refetch(variables);
            if (!result.data) {
                throw new Error('No data returned from templates query');
            }
            return result.data;
        },
        [templatesQueryRef],
    );

    // Create template mutation
    const [mutateCreate] = Types.useCreateTemplateMutation({
        update(cache, { data }) {
            if (!data?.createTemplate) return;

            const existingData = cache.readQuery<Types.FlatTemplateCategoriesQuery>({
                query: Types.FlatTemplateCategoriesDocument,
            });

            if (!existingData?.flatTemplateCategories) return;

            const categoryToUpdate = existingData.flatTemplateCategories.find(
                (category) => category.id === data.createTemplate.category.id,
            );

            if (!categoryToUpdate) return;

            const updatedCategories = existingData.flatTemplateCategories.map((category) => {
                if (category.id === categoryToUpdate.id) {
                    return {
                        ...category,
                        templates: [...(category.templates || []), data.createTemplate],
                    };
                }
                return category;
            });

            cache.writeQuery({
                query: Types.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedCategories,
                },
            });
        },
    });

    // Update template mutation
    const [mutateUpdate] = Types.useUpdateTemplateMutation({
        update(cache, { data }) {
            if (!data?.updateTemplate) return;

            const existingData = cache.readQuery<Types.FlatTemplateCategoriesQuery>({
                query: Types.FlatTemplateCategoriesDocument,
            });

            if (!existingData?.flatTemplateCategories) return;

            const updatedCategories = existingData.flatTemplateCategories.map((category) => {
                const templates = category.templates || [];
                const updatedTemplates = templates.map((template) =>
                    template.id === data.updateTemplate.id ? data.updateTemplate : template,
                );
                return {
                    ...category,
                    templates: updatedTemplates,
                };
            });

            cache.writeQuery({
                query: Types.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedCategories,
                },
            });
        },
    });

    // Delete template mutation
    const [mutateDelete] = Types.useDeleteTemplateMutation({
        update(cache, { data }) {
            if (!data?.deleteTemplate) return;

            const existingData = cache.readQuery<Types.FlatTemplateCategoriesQuery>({
                query: Types.FlatTemplateCategoriesDocument,
            });

            if (!existingData?.flatTemplateCategories) return;

            const updatedCategories = existingData.flatTemplateCategories.map((category) => {
                if (!category.templates) return category;
                
                return {
                    ...category,
                    templates: category.templates.filter(
                        (template: { id: string }) => template.id !== data.deleteTemplate.id,
                    ),
                };
            });

            cache.writeQuery({
                query: Types.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedCategories,
                },
            });
        },
    });

    // Move to deletion category mutation
    const [mutateMoveToDelete] = Types.useMoveTemplateToDeletionCategoryMutation({
        update(cache, { data }) {
            if (!data?.moveTemplateToDeletionCategory) return;

            const existingData = cache.readQuery<Types.FlatTemplateCategoriesQuery>({
                query: Types.FlatTemplateCategoriesDocument,
            });

            if (!existingData?.flatTemplateCategories) return;

            const updatedCategories = existingData.flatTemplateCategories.map((category) => {
                if (!category.templates) return category;

                if (category.special_type === "deletion") {
                    return {
                        ...category,
                        templates: [...category.templates, data.moveTemplateToDeletionCategory],
                    };
                }
                return {
                    ...category,
                    templates: category.templates.filter(
                        (template: { id: string }) => template.id !== data.moveTemplateToDeletionCategory.id,
                    ),
                };
            });

            cache.writeQuery({
                query: Types.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedCategories,
                },
            });
        },
    });

    // Restore template mutation
    const [mutateRestore] = Types.useRestoreTemplateMutation(
    //     {
    //     update(cache, { data }) {
    //         if (!data?.restoreTemplate) return;

    //         const existingData = cache.readQuery<Types.FlatTemplateCategoriesQuery>({
    //             query: Types.FlatTemplateCategoriesDocument,
    //         });

    //         if (!existingData?.flatTemplateCategories) return;

    //         const updatedCategories = existingData.flatTemplateCategories.map((category) => {
    //             if (!category.templates) return category;

    //             if (category.id === data.restoreTemplate.category.id) {
    //                 return {
    //                     ...category,
    //                     templates: [...category.templates, data.restoreTemplate],
    //                 };
    //             }
    //             if (category.special_type === "deletion") {
    //                 return {
    //                     ...category,
    //                     templates: category.templates.filter(
    //                         (template: { id: string }) => template.id !== data.restoreTemplate.id,
    //                     ),
    //                 };
    //             }
    //             return category;
    //         });

    //         cache.writeQuery({
    //             query: Types.FlatTemplateCategoriesDocument,
    //             data: {
    //                 flatTemplateCategories: updatedCategories,
    //             },
    //         });
    //     },
    // }
);

    // Wrapper functions for mutations
    const createTemplateMutation = useCallback(
        async (variables: Types.CreateTemplateMutationVariables) => {
            return mutateCreate({
                variables,
            });
        },
        [mutateCreate],
    );

    const updateTemplateMutation = useCallback(
        async (variables: Types.UpdateTemplateMutationVariables) => {
            return mutateUpdate({
                variables,
            });
        },
        [mutateUpdate],
    );

    const deleteTemplateMutation = useCallback(
        async (variables: Types.DeleteTemplateMutationVariables) => {
            return mutateDelete({
                variables,
            });
        },
        [mutateDelete],
    );

    const moveTemplateToDeletionCategoryMutation = useCallback(
        async (variables: Types.MoveTemplateToDeletionCategoryMutationVariables) => {
            return mutateMoveToDelete({
                variables,
            });
        },
        [mutateMoveToDelete],
    );

    const restoreTemplateMutation = useCallback(
        async (variables: Types.RestoreTemplateMutationVariables) => {
            return mutateRestore({
                variables,
            });
        },
        [mutateRestore],
    );

    const contextValue: TemplateGraphQLContextType = {
        templateQuery,
        templatesQuery,
        createTemplateMutation,
        updateTemplateMutation,
        deleteTemplateMutation,
        moveTemplateToDeletionCategoryMutation,
        restoreTemplateMutation,
    };

    return (
        <TemplateGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateGraphQLContext.Provider>
    );
};
