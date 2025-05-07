"use client";

import React, { createContext, useContext, useCallback } from "react";
import * as Types from "@/graphql/generated/types";
import { FetchResult } from "@apollo/client";

type TemplateGraphQLContextType = {
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
    // Create template mutation
    const [mutateCreate] = Types.useCreateTemplateMutation({
        update(cache, { data }) {
            if (!data?.createTemplate) return;

            const existingData = cache.readQuery<Types.TemplateCategoriesQuery>({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
            });

            if (!existingData?.templateCategories?.data) return;

            const categoryToUpdate = existingData.templateCategories.data.find(
                (category) => category.id === data.createTemplate.category.id,
            );

            if (!categoryToUpdate) return;

            const updatedCategories = existingData.templateCategories.data.map((category) => {
                if (category.id === categoryToUpdate.id) {
                    return {
                        ...category,
                        templates: [...(category.templates || []), data.createTemplate],
                    };
                }
                return category;
            });

            cache.writeQuery({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
                data: {
                    templateCategories: {
                        ...existingData.templateCategories,
                        data: updatedCategories,
                    },
                },
            });
        },
    });

    // Update template mutation
    const [mutateUpdate] = Types.useUpdateTemplateMutation({
        update(cache, { data }) {
            if (!data?.updateTemplate) return;

            const existingData = cache.readQuery<Types.TemplateCategoriesQuery>({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
            });

            if (!existingData?.templateCategories?.data) return;

            const updatedCategories = existingData.templateCategories.data.map((category) => {
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
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
                data: {
                    templateCategories: {
                        ...existingData.templateCategories,
                        data: updatedCategories,
                    },
                },
            });
        },
    });

    // Delete template mutation
    const [mutateDelete] = Types.useDeleteTemplateMutation({
        update(cache, { data }) {
            if (!data?.deleteTemplate) return;

            const existingData = cache.readQuery<Types.TemplateCategoriesQuery>({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
            });

            if (!existingData?.templateCategories?.data) return;

            const updatedCategories = existingData.templateCategories.data.map((category) => {
                const templates = category.templates || [];
                return {
                    ...category,
                    templates: templates.filter(
                        (template) => template.id !== data.deleteTemplate.id,
                    ),
                };
            });

            cache.writeQuery({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
                data: {
                    templateCategories: {
                        ...existingData.templateCategories,
                        data: updatedCategories,
                    },
                },
            });
        },
    });

    // Move to deletion category mutation
    const [mutateMoveToDelete] = Types.useMoveTemplateToDeletionCategoryMutation({
        update(cache, { data }) {
            if (!data?.moveTemplateToDeletionCategory) return;

            const existingData = cache.readQuery<Types.TemplateCategoriesQuery>({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
            });

            if (!existingData?.templateCategories?.data) return;

            const updatedCategories = existingData.templateCategories.data.map((category) => {
                const templates = category.templates || [];
                if (category.special_type === "deletion") {
                    return {
                        ...category,
                        templates: [...templates, data.moveTemplateToDeletionCategory],
                    };
                }
                return {
                    ...category,
                    templates: templates.filter(
                        (template) => template.id !== data.moveTemplateToDeletionCategory.id,
                    ),
                };
            });

            cache.writeQuery({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
                data: {
                    templateCategories: {
                        ...existingData.templateCategories,
                        data: updatedCategories,
                    },
                },
            });
        },
    });

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

    const contextValue: TemplateGraphQLContextType = {
        createTemplateMutation,
        updateTemplateMutation,
        deleteTemplateMutation,
        moveTemplateToDeletionCategoryMutation,
    };

    return (
        <TemplateGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateGraphQLContext.Provider>
    );
};
